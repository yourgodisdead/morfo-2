// ============================================================
//  MORFO PORTAL - Firebase Database Layer (db.js) (Unified)
//  Reemplaza toda la gestion de usuarios en localStorage
//  con Firestore (base de datos en la nube de Firebase).
// ============================================================

// Inicializar Firebase con la configuracion del proyecto
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateEmail,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    serverTimestamp,
    arrayUnion,
    increment,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- App init ---
const firebaseApp = initializeApp(FIREBASE_CONFIG);
const firebaseAuth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// ============================================================
//  USER MANAGEMENT
// ============================================================

/**
 * Obtener todos los usuarios de Firestore (solo superusuario)
 * @returns {Promise<Array>} lista de usuarios
 */
async function db_getAllUsers() {
    const snap = await getDocs(collection(db, "users"));
    const users = [];
    snap.forEach(docSnap => {
        users.push({ _id: docSnap.id, ...docSnap.data() });
    });
    return users;
}

/**
 * Obtener un usuario por email
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
async function db_getUserByEmail(email) {
    const docRef = doc(db, "users", email.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { _id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

/**
 * Crear un nuevo usuario en Firestore (desde el panel del superusuario)
 * @param {Object} userData - datos del nuevo usuario
 * @returns {Promise<void>}
 */
async function db_createUser(userData) {
    // Strict: role siempre "usuario" salvo que sea el superusuario
    const isSuper = userData.email.toLowerCase() === "lams210488@gmail.com";
    const safeRole = isSuper ? "superuser" : (userData.role === "superuser" ? "usuario" : (userData.role || "usuario"));
    const isVip = isSuper ? true : (userData.isVip === true);
    const userDoc = {
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email.toLowerCase(),
        stateOrigin: userData.stateOrigin || "",
        enrollmentYear: userData.enrollmentYear || "",
        currentYear: userData.currentYear || "",
        password: userData.password || "",
        role: safeRole,
        isVip: isVip,
        photo: userData.photo || "",
        activeSessionToken: null,
        activityLog: {
            aiChats: [],
            downloads: [],
            navigation: [{ section: "inicio", name: "Inicio", timestamp: new Date().toISOString() }],
            notes: []
        },
        createdAt: serverTimestamp()
    };
    await setDoc(doc(db, "users", userData.email.toLowerCase()), userDoc);
}

/**
 * Actualizar datos de un usuario en Firestore
 * @param {string} email - identificador del usuario
 * @param {Object} updates - campos a actualizar
 * @returns {Promise<void>}
 */
async function db_updateUser(email, updates) {
    const docRef = doc(db, "users", email.toLowerCase());
    await updateDoc(docRef, updates);
}

/**
 * Alternar el status de Insignia VIP de un usuario (solo superusuario)
 * @param {string} email
 * @param {boolean} currentVipStatus
 * @returns {Promise<boolean>}
 */
async function db_toggleUserVip(email, currentVipStatus) {
    const newStatus = !currentVipStatus;
    await db_updateUser(email, { isVip: newStatus });
    return newStatus;
}

/**
 * Eliminar un usuario de Firestore
 * @param {string} email
 * @returns {Promise<void>}
 */
async function db_deleteUser(email) {
    await deleteDoc(doc(db, "users", email.toLowerCase()));
}

// ============================================================
//  SESSION MANAGEMENT
// ============================================================

/**
 * Login con Firebase Auth
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} user data de Firestore
 */
async function db_login(email, password) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPass = (password || "").trim();
    const userDoc = await db_getUserByEmail(cleanEmail);
    if (!userDoc) throw new Error("Usuario no registrado en la base de datos.");
    const userPass = (userDoc.password || "").trim();
    if (userPass !== cleanPass) throw new Error("Contraseña incorrecta. Verifica tus datos.");
    return userDoc;
}

/**
 * Guardar token de sesion en Firestore para control multi-dispositivo
 * @param {string} email
 * @param {string} token
 */
async function db_saveSessionToken(email, token) {
    await db_updateUser(email, { activeSessionToken: token });
}

/**
 * Limpiar token de sesion al cerrar sesion
 * @param {string} email
 */
async function db_clearSessionToken(email) {
    await db_updateUser(email, { activeSessionToken: null });
}

/**
 * Obtener el token de sesion activo de un usuario
 * @param {string} email
 * @returns {Promise<string|null>}
 */
async function db_getSessionToken(email) {
    const user = await db_getUserByEmail(email);
    return user ? (user.activeSessionToken || null) : null;
}

// ============================================================
//  ACTIVITY TRACKING
// ============================================================

/**
 * Registrar actividad de navegacion
 * @param {string} email
 * @param {Object} entry - { section, name }
 */
async function db_trackNavigation(email, entry) {
    try {
        const userRef = doc(db, "users", email.toLowerCase());
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const log = data.activityLog || {};
        const nav = log.navigation || [];
        nav.unshift({ ...entry, timestamp: new Date().toISOString() });
        if (nav.length > 60) nav.pop();
        await updateDoc(userRef, { "activityLog.navigation": nav });
    } catch (e) {
        console.warn("db_trackNavigation error:", e);
    }
}

/**
 * Registrar descarga de archivo
 * @param {string} email
 * @param {Object} entry - { filename, type }
 */
async function db_trackDownload(email, entry) {
    try {
        const userRef = doc(db, "users", email.toLowerCase());
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const log = data.activityLog || {};
        const downloads = log.downloads || [];
        const existing = downloads.find(d => d.filename === entry.filename);
        if (existing) {
            existing.count = (existing.count || 1) + 1;
            existing.lastDate = new Date().toISOString();
        } else {
            downloads.unshift({ ...entry, count: 1, lastDate: new Date().toISOString() });
        }
        await updateDoc(userRef, { "activityLog.downloads": downloads });
    } catch (e) {
        console.warn("db_trackDownload error:", e);
    }
}

/**
 * Registrar consulta al asistente IA
 * @param {string} email
 * @param {Object} entry - { query, reply, topic }
 */
async function db_trackAiChat(email, entry) {
    try {
        const userRef = doc(db, "users", email.toLowerCase());
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const log = data.activityLog || {};
        const chats = log.aiChats || [];
        chats.unshift({ ...entry, timestamp: new Date().toISOString() });
        if (chats.length > 100) chats.pop();
        await updateDoc(userRef, { "activityLog.aiChats": chats });
    } catch (e) {
        console.warn("db_trackAiChat error:", e);
    }
}

/**
 * Registrar nota de semana guardada
 * @param {string} email
 * @param {Object} entry - { week }
 */
async function db_trackNote(email, entry) {
    try {
        const userRef = doc(db, "users", email.toLowerCase());
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const data = userSnap.data();
        const log = data.activityLog || {};
        const notes = log.notes || [];
        const existing = notes.find(n => n.week === entry.week);
        if (existing) {
            existing.lastUpdated = new Date().toISOString();
        } else {
            notes.unshift({ ...entry, lastUpdated: new Date().toISOString() });
        }
        await updateDoc(userRef, { "activityLog.notes": notes });
    } catch (e) {
        console.warn("db_trackNote error:", e);
    }
}

// ============================================================
//  SUPERUSUARIO INICIAL (seed si no existe)
// ============================================================
async function db_ensureSuperuser() {
    const superEmail = "lams210488@gmail.com";
    const existing = await db_getUserByEmail(superEmail);
    if (!existing) {
        await db_createUser({
            name: "Leonardo Morales",
            email: superEmail,
            password: "bazzinga123",
            phone: "+584129031966",
            stateOrigin: "Distrito Capital",
            enrollmentYear: "2020",
            currentYear: "Docente / Superusuario",
            role: "superuser",
            isVip: true,
            photo: ""
        });
        console.log("[Morfo DB] Superusuario creado en Firestore.");
    } else if (existing.isVip !== true) {
        await db_updateUser(superEmail, { isVip: true });
    }
}

// Exportar funciones
export {
    db_getAllUsers,
    db_getUserByEmail,
    db_createUser,
    db_updateUser,
    db_toggleUserVip,
    db_deleteUser,
    db_login,
    db_saveSessionToken,
    db_clearSessionToken,
    db_getSessionToken,
    db_trackNavigation,
    db_trackDownload,
    db_trackAiChat,
    db_trackNote,
    db_ensureSuperuser
};
