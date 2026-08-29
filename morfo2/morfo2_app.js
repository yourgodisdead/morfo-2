// Morfofisiología Humana II - Application Logic (Single Page Application Controller)

document.addEventListener("DOMContentLoaded", function() {
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

    // Initialize Local Database of Users
    if (!localStorage.getItem("morfo2_users")) {
        const defaultUsers = [
            {
                name: "Leonardo Morales",
                email: "lams210488@gmail.com",
                password: "bazzinga123",
                phone: "+584129031966",
                stateOrigin: "Distrito Capital",
                enrollmentYear: "2020",
                currentYear: "Docente / Superusuario",
                role: "superuser",
                photo: "",
                activityLog: {
                    aiChats: [],
                    downloads: [],
                    navigation: [{ section: "admin", name: "Panel de Administración", timestamp: new Date().toISOString() }],
                    notes: []
                }
            },
            {
                name: "Ana Gabriela Rivas",
                email: "ana.rivas@estudiante.morfo.edu.ve",
                password: "estudiante123",
                phone: "+584146123456",
                stateOrigin: "Zulia",
                enrollmentYear: "2024",
                currentYear: "2do Año",
                role: "usuario",
                photo: "",
                activityLog: {
                    aiChats: [
                        {
                            query: "¿Cuál es la función del haz corticoespinal lateral en los movimientos finos?",
                            reply: "El haz corticoespinal lateral (o vía piramidal cruzada) transporta las órdenes motoras voluntarias desde la corteza motora primaria hacia las motoneuronas del asta anterior medular, encargándose con precisión milimétrica de los movimientos finos y distales (como la destreza de los dedos de las manos).",
                            topic: "orientadoras",
                            timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
                        }
                    ],
                    downloads: [
                        { filename: "MFH II - AO 01.pdf", type: "Clase Orientadora", count: 3, lastDate: new Date(Date.now() - 3600000 * 24).toISOString() },
                        { filename: "Laminario-Basico.ppt", type: "Diapositivas", count: 1, lastDate: new Date(Date.now() - 3600000 * 48).toISOString() }
                    ],
                    navigation: [
                        { section: "inicio", name: "Inicio", timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
                        { section: "orientadoras", name: "Clases Orientadoras", timestamp: new Date(Date.now() - 3600000 * 20).toISOString() },
                        { section: "temario", name: "Semana 1 - Temario", timestamp: new Date(Date.now() - 3600000 * 5).toISOString() }
                    ],
                    notes: []
                }
            },
            {
                name: "Carlos Mendoza",
                email: "carlos.mendoza@estudiante.morfo.edu.ve",
                password: "estudiante123",
                phone: "+584247654321",
                stateOrigin: "Carabobo",
                enrollmentYear: "2025",
                currentYear: "2do Año",
                role: "usuario",
                photo: "",
                activityLog: {
                    aiChats: [
                        {
                            query: "¿Cómo diferenciar una neurona pseudounipolar de una multipolar en el preparado histológico?",
                            reply: "En el preparado histológico: la neurona pseudounipolar (típica del ganglio espinal sensitivo) presenta un soma esférico u ovoide con núcleo central y una sola prolongación que se bifurca en T, mientras que la neurona multipolar (como las motoneuronas del asta anterior o las células piramidales) exhibe múltiples dendritas ramificadas y un soma poligonal.",
                            topic: "laminarios",
                            timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
                        }
                    ],
                    downloads: [
                        { filename: "MFH II - AO 02.pdf", type: "Clase Orientadora", count: 2, lastDate: new Date(Date.now() - 3600000 * 12).toISOString() }
                    ],
                    navigation: [
                        { section: "laminarios", name: "Laminarios y Atlas", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() }
                    ],
                    notes: []
                }
            },
            {
                name: "Valeria Sofía Blanco",
                email: "valeria.blanco@estudiante.morfo.edu.ve",
                password: "estudiante123",
                phone: "+584165551234",
                stateOrigin: "Lara",
                enrollmentYear: "2024",
                currentYear: "2do Año",
                role: "usuario",
                photo: "",
                activityLog: {
                    aiChats: [],
                    downloads: [
                        { filename: "MFH II - AO 04.pdf", type: "Clase Orientadora", count: 1, lastDate: new Date(Date.now() - 3600000 * 30).toISOString() }
                    ],
                    navigation: [
                        { section: "habilidades", name: "Habilidades", timestamp: new Date(Date.now() - 3600000 * 30).toISOString() }
                    ],
                    notes: []
                }
            },
            {
                name: "José Alejandro Castillo",
                email: "jose.castillo@estudiante.morfo.edu.ve",
                password: "estudiante123",
                phone: "+584128889900",
                stateOrigin: "Mérida",
                enrollmentYear: "2025",
                currentYear: "2do Año",
                role: "usuario",
                photo: "",
                activityLog: {
                    aiChats: [],
                    downloads: [],
                    navigation: [{ section: "inicio", name: "Inicio", timestamp: new Date().toISOString() }],
                    notes: []
                }
            }
        ];
        localStorage.setItem("morfo2_users", JSON.stringify(defaultUsers));
    } else {
        // Migration: Ensure all existing users have stateOrigin and activityLog
        try {
            const users = JSON.parse(localStorage.getItem("morfo2_users"));
            let modified = false;
            users.forEach(u => {
                if (!u.stateOrigin) {
                    u.stateOrigin = (u.role === "superuser") ? "Distrito Capital" : "Zulia";
                    modified = true;
                }
                if (!u.phone) {
                    u.phone = "+584129031966";
                    modified = true;
                }
                if (!u.enrollmentYear) {
                    u.enrollmentYear = "2026";
                    modified = true;
                }
                if (!u.currentYear) {
                    u.currentYear = "2do Año";
                    modified = true;
                }
                if (!u.activityLog) {
                    u.activityLog = { aiChats: [], downloads: [], navigation: [], notes: [] };
                    modified = true;
                }
                // Ensure only Leonardo is superuser, all others are usuario
                if (u.email === "lams210488@gmail.com") {
                    u.role = "superuser";
                } else if (u.role !== "usuario") {
                    u.role = "usuario";
                    modified = true;
                }
            });
            if (modified) {
                localStorage.setItem("morfo2_users", JSON.stringify(users));
            }
        } catch (e) {
            console.error("Migration error:", e);
        }
    }

    // Current application state
    const state = {
        currentSection: "inicio",
        currentWeek: 1,
        currentWeekTab: "orientacion",
        currentAO: 1,
        aoSearch: "",
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
                        <a href="${ao.pdfFile}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.22)); border-color: var(--accent-color); color: var(--accent-hover);">
                            <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
                            <span>${ao.ao}: ${ao.title} (Clase Orientadora)</span>
                        </a>
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

            // Telemetry hook on downloads
            contentContainer.querySelectorAll(".download-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const text = btn.textContent.trim();
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
                    <div class="ao-viewer-actions">
                        <a href="${currentAoObj.pdfFile}" target="_blank" class="download-btn" style="background: var(--accent-gradient); color: white;">
                            <svg viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
                            <span>Abrir Documento en Pantalla Completa</span>
                        </a>
                        <a href="${currentAoObj.pdfFile}" download class="download-btn">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>Descargar PDF</span>
                        </a>
                    </div>
                </div>

                <div class="ao-pdf-frame-wrapper">
                    <iframe class="ao-pdf-frame" src="${currentAoObj.pdfFile}#toolbar=1&navpanes=0"></iframe>
                </div>
            `;

            // Telemetry hook on AO downloads
            viewerContainer.querySelectorAll(".download-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    trackUserActivity("download", {
                        filename: `${currentAoObj.ao} - ${currentAoObj.title}.pdf`,
                        type: "Clase Orientadora"
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
                        <a href="${ppt.file}" download class="download-btn ppt-download-link" data-filename="${ppt.title} (${ppt.format})" style="width: 100%; justify-content: center;">
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
        
        // Save token into user's database record
        const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
        const idx = users.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            users[idx].activeSessionToken = token;
            localStorage.setItem("morfo2_users", JSON.stringify(users));
            user.activeSessionToken = token;
        }
        state.currentUser = user;
        return token;
    }

    function startSessionWatcher() {
        if (sessionWatcherInterval) clearInterval(sessionWatcherInterval);

        function checkActiveSession() {
            if (!state.currentUser) return;
            const localToken = localStorage.getItem("morfo2_session_token");
            if (!localToken) return;

            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            const freshUser = users.find(u => u.email === state.currentUser.email);
            if (freshUser && freshUser.activeSessionToken && freshUser.activeSessionToken !== localToken) {
                // Another device or browser window logged in with this account
                terminateConcurrentSession();
            }
        }

        // Storage event listener triggers instantly across tabs/windows
        window.addEventListener("storage", function(e) {
            if (e.key === "morfo2_users" || e.key === "morfo2_session_token") {
                checkActiveSession();
            }
        });

        // Window focus and heartbeat every 2.5s
        window.addEventListener("focus", checkActiveSession);
        sessionWatcherInterval = setInterval(checkActiveSession, 2500);
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
        if (!user || user.role === "superuser") return; // Superuser bypasses check

        const isComplete = (
            user.name && user.name.trim().length >= 3 &&
            user.phone && user.phone.trim().length >= 7 &&
            user.stateOrigin && user.stateOrigin.trim() !== "" &&
            user.enrollmentYear && user.enrollmentYear.trim() !== "" &&
            user.currentYear && user.currentYear.trim() !== ""
        );

        const modal = document.getElementById("completeProfileModal");
        if (!isComplete && modal) {
            // Populate Venezuelan States dropdown if not populated
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

            // Prefill any existing fields
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
            reloginBtn.addEventListener("click", () => {
                window.location.reload();
            });
        }

        if (form) {
            form.addEventListener("submit", function(e) {
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

                // Update user in localStorage
                const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
                const idx = users.findIndex(u => u.email === state.currentUser.email);
                if (idx !== -1) {
                    users[idx].name = nameVal;
                    users[idx].phone = phoneVal;
                    users[idx].stateOrigin = stateVal;
                    users[idx].enrollmentYear = enrollVal;
                    users[idx].currentYear = curYearVal;
                    localStorage.setItem("morfo2_users", JSON.stringify(users));

                    state.currentUser = users[idx];
                    setupUserUI();
                    renderProfile();
                    renderAdmin();
                    renderGisMap();

                    trackUserActivity("navigation", {
                        section: "perfil_actualizado",
                        name: "Datos de Estudiante Completados"
                    });
                }

                if (modal) modal.classList.remove("active");
            });
        }
    }

    function initAuth() {
        const sessionEmail = localStorage.getItem("morfo2_session");
        const sessionToken = localStorage.getItem("morfo2_session_token");
        
        if (sessionEmail) {
            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            const user = users.find(u => u.email === sessionEmail);
            if (user) {
                // If user doesn't have an active token or tokens match, restore session
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
                    // Stale / concurrent session from another device
                    terminateConcurrentSession();
                    return;
                }
            }
        }
        
        // If not logged in, show overlay and lock sidebar
        loginOverlay.classList.add("active");
        userSidebarProfile.style.display = "none";
        logoutBtn.style.display = "none";
        navProfile.style.display = "none";
        navAdmin.style.display = "none";
        
        // Handle login form submission
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const emailVal = loginEmail.value.trim().toLowerCase();
            const passVal = loginPassword.value;
            
            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            const user = users.find(u => u.email === emailVal && u.password === passVal);
            
            if (user) {
                loginError.style.display = "none";
                state.currentUser = user;
                localStorage.setItem("morfo2_session", user.email);
                
                // Generate and enforce unique active session token
                createAndSaveSessionToken(user);
                
                loginOverlay.classList.remove("active");
                
                // Reset to home section
                showSection("inicio");
                setupUserUI();
                startSessionWatcher();
                checkProfileCompleteness(user);
                
                // Clear form
                loginEmail.value = "";
                loginPassword.value = "";
            } else {
                loginError.style.display = "block";
            }
        });
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
        
        // Update user text
        sidebarUsername.textContent = state.currentUser.name;
        sidebarRole.textContent = state.currentUser.role === "superuser" ? "Superusuario" : "Estudiante";
        
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

    function trackUserActivity(type, data) {
        if (!state.currentUser) return;
        
        try {
            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            const userIdx = users.findIndex(u => u.email === state.currentUser.email);
            if (userIdx === -1) return;
            
            const user = users[userIdx];
            if (!user.activityLog) {
                user.activityLog = { aiChats: [], downloads: [], navigation: [], notes: [] };
            }
            
            const now = new Date().toISOString();
            
            if (type === "navigation") {
                user.activityLog.navigation.unshift({
                    section: data.section,
                    name: data.name || data.section,
                    timestamp: now
                });
                if (user.activityLog.navigation.length > 60) user.activityLog.navigation.pop();
            } 
            else if (type === "download") {
                const existing = user.activityLog.downloads.find(d => d.filename === data.filename);
                if (existing) {
                    existing.count = (existing.count || 1) + 1;
                    existing.lastDate = now;
                } else {
                    user.activityLog.downloads.unshift({
                        filename: data.filename,
                        type: data.type || "Documento PDF",
                        count: 1,
                        lastDate: now
                    });
                }
            }
            else if (type === "ai_chat") {
                user.activityLog.aiChats.unshift({
                    query: data.query,
                    reply: data.reply,
                    topic: data.topic || state.currentSection,
                    timestamp: now
                });
                if (user.activityLog.aiChats.length > 100) user.activityLog.aiChats.pop();
            }
            else if (type === "notes_saved") {
                const existingNote = user.activityLog.notes.find(n => n.week === data.week);
                if (existingNote) {
                    existingNote.lastUpdated = now;
                } else {
                    user.activityLog.notes.unshift({
                        week: data.week,
                        lastUpdated: now
                    });
                }
            }
            
            localStorage.setItem("morfo2_users", JSON.stringify(users));
            state.currentUser = user;
        } catch (e) {
            console.error("Tracking error:", e);
        }
    }

    // ==========================================
    // USER PROFILE PANEL LOGIC
    // ==========================================

    function initProfile() {
        const photoUploadInput = document.getElementById("photoUploadInput");
        if (!photoUploadInput) return;
        
        photoUploadInput.addEventListener("change", function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Data = event.target.result;
                
                // Update active user in localStorage
                const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
                const userIdx = users.findIndex(u => u.email === state.currentUser.email);
                
                if (userIdx !== -1) {
                    users[userIdx].photo = base64Data;
                    localStorage.setItem("morfo2_users", JSON.stringify(users));
                    
                    // Update state and UI
                    state.currentUser.photo = base64Data;
                    setupUserUI();
                    renderProfile();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    function renderProfile() {
        if (!state.currentUser) return;
        
        const profilePageAvatar = document.getElementById("profilePageAvatar");
        const profilePageName = document.getElementById("profilePageName");
        const profilePageRoleBadge = document.getElementById("profilePageRoleBadge");
        
        const profileDetailName = document.getElementById("profileDetailName");
        const profileDetailEmail = document.getElementById("profileDetailEmail");
        const profileDetailRole = document.getElementById("profileDetailRole");
        const profileDetailPhone = document.getElementById("profileDetailPhone");
        const profileDetailState = document.getElementById("profileDetailState");
        const profileDetailEnrollment = document.getElementById("profileDetailEnrollment");
        const profileDetailCurrentYear = document.getElementById("profileDetailCurrentYear");
        
        // Set info
        if (profilePageName) profilePageName.textContent = state.currentUser.name;
        if (profilePageRoleBadge) profilePageRoleBadge.textContent = state.currentUser.role === "superuser" ? "Superusuario" : "Estudiante";
        
        if (profileDetailName) profileDetailName.textContent = state.currentUser.name;
        if (profileDetailEmail) profileDetailEmail.textContent = state.currentUser.email;
        if (profileDetailRole) profileDetailRole.textContent = state.currentUser.role === "superuser" ? "Superusuario Administrador" : "Estudiante";
        if (profileDetailPhone) profileDetailPhone.textContent = state.currentUser.phone || "No registrado";
        if (profileDetailState) profileDetailState.textContent = state.currentUser.stateOrigin || "Venezuela";
        if (profileDetailEnrollment) profileDetailEnrollment.textContent = state.currentUser.enrollmentYear || "2026";
        if (profileDetailCurrentYear) profileDetailCurrentYear.textContent = state.currentUser.currentYear || "2do Año (Morfo II)";
        
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        if (profilePageAvatar) profilePageAvatar.src = state.currentUser.photo || defaultAvatar;
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
            registerUserForm.addEventListener("submit", function(e) {
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

                const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
                
                // Check if user already exists
                if (users.some(u => u.email === emailVal)) {
                    alert("Este correo electrónico ya está registrado en el sistema.");
                    return;
                }
                
                // Strict Rule: Every new registered user is ALWAYS assigned role: "usuario"
                users.push({
                    name: nameVal,
                    phone: phoneVal,
                    email: emailVal,
                    stateOrigin: stateVal,
                    enrollmentYear: enrollVal,
                    currentYear: curYearVal,
                    password: passVal,
                    role: "usuario",
                    photo: "",
                    activityLog: {
                        aiChats: [],
                        downloads: [],
                        navigation: [{ section: "inicio", name: "Inicio", timestamp: new Date().toISOString() }],
                        notes: []
                    }
                });
                
                localStorage.setItem("morfo2_users", JSON.stringify(users));
                
                // Success status
                if (regSuccess) {
                    regSuccess.style.display = "block";
                    setTimeout(() => { regSuccess.style.display = "none"; }, 4000);
                }
                
                // Clear inputs
                regName.value = "";
                regPhone.value = "";
                regEmail.value = "";
                regStateOrigin.selectedIndex = 0;
                regPassword.value = "";
                
                // Refresh counts, tables, and GIS map
                renderAdmin();
                renderGisMap();
            });
        }

        // Live search in users table
        if (adminUsersTableSearch) {
            adminUsersTableSearch.addEventListener("input", function() {
                renderAdmin(adminUsersTableSearch.value.trim().toLowerCase());
            });
        }
    }

    function renderAdmin(searchQuery = "") {
        const adminUserCount = document.getElementById("adminUserCount");
        const adminMappedStatesCount = document.getElementById("adminMappedStatesCount");
        const adminAiQueriesCount = document.getElementById("adminAiQueriesCount");
        const adminTotalDownloadsCount = document.getElementById("adminTotalDownloadsCount");
        const usersTableBody = document.getElementById("usersTableBody");
        if (!usersTableBody) return;
        
        const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
        
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
                (u.stateOrigin && u.stateOrigin.toLowerCase().includes(searchQuery))
            );
        }

        // Render rows
        usersTableBody.innerHTML = "";
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        
        filteredUsers.forEach(user => {
            const tr = document.createElement("tr");
            const photoSrc = user.photo || defaultAvatar;
            const displayRole = user.role === "superuser" ? "Superusuario" : "Estudiante";
            const cleanPhone = (user.phone || "+584129031966").replace(/\D/g, "");
            const waLink = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(user.name)},%20te%20escribo%20desde%20la%20coordinaci%C3%B3n%20de%20Morfofisiolog%C3%ADa%20II`;
            
            tr.innerHTML = `
                <td style="padding: 12px 14px;"><img class="table-avatar" src="${photoSrc}" alt="Avatar"></td>
                <td style="padding: 12px 14px; font-weight: 600; color: var(--text-primary);">${user.name}</td>
                <td style="padding: 12px 14px;">
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; color: #34d399; font-weight: 600; text-decoration: none;">
                        <span>💬</span> ${user.phone || "+58 412-9031966"}
                    </a>
                </td>
                <td style="padding: 12px 14px; color: var(--text-secondary);">${user.email}</td>
                <td style="padding: 12px 14px;"><span class="system-badge">${user.stateOrigin || "Venezuela"}</span></td>
                <td style="padding: 12px 14px;"><span class="ao-badge">${user.currentYear || "2do Año"}</span></td>
                <td style="padding: 12px 14px; color: var(--text-secondary);">${user.enrollmentYear || "2026"}</td>
                <td style="padding: 12px 14px;"><span class="hero-tag" style="margin-bottom: 0;">${displayRole}</span></td>
                <td style="padding: 12px 14px; text-align: center;">
                    <button class="gis-deep-btn" data-user-email="${user.email}" title="Ver auditoría completa de descargas y consultas IA">
                        🔍 Info Profunda
                    </button>
                </td>
            `;
            
            usersTableBody.appendChild(tr);
        });

        // Add event listeners to deep info buttons
        usersTableBody.querySelectorAll(".gis-deep-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const email = btn.getAttribute("data-user-email");
                openDeepInfoModal(email);
            });
        });
    }

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

        // Use CartoDB Dark Matter / Positron tiles for high-end contrast
        const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
        L.tileLayer(tileLayerUrl, {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &bull; Morfofisiología II GIS',
            subdomains: 'abcd',
            maxZoom: 19
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

    function renderGisMap() {
        if (!state.gisMap || !state.gisMarkersLayer) return;

        // Invalidate map size so it renders smoothly even if container was hidden
        setTimeout(() => { state.gisMap.invalidateSize(); }, 200);

        state.gisMarkersLayer.clearLayers();
        const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");

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

                const panels = document.querySelectorAll(".deep-tab-panel");
                panels.forEach(p => p.style.display = "none");

                if (targetTab === "aiChat") {
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

    function openDeepInfoModal(userEmail) {
        const modal = document.getElementById("deepInfoModal");
        if (!modal) return;

        const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
        const user = users.find(u => u.email === userEmail);
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
