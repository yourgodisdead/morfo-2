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
    initHabilidades();
    initAtlas();
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
        if (sectionId === "atlas") {
            renderAtlas();
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
                // Orientación might span multiple documents or pages.
                // We combine all pages of the first orientacion doc.
                let html = `<h2>Guía de Orientación al Contenido</h2>`;
                weekObj.orientaciones[0].pages.forEach((pageText, idx) => {
                    html += `<div class="reading-pane" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: ${idx < weekObj.orientaciones[0].pages.length - 1 ? '1px dashed var(--border-color)' : 'none'}">`;
                    html += pageText.split("\n").map(line => line.trim() ? `<p>${line}</p>` : "").join("");
                    html += `</div>`;
                });
                contentContainer.innerHTML = html;
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de orientación para esta semana.</p>`;
            }
        } 
        else if (tab === "practica") {
            if (weekObj.practicas && weekObj.practicas.length > 0) {
                let html = `<h2>Guía de Práctica Docente</h2>`;
                weekObj.practicas[0].pages.forEach((pageText, idx) => {
                    html += `<div class="reading-pane" style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: ${idx < weekObj.practicas[0].pages.length - 1 ? '1px dashed var(--border-color)' : 'none'}">`;
                    html += pageText.split("\n").map(line => line.trim() ? `<p>${line}</p>` : "").join("");
                    html += `</div>`;
                });
                contentContainer.innerHTML = html;
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de práctica docente para esta semana.</p>`;
            }
        } 
        else if (tab === "consolidacion") {
            if (weekObj.consolidaciones && weekObj.consolidaciones.length > 0) {
                // Extract questions. Since they are formatted inside pages, let's list pages of exercises
                // and give the student an interactive response block.
                let html = `<h2>Ejercicios de Consolidación</h2><p class="text-muted" style="margin-bottom: 20px;">Utiliza los cuadros de abajo para escribir tus apuntes y respuestas. Se guardan automáticamente.</p>`;
                
                let combinedText = weekObj.consolidaciones[0].pages.join("\n");
                
                // Let's split by numbered questions: e.g., "1.", "2.", "3.", etc.
                // We'll look for lines starting with "1. ", "2. ", "3. ", "4. ", "5. ", "6. ", "7. ", "8. "
                // To keep it simple and preserve formatting, we can split by numbered patterns or just list pages with editable notes.
                // A very neat way is to extract the paragraphs that look like questions, or split by lines that start with numbers.
                let lines = combinedText.split("\n");
                let questions = [];
                let currentQuestion = "";
                
                lines.forEach(line => {
                    line = line.trim();
                    if (/^\d+\.\s+/.test(line)) {
                        // Starts a new question
                        if (currentQuestion) questions.push(currentQuestion);
                        currentQuestion = line;
                    } else if (currentQuestion && line) {
                        // Append to current question
                        currentQuestion += " " + line;
                    }
                });
                if (currentQuestion) questions.push(currentQuestion);
                
                if (questions.length > 0) {
                    questions.forEach((qText, index) => {
                        const localStorageKey = `morfo2_notes_w${state.currentWeek}_q${index}`;
                        const savedNote = localStorage.getItem(localStorageKey) || "";
                        
                        html += `
                            <div class="question-block">
                                <div class="question-text">${qText}</div>
                                <textarea class="notes-area" data-key="${localStorageKey}" placeholder="Escribe tu respuesta o apuntes de estudio aquí...">${savedNote}</textarea>
                            </div>
                        `;
                    });
                } else {
                    // Fallback to text blocks
                    html += `<div class="reading-pane">${combinedText.split("\n").map(l => l.trim() ? `<p>${l}</p>` : "").join("")}</div>`;
                    
                    const localStorageKey = `morfo2_notes_w${state.currentWeek}_general`;
                    const savedNote = localStorage.getItem(localStorageKey) || "";
                    html += `
                        <div class="question-block">
                            <div class="question-text">Cuaderno de Estudio de la Semana</div>
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
                <p style="margin-bottom: 24px;">Descarga los documentos originales en formato PDF que venían en el CD de estudio de medicina de segundo año:</p>
                <div class="downloads-container">
            `;
            
            // Add Orientación files
            if (weekObj.orientaciones) {
                weekObj.orientaciones.forEach(doc => {
                    const url = getPdfUrl(state.currentWeek, "orientaciones", doc.filename);
                    html += `
                        <a href="${url}" target="_blank" class="download-btn">
                            <svg viewBox="0 0 24 24"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/></svg>
                            <span>${doc.filename} (Orientación)</span>
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

    // ==========================================
    // ANATOMICAL ATLAS / IMAGES GALLERY
    // ==========================================

    function initAtlas() {
        const searchInput = document.getElementById("atlasSearchInput");
        const pageSelector = document.getElementById("atlasPageSelector");

        // Set up search listener
        searchInput.addEventListener("input", function() {
            state.atlasSearch = searchInput.value.trim().toLowerCase();
            renderAtlas();
        });

        // Set up page buttons (1 to 28)
        pageSelector.innerHTML = "";
        for (let p = 1; p <= 28; p++) {
            const btn = document.createElement("button");
            btn.className = `page-num-btn ${p === state.currentAtlasPage ? 'active' : ''}`;
            btn.textContent = `Pág. ${p}`;
            btn.addEventListener("click", () => {
                state.currentAtlasPage = p;
                state.atlasSearch = ""; // Clear search on page change
                searchInput.value = "";
                
                document.querySelectorAll(".page-num-btn").forEach(el => el.classList.remove("active"));
                btn.classList.add("active");
                renderAtlas();
            });
            pageSelector.appendChild(btn);
        }
    }

    function renderAtlas() {
        const grid = document.getElementById("atlasGrid");
        grid.innerHTML = "";

        if (typeof GALLERY_DATA === "undefined") {
            grid.innerHTML = `<p class="text-muted">Datos del atlas no cargados. Revisa gallery_data.js</p>`;
            return;
        }

        let figuresToShow = [];

        if (state.atlasSearch !== "") {
            // Search across ALL pages
            GALLERY_DATA.forEach(p => {
                p.figures.forEach(fig => {
                    if (fig.label.toLowerCase().includes(state.atlasSearch)) {
                        figuresToShow.push({
                            page: p.page,
                            label: fig.label,
                            src: fig.src
                        });
                    }
                });
            });
        } else {
            // Just show current page
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
            grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">Ninguna figura coincide con la búsqueda "${state.atlasSearch}".</p>`;
            return;
        }

        figuresToShow.forEach(fig => {
            const card = document.createElement("div");
            card.className = "atlas-card";
            
            // Format labels like "Figura 721"
            const displayLabel = isNaN(fig.label) ? fig.label : `Fig. ${fig.label}`;
            
            card.innerHTML = `
                <div class="atlas-img-wrapper">
                    <img class="atlas-img" src="${fig.src}" alt="${displayLabel}" loading="lazy">
                </div>
                <div class="atlas-card-info">
                    <span class="atlas-card-title">${displayLabel}</span>
                    <span class="atlas-card-badge">Pág. ${fig.page}</span>
                </div>
            `;
            
            card.addEventListener("click", () => {
                openLightbox(fig.src, displayLabel);
            });
            
            grid.appendChild(card);
        });
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
                let html = `
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                        <span style="font-size: 3rem;">${iconMap[name] || "📚"}</span>
                        <h2 style="font-size: 2rem; font-family: var(--font-heading); font-weight: 800;">Habilidad: ${name}</h2>
                    </div>
                    <div class="reading-pane" style="background: var(--bg-card); padding: 32px; border-radius: var(--border-radius-lg); border: 1px solid var(--border-color);">
                        ${habs[name]}
                    </div>
                `;
                detailsContainer.innerHTML = html;
                detailsContainer.scrollIntoView({ behavior: 'smooth' });
            });

            grid.appendChild(card);
        });

        // Load Analizar as default detail
        if (habs["Analizar"]) {
            detailsContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 24px;">
                    <span style="font-size: 3rem;">🔍</span>
                    <h2 style="font-size: 2rem; font-family: var(--font-heading); font-weight: 800;">Habilidad: Analizar</h2>
                </div>
                <div class="reading-pane" style="background: var(--bg-card); padding: 32px; border-radius: var(--border-radius-lg); border: 1px solid var(--border-color);">
                    ${habs["Analizar"]}
                </div>
            `;
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

    function openLightbox(src, title) {
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightbox.classList.add("active");
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightboxImg.src = "";
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
        
        // Handle logout
        logoutBtn.addEventListener("click", function() {
            localStorage.removeItem("morfo2_session");
            window.location.reload();
        });
    }

    function setupUserUI() {
        if (!state.currentUser) return;
        
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
