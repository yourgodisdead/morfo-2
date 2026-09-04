// ============================================================
//  MORFO II - Firebase Configuration
//  Proyecto: morfo2-portal
// ============================================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAR9Uw2yTzeFC3ldqQLu5CFBzzY_3vAXMI",
    authDomain: "morfo2-portal.firebaseapp.com",
    projectId: "morfo2-portal",
    storageBucket: "morfo2-portal.firebasestorage.app",
    messagingSenderId: "940380390237",
    appId: "1:940380390237:web:40b149e0f9aa521d4f5eb4"
};

// ============================================================
//  FIREBASE STORAGE CONFIGURATION & MEDIA RESOLVER
// ============================================================
const USE_FIREBASE_STORAGE = false; // Toggle a true tras sincronizar los PDFs con Firebase Storage
const FIREBASE_STORAGE_BASE = "https://firebasestorage.googleapis.com/v0/b/morfo2-portal.firebasestorage.app/o/";

function resolveMediaUrl(path) {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }
    if (!USE_FIREBASE_STORAGE) {
        return path;
    }
    const encodedPath = encodeURIComponent(path);
    return `${FIREBASE_STORAGE_BASE}${encodedPath}?alt=media`;
}

if (typeof window !== "undefined") {
    window.resolveMediaUrl = resolveMediaUrl;
    window.USE_FIREBASE_STORAGE = USE_FIREBASE_STORAGE;
}

