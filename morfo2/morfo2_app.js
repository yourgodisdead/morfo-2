// Morfofisiología Humana II - Application Logic (Single Page Application Controller)

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Local Database of Users
    if (!localStorage.getItem("morfo2_users")) {
        const defaultUsers = [
            {
                name: "Leonardo Morales",
                email: "lams210488@gmail.com",
                password: "bazzinga123",
                role: "superuser",
                photo: ""
            }
        ];
        localStorage.setItem("morfo2_users", JSON.stringify(defaultUsers));
    } else {
        // Migration: Update existing superuser credentials in localStorage
        try {
            const users = JSON.parse(localStorage.getItem("morfo2_users"));
            const superuser = users.find(u => u.role === "superuser");
            if (superuser) {
                if (superuser.email === "admin@morfo.com" || superuser.name === "Superusuario Administrador") {
                    superuser.name = "Leonardo Morales";
                    superuser.email = "lams210488@gmail.com";
                    superuser.password = "bazzinga123";
                    localStorage.setItem("morfo2_users", JSON.stringify(users));
                    
                    // Clear active session if logged in as the old admin
                    if (localStorage.getItem("morfo2_session") === "admin@morfo.com") {
                        localStorage.removeItem("morfo2_session");
                    }
                }
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
        currentUser: null
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

        // Trigger section specific initializations if needed
        if (sectionId === "orientadoras") {
            renderOrientadoras();
        } else if (sectionId === "laminarios" || sectionId === "atlas") {
            renderLaminarios();
        } else if (sectionId === "perfil") {
            renderProfile();
        } else if (sectionId === "admin") {
            renderAdmin();
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
                        <a href="${ppt.file}" download class="download-btn" style="width: 100%; justify-content: center;">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>Descargar Presentación (${ppt.size})</span>
                        </a>
                    </div>
                `;

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
    // AUTHENTICATION & SESSION MANAGEMENT
    // ==========================================

    function initAuth() {
        const sessionEmail = localStorage.getItem("morfo2_session");
        
        if (sessionEmail) {
            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            const user = users.find(u => u.email === sessionEmail);
            if (user) {
                state.currentUser = user;
                loginOverlay.classList.remove("active");
                setupUserUI();
                return;
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
                loginOverlay.classList.remove("active");
                
                // Reset to home section
                showSection("inicio");
                setupUserUI();
                
                // Clear form
                loginEmail.value = "";
                loginPassword.value = "";
            } else {
                loginError.style.display = "block";
            }
        });
        
        // Handle logout - listener is set in setupUserUI
    }

    function setupUserUI() {
        if (!state.currentUser) return;
        
        // Register logout listener only once
        if (!logoutBtn._listenerAdded) {
            logoutBtn.addEventListener("click", function() {
                localStorage.removeItem("morfo2_session");
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
    // USER PROFILE PANEL LOGIC
    // ==========================================

    function initProfile() {
        const photoUploadInput = document.getElementById("photoUploadInput");
        
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
        
        // Set info
        profilePageName.textContent = state.currentUser.name;
        profilePageRoleBadge.textContent = state.currentUser.role === "superuser" ? "Superusuario" : "Estudiante";
        
        profileDetailName.textContent = state.currentUser.name;
        profileDetailEmail.textContent = state.currentUser.email;
        profileDetailRole.textContent = state.currentUser.role === "superuser" ? "Superusuario Administrador" : "Estudiante";
        
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        profilePageAvatar.src = state.currentUser.photo || defaultAvatar;
    }

    // ==========================================
    // USER ADMINISTRATION PANEL LOGIC
    // ==========================================

    function initAdmin() {
        const registerUserForm = document.getElementById("registerUserForm");
        const regName = document.getElementById("regName");
        const regEmail = document.getElementById("regEmail");
        const regPassword = document.getElementById("regPassword");
        const regSuccess = document.getElementById("regSuccess");
        
        registerUserForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const nameVal = regName.value.trim();
            const emailVal = regEmail.value.trim().toLowerCase();
            const passVal = regPassword.value;
            
            const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
            
            // Check if user already exists
            if (users.some(u => u.email === emailVal)) {
                alert("Este correo electrónico ya está registrado.");
                return;
            }
            
            // Add new student
            users.push({
                name: nameVal,
                email: emailVal,
                password: passVal,
                role: "estudiante",
                photo: ""
            });
            
            localStorage.setItem("morfo2_users", JSON.stringify(users));
            
            // Success status
            regSuccess.style.display = "block";
            setTimeout(() => { regSuccess.style.display = "none"; }, 4000);
            
            // Clear inputs
            regName.value = "";
            regEmail.value = "";
            regPassword.value = "";
            
            // Refresh counts and tables
            renderAdmin();
        });
    }

    function renderAdmin() {
        const adminUserCount = document.getElementById("adminUserCount");
        const usersTableBody = document.getElementById("usersTableBody");
        
        const users = JSON.parse(localStorage.getItem("morfo2_users") || "[]");
        
        // Show counts
        adminUserCount.textContent = users.length;
        
        // Render rows
        usersTableBody.innerHTML = "";
        const defaultAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236b7280'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
        
        users.forEach(user => {
            const tr = document.createElement("tr");
            const photoSrc = user.photo || defaultAvatar;
            const displayRole = user.role === "superuser" ? "Superusuario" : "Estudiante";
            
            tr.innerHTML = `
                <td style="padding: 12px 16px;"><img class="table-avatar" src="${photoSrc}" alt="Avatar"></td>
                <td style="padding: 12px 16px; font-weight: 600;">${user.name}</td>
                <td style="padding: 12px 16px; color: var(--text-secondary);">${user.email}</td>
                <td style="padding: 12px 16px; font-family: monospace; font-size: 0.95rem; letter-spacing: 0.5px;">${user.password}</td>
                <td style="padding: 12px 16px;"><span class="hero-tag" style="margin-bottom: 0;">${displayRole}</span></td>
            `;
            
            usersTableBody.appendChild(tr);
        });
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
