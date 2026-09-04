// Morfofisiología Humana II - Application Logic (Single Page Application Controller)
// Firebase-powered: Firestore replaces localStorage for user management

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Initialize Firebase using config from firebase_config.js (loaded before this module)
const _fbApp = initializeApp(FIREBASE_CONFIG);
const _db = getFirestore(_fbApp);
const _res = (p) => (typeof window !== "undefined" && window.resolveMediaUrl ? window.resolveMediaUrl(p) : p);

// ============================================================
//  FIREBASE DATABASE HELPERS  (replace all localStorage calls)
// ============================================================

async function db_getAllUsers() {
    const snap = await getDocs(collection(_db, "users"));
    const users = [];
    snap.forEach(ds => users.push({ _id: ds.id, ...ds.data() }));
    return users;
}

async function db_getUserByEmail(email) {
    const ds = await getDoc(doc(_db, "users", email.toLowerCase()));
    return ds.exists() ? { _id: ds.id, ...ds.data() } : null;
}

async function db_createUser(u) {
    const safeRole = u.email === "lams210488@gmail.com" ? "superuser" : "usuario";
    const data = {
        name: u.name || "",
        phone: u.phone || "",
        email: u.email.toLowerCase(),
        stateOrigin: u.stateOrigin || "",
        enrollmentYear: u.enrollmentYear || "",
        currentYear: u.currentYear || "",
        password: u.password || "",
        role: safeRole,
        photo: u.photo || "",
        activeSessionToken: null,
        activityLog: {
            aiChats: [],
            downloads: [],
            navigation: [{ section: "inicio", name: "Inicio", timestamp: new Date().toISOString() }],
            notes: []
        },
        createdAt: serverTimestamp()
    };
    await setDoc(doc(_db, "users", u.email.toLowerCase()), data);
    return data;
}

async function db_updateUser(email, updates) {
    await updateDoc(doc(_db, "users", email.toLowerCase()), updates);
}

async function db_toggleUserVip(email, currentVipStatus) {
    const newStatus = !currentVipStatus;
    await db_updateUser(email, { isVip: newStatus });
    return newStatus;
}

async function db_deleteUser(email) {
    await deleteDoc(doc(_db, "users", email.toLowerCase()));
}

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
            photo: ""
        });
        console.log("[Morfo2] Superusuario creado en Firestore.");
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    // Ensure superuser exists in Firestore on first load
    try { await db_ensureSuperuser(); } catch(e) { console.warn("db_ensureSuperuser:", e); }

    // Venezuela 24 Federal Entities Geographic Data
    const VENEZUELA_STATES_DATA = {
        "Amazonas": { lat: 5.6639, lng: -67.6236, capital: "Puerto Ayacucho" },
        "Anzoátegui": { lat: 10.1362, lng: -64.6862, capital: "Barcelona" },
        "Apure": { lat: 7.8939, lng: -67.4724, capital: "San Fernando de Apure" },
        "Aragua": { lat: 10.2469, lng: -67.5958, capital: "Maracay" },
        "Barinas": { lat: 8.6226, lng: -70.2075, capital: "Barinas" },
        "Bolívar": { lat: 8.1292, lng: -63.5408, capital: "Ciudad Bolívar" },
        "Carabobo": { lat: 10.1800, lng: -68.0039, capital: "Valencia" },
        "Cojedes": { lat: 9.6612, lng: -68.5828, capital: "San Carlos" },
        "Delta Amacuro": { lat: 9.0622, lng: -62.0511, capital: "Tucupita" },
        "Distrito Capital": { lat: 10.4806, lng: -66.9036, capital: "Caracas" },
        "Falcón": { lat: 11.4045, lng: -69.6734, capital: "Coro" },
        "Guárico": { lat: 9.9115, lng: -67.3538, capital: "San Juan de los Morros" },
        "Lara": { lat: 10.0678, lng: -69.3474, capital: "Barquisimeto" },
        "Mérida": { lat: 8.5983, lng: -71.1450, capital: "Mérida" },
        "Miranda": { lat: 10.3445, lng: -67.0433, capital: "Los Teques" },
        "Monagas": { lat: 9.7457, lng: -63.1832, capital: "Maturín" },
        "Nueva Esparta": { lat: 11.0333, lng: -63.8628, capital: "La Asunción" },
        "Portuguesa": { lat: 9.0418, lng: -69.7421, capital: "Guanare" },
        "Sucre": { lat: 10.4539, lng: -64.1826, capital: "Cumaná" },
        "Táchira": { lat: 7.7669, lng: -72.2250, capital: "San Cristóbal" },
        "Trujillo": { lat: 9.3708, lng: -70.4350, capital: "Trujillo" },
        "La Guaira (Vargas)": { lat: 10.6014, lng: -66.9328, capital: "La Guaira" },
        "Yaracuy": { lat: 10.3399, lng: -68.7425, capital: "San Felipe" },
        "Zulia": { lat: 10.6427, lng: -71.6125, capital: "Maracaibo" },
        "Dependencias Federales": { lat: 11.8575, lng: -66.7583, capital: "Los Roques" }
    };

    // Nota: La base de datos de usuarios vive en Firebase Firestore.
    // Las funciones db_* (db_getAllUsers, db_getUserByEmail, etc.) gestionan
    // todas las operaciones de lectura y escritura de usuarios de forma asíncrona.


    // Current application state
    const state = {
        currentSection: "inicio",
        currentWeek: 1,
        currentWeekTab: "orientacion",
        currentAO: 1,
        aoSearch: "",
        aoTab: "pdf",
        aoVideoSource: "drive",
        currentLaminarioTab: "histologico",
        laminarioSearch: "",
        currentLaminarioFilter: "todos",
        currentAtlasPage: 1,
        atlasSearch: "",
        theme: localStorage.getItem("morfo2_theme") || "dark",
        currentUser: null,
        gisMap: null,
        gisMarkersLayer: null,
        gisFilterState: "todos",
        gisFilterYear: "todos",
        gisSearchQuery: "",
        currentDeepUser: null
    };

    // Apply saved theme on startup
    document.documentElement.setAttribute("data-theme", state.theme);

    // ==========================================
    // VIP BADGE & ACCESS CONTROL HELPERS
    // ==========================================
    function isUserVip() {
        if (!state.currentUser) return false;
        // Solo el superusuario tiene acceso VIP automático
        if (state.currentUser.role === "superuser" || state.currentUser.email === "lams210488@gmail.com") return true;
        // Cualquier otro usuario (estudiantes, docentes, etc.) requiere que el superusuario le haya otorgado isVip: true
        return state.currentUser.isVip === true;
    }

    function showVipPaywallModal(resourceName = "este material de estudio") {
        const modal = document.getElementById("vipPaywallModal");
        if (!modal) return;
        const info = document.getElementById("vipModalResourceInfo");
        if (info) {
            info.innerHTML = `Para visualizar o descargar <strong>${resourceName}</strong> necesitas tu <strong>Insignia VIP activa</strong>.`;
        }
        const userEmail = state.currentUser ? state.currentUser.email : "";
        const userName = state.currentUser ? (state.currentUser.name || "") : "";
        const whatsappBtn = document.getElementById("vipWhatsappBtn");
        if (whatsappBtn) {
            const msg = encodeURIComponent(`Hola profesor Leonardo, deseo solicitar mi Insignia VIP en el Portal Morfo por 1$ a tasa BCV para desbloquear clases orientadoras, descargas y biblioteca médica.\n\n👤 Estudiante: ${userName}\n📧 Correo: ${userEmail}`);
            whatsappBtn.href = `https://wa.me/584129031966?text=${msg}`;
        }
        modal.style.display = "flex";
    }

    function closeVipPaywallModal() {
        const modal = document.getElementById("vipPaywallModal");
        if (modal) modal.style.display = "none";
    }

    // DOM Elements
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".content-section");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    
    // Lightbox Elements
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxTitle = document.getElementById("lightboxTitle");
    const lightboxDetails = document.getElementById("lightboxDetails");
    const lightboxClose = document.getElementById("lightboxClose");

    // Authentication DOM Elements
    const loginOverlay = document.getElementById("loginOverlay");
    const loginForm = document.getElementById("loginForm");
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginError = document.getElementById("loginError");

    // Sidebar User Header Elements
    const userSidebarProfile = document.getElementById("userSidebarProfile");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarUsername = document.getElementById("sidebarUsername");
    const sidebarRole = document.getElementById("sidebarRole");
    const logoutBtn = document.getElementById("logoutBtn");
    const navProfile = document.getElementById("navProfile");
    const navAdmin = document.getElementById("navAdmin");

    // Update UI elements for theme
    updateThemeToggleUI();

    // Initialize App Modules
    initAuth();
    initNavigation();
    initThemeToggle();
    initInicioTabs();
    initWeekSelector();
    initOrientadoras();
    initLaminarios();
    initHabilidades();
    initLightbox();
    initProfile();
    initAdmin();
    initGisMap();
    initAiTutor();
    initDeepInfoModal();
    initProfileCompleteness();
    initPasswordToggles();

    // Default Load
    showSection(state.currentSection);
    loadWeek(state.currentWeek);

    // ==========================================
    // NAVIGATION & THEME SECTIONS
    // ==========================================

    function initNavigation() {
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const sectionId = item.getAttribute("data-section");
                showSection(sectionId);
            });
        });
    }

    function showSection(sectionId) {
        state.currentSection = sectionId;
        
        // Update active sidebar nav
        navItems.forEach(item => {
            if (item.getAttribute("data-section") === sectionId) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        // Toggle active main sections
        sections.forEach(section => {
            if (section.id === sectionId + "Section") {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }
        });

        // Telemetry Navigation Logging
        const sectionTitles = {
            "inicio": "Inicio y Objetivos",
            "temario": "Temario y Plan Calendario",
            "orientadoras": "Clases Orientadoras (PDFs)",
            "laminarios": "Laminarios y Atlas Histológico",
            "habilidades": "Habilidades Médicas",
            "consejos": "Consejos de Estudio",
            "evaluacion": "Sistema de Evaluación",
            "bibliografia": "Bibliografía y Recursos",
            "creditos": "Créditos y Autoría",
            "perfil": "Mi Perfil de Estudiante",
            "admin": "Panel de Administración y GIS"
        };
        trackUserActivity("navigation", {
            section: sectionId,
            name: sectionTitles[sectionId] || sectionId
        });

        // Trigger section specific initializations if needed
        if (sectionId === "orientadoras") {
            renderOrientadoras();
        } else if (sectionId === "laminarios" || sectionId === "atlas") {
            renderLaminarios();
        } else if (sectionId === "perfil") {
            renderProfile();
        } else if (sectionId === "admin") {
            renderAdmin();
            renderGisMap();
        }
    }

    function initThemeToggle() {
        themeToggleBtn.addEventListener("click", () => {
            state.theme = (state.theme === "dark") ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", state.theme);
            localStorage.setItem("morfo2_theme", state.theme);
            updateThemeToggleUI();
        });
    }

    function updateThemeToggleUI() {
        const textSpan = themeToggleBtn.querySelector(".theme-text");
        const iconSpan = themeToggleBtn.querySelector(".theme-icon");
        
        if (state.theme === "light") {
            textSpan.textContent = "Modo Oscuro";
            iconSpan.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"/></svg>
            `;
        } else {
            textSpan.textContent = "Modo Claro";
            iconSpan.innerHTML = `
                <svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 12h2m16 0h2M12 2v2m0 16v2m-6.4-15.6l1.4 1.4m9.9 9.9l1.4 1.4M5.6 18.4l1.4-1.4m9.9-9.9l1.4-1.4"/></svg>
            `;
        }
    }

    // ==========================================
    // INICIO / PRESENTATION SECTION
    // ==========================================

    function initInicioTabs() {
        const tabBtns = document.querySelectorAll("#inicioSection .tab-btn");
        const panels = document.querySelectorAll("#inicioSection .tab-panel");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetPanelId = btn.getAttribute("data-tab");
                
                // Toggle Buttons active state
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                // Toggle Panels active state
                panels.forEach(p => {
                    if (p.id === targetPanelId + "Panel") {
                        p.classList.add("active");
                        renderStaticPage(targetPanelId, p);
                    } else {
                        p.classList.remove("active");
                    }
                });
            });
        });

        // Render default active panel (objetivos)
        const defaultActivePanel = document.querySelector("#inicioSection .tab-panel.active");
        if (defaultActivePanel) {
            renderStaticPage("objetivos", defaultActivePanel);
        }
    }

    function renderStaticPage(pageKey, container) {
        if (typeof STATIC_PAGES_DATA !== "undefined" && STATIC_PAGES_DATA[pageKey]) {
            // Clean up old Dreamweaver template paths and styles if needed
            let cleanHtml = STATIC_PAGES_DATA[pageKey]
                .replace(/href="..\/morfo2\/estilos/g, 'href="morfo2')
                .replace(/href="..\/..\/..\/htm/g, 'href="javascript:void(0)"') // disable old relative popup links
                .replace(/href=javascript:MostrarPopup\('[^']+',\d+\/\d+,\d+\)/g, 'href="javascript:void(0)"')
                .replace(/class="celdaseleccionadanegra"/g, 'class="tab-btn active"')
                .replace(/class="celdanormalazul"/g, 'class="tab-btn"');
            container.innerHTML = `<div class="reading-pane">${cleanHtml}</div>`;
        } else {
            container.innerHTML = `<p class="reading-pane text-muted">Contenido no cargado. Revisa static_pages_data.js</p>`;
        }
    }

    // ==========================================
    // TEMARIO SEMANAL / 12 WEEKS SECTION
    // ==========================================

    function initWeekSelector() {
        const selectorContainer = document.getElementById("weekSelectorSidebar");
        
        // Generate list of 12 weeks
        selectorContainer.innerHTML = "";
        for (let w = 1; w <= 12; w++) {
            const item = document.createElement("div");
            item.className = `week-selector-item ${w === state.currentWeek ? 'active' : ''}`;
            item.setAttribute("data-week", w);
            
            // Determine tema
            const temaName = (w <= 2) ? "Tema I" : "Tema II";
            
            item.innerHTML = `
                <span>Semana ${w}</span>
                <span class="week-badge">${temaName}</span>
            `;
            
            item.addEventListener("click", () => {
                document.querySelectorAll(".week-selector-item").forEach(el => el.classList.remove("active"));
                item.classList.add("active");
                loadWeek(w);
            });
            
            selectorContainer.appendChild(item);
        }

        // Initialize week workspace sub-tabs
        const weekTabBtns = document.querySelectorAll("#weekWorkspace .tab-btn");
        weekTabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                state.currentWeekTab = btn.getAttribute("data-tab");
                weekTabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                renderWeekTabContent();
            });
        });
    }

    function loadWeek(weekNum) {
        state.currentWeek = weekNum;
        document.getElementById("workspaceTitle").textContent = `Semana ${weekNum} - Recursos de Estudio`;
        renderWeekTabContent();
    }

    function getPdfUrl(weekNum, type, filename) {
        // Construct standard file paths relative to workspace root
        const tema = (weekNum <= 2) ? "tema1" : "tema2";
        const semWord = (weekNum <= 2) ? "semana" : "Semana";
        return `morfo2/contenidos/${tema}/material/${semWord} ${weekNum}/${filename}`;
    }

    function renderWeekTabContent() {
        const contentContainer = document.getElementById("weekTabContent");
        
        if (typeof MORFO_DATA === "undefined" || !MORFO_DATA[state.currentWeek]) {
            contentContainer.innerHTML = `<p class="text-muted">No hay datos disponibles para la Semana ${state.currentWeek}.</p>`;
            return;
        }

        const weekObj = MORFO_DATA[state.currentWeek];
        const tab = state.currentWeekTab;
        
        if (tab === "orientacion") {
            if (weekObj.orientaciones && weekObj.orientaciones.length > 0) {
                const combinedPages = weekObj.orientaciones.map(o => o.pages.join("\n\n")).join("\n\n");
                contentContainer.innerHTML = formatPedagogicalReading(combinedPages, `Guía de Orientación al Contenido - Semana ${state.currentWeek}`, "🧭");
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de orientación para esta semana.</p>`;
            }
        } 
        else if (tab === "practica") {
            if (weekObj.practicas && weekObj.practicas.length > 0) {
                const combinedPages = weekObj.practicas.map(p => p.pages.join("\n\n")).join("\n\n");
                contentContainer.innerHTML = formatPedagogicalReading(combinedPages, `Guía de Práctica Docente y Comunitaria - Semana ${state.currentWeek}`, "🩺");
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de práctica docente para esta semana.</p>`;
            }
        } 
        else if (tab === "consolidacion") {
            if (weekObj.consolidaciones && weekObj.consolidaciones.length > 0) {
                let html = `
                    <div class="info-banner-card" style="margin-bottom: 24px;">
                        <div class="banner-icon-badge">📝</div>
                        <div class="banner-text-content">
                            <h3 class="banner-title">Ejercicios de Consolidación y Autoaprendizaje - Semana ${state.currentWeek}</h3>
                            <p class="banner-desc">Resuelve las siguientes preguntas de razonamiento morfofuncional y casos clínicos. Tus respuestas y apuntes se guardan automáticamente en tu navegador.</p>
                        </div>
                    </div>
                `;
                
                let combinedText = weekObj.consolidaciones[0].pages.join("\n");
                let lines = combinedText.split("\n");
                let questions = [];
                let currentQuestion = "";
                
                lines.forEach(line => {
                    line = line.trim();
                    if (/^\d+\.\s+/.test(line)) {
                        if (currentQuestion) questions.push(currentQuestion);
                        currentQuestion = line;
                    } else if (currentQuestion && line) {
                        currentQuestion += " " + line;
                    }
                });
                if (currentQuestion) questions.push(currentQuestion);
                
                if (questions.length > 0) {
                    questions.forEach((qText, index) => {
                        const localStorageKey = `morfo2_notes_w${state.currentWeek}_q${index}`;
                        const savedNote = localStorage.getItem(localStorageKey) || "";
                        
                        html += `
                            <div class="learning-card" style="margin-bottom: 20px;">
                                <div class="learning-card-header">
                                    <span class="ao-badge">Pregunta ${index + 1}</span>
                                    <span class="mag-badge">Autoevaluación</span>
                                </div>
                                <div class="learning-card-title" style="font-size: 1.05rem; line-height: 1.5; color: var(--text-primary);">
                                    ${qText}
                                </div>
                                <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                                    <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Tus apuntes y respuesta razonada:</label>
                                    <textarea class="notes-area" data-key="${localStorageKey}" placeholder="Escribe tu razonamiento médico o conclusiones aquí...">${savedNote}</textarea>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    html += `<div class="reading-pane">${combinedText.split("\n").map(l => l.trim() ? `<p>${l}</p>` : "").join("")}</div>`;
                    
                    const localStorageKey = `morfo2_notes_w${state.currentWeek}_general`;
                    const savedNote = localStorage.getItem(localStorageKey) || "";
                    html += `
                        <div class="learning-card">
                            <div class="learning-card-title">Cuaderno de Estudio de la Semana ${state.currentWeek}</div>
                            <textarea class="notes-area" data-key="${localStorageKey}" placeholder="Anota tus conclusiones o respuestas para esta semana...">${savedNote}</textarea>
                        </div>
                    `;
                }
                
                contentContainer.innerHTML = html;
                
                // Add event listeners to textareas to autosave
                const textareas = contentContainer.querySelectorAll(".notes-area");
                textareas.forEach(textarea => {
                    textarea.addEventListener("input", function() {
                        const key = textarea.getAttribute("data-key");
                        localStorage.setItem(key, textarea.value);
                    });
                });
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de consolidación para esta semana.</p>`;
            }
        } 
        else if (tab === "pdf") {
            let html = `
                <h2>Materiales Oficiales de Descarga</h2>
                <p style="margin-bottom: 24px;">Descarga los documentos oficiales de la asignatura: Clases Orientadoras de la semana y Guías de Estudio del CD de Medicina de segundo año:</p>
                <div class="downloads-container">
            `;

            // Add corresponding Clases Orientadoras (AO) for this week
            if (typeof CLASES_ORIENTADORAS_DATA !== "undefined") {
                const weekAos = CLASES_ORIENTADORAS_DATA.filter(ao => ao.week === state.currentWeek);
                weekAos.forEach(ao => {
                    html += `
                        <a href="${_res(ao.pdfFile)}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.22)); border-color: var(--accent-color); color: var(--accent-hover);">
                            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
                            <span>${ao.ao}: ${ao.title} (Clase Orientadora)</span>
                        </a>
                        ${ao.slidesFile ? `
                        <a href="${_res(ao.slidesFile)}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(99, 102, 241, 0.08)); border-color: rgba(139, 92, 246, 0.4); color: var(--accent-hover);">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                            <span>${ao.ao}: Diapositiva Explicativa</span>
                        </a>` : ''}
                    `;
                });
            }
            
            // Add Orientación files
            if (weekObj.orientaciones) {
                weekObj.orientaciones.forEach(doc => {
                    const url = getPdfUrl(state.currentWeek, "orientaciones", doc.filename);
                    html += `
                        <a href="${url}" target="_blank" class="download-btn">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>${doc.filename} (Guía de Orientación)</span>
                        </a>
                    `;
                });
            }
            
            // Add Práctica files
            if (weekObj.practicas) {
                weekObj.practicas.forEach(doc => {
                    const url = getPdfUrl(state.currentWeek, "practicas", doc.filename);
                    html += `
                        <a href="${url}" target="_blank" class="download-btn">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>${doc.filename} (Clase Práctica)</span>
                        </a>
                    `;
                });
            }

            // Add Consolidación files
            if (weekObj.consolidaciones) {
                weekObj.consolidaciones.forEach(doc => {
                    const url = getPdfUrl(state.currentWeek, "consolidaciones", doc.filename);
                    html += `
                        <a href="${url}" target="_blank" class="download-btn">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>${doc.filename} (Cuestionario)</span>
                        </a>
                    `;
                });
            }
            
            html += `</div>`;
            contentContainer.innerHTML = html;

            // Telemetry hook on downloads with VIP Protection
            contentContainer.querySelectorAll(".download-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    const text = btn.textContent.trim();
                    if (!isUserVip()) {
                        e.preventDefault();
                        showVipPaywallModal(text || "Materiales de Descarga Semanal");
                        return;
                    }
                    trackUserActivity("download", {
                        filename: text,
                        type: "Material Semanal"
                    });
                });
            });
        }
    }

    function formatPedagogicalReading(rawText, title, icon) {
        if (!rawText) return `<p class="text-muted">Sin contenido disponible.</p>`;

        // Clean up repeated OCR header strings
        let clean = rawText
            .replace(/MORFOFISIOLOGÍA HUMANA II, ORIENTACIONES AL CONTENIDO/gi, "")
            .replace(/MORFOFISIOLOGÍA HUMANA II/gi, "")
            .replace(/Semana \d+\.?\s*Actividad orientadora \d+\.?/gi, "")
            .replace(/Tema \d+:?[^\n]*/gi, "");

        // Split text into paragraphs
        const paragraphs = clean.split("\n\n").map(p => p.trim()).filter(p => p.length > 0);

        let html = `
            <div class="static-content-wrapper">
                <div class="info-banner-card">
                    <div class="banner-icon-badge">${icon || "📖"}</div>
                    <div class="banner-text-content">
                        <h3 class="banner-title">${title}</h3>
                        <p class="banner-desc">Material formativo oficial estructurado para el aprendizaje activo del estudiante de medicina.</p>
                    </div>
                </div>
        `;

        paragraphs.forEach(p => {
            let text = p.replace(/\n\s*/g, " ").trim();
            if (!text) return;

            // Check if paragraph is Objectives section
            if (/^objetivos/i.test(text)) {
                html += `
                    <div class="section-title-group" style="margin-top: 24px;">
                        <span class="section-subtitle-tag">Guía de Aprendizaje</span>
                        <h3 class="section-main-heading">🎯 Objetivos de la Semana</h3>
                    </div>
                `;
                return;
            }

            // Check if paragraph is Contents section
            if (/^contenidos/i.test(text)) {
                html += `
                    <div class="section-title-group" style="margin-top: 24px;">
                        <span class="section-subtitle-tag">Estructura Temática</span>
                        <h3 class="section-main-heading">📑 Contenidos Nucleares</h3>
                    </div>
                `;
                return;
            }

            // Check if paragraph is Orientaciones al contenido
            if (/^orientaciones al contenido/i.test(text)) {
                html += `
                    <div class="section-title-group" style="margin-top: 24px;">
                        <span class="section-subtitle-tag">Desarrollo Teórico-Práctico</span>
                        <h3 class="section-main-heading">🧠 Orientaciones al Contenido</h3>
                    </div>
                `;
                return;
            }

            // Check if numbered objective / point: "1. Describir...", "2. Explicar..."
            if (/^\d+\.\s+/.test(text)) {
                const match = text.match(/^(\d+)\.\s+(.*)/);
                if (match) {
                    html += `
                        <div class="roadmap-item">
                            <div class="roadmap-num">${match[1]}</div>
                            <div class="roadmap-body">${match[2]}</div>
                        </div>
                    `;
                    return;
                }
            }

            // Check if bullet point with bullet symbol (• or 9 or -)
            if (/^[•\-9]\s+/.test(text) || text.includes("•")) {
                let bulletLines = text.split(/[•]\s*/).filter(b => b.trim().length > 0);
                bulletLines.forEach(bLine => {
                    let cleanedB = bLine.replace(/^[9\-]\s+/, "").trim();
                    if (cleanedB) {
                        if (cleanedB.toLowerCase().includes("laminario virtual") || cleanedB.toLowerCase().includes("te recomendamos") || cleanedB.toLowerCase().includes("consulta el texto")) {
                            html += `
                                <div class="study-callout-box info" style="margin-bottom: 12px;">
                                    <div class="callout-icon">💡</div>
                                    <div class="callout-content">
                                        <p>${cleanedB}</p>
                                    </div>
                                </div>
                            `;
                        } else {
                            html += `
                                <div class="weekly-bullet-card">
                                    📌 ${cleanedB}
                                </div>
                            `;
                        }
                    }
                });
                return;
            }

            // If it's a study recommendation / callout
            if (text.toLowerCase().includes("te sugerimos") || text.toLowerCase().includes("profundiza") || text.toLowerCase().includes("para facilitar tu estudio")) {
                html += `
                    <div class="study-callout-box info" style="margin-bottom: 16px;">
                        <div class="callout-icon">🔍</div>
                        <div class="callout-content">
                            <p>${text}</p>
                        </div>
                    </div>
                `;
                return;
            }

            // Check if section heading: like "Desarrollo embrionario del sistema nervioso.", "Tejido nervioso.", "Arco Reflejo."
            if (/^[A-ZÁÉÍÓÚ][a-zA-ZáéíóúÁÉÍÓÚñÑ\s,]{3,60}\.$/.test(text) && text.length < 70) {
                html += `
                    <div class="weekly-topic-header" style="margin-top: 28px; margin-bottom: 12px;">
                        <span class="weekly-topic-icon">🧬</span>
                        <h4 class="weekly-topic-heading">${text.replace(/\.$/, '')}</h4>
                    </div>
                `;
                return;
            }

            // Regular paragraph inside reading pane
            html += `<p class="reading-pane" style="font-size: 1.05rem; line-height: 1.75; margin-bottom: 1.25rem; text-align: justify;">${text}</p>`;
        });

        html += `</div>`;
        return html;
    }

    // ==========================================
    // CLASES ORIENTADORAS (AO 01 - AO 14) MODULE
    // ==========================================

    function initOrientadoras() {
        const searchInput = document.getElementById("aoSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", function() {
                state.aoSearch = searchInput.value.trim().toLowerCase();
                renderOrientadoras(state.currentAO);
            });
        }
    }

    function renderOrientadoras(selectedAoId = 1) {
        if (typeof CLASES_ORIENTADORAS_DATA === "undefined") return;

        state.currentAO = selectedAoId;
        const listContainer = document.getElementById("aoListContainer");
        const viewerContainer = document.getElementById("aoViewerContainer");
        if (!listContainer || !viewerContainer) return;

        listContainer.innerHTML = "";

        let filteredAos = CLASES_ORIENTADORAS_DATA;
        if (state.aoSearch) {
            filteredAos = CLASES_ORIENTADORAS_DATA.filter(ao => 
                ao.title.toLowerCase().includes(state.aoSearch) ||
                ao.ao.toLowerCase().includes(state.aoSearch) ||
                ao.theme.toLowerCase().includes(state.aoSearch) ||
                ao.description.toLowerCase().includes(state.aoSearch) ||
                ao.topics.some(t => t.toLowerCase().includes(state.aoSearch))
            );
        }

        if (filteredAos.length === 0) {
            listContainer.innerHTML = `<p class="text-muted" style="padding: 20px; text-align: center;">No se encontraron clases con "${state.aoSearch}".</p>`;
        } else {
            filteredAos.forEach(ao => {
                const card = document.createElement("div");
                card.className = `ao-card ${ao.id === state.currentAO ? 'active' : ''}`;
                card.innerHTML = `
                    <div class="ao-card-top">
                        <span class="ao-badge">${ao.ao}</span>
                        <span class="ao-week-tag">Semana ${ao.week}</span>
                    </div>
                    <div class="ao-card-title">${ao.title}</div>
                    <div class="ao-card-theme">${ao.theme}</div>
                `;

                card.addEventListener("click", () => {
                    state.currentAO = ao.id;
                    renderOrientadoras(ao.id);
                });

                listContainer.appendChild(card);
            });
        }

        // Render current selected AO in viewer
        const currentAoObj = CLASES_ORIENTADORAS_DATA.find(a => a.id === state.currentAO) || CLASES_ORIENTADORAS_DATA[0];
        if (currentAoObj) {
            let topicsHtml = currentAoObj.topics.map(t => `<span class="ao-topic-pill">📌 ${t}</span>`).join("");

            // Active resource mode (pdf | slides | video)
            const activeTab = state.aoTab || "pdf";
            const videoSrcMode = state.aoVideoSource || "local";

            let mediaContentHtml = "";
            let actionButtonsHtml = "";

            if (activeTab === "pdf") {
                actionButtonsHtml = `
                    <a href="${_res(currentAoObj.pdfFile)}" target="_blank" class="download-btn" style="background: var(--accent-gradient); color: white;">
                        <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                        <span>Abrir Documento en Pantalla Completa</span>
                    </a>
                    <a href="${_res(currentAoObj.pdfFile)}" download class="download-btn">
                        <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                        <span>Descargar PDF</span>
                    </a>
                `;
                mediaContentHtml = `
                    <div class="ao-pdf-frame-wrapper">
                        <iframe class="ao-pdf-frame" src="${_res(currentAoObj.pdfFile)}#toolbar=1&navpanes=0"></iframe>
                    </div>
                `;
            } else if (activeTab === "slides") {
                actionButtonsHtml = `
                    <a href="${_res(currentAoObj.slidesFile)}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.25)); border: 1px solid rgba(139, 92, 246, 0.45); color: #c4b5fd;">
                        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                        <span>Abrir Diapositivas en Pantalla Completa</span>
                    </a>
                    <a href="${_res(currentAoObj.slidesFile)}" download class="download-btn">
                        <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                        <span>Descargar Diapositivas</span>
                    </a>
                `;
                mediaContentHtml = `
                    <div class="ao-pdf-frame-wrapper">
                        <iframe class="ao-pdf-frame" src="${_res(currentAoObj.slidesFile)}#toolbar=1&navpanes=0"></iframe>
                    </div>
                `;
            } else if (activeTab === "video") {
                actionButtonsHtml = `
                    ${currentAoObj.videoDriveId ? `
                    <a href="https://drive.google.com/file/d/${currentAoObj.videoDriveId}/view?usp=sharing" target="_blank" class="download-btn" id="openDriveVideoBtn" style="background: var(--accent-gradient); color: white;">
                        <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                        <span>Abrir Video en Google Drive</span>
                    </a>` : ''}
                    ${currentAoObj.videoFile ? `
                    <a href="${currentAoObj.videoFile}" download class="download-btn" id="downloadVideoBtn">
                        <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                        <span>Descargar Video Local</span>
                    </a>` : ''}
                `;

                // Drive preview or Local HTML5 Player
                let playerHtml = "";
                if (videoSrcMode === "drive" && currentAoObj.videoDriveId) {
                    playerHtml = `
                        <div class="ao-video-frame-wrapper">
                            <iframe class="ao-video-iframe" src="https://drive.google.com/file/d/${currentAoObj.videoDriveId}/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>
                        </div>
                    `;
                } else {
                    playerHtml = `
                        ${videoSrcMode === "drive" && !currentAoObj.videoDriveId ? `
                            <div style="background: rgba(59, 130, 246, 0.12); border: 1px dashed rgba(59, 130, 246, 0.35); border-radius: 10px; padding: 12px 16px; margin-bottom: 12px; font-size: 0.85rem; color: #93c5fd; display: flex; align-items: center; gap: 10px;">
                                <span>☁️</span>
                                <span>El enlace de Drive aún no tiene ID configurado. Reproduciendo instantáneamente desde el archivo local en tu almacenamiento.</span>
                            </div>
                        ` : ''}
                        <div class="ao-video-frame-wrapper">
                            <video id="aoMainVideoPlayer" class="ao-video-player" controls preload="metadata" playsinline>
                                <source src="${currentAoObj.videoFile}" type="video/mp4">
                                Tu navegador no soporta el reproductor de video HTML5.
                            </video>
                        </div>
                    `;
                }

                mediaContentHtml = `
                    <div class="ao-video-toolbar">
                        <div class="ao-video-source-group">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-right: 4px;">Fuente de Reproducción:</span>
                            <button class="ao-pill-btn ${videoSrcMode === 'local' ? 'active' : ''}" data-video-source="local">💻 Archivo Local (Offline)</button>
                            <button class="ao-pill-btn ${videoSrcMode === 'drive' ? 'active' : ''}" data-video-source="drive">☁️ Google Drive (Nube)</button>
                        </div>
                        ${videoSrcMode === 'local' ? `
                        <div class="ao-video-speed-group">
                            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-right: 4px;">Velocidad:</span>
                            <button class="ao-pill-btn active" data-playback-rate="1">1x</button>
                            <button class="ao-pill-btn" data-playback-rate="1.25">1.25x</button>
                            <button class="ao-pill-btn" data-playback-rate="1.5">1.5x</button>
                            <button class="ao-pill-btn" data-playback-rate="2">2x</button>
                        </div>` : ''}
                    </div>
                    ${playerHtml}
                `;
            }

            viewerContainer.innerHTML = `
                <div class="ao-viewer-header">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                        <span class="ao-badge" style="font-size: 0.9rem; padding: 4px 12px;">${currentAoObj.ao} &bull; ${currentAoObj.theme}</span>
                        <span class="hero-tag" style="margin-bottom: 0;">Plan Semana ${currentAoObj.week}</span>
                    </div>
                    <h2 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; color: var(--text-primary); line-height: 1.3;">
                        ${currentAoObj.title}
                    </h2>
                    <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
                        ${currentAoObj.description}
                    </p>
                    <div class="ao-topics-container">
                        ${topicsHtml}
                    </div>

                    <!-- MULTIMEDIA RESOURCE SELECTOR TABS -->
                    <div class="ao-resource-tabs">
                        <button class="ao-res-tab ${activeTab === 'pdf' ? 'active' : ''}" data-ao-tab="pdf">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            <span>📄 Guía de Estudio (PDF)</span>
                        </button>
                        ${currentAoObj.slidesFile ? `
                        <button class="ao-res-tab ${activeTab === 'slides' ? 'active' : ''}" data-ao-tab="slides">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                            <span>📊 Diapositivas Explicativas</span>
                        </button>` : ''}
                        ${currentAoObj.videoFile || currentAoObj.videoDriveId ? `
                        <button class="ao-res-tab ${activeTab === 'video' ? 'active' : ''}" data-ao-tab="video">
                            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                            <span>🎥 Video Conferencia (MP4)</span>
                        </button>` : ''}
                    </div>

                    <div class="ao-viewer-actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${actionButtonsHtml}
                    </div>
                </div>

                ${mediaContentHtml}
            `;

            // Resource Tab Switching Handlers
            viewerContainer.querySelectorAll("[data-ao-tab]").forEach(tabBtn => {
                tabBtn.addEventListener("click", () => {
                    const chosenTab = tabBtn.getAttribute("data-ao-tab");
                    state.aoTab = chosenTab;
                    renderOrientadoras(state.currentAO);
                });
            });

            // Video Source Switching Handlers
            viewerContainer.querySelectorAll("[data-video-source]").forEach(srcBtn => {
                srcBtn.addEventListener("click", () => {
                    state.aoVideoSource = srcBtn.getAttribute("data-video-source");
                    renderOrientadoras(state.currentAO);
                });
            });

            // Video Speed Controls Handler
            const videoEl = document.getElementById("aoMainVideoPlayer");
            if (videoEl) {
                viewerContainer.querySelectorAll("[data-playback-rate]").forEach(speedBtn => {
                    speedBtn.addEventListener("click", () => {
                        const rate = parseFloat(speedBtn.getAttribute("data-playback-rate"));
                        videoEl.playbackRate = rate;
                        viewerContainer.querySelectorAll("[data-playback-rate]").forEach(b => b.classList.remove("active"));
                        speedBtn.classList.add("active");
                    });
                });

                // Telemetry on play
                videoEl.addEventListener("play", () => {
                    trackUserActivity("video_play", {
                        filename: currentAoObj.videoFile,
                        title: `${currentAoObj.ao} - ${currentAoObj.title}`
                    });
                }, { once: true });
            }

            // Telemetry hook & VIP Guard on AO downloads / videos
            viewerContainer.querySelectorAll(".download-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    if (!isUserVip()) {
                        e.preventDefault();
                        showVipPaywallModal(`${currentAoObj.ao}: ${currentAoObj.title}`);
                        return;
                    }
                    trackUserActivity("download", {
                        filename: `${currentAoObj.ao} - ${currentAoObj.title}`,
                        type: state.aoTab === 'video' ? "Video Conferencia" : "Clase Orientadora"
                    });
                });
            });
        }
    }

    // ==========================================
    // LAMINARIOS MÉDICOS & ATLAS (ENHANCED MODULE)
    // ==========================================

    function initLaminarios() {
        const tabBtns = document.querySelectorAll("[data-lam-tab]");
        const searchInput = document.getElementById("laminariosSearchInput");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-lam-tab");
                state.currentLaminarioTab = targetTab;
                state.currentLaminarioFilter = "todos";
                state.laminarioSearch = "";
                if (searchInput) searchInput.value = "";

                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                renderLaminarios();
            });
        });

        if (searchInput) {
            searchInput.addEventListener("input", function() {
                state.laminarioSearch = searchInput.value.trim().toLowerCase();
                renderLaminarios();
            });
        }
    }

    function renderLaminarios() {
        const grid = document.getElementById("laminariosGrid");
        const categoryFilters = document.getElementById("laminariosCategoryFilters");
        const pageSelector = document.getElementById("atlasPageSelector");
        if (!grid) return;

        grid.innerHTML = "";
        const tab = state.currentLaminarioTab;

        // Toggle pagination visibility
        if (tab === "atlas") {
            if (pageSelector) {
                pageSelector.style.display = "flex";
                renderAtlasPageSelector();
            }
            if (categoryFilters) categoryFilters.innerHTML = "";
        } else {
            if (pageSelector) pageSelector.style.display = "none";
        }

        // 1. LAMINARIO HISTOLÓGICO (44 Preparados)
        if (tab === "histologico") {
            if (typeof LAMINARIO_HISTOLOGICO_DATA === "undefined") {
                grid.innerHTML = `<p class="text-muted">Datos histológicos no cargados.</p>`;
                return;
            }

            // Build dynamic categories
            const rawCategories = Array.from(new Set(LAMINARIO_HISTOLOGICO_DATA.map(item => item.category)));
            renderCategoryFilters(["Todos", ...rawCategories]);

            let items = LAMINARIO_HISTOLOGICO_DATA;
            if (state.currentLaminarioFilter !== "todos") {
                items = items.filter(i => i.category.toLowerCase() === state.currentLaminarioFilter.toLowerCase());
            }
            if (state.laminarioSearch) {
                items = items.filter(i => 
                    i.title.toLowerCase().includes(state.laminarioSearch) ||
                    i.stain.toLowerCase().includes(state.laminarioSearch) ||
                    i.magnification.toLowerCase().includes(state.laminarioSearch) ||
                    i.category.toLowerCase().includes(state.laminarioSearch) ||
                    i.description.toLowerCase().includes(state.laminarioSearch)
                );
            }

            if (items.length === 0) {
                grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron láminas histológicas con los criterios de búsqueda.</p>`;
                return;
            }

            items.forEach(item => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${item.src}" alt="${item.title}" loading="lazy">
                        <div class="badge-tag-overlay">
                            <span class="mag-badge">${item.magnification}</span>
                            <span class="stain-badge">${item.stain}</span>
                        </div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category">${item.category} &bull; Lámina ${item.num}</span>
                        <h4 class="atlas-card-title">${item.title}</h4>
                        <p class="atlas-card-desc">${item.description}</p>
                    </div>
                `;

                card.addEventListener("click", () => {
                    openLightbox(item.src, item.title, {
                        badge1: item.magnification,
                        badge2: item.stain,
                        category: item.category,
                        description: item.description
                    });
                });

                grid.appendChild(card);
            });
        }

        // 2. LAMINARIO DE MALFORMACIONES CONGÉNITAS (61 Casos)
        else if (tab === "malformaciones") {
            if (typeof LAMINARIO_MALFORMACIONES_DATA === "undefined") {
                grid.innerHTML = `<p class="text-muted">Datos de malformaciones no cargados.</p>`;
                return;
            }

            const rawSystems = Array.from(new Set(LAMINARIO_MALFORMACIONES_DATA.map(item => item.system)));
            renderCategoryFilters(["Todos", ...rawSystems]);

            let items = LAMINARIO_MALFORMACIONES_DATA;
            if (state.currentLaminarioFilter !== "todos") {
                items = items.filter(i => i.system.toLowerCase() === state.currentLaminarioFilter.toLowerCase());
            }
            if (state.laminarioSearch) {
                items = items.filter(i => 
                    i.title.toLowerCase().includes(state.laminarioSearch) ||
                    i.system.toLowerCase().includes(state.laminarioSearch) ||
                    i.description.toLowerCase().includes(state.laminarioSearch)
                );
            }

            if (items.length === 0) {
                grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron láminas teratológicas con los criterios de búsqueda.</p>`;
                return;
            }

            items.forEach(item => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${item.src}" alt="${item.title}" loading="lazy">
                        <div class="badge-tag-overlay">
                            <span class="system-badge">Teratología</span>
                        </div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category" style="color: #fbbf24;">${item.system}</span>
                        <h4 class="atlas-card-title">${item.title}</h4>
                        <p class="atlas-card-desc">${item.description}</p>
                    </div>
                `;

                card.addEventListener("click", () => {
                    openLightbox(item.src, item.title, {
                        badge1: "Embriopatía / Teratología",
                        badge2: item.system,
                        category: "Malformación Congénita",
                        description: item.description
                    });
                });

                grid.appendChild(card);
            });
        }

        // 3. ATLAS ANATÓMICO (346 Figuras con Paginación)
        else if (tab === "atlas") {
            if (typeof GALLERY_DATA === "undefined") {
                grid.innerHTML = `<p class="text-muted">Datos del atlas anatómico no cargados.</p>`;
                return;
            }

            let figuresToShow = [];
            if (state.laminarioSearch !== "") {
                GALLERY_DATA.forEach(p => {
                    p.figures.forEach(fig => {
                        if (fig.label.toLowerCase().includes(state.laminarioSearch)) {
                            figuresToShow.push({
                                page: p.page,
                                label: fig.label,
                                src: fig.src
                            });
                        }
                    });
                });
            } else {
                const pageData = GALLERY_DATA.find(p => p.page === state.currentAtlasPage);
                if (pageData && pageData.figures) {
                    pageData.figures.forEach(fig => {
                        figuresToShow.push({
                            page: pageData.page,
                            label: fig.label,
                            src: fig.src
                        });
                    });
                }
            }

            if (figuresToShow.length === 0) {
                grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">Ninguna figura coincide con "${state.laminarioSearch}".</p>`;
                return;
            }

            figuresToShow.forEach(fig => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                const displayLabel = isNaN(fig.label) ? fig.label : `Figura ${fig.label}`;

                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${fig.src}" alt="${displayLabel}" loading="lazy">
                        <div class="badge-tag-overlay">
                            <span class="mag-badge">Pág. ${fig.page}</span>
                        </div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category">Atlas Anatómico &bull; Sistema Nervioso</span>
                        <h4 class="atlas-card-title">${displayLabel}</h4>
                        <p class="atlas-card-desc">Corte y esquema anatómico/embriológico oficial del CD de Morfofisiología II.</p>
                    </div>
                `;

                card.addEventListener("click", () => {
                    openLightbox(fig.src, displayLabel, {
                        badge1: `Página ${fig.page}`,
                        badge2: "Atlas Anatómico",
                        category: "Esquema Anatómico / Disección",
                        description: `Figura anatómica ${displayLabel} correspondiente al compendio del Atlas de Morfofisiología Humana II.`
                    });
                });

                grid.appendChild(card);
            });
        }

        // 4. PRESENTACIONES PPT & DIAPOSITIVAS (3 Compendios)
        else if (tab === "ppt") {
            if (typeof LAMINARIOS_PPT_DATA === "undefined") {
                grid.innerHTML = `<p class="text-muted">Presentaciones no encontradas.</p>`;
                return;
            }

            if (categoryFilters) categoryFilters.innerHTML = "";

            LAMINARIOS_PPT_DATA.forEach(ppt => {
                const card = document.createElement("div");
                card.className = "card";
                card.style.padding = "32px";
                card.style.display = "flex";
                card.style.flexDirection = "column";
                card.style.justifyContent = "space-between";
                card.style.gap = "16px";

                card.innerHTML = `
                    <div style="display: flex; align-items: flex-start; gap: 16px;">
                        <div class="card-icon" style="font-size: 2.5rem; width: 64px; height: 64px; flex-shrink: 0; background: rgba(239, 68, 68, 0.12); color: #f87171;">📊</div>
                        <div>
                            <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
                                <span class="ao-badge">${ppt.format}</span>
                                <span class="mag-badge">${ppt.size}</span>
                            </div>
                            <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 8px;">${ppt.title}</h3>
                            <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${ppt.description}</p>
                        </div>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 8px;">
                        <a href="${_res(ppt.file)}" download class="download-btn ppt-download-link" data-filename="${ppt.title} (${ppt.format})" style="width: 100%; justify-content: center;">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>Descargar Presentación (${ppt.size})</span>
                        </a>
                    </div>
                `;

                const btn = card.querySelector(".ppt-download-link");
                if (btn) {
                    btn.addEventListener("click", () => {
                        trackUserActivity("download", {
                            filename: `${ppt.title} (${ppt.format})`,
                            type: "Diapositivas PPT"
                        });
                    });
                }

                grid.appendChild(card);
            });
        }
    }

    function renderCategoryFilters(categories) {
        const container = document.getElementById("laminariosCategoryFilters");
        if (!container) return;
        container.innerHTML = "";

        categories.forEach(cat => {
            const pill = document.createElement("button");
            const isSelected = (cat.toLowerCase() === state.currentLaminarioFilter.toLowerCase()) || 
                               (cat === "Todos" && state.currentLaminarioFilter === "todos");
            pill.className = `cat-pill ${isSelected ? 'active' : ''}`;
            pill.textContent = cat;

            pill.addEventListener("click", () => {
                state.currentLaminarioFilter = (cat === "Todos") ? "todos" : cat;
                renderLaminarios();
            });

            container.appendChild(pill);
        });
    }

    function renderAtlasPageSelector() {
        const pageSelector = document.getElementById("atlasPageSelector");
        if (!pageSelector) return;
        pageSelector.innerHTML = "";

        for (let p = 1; p <= 28; p++) {
            const btn = document.createElement("button");
            btn.className = `page-num-btn ${p === state.currentAtlasPage ? 'active' : ''}`;
            btn.textContent = `Pág. ${p}`;
            btn.addEventListener("click", () => {
                state.currentAtlasPage = p;
                state.laminarioSearch = "";
                const searchInput = document.getElementById("laminariosSearchInput");
                if (searchInput) searchInput.value = "";
                
                document.querySelectorAll(".page-num-btn").forEach(el => el.classList.remove("active"));
                btn.classList.add("active");
                renderLaminarios();
            });
            pageSelector.appendChild(btn);
        }
    }

    // ==========================================
    // STUDENT SKILLS (HABILIDADES) SECTION
    // ==========================================

    function initHabilidades() {
        const grid = document.getElementById("habilidadesGrid");
        const detailsContainer = document.getElementById("habilidadesDetails");

        if (typeof STATIC_PAGES_DATA === "undefined" || !STATIC_PAGES_DATA.habilidades) {
            grid.innerHTML = `<p class="text-muted">Habilidades no cargadas. Revisa static_pages_data.js</p>`;
            return;
        }

        const habs = STATIC_PAGES_DATA.habilidades;
        grid.innerHTML = "";

        // Icons map based on skill name
        const iconMap = {
            "Analizar": "🔍",
            "Clasificar": "🗂️",
            "Comparar": "🔄",
            "Definir": "📖",
            "Describir": "📝",
            "Enumerar": "🔢",
            "Explicar": "💡",
            "Identificar": "🎯",
            "Interpretar": "🧠",
            "Predecir": "🔮"
        };

        Object.keys(habs).forEach(name => {
            const card = document.createElement("div");
            card.className = "card";
            
            card.innerHTML = `
                <div class="card-icon">${iconMap[name] || "📚"}</div>
                <h3 class="card-title">${name}</h3>
                <p class="card-description">Haz clic para ver los pasos estructurados del estudiante para la habilidad médica de ${name.toLowerCase()}.</p>
            `;

            card.addEventListener("click", () => {
                detailsContainer.innerHTML = habs[name];
                detailsContainer.scrollIntoView({ behavior: 'smooth' });
            });

            grid.appendChild(card);
        });

        // Load Analizar as default detail
        if (habs["Analizar"]) {
            detailsContainer.innerHTML = habs["Analizar"];
        }
    }

    // ==========================================
    // LIGHTBOX / ATLAS SLIDE VIEWER MODAL
    // ==========================================

    function initLightbox() {
        lightboxClose.addEventListener("click", closeLightbox);
        lightbox.addEventListener("click", function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close lightbox on Escape key
        document.addEventListener("keydown", function(e) {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    function openLightbox(src, title, details = null) {
        lightboxImg.src = src;
        lightboxTitle.textContent = title;

        if (details && lightboxDetails) {
            let tagsHtml = "";
            if (details.badge1) tagsHtml += `<span class="mag-badge">${details.badge1}</span>`;
            if (details.badge2) tagsHtml += `<span class="stain-badge">${details.badge2}</span>`;
            if (details.category) tagsHtml += `<span class="system-badge">${details.category}</span>`;

            lightboxDetails.innerHTML = `
                <div class="lightbox-tags">${tagsHtml}</div>
                <h4 style="margin-top: 10px;">${title}</h4>
                <p>${details.description || ''}</p>
            `;
            lightboxDetails.style.display = "block";
        } else if (lightboxDetails) {
            lightboxDetails.style.display = "none";
            lightboxDetails.innerHTML = "";
        }

        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
        if (lightboxDetails) {
            lightboxDetails.style.display = "none";
            lightboxDetails.innerHTML = "";
        }
    }

    // ==========================================
    // AUTHENTICATION & SINGLE SESSION MANAGEMENT
    // ==========================================

    let sessionWatcherInterval = null;

    function createAndSaveSessionToken(user) {
        const token = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("morfo2_session_token", token);
        // Save token to Firestore (async, fire-and-forget)
        db_updateUser(user.email, { activeSessionToken: token }).catch(e => console.warn("session token save:", e));
        user.activeSessionToken = token;
        state.currentUser = user;
        return token;
    }

    function startSessionWatcher() {
        if (sessionWatcherInterval) clearInterval(sessionWatcherInterval);

        async function checkActiveSession() {
            if (!state.currentUser) return;
            const localToken = localStorage.getItem("morfo2_session_token");
            if (!localToken) return;
            try {
                const freshUser = await db_getUserByEmail(state.currentUser.email);
                if (freshUser && freshUser.activeSessionToken && freshUser.activeSessionToken !== localToken) {
                    terminateConcurrentSession();
                }
            } catch(e) { /* network hiccup, skip */ }
        }

        window.addEventListener("focus", checkActiveSession);
        sessionWatcherInterval = setInterval(checkActiveSession, 5000);
    }

    function terminateConcurrentSession() {
        if (sessionWatcherInterval) clearInterval(sessionWatcherInterval);
        localStorage.removeItem("morfo2_session");
        localStorage.removeItem("morfo2_session_token");
        state.currentUser = null;

        const modal = document.getElementById("concurrentSessionModal");
        if (modal) modal.classList.add("active");
    }

    function checkProfileCompleteness(user) {
        if (!user || user.role === "superuser") return;

        const isComplete = (
            user.name && user.name.trim().length >= 3 &&
            user.phone && user.phone.trim().length >= 7 &&
            user.stateOrigin && user.stateOrigin.trim() !== "" &&
            user.enrollmentYear && user.enrollmentYear.trim() !== "" &&
            user.currentYear && user.currentYear.trim() !== ""
        );

        const modal = document.getElementById("completeProfileModal");
        if (!isComplete && modal) {
            const compStateOrigin = document.getElementById("compStateOrigin");
            if (compStateOrigin && compStateOrigin.children.length <= 1) {
                compStateOrigin.innerHTML = `<option value="" disabled selected>Selecciona tu Estado...</option>`;
                Object.keys(VENEZUELA_STATES_DATA).sort().forEach(stateName => {
                    const opt = document.createElement("option");
                    opt.value = stateName;
                    opt.textContent = `${stateName} (${VENEZUELA_STATES_DATA[stateName].capital})`;
                    compStateOrigin.appendChild(opt);
                });
            }

            const compName = document.getElementById("compName");
            const compPhone = document.getElementById("compPhone");
            const compEnrollmentYear = document.getElementById("compEnrollmentYear");
            const compCurrentYear = document.getElementById("compCurrentYear");

            if (compName && user.name) compName.value = user.name;
            if (compPhone && user.phone) compPhone.value = user.phone;
            if (compStateOrigin && user.stateOrigin) compStateOrigin.value = user.stateOrigin;
            if (compEnrollmentYear && user.enrollmentYear) compEnrollmentYear.value = user.enrollmentYear;
            if (compCurrentYear && user.currentYear) compCurrentYear.value = user.currentYear;

            modal.classList.add("active");
        } else if (modal) {
            modal.classList.remove("active");
        }
    }

    function initProfileCompleteness() {
        const form = document.getElementById("completeProfileForm");
        const modal = document.getElementById("completeProfileModal");
        const compError = document.getElementById("compError");
        const reloginBtn = document.getElementById("reloginBtn");

        if (reloginBtn) {
            reloginBtn.addEventListener("click", () => { window.location.reload(); });
        }

        if (form) {
            form.addEventListener("submit", async function(e) {
                e.preventDefault();
                if (!state.currentUser) return;

                const nameVal = document.getElementById("compName").value.trim();
                const phoneVal = document.getElementById("compPhone").value.trim();
                const stateVal = document.getElementById("compStateOrigin").value;
                const enrollVal = document.getElementById("compEnrollmentYear").value;
                const curYearVal = document.getElementById("compCurrentYear").value;

                if (!nameVal || !phoneVal || !stateVal || !enrollVal || !curYearVal) {
                    if (compError) compError.style.display = "block";
                    return;
                }

                const updates = { name: nameVal, phone: phoneVal, stateOrigin: stateVal, enrollmentYear: enrollVal, currentYear: curYearVal };
                try {
                    await db_updateUser(state.currentUser.email, updates);
                    Object.assign(state.currentUser, updates);
                    setupUserUI();
                    renderProfile();
                    renderAdmin();
                    renderGisMap();
                    trackUserActivity("navigation", { section: "perfil_actualizado", name: "Datos de Estudiante Completados" });
                } catch(err) {
                    console.warn("Profile completeness update error:", err);
                }

                if (modal) modal.classList.remove("active");
            });
        }
    }

    function initAuth() {
        const sessionEmail = localStorage.getItem("morfo2_session");
        const sessionToken = localStorage.getItem("morfo2_session_token");

        async function tryRestoreSession() {
            if (sessionEmail) {
                try {
                    const user = await db_getUserByEmail(sessionEmail);
                    if (user) {
                        if (!user.activeSessionToken || user.activeSessionToken === sessionToken) {
                            if (!user.activeSessionToken) {
                                createAndSaveSessionToken(user);
                            } else {
                                state.currentUser = user;
                            }
                            loginOverlay.classList.remove("active");
                            setupUserUI();
                            startSessionWatcher();
                            checkProfileCompleteness(user);
                            return;
                        } else {
                            terminateConcurrentSession();
                            return;
                        }
                    }
                } catch(e) {
                    console.warn("Session restore error:", e);
                }
            }
            // No session or user not found — show login
            loginOverlay.classList.add("active");
            userSidebarProfile.style.display = "none";
            logoutBtn.style.display = "none";
            navProfile.style.display = "none";
            navAdmin.style.display = "none";
        }

        tryRestoreSession();

        // Handle login form submission
        loginForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            const emailVal = loginEmail.value.trim().toLowerCase();
            const passVal = loginPassword.value;

            loginError.style.display = "none";
            const submitBtn = loginForm.querySelector("button[type='submit']");
            const originalText = submitBtn ? submitBtn.textContent : "";
            if (submitBtn) { submitBtn.textContent = "Verificando..."; submitBtn.disabled = true; }

            try {
                const user = await db_getUserByEmail(emailVal);
                if (user && user.password === passVal) {
                    state.currentUser = user;
                    localStorage.setItem("morfo2_session", user.email);
                    createAndSaveSessionToken(user);
                    loginOverlay.classList.remove("active");
                    showSection("inicio");
                    setupUserUI();
                    startSessionWatcher();
                    checkProfileCompleteness(user);
                    loginEmail.value = "";
                    loginPassword.value = "";
                } else {
                    loginError.style.display = "block";
                }
            } catch(err) {
                console.error("Login error:", err);
                loginError.textContent = "Error de conexión. Intenta de nuevo.";
                loginError.style.display = "block";
            } finally {
                if (submitBtn) { submitBtn.textContent = originalText; submitBtn.disabled = false; }
            }
        });

        // VIP Modal Close buttons
        const closeVipBtn = document.getElementById("closeVipModalBtn");
        const vipModal = document.getElementById("vipPaywallModal");
        if (closeVipBtn) closeVipBtn.addEventListener("click", closeVipPaywallModal);
        if (vipModal) {
            vipModal.addEventListener("click", (e) => {
                if (e.target === vipModal) closeVipPaywallModal();
            });
        }
    }


    function setupUserUI() {
        if (!state.currentUser) return;
        
        // Register logout listener only once
        if (!logoutBtn._listenerAdded) {
            logoutBtn.addEventListener("click", function() {
                localStorage.removeItem("morfo2_session");
                localStorage.removeItem("morfo2_session_token");
                window.location.reload();
            });
            logoutBtn._listenerAdded = true;
        }
        
        // Show Sidebar items
        userSidebarProfile.style.display = "block";
        logoutBtn.style.display = "flex";
        navProfile.style.display = "flex";
        
        // Update user text with VIP badge
        sidebarUsername.textContent = state.currentUser.name;
        const isSuper = state.currentUser.role === "superuser";
        const hasVip = isUserVip();
        sidebarRole.innerHTML = (isSuper ? "👑 DOCENTE / ADMIN" : `ESTUDIANTE / ${state.currentUser.currentYear}`) +
            (hasVip ? ' <span class="vip-badge active" style="font-size: 0.65rem; margin-left: 4px;">⭐ VIP</span>' : ' <span class="vip-badge inactive" style="font-size: 0.65rem; margin-left: 4px;">⚪ ESTÁNDAR</span>');
        
        // Set avatar
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        sidebarAvatar.src = state.currentUser.photo || defaultAvatar;
        
        // Toggle Admin Panel link depending on role
        if (state.currentUser.role === "superuser") {
            navAdmin.style.display = "flex";
        } else {
            navAdmin.style.display = "none";
        }
    }

    // ==========================================
    // TELEMETRY & USER ACTIVITY TRACKING
    // ==========================================

    async function trackUserActivity(type, data) {
        if (!state.currentUser) return;
        try {
            const email = state.currentUser.email;
            const userDoc = await db_getUserByEmail(email);
            if (!userDoc) return;
            const log = userDoc.activityLog || { aiChats: [], downloads: [], navigation: [], notes: [] };
            const now = new Date().toISOString();

            if (type === "navigation") {
                log.navigation.unshift({ section: data.section, name: data.name || data.section, timestamp: now });
                if (log.navigation.length > 60) log.navigation.pop();
            } else if (type === "download") {
                const existing = log.downloads.find(d => d.filename === data.filename);
                if (existing) { existing.count = (existing.count || 1) + 1; existing.lastDate = now; }
                else log.downloads.unshift({ filename: data.filename, type: data.type || "Documento PDF", count: 1, lastDate: now });
            } else if (type === "ai_chat") {
                log.aiChats.unshift({ query: data.query, reply: data.reply, topic: data.topic || state.currentSection, timestamp: now });
                if (log.aiChats.length > 100) log.aiChats.pop();
            } else if (type === "notes_saved") {
                const existingNote = log.notes.find(n => n.week === data.week);
                if (existingNote) { existingNote.lastUpdated = now; }
                else log.notes.unshift({ week: data.week, lastUpdated: now });
            }

            await db_updateUser(email, { activityLog: log });
            state.currentUser.activityLog = log;
        } catch (e) {
            console.warn("trackUserActivity error:", e);
        }
    }


    // ==========================================
    // USER PROFILE PANEL LOGIC
    // ==========================================

    function initProfile() {
        const photoUploadInput = document.getElementById("photoUploadInput");
        if (photoUploadInput) {
            photoUploadInput.addEventListener("change", function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Data = event.target.result;
                    // Update active user in Firestore
                    db_updateUser(state.currentUser.email, { photo: base64Data }).catch(e => console.warn("photo update:", e));
                    state.currentUser.photo = base64Data;
                    setupUserUI();
                    renderProfile();
                };
                reader.readAsDataURL(file);
            });
        }

        // Edit Profile Form Submission Handler
        const editProfileForm = document.getElementById("editProfileForm");
        const editProfileName = document.getElementById("editProfileName");
        const editProfilePhone = document.getElementById("editProfilePhone");
        const editProfileEmail = document.getElementById("editProfileEmail");
        const editProfilePassword = document.getElementById("editProfilePassword");
        const editProfileState = document.getElementById("editProfileState");
        const editProfileEnrollment = document.getElementById("editProfileEnrollment");
        const editProfileCurrentYear = document.getElementById("editProfileCurrentYear");
        const editProfileSuccess = document.getElementById("editProfileSuccess");

        if (editProfileForm) {
            editProfileForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                if (!state.currentUser) return;

                const nameVal = editProfileName.value.trim();
                const phoneVal = editProfilePhone.value.trim();
                const emailVal = editProfileEmail.value.trim().toLowerCase();
                const passVal = editProfilePassword.value;
                const stateVal = editProfileState.value;
                const enrollVal = editProfileEnrollment.value;
                const curYearVal = editProfileCurrentYear.value;

                if (!nameVal || !phoneVal || !emailVal || !passVal || !stateVal) {
                    alert("Por favor completa todos los campos obligatorios.");
                    return;
                }

                const currentEmail = state.currentUser.email;

                // Check email conflict
                if (emailVal !== currentEmail) {
                    const existing = await db_getUserByEmail(emailVal);
                    if (existing) {
                        alert("El correo electrónico ingresado ya está en uso por otro usuario.");
                        return;
                    }
                }

                const updates = { name: nameVal, phone: phoneVal, email: emailVal, password: passVal, stateOrigin: stateVal, enrollmentYear: enrollVal, currentYear: curYearVal };

                try {
                    if (emailVal !== currentEmail) {
                        // Email changed: create new doc with new email, delete old
                        const freshUser = await db_getUserByEmail(currentEmail);
                        await db_createUser({ ...freshUser, ...updates });
                        await db_deleteUser(currentEmail);
                        localStorage.setItem("morfo2_session", emailVal);
                    } else {
                        await db_updateUser(currentEmail, updates);
                    }

                    Object.assign(state.currentUser, updates);
                    setupUserUI();
                    renderProfile();
                    renderAdmin();
                    renderGisMap();

                    if (editProfileSuccess) {
                        editProfileSuccess.style.display = "block";
                        setTimeout(() => { editProfileSuccess.style.display = "none"; }, 4000);
                    }
                } catch(err) {
                    alert("Error al guardar cambios: " + err.message);
                }
            });
        }
    }


    function renderProfile() {
        if (!state.currentUser) return;
        
        const profilePageAvatar = document.getElementById("profilePageAvatar");
        const profilePageName = document.getElementById("profilePageName");
        const profilePageEmailDisplay = document.getElementById("profilePageEmailDisplay");
        const profilePageRoleBadge = document.getElementById("profilePageRoleBadge");
        
        const profileSummaryState = document.getElementById("profileSummaryState");
        const profileSummaryYear = document.getElementById("profileSummaryYear");
        const profileSummaryRole = document.getElementById("profileSummaryRole");

        const editProfileName = document.getElementById("editProfileName");
        const editProfilePhone = document.getElementById("editProfilePhone");
        const editProfileEmail = document.getElementById("editProfileEmail");
        const editProfilePassword = document.getElementById("editProfilePassword");
        const editProfileState = document.getElementById("editProfileState");
        const editProfileEnrollment = document.getElementById("editProfileEnrollment");
        const editProfileCurrentYear = document.getElementById("editProfileCurrentYear");
        
        // Left Card Summary Info
        if (profilePageName) profilePageName.textContent = state.currentUser.name;
        if (profilePageEmailDisplay) profilePageEmailDisplay.textContent = state.currentUser.email;
        if (profilePageRoleBadge) profilePageRoleBadge.textContent = state.currentUser.role === "superuser" ? "Superusuario" : "Estudiante";
        
        if (profileSummaryState) profileSummaryState.textContent = state.currentUser.stateOrigin || "Venezuela";
        if (profileSummaryYear) profileSummaryYear.textContent = state.currentUser.currentYear || "2do Año";
        if (profileSummaryRole) profileSummaryRole.textContent = state.currentUser.role === "superuser" ? "Superusuario (Admin)" : "Estudiante (usuario)";
        
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        if (profilePageAvatar) profilePageAvatar.src = state.currentUser.photo || defaultAvatar;

        // Populate Form Fields with current user data
        if (editProfileName) editProfileName.value = state.currentUser.name || "";
        if (editProfilePhone) editProfilePhone.value = state.currentUser.phone || "";
        if (editProfileEmail) editProfileEmail.value = state.currentUser.email || "";
        if (editProfilePassword) editProfilePassword.value = state.currentUser.password || "";
        if (editProfileState && state.currentUser.stateOrigin) editProfileState.value = state.currentUser.stateOrigin;
        if (editProfileEnrollment && state.currentUser.enrollmentYear) editProfileEnrollment.value = state.currentUser.enrollmentYear;
        if (editProfileCurrentYear && state.currentUser.currentYear) editProfileCurrentYear.value = state.currentUser.currentYear;
    }

    // ==========================================
    // USER ADMINISTRATION & GIS MAP MODULE
    // ==========================================

    function initAdmin() {
        const registerUserForm = document.getElementById("registerUserForm");
        const regName = document.getElementById("regName");
        const regPhone = document.getElementById("regPhone");
        const regEmail = document.getElementById("regEmail");
        const regStateOrigin = document.getElementById("regStateOrigin");
        const regEnrollmentYear = document.getElementById("regEnrollmentYear");
        const regCurrentYear = document.getElementById("regCurrentYear");
        const regPassword = document.getElementById("regPassword");
        const regSuccess = document.getElementById("regSuccess");
        const adminUsersTableSearch = document.getElementById("adminUsersTableSearch");
        
        // Populate Venezuelan States dropdown
        if (regStateOrigin) {
            regStateOrigin.innerHTML = `<option value="" disabled selected>Selecciona Estado...</option>`;
            Object.keys(VENEZUELA_STATES_DATA).sort().forEach(stateName => {
                const opt = document.createElement("option");
                opt.value = stateName;
                opt.textContent = `${stateName} (${VENEZUELA_STATES_DATA[stateName].capital})`;
                regStateOrigin.appendChild(opt);
            });
        }

        // Populate GIS filter dropdown
        const gisFilterState = document.getElementById("gisFilterState");
        if (gisFilterState) {
            gisFilterState.innerHTML = `<option value="todos">Todos los Estados (${Object.keys(VENEZUELA_STATES_DATA).length})</option>`;
            Object.keys(VENEZUELA_STATES_DATA).sort().forEach(stateName => {
                const opt = document.createElement("option");
                opt.value = stateName;
                opt.textContent = stateName;
                gisFilterState.appendChild(opt);
            });
        }
        
        if (registerUserForm) {
            registerUserForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                const nameVal = regName.value.trim();
                const phoneVal = regPhone.value.trim();
                const emailVal = regEmail.value.trim().toLowerCase();
                const stateVal = regStateOrigin.value;
                const enrollVal = regEnrollmentYear.value;
                const curYearVal = regCurrentYear.value;
                const passVal = regPassword.value;
                
                if (!stateVal) {
                    alert("Por favor selecciona un estado de Venezuela.");
                    return;
                }

                // Check if user already exists in Firestore
                const existing = await db_getUserByEmail(emailVal);
                if (existing) {
                    alert("Este correo electrónico ya está registrado en el sistema.");
                    return;
                }

                try {
                    await db_createUser({
                        name: nameVal, phone: phoneVal, email: emailVal, stateOrigin: stateVal,
                        enrollmentYear: enrollVal, currentYear: curYearVal, password: passVal,
                        role: "usuario", photo: ""
                    });

                    if (regSuccess) {
                        regSuccess.style.display = "block";
                        setTimeout(() => { regSuccess.style.display = "none"; }, 4000);
                    }

                    regName.value = "";
                    regPhone.value = "";
                    regEmail.value = "";
                    regStateOrigin.selectedIndex = 0;
                    regPassword.value = "";

                    renderAdmin();
                    renderGisMap();
                } catch(err) {
                    alert("Error al registrar usuario: " + err.message);
                }
            });
        }


        // Live search in users table
        if (adminUsersTableSearch) {
            adminUsersTableSearch.addEventListener("input", function() {
                renderAdmin(adminUsersTableSearch.value.trim().toLowerCase());
            });
        }

        // Toggle all passwords visibility in table
        const toggleAllPasswordsBtn = document.getElementById("toggleAllPasswordsBtn");
        if (toggleAllPasswordsBtn) {
            toggleAllPasswordsBtn.addEventListener("click", function() {
                const passSpans = document.querySelectorAll(".student-pass-text");
                const isMasked = passSpans.length > 0 && passSpans[0].getAttribute("data-masked") === "true";
                
                passSpans.forEach(span => {
                    const rawPass = span.getAttribute("data-password");
                    if (isMasked) {
                        span.textContent = rawPass;
                        span.setAttribute("data-masked", "false");
                    } else {
                        span.textContent = "••••••••";
                        span.setAttribute("data-masked", "true");
                    }
                });

                toggleAllPasswordsBtn.textContent = isMasked ? "🙈 Ocultar Contraseñas" : "👁️ Mostrar Contraseñas";
            });
        }

        initStudentFullInfoModal();
    }

    async function renderAdmin(searchQuery = "") {
        const adminUserCount = document.getElementById("adminUserCount");
        const adminMappedStatesCount = document.getElementById("adminMappedStatesCount");
        const adminAiQueriesCount = document.getElementById("adminAiQueriesCount");
        const adminTotalDownloadsCount = document.getElementById("adminTotalDownloadsCount");
        const usersTableBody = document.getElementById("usersTableBody");
        if (!usersTableBody) return;

        let users;
        try {
            users = await db_getAllUsers();
        } catch(e) {
            console.warn("renderAdmin: error loading from Firestore", e);
            users = [];
        }
        
        // Compute Metrics
        const mappedStates = new Set(users.filter(u => u.stateOrigin).map(u => u.stateOrigin));
        let totalAiQueries = 0;
        let totalDownloads = 0;
        
        users.forEach(u => {
            if (u.activityLog) {
                if (u.activityLog.aiChats) totalAiQueries += u.activityLog.aiChats.length;
                if (u.activityLog.downloads) {
                    u.activityLog.downloads.forEach(d => { totalDownloads += (d.count || 1); });
                }
            }
        });

        // Show counts
        if (adminUserCount) adminUserCount.textContent = users.length;
        if (adminMappedStatesCount) adminMappedStatesCount.textContent = mappedStates.size;
        if (adminAiQueriesCount) adminAiQueriesCount.textContent = totalAiQueries;
        if (adminTotalDownloadsCount) adminTotalDownloadsCount.textContent = totalDownloads;
        
        // Filter users if searching
        let filteredUsers = users;
        if (searchQuery) {
            filteredUsers = users.filter(u => 
                (u.name && u.name.toLowerCase().includes(searchQuery)) ||
                (u.email && u.email.toLowerCase().includes(searchQuery)) ||
                (u.phone && u.phone.toLowerCase().includes(searchQuery)) ||
                (u.stateOrigin && u.stateOrigin.toLowerCase().includes(searchQuery)) ||
                (u.password && u.password.toLowerCase().includes(searchQuery))
            );
        }

        // Render rows
        usersTableBody.innerHTML = "";
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        
        filteredUsers.forEach((user, idx) => {
            const tr = document.createElement("tr");
            const photoSrc = user.photo || defaultAvatar;
            const displayRole = user.role === "superuser" ? "Superusuario" : "Estudiante";
            const cleanPhone = (user.phone || "+584129031966").replace(/\D/g, "");
            const waLink = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(user.name)},%20te%20escribo%20desde%20la%20coordinaci%C3%B3n%20de%20Morfofisiolog%C3%ADa%20II`;
            const isSuper = user.role === "superuser" || user.email.toLowerCase() === "lams210488@gmail.com";
            const isVipUser = user.isVip === true;

            const vipCellHtml = isSuper ? `
                <span class="vip-badge active" style="font-size: 0.72rem;">👑 SUPERADMIN</span>
            ` : `
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                    <span class="vip-badge ${isVipUser ? 'active' : 'inactive'}">
                        ${isVipUser ? '⭐ VIP ACTIVO' : '⚪ ESTÁNDAR'}
                    </span>
                    <button class="btn-toggle-vip ${isVipUser ? 'revoke' : 'grant'}" data-email="${user.email}" data-vip="${isVipUser ? 'true' : 'false'}">
                        ${isVipUser ? 'Revocar VIP' : '⭐ Otorgar VIP'}
                    </button>
                </div>
            `;
            
            tr.innerHTML = `
                <td style="padding: 12px 14px;"><img class="table-avatar" src="${photoSrc}" alt="Avatar"></td>
                <td style="padding: 12px 14px; font-weight: 600; color: var(--text-primary);">${user.name}</td>
                <td style="padding: 12px 14px;">
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; color: #34d399; font-weight: 600; text-decoration: none;">
                        <span>💬</span> ${user.phone || "+58 412-9031966"}
                    </a>
                </td>
                <td style="padding: 12px 14px; color: var(--text-secondary);">${user.email}</td>
                <td style="padding: 12px 14px;">
                    <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <span class="student-pass-text" id="passText_${idx}" data-password="${user.password}" data-masked="true" style="font-family: monospace; font-size: 0.92rem; letter-spacing: 1px; color: #38bdf8;">••••••••</span>
                        <button type="button" class="toggle-single-pass-btn" data-target="passText_${idx}" style="background: none; border: none; cursor: pointer; padding: 0; font-size: 0.95rem;" title="Mostrar/Ocultar contraseña">👁️</button>
                    </div>
                </td>
                <td style="padding: 12px 14px;"><span class="system-badge">${user.stateOrigin || "Venezuela"}</span></td>
                <td style="padding: 12px 14px;"><span class="ao-badge">${user.currentYear || "2do Año"}</span></td>
                <td style="padding: 12px 14px; color: var(--text-secondary);">${user.enrollmentYear || "2026"}</td>
                <td style="padding: 12px 14px;"><span class="hero-tag" style="margin-bottom: 0;">${displayRole}</span></td>
                <td style="padding: 12px 14px; text-align: center;">${vipCellHtml}</td>
                <td style="padding: 12px 14px; text-align: center;">
                    <div style="display: flex; gap: 8px; justify-content: center; align-items: center; min-width: 240px;">
                        <button class="student-full-info-btn" data-user-email="${user.email}" style="padding: 6px 12px; border-radius: 6px; background: rgba(255,255,255,0.08); border: 1px solid var(--border-color); color: var(--text-primary); font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;" title="Desplegar toda la información y credenciales">
                            📋 Ficha
                        </button>
                        <button class="gis-deep-btn" data-user-email="${user.email}" style="padding: 6px 12px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;" title="Ver auditoría completa de descargas y consultas IA">
                            🔍 Auditoría
                        </button>
                        ${user.role !== "superuser" ? `
                            <button class="delete-student-btn" data-user-email="${user.email}" data-user-name="${user.name}" style="padding: 6px 12px; border-radius: 6px; background: #ef4444; border: 1px solid #dc2626; color: #ffffff; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);" title="Eliminar este estudiante permanentemente">
                                🗑️ Eliminar
                            </button>
                        ` : `
                            <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 600; padding: 4px 8px; background: rgba(255,255,255,0.04); border-radius: 4px; border: 1px solid var(--border-color);">
                                🛡️ Principal
                            </span>
                        `}
                    </div>
                </td>
            `;
            
            usersTableBody.appendChild(tr);
        });

        // Add event listeners to VIP toggle buttons
        usersTableBody.querySelectorAll(".btn-toggle-vip").forEach(btn => {
            btn.addEventListener("click", async function() {
                const email = btn.getAttribute("data-email");
                const currentVip = btn.getAttribute("data-vip") === "true";
                btn.disabled = true;
                btn.textContent = "⏳ Guardando...";
                try {
                    await db_toggleUserVip(email, currentVip);
                    renderAdmin(searchQuery);
                } catch(err) {
                    console.error("Error al actualizar status VIP:", err);
                    alert("Error al actualizar el estado VIP del usuario.");
                    renderAdmin(searchQuery);
                }
            });
        });

        // Add event listeners to single password toggle buttons
        usersTableBody.querySelectorAll(".toggle-single-pass-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const targetId = btn.getAttribute("data-target");
                const span = document.getElementById(targetId);
                if (span) {
                    const rawPass = span.getAttribute("data-password");
                    const isMasked = span.getAttribute("data-masked") === "true";
                    if (isMasked) {
                        span.textContent = rawPass;
                        span.setAttribute("data-masked", "false");
                        btn.textContent = "🙈";
                    } else {
                        span.textContent = "••••••••";
                        span.setAttribute("data-masked", "true");
                        btn.textContent = "👁️";
                    }
                }
            });
        });

        // Add event listeners to full info buttons
        usersTableBody.querySelectorAll(".student-full-info-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const email = btn.getAttribute("data-user-email");
                openStudentFullInfoModal(email);
            });
        });

        // Add event listeners to deep info buttons
        usersTableBody.querySelectorAll(".gis-deep-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const email = btn.getAttribute("data-user-email");
                openDeepInfoModal(email);
            });
        });

        // Add event listeners to delete buttons
        usersTableBody.querySelectorAll(".delete-student-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const email = btn.getAttribute("data-user-email");
                const name = btn.getAttribute("data-user-name");
                handleDeleteUser(email, name);
            });
        });
    }

    async function handleDeleteUser(userEmail, userName) {
        if (!userEmail) return;
        if (userEmail === "lams210488@gmail.com") {
            alert("El superusuario principal del sistema no puede ser eliminado.");
            return;
        }

        const confirmed = confirm(`⚠️ ¿Estás seguro de que deseas eliminar permanentemente de la plataforma a:\n\n👤 ${userName || "Estudiante"} (${userEmail})?\n\nEsta acción borrará todas sus credenciales, descargas registradas y consultas al Tutor IA.`);
        if (!confirmed) return;

        try {
            await db_deleteUser(userEmail);
        } catch(e) {
            alert("Error al eliminar usuario: " + e.message);
            return;
        }

        // Close modals if open
        const studentFullInfoModal = document.getElementById("studentFullInfoModal");
        if (studentFullInfoModal) studentFullInfoModal.classList.remove("active");
        const deepInfoModal = document.getElementById("deepInfoModal");
        if (deepInfoModal) deepInfoModal.classList.remove("active");

        await renderAdmin();
        renderGisMap();

        alert(`✅ El estudiante "${userName || userEmail}" ha sido eliminado exitosamente.`);
    }

    window.handleDeleteUser = handleDeleteUser;

    // ==========================================
    // GIS MAP CONTROLLER (LEAFLET.JS)
    // ==========================================

    function initGisMap() {
        const mapContainer = document.getElementById("gisMap");
        if (!mapContainer || typeof L === "undefined") return;

        // Create Leaflet Map centered at Venezuela
        state.gisMap = L.map('gisMap', {
            center: [7.8, -66.0],
            zoom: 6,
            minZoom: 5,
            maxZoom: 14,
            zoomControl: true
        });

        // Use standard high-reliability OpenStreetMap tile service (100% uptime, no rate-limits/API blocks)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(state.gisMap);

        state.gisMarkersLayer = L.layerGroup().addTo(state.gisMap);

        // Setup filter listeners
        const gisFilterState = document.getElementById("gisFilterState");
        const gisFilterYear = document.getElementById("gisFilterYear");
        const gisSearchStudent = document.getElementById("gisSearchStudent");

        if (gisFilterState) {
            gisFilterState.addEventListener("change", function() {
                state.gisFilterState = gisFilterState.value;
                renderGisMap();
            });
        }

        if (gisFilterYear) {
            gisFilterYear.addEventListener("change", function() {
                state.gisFilterYear = gisFilterYear.value;
                renderGisMap();
            });
        }

        if (gisSearchStudent) {
            gisSearchStudent.addEventListener("input", function() {
                state.gisSearchQuery = gisSearchStudent.value.trim().toLowerCase();
                renderGisMap();
            });
        }
    }

    async function renderGisMap() {
        if (!state.gisMap || !state.gisMarkersLayer) return;

        // Invalidate map size so it renders smoothly even if container was hidden
        setTimeout(() => { state.gisMap.invalidateSize(); }, 200);

        state.gisMarkersLayer.clearLayers();

        let users;
        try {
            users = await db_getAllUsers();
        } catch(e) {
            console.warn("renderGisMap: error loading users", e);
            users = [];
        }

        let filtered = users;
        if (state.gisFilterState !== "todos") {
            filtered = filtered.filter(u => u.stateOrigin === state.gisFilterState);
        }
        if (state.gisFilterYear !== "todos") {
            filtered = filtered.filter(u => u.currentYear === state.gisFilterYear);
        }
        if (state.gisSearchQuery) {
            filtered = filtered.filter(u => 
                (u.name && u.name.toLowerCase().includes(state.gisSearchQuery)) ||
                (u.email && u.email.toLowerCase().includes(state.gisSearchQuery)) ||
                (u.stateOrigin && u.stateOrigin.toLowerCase().includes(state.gisSearchQuery))
            );
        }

        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";

        filtered.forEach((user, idx) => {
            const stateData = VENEZUELA_STATES_DATA[user.stateOrigin];
            if (!stateData) return;

            // Small jitter so multiple students in same state don't hide each other
            const jitterLat = (Math.sin(idx * 1.5) * 0.12);
            const jitterLng = (Math.cos(idx * 1.5) * 0.12);
            const lat = stateData.lat + jitterLat;
            const lng = stateData.lng + jitterLng;

            // Custom HTML Pin Icon
            const customIcon = L.divIcon({
                className: 'custom-gis-marker-container',
                html: `<div class="custom-gis-pin" title="${user.name} (${user.stateOrigin})"></div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([lat, lng], { icon: customIcon });
            
            const cleanPhone = (user.phone || "+584129031966").replace(/\D/g, "");
            const waLink = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(user.name)},%20te%20escribo%20desde%20la%20coordinaci%C3%B3n%20de%20Morfofisiolog%C3%ADa%20II`;
            const photoSrc = user.photo || defaultAvatar;

            const popupHtml = `
                <div class="gis-popup-card">
                    <div class="gis-popup-header">
                        <img class="gis-popup-avatar" src="${photoSrc}" alt="Avatar">
                        <div>
                            <div class="gis-popup-name">${user.name}</div>
                            <span class="ao-badge" style="font-size: 0.7rem;">${user.currentYear || "2do Año"}</span>
                        </div>
                    </div>
                    <div class="gis-popup-body">
                        <div>📍 <strong>Estado:</strong> ${user.stateOrigin} (${stateData.capital})</div>
                        <div>✉️ <strong>Correo:</strong> ${user.email}</div>
                        <div>📅 <strong>Inscripción:</strong> ${user.enrollmentYear || "2026"}</div>
                    </div>
                    <div class="gis-popup-actions">
                        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="gis-whatsapp-btn">
                            <span>💬 WhatsApp</span>
                        </a>
                        <button class="gis-deep-btn" onclick="document.dispatchEvent(new CustomEvent('openDeepInfo', { detail: '${user.email}' }))">
                            🔍 Auditoría
                        </button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupHtml, { maxWidth: 300 });
            state.gisMarkersLayer.addLayer(marker);
        });

        // Listen to custom event from popup button
        document.removeEventListener('openDeepInfo', handleDeepInfoEvent);
        document.addEventListener('openDeepInfo', handleDeepInfoEvent);
    }

    function handleDeepInfoEvent(e) {
        if (e.detail) {
            openDeepInfoModal(e.detail);
        }
    }

    // ==========================================
    // AI TUTOR SMART ENGINE & CHAT WIDGET
    // ==========================================

    function initAiTutor() {
        const fab = document.getElementById("aiTutorFab");
        const modal = document.getElementById("aiTutorChatModal");
        const closeBtn = document.getElementById("aiChatCloseBtn");
        const chatForm = document.getElementById("aiChatForm");
        const chatInput = document.getElementById("aiChatInput");
        const messagesContainer = document.getElementById("aiChatMessages");
        const chips = document.querySelectorAll(".ai-chip-btn");

        if (!fab || !modal) return;

        fab.addEventListener("click", () => {
            modal.classList.toggle("active");
            if (modal.classList.contains("active")) {
                if (chatInput) chatInput.focus();
                // Render initial welcome if empty
                if (messagesContainer && messagesContainer.children.length === 0) {
                    renderAiWelcomeMessage();
                }
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        // Suggestions chips
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                const query = chip.getAttribute("data-query");
                if (query && chatInput) {
                    chatInput.value = query;
                    chatForm.dispatchEvent(new Event("submit"));
                }
            });
        });

        if (chatForm) {
            chatForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;

                // 1. Add student message to UI
                appendChatMessage("user", text);
                chatInput.value = "";

                // 2. Generate intelligent clinical answer with examples
                const reply = generateAiResponse(text);

                // 3. Simulate natural typing delay
                setTimeout(() => {
                    appendChatMessage("bot", reply);
                    
                    // 4. Track telemetry into student's audit log
                    trackUserActivity("ai_chat", {
                        query: text,
                        reply: reply,
                        topic: state.currentSection
                    });
                }, 400);
            });
        }
    }

    function renderAiWelcomeMessage() {
        const studentName = state.currentUser ? state.currentUser.name.split(" ")[0] : "Estudiante";
        const studentYear = state.currentUser ? (state.currentUser.currentYear || "2do Año") : "2do Año";
        const welcomeText = `¡Hola, **${studentName}**! 👋 Soy tu **Tutor IA de Morfofisiología Humana II** (${studentYear}).\n\nEstoy aquí para resolver cualquier duda que tengas sobre neuroanatomía, histología, embriología, fisiología nerviosa o para guiarte paso a paso con ejemplos clínicos en tus ejercicios de consolidación. ¿En qué tema te gustaría profundizar hoy?`;
        appendChatMessage("bot", welcomeText);
    }

    function appendChatMessage(sender, text) {
        const container = document.getElementById("aiChatMessages");
        if (!container) return;

        const msg = document.createElement("div");
        msg.className = `ai-msg ${sender}`;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Format basic markdown bold and newlines
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');

        msg.innerHTML = `
            <div class="ai-bubble">${formattedText}</div>
            <span class="ai-msg-time">${timeStr}</span>
        `;

        container.appendChild(msg);
        container.scrollTop = container.scrollHeight;
    }

    function generateAiResponse(query) {
        const q = query.toLowerCase();

        // 1. Vías Piramidales y Extrapiramidales
        if (q.includes("piramidal") || q.includes("extrapiramidal") || q.includes("corticoespinal") || q.includes("haz")) {
            return `🧠 **Vías Motoras del Sistema Nervioso**:
            
1. **Vía Piramidal (Haz Corticoespinal)**: Es la autopista del movimiento voluntario consciente y fino.
- *Ejemplo clínico*: Cuando tocas el piano o enhebras una aguja con los dedos, tu corteza motora envía impulsos directos por el haz corticoespinal lateral (que se decusa en las pirámides bulbares). Si se lesiona, el paciente sufre parálisis espástica con signo de Babinski positivo.

2. **Sistema Extrapiramidal (Núcleos Basales, Núcleo Rojo, Sustancia Negra)**: Regula el tono muscular, la postura y la fluidez automática.
- *Ejemplo clínico*: Cuando caminas y balanceas los brazos de forma natural. En la Enfermedad de Parkinson, se daña la sustancia negra dopaminérgica, causando rigidez y temblor de reposo.`;
        }

        // 2. Arco Reflejo
        if (q.includes("reflejo") || q.includes("arco reflejo") || q.includes("rotuliano")) {
            return `⚡ **El Arco Reflejo (Unidad Morfofuncional)**:
            
El arco reflejo es la respuesta motora involuntaria e inmediata ante un estímulo sensorial. Consta de 5 componentes indispensables:
1. **Receptor Sensorial**: (Ej: Huso neuromuscular).
2. **Neurona Aferente (Sensitiva)**: Conduce el impulso al asta posterior de la médula.
3. **Centro Integrador**: Sinapsis en la sustancia gris medular.
4. **Neurona Eferente (Motoneurona Alfa)**: Emerge por la raíz anterior.
5. **Efector**: Músculo esquelético que se contrae.

*Ejemplo clínico*: Al percutir el tendón rotuliano con el martillo de reflejos, estiras el cuádriceps; la señal viaja por el nervio femoral hacia los segmentos L2-L4 y regresa provocando la extensión refleja de la pierna.`;
        }

        // 3. Consolidación y Autoevaluación
        if (q.includes("consolidacion") || q.includes("consolidación") || q.includes("ejercicio") || q.includes("pregunta")) {
            return `📝 **Orientación Metodológica para la Consolidación**:
            
Para resolver con éxito las preguntas de consolidación de Morfofisiología II, sigue estos 3 pasos de razonamiento médico:
1. **Diagnóstico Topográfico**: Identifica qué nivel del neuroeje está implicado (médula espinal, tronco encefálico, cerebelo o corteza cerebral).
2. **Relación Estructura-Función**: Recuerda qué núcleos o tractos pasan por esa zona (ej: fascículos de Goll y Burdach para la propiocepción consciente).
3. **Manifestación Clínica**: Deduce qué función se pierde si esa estructura se lesiona.

*Tip*: Escribe tus respuestas directamente en los cuadros de texto de la pestaña 'Ejercicios de Consolidación'; se guardan automáticamente para tu estudio.`;
        }

        // 4. Histología / Sustancia Gris vs Sustancia Blanca
        if (q.includes("sustancia gris") || q.includes("sustancia blanca") || q.includes("mielina") || q.includes("purkinje") || q.includes("glia")) {
            return `🔬 **Correlación Histológica del SNC**:
            
- **Sustancia Gris**: Formada por los **somas neuronales (cuerpos)**, dendritas, astrocitos protoplasmáticos y abundantes capilares sanguíneos. Aquí se realiza el procesamiento y la integración de información.
- **Sustancia Blanca**: Formada principalmente por **axones mielinizados** (la mielina le da el color blanquecino) y oligodendrocitos. Es la vía de conducción rápida de potenciales de acción.

*Ejemplo en Cerebelo*: En la corteza cerebelosa (sustancia gris) encontramos 3 capas histológicas bien definidas: Molecular, de Células de Purkinje (células piriformes gigantes teñidas con impregnación argéntica) y Capa Granulosa.`;
        }

        // 5. Sistema Autónomo (Simpático vs Parasimpático)
        if (q.includes("simpático") || q.includes("parasimpático") || q.includes("autónomo") || q.includes("vegetativo")) {
            return `⚖️ **Sistema Nervioso Autónomo (SNA)**:
            
- **Sistema Simpático (Toracolumbar T1-L2)**: Sistema de alerta (*Lucha o Huida*). Dilata las pupilas (midriasis), aumenta la frecuencia cardíaca, broncodilata e inhibe la motilidad digestiva. Neurotransmisor posganglionar: **Noradrenalina**.
- **Sistema Parasimpático (Craneosacro: Pares III, VII, IX, X y S2-S4)**: Sistema de reposo y digestión (*Homeostasis y Conservación*). Contrae la pupila (miosis), disminuye la frecuencia cardíaca y estimula la secreción gástrica. Neurotransmisor: **Acetilcolina**.

*Ejemplo clínico*: Cuando un médico administra atropina (antagonista colinérgico), bloquea el parasimpático produciendo taquicardia y sequedad bucal.`;
        }

        // 6. Órganos de los Sentidos (Retina, Oído, etc.)
        if (q.includes("retina") || q.includes("ojo") || q.includes("oido") || q.includes("corti") || q.includes("vestibular") || q.includes("olfato")) {
            return `👁️ **Órganos de los Sentidos y Transducción Sensorial**:
            
- **Retina**: Presenta 10 capas histológicas. Los **bastones** contienen rodopsina (visión nocturna/penumbra en blanco y negro), mientras que los **conos** poseen fotopsinas para la visión de alta agudeza diurna y en colores.
- **Órgano de Corti (Cóclea)**: Las células ciliadas internas y externas apoyadas sobre la membrana basilar transforman las ondas mecánicas sonoras en potenciales eléctricos transmitidos por el nervio coclear (VIII par craneal).
- **Aparato Vestibular (Utrículo, Sáculo y Conductos Semicirculares)**: Contienen máculas y crestas ampollares que detectan la gravedad y la aceleración angular de la cabeza.`;
        }

        // 7. Malformaciones Congénitas / Teratología
        if (q.includes("malformacion") || q.includes("anencefalia") || q.includes("espina bifida") || q.includes("mielomeningocele") || q.includes("hidrocefalia")) {
            return `🧬 **Defectos del Cierre del Tubo Neural (Embriología)**:
            
El tubo neural se cierra normalmente en la 4ta semana de gestación (día 25 el neuroporo anterior y día 27 el neuroporo posterior).
- **Fallo del Neuroporo Anterior**: Causa **Anencefalia** o Acrania (ausencia del desarrollo del encéfalo y bóveda craneal), incompatible con la vida.
- **Fallo del Neuroporo Posterior**: Causa **Espina Bífida** (Oculta, Meningocele o Mielomeningocele con herniación de médula y meninges).

*Prevención médica fundamental*: La suplementación prenatal con **Ácido Fólico (Vitamina B9)** antes de la concepción reduce hasta en un 70% el riesgo de estos defectos en la comunidad.`;
        }

        // Default Intelligent Fallback
        return `🩺 **Respuesta Formativa de Morfofisiología II**:
        
Has consultado sobre: *"**${query}**"*. 

En el estudio médico del sistema nervioso, te sugiero analizar este tema bajo 3 pilares:
1. **Embriología y Origen**: Origen a partir del ectodermo general, placa neural o crestas neurales.
2. **Estructura Macroscópica y Microscópica**: Configuración externa, núcleos de sustancia gris y tractos de sustancia blanca (puedes consultar el *Laminario Histológico* y el *Atlas* en el menú).
3. **Correlato Clínico**: ¿Qué patología comunitaria se asocia a su disfunción?

¿Deseas que te explique algún punto específico con un ejemplo clínico más detallado?`;
    }

    // ==========================================
    // DEEP INFO AUDIT MODAL (SUPERUSER ONLY)
    // ==========================================

    function initDeepInfoModal() {
        const modal = document.getElementById("deepInfoModal");
        const closeBtn = document.getElementById("deepInfoCloseBtn");
        const tabBtns = document.querySelectorAll("[data-deep-tab]");

        if (!modal) return;

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-deep-tab");
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const panels = document.querySelectorAll("#deepInfoModal .deep-tab-panel");
                panels.forEach(p => p.style.display = "none");

                if (targetTab === "credentials") {
                    document.getElementById("deepPanelCredentials").style.display = "block";
                } else if (targetTab === "aiChat") {
                    document.getElementById("deepPanelAiChat").style.display = "block";
                } else if (targetTab === "downloads") {
                    document.getElementById("deepPanelDownloads").style.display = "block";
                } else if (targetTab === "navigation") {
                    document.getElementById("deepPanelNavigation").style.display = "block";
                } else if (targetTab === "notes") {
                    document.getElementById("deepPanelNotes").style.display = "block";
                }
            });
        });
    }

    async function openDeepInfoModal(userEmail) {
        const modal = document.getElementById("deepInfoModal");
        if (!modal) return;

        let user;
        try {
            user = await db_getUserByEmail(userEmail);
        } catch(e) {
            console.warn("openDeepInfoModal:", e);
        }
        if (!user) {
            alert("Estudiante no encontrado.");
            return;
        }

        state.currentDeepUser = user;
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";


        // Populate Header
        document.getElementById("deepInfoAvatar").src = user.photo || defaultAvatar;
        document.getElementById("deepInfoName").textContent = user.name;
        document.getElementById("deepInfoEmail").textContent = user.email;
        document.getElementById("deepInfoPhone").textContent = user.phone || "+58 412-9031966";
        document.getElementById("deepInfoYearBadge").textContent = user.currentYear || "2do Año";
        document.getElementById("deepInfoStateBadge").textContent = user.stateOrigin || "Venezuela";
        document.getElementById("deepInfoEnrollment").textContent = user.enrollmentYear || "2026";

        const log = user.activityLog || { aiChats: [], downloads: [], navigation: [], notes: [] };

        // Counters
        document.getElementById("deepCountAi").textContent = (log.aiChats || []).length;
        document.getElementById("deepCountDownloads").textContent = (log.downloads || []).length;
        document.getElementById("deepCountNav").textContent = (log.navigation || []).length;

        // Reset to credentials tab active
        const tabBtns = document.querySelectorAll("#deepInfoModal [data-deep-tab]");
        tabBtns.forEach(b => b.classList.remove("active"));
        const defaultTabBtn = document.querySelector("#deepInfoModal [data-deep-tab='credentials']");
        if (defaultTabBtn) defaultTabBtn.classList.add("active");

        const panels = document.querySelectorAll("#deepInfoModal .deep-tab-panel");
        panels.forEach(p => p.style.display = "none");
        const defaultPanel = document.getElementById("deepPanelCredentials");
        if (defaultPanel) defaultPanel.style.display = "block";

        // Panel 0: Full Credentials & Data Sheet
        const cleanPhone = (user.phone || "+584129031966").replace(/\D/g, "");
        const waLink = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(user.name)},%20te%20escribo%20desde%20la%20coordinaci%C3%B3n%20de%20Morfofisiolog%C3%ADa%20II`;
        const stateCapital = VENEZUELA_STATES_DATA[user.stateOrigin] ? VENEZUELA_STATES_DATA[user.stateOrigin].capital : "Capital no registrada";

        if (defaultPanel) {
            defaultPanel.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 18px;">
                    <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid var(--accent-color); border-radius: 12px; padding: 20px;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                            🔑 Credenciales de Acceso al Portal
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                            <div style="background: rgba(0,0,0,0.3); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">CORREO ELECTRÓNICO (LOGIN)</div>
                                <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-primary); margin-top: 4px; word-break: break-all;">${user.email}</div>
                            </div>
                            <div style="background: rgba(0,0,0,0.3); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 600;">CONTRASEÑA DE ACCESO</div>
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                                    <span style="font-family: monospace; font-size: 1.05rem; font-weight: 700; color: #38bdf8; letter-spacing: 0.5px;">${user.password}</span>
                                    <button onclick="navigator.clipboard.writeText('${user.password}'); alert('Contraseña copiada al portapapeles: ${user.password}');" style="padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: #ffffff; cursor: pointer;">📋 Copiar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                        <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
                            📋 Ficha Académica y Geográfica Completa
                        </h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">NOMBRE Y APELLIDO</div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">${user.name}</div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">TELÉFONO / WHATSAPP</div>
                                <div style="margin-top: 2px;">
                                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="color: #34d399; font-weight: 600; text-decoration: none;">
                                        💬 ${user.phone || "No registrado"}
                                    </a>
                                </div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">ESTADO DE ORIGEN (GIS)</div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">📍 ${user.stateOrigin || "Venezuela"} (${stateCapital})</div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">AÑO DE INSCRIPCIÓN</div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">📅 ${user.enrollmentYear || "2026"}</div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">AÑO CURSANTE</div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">🎓 ${user.currentYear || "2do Año"}</div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">ROL ASIGNADO</div>
                                <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;"><span class="hero-tag" style="margin-bottom: 0;">${user.role === 'superuser' ? 'Superusuario' : 'Estudiante (usuario)'}</span></div>
                            </div>
                            <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color); grid-column: 1/-1;">
                                <div style="font-size: 0.72rem; color: var(--text-muted);">TOKEN DE SESIÓN ACTIVA (CONTROL MULTI-INGRESO)</div>
                                <div style="font-family: monospace; font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${user.activeSessionToken || 'Sin sesión activa registrada'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Panel 1: AI Chat History
        const pAi = document.getElementById("deepPanelAiChat");
        if (log.aiChats && log.aiChats.length > 0) {
            pAi.innerHTML = log.aiChats.map(c => `
                <div class="audit-chat-item">
                    <div class="audit-chat-header">
                        <span>📅 ${new Date(c.timestamp).toLocaleString()}</span>
                        <span class="ao-badge">Tema: ${c.topic || 'General'}</span>
                    </div>
                    <div style="font-size: 0.92rem; color: #ffffff;"><strong>Pregunta del Alumno:</strong> ${c.query}</div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-top: 4px;">
                        <strong style="color: var(--accent-hover);">Respuesta Tutor IA:</strong><br>${c.reply.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `).join("");
        } else {
            pAi.innerHTML = `<p class="text-muted" style="text-align: center; padding: 30px;">Este estudiante aún no ha realizado preguntas al Tutor IA.</p>`;
        }

        // Panel 2: Downloads History
        const pDown = document.getElementById("deepPanelDownloads");
        if (log.downloads && log.downloads.length > 0) {
            pDown.innerHTML = `
                <table class="audit-table">
                    <thead>
                        <tr>
                            <th>Recurso / Archivo Descargado</th>
                            <th>Tipo de Material</th>
                            <th>Nº Descargas</th>
                            <th>Última Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${log.downloads.map(d => `
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">📥 ${d.filename}</td>
                                <td><span class="ao-badge">${d.type}</span></td>
                                <td style="font-weight: 700; color: var(--accent-hover);">${d.count || 1} veces</td>
                                <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(d.lastDate).toLocaleString()}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;
        } else {
            pDown.innerHTML = `<p class="text-muted" style="text-align: center; padding: 30px;">No hay registros de descargas para este estudiante.</p>`;
        }

        // Panel 3: Navigation Logs
        const pNav = document.getElementById("deepPanelNavigation");
        if (log.navigation && log.navigation.length > 0) {
            pNav.innerHTML = `
                <table class="audit-table">
                    <thead>
                        <tr>
                            <th>Sección Visitada</th>
                            <th>Identificador</th>
                            <th>Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${log.navigation.map(n => `
                            <tr>
                                <td style="font-weight: 600; color: var(--text-primary);">🧭 ${n.name || n.section}</td>
                                <td><span class="mag-badge">${n.section}</span></td>
                                <td style="color: var(--text-muted); font-size: 0.8rem;">${new Date(n.timestamp).toLocaleString()}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;
        } else {
            pNav.innerHTML = `<p class="text-muted" style="text-align: center; padding: 30px;">Sin historial de navegación reciente.</p>`;
        }

        // Panel 4: Notes and Consolidation Answers
        const pNotes = document.getElementById("deepPanelNotes");
        pNotes.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <p style="font-size: 0.88rem; color: var(--text-secondary);">Cuaderno de apuntes sincronizado en la plataforma:</p>
                <div class="learning-card" style="padding: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span class="ao-badge">Semana 1 a 12</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Estado: Activo</span>
                    </div>
                    <p style="font-size: 0.88rem; line-height: 1.5; color: var(--text-primary);">
                        El estudiante ha interactuado con los cuestionarios de consolidación en las semanas curriculares.
                    </p>
                </div>
            </div>
        `;

        modal.classList.add("active");
    }

    // ==========================================
    // STUDENT FULL DOSSIER / FICHA COMPLETA MODAL
    // ==========================================

    function initStudentFullInfoModal() {
        const modal = document.getElementById("studentFullInfoModal");
        const closeBtn = document.getElementById("studentFullInfoCloseBtn");

        if (!modal) return;

        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }

        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }

    async function openStudentFullInfoModal(userEmail) {
        const modal = document.getElementById("studentFullInfoModal");
        const content = document.getElementById("studentFullInfoContent");
        if (!modal || !content) return;

        let user;
        try {
            user = await db_getUserByEmail(userEmail);
        } catch(e) {
            console.warn("openStudentFullInfoModal:", e);
        }
        if (!user) {
            alert("Estudiante no encontrado.");
            return;
        }

        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        const photoSrc = user.photo || defaultAvatar;
        const cleanPhone = (user.phone || "+584129031966").replace(/\D/g, "");
        const waLink = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(user.name)},%20te%20escribo%20desde%20la%20coordinaci%C3%B3n%20de%20Morfofisiolog%C3%ADa%20II`;
        const stateCapital = VENEZUELA_STATES_DATA[user.stateOrigin] ? VENEZUELA_STATES_DATA[user.stateOrigin].capital : "Capital no registrada";
        const log = user.activityLog || { aiChats: [], downloads: [], navigation: [] };

        content.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <!-- Header Card -->
                <div style="display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.03); padding: 18px; border-radius: 12px; border: 1px solid var(--border-color);">
                    <img src="${photoSrc}" alt="Avatar" style="width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent-color);">
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin: 0;">${user.name}</h3>
                            <span class="ao-badge">${user.currentYear || "2do Año"}</span>
                            <span class="system-badge">${user.stateOrigin || "Venezuela"}</span>
                        </div>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">
                            Registrado en el sistema formativo &bull; Inscripción: <strong>${user.enrollmentYear || "2026"}</strong>
                        </p>
                    </div>
                </div>

                <!-- Credentials Highlight Box -->
                <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15)); border: 1px solid var(--accent-color); border-radius: 12px; padding: 20px;">
                    <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        🔑 Credenciales de Inicio de Sesión
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="background: rgba(0,0,0,0.35); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">CORREO ELECTRÓNICO</div>
                            <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-primary); margin-top: 4px; word-break: break-all;">${user.email}</div>
                        </div>
                        <div style="background: rgba(0,0,0,0.35); padding: 12px 14px; border-radius: 8px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">CONTRASEÑA REGISTRADA</div>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                                <span id="fullModalPass" style="font-family: monospace; font-size: 1.05rem; font-weight: 700; color: #38bdf8;">${user.password}</span>
                                <button onclick="navigator.clipboard.writeText('${user.password}'); alert('Contraseña copiada al portapapeles');" style="padding: 4px 8px; font-size: 0.72rem; border-radius: 4px; background: rgba(255,255,255,0.1); border: 1px solid var(--border-color); color: #ffffff; cursor: pointer;">📋 Copiar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Academic & Geographical Info Grid -->
                <div style="background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                    <h4 style="font-family: var(--font-heading); font-size: 1.05rem; font-weight: 700; color: #ffffff; margin-bottom: 14px;">
                        📌 Datos Académicos y de Contacto
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted);">TELÉFONO</div>
                            <div style="font-weight: 600; color: #34d399; margin-top: 2px;">💬 ${user.phone || "No registrado"}</div>
                        </div>
                        <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted);">ESTADO (GIS VENEZUELA)</div>
                            <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">📍 ${user.stateOrigin || "Venezuela"} (${stateCapital})</div>
                        </div>
                        <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted);">AÑO DE INGRESO</div>
                            <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">📅 ${user.enrollmentYear || "2026"}</div>
                        </div>
                        <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
                            <div style="font-size: 0.72rem; color: var(--text-muted);">AÑO DE LA CARRERA</div>
                            <div style="font-weight: 600; color: var(--text-primary); margin-top: 2px;">🎓 ${user.currentYear || "2do Año"}</div>
                        </div>
                        <div style="padding: 10px 12px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color); grid-column: 1/-1;">
                            <div style="font-size: 0.72rem; color: var(--text-muted);">MÉTRICAS DE ACTIVIDAD</div>
                            <div style="display: flex; gap: 16px; margin-top: 6px; font-size: 0.85rem;">
                                <span>🤖 <strong>${(log.aiChats || []).length}</strong> Consultas IA</span>
                                <span>📥 <strong>${(log.downloads || []).length}</strong> Recursos Descargados</span>
                                <span>🧭 <strong>${(log.navigation || []).length}</strong> Secciones Visitadas</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: 10px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
                    ${user.role !== "superuser" ? `
                        <button onclick="handleDeleteUser('${user.email}', '${user.name}');" style="padding: 10px 18px; font-size: 0.88rem; border-radius: var(--border-radius-sm); background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; color: #fca5a5; font-weight: 700; cursor: pointer; margin-right: auto;">
                            🗑️ Eliminar Estudiante
                        </button>
                    ` : ''}
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="gis-whatsapp-btn" style="padding: 10px 18px; font-size: 0.88rem;">
                        💬 Abrir WhatsApp
                    </a>
                    <button class="gis-deep-btn" onclick="document.getElementById('studentFullInfoModal').classList.remove('active'); openDeepInfoModal('${user.email}');" style="padding: 10px 18px; font-size: 0.88rem;">
                        🔍 Ver Auditoría Profunda
                    </button>
                </div>
            </div>
        `;

        modal.classList.add("active");
    }

    // ==========================================
    // PASSWORD VISIBILITY TOGGLE LOGIC
    // ==========================================

    function initPasswordToggles() {
        const toggles = document.querySelectorAll(".toggle-password-btn");
        toggles.forEach(btn => {
            btn.addEventListener("click", function() {
                const targetId = btn.getAttribute("data-target");
                const input = document.getElementById(targetId);
                if (input) {
                    if (input.type === "password") {
                        input.type = "text";
                        btn.textContent = "🙈";
                    } else {
                        input.type = "password";
                        btn.textContent = "👁️";
                    }
                }
            });
        });
    }
});
