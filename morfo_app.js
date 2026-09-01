// Morfofisiología Humana - Unified SPA Controller (morfo_app.js)
import {
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
    db_ensureSuperuser,
    db_getAllFeedback,
    db_addFeedback,
    db_replyToFeedback,
    db_toggleFeedbackVisibility,
    db_deleteFeedback
} from "./db.js";
import { getAiTutorResponse } from "./ai_tutor_engine.js?v=20260901_1615";

document.addEventListener("DOMContentLoaded", async function() {
    // Ensure superuser exists in Firestore
    try { await db_ensureSuperuser(); } catch(e) { console.warn("db_ensureSuperuser:", e); }

    // Venezuela 24 Federal Entities Geographic Data for Leaflet GIS Map
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
        "La Guaira": { lat: 10.6014, lng: -66.9328, capital: "La Guaira" },
        "Yaracuy": { lat: 10.3399, lng: -68.7425, capital: "San Felipe" },
        "Zulia": { lat: 10.6427, lng: -71.6125, capital: "Maracaibo" }
    };

    // Current application state
    const state = {
        currentCourse: localStorage.getItem("morfo_active_course") || "morfo2", // 'morfo1', 'morfo2', 'morfo3'
        currentSection: "inicio",
        currentWeek: 1,
        currentWeekTab: "orientacion",
        currentAO: 1,
        aoSearch: "",
        currentLaminarioTab: "histologico", // Default tab, gets overwritten dynamically
        laminarioSearch: "",
        currentLaminarioFilter: "todos",
        currentAtlasPage: 1,
        atlasSearch: "",
        theme: localStorage.getItem("morfo_theme") || "dark",
        currentUser: null,
        gisMap: null,
        gisMarkersLayer: null,
        gisFilterState: "todos",
        gisFilterYear: "todos",
        gisSearchQuery: "",
        currentDeepUser: null,
        currentBibliotecaCategory: "todos",
        bibliotecaSearch: "",
        currentFeedbackFilter: "all",
        adminFeedbackFilter: "all",
        adminFeedbackSearch: "",
        recentMembersFilter: "all",
        recentMembersSearch: ""
    };

    // Apply saved theme on startup
    document.documentElement.setAttribute("data-theme", state.theme);
    // Apply active course attribute to HTML element to trigger CSS color changes
    document.documentElement.setAttribute("data-course", state.stateCourseClass || state.currentCourse);

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

    // Course Buttons DOM
    const btnCourseM1 = document.getElementById("btnCourseM1");
    const btnCourseM2 = document.getElementById("btnCourseM2");
    const btnCourseM3 = document.getElementById("btnCourseM3");

    // Deep Info / Audit Modal DOM
    const deepInfoModal = document.getElementById("deepInfoModal");
    const deepInfoCloseBtn = document.getElementById("deepInfoCloseBtn");

    // Mobile Header & Drawer DOM
    const sidebar = document.getElementById("sidebar");
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const sidebarMobileClose = document.getElementById("sidebarMobileClose");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const mobileThemeBtn = document.getElementById("mobileThemeBtn");

    // Initialize App Modules
    updateThemeToggleUI();
    initCourseSelector();
    initAuth();
    initNavigation();
    initThemeToggle();
    initInicioBooksCarousel();
    initInicioTabs();
    initWeekSelector();
    initOrientadoras();
    initLaminarios();
    initHabilidades();
    initBiblioteca();
    initFeedback();
    initLightbox();
    initProfile();
    initAdmin();
    initAdminFeedback();
    initGisMap();
    initAiTutor();
    initDeepInfoModal();
    initProfileCompleteness();
    initPasswordToggles();

    // Default Load
    showSection(state.currentSection);

    // ==========================================
    // COURSE SELECTOR
    // ==========================================
    function initCourseSelector() {
        const courseBtns = [btnCourseM1, btnCourseM2, btnCourseM3];
        courseBtns.forEach(btn => {
            if (!btn) return;
            btn.addEventListener("click", () => {
                const selected = btn.getAttribute("data-course");
                setCourse(selected);
            });
        });
        updateCourseButtonsUI();
    }

    function setCourse(courseId) {
        state.currentCourse = courseId;
        localStorage.setItem("morfo_active_course", courseId);
        document.documentElement.setAttribute("data-course", courseId);
        
        // Reset navigation to safe state
        state.currentWeek = 1;
        state.currentWeekTab = "orientacion";
        state.currentAO = 1;
        
        // Dynamic tabs reset for Laminarios
        if (courseId === "morfo1") {
            state.currentLaminarioTab = "histologico";
        } else if (courseId === "morfo2") {
            state.currentLaminarioTab = "histologico";
        } else if (courseId === "morfo3") {
            state.currentLaminarioTab = "histologico";
        }

        updateCourseButtonsUI();
        renderCourseHeroDetails();
        renderInicioTabContent();
        initWeekSelector(); // reload weeks layout (15 for Morfo I, 12 for others)
        loadWeek(1);
        renderOrientadoras();
        renderLaminarios();
        
        if (window.innerWidth <= 768) {
            closeMobileSidebar();
        }
        
        // Update IA Tutor welcome message
        const messagesContainer = document.getElementById("aiChatMessages");
        if (messagesContainer) {
            messagesContainer.innerHTML = "";
            renderAiWelcomeMessage();
        }

        // Track subject change
        trackUserActivity("subject_change", { course: courseId });
    }

    function updateCourseButtonsUI() {
        const courseBtns = [btnCourseM1, btnCourseM2, btnCourseM3];
        courseBtns.forEach(btn => {
            if (!btn) return;
            if (btn.getAttribute("data-course") === state.currentCourse) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
    }

    function renderCourseHeroDetails() {
        const inicioHero = document.getElementById("inicioHeroBanner");
        if (!inicioHero) return;

        if (state.currentCourse === "morfo1") {
            inicioHero.innerHTML = `
                <span class="hero-tag">Primer Año de Medicina</span>
                <h2 class="hero-title">Morfofisiología Humana I</h2>
                <p class="hero-subtitle">Portal educativo interactivo para el estudio de Biología Celular, Bioquímica Básica, Tejidos Fundamentales y el Sistema Osteomioarticular. Explora guías oficiales, atlas interactivos y autoevaluaciones.</p>
            `;
        } else if (state.currentCourse === "morfo2") {
            inicioHero.innerHTML = `
                <span class="hero-tag">Segundo Año de Medicina</span>
                <h2 class="hero-title">Morfofisiología Humana II</h2>
                <p class="hero-subtitle">Portal educativo interactivo para el estudio del Sistema Nervioso Central y Periférico, Órganos de los Sentidos y Sistema Endocrino. Explora preparados microscópicos, malformaciones congénitas y un atlas anatómico completo.</p>
            `;
        } else {
            inicioHero.innerHTML = `
                <span class="hero-tag">Segundo / Tercer Año de Medicina</span>
                <h2 class="hero-title">Morfofisiología Humana III</h2>
                <p class="hero-subtitle">Portal educativo interactivo para el estudio del Metabolismo y su Regulación, el Sistema Reproductor, el Desarrollo Fetal, la Sangre y los Mecanismos de Defensa. Consulta atlas virtuales y resúmenes de estudio.</p>
            `;
        }
    }

    // ==========================================
    // NAVIGATION & THEME SECTIONS
    // ==========================================
    function openMobileSidebar() {
        if (sidebar) sidebar.classList.add("mobile-open");
        if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove("mobile-open");
        if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
        document.body.style.overflow = "";
    }

    function initNavigation() {
        navItems.forEach(item => {
            item.addEventListener("click", () => {
                const sectionId = item.getAttribute("data-section");
                showSection(sectionId);
                if (window.innerWidth <= 768) {
                    closeMobileSidebar();
                }
            });
        });

        // Mobile drawer event listeners
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener("click", openMobileSidebar);
        }
        if (sidebarMobileClose) {
            sidebarMobileClose.addEventListener("click", closeMobileSidebar);
        }
        if (sidebarBackdrop) {
            sidebarBackdrop.addEventListener("click", closeMobileSidebar);
        }
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
            "orientadoras": "Clases Orientadoras",
            "laminarios": "Laminarios y Atlas Virtual",
            "habilidades": "Habilidades Médicas",
            "biblioteca": "Biblioteca Médica Digital",
            "feedback": "Buzón de Opinión y Sugerencias",
            "perfil": "Mi Perfil de Estudiante",
            "admin": "Panel de Administración y GIS"
        };
        trackUserActivity("navigation", {
            section: sectionId,
            name: sectionTitles[sectionId] || sectionId
        });

        // Trigger section specific initializations if needed
        if (sectionId === "inicio") {
            renderCourseHeroDetails();
            renderInicioTabContent();
        } else if (sectionId === "orientadoras") {
            renderOrientadoras();
        } else if (sectionId === "laminarios") {
            renderLaminarios();
        } else if (sectionId === "biblioteca") {
            renderBiblioteca();
        } else if (sectionId === "feedback") {
            renderFeedback();
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
            localStorage.setItem("morfo_theme", state.theme);
            updateThemeToggleUI();
        });

        if (mobileThemeBtn) {
            mobileThemeBtn.addEventListener("click", () => {
                state.theme = (state.theme === "dark") ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", state.theme);
                localStorage.setItem("morfo_theme", state.theme);
                updateThemeToggleUI();
            });
        }
    }

    function updateThemeToggleUI() {
        const textSpan = themeToggleBtn.querySelector(".theme-text");
        const iconSpan = themeToggleBtn.querySelector(".theme-icon");
        
        if (state.theme === "light") {
            if (textSpan) textSpan.textContent = "Modo Oscuro";
            if (iconSpan) {
                iconSpan.innerHTML = `
                    <svg viewBox="0 0 24 24"><path d="M12 3c.132 0 .263 0 .393.007a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 3z"/></svg>
                `;
            }
            if (mobileThemeBtn) mobileThemeBtn.textContent = "🌙";
        } else {
            if (textSpan) textSpan.textContent = "Modo Claro";
            if (iconSpan) {
                iconSpan.innerHTML = `
                    <svg viewBox="0 0 24 24"><path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM2 12h2m16 0h2M12 2v2m0 16v2m-6.4-15.6l1.4 1.4m9.9 9.9l1.4 1.4M5.6 18.4l1.4-1.4m9.9-9.9l1.4-1.4"/></svg>
                `;
            }
            if (mobileThemeBtn) mobileThemeBtn.textContent = "☀️";
        }
    }

    // ==========================================
    // INICIO MEDICAL 3D BOOKS CAROUSEL
    // ==========================================
    function initInicioBooksCarousel() {
        const track = document.getElementById("carouselTrack");
        const viewport = document.getElementById("carouselViewport");
        const prevBtn = document.getElementById("carouselPrevBtn");
        const nextBtn = document.getElementById("carouselNextBtn");
        const playPauseBtn = document.getElementById("carouselPlayPauseBtn");
        const playIcon = document.getElementById("carouselPlayIcon");
        const pagination = document.getElementById("carouselPagination");
        const counterInfo = document.getElementById("carouselCounterInfo");

        if (!track || typeof BIBLIOGRAFIAS_DATA === "undefined" || !Array.isArray(BIBLIOGRAFIAS_DATA)) {
            return;
        }

        // Map Category to Theme Classes
        function getCategoryThemeClass(cat) {
            const c = (cat || "").toLowerCase();
            if (c.includes("neuroanat")) return "book-theme-neuroanatomy";
            if (c.includes("neurolog")) return "book-theme-neurology";
            if (c.includes("anat") && !c.includes("neuro")) return "book-theme-anatomy";
            if (c.includes("morfo") || c.includes("fisio")) return "book-theme-morpho";
            if (c.includes("interna")) return "book-theme-internal";
            if (c.includes("semiolog")) return "book-theme-semiology";
            if (c.includes("cirug")) return "book-theme-surgery";
            if (c.includes("trauma") || c.includes("fractura")) return "book-theme-trauma";
            if (c.includes("obstetric") || c.includes("gineco") || c.includes("parto")) return "book-theme-obgyn";
            return "book-theme-internal";
        }

        // Render 3D Book Cover Cards
        track.innerHTML = "";
        BIBLIOGRAFIAS_DATA.forEach((book, idx) => {
            const card = document.createElement("div");
            const themeClass = getCategoryThemeClass(book.category);
            card.className = `carousel-book-card ${themeClass}`;
            card.setAttribute("data-index", idx);

            const isAller = Array.isArray(book.chapters) && book.chapters.length > 0;

            let actionHtml = "";
            if (isAller) {
                actionHtml = `
                    <button type="button" class="cbook-btn-download" id="cbookAllerBtn_${book.id}" style="width: 100%;">
                        📚 Explorar Capítulos (${book.chapters.length})
                    </button>
                `;
            } else {
                actionHtml = `
                    <a href="${book.file}" download class="cbook-btn-download" id="cbookDl_${book.id}" title="Descargar libro en PDF">
                        📥 Descargar PDF
                    </a>
                    <a href="${book.file}" target="_blank" class="cbook-btn-read" id="cbookRead_${book.id}" title="Leer en el navegador">
                        👁️ Leer en Línea
                    </a>
                `;
            }

            card.innerHTML = `
                <div class="cbook-header">
                    <div class="cbook-badges-row">
                        <span class="cbook-category-badge">${book.category}</span>
                        <span class="cbook-size-badge">💾 ${book.size || 'PDF'}</span>
                    </div>
                    <div class="cbook-icon-seal">${book.icon || '📖'}</div>
                </div>

                <div class="cbook-body">
                    <h3 class="cbook-title" title="${book.title}">${book.title}</h3>
                    <div class="cbook-author" title="${book.author}">✍️ ${book.author}</div>
                    <div class="cbook-edition-tag">🏷️ ${book.edition || 'Edición Oficial'}</div>
                </div>

                <div class="cbook-footer">
                    ${actionHtml}
                </div>
            `;

            // Click listener for Aller or tracking
            const allerBtn = card.querySelector(`#cbookAllerBtn_${book.id}`);
            if (allerBtn) {
                allerBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    showSection("biblioteca");
                    setTimeout(() => {
                        const openAllerMain = document.getElementById(`openAllerBtn_${book.id}`);
                        if (openAllerMain) openAllerMain.click();
                    }, 150);
                });
            }

            const dlBtn = card.querySelector(`#cbookDl_${book.id}`);
            if (dlBtn) {
                dlBtn.addEventListener("click", () => {
                    trackUserActivity("book_download", { bookId: book.id, bookTitle: book.title, source: "inicio_carousel" });
                });
            }

            track.appendChild(card);
        });

        // Generate Pagination Dots
        if (pagination) {
            pagination.innerHTML = "";
            BIBLIOGRAFIAS_DATA.forEach((_, idx) => {
                const dot = document.createElement("div");
                dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                dot.setAttribute("data-index", idx);
                dot.addEventListener("click", () => {
                    goToSlide(idx);
                });
                pagination.appendChild(dot);
            });
        }

        // Carousel State & Dynamics
        let currentIndex = 0;
        const totalItems = BIBLIOGRAFIAS_DATA.length;
        let autoplayInterval = null;
        let isPlaying = true;

        function getCardStep() {
            const firstCard = track.querySelector(".carousel-book-card");
            if (!firstCard) return 275;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 20;
            return firstCard.offsetWidth + gap;
        }

        function getMaxIndex() {
            if (!viewport) return totalItems - 1;
            const viewportWidth = viewport.offsetWidth;
            const step = getCardStep();
            const visibleCount = Math.max(1, Math.floor(viewportWidth / step));
            return Math.max(0, totalItems - visibleCount);
        }

        function updateCarouselUI() {
            const step = getCardStep();
            const maxIdx = getMaxIndex();
            if (currentIndex > maxIdx) currentIndex = maxIdx;
            if (currentIndex < 0) currentIndex = 0;

            track.style.transform = `translateX(-${currentIndex * step}px)`;

            // Update Dots
            if (pagination) {
                const dots = pagination.querySelectorAll(".carousel-dot");
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add("active");
                    } else {
                        dot.classList.remove("active");
                    }
                });
            }

            // Update Counter
            if (counterInfo) {
                counterInfo.textContent = `Libro ${currentIndex + 1} de ${totalItems}`;
            }
        }

        function nextSlide() {
            const maxIdx = getMaxIndex();
            if (currentIndex >= maxIdx) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarouselUI();
        }

        function prevSlide() {
            const maxIdx = getMaxIndex();
            if (currentIndex <= 0) {
                currentIndex = maxIdx;
            } else {
                currentIndex--;
            }
            updateCarouselUI();
        }

        function goToSlide(idx) {
            currentIndex = idx;
            updateCarouselUI();
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 3600);
            isPlaying = true;
            if (playIcon) playIcon.textContent = "⏸️";
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
            isPlaying = false;
            if (playIcon) playIcon.textContent = "▶️";
        }

        // Navigation Controls
        if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); });
        if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); });
        if (playPauseBtn) {
            playPauseBtn.addEventListener("click", () => {
                if (isPlaying) stopAutoplay();
                else startAutoplay();
            });
        }

        // Mouse Hover Pause/Resume
        if (viewport) {
            viewport.addEventListener("mouseenter", stopAutoplay);
            viewport.addEventListener("mouseleave", () => {
                if (!isPlaying && playPauseBtn) startAutoplay();
            });
        }

        // Touch Drag & Swipe Support
        let startX = 0;
        let isSwiping = false;

        if (viewport) {
            viewport.addEventListener("touchstart", (e) => {
                startX = e.touches[0].clientX;
                isSwiping = true;
                stopAutoplay();
            }, { passive: true });

            viewport.addEventListener("touchend", (e) => {
                if (!isSwiping) return;
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                if (Math.abs(diff) > 45) {
                    if (diff > 0) nextSlide();
                    else prevSlide();
                }
                isSwiping = false;
                startAutoplay();
            }, { passive: true });
        }

        // Resize responsive listener
        window.addEventListener("resize", () => {
            updateCarouselUI();
        });

        // Initialize display and start auto motion
        updateCarouselUI();
        startAutoplay();
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
    }

    function renderInicioTabContent() {
        const activeBtn = document.querySelector("#inicioSection .tab-btn.active");
        if (activeBtn) {
            const tabKey = activeBtn.getAttribute("data-tab");
            const panel = document.getElementById(tabKey + "Panel");
            if (panel) renderStaticPage(tabKey, panel);
        }
    }

    function renderStaticPage(pageKey, container) {
        let dbRef;
        if (state.currentCourse === "morfo1") {
            dbRef = typeof STATIC_PAGES_DATA_M1 !== "undefined" ? STATIC_PAGES_DATA_M1 : null;
        } else if (state.currentCourse === "morfo2") {
            dbRef = typeof STATIC_PAGES_DATA !== "undefined" ? STATIC_PAGES_DATA : null;
        } else {
            dbRef = typeof STATIC_PAGES_DATA_M3 !== "undefined" ? STATIC_PAGES_DATA_M3 : null;
        }

        if (dbRef && dbRef[pageKey]) {
            let html = dbRef[pageKey];
            container.innerHTML = `<div class="reading-pane">${html}</div>`;
        } else {
            container.innerHTML = `<p class="reading-pane text-muted">Contenido no cargado para esta sección de Morfofisiología.</p>`;
        }
    }

    // ==========================================
    // TEMARIO SEMANAL / PLAN ACADEMICO
    // ==========================================
    function initWeekSelector() {
        const selectorContainer = document.getElementById("weekSelectorSidebar");
        if (!selectorContainer) return;
        
        let totalWeeks = 12;
        if (state.currentCourse === "morfo1") totalWeeks = 15;
        else if (state.currentCourse === "morfo2") totalWeeks = 12;
        else if (state.currentCourse === "morfo3") totalWeeks = 12;

        selectorContainer.innerHTML = "";
        for (let w = 1; w <= totalWeeks; w++) {
            const item = document.createElement("div");
            item.className = `week-selector-item ${w === state.currentWeek ? 'active' : ''}`;
            item.setAttribute("data-week", w);
            
            // Render specific labels for themes
            let label = "Recurso";
            if (state.currentCourse === "morfo1") {
                label = (w <= 6) ? "Tema I" : (w <= 8) ? "Tema II" : (w == 9) ? "Tema III" : "Tema IV";
            } else if (state.currentCourse === "morfo2") {
                label = (w <= 2) ? "Tema I" : (w <= 12) ? "Tema II" : "Tema III";
            } else if (state.currentCourse === "morfo3") {
                label = (w <= 7) ? "Tema I" : (w <= 9) ? "Tema II" : "Tema III";
            }
            
            item.innerHTML = `
                <span>Semana ${w}</span>
                <span class="week-badge">${label}</span>
            `;
            
            item.addEventListener("click", () => {
                document.querySelectorAll(".week-selector-item").forEach(el => el.classList.remove("active"));
                item.classList.add("active");
                loadWeek(w);
            });
            
            selectorContainer.appendChild(item);
        }

        // Initialize sub tabs
        const weekTabBtns = document.querySelectorAll("#weekWorkspace .tab-btn");
        weekTabBtns.forEach(btn => {
            btn.removeEventListener("click", onWeekTabClick);
            btn.addEventListener("click", onWeekTabClick);
        });
    }

    function onWeekTabClick(e) {
        state.currentWeekTab = e.currentTarget.getAttribute("data-tab");
        const weekTabBtns = document.querySelectorAll("#weekWorkspace .tab-btn");
        weekTabBtns.forEach(b => b.classList.remove("active"));
        e.currentTarget.classList.add("active");
        renderWeekTabContent();
    }

    function loadWeek(weekNum) {
        state.currentWeek = weekNum;
        document.getElementById("workspaceTitle").textContent = `Semana ${weekNum} - Recursos de Estudio`;
        renderWeekTabContent();
    }

    function getPdfUrl(weekNum, type, filename) {
        if (state.currentCourse === "morfo1") {
            const themeNum = weekNum <= 6 ? 1 : (weekNum <= 8 ? 2 : (weekNum === 9 ? 3 : 4));
            return `Morfo 1/morfo/contenidos/tema${themeNum}/material/Semana ${weekNum}/${filename}`;
        } else if (state.currentCourse === "morfo2") {
            const themeNum = weekNum <= 2 ? 1 : 2;
            const semWord = weekNum <= 2 ? "semana" : "Semana";
            return `Morfo 2/morfo2/contenidos/tema${themeNum}/material/${semWord} ${weekNum}/${filename}`;
        } else {
            const themeNum = weekNum <= 7 ? 1 : (weekNum <= 9 ? 2 : 3);
            return `Morfo 3/morfo3/contenidos/tema${themeNum}/material/semana${weekNum}/${filename}`;
        }
    }

    function renderWeekTabContent() {
        const contentContainer = document.getElementById("weekTabContent");
        if (!contentContainer) return;

        let dbRef;
        if (state.currentCourse === "morfo1") {
            dbRef = typeof MORFO_DATA_M1 !== "undefined" ? MORFO_DATA_M1 : null;
        } else if (state.currentCourse === "morfo2") {
            dbRef = typeof MORFO_DATA !== "undefined" ? MORFO_DATA : null;
        } else {
            dbRef = typeof MORFO_DATA_M3 !== "undefined" ? MORFO_DATA_M3 : null;
        }

        if (!dbRef || !dbRef[state.currentWeek]) {
            contentContainer.innerHTML = `<p class="text-muted">No hay datos semanales cargados en la base de datos para la Semana ${state.currentWeek}.</p>`;
            return;
        }

        const weekObj = dbRef[state.currentWeek];
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
                            <p class="banner-desc">Resuelve las siguientes preguntas de razonamiento morfofuncional. Tus apuntes se guardan automáticamente en tu navegador.</p>
                        </div>
                    </div>
                `;
                
                let combinedText = weekObj.consolidaciones[0].pages.join("\n");
                let lines = combinedText.split("\n");
                let questions = [];
                let currentQuestion = "";
                
                lines.forEach(line => {
                    line = line.trim();
                    if (/^\d+[\.\)]\s+/.test(line)) {
                        if (currentQuestion) questions.push(currentQuestion);
                        currentQuestion = line;
                    } else if (currentQuestion && line) {
                        currentQuestion += " " + line;
                    }
                });
                if (currentQuestion) questions.push(currentQuestion);
                
                if (questions.length > 0) {
                    questions.forEach((qText, index) => {
                        const localKey = `${state.currentCourse}_notes_w${state.currentWeek}_q${index}`;
                        const savedNote = localStorage.getItem(localKey) || "";
                        
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
                                    <textarea class="notes-area" data-key="${localKey}" placeholder="Escribe tu razonamiento aquí...">${savedNote}</textarea>
                                </div>
                            </div>
                        `;
                    });
                } else {
                    html += `<div class="reading-pane">${combinedText.split("\n").map(l => l.trim() ? `<p>${l}</p>` : "").join("")}</div>`;
                    
                    const localKey = `${state.currentCourse}_notes_w${state.currentWeek}_general`;
                    const savedNote = localStorage.getItem(localKey) || "";
                    html += `
                        <div class="learning-card">
                            <div class="learning-card-title">Cuaderno de Estudio de la Semana ${state.currentWeek}</div>
                            <textarea class="notes-area" data-key="${localKey}" placeholder="Anota tus conclusiones o respuestas para esta semana...">${savedNote}</textarea>
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
                        
                        // Track note editing in Firestore telemetry
                        if (state.currentUser) {
                            db_trackNote(state.currentUser.email, { week: state.currentWeek });
                        }
                    });
                });
            } else {
                contentContainer.innerHTML = `<p class="text-muted">No se encontró texto de consolidación para esta semana.</p>`;
            }
        } 
        else if (tab === "pdf") {
            let html = `
                <h2>Materiales Oficiales de Descarga</h2>
                <p style="margin-bottom: 24px;">Descarga los documentos oficiales de la asignatura: Clases Orientadoras de la semana y Guías de Estudio del CD:</p>
                <div class="downloads-container">
            `;

            // Load AOs for this week
            let aosRef;
            if (state.currentCourse === "morfo1") aosRef = typeof CLASES_ORIENTADORAS_M1 !== "undefined" ? CLASES_ORIENTADORAS_M1 : [];
            else if (state.currentCourse === "morfo2") aosRef = typeof CLASES_ORIENTADORAS_DATA !== "undefined" ? CLASES_ORIENTADORAS_DATA : [];
            else aosRef = typeof CLASES_ORIENTADORAS_M3 !== "undefined" ? CLASES_ORIENTADORAS_M3 : [];

            const weekAos = aosRef.filter(ao => ao.week === state.currentWeek);
            weekAos.forEach(ao => {
                html += `
                    <a href="${ao.pdfFile}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(var(--accent-color-rgb), 0.12), rgba(var(--accent-color-rgb), 0.05)); border-color: var(--accent-color); color: var(--accent-hover);">
                        <svg viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>
                        <span>${ao.ao}: ${ao.title} (Clase Orientadora)</span>
                    </a>
                    ${ao.slidesFile ? `
                    <a href="${ao.slidesFile}" target="_blank" class="download-btn" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(99, 102, 241, 0.08)); border-color: rgba(139, 92, 246, 0.4); color: var(--accent-hover);">
                        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
                        <span>${ao.ao}: Diapositiva Explicativa</span>
                    </a>` : ''}
                `;
            });
            
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
                            <span>${doc.filename} (Cuestionario de Consolidación)</span>
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

        // Clean up repeated OCR header strings, page headers and numbers
        let clean = rawText
            .replace(/MORFOFISIOLOG[IÍ]A HUMANA[^\n]*/gi, "")
            .replace(/ORIENTACIONES AL CONTENIDO[^\n]*/gi, "")
            .replace(/GU[IÍ]A DE LA PR[AÁ]CTICA[^\n]*/gi, "")
            .replace(/\n\s*\d+\s*\n/g, "\n\n")
            .replace(/Semana \d+\.?\s*/gi, "")
            .replace(/Actividad orientadora \d+\.?\s*/gi, "")
            .replace(/\r\n/g, "\n");

        // Split into logical lines and filter out empty lines
        const rawLines = clean.split("\n");
        const lines = [];
        rawLines.forEach(l => {
            const trimmed = l.trim();
            if (trimmed) lines.push(trimmed);
        });

        // Group lines into semantic paragraphs, headings, bullets
        const paragraphs = [];
        let currPara = "";

        lines.forEach(line => {
            const isBullet = /^[•\-\*9vØo]\s+/.test(line) || /^\d+[\.\)]\s+/.test(line);
            const isHeading = /^(introducci[oó]n|objetivos|contenidos|conclusiones|orientaciones|tareas docentes)\b/i.test(line);
            const isSubheading = /^\d+\.\d+\s+/.test(line);

            if (isHeading || isSubheading || isBullet) {
                if (currPara) {
                    paragraphs.push(currPara);
                    currPara = "";
                }
                paragraphs.push(line);
            } else {
                if (currPara) {
                    currPara += " " + line;
                } else {
                    currPara = line;
                }
            }
        });

        if (currPara) {
            paragraphs.push(currPara);
        }

        let html = `
            <div class="pedagogical-guide-wrapper">
                <div class="info-banner-card">
                    <div class="banner-icon-badge">${icon || "📖"}</div>
                    <div class="banner-text-content">
                        <h3 class="banner-title">${title}</h3>
                        <p class="banner-desc">Guía docente estructurada pedagógicamente con objetivos de aprendizaje, desglose de ejes temáticos y recomendaciones bibliográficas.</p>
                    </div>
                </div>
                <div class="pedagogical-content-body">
        `;

        let inList = false;
        let inObjectivesGrid = false;
        let currentSection = "general";

        paragraphs.forEach(p => {
            // Main Headings Detection
            if (/^introducci[oó]n\.?:?\s*$/i.test(p)) {
                if (inList) { html += `</ul>`; inList = false; }
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                html += `<div class="pedagogical-section-header"><span class="section-icon">🌟</span><h4>Introducción al Tema</h4></div>`;
                currentSection = "intro";
                return;
            }
            if (/^objetivos\.?:?\s*$/i.test(p) || /^objetivos (generales|espec[ií]ficos)\.?:?\s*$/i.test(p)) {
                if (inList) { html += `</ul>`; inList = false; }
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                html += `<div class="pedagogical-section-header"><span class="section-icon">🎯</span><h4>Objetivos de Aprendizaje</h4></div><div class="learning-objectives-grid">`;
                inObjectivesGrid = true;
                currentSection = "objectives";
                return;
            }
            if (/^contenidos\.?:?\s*$/i.test(p)) {
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                if (inList) { html += `</ul>`; inList = false; }
                html += `<div class="pedagogical-section-header"><span class="section-icon">📋</span><h4>Ejes Temáticos y Contenidos</h4></div>`;
                currentSection = "contents";
                return;
            }
            if (/^orientaciones\b.*/i.test(p) || /^tareas docentes\b.*/i.test(p)) {
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                if (inList) { html += `</ul>`; inList = false; }
                const isTask = /^tareas docentes\b/i.test(p);
                html += `<div class="pedagogical-section-header"><span class="section-icon">${isTask ? '✏️' : '💡'}</span><h4>${isTask ? 'Tareas Docentes y Ejercicios' : 'Orientaciones para el Estudio'}</h4></div>`;
                currentSection = "orientations";
                return;
            }

            // Subheadings (e.g., "1.1 Generalidades...", "1.2 Tejido Nervioso...")
            const subheadMatch = p.match(/^(\d+\.\d+)\s+(.*)/);
            if (subheadMatch) {
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                if (inList) { html += `</ul>`; inList = false; }
                const numTag = subheadMatch[1];
                const titleTag = subheadMatch[2];
                html += `<div class="topic-subheading-card"><span class="topic-num-badge">${numTag}</span><h5>${titleTag}</h5></div>`;
                return;
            }

            // Objectives Grid Items
            if (inObjectivesGrid && /^\d+[\.\)]\s+/.test(p)) {
                const objMatch = p.match(/^(\d+)[\.\)]\s+(.*)/);
                if (objMatch) {
                    const num = objMatch[1];
                    const objText = objMatch[2];
                    html += `
                        <div class="objective-card-item">
                            <div class="objective-num-badge">Objetivo ${num}</div>
                            <div class="objective-text">${objText}</div>
                        </div>
                    `;
                    return;
                }
            }

            // Bullets / List Items
            if (/^[•\-\*9vØo]\s+/.test(p)) {
                if (inObjectivesGrid) { html += `</div>`; inObjectivesGrid = false; }
                if (!inList) {
                    html += `<ul class="pedagogical-bullet-list">`;
                    inList = true;
                }

                const cleanItem = p.replace(/^[•\-\*9vØo]\s+/, "");

                if (/(te recomendamos|debes consultar|revisa el|estudiar por el|folleto complementario|libro de texto|en tu cd|cuadro \d+|figura \d+|langman|guyton|junqueira|ross|cardellá)/i.test(cleanItem)) {
                    html += `
                        <li class="bullet-item-reading">
                            <div class="reading-callout-inline">
                                <span class="callout-pill">📚 Lectura / Recurso Recomendado</span>
                                <span>${cleanItem}</span>
                            </div>
                        </li>
                    `;
                } else if (/¿[^\?]+\?/.test(cleanItem)) {
                    html += `
                        <li class="bullet-item-question">
                            <div class="question-callout-inline">
                                <span class="callout-pill question">❓ Pregunta de Reflexión</span>
                                <span>${cleanItem}</span>
                            </div>
                        </li>
                    `;
                } else {
                    html += `<li>${cleanItem}</li>`;
                }
                return;
            }

            // Reset list/grid if standard paragraph
            if (inList) { html += `</ul>`; inList = false; }
            if (inObjectivesGrid && !/^\d+[\.\)]/.test(p)) {
                html += `</div>`;
                inObjectivesGrid = false;
            }

            // Standalone Paragraphs formatting
            if (/(te recomendamos|te sugerimos|debes consultar|estudiar por el folleto|bibliograf[ií]a)/i.test(p)) {
                html += `
                    <div class="pedagogical-callout-block reading">
                        <div class="callout-header"><span class="callout-icon">📖</span> <strong>Recomendación Bibliográfica</strong></div>
                        <div class="callout-body">${p}</div>
                    </div>
                `;
            } else if (p.startsWith("¿") && p.endsWith("?")) {
                html += `
                    <div class="pedagogical-callout-block question">
                        <div class="callout-header"><span class="callout-icon">🩺</span> <strong>Razonamiento Clínico / Pregunta</strong></div>
                        <div class="callout-body">${p}</div>
                    </div>
                `;
            } else if (currentSection === "intro") {
                html += `<div class="intro-paragraph-card"><p>${p}</p></div>`;
            } else {
                html += `<p class="pedagogical-paragraph">${p}</p>`;
            }
        });

        if (inList) html += `</ul>`;
        if (inObjectivesGrid) html += `</div>`;

        html += `</div></div>`;
        return html;
    }

    // ==========================================
    // CLASES ORIENTADORAS COMPENDIUM
    // ==========================================
    function initOrientadoras() {
        const searchInput = document.getElementById("aoSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                state.aoSearch = e.target.value.toLowerCase();
                renderOrientadoras();
            });
        }
    }

    function renderOrientadoras() {
        const container = document.getElementById("aoListContainer");
        const viewer = document.getElementById("aoViewerContainer");
        if (!container || !viewer) return;

        let aosRef;
        if (state.currentCourse === "morfo1") aosRef = typeof CLASES_ORIENTADORAS_M1 !== "undefined" ? CLASES_ORIENTADORAS_M1 : [];
        else if (state.currentCourse === "morfo2") aosRef = typeof CLASES_ORIENTADORAS_DATA !== "undefined" ? CLASES_ORIENTADORAS_DATA : [];
        else aosRef = typeof CLASES_ORIENTADORAS_M3 !== "undefined" ? CLASES_ORIENTADORAS_M3 : [];

        // Apply filters
        const filtered = aosRef.filter(ao => {
            return ao.title.toLowerCase().includes(state.aoSearch) || 
                   ao.ao.toLowerCase().includes(state.aoSearch) ||
                   ao.theme.toLowerCase().includes(state.aoSearch);
        });

        // Set labels
        document.getElementById("orientadorasHeroTag").textContent = `Compendio de Morfofisiología ${state.currentCourse.toUpperCase().replace("MORFO", "Humana ")}`;
        document.getElementById("orientadorasHeroTitle").textContent = `Clases Orientadoras (${aosRef.length} Conferencias)`;

        container.innerHTML = "";
        if (filtered.length === 0) {
            container.innerHTML = `<p class="text-muted">No se encontraron actividades orientadoras.</p>`;
            viewer.innerHTML = `<div class="empty-viewer-card">🔍 Usa la barra lateral para buscar o selecciona una clase de la lista.</div>`;
            return;
        }

        filtered.forEach(ao => {
            const card = document.createElement("div");
            card.className = `ao-card-item ${ao.id === state.currentAO ? 'active' : ''}`;
            card.innerHTML = `
                <div class="ao-card-header">
                    <span class="ao-badge">${ao.ao}</span>
                    <span class="mag-badge">Semana ${ao.week}</span>
                </div>
                <h4 class="ao-card-title">${ao.title}</h4>
                <p class="ao-card-theme">${ao.theme}</p>
            `;
            
            card.addEventListener("click", () => {
                state.currentAO = ao.id;
                document.querySelectorAll(".ao-card-item").forEach(el => el.classList.remove("active"));
                card.classList.add("active");
                renderActiveAOViewer(ao);
            });
            
            container.appendChild(card);
        });

        // Load active viewer
        const activeAO = aosRef.find(ao => ao.id === state.currentAO) || filtered[0];
        if (activeAO) {
            renderActiveAOViewer(activeAO);
        } else {
            viewer.innerHTML = `<div class="empty-viewer-card">🔍 Selecciona una clase orientadora para ver el material.</div>`;
        }
    }

    function renderActiveAOViewer(ao) {
        const viewer = document.getElementById("aoViewerContainer");
        if (!viewer) return;

        let topicsHtml = ao.topics.map(t => `<span class="topic-pill">${t}</span>`).join("");

        viewer.innerHTML = `
            <div class="viewer-card animate-fade">
                <div class="viewer-header">
                    <div>
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span class="ao-badge big">${ao.ao}</span>
                            <span class="mag-badge">Semana Académica ${ao.week}</span>
                        </div>
                        <h3 class="viewer-title" style="margin-top: 12px;">${ao.title}</h3>
                        <p class="ao-card-theme" style="font-size: 1rem; margin-top: 4px;">${ao.theme}</p>
                    </div>
                </div>

                <div class="viewer-body">
                    <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Resumen del Contenido</h4>
                    <p class="viewer-desc" style="line-height: 1.6; color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 20px;">
                        ${ao.description}
                    </p>

                    <h4 style="font-family: var(--font-heading); margin-bottom: 8px;">Objetivos y Temas Clave</h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
                        ${topicsHtml}
                    </div>

                    <div style="display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap;">
                        <a href="${ao.pdfFile}" target="_blank" class="download-btn btn-primary" id="viewPDFBtn" style="padding: 14px 28px; width: auto; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px;">
                            <span>👁️</span> Visualizar Conferencia Completa (PDF)
                        </a>
                        ${ao.slidesFile ? `
                        <a href="${ao.slidesFile}" target="_blank" class="download-btn" id="viewSlideBtn" style="padding: 14px 28px; width: auto; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.25)); border: 1px solid rgba(139, 92, 246, 0.45); color: #c4b5fd;">
                            <span>📊</span> Visualizar Diapositiva Explicativa
                        </a>` : ''}
                        ${ao.videoDriveId || ao.videoDriveUrl || ao.videoFile ? `
                        <a href="${ao.videoDriveId ? `https://drive.google.com/file/d/${ao.videoDriveId}/view?usp=sharing` : (ao.videoDriveUrl || ao.videoFile)}" target="_blank" class="download-btn" id="viewVideoBtn" style="padding: 14px 28px; width: auto; font-size: 0.95rem; display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(244, 63, 94, 0.25)); border: 1px solid rgba(239, 68, 68, 0.45); color: #fca5a5;">
                            <span>🎥</span> Ver Video Conferencia en Google Drive
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `;

        // Telemetry tracking & VIP Guard on AO view
        const pdfBtn = document.getElementById("viewPDFBtn");
        if (pdfBtn) {
            pdfBtn.addEventListener("click", (e) => {
                if (!isUserVip()) {
                    e.preventDefault();
                    showVipPaywallModal(`${ao.ao}: ${ao.title} (Conferencia Completa)`);
                    return;
                }
                trackUserActivity("download", {
                    filename: ao.pdfFile,
                    type: "Clase Orientadora PDF"
                });
            });
        }
        const slideBtn = document.getElementById("viewSlideBtn");
        if (slideBtn && ao.slidesFile) {
            slideBtn.addEventListener("click", (e) => {
                if (!isUserVip()) {
                    e.preventDefault();
                    showVipPaywallModal(`${ao.ao}: Diapositiva Explicativa`);
                    return;
                }
                trackUserActivity("download", {
                    filename: ao.slidesFile,
                    type: "Diapositiva Explicativa PDF"
                });
            });
        }
        const videoBtn = document.getElementById("viewVideoBtn");
        if (videoBtn) {
            videoBtn.addEventListener("click", (e) => {
                if (!isUserVip()) {
                    e.preventDefault();
                    showVipPaywallModal(`${ao.ao}: Video Conferencia`);
                    return;
                }
                trackUserActivity("download", {
                    filename: ao.videoDriveId ? `Google Drive: ${ao.ao} - ${ao.title}` : (ao.videoFile || "Video Conferencia"),
                    type: "Video Conferencia"
                });
            });
        }
    }

    // ==========================================
    // LAMINARIOS & ATLAS VIRTUAL
    // ==========================================
    function initLaminarios() {
        const searchInput = document.getElementById("laminariosSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                state.laminarioSearch = e.target.value.toLowerCase();
                renderLaminarios();
            });
        }
    }

    function renderLaminarios() {
        const grid = document.getElementById("laminariosGrid");
        const headersContainer = document.getElementById("laminariosTabHeaders");
        const controlBar = document.getElementById("laminariosControlBar");
        const pageSelector = document.getElementById("atlasPageSelector");
        if (!grid || !headersContainer || !controlBar) return;

        // Render dynamic tab headers based on the active course
        if (headersContainer.children.length === 0 || headersContainer.getAttribute("data-loaded-course") !== state.currentCourse) {
            headersContainer.setAttribute("data-loaded-course", state.currentCourse);
            
            if (state.currentCourse === "morfo1") {
                headersContainer.innerHTML = `
                    <button class="tab-btn active" data-lam-tab="histologico" id="tabLamHisto">🔬 Laminario Histológico (${LAMINARIO_HISTOLOGICO_M1.length})</button>
                    <button class="tab-btn" data-lam-tab="embriologico" id="tabLamEmbrio">🧬 Laminario Embriológico (${LAMINARIO_EMBRIOLOGICO_M1.length})</button>
                `;
            } else if (state.currentCourse === "morfo2") {
                headersContainer.innerHTML = `
                    <button class="tab-btn active" data-lam-tab="histologico" id="tabLamHisto">🔬 Laminario Histológico (${LAMINARIO_HISTOLOGICO_DATA.length})</button>
                    <button class="tab-btn" data-lam-tab="malformaciones" id="tabLamMalfor">🧬 Malformaciones Congénitas (${LAMINARIO_MALFORMACIONES_DATA.length})</button>
                    <button class="tab-btn" data-lam-tab="atlas" id="tabLamAtlas">📐 Atlas Anatómico (346)</button>
                    <button class="tab-btn" data-lam-tab="ppt" id="tabLamPpt">📊 Presentaciones PPT / Diapositivas</button>
                `;
            } else {
                headersContainer.innerHTML = `
                    <button class="tab-btn active" data-lam-tab="histologico" id="tabLamHisto">🔬 Laminario Histológico (${LAMINARIO_HISTOLOGICO_M3.length})</button>
                `;
            }

            // Re-bind click event to new dynamic buttons
            const tabs = headersContainer.querySelectorAll(".tab-btn");
            tabs.forEach(btn => {
                btn.addEventListener("click", () => {
                    state.currentLaminarioTab = btn.getAttribute("data-lam-tab");
                    tabs.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    
                    // Reset filters
                    state.currentLaminarioFilter = "todos";
                    state.laminarioSearch = "";
                    if (searchInput) searchInput.value = "";
                    
                    renderLaminarios();
                });
            });
        }

        const searchInput = document.getElementById("laminariosSearchInput");
        const tab = state.currentLaminarioTab;

        // Display page selector only in Atlas tab of Morfo II
        if (tab === "atlas") {
            pageSelector.style.display = "flex";
            renderAtlasPageSelector();
        } else {
            pageSelector.style.display = "none";
        }

        grid.innerHTML = "";

        // 1. HISTOLOGY TAB (For all courses)
        if (tab === "histologico") {
            let dataRef = [];
            if (state.currentCourse === "morfo1") dataRef = LAMINARIO_HISTOLOGICO_M1;
            else if (state.currentCourse === "morfo2") dataRef = LAMINARIO_HISTOLOGICO_DATA;
            else dataRef = LAMINARIO_HISTOLOGICO_M3;

            // Categories list for filter bar
            const categoriesSet = new Set(dataRef.map(i => i.category));
            renderCategoryFilterBar(categoriesSet);

            const filtered = dataRef.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(state.laminarioSearch) ||
                                      item.stain.toLowerCase().includes(state.laminarioSearch) ||
                                      (item.description && item.description.toLowerCase().includes(state.laminarioSearch));
                const matchesFilter = state.currentLaminarioFilter === "todos" || item.category === state.currentLaminarioFilter;
                return matchesSearch && matchesFilter;
            });

            if (filtered.length === 0) {
                grid.innerHTML = `<p class="text-muted" style="grid-column: 1/-1; text-align: center; padding: 40px;">No se encontraron preparados histológicos.</p>`;
                return;
            }

            filtered.forEach(item => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${item.src}" alt="${item.title}" loading="lazy">
                        <div class="atlas-card-overlay">🔍 Ampliar Preparado</div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category">${item.category} &bull; Lámina ${item.num}</span>
                        <h4 class="atlas-card-title">${item.title}</h4>
                        <p class="atlas-card-desc">${item.description || ''}</p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); border-top: 1px solid var(--border-color); padding-top: 10px; margin-top: 8px;">
                            <span>Tinción: <strong>${item.stain}</strong></span>
                            <span>Aumento: <strong>${item.magnification || 'MO'}</strong></span>
                        </div>
                    </div>
                `;
                
                card.addEventListener("click", () => {
                    openLightbox(item.src, item.title, `<strong>Lámina:</strong> ${item.num}<br><strong>Tinción:</strong> ${item.stain}<br><strong>Aumento:</strong> ${item.magnification || 'MO'}<br><strong>Categoría:</strong> ${item.category}<br><br>${item.description || ''}`);
                });
                
                grid.appendChild(card);
            });
        }
        
        // 2. EMBRIOLOGY TAB (Morfo 1)
        else if (tab === "embriologico") {
            const dataRef = LAMINARIO_EMBRIOLOGICO_M1;
            renderCategoryFilterBar(null); // No specific filter bar needed

            const filtered = dataRef.filter(item => {
                return item.title.toLowerCase().includes(state.laminarioSearch) ||
                       (item.description && item.description.toLowerCase().includes(state.laminarioSearch));
            });

            filtered.forEach(item => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${item.src}" alt="${item.title}" loading="lazy">
                        <div class="atlas-card-overlay">🔍 Ampliar Imagen</div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category">${item.category}</span>
                        <h4 class="atlas-card-title">${item.title}</h4>
                        <p class="atlas-card-desc">${item.description || ''}</p>
                    </div>
                `;
                
                card.addEventListener("click", () => {
                    openLightbox(item.src, item.title, `<strong>Categoría:</strong> ${item.category}<br><br>${item.description || ''}`);
                });
                
                grid.appendChild(card);
            });
        }

        // 3. MALFORMACIONES TAB (Morfo 2)
        else if (tab === "malformaciones") {
            const dataRef = LAMINARIO_MALFORMACIONES_DATA;
            const systemsSet = new Set(dataRef.map(i => i.system));
            renderCategoryFilterBar(systemsSet);

            const filtered = dataRef.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(state.laminarioSearch) ||
                                      (item.description && item.description.toLowerCase().includes(state.laminarioSearch));
                const matchesFilter = state.currentLaminarioFilter === "todos" || item.system === state.currentLaminarioFilter;
                return matchesSearch && matchesFilter;
            });

            filtered.forEach(item => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.innerHTML = `
                    <div class="atlas-card-img-container">
                        <img class="atlas-card-img" src="${item.src}" alt="${item.title}" loading="lazy">
                        <div class="atlas-card-overlay">🔍 Ampliar Imagen Clínico</div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category" style="color: #fbbf24;">${item.system}</span>
                        <h4 class="atlas-card-title">${item.title}</h4>
                        <p class="atlas-card-desc">${item.description}</p>
                    </div>
                `;
                
                card.addEventListener("click", () => {
                    openLightbox(item.src, item.title, `<strong>Sistema:</strong> ${item.system}<br><br>${item.description}`);
                });
                
                grid.appendChild(card);
            });
        }

        // 4. ATLAS TAB (Morfo 2)
        else if (tab === "atlas") {
            if (typeof GALLERY_DATA === "undefined") {
                grid.innerHTML = `<p class="text-muted">Datos del atlas anatómico no cargados.</p>`;
                return;
            }
            renderCategoryFilterBar(null); // No filter pills, paginated instead

            const pageData = GALLERY_DATA.find(p => p.page === state.currentAtlasPage);
            if (!pageData) return;

            const filtered = pageData.figures.filter(fig => {
                return fig.label.toLowerCase().includes(state.laminarioSearch) ||
                       fig.src.toLowerCase().includes(state.laminarioSearch);
            });

            filtered.forEach(fig => {
                const displayLabel = `Figura ${fig.label}`;
                const card = document.createElement("div");
                card.className = "atlas-card";
                const imgSrc = fig.src.startsWith("Morfo 2/") ? fig.src : `Morfo 2/${fig.src}`;
                card.innerHTML = `
                    <div class="atlas-card-img-container" style="background: #111827; padding: 12px; display: flex; align-items: center; justify-content: center;">
                        <img class="atlas-card-img" src="${imgSrc}" alt="${displayLabel}" style="object-fit: contain; max-height: 200px;" loading="lazy">
                        <div class="atlas-card-overlay">🔍 Ampliar Figura</div>
                    </div>
                    <div class="atlas-card-body">
                        <span class="atlas-card-category">Colección Anatómica CD</span>
                        <h4 class="atlas-card-title">${displayLabel}</h4>
                        <p class="atlas-card-desc" style="font-size: 0.8rem;">Corte esquemático o preparado anatómico numerado en el compendio oficial de anatomía.</p>
                    </div>
                `;
                
                card.addEventListener("click", () => {
                    openLightbox(imgSrc, displayLabel, `Figura anatómica oficial Nro ${fig.label}. Del CD de estudio de medicina de segundo año.`);
                });
                
                grid.appendChild(card);
            });
        }

        // 5. PRESENTACIONES TAB (Morfo 2)
        else if (tab === "ppt") {
            renderCategoryFilterBar(null);
            
            const pptData = LAMINARIOS_PPT_DATA;

            pptData.forEach(ppt => {
                const card = document.createElement("div");
                card.className = "atlas-card";
                card.style.cursor = "default";
                const pptHref = ppt.file.startsWith("Morfo 2/") ? ppt.file : `Morfo 2/${ppt.file}`;
                card.innerHTML = `
                    <div class="atlas-card-body" style="gap: 12px; padding: 28px;">
                        <div style="font-size: 2.2rem;">📊</div>
                        <h4 class="atlas-card-title" style="font-size: 1.15rem; font-family: var(--font-heading); font-weight: 700;">${ppt.title}</h4>
                        <p class="atlas-card-desc" style="font-size: 0.84rem; color: var(--text-secondary);">${ppt.description}</p>
                        <div style="display: flex; gap: 8px; font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">
                            <span>Formato: <strong>${ppt.format}</strong></span>
                            <span>Tamaño: <strong>${ppt.size}</strong></span>
                        </div>
                        <a href="${pptHref}" download class="download-btn" id="dlPpt_${ppt.id}" style="margin-top: 14px; width: 100%; justify-content: center; font-size: 0.85rem; font-weight: 600;">
                            📥 Descargar Presentación
                        </a>
                    </div>
                `;
                
                grid.appendChild(card);
                
                const dlBtn = document.getElementById(`dlPpt_${ppt.id}`);
                if (dlBtn) {
                    dlBtn.addEventListener("click", () => {
                        trackUserActivity("download", {
                            filename: ppt.file,
                            type: "Presentacion PPT"
                        });
                    });
                }
            });
        }
    }

    function renderCategoryFilterBar(categoriesSet) {
        const filtersContainer = document.getElementById("laminariosCategoryFilters");
        if (!filtersContainer) return;
        filtersContainer.innerHTML = "";

        if (!categoriesSet) return;

        // All pill
        const allPill = document.createElement("button");
        allPill.className = `filter-pill ${state.currentLaminarioFilter === 'todos' ? 'active' : ''}`;
        allPill.textContent = "Todos";
        allPill.addEventListener("click", () => {
            state.currentLaminarioFilter = "todos";
            renderLaminarios();
        });
        filtersContainer.appendChild(allPill);

        // Dynamic categories pills
        categoriesSet.forEach(cat => {
            const pill = document.createElement("button");
            pill.className = `filter-pill ${state.currentLaminarioFilter === cat ? 'active' : ''}`;
            pill.textContent = cat;
            pill.addEventListener("click", () => {
                state.currentLaminarioFilter = cat;
                renderLaminarios();
            });
            filtersContainer.appendChild(pill);
        });
    }

    function renderAtlasPageSelector() {
        const pageSelector = document.getElementById("atlasPageSelector");
        if (!pageSelector) return;
        pageSelector.innerHTML = "";

        for (let p = 1; p <= 28; p++) {
            const btn = document.createElement("button");
            btn.className = `page-btn ${p === state.currentAtlasPage ? 'active' : ''}`;
            btn.textContent = p;
            btn.addEventListener("click", () => {
                state.currentAtlasPage = p;
                renderLaminarios();
            });
            pageSelector.appendChild(btn);
        }
    }

    // ==========================================
    // LIGHTBOX MODULE
    // ==========================================
    function initLightbox() {
        if (lightboxClose) {
            lightboxClose.addEventListener("click", () => {
                lightbox.classList.remove("active");
            });
        }
        if (lightbox) {
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) lightbox.classList.remove("active");
            });
        }
    }

    function openLightbox(src, title, detailsHtml) {
        if (!lightbox) return;
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        if (detailsHtml) {
            lightboxDetails.style.display = "block";
            lightboxDetails.innerHTML = detailsHtml;
        } else {
            lightboxDetails.style.display = "none";
        }
        lightbox.classList.add("active");
        
        // Log telemetry
        trackUserActivity("view_slide", { title: title, src: src });
    }

    // ==========================================
    // HABILIDADES MÉDICAS MODULE
    // ==========================================
    function initHabilidades() {
        // Habilidades list layout
        renderHabilidades();
    }

    function renderHabilidades() {
        const grid = document.getElementById("habilidadesGrid");
        const detailsContainer = document.getElementById("habilidadesDetails");
        if (!grid || !detailsContainer) return;

        const abilitiesList = [
            { id: "definir", title: "Definir", icon: "📖", desc: "Expresa de manera precisa y directa las características esenciales y límites conceptuales de una estructura o función biológica." },
            { id: "describir", title: "Describir", icon: "✏️", desc: "Detalla ordenadamente la forma, límites, constitución histológica y relaciones espaciales de los órganos y tejidos del cuerpo." },
            { id: "comparar", title: "Comparar", icon: "⚖️", desc: "Establece semejanzas y diferencias entre estructuras, procesos metabólicos o mecanismos fisiológicos de control." },
            { id: "clasificar", title: "Clasificar", icon: "🗂️", desc: "Distribuye estructuras y conceptos en clases jerárquicas sistemáticas de acuerdo a criterios científicos unificados." },
            { id: "identificar", title: "Identificar", icon: "🔬", desc: "Reconoce y nombra preparados histológicos reales, estructuras anatómicas señaladas y anomalías del desarrollo." },
            { id: "explicar", title: "Explicar", icon: "📢", desc: "Expone con lógica científica la relación causal entre estructuras anatómicas y funciones metabólicas asociadas." },
            { id: "interpretar", title: "Interpretar", icon: "🩺", desc: "Razona y deduce a partir de gráficos fisiológicos, trazos esfigmomanométricos y análisis de laboratorio el estado biomédico del organismo." },
            { id: "predecir", title: "Predecir", icon: "🔮", desc: "Establece deducciones clínicas causales anticipando el efecto fisiopatológico sistémico derivado de la lesión de una vía o tejido." },
            { id: "analizar", title: "Analizar", icon: "🧠", desc: "Descompone un complejo morfofuncional o caso clínico en sus partes básicas constituyentes para comprender su dinámica." }
        ];

        grid.innerHTML = "";
        abilitiesList.forEach(ab => {
            const card = document.createElement("div");
            card.className = "learning-card";
            card.innerHTML = `
                <div class="learning-card-header">
                    <span class="ao-badge">${ab.icon} Habilidad intelectual</span>
                </div>
                <h4 class="learning-card-title">${ab.title}</h4>
                <p class="learning-card-text">${ab.desc}</p>
                <button class="download-btn" style="margin-top: auto; font-size: 0.82rem;">Ver Instrucciones Pedagógicas</button>
            `;
            
            card.querySelector(".download-btn").addEventListener("click", () => {
                renderAbilityInstructions(ab.id, detailsContainer);
            });
            
            grid.appendChild(card);
        });

        detailsContainer.innerHTML = `<div class="empty-viewer-card">💡 Selecciona "Ver Instrucciones Pedagógicas" en cualquier tarjeta para desplegar su guía metodológica completa.</div>`;
    }

    function renderAbilityInstructions(abilityId, container) {
        let dbRef;
        if (state.currentCourse === "morfo1") {
            dbRef = typeof STATIC_PAGES_DATA_M1 !== "undefined" ? STATIC_PAGES_DATA_M1 : null;
        } else if (state.currentCourse === "morfo2") {
            dbRef = typeof STATIC_PAGES_DATA !== "undefined" ? STATIC_PAGES_DATA : null;
        } else {
            dbRef = typeof STATIC_PAGES_DATA_M3 !== "undefined" ? STATIC_PAGES_DATA_M3 : null;
        }

        if (dbRef && dbRef.habilidades && dbRef.habilidades[abilityId]) {
            const html = dbRef.habilidades[abilityId];
            container.innerHTML = `
                <div class="card animate-fade" style="padding: 36px; gap: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 14px;">
                        <div>
                            <h3 style="font-family: var(--font-heading); font-weight: 800; font-size: 1.35rem; text-transform: uppercase;">
                                Guía Metodológica para la Habilidad: ${abilityId}
                            </h3>
                            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Metodología docente oficial del CD para exámenes prácticos y teóricos</p>
                        </div>
                        <span class="ao-badge big" style="background: var(--accent-gradient); color: white; border-color: transparent;">Instrucciones Oficiales</span>
                    </div>
                    <div class="reading-pane">${html}</div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 10px;">
                        <button class="download-btn" onclick="document.getElementById('habilidadesSection').scrollIntoView({behavior: 'smooth'});" style="background: rgba(255,255,255,0.06); border-color: var(--border-color); font-size: 0.85rem;">
                            ▲ Subir al Listado
                        </button>
                    </div>
                </div>
            `;
            container.scrollIntoView({ behavior: "smooth" });
        } else {
            container.innerHTML = `<div class="empty-viewer-card">⚠️ Instrucciones de la habilidad '${abilityId}' no cargadas.</div>`;
        }
    }

    // ==========================================
    // BIBLIOTECA MÉDICA DIGITAL MODULE
    // ==========================================
    function initBiblioteca() {
        const searchInput = document.getElementById("bibliotecaSearchInput");
        const categoryFilters = document.getElementById("bibliotecaCategoryFilters");
        const allerCloseBtn = document.getElementById("allerChaptersCloseBtn");
        const allerModal = document.getElementById("allerChaptersModal");
        const allerSearch = document.getElementById("allerChapterSearch");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                state.bibliotecaSearch = e.target.value.toLowerCase().trim();
                renderBiblioteca();
            });
        }

        if (categoryFilters) {
            const pills = categoryFilters.querySelectorAll(".filter-pill");
            pills.forEach(pill => {
                pill.addEventListener("click", () => {
                    pills.forEach(p => p.classList.remove("active"));
                    pill.classList.add("active");
                    state.currentBibliotecaCategory = pill.getAttribute("data-category");
                    renderBiblioteca();
                });
            });
        }

        if (allerCloseBtn) {
            allerCloseBtn.addEventListener("click", closeAllerChaptersModal);
        }

        if (allerModal) {
            allerModal.addEventListener("click", (e) => {
                if (e.target === allerModal) {
                    closeAllerChaptersModal();
                }
            });
        }

        if (allerSearch) {
            allerSearch.addEventListener("input", (e) => {
                renderAllerChapters(e.target.value.toLowerCase().trim());
            });
        }
    }

    function renderBiblioteca() {
        const grid = document.getElementById("bibliotecaGrid");
        if (!grid) return;

        if (typeof BIBLIOGRAFIAS_DATA === "undefined" || !Array.isArray(BIBLIOGRAFIAS_DATA)) {
            grid.innerHTML = `<div class="empty-viewer-card">⚠️ No se pudo cargar la base de datos de bibliografías médicas.</div>`;
            return;
        }

        let filtered = BIBLIOGRAFIAS_DATA.filter(book => {
            const matchesCategory = (state.currentBibliotecaCategory === "todos") || 
                                    (book.category === state.currentBibliotecaCategory);
            
            const query = state.bibliotecaSearch;
            const matchesSearch = !query || 
                                  book.title.toLowerCase().includes(query) ||
                                  book.author.toLowerCase().includes(query) ||
                                  book.category.toLowerCase().includes(query) ||
                                  book.description.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-viewer-card" style="grid-column: 1 / -1; padding: 48px; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
                    <h4 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700;">No se encontraron libros</h4>
                    <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">Prueba ajustando el término de búsqueda o seleccionando otra categoría.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = "";
        filtered.forEach(book => {
            const card = document.createElement("div");
            card.className = "book-card animate-fade";

            const isAller = Array.isArray(book.chapters) && book.chapters.length > 0;

            let actionButtonsHtml = "";
            if (isAller) {
                actionButtonsHtml = `
                    <button class="book-btn-download" id="openAllerBtn_${book.id}" style="grid-column: 1 / -1; width: 100%; justify-content: center; cursor: pointer;">
                        📚 Explorar Capítulos (${book.chapters.length})
                    </button>
                `;
            } else {
                actionButtonsHtml = `
                    <a href="${book.file}" target="_blank" class="book-btn-read" id="readBook_${book.id}">
                        👁️ Leer Libro
                    </a>
                    <a href="${book.file}" download class="book-btn-download" id="dlBook_${book.id}">
                        📥 Descargar PDF
                    </a>
                `;
            }

            card.innerHTML = `
                <div>
                    <div class="book-header">
                        <div class="book-icon-wrapper">${book.icon || '📖'}</div>
                        <div class="book-info-header">
                            <div class="book-badges-row">
                                <span class="book-pill-category">${book.category}</span>
                                <span class="book-pill-edition">${book.edition}</span>
                            </div>
                            <h3 class="book-title">${book.title}</h3>
                            <div class="book-author">✍️ ${book.author}</div>
                        </div>
                    </div>
                    <p class="book-desc">${book.description}</p>
                </div>
                <div>
                    <div class="book-meta-footer">
                        <span>🏷️ <strong>${book.badge || 'Texto Oficial'}</strong></span>
                        <span>📦 <strong>${book.size}</strong></span>
                    </div>
                    <div class="book-actions-group">
                        ${actionButtonsHtml}
                    </div>
                </div>
            `;

            grid.appendChild(card);

            if (isAller) {
                const btnAller = card.querySelector(`#openAllerBtn_${book.id}`);
                if (btnAller) {
                    btnAller.addEventListener("click", (e) => {
                        if (!isUserVip()) {
                            e.preventDefault();
                            showVipPaywallModal(`el libro ${book.title}`);
                            return;
                        }
                        openAllerChaptersModal(book);
                    });
                }
            } else {
                const btnRead = card.querySelector(`#readBook_${book.id}`);
                if (btnRead) {
                    btnRead.addEventListener("click", (e) => {
                        if (!isUserVip()) {
                            e.preventDefault();
                            showVipPaywallModal(`el libro ${book.title}`);
                            return;
                        }
                        trackUserActivity("read_book", {
                            bookId: book.id,
                            title: book.title,
                            category: book.category
                        });
                    });
                }
                const btnDl = card.querySelector(`#dlBook_${book.id}`);
                if (btnDl) {
                    btnDl.addEventListener("click", (e) => {
                        if (!isUserVip()) {
                            e.preventDefault();
                            showVipPaywallModal(`el libro ${book.title}`);
                            return;
                        }
                        trackUserActivity("download", {
                            filename: book.file,
                            title: book.title,
                            type: "Libro de Biblioteca"
                        });
                    });
                }
            }
        });
    }

    let activeAllerBook = null;

    function openAllerChaptersModal(book) {
        activeAllerBook = book;
        const modal = document.getElementById("allerChaptersModal");
        if (!modal) return;
        modal.style.display = "flex";
        const search = document.getElementById("allerChapterSearch");
        if (search) search.value = "";
        renderAllerChapters("");
    }

    function closeAllerChaptersModal() {
        const modal = document.getElementById("allerChaptersModal");
        if (modal) modal.style.display = "none";
    }

    function renderAllerChapters(searchQuery = "") {
        const container = document.getElementById("allerChaptersContainer");
        if (!container || !activeAllerBook || !activeAllerBook.chapters) return;

        const chapters = activeAllerBook.chapters.filter(ch => {
            return !searchQuery || ch.name.toLowerCase().includes(searchQuery);
        });

        if (chapters.length === 0) {
            container.innerHTML = `<div class="empty-viewer-card" style="grid-column: 1 / -1;">No se encontraron capítulos con el término '${searchQuery}'.</div>`;
            return;
        }

        container.innerHTML = "";
        chapters.forEach(ch => {
            const card = document.createElement("div");
            card.className = "chapter-item-card";
            card.innerHTML = `
                <div>
                    <div class="chapter-title">📄 ${ch.name}</div>
                    <div class="chapter-size">Tamaño: ${ch.size}</div>
                </div>
                <div class="chapter-actions">
                    <a href="${ch.file}" target="_blank" class="chapter-btn-icon chapter-btn-read" title="Leer Capítulo en PDF">👁️ Leer</a>
                    <a href="${ch.file}" download class="chapter-btn-icon chapter-btn-dl" title="Descargar Capítulo (PDF)">📥 Bajar</a>
                </div>
            `;

            // VIP Guard on individual chapter actions
            card.querySelectorAll(".chapter-btn-icon").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    if (!isUserVip()) {
                        e.preventDefault();
                        showVipPaywallModal(`el capítulo ${ch.name}`);
                        return;
                    }
                });
            });

            container.appendChild(card);
        });
    }

    // ==========================================
    // AUTHENTICATION MODULE
    // ==========================================
    function initAuth() {
        // Toggle between Login Card and Registration Card
        const loginCard = document.querySelector("#loginOverlay .login-card:not(#registerCard)");
        const registerCard = document.getElementById("registerCard");
        const showRegisterCardBtn = document.getElementById("showRegisterCardBtn");
        const showLoginCardBtn = document.getElementById("showLoginCardBtn");

        if (showRegisterCardBtn && loginCard && registerCard) {
            showRegisterCardBtn.addEventListener("click", () => {
                loginCard.style.display = "none";
                registerCard.style.display = "block";
                const selfRegError = document.getElementById("selfRegError");
                const selfRegSuccess = document.getElementById("selfRegSuccess");
                if (selfRegError) selfRegError.style.display = "none";
                if (selfRegSuccess) selfRegSuccess.style.display = "none";
            });
        }

        if (showLoginCardBtn && loginCard && registerCard) {
            showLoginCardBtn.addEventListener("click", () => {
                registerCard.style.display = "none";
                loginCard.style.display = "block";
            });
        }

        // VIP Modal Close buttons
        const closeVipBtn = document.getElementById("closeVipModalBtn");
        const vipModal = document.getElementById("vipPaywallModal");
        if (closeVipBtn) closeVipBtn.addEventListener("click", closeVipPaywallModal);
        if (vipModal) {
            vipModal.addEventListener("click", (e) => {
                if (e.target === vipModal) closeVipPaywallModal();
            });
        }

        // Student Self-Registration Submission Handler
        const selfRegisterForm = document.getElementById("selfRegisterForm");
        const selfRegName = document.getElementById("selfRegName");
        const selfRegEmail = document.getElementById("selfRegEmail");
        const selfRegPhone = document.getElementById("selfRegPhone");
        const selfRegState = document.getElementById("selfRegState");
        const selfRegYear = document.getElementById("selfRegYear");
        const selfRegPassword = document.getElementById("selfRegPassword");
        const selfRegError = document.getElementById("selfRegError");
        const selfRegSuccess = document.getElementById("selfRegSuccess");
        const selfRegSubmitBtn = document.getElementById("selfRegSubmitBtn");

        if (selfRegisterForm) {
            selfRegisterForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                if (selfRegError) selfRegError.style.display = "none";
                if (selfRegSuccess) selfRegSuccess.style.display = "none";

                const name = selfRegName.value.trim();
                const email = selfRegEmail.value.trim().toLowerCase();
                const phone = selfRegPhone.value.trim();
                const stateOrigin = selfRegState.value;
                const currentYear = selfRegYear.value;
                const password = selfRegPassword.value;

                if (!name || !email || !phone || !stateOrigin || !currentYear || !password) {
                    if (selfRegError) {
                        selfRegError.textContent = "Por favor completa todos los campos obligatorios.";
                        selfRegError.style.display = "block";
                    }
                    return;
                }

                if (password.length < 6) {
                    if (selfRegError) {
                        selfRegError.textContent = "La contraseña debe tener al menos 6 caracteres.";
                        selfRegError.style.display = "block";
                    }
                    return;
                }

                if (selfRegSubmitBtn) {
                    selfRegSubmitBtn.disabled = true;
                    selfRegSubmitBtn.textContent = "⏳ Guardando inscripción...";
                }

                try {
                    // Check if email already registered
                    const existing = await db_getUserByEmail(email);
                    if (existing) {
                        throw new Error("Ya existe una cuenta registrada con este correo electrónico.");
                    }

                    // Create user in Firestore (saved to live database and admin student roster)
                    const newUserData = {
                        name: name,
                        email: email,
                        phone: phone,
                        stateOrigin: stateOrigin,
                        enrollmentYear: new Date().getFullYear().toString(),
                        currentYear: currentYear,
                        password: password,
                        role: "usuario"
                    };

                    await db_createUser(newUserData);

                    // Fetch created user and establish session
                    const user = await db_getUserByEmail(email);
                    const token = "token_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                    await db_saveSessionToken(email, token);

                    const sessionObj = { email: email, token: token };
                    localStorage.setItem("morfo_session", JSON.stringify(sessionObj));

                    if (selfRegSuccess) {
                        selfRegSuccess.textContent = "🎉 ¡Inscripción completada con éxito! Ingresando al portal...";
                        selfRegSuccess.style.display = "block";
                    }

                    setTimeout(() => {
                        loginOverlay.classList.remove("active");
                        state.currentUser = user;
                        setupAuthenticatedUI();

                        if (user.currentYear && user.currentYear.includes("1er")) {
                            setCourse("morfo1");
                        } else if (user.currentYear && user.currentYear.includes("3er")) {
                            setCourse("morfo3");
                        } else {
                            setCourse("morfo2");
                        }

                        startSessionLivenessCheck();
                        trackUserActivity("navigation", { section: "inicio", name: "Inicio tras Auto-Inscripción" });
                    }, 800);

                } catch (err) {
                    console.error("Self-registration error:", err);
                    if (selfRegError) {
                        selfRegError.textContent = err.message || "Error al procesar la inscripción.";
                        selfRegError.style.display = "block";
                    }
                } finally {
                    if (selfRegSubmitBtn) {
                        selfRegSubmitBtn.disabled = false;
                        selfRegSubmitBtn.textContent = "✅ Registrarse e Ingresar";
                    }
                }
            });
        }

        if (loginForm) {
            loginForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                const email = loginEmail.value.trim();
                const pass = loginPassword.value;
                const submitBtn = loginForm.querySelector("button[type='submit']");
                const originalBtnText = submitBtn ? submitBtn.textContent : "Ingresar";

                try {
                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.textContent = "⏳ Verificando credenciales...";
                    }
                    if (loginError) loginError.style.display = "none";

                    const user = await db_login(email, pass);
                    
                    // Create dynamic session token
                    const token = "token_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
                    await db_saveSessionToken(email, token);
                    
                    // Save session in local storage
                    const sessionObj = { email: email.toLowerCase(), token: token };
                    localStorage.setItem("morfo_session", JSON.stringify(sessionObj));
                    
                    loginOverlay.classList.remove("active");
                    loginEmail.value = "";
                    loginPassword.value = "";
                    loginError.style.display = "none";
                    
                    state.currentUser = user;
                    setupAuthenticatedUI();
                    
                    // Set active course based on registration
                    if (user.currentYear && user.currentYear.includes("1er")) {
                        setCourse("morfo1");
                    } else if (user.currentYear && user.currentYear.includes("3er")) {
                        setCourse("morfo3");
                    } else {
                        setCourse("morfo2");
                    }

                    // Start liveness check
                    startSessionLivenessCheck();
                    
                } catch (err) {
                    console.error("Login error:", err);
                    loginError.style.display = "block";
                    loginError.textContent = err.message || "Credenciales incorrectas";
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalBtnText;
                    }
                }
            });
        }

        // Auto-login if session exists in LocalStorage
        const storedSession = localStorage.getItem("morfo_session");
        if (storedSession) {
            try {
                const session = JSON.parse(storedSession);
                db_getUserByEmail(session.email).then(user => {
                    if (user && user.activeSessionToken === session.token) {
                        state.currentUser = user;
                        loginOverlay.classList.remove("active");
                        setupAuthenticatedUI();
                        
                        // Set active course based on registration
                        if (user.currentYear && user.currentYear.includes("1er")) {
                            setCourse("morfo1");
                        } else if (user.currentYear && user.currentYear.includes("3er")) {
                            setCourse("morfo3");
                        } else {
                            setCourse("morfo2");
                        }

                        startSessionLivenessCheck();
                    } else {
                        // Token mismatch or invalid
                        localStorage.removeItem("morfo_session");
                        loginOverlay.classList.add("active");
                    }
                }).catch(e => {
                    console.error("Session auto login error:", e);
                    loginOverlay.classList.add("active");
                });
            } catch (err) {
                localStorage.removeItem("morfo_session");
                loginOverlay.classList.add("active");
            }
        }
    }

    function setupAuthenticatedUI() {
        if (!state.currentUser) return;

        // Render Profile Photo / Avatar
        const avatarUrl = state.currentUser.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        sidebarAvatar.src = avatarUrl;
        sidebarUsername.textContent = state.currentUser.name || state.currentUser.email;
        
        const isSuperuser = state.currentUser.role === "superuser";
        const hasVip = isUserVip();
        sidebarRole.innerHTML = (isSuperuser ? "👑 DOCENTE / ADMIN" : `ESTUDIANTE / ${state.currentUser.currentYear}`) + 
            (hasVip ? ' <span class="vip-badge active" style="font-size: 0.65rem; margin-left: 4px;">⭐ VIP</span>' : ' <span class="vip-badge inactive" style="font-size: 0.65rem; margin-left: 4px;">⚪ ESTÁNDAR</span>');
        
        userSidebarProfile.style.display = "block";
        logoutBtn.style.display = "flex";
        navProfile.style.display = "flex";

        if (state.currentUser.role === "superuser") {
            navAdmin.style.display = "flex";
        } else {
            navAdmin.style.display = "none";
        }

        // Complete Profile check
        checkProfileCompleteness();
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            if (state.currentUser) {
                try {
                    await db_clearSessionToken(state.currentUser.email);
                } catch(e) { console.warn("Logout token clear fail:", e); }
            }
            localStorage.removeItem("morfo_session");
            window.location.reload();
        });
    }

    // ==========================================
    // MULTI-DEVICE SESSION CONCURRENCY CHECK
    // ==========================================
    let livenessInterval = null;
    function startSessionLivenessCheck() {
        if (livenessInterval) clearInterval(livenessInterval);
        livenessInterval = setInterval(async () => {
            const storedSession = localStorage.getItem("morfo_session");
            if (!storedSession || !state.currentUser) return;
            
            try {
                const session = JSON.parse(storedSession);
                const activeToken = await db_getSessionToken(session.email);
                
                if (activeToken && activeToken !== session.token) {
                    // Mismatch: session has been open elsewhere
                    clearInterval(livenessInterval);
                    document.getElementById("concurrentSessionModal").classList.add("active");
                }
            } catch (err) {
                console.warn("Session check failure:", err);
            }
        }, 5000);
    }

    const reloginBtn = document.getElementById("reloginBtn");
    if (reloginBtn) {
        reloginBtn.addEventListener("click", () => {
            localStorage.removeItem("morfo_session");
            window.location.reload();
        });
    }

    // ==========================================
    // PROFILE MANAGEMENT
    // ==========================================
    function initProfile() {
        const form = document.getElementById("editProfileForm");
        if (form) {
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                if (!state.currentUser) return;

                const nameVal = document.getElementById("editProfileName").value.trim();
                const phoneVal = document.getElementById("editProfilePhone").value.trim();
                const passVal = document.getElementById("editProfilePassword").value.trim();
                const stateVal = document.getElementById("editProfileState").value;
                const enrollVal = document.getElementById("editProfileEnrollment").value;
                const yearVal = document.getElementById("editProfileCurrentYear").value;

                try {
                    const updates = {
                        name: nameVal,
                        phone: phoneVal,
                        password: passVal,
                        stateOrigin: stateVal,
                        enrollmentYear: enrollVal,
                        currentYear: yearVal
                    };

                    await db_updateUser(state.currentUser.email, updates);
                    
                    // Update state.currentUser
                    state.currentUser = { ...state.currentUser, ...updates };
                    setupAuthenticatedUI();

                    const successAlert = document.getElementById("editProfileSuccess");
                    if (successAlert) {
                        successAlert.style.display = "block";
                        setTimeout(() => successAlert.style.display = "none", 4000);
                    }

                    trackUserActivity("profile_update", { email: state.currentUser.email });
                } catch(err) {
                    console.error("Profile update error:", err);
                    alert("No se pudo actualizar tu ficha.");
                }
            });
        }

        // Profile Photo Upload (Base64 conversion)
        const photoInput = document.getElementById("photoUploadInput");
        if (photoInput) {
            photoInput.addEventListener("change", function(e) {
                const file = e.target.files[0];
                if (!file || !state.currentUser) return;

                const reader = new FileReader();
                reader.onload = async function(event) {
                    const base64String = event.target.result;
                    try {
                        await db_updateUser(state.currentUser.email, { photo: base64String });
                        state.currentUser.photo = base64String;
                        document.getElementById("profilePageAvatar").src = base64String;
                        sidebarAvatar.src = base64String;
                    } catch(err) {
                        console.error("Photo upload error:", err);
                        alert("No se pudo guardar tu foto.");
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function renderProfile() {
        if (!state.currentUser) return;

        document.getElementById("profilePageAvatar").src = state.currentUser.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        document.getElementById("profilePageName").textContent = state.currentUser.name || "Tu Nombre";
        document.getElementById("profilePageEmailDisplay").textContent = state.currentUser.email;
        
        const roleBadgeEl = document.getElementById("profilePageRoleBadge");
        if (roleBadgeEl) {
            if (state.currentUser.role === "superuser") {
                roleBadgeEl.innerHTML = `👑 Docente / Superadmin <span class="vip-badge active" style="margin-left: 6px;">⭐ VIP</span>`;
            } else {
                roleBadgeEl.innerHTML = `Estudiante ${state.currentUser.isVip ? '<span class="vip-badge active" style="margin-left: 6px;">⭐ VIP ACTIVO</span>' : '<span class="vip-badge inactive" style="margin-left: 6px;">⚪ ESTÁNDAR</span>'}`;
            }
        }

        // Editable inputs
        document.getElementById("editProfileName").value = state.currentUser.name || "";
        document.getElementById("editProfilePhone").value = state.currentUser.phone || "";
        document.getElementById("editProfileEmail").value = state.currentUser.email;
        document.getElementById("editProfileEmail").disabled = true; // Correo bloqueado
        document.getElementById("editProfilePassword").value = state.currentUser.password || "";
        document.getElementById("editProfileState").value = state.currentUser.stateOrigin || "";
        document.getElementById("editProfileEnrollment").value = state.currentUser.enrollmentYear || "2026";
        document.getElementById("editProfileCurrentYear").value = state.currentUser.currentYear || "2do Año";

        // Summaries
        document.getElementById("profileSummaryState").textContent = state.currentUser.stateOrigin || "No completado";
        document.getElementById("profileSummaryYear").textContent = state.currentUser.currentYear || "2do Año";
        document.getElementById("profileSummaryRole").textContent = state.currentUser.role;
    }

    // ==========================================
    // MANDATORY PROFILE COMPLETENESS CHECK
    // ==========================================
    function checkProfileCompleteness() {
        if (!state.currentUser) return;
        
        // Superuser doesn't need mandatory form block
        if (state.currentUser.role === "superuser") return;

        const isComplete = state.currentUser.name && 
                           state.currentUser.phone && 
                           state.currentUser.stateOrigin && 
                           state.currentUser.enrollmentYear && 
                           state.currentUser.currentYear;

        const modal = document.getElementById("completeProfileModal");
        if (!isComplete) {
            modal.classList.add("active");
            // Fill any pre-existing
            document.getElementById("compName").value = state.currentUser.name || "";
            document.getElementById("compPhone").value = state.currentUser.phone || "";
            document.getElementById("compStateOrigin").value = state.currentUser.stateOrigin || "";
            document.getElementById("compEnrollmentYear").value = state.currentUser.enrollmentYear || "2026";
            document.getElementById("compCurrentYear").value = state.currentUser.currentYear || "2do Año";
        } else {
            modal.classList.remove("active");
        }
    }

    function initProfileCompleteness() {
        const form = document.getElementById("completeProfileForm");
        const modal = document.getElementById("completeProfileModal");
        const errorDiv = document.getElementById("compError");

        if (form) {
            form.addEventListener("submit", async function(e) {
                e.preventDefault();
                if (!state.currentUser) return;

                const name = document.getElementById("compName").value.trim();
                const phone = document.getElementById("compPhone").value.trim();
                const stateOrigin = document.getElementById("compStateOrigin").value;
                const enroll = document.getElementById("compEnrollmentYear").value;
                const year = document.getElementById("compCurrentYear").value;

                if (!name || !phone || !stateOrigin || !enroll || !year) {
                    errorDiv.style.display = "block";
                    return;
                }

                try {
                    const updates = {
                        name: name,
                        phone: phone,
                        stateOrigin: stateOrigin,
                        enrollmentYear: enroll,
                        currentYear: year
                    };
                    await db_updateUser(state.currentUser.email, updates);
                    
                    state.currentUser = { ...state.currentUser, ...updates };
                    setupAuthenticatedUI();
                    
                    modal.classList.remove("active");
                    errorDiv.style.display = "none";
                    
                    // Set active course based on registration
                    if (year.includes("1er")) {
                        setCourse("morfo1");
                    } else if (year.includes("3er")) {
                        setCourse("morfo3");
                    } else {
                        setCourse("morfo2");
                    }
                } catch(err) {
                    console.error("Mandatory update error:", err);
                    alert("Ocurrió un error al guardar tus datos.");
                }
            });
        }
    }

    // ==========================================
    // TELEMETRY ACTIVITIY TRACKER (TELEMETRIA)
    // ==========================================
    function trackUserActivity(actionType, detailObj) {
        if (!state.currentUser) return;
        
        const timestamp = new Date().toISOString();
        const entry = {
            ...detailObj,
            timestamp: timestamp
        };

        if (actionType === "navigation") {
            db_trackNavigation(state.currentUser.email, entry);
        } else if (actionType === "download") {
            db_trackDownload(state.currentUser.email, entry);
        } else if (actionType === "ai_chat") {
            db_trackAiChat(state.currentUser.email, entry);
        }
    }

    // ==========================================
    // ADMIN DASHBOARD & GIS MAP
    // ==========================================
    function initAdmin() {
        const filterState = document.getElementById("gisFilterState");
        const filterYear = document.getElementById("gisFilterYear");
        const searchInput = document.getElementById("gisSearchStudent");
        const regState = document.getElementById("regStateOrigin");
        const regForm = document.getElementById("registerUserForm");
        const usersTableSearch = document.getElementById("adminUsersTableSearch");

        // Load states list in dropdowns
        const statesList = Object.keys(VENEZUELA_STATES_DATA).sort();
        
        if (filterState) {
            filterState.innerHTML = `<option value="todos">Todos los Estados</option>`;
            statesList.forEach(st => {
                filterState.innerHTML += `<option value="${st}">${st}</option>`;
            });
            filterState.addEventListener("change", (e) => {
                state.gisFilterState = e.target.value;
                renderGisMap();
            });
        }

        if (regState) {
            regState.innerHTML = `<option value="" disabled selected>Selecciona Estado...</option>`;
            statesList.forEach(st => {
                regState.innerHTML += `<option value="${st}">${st}</option>`;
            });
        }

        // Profile complete state dropdown as well
        const compState = document.getElementById("compStateOrigin");
        if (compState && compState.children.length <= 1) {
            compState.innerHTML = `<option value="" disabled selected>Selecciona tu Estado...</option>`;
            statesList.forEach(st => {
                compState.innerHTML += `<option value="${st}">${st}</option>`;
            });
        }

        if (filterYear) {
            filterYear.addEventListener("change", (e) => {
                state.gisFilterYear = e.target.value;
                renderGisMap();
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                state.gisSearchQuery = e.target.value.toLowerCase();
                renderGisMap();
            });
        }

        if (usersTableSearch) {
            usersTableSearch.addEventListener("input", (e) => {
                renderUsersTable(e.target.value.toLowerCase());
            });
        }

        // Recent Members Search & Filters
        const rmSearch = document.getElementById("recentMembersSearch");
        if (rmSearch) {
            rmSearch.addEventListener("input", (e) => {
                state.recentMembersSearch = e.target.value.toLowerCase().trim();
                db_getAllUsers().then(users => renderRecentMembers(users));
            });
        }

        const rmFilterAll = document.getElementById("rmFilterAll");
        const rmFilterWeek = document.getElementById("rmFilterWeek");
        const rmFilterNonVip = document.getElementById("rmFilterNonVip");

        if (rmFilterAll) {
            rmFilterAll.addEventListener("click", () => {
                state.recentMembersFilter = "all";
                updateRmFilterBtns(rmFilterAll);
                db_getAllUsers().then(users => renderRecentMembers(users));
            });
        }
        if (rmFilterWeek) {
            rmFilterWeek.addEventListener("click", () => {
                state.recentMembersFilter = "week";
                updateRmFilterBtns(rmFilterWeek);
                db_getAllUsers().then(users => renderRecentMembers(users));
            });
        }
        if (rmFilterNonVip) {
            rmFilterNonVip.addEventListener("click", () => {
                state.recentMembersFilter = "nonvip";
                updateRmFilterBtns(rmFilterNonVip);
                db_getAllUsers().then(users => renderRecentMembers(users));
            });
        }

        function updateRmFilterBtns(activeBtn) {
            [rmFilterAll, rmFilterWeek, rmFilterNonVip].forEach(b => {
                if (b) b.classList.remove("active");
            });
            if (activeBtn) activeBtn.classList.add("active");
        }

        // Student Registration Handler
        if (regForm) {
            regForm.addEventListener("submit", async function(e) {
                e.preventDefault();
                const name = document.getElementById("regName").value.trim();
                const phone = document.getElementById("regPhone").value.trim();
                const email = document.getElementById("regEmail").value.trim().toLowerCase();
                const stateOrigin = document.getElementById("regStateOrigin").value;
                const enroll = document.getElementById("regEnrollmentYear").value;
                const currentYear = document.getElementById("regCurrentYear").value;
                const password = document.getElementById("regPassword").value;

                try {
                    const existing = await db_getUserByEmail(email);
                    if (existing) {
                        alert("El correo electrónico ya está registrado en la base de datos.");
                        return;
                    }

                    await db_createUser({
                        name, phone, email, stateOrigin, enrollmentYear: enroll, currentYear, password
                    });

                    document.getElementById("regSuccess").style.display = "block";
                    setTimeout(() => document.getElementById("regSuccess").style.display = "none", 4000);
                    regForm.reset();
                    
                    // Reload table, recent members and map
                    renderAdmin();
                    renderGisMap();
                } catch(err) {
                    console.error("Reg error:", err);
                    alert("Error al registrar el estudiante.");
                }
            });
        }
    }

    async function renderAdmin() {
        if (!state.currentUser || state.currentUser.role !== "superuser") return;

        try {
            const users = await db_getAllUsers();
            
            // Calculate Stats Cards
            document.getElementById("adminUserCount").textContent = users.length;
            
            const statesSet = new Set(users.map(u => u.stateOrigin).filter(Boolean));
            document.getElementById("adminMappedStatesCount").textContent = statesSet.size;

            let totalAiChats = 0;
            let totalDownloads = 0;
            users.forEach(u => {
                if (u.activityLog) {
                    if (u.activityLog.aiChats) totalAiChats += u.activityLog.aiChats.length;
                    if (u.activityLog.downloads) {
                        u.activityLog.downloads.forEach(d => totalDownloads += (d.count || 1));
                    }
                }
            });
            document.getElementById("adminAiQueriesCount").textContent = totalAiChats;
            document.getElementById("adminTotalDownloadsCount").textContent = totalDownloads;

            // Render Recent Members Widget
            renderRecentMembers(users);

            // Render Users Table
            renderUsersTable();

            // Render Admin Feedback Table
            renderAdminFeedbackTable();
        } catch(err) {
            console.error("Admin render stats error:", err);
        }
    }

    function renderRecentMembers(allUsers) {
        const grid = document.getElementById("recentMembersGrid");
        if (!grid) return;
        
        // Filter out superuser and keep students
        const students = (allUsers || []).filter(u => u.email.toLowerCase() !== "lams210488@gmail.com" && u.role !== "superuser");
        
        // Compute counts
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        
        const weekCount = students.filter(u => {
            if (!u.createdAt) return true;
            const d = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
            return d >= sevenDaysAgo;
        }).length;
        
        const nonVipCount = students.filter(u => !u.isVip).length;

        const countAllEl = document.getElementById("rmCountAll");
        const countWeekEl = document.getElementById("rmCountWeek");
        const countNonVipEl = document.getElementById("rmCountNonVip");
        if (countAllEl) countAllEl.textContent = students.length;
        if (countWeekEl) countWeekEl.textContent = weekCount;
        if (countNonVipEl) countNonVipEl.textContent = nonVipCount;

        // Filter students
        let filtered = students.filter(u => {
            const query = state.recentMembersSearch || "";
            const matchesQuery = !query ||
                (u.name || "").toLowerCase().includes(query) ||
                (u.email || "").toLowerCase().includes(query) ||
                (u.stateOrigin || "").toLowerCase().includes(query) ||
                (u.phone || "").toLowerCase().includes(query);

            if (!matchesQuery) return false;

            if (state.recentMembersFilter === "week") {
                if (!u.createdAt) return true;
                const d = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
                return d >= sevenDaysAgo;
            } else if (state.recentMembersFilter === "nonvip") {
                return !u.isVip;
            }
            return true;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-secondary); background: rgba(255,255,255,0.02); border-radius: var(--border-radius-md); border: 1px dashed var(--border-color);">
                    <span style="font-size: 1.8rem; display: block; margin-bottom: 6px;">👥</span>
                    <p style="font-size: 0.9rem; font-weight: 600;">No se encontraron miembros con el filtro actual.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = "";
        filtered.slice(0, 12).forEach(u => {
            const card = document.createElement("div");
            card.className = "recent-member-card is-new";
            
            const avatar = u.photo || "";
            const initial = (u.name ? u.name.charAt(0) : (u.email ? u.email.charAt(0) : "E")).toUpperCase();
            const avatarHtml = avatar 
                ? `<img src="${avatar}" class="recent-member-avatar" alt="${u.name}">` 
                : `<div class="recent-member-avatar">${initial}</div>`;

            const isVip = u.isVip === true;
            const cleanPhone = (u.phone || "").replace(/[^0-9]/g, "");
            const waMsg = encodeURIComponent(`Hola ${u.name || 'colega'}, te saluda el profesor Leonardo Morales del Portal Morfo. ¡Bienvenido/a a la plataforma! ¿Cómo vas con las clases orientadoras y el temario?`);
            const waUrl = `https://wa.me/${cleanPhone}?text=${waMsg}`;

            card.innerHTML = `
                <div>
                    <div class="recent-member-top">
                        ${avatarHtml}
                        <div class="recent-member-meta">
                            <div class="recent-member-name" title="${u.name || 'Estudiante'}">${u.name || 'Estudiante'}</div>
                            <div class="recent-member-email" title="${u.email}">${u.email}</div>
                        </div>
                    </div>

                    <div class="recent-member-tags">
                        <span class="recent-member-tag tag-state">📍 ${u.stateOrigin || 'Venezuela'}</span>
                        <span class="recent-member-tag tag-year">🎓 ${u.currentYear || '2do Año'}</span>
                        <span class="vip-badge ${isVip ? 'active' : 'inactive'}" style="font-size: 0.68rem; padding: 2px 6px;">
                            ${isVip ? '⭐ VIP' : '⚪ ESTÁNDAR'}
                        </span>
                    </div>
                </div>

                <div class="recent-member-actions">
                    ${cleanPhone ? `
                        <a href="${waUrl}" target="_blank" class="btn-rm-wa" title="Escribir al WhatsApp del estudiante">
                            💬 WhatsApp
                        </a>
                    ` : `
                        <span class="btn-rm-wa" style="opacity: 0.5; pointer-events: none;">Sin Teléfono</span>
                    `}
                    <button class="btn-rm-inspect btn-quick-vip" data-email="${u.email}" data-vip="${isVip ? 'true' : 'false'}" title="${isVip ? 'Revocar Insignia VIP' : 'Asignar Insignia VIP rápida'}">
                        ${isVip ? '⭐ Quitar VIP' : '⚡ Dar VIP'}
                    </button>
                    <button class="btn-rm-inspect btn-quick-audit" data-email="${u.email}" title="Ver auditoría y ficha completa">
                        👁️ Ficha
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

        // Bind Quick VIP
        grid.querySelectorAll(".btn-quick-vip").forEach(btn => {
            btn.addEventListener("click", async () => {
                const email = btn.getAttribute("data-email");
                const currentVip = btn.getAttribute("data-vip") === "true";
                btn.disabled = true;
                btn.textContent = "⏳...";
                try {
                    await db_toggleUserVip(email, currentVip);
                    renderAdmin();
                } catch(e) {
                    alert("Error al cambiar estado VIP");
                    renderAdmin();
                }
            });
        });

        // Bind Quick Audit
        grid.querySelectorAll(".btn-quick-audit").forEach(btn => {
            btn.addEventListener("click", () => {
                const email = btn.getAttribute("data-email");
                openDeepInfoModal(email);
            });
        });
    }

    async function renderUsersTable(searchFilter = "") {
        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;
        tbody.innerHTML = "";

        try {
            const users = await db_getAllUsers();
            const filtered = users.filter(u => {
                return u.name.toLowerCase().includes(searchFilter) ||
                       u.email.toLowerCase().includes(searchFilter) ||
                       u.stateOrigin.toLowerCase().includes(searchFilter) ||
                       u.phone.toLowerCase().includes(searchFilter);
            });

            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 24px; color: var(--text-secondary);">No se encontraron estudiantes registrados.</td></tr>`;
                return;
            }

            filtered.forEach(u => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border-color)";
                tr.style.fontSize = "0.85rem";
                
                const avatar = u.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                const isSuper = u.role === "superuser" || u.email.toLowerCase() === "lams210488@gmail.com";
                const isVipUser = u.isVip === true;
                
                const vipCellHtml = isSuper ? `
                    <span class="vip-badge active" style="font-size: 0.72rem;">👑 SUPERADMIN</span>
                ` : `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                        <span class="vip-badge ${isVipUser ? 'active' : 'inactive'}">
                            ${isVipUser ? '⭐ VIP ACTIVO' : '⚪ ESTÁNDAR'}
                        </span>
                        <button class="btn-toggle-vip ${isVipUser ? 'revoke' : 'grant'}" data-email="${u.email}" data-vip="${isVipUser ? 'true' : 'false'}">
                            ${isVipUser ? 'Revocar VIP' : '⭐ Otorgar VIP'}
                        </button>
                    </div>
                `;

                tr.innerHTML = `
                    <td style="padding: 10px 14px;"><img src="${avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border-color);"></td>
                    <td style="padding: 10px 14px; font-weight: 600; color: var(--text-primary);">${u.name || 'Docente / Admin'}</td>
                    <td style="padding: 10px 14px;"><a href="https://wa.me/${u.phone ? u.phone.replace(/[^0-9]/g, '') : ''}" target="_blank" style="color: #10b981; font-weight: 500; text-decoration: none;">💬 ${u.phone || 'S/N'}</a></td>
                    <td style="padding: 10px 14px; color: var(--text-secondary);">${u.email}</td>
                    <td style="padding: 10px 14px; font-family: monospace;">
                        <span class="admin-password-span" data-raw="${u.password}" style="-webkit-text-security: disc;">${u.password}</span>
                    </td>
                    <td style="padding: 10px 14px;">📍 ${u.stateOrigin || 'Venezuela'}</td>
                    <td style="padding: 10px 14px; font-weight: 500;"><span class="ao-badge">${u.currentYear || 'Docente'}</span></td>
                    <td style="padding: 10px 14px; color: var(--text-muted);">${u.enrollmentYear || '2026'}</td>
                    <td style="padding: 10px 14px;"><span class="system-badge" style="background: ${isSuper ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.06)'}; color: ${isSuper ? 'var(--accent-hover)' : 'var(--text-secondary)'}">${u.role}</span></td>
                    <td style="padding: 10px 14px; text-align: center;">${vipCellHtml}</td>
                    <td style="padding: 10px 14px; text-align: center; display: flex; justify-content: center; gap: 8px; align-items: center;">
                        <button class="download-btn btn-view-dossier" data-email="${u.email}" style="padding: 6px 12px; font-size: 0.75rem; background: rgba(59, 130, 246, 0.12); color: #60a5fa; border-color: rgba(59, 130, 246, 0.25);">
                            🔎 Auditoría
                        </button>
                        ${isSuper ? '' : `
                            <button class="download-btn btn-delete-user" data-email="${u.email}" style="padding: 6px 12px; font-size: 0.75rem; background: rgba(239, 68, 68, 0.12); color: #f87171; border-color: rgba(239, 68, 68, 0.25);">
                                🗑️ Eliminar
                            </button>
                        `}
                    </td>
                `;

                tbody.appendChild(tr);
            });

            // Bind VIP Toggle buttons
            tbody.querySelectorAll(".btn-toggle-vip").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const email = btn.getAttribute("data-email");
                    const currentVip = btn.getAttribute("data-vip") === "true";
                    btn.disabled = true;
                    btn.textContent = "⏳ Guardando...";
                    try {
                        await db_toggleUserVip(email, currentVip);
                        renderUsersTable(searchFilter);
                    } catch(err) {
                        console.error("Error al actualizar status VIP:", err);
                        alert("Error al actualizar el estado VIP del usuario.");
                        renderUsersTable(searchFilter);
                    }
                });
            });

            // Bind Table Action buttons
            tbody.querySelectorAll(".btn-view-dossier").forEach(btn => {
                btn.addEventListener("click", () => {
                    const email = btn.getAttribute("data-email");
                    openDeepInfoModal(email);
                });
            });

            tbody.querySelectorAll(".btn-delete-user").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const email = btn.getAttribute("data-email");
                    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente de la matrícula al estudiante: ${email}?`)) {
                        try {
                            await db_deleteUser(email);
                            renderAdmin();
                            renderGisMap();
                        } catch(err) {
                            alert("Error al eliminar el usuario.");
                        }
                    }
                });
            });
        } catch(err) {
            console.error("Users list render fail:", err);
        }
    }

    // Toggle showing table passwords plain text
    let showAllPasswords = false;
    const togglePasswordsBtn = document.getElementById("toggleAllPasswordsBtn");
    if (togglePasswordsBtn) {
        togglePasswordsBtn.addEventListener("click", () => {
            showAllPasswords = !showAllPasswords;
            const spans = document.querySelectorAll(".admin-password-span");
            spans.forEach(span => {
                if (showAllPasswords) {
                    span.style.webkitTextSecurity = "none";
                } else {
                    span.style.webkitTextSecurity = "disc";
                }
            });
        });
    }

    // ==========================================
    // GIS GEO-SPATIAL MAP (LEAFLET GIS)
    // ==========================================
    function initGisMap() {
        const gisContainer = document.getElementById("gisMap");
        if (!gisContainer || state.gisMap || typeof L === "undefined") return;

        // Initialize Leaflet Map Centered in Venezuela
        state.gisMap = L.map('gisMap', {
            center: [8.0000, -66.0000],
            zoom: 6,
            minZoom: 5,
            maxZoom: 16,
            zoomControl: true
        });

        // Use standard high-reliability OpenStreetMap tile service (100% uptime, no rate-limits/API blocks)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }).addTo(state.gisMap);

        state.gisMarkersLayer = L.layerGroup().addTo(state.gisMap);
    }

    async function renderGisMap() {
        if (!state.gisMap || !state.gisMarkersLayer || !state.currentUser || state.currentUser.role !== "superuser") return;

        // Auto-recalculate container dimensions after tab transition
        setTimeout(() => {
            if (state.gisMap) state.gisMap.invalidateSize();
        }, 200);

        // Clear existing markers
        state.gisMarkersLayer.clearLayers();

        try {
            const users = await db_getAllUsers();
            
            // Map users state frequencies to compute heat circles size
            const frequencies = {};
            users.forEach(u => {
                if (u.stateOrigin) {
                    frequencies[u.stateOrigin] = (frequencies[u.stateOrigin] || 0) + 1;
                }
            });

            // Filter users based on GIS filter settings
            const filteredUsers = users.filter(u => {
                const matchesState = state.gisFilterState === "todos" || u.stateOrigin === state.gisFilterState;
                const matchesYear = state.gisFilterYear === "todos" || u.currentYear === state.gisFilterYear;
                const matchesSearch = u.name.toLowerCase().includes(state.gisSearchQuery) || u.email.toLowerCase().includes(state.gisSearchQuery);
                return matchesState && matchesYear && matchesSearch && u.stateOrigin;
            });

            // Render geolocalized markers
            filteredUsers.forEach(u => {
                const coords = VENEZUELA_STATES_DATA[u.stateOrigin];
                if (!coords) return;

                // Slightly jitter coordinates if multiple students are in the same state so markers don't overlap exactly
                const jitterLat = (Math.random() - 0.5) * 0.18;
                const jitterLng = (Math.random() - 0.5) * 0.18;
                const markerLat = coords.lat + jitterLat;
                const markerLng = coords.lng + jitterLng;

                const avatar = u.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
                
                // Color accent of marker depends on student active year
                let markerColor = "#8b5cf6"; // Morfo II
                if (u.currentYear.includes("1er")) markerColor = "#3b82f6"; // Morfo I
                else if (u.currentYear.includes("3er")) markerColor = "#10b981"; // Morfo III

                const customIcon = L.divIcon({
                    html: `
                        <div style="position: relative; width: 34px; height: 34px; border-radius: 50%; border: 3px solid ${markerColor}; box-shadow: 0 0 10px rgba(0,0,0,0.5); overflow: hidden;">
                            <img src="${avatar}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `,
                    className: '',
                    iconSize: [34, 34],
                    iconAnchor: [17, 17]
                });

                const popupHtml = `
                    <div style="font-family: var(--font-body); padding: 6px; width: 220px; line-height: 1.4;">
                        <h4 style="margin: 0 0 4px 0; font-family: var(--font-heading); color: var(--text-primary); font-size: 0.95rem;">${u.name}</h4>
                        <p style="margin: 0; font-size: 0.78rem; color: #9ca3af;">📧 ${u.email}</p>
                        <p style="margin: 4px 0; font-size: 0.78rem;">🎓 Curso: <strong>${u.currentYear}</strong></p>
                        <p style="margin: 0; font-size: 0.78rem;">📍 Estado: <strong>${u.stateOrigin}</strong></p>
                        <hr style="border-color: rgba(255,255,255,0.08); margin: 8px 0;">
                        <div style="display: flex; justify-content: space-between;">
                            <a href="https://wa.me/${u.phone.replace(/[^0-9]/g, '')}" target="_blank" style="font-size: 0.75rem; text-decoration: none; color: #34d399; font-weight: bold;">💬 WhatsApp</a>
                            <a href="javascript:void(0)" class="gis-popup-audit-btn" data-email="${u.email}" style="font-size: 0.75rem; color: #60a5fa; font-weight: bold; text-decoration: none;">🔍 Auditoría</a>
                        </div>
                    </div>
                `;

                const marker = L.marker([markerLat, markerLng], { icon: customIcon }).addTo(state.gisMarkersLayer);
                marker.bindPopup(popupHtml);
                
                marker.on("popupopen", () => {
                    // Bind popup audit link click
                    const auditBtn = document.querySelector(".gis-popup-audit-btn");
                    if (auditBtn) {
                        auditBtn.addEventListener("click", () => {
                            const email = auditBtn.getAttribute("data-email");
                            openDeepInfoModal(email);
                        });
                    }
                });
            });

            // Draw heat frequency circles on state capitals
            for (const [stateName, count] of Object.entries(frequencies)) {
                const coords = VENEZUELA_STATES_DATA[stateName];
                if (!coords) continue;

                L.circle([coords.lat, coords.lng], {
                    color: 'rgba(139, 92, 246, 0.3)',
                    fillColor: 'rgba(139, 92, 246, 0.15)',
                    fillOpacity: 0.5,
                    radius: 20000 + (count * 15000) // size scales with student volume
                }).addTo(state.gisMarkersLayer);
            }

        } catch(err) {
            console.error("GIS render map error:", err);
        }
    }

    // ==========================================
    // DEEP INFO / AUDIT LOG MODAL (ADMIN ONLY)
    // ==========================================
    function initDeepInfoModal() {
        const modal = deepInfoModal || document.getElementById("deepInfoModal");
        const closeBtn = deepInfoCloseBtn || document.getElementById("deepInfoCloseBtn");

        if (closeBtn && modal) {
            closeBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        }
        
        if (modal) {
            // Deep tab button logic
            const deepTabs = modal.querySelectorAll(".tab-headers .tab-btn");
            const deepPanels = modal.querySelectorAll(".deep-info-body .deep-tab-panel");
            
            deepTabs.forEach(btn => {
                btn.addEventListener("click", () => {
                    const targetPanelId = btn.getAttribute("data-deep-tab");
                    deepTabs.forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    
                    deepPanels.forEach(p => {
                        if (p.id === "deepPanel" + targetPanelId.charAt(0).toUpperCase() + targetPanelId.slice(1)) {
                            p.style.display = "block";
                        } else {
                            p.style.display = "none";
                        }
                    });
                });
            });
        }
    }

    async function openDeepInfoModal(email) {
        const modal = deepInfoModal || document.getElementById("deepInfoModal");
        if (!modal) return;

        try {
            const u = await db_getUserByEmail(email);
            if (!u) return;

            state.currentDeepUser = u;

            // Load Header data
            const avatar = document.getElementById("deepInfoAvatar");
            if (avatar) avatar.src = u.photo || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
            
            const nameEl = document.getElementById("deepInfoName");
            if (nameEl) nameEl.textContent = u.name || "Sin nombre registrado";
            
            const emailEl = document.getElementById("deepInfoEmail");
            if (emailEl) emailEl.textContent = u.email;
            
            const phoneEl = document.getElementById("deepInfoPhone");
            if (phoneEl) phoneEl.textContent = u.phone || "Sin teléfono";
            
            const enrollEl = document.getElementById("deepInfoEnrollment");
            if (enrollEl) enrollEl.textContent = u.enrollmentYear || "N/A";
            
            const yearBadge = document.getElementById("deepInfoYearBadge");
            if (yearBadge) yearBadge.textContent = u.currentYear || "N/A";
            
            const stateBadge = document.getElementById("deepInfoStateBadge");
            if (stateBadge) stateBadge.textContent = u.stateOrigin || "Sin Estado";

            // Update Log counts
            const log = u.activityLog || {};
            const countAi = document.getElementById("deepCountAi");
            if (countAi) countAi.textContent = (log.aiChats || []).length;
            
            const countDl = document.getElementById("deepCountDownloads");
            if (countDl) countDl.textContent = (log.downloads || []).length;
            
            const countNav = document.getElementById("deepCountNav");
            if (countNav) countNav.textContent = (log.navigation || []).length;

            // Render deep panels contents
            renderDeepCredentialsPanel(u);
            renderDeepAiChatPanel(log.aiChats || []);
            renderDeepDownloadsPanel(log.downloads || []);
            renderDeepNavigationPanel(log.navigation || []);
            renderDeepNotesPanel(u);

            modal.classList.add("active");
            
            // Set tab 1 active by default
            const firstTab = modal.querySelector(".tab-headers .tab-btn");
            if (firstTab) firstTab.click();

        } catch (err) {
            console.error("Open deep info modal fail:", err);
        }
    }

    function renderDeepCredentialsPanel(user) {
        const panel = document.getElementById("deepPanelCredentials");
        if (!panel) return;

        panel.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
                <div class="card" style="padding: 16px; background: rgba(255,255,255,0.03);">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Correo Electrónico (Login)</span>
                    <h4 style="font-family: monospace; font-size: 0.95rem; margin-top: 4px; color: var(--text-primary); word-break: break-all;">${user.email}</h4>
                </div>
                <div class="card" style="padding: 16px; background: rgba(255,255,255,0.03);">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Contraseña en Texto Claro</span>
                    <h4 style="font-family: monospace; font-size: 1.05rem; margin-top: 4px; color: #fbbf24;">${user.password}</h4>
                </div>
                <div class="card" style="padding: 16px; background: rgba(255,255,255,0.03);">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Rol del Sistema</span>
                    <h4 style="font-size: 0.95rem; margin-top: 4px; color: var(--text-primary); text-transform: uppercase;">${user.role}</h4>
                </div>
                <div class="card" style="padding: 16px; background: rgba(255,255,255,0.03);">
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">Token de Sesión Activo</span>
                    <h4 style="font-family: monospace; font-size: 0.82rem; margin-top: 4px; color: var(--text-muted); word-break: break-all;">${user.activeSessionToken || 'Ninguno (Desconectado)'}</h4>
                </div>
            </div>
        `;
    }

    function renderDeepAiChatPanel(chats) {
        const panel = document.getElementById("deepPanelAiChat");
        if (!panel) return;

        if (chats.length === 0) {
            panel.innerHTML = `<p class="text-muted">El estudiante no ha realizado ninguna consulta al Tutor IA.</p>`;
            return;
        }

        let html = `<div style="display: flex; flex-direction: column; gap: 16px;">`;
        chats.forEach(c => {
            html += `
                <div class="card" style="padding: 16px; background: rgba(255,255,255,0.02); border-left: 3px solid var(--accent-color);">
                    <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-bottom: 6px;">
                        <span>Fecha: <strong>${new Date(c.timestamp).toLocaleString()}</strong></span>
                        <span style="color: #60a5fa;">Tópico: ${c.topic || 'Médico'}</span>
                    </div>
                    <p style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary); margin-bottom: 4px;">❓ Pregunta: "${c.query}"</p>
                    <p style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.5; background: rgba(0,0,0,0.15); padding: 8px; border-radius: var(--border-radius-sm);">🤖 Respuesta: ${c.reply.substring(0, 180)}...</p>
                </div>
            `;
        });
        html += `</div>`;
        panel.innerHTML = html;
    }

    function renderDeepDownloadsPanel(downloads) {
        const panel = document.getElementById("deepPanelDownloads");
        if (!panel) return;

        if (downloads.length === 0) {
            panel.innerHTML = `<p class="text-muted">El estudiante no ha descargado ningún material de estudio.</p>`;
            return;
        }

        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                        <th style="padding: 8px;">Archivo Descargado</th>
                        <th style="padding: 8px;">Tipo</th>
                        <th style="padding: 8px; text-align: center;">Cantidad</th>
                        <th style="padding: 8px;">Última fecha</th>
                    </tr>
                </thead>
                <tbody>
        `;
        downloads.forEach(d => {
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 8px; font-weight: 500; color: var(--text-primary);">${d.filename}</td>
                    <td style="padding: 8px; color: var(--text-muted);">${d.type || 'Material'}</td>
                    <td style="padding: 8px; text-align: center; font-weight: bold; color: var(--accent-hover);">${d.count || 1}</td>
                    <td style="padding: 8px; color: var(--text-secondary);">${new Date(d.lastDate).toLocaleString()}</td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        panel.innerHTML = html;
    }

    function renderDeepNavigationPanel(navLogs) {
        const panel = document.getElementById("deepPanelNavigation");
        if (!panel) return;

        if (navLogs.length === 0) {
            panel.innerHTML = `<p class="text-muted">Sin logs de navegación registrados.</p>`;
            return;
        }

        let html = `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                        <th style="padding: 8px;">Sección Visitada</th>
                        <th style="padding: 8px;">Fecha de Ingreso</th>
                    </tr>
                </thead>
                <tbody>
        `;
        navLogs.forEach(n => {
            html += `
                <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                    <td style="padding: 8px; font-weight: 500; color: var(--text-primary);">🧭 ${n.name}</td>
                    <td style="padding: 8px; color: var(--text-secondary);">${new Date(n.timestamp).toLocaleString()}</td>
                </tr>
            `;
        });
        html += `</tbody></table>`;
        panel.innerHTML = html;
    }

    function renderDeepNotesPanel(user) {
        const panel = document.getElementById("deepPanelNotes");
        if (!panel) return;
        panel.innerHTML = "";

        // Query all consolidated questions from all weeks in active subject
        let dbRef;
        if (state.currentCourse === "morfo1") dbRef = typeof MORFO_DATA_M1 !== "undefined" ? MORFO_DATA_M1 : null;
        else if (state.currentCourse === "morfo2") dbRef = typeof MORFO_DATA !== "undefined" ? MORFO_DATA : null;
        else dbRef = typeof MORFO_DATA_M3 !== "undefined" ? MORFO_DATA_M3 : null;

        if (!dbRef) {
            panel.innerHTML = `<p class="text-muted">No se pudo acceder a la base de datos del curso.</p>`;
            return;
        }

        let notesHtml = `<div style="display: flex; flex-direction: column; gap: 14px;">`;
        let foundNotes = false;

        // Since student answers are saved in LocalStorage of their device, for remote superuser audit
        // we display that notes are saved on their respective device, but we can look for any local answers
        // if the auditor is inspecting themselves (Leonardo Morales).
        // Let's explain this to the superuser auditor in the panel.
        notesHtml += `
            <div class="info-banner-card" style="margin-bottom: 10px;">
                <div class="banner-icon-badge">📝</div>
                <div class="banner-text-content">
                    <h3 class="banner-title">Cuaderno de Consolidación</h3>
                    <p class="banner-desc">Las respuestas y apuntes se almacenan de forma local en el navegador del estudiante. A continuación se muestran las notas si estás auditando tu propia cuenta local:</p>
                </div>
            </div>
        `;

        for (let w = 1; w <= 15; w++) {
            if (!dbRef[w]) continue;
            
            // Check general week note
            const localKey = `${state.currentCourse}_notes_w${w}_general`;
            const savedGeneralNote = localStorage.getItem(localKey);
            if (savedGeneralNote) {
                foundNotes = true;
                notesHtml += `
                    <div class="card" style="padding: 12px; background: rgba(255,255,255,0.02);">
                        <span class="ao-badge">Semana ${w} - General</span>
                        <p style="font-size: 0.85rem; color: var(--text-primary); margin-top: 6px;">"${savedGeneralNote}"</p>
                    </div>
                `;
            }

            // Check indexed questions
            for (let q = 0; q < 15; q++) {
                const qKey = `${state.currentCourse}_notes_w${w}_q${q}`;
                const savedQNote = localStorage.getItem(qKey);
                if (savedQNote) {
                    foundNotes = true;
                    notesHtml += `
                        <div class="card" style="padding: 12px; background: rgba(255,255,255,0.02);">
                            <span class="ao-badge">Semana ${w} - Pregunta ${q + 1}</span>
                            <p style="font-size: 0.85rem; color: var(--text-primary); margin-top: 6px;">"${savedQNote}"</p>
                        </div>
                    `;
                }
            }
        }

        if (!foundNotes) {
            notesHtml += `<p class="text-muted" style="padding: 10px 0;">No se registraron apuntes guardados en este navegador para esta asignatura.</p>`;
        }

        notesHtml += `</div>`;
        panel.innerHTML = notesHtml;
    }

    // ==========================================
    // PASSWORD VISIBILITY TOGGLE HELPERS
    // ==========================================
    function initPasswordToggles() {
        const btns = document.querySelectorAll(".toggle-password-btn");
        btns.forEach(btn => {
            btn.addEventListener("click", () => {
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

    // ==========================================
    // FLOATING AI TUTOR CHATBOT VIEWER
    // ==========================================
    function initAiTutor() {
        const fab = document.getElementById("aiTutorFab");
        const modal = document.getElementById("aiTutorChatModal");
        const closeBtn = document.getElementById("aiChatCloseBtn");
        const chatForm = document.getElementById("aiChatForm");
        const chatInput = document.getElementById("aiChatInput");
        const messagesContainer = document.getElementById("aiChatMessages");

        if (!fab || !modal) return;

        fab.addEventListener("click", () => {
            modal.classList.toggle("active");
            if (modal.classList.contains("active")) {
                if (chatInput) chatInput.focus();
                // Render welcome message if empty
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

        if (chatForm) {
            chatForm.addEventListener("submit", function(e) {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;

                // 1. Add user message
                appendChatMessage("user", text);
                chatInput.value = "";

                // 2. Generate AI response
                setTimeout(() => {
                    const reply = generateAiResponse(text);
                    appendChatMessage("bot", reply);
                    
                    // Telemetry log
                    trackUserActivity("ai_chat", {
                        query: text,
                        reply: reply,
                        topic: "Morfofisiología"
                    });
                }, 600);
            });
        }
    }

    function renderAiWelcomeMessage() {
        const container = document.getElementById("aiChatMessages");
        const chipsBar = document.getElementById("aiChipsBar");
        if (!container || !chipsBar) return;

        let title = "Tutor IA";
        let subtitle = "";
        let quickChips = [];

        if (state.currentCourse === "morfo1") {
            title = "Tutor IA Morfo I";
            subtitle = "¡Hola! Soy tu asistente de Morfofisiología I. Te puedo guiar con temas de biología celular, bioquímica de proteínas, ADN, tejidos corporales y anatomía del sistema locomotor. ¿Qué deseas consultar hoy?";
            quickChips = [
                { query: "¿Cuáles son las 10 capas de la corteza o la diferencia de organelos en la célula?", label: "🔬 Organelos" },
                { query: "Explícame la replicación del ADN de manera sencilla", label: "🧬 Replicación ADN" },
                { query: "¿Cómo se clasifican los tejidos epiteliales?", label: "📖 Clasificación Epitelio" }
            ];
        } else if (state.currentCourse === "morfo2") {
            title = "Tutor IA Morfo II";
            subtitle = "¡Hola! Soy tu asistente de Morfofisiología II. Te guiaré con gusto sobre neurología (médula espinal, vías de conducción, reflejos motor y sensitivos) e histología endocrina. ¿Qué duda aclaramos hoy?";
            quickChips = [
                { query: "¿Qué es el arco reflejo y cuáles son sus 5 componentes?", label: "⚡ Arco Reflejo" },
                { query: "Explícame la vía piramidal y extrapiramidal con un ejemplo clínico", label: "🧠 Vías Motoras" },
                { query: "¿Cómo diferencio las capas histológicas del cerebelo?", label: "🔬 Cerebelo e Histología" }
            ];
        } else {
            title = "Tutor IA Morfo III";
            subtitle = "¡Hola! Soy tu asistente de Morfofisiología III. Estoy programado para guiarte en el metabolismo de carbohidratos, lípidos, proteínas, anatomía reproductiva y fisiología de la sangre / inmunología. ¿Por dónde empezamos?";
            quickChips = [
                { query: "Explícame el metabolismo del glucógeno y la glucólisis aeróbica", label: "🍞 Metabolismo Glúcidos" },
                { query: "¿Cuáles son los órganos linfáticos y sus diferencias histológicas?", label: "🛡️ Órganos Linfáticos" },
                { query: "Diferencias del ciclo ovárico y ciclo menstrual uterino", label: "🚺 Ciclos Femeninos" }
            ];
        }

        // Update headers
        document.getElementById("aiTutorFabText").textContent = title;
        document.getElementById("aiChatHeaderTitle").textContent = title;

        // Welcome message
        appendChatMessage("bot", subtitle);

        // Render quick chips
        chipsBar.innerHTML = "";
        quickChips.forEach(chip => {
            const btn = document.createElement("button");
            btn.className = "ai-chip-btn";
            btn.textContent = chip.label;
            btn.addEventListener("click", () => {
                const chatInput = document.getElementById("aiChatInput");
                const chatForm = document.getElementById("aiChatForm");
                if (chatInput && chatForm) {
                    chatInput.value = chip.query;
                    chatForm.dispatchEvent(new Event("submit"));
                }
            });
            chipsBar.appendChild(btn);
        });
    }

    function formatAiChatMessage(rawText) {
        if (!rawText) return "";
        let html = rawText
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Markdown Headings
        html = html.replace(/^### (.*$)/gim, '<h4 style="margin: 8px 0 4px; font-size: 1.05rem; color: var(--accent-hover); font-weight: 700;">$1</h4>');
        html = html.replace(/^#### (.*$)/gim, '<h5 style="margin: 6px 0 2px; font-size: 0.92rem; color: var(--text-primary); font-weight: 600;">$1</h5>');

        // Blockquotes
        html = html.replace(/^&gt; (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-color); margin: 6px 0; padding-left: 10px; color: var(--text-secondary); font-style: italic; background: rgba(var(--accent-color-rgb), 0.06); border-radius: 0 6px 6px 0; padding: 6px 10px;">$1</blockquote>');

        // Horizontal Rule
        html = html.replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid var(--border-color); margin: 10px 0;">');

        // Bold and Italic
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 700;">$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Markdown Links [Text](URL)
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" style="color: var(--accent-hover); text-decoration: underline; font-weight: 600;">$1 ↗</a>');

        // Line breaks
        html = html.replace(/\n/g, "<br>");
        return html;
    }

    function appendChatMessage(sender, text) {
        const container = document.getElementById("aiChatMessages");
        if (!container) return;

        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-message ${sender === 'user' ? 'user' : 'bot'}`;
        msgDiv.innerHTML = `
            <div class="message-content">
                ${formatAiChatMessage(text)}
            </div>
        `;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    function generateAiResponse(query) {
        try {
            return getAiTutorResponse(query, state.currentCourse);
        } catch (err) {
            console.error("AI Tutor response error:", err);
            return `🤖 He recibido tu consulta sobre "${query}". Puedes consultar la sección de Temario Semanal, Clases Orientadoras en PDF y la Biblioteca Médica Digital para profundizar en este contenido.`;
        }
    }

    // ==========================================
    // FEEDBACK & COMMUNITY COMMENTS MODULE
    // ==========================================
    function initFeedback() {
        const feedbackForm = document.getElementById("feedbackForm");
        const starRatingGroup = document.getElementById("starRatingGroup");
        const ratingScoreDisplay = document.getElementById("ratingScoreDisplay");
        const fbFilterAll = document.getElementById("fbFilterAll");
        const fbFilterReplied = document.getElementById("fbFilterReplied");

        // Star score label updates
        if (starRatingGroup && ratingScoreDisplay) {
            starRatingGroup.querySelectorAll("input").forEach(radio => {
                radio.addEventListener("change", (e) => {
                    const val = e.target.value;
                    const labels = {
                        "5": "5.0 / 5.0 (¡Excelente!)",
                        "4": "4.0 / 5.0 (Muy Bueno)",
                        "3": "3.0 / 5.0 (Bueno)",
                        "2": "2.0 / 5.0 (Regular)",
                        "1": "1.0 / 5.0 (Por Mejorar)"
                    };
                    ratingScoreDisplay.textContent = labels[val] || `${val}.0 / 5.0`;
                });
            });
        }

        // Community wall filters
        if (fbFilterAll) {
            fbFilterAll.addEventListener("click", () => {
                state.currentFeedbackFilter = "all";
                fbFilterAll.classList.add("active");
                if (fbFilterReplied) fbFilterReplied.classList.remove("active");
                renderFeedback();
            });
        }
        if (fbFilterReplied) {
            fbFilterReplied.addEventListener("click", () => {
                state.currentFeedbackFilter = "replied";
                fbFilterReplied.classList.add("active");
                if (fbFilterAll) fbFilterAll.classList.remove("active");
                renderFeedback();
            });
        }

        // Form submission
        if (feedbackForm) {
            feedbackForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById("feedbackSubmitBtn");
                const successAlert = document.getElementById("feedbackSuccessAlert");

                const checkedRating = feedbackForm.querySelector('input[name="feedbackRating"]:checked');
                const rating = checkedRating ? Number(checkedRating.value) : 5;
                const category = document.getElementById("feedbackCategory").value;
                const name = document.getElementById("feedbackName").value.trim();
                const email = document.getElementById("feedbackEmail").value.trim();
                const course = document.getElementById("feedbackCourse").value;
                const message = document.getElementById("feedbackMessage").value.trim();
                const isPublic = document.getElementById("feedbackIsPublic").checked;

                if (!message) return;

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = `<span>⏳</span> Enviando feedback...`;
                }

                try {
                    await db_addFeedback({
                        name, email, course, category, rating, message, isPublic
                    });

                    if (successAlert) {
                        successAlert.style.display = "block";
                        setTimeout(() => { successAlert.style.display = "none"; }, 5000);
                    }

                    feedbackForm.reset();
                    if (ratingScoreDisplay) ratingScoreDisplay.textContent = "5.0 / 5.0 (Excelente)";
                    
                    // Re-render wall
                    renderFeedback();
                } catch (err) {
                    console.error("Feedback submit error:", err);
                    alert("Hubo un detalle al enviar el comentario, pero ha sido guardado.");
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = `<span>💬</span> Enviar Comentario y Retroalimentación`;
                    }
                }
            });
        }
    }

    async function renderFeedback() {
        const wallContainer = document.getElementById("feedbackWallCards");
        const nameInput = document.getElementById("feedbackName");
        const emailInput = document.getElementById("feedbackEmail");

        // Auto fill user profile if available
        if (state.currentUser) {
            if (nameInput && !nameInput.value) nameInput.value = state.currentUser.name || "";
            if (emailInput && !emailInput.value) emailInput.value = state.currentUser.email || "";
        }

        if (!wallContainer) return;

        try {
            const feedbacks = await db_getAllFeedback();
            
            // Count totals
            const repliedCount = feedbacks.filter(f => f.reply && f.status === "replied").length;
            const countAllEl = document.getElementById("fbCountAll");
            const countRepliedEl = document.getElementById("fbCountReplied");
            if (countAllEl) countAllEl.textContent = feedbacks.length;
            if (countRepliedEl) countRepliedEl.textContent = repliedCount;

            let filtered = feedbacks.filter(f => {
                if (f.isPublic === false) return false;
                if (state.currentFeedbackFilter === "replied") {
                    return !!f.reply && f.status === "replied";
                }
                return true;
            });

            if (filtered.length === 0) {
                wallContainer.innerHTML = `
                    <div class="feedback-card" style="text-align: center; padding: 36px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">💬</div>
                        <h4 style="font-family: var(--font-heading); font-weight: 700; color: var(--text-primary);">Aún no hay comentarios en esta vista</h4>
                        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;">¡Sé el primero en compartir tu experiencia o sugerencia en el formulario!</p>
                    </div>
                `;
                return;
            }

            const categoryLabels = {
                "sugerencia": "💡 Sugerencia",
                "felicitacion": "⭐ Felicitación",
                "duda": "❓ Duda Médica",
                "material": "📚 Solicitud",
                "error": "🐛 Detalle Técnico"
            };

            wallContainer.innerHTML = "";
            filtered.forEach(fb => {
                const card = document.createElement("div");
                card.className = "feedback-card animate-fade";

                const starsHtml = "★".repeat(fb.rating || 5) + "☆".repeat(Math.max(0, 5 - (fb.rating || 5)));
                const catClass = `cat-${fb.category || 'sugerencia'}`;
                const catLabel = categoryLabels[fb.category] || "💡 Sugerencia";
                const initial = (fb.name ? fb.name.charAt(0) : "E").toUpperCase();
                
                let dateStr = "Reciente";
                if (fb.createdAt) {
                    try {
                        const d = fb.createdAt.toDate ? fb.createdAt.toDate() : new Date(fb.createdAt);
                        dateStr = d.toLocaleDateString('es-VE', { day: '2-digit', month: 'short', year: 'numeric' });
                    } catch(e) {}
                }

                let replyHtml = "";
                if (fb.reply) {
                    replyHtml = `
                        <div class="feedback-reply-box">
                            <div class="feedback-reply-header">
                                <span class="feedback-reply-title">
                                    <span>👑</span> ${fb.replyBy || 'Prof. Leonardo Morales (Docente / Superusuario)'}
                                </span>
                                <span style="font-size: 0.72rem; color: var(--text-muted);">Respuesta Oficial</span>
                            </div>
                            <div class="feedback-reply-text">
                                ${fb.reply}
                            </div>
                        </div>
                    `;
                }

                card.innerHTML = `
                    <div class="feedback-card-header">
                        <div class="feedback-author-group">
                            <div class="feedback-author-avatar">${initial}</div>
                            <div>
                                <div class="feedback-author-name">${fb.name || 'Estudiante'}</div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; gap: 8px; align-items: center; margin-top: 2px;">
                                    <span>🎓 ${fb.course || '2do Año'}</span>
                                    <span>&bull;</span>
                                    <span>📅 ${dateStr}</span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span class="feedback-category-badge ${catClass}">${catLabel}</span>
                            <div style="color: #fbbf24; font-size: 0.95rem; margin-top: 4px;" title="${fb.rating || 5} de 5 estrellas">${starsHtml}</div>
                        </div>
                    </div>

                    <div class="feedback-card-message">${fb.message}</div>

                    ${replyHtml}
                `;

                wallContainer.appendChild(card);
            });
        } catch(err) {
            console.error("renderFeedback error:", err);
        }
    }

    // ==========================================
    // ADMIN FEEDBACK MANAGEMENT & DIRECT REPLIES
    // ==========================================
    let activeReplyingFeedback = null;

    function initAdminFeedback() {
        const searchInput = document.getElementById("adminFeedbackSearch");
        const filterAll = document.getElementById("adminFbFilterAll");
        const filterPending = document.getElementById("adminFbFilterPending");
        const filterReplied = document.getElementById("adminFbFilterReplied");

        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                state.adminFeedbackSearch = e.target.value.toLowerCase().trim();
                renderAdminFeedbackTable();
            });
        }

        if (filterAll) {
            filterAll.addEventListener("click", () => {
                state.adminFeedbackFilter = "all";
                updateAdminFbFilterButtons(filterAll);
                renderAdminFeedbackTable();
            });
        }
        if (filterPending) {
            filterPending.addEventListener("click", () => {
                state.adminFeedbackFilter = "pending";
                updateAdminFbFilterButtons(filterPending);
                renderAdminFeedbackTable();
            });
        }
        if (filterReplied) {
            filterReplied.addEventListener("click", () => {
                state.adminFeedbackFilter = "replied";
                updateAdminFbFilterButtons(filterReplied);
                renderAdminFeedbackTable();
            });
        }

        function updateAdminFbFilterButtons(activeBtn) {
            [filterAll, filterPending, filterReplied].forEach(b => {
                if (b) b.classList.remove("active");
            });
            if (activeBtn) activeBtn.classList.add("active");
        }

        // Modal close
        const modal = document.getElementById("feedbackReplyModal");
        const closeBtn = document.getElementById("feedbackReplyCloseBtn");
        if (closeBtn && modal) {
            closeBtn.addEventListener("click", () => {
                modal.style.display = "none";
                activeReplyingFeedback = null;
            });
        }

        // Preset chips in modal
        const presetsContainer = document.getElementById("feedbackQuickPresets");
        const replyTextarea = document.getElementById("feedbackReplyText");
        if (presetsContainer && replyTextarea) {
            presetsContainer.querySelectorAll("button").forEach(btn => {
                btn.addEventListener("click", () => {
                    const preset = btn.getAttribute("data-preset");
                    replyTextarea.value = preset;
                    replyTextarea.focus();
                });
            });
        }

        // Publish reply button
        const publishBtn = document.getElementById("feedbackPublishReplyBtn");
        if (publishBtn) {
            publishBtn.addEventListener("click", async () => {
                if (!activeReplyingFeedback || !replyTextarea) return;
                const text = replyTextarea.value.trim();
                if (!text) {
                    alert("Por favor redacta un texto de respuesta.");
                    return;
                }

                publishBtn.disabled = true;
                publishBtn.textContent = "⏳ Publicando...";

                try {
                    await db_replyToFeedback(activeReplyingFeedback.id, text, "Prof. Leonardo Morales (Docente / Superusuario)");
                    if (modal) modal.style.display = "none";
                    renderAdminFeedbackTable();
                    renderFeedback();
                } catch(e) {
                    console.error("Publish reply error:", e);
                    alert("Error al publicar la respuesta.");
                } finally {
                    publishBtn.disabled = false;
                    publishBtn.textContent = "👑 Publicar Respuesta";
                    activeReplyingFeedback = null;
                }
            });
        }

        // WhatsApp Send from modal
        const sendWaBtn = document.getElementById("feedbackSendWaBtn");
        if (sendWaBtn) {
            sendWaBtn.addEventListener("click", () => {
                if (!activeReplyingFeedback || !replyTextarea) return;
                const replyText = replyTextarea.value.trim();
                const studentEmail = activeReplyingFeedback.email || "";
                const studentName = activeReplyingFeedback.name || "estudiante";
                
                // Look up student phone in db
                db_getAllUsers().then(users => {
                    const userObj = users.find(u => u.email.toLowerCase() === studentEmail.toLowerCase());
                    const phone = userObj && userObj.phone ? userObj.phone.replace(/[^0-9]/g, "") : "";
                    const msg = encodeURIComponent(`Hola ${studentName}, te responde el Prof. Leonardo Morales en respuesta a tu comentario en el Portal Morfo:\n\n💬 "${replyText || '¡Gracias por tu comentario!'}"`);
                    if (phone) {
                        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
                    } else {
                        const customPhone = prompt("Ingresa el número de WhatsApp del estudiante con código de país (ej: 584121234567):");
                        if (customPhone) {
                            window.open(`https://wa.me/${customPhone.replace(/[^0-9]/g, "")}?text=${msg}`, "_blank");
                        }
                    }
                });
            });
        }
    }

    async function renderAdminFeedbackTable() {
        const tbody = document.getElementById("adminFeedbackTableBody");
        if (!tbody || !state.currentUser || state.currentUser.role !== "superuser") return;

        try {
            const feedbacks = await db_getAllFeedback();
            
            // Count totals
            const total = feedbacks.length;
            const pending = feedbacks.filter(f => !f.reply || f.status !== "replied").length;
            const replied = feedbacks.filter(f => f.reply && f.status === "replied").length;

            const countAllEl = document.getElementById("adminFbCountAll");
            const countPendingEl = document.getElementById("adminFbCountPending");
            const countRepliedEl = document.getElementById("adminFbCountReplied");
            if (countAllEl) countAllEl.textContent = total;
            if (countPendingEl) countPendingEl.textContent = pending;
            if (countRepliedEl) countRepliedEl.textContent = replied;

            // Filter items
            let filtered = feedbacks.filter(f => {
                const query = state.adminFeedbackSearch || "";
                const matchesQuery = !query ||
                    (f.name || "").toLowerCase().includes(query) ||
                    (f.email || "").toLowerCase().includes(query) ||
                    (f.message || "").toLowerCase().includes(query) ||
                    (f.category || "").toLowerCase().includes(query);

                if (!matchesQuery) return false;

                if (state.adminFeedbackFilter === "pending") {
                    return !f.reply || f.status !== "replied";
                } else if (state.adminFeedbackFilter === "replied") {
                    return f.reply && f.status === "replied";
                }
                return true;
            });

            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-secondary);">No se encontraron comentarios de feedback.</td></tr>`;
                return;
            }

            const categoryLabels = {
                "sugerencia": "💡 Sugerencia",
                "felicitacion": "⭐ Felicitación",
                "duda": "❓ Duda Médica",
                "material": "📚 Solicitud",
                "error": "🐛 Detalle Técnico"
            };

            tbody.innerHTML = "";
            filtered.forEach(fb => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid var(--border-color)";
                tr.style.fontSize = "0.83rem";

                const isReplied = fb.reply && fb.status === "replied";
                const starsHtml = "★".repeat(fb.rating || 5) + "☆".repeat(Math.max(0, 5 - (fb.rating || 5)));
                const catLabel = categoryLabels[fb.category] || "💡 Sugerencia";
                const isPublic = fb.isPublic !== false;

                tr.innerHTML = `
                    <td style="padding: 10px 12px;">
                        <div style="font-weight: 700; color: var(--text-primary);">${fb.name || 'Anónimo'}</div>
                        <div style="font-size: 0.72rem; color: var(--text-secondary);">${fb.email || 'Sin correo'} &bull; ${fb.course || '2do Año'}</div>
                    </td>
                    <td style="padding: 10px 12px;">
                        <span class="mag-badge" style="font-size: 0.72rem;">${catLabel}</span>
                    </td>
                    <td style="padding: 10px 12px; text-align: center; color: #fbbf24; font-size: 0.9rem;">
                        ${starsHtml}
                    </td>
                    <td style="padding: 10px 12px; max-width: 260px; color: var(--text-primary); line-height: 1.4;">
                        <div style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                            ${fb.message}
                        </div>
                    </td>
                    <td style="padding: 10px 12px;">
                        ${isReplied ? `
                            <div style="display: flex; flex-direction: column; gap: 2px;">
                                <span class="vip-badge active" style="font-size: 0.68rem; align-self: flex-start;">👑 RESPONDIDO</span>
                                <span style="font-size: 0.72rem; color: var(--text-secondary); font-style: italic; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                    "${fb.reply}"
                                </span>
                            </div>
                        ` : `
                            <span class="vip-badge inactive" style="font-size: 0.68rem; color: #fbbf24; border-color: rgba(245, 158, 11, 0.3); background: rgba(245, 158, 11, 0.1);">
                                ⏳ PENDIENTE
                            </span>
                        `}
                    </td>
                    <td style="padding: 10px 12px; text-align: center;">
                        <div style="display: flex; gap: 6px; justify-content: center; align-items: center; flex-wrap: wrap;">
                            <button class="btn-reply-feedback btn-open-reply-modal" data-id="${fb.id}" title="Escribir respuesta oficial">
                                ${isReplied ? '✏️ Editar' : '💬 Responder'}
                            </button>
                            <button class="btn-rm-inspect btn-toggle-fb-public" data-id="${fb.id}" data-public="${isPublic ? 'true' : 'false'}" style="padding: 5px 8px; font-size: 0.75rem;" title="${isPublic ? 'Ocultar del muro público' : 'Hacer visible en muro público'}">
                                ${isPublic ? '👁️' : '🙈'}
                            </button>
                            <button class="btn-rm-inspect btn-delete-fb" data-id="${fb.id}" style="padding: 5px 8px; font-size: 0.75rem; color: #f87171;" title="Eliminar feedback">
                                🗑️
                            </button>
                        </div>
                    </td>
                `;

                tbody.appendChild(tr);
            });

            // Bind reply open
            tbody.querySelectorAll(".btn-open-reply-modal").forEach(btn => {
                btn.addEventListener("click", () => {
                    const fbId = btn.getAttribute("data-id");
                    const item = feedbacks.find(f => f.id === fbId);
                    if (!item) return;

                    activeReplyingFeedback = item;
                    const modal = document.getElementById("feedbackReplyModal");
                    const nameEl = document.getElementById("modalFbStudentName");
                    const catEl = document.getElementById("modalFbCategory");
                    const msgEl = document.getElementById("modalFbStudentMessage");
                    const replyText = document.getElementById("feedbackReplyText");

                    if (nameEl) nameEl.textContent = `${item.name || 'Estudiante'} (${item.email || ''})`;
                    if (catEl) catEl.textContent = categoryLabels[item.category] || "Sugerencia";
                    if (msgEl) msgEl.textContent = `"${item.message}"`;
                    if (replyText) replyText.value = item.reply || "";

                    if (modal) modal.style.display = "flex";
                });
            });

            // Bind toggle visibility
            tbody.querySelectorAll(".btn-toggle-fb-public").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const fbId = btn.getAttribute("data-id");
                    const currentPub = btn.getAttribute("data-public") === "true";
                    try {
                        await db_toggleFeedbackVisibility(fbId, !currentPub);
                        renderAdminFeedbackTable();
                        renderFeedback();
                    } catch(e) {
                        alert("Error al cambiar visibilidad");
                    }
                });
            });

            // Bind delete
            tbody.querySelectorAll(".btn-delete-fb").forEach(btn => {
                btn.addEventListener("click", async () => {
                    const fbId = btn.getAttribute("data-id");
                    if (confirm("¿Deseas eliminar este comentario de feedback?")) {
                        try {
                            await db_deleteFeedback(fbId);
                            renderAdminFeedbackTable();
                            renderFeedback();
                        } catch(e) {
                            alert("Error al eliminar comentario");
                        }
                    }
                });
            });
        } catch(err) {
            console.error("renderAdminFeedbackTable error:", err);
        }
    }
});
