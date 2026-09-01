// ==========================================================================
//  MORFO PORTAL - AI TUTOR KNOWLEDGE & REASONING ENGINE (ai_tutor_engine.js)
// ==========================================================================

/**
 * Normaliza y extrae palabras clave útiles de la consulta del estudiante
 */
function extractKeywords(query) {
    const stopWords = new Set([
        "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "a", "al", "en", "por", "para", "con", "sin",
        "sobre", "entre", "tras", "durante", "mediante", "que", "cual", "cuales", "como", "donde", "cuando", "quien",
        "es", "son", "fue", "eran", "ser", "estar", "tiene", "tienen", "haber", "hacer", "quiero", "necesito", "ayuda",
        "ayudame", "ayudame", "buscar", "informacion", "informacion", "pagina", "portal", "dime", "explicame", "sabes",
        "donde", "esta", "estan", "este", "esta", "estos", "estas", "sobre", "acerca", "favor", "porfa"
    ]);

    const words = query
        .toLowerCase()
        .replace(/[¿\?¡\!,\.;:\(\)\[\]"'\-_/]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopWords.has(w));

    return words;
}

/**
 * Busca coincidencias dinámicas en las Clases Orientadoras (PDFs)
 */
function findOrientadoras(keywords, course) {
    let aos = [];
    if (course === "morfo1" && typeof CLASES_ORIENTADORAS_M1 !== "undefined") aos = CLASES_ORIENTADORAS_M1;
    else if (course === "morfo2" && typeof CLASES_ORIENTADORAS_DATA !== "undefined") aos = CLASES_ORIENTADORAS_DATA;
    else if (course === "morfo3" && typeof CLASES_ORIENTADORAS_M3 !== "undefined") aos = CLASES_ORIENTADORAS_M3;
    else {
        if (typeof CLASES_ORIENTADORAS_M1 !== "undefined") aos.push(...CLASES_ORIENTADORAS_M1);
        if (typeof CLASES_ORIENTADORAS_DATA !== "undefined") aos.push(...CLASES_ORIENTADORAS_DATA);
        if (typeof CLASES_ORIENTADORAS_M3 !== "undefined") aos.push(...CLASES_ORIENTADORAS_M3);
    }

    const matches = [];
    aos.forEach(ao => {
        const text = `${ao.ao} ${ao.title} ${ao.subject || ''}`.toLowerCase();
        let score = 0;
        keywords.forEach(kw => {
            if (text.includes(kw)) score += 1;
        });
        if (score > 0) {
            matches.push({ item: ao, score });
        }
    });

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, 2).map(m => m.item);
}

/**
 * Busca preparados en Laminarios y Atlas
 */
function findLaminas(keywords, course) {
    const results = [];
    
    // Morfo 1
    if ((course === "morfo1" || !course) && typeof LAMINARIOS_M1_HIST !== "undefined") {
        LAMINARIOS_M1_HIST.forEach(l => {
            const str = `${l.title} ${l.organ} ${l.system} ${l.diagnosis} ${l.description}`.toLowerCase();
            let score = 0;
            keywords.forEach(kw => { if (str.includes(kw)) score++; });
            if (score > 0) results.push({ name: `Morfo 1: ${l.title} (${l.organ})`, score, file: l.file });
        });
    }

    // Morfo 2
    if ((course === "morfo2" || !course) && typeof LAMINARIOS_DATA_M2 !== "undefined") {
        LAMINARIOS_DATA_M2.forEach(l => {
            const str = `${l.title} ${l.organ} ${l.system} ${l.description || ''}`.toLowerCase();
            let score = 0;
            keywords.forEach(kw => { if (str.includes(kw)) score++; });
            if (score > 0) results.push({ name: `Morfo 2: ${l.title}`, score, file: l.file });
        });
    }

    // Morfo 3
    if ((course === "morfo3" || !course) && typeof LAMINARIOS_DATA_M3 !== "undefined") {
        LAMINARIOS_DATA_M3.forEach(l => {
            const str = `${l.title} ${l.organ} ${l.system} ${l.description || ''}`.toLowerCase();
            let score = 0;
            keywords.forEach(kw => { if (str.includes(kw)) score++; });
            if (score > 0) results.push({ name: `Morfo 3: ${l.title}`, score, file: l.file });
        });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 3);
}

/**
 * Busca libros en la Biblioteca Médica Digital
 */
function findLibros(keywords) {
    if (typeof BIBLIOGRAFIAS_DATA === "undefined" || !Array.isArray(BIBLIOGRAFIAS_DATA)) return [];
    
    const results = [];
    BIBLIOGRAFIAS_DATA.forEach(b => {
        const text = `${b.title} ${b.author} ${b.category} ${b.description}`.toLowerCase();
        let score = 0;
        keywords.forEach(kw => { if (text.includes(kw)) score += 2; });

        // Search chapters if Aller
        let matchingChapter = null;
        if (Array.isArray(b.chapters)) {
            b.chapters.forEach(ch => {
                const chText = ch.name.toLowerCase();
                keywords.forEach(kw => {
                    if (chText.includes(kw)) {
                        score += 3;
                        matchingChapter = ch.name;
                    }
                });
            });
        }

        if (score > 0) {
            results.push({ book: b, score, matchingChapter });
        }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 2);
}

/**
 * Base de Conocimiento Curada y Profunda de Morfofisiología I, II, III y Especialidades Clínicas
 */
const TOPIC_KNOWLEDGE_BASE = [
    // --- MORFO I ---
    {
        id: "macromoleculas",
        keywords: ["macromolecula", "macromoleculas", "proteina", "proteinas", "enzima", "enzimas", "biocatalizador", "aminoacido", "enlace peptidico", "estructura primaria", "estructura secundaria", "estructura terciaria", "estructura cuaternaria", "desnaturalizacion"],
        course: "morfo1",
        week: "Semana 2 y 3",
        topicTitle: "Macromoléculas de la Vida y Biocatalizadores (Proteínas y Enzimas)",
        explanation: `🧬 **Macromoléculas y Proteínas (Bases Moleculares)**:
- **Niveles de Organización**:
  1. *Estructura Primaria*: Secuencia lineal de aminoácidos unidos por enlaces peptídicos covalentes. Determina la estructura tridimensional y función.
  2. *Estructura Secundaria*: Plegamiento local (hélice alfa y lámina beta) estabilizado por puentes de hidrógeno.
  3. *Estructura Terciaria*: Conformación tridimensional global estabilizada por enlaces disulfuro, interacciones hidrofóbicas, puentes de hidrógeno y fuerzas electrostáticas.
  4. *Estructura Cuaternaria*: Asociación de dos o más cadenas polipeptídicas (ej. hemoglobina con 4 subunidades).
- **Enzimas (Biocatalizadores)**: Proteínas que aceleran las reacciones biológicas disminuyendo la energía de activación sin consumirse en el proceso. Poseen un *Sitio Activo* de alta especificidad por el sustrato.`,
        keyPedagogicalGuideline: "Para responder preguntas de 'Explicar la relación estructura-función', enfatiza cómo la pérdida de la conformación nativa (desnaturalización por pH o temperatura) destruye el sitio activo y anula la actividad biológica.",
        exactResourceRef: "Morfo I > Temario Semanal > Semana 2 (Orientación al Contenido) y Clase Orientadora AO 2 (Macromoléculas de la Vida)."
    },
    {
        id: "adn_genetica",
        keywords: ["adn", "arn", "genetica", "replicacion", "transcripcion", "traduccion", "codigo genetico", "nucleotido", "polimerasa", "mutacion", "ciclo celular", "mitosis", "meiosis", "dogma central"],
        course: "morfo1",
        week: "Semana 4 y 5",
        topicTitle: "Ácidos Nucleicos, Replicación y Expresión de la Información Genética",
        explanation: `🧬 **Flujo de la Información Genética (Dogma Central)**:
1. **Replicación del ADN**: Semiconservativa y bidireccional. La *Helicasa* desenrolla la doble hélice, la *ADN Polimerasa III* sintetiza la nueva cadena en dirección 5' a 3' y la *Ligasa* sella los fragmentos de Okazaki en la cadena rezagada.
2. **Transcripción**: La *ARN Polimerasa* sintetiza un ARNm complementario a partir de la hebra molde de ADN dentro del núcleo celular.
3. **Traducción**: En el citoplasma, los ribosomas leen los codones del ARNm; los ARNt traen los aminoácidos correspondientes para ensamblar la cadena polipeptídica.
4. **Ciclo Celular**: Interfase (G1, S donde se duplica el ADN, G2) y Fase M (Mitosis: profase, metafase, anafase, telofase).`,
        keyPedagogicalGuideline: "Al 'Describir la replicación', recuerda siempre mencionar el principio de complementariedad de bases nitrogenadas (A=T, G≡C) y el carácter semiconservativo descubierto por Meselson y Stahl.",
        exactResourceRef: "Morfo I > Temario Semanal > Semana 4 y 5 > Clase Orientadora AO 4 y AO 5."
    },
    {
        id: "celula_organelos",
        keywords: ["celula", "celular", "organelo", "organelos", "mitocondria", "golgi", "reticulo", "rer", "rel", "lisosoma", "peroxisoma", "membrana", "transporte", "citoesqueleto", "ribosoma"],
        course: "morfo1",
        week: "Semana 1 y 6",
        topicTitle: "Biología Celular: Organelos Membranosos y Membrana Plasmática",
        explanation: `🔬 **Organelos Celulares y sus Funciones Específicas**:
- **Membrana Plasmática**: Modelo de mosaico fluido (bicapa lipídica anfipática con proteínas integrales y periféricas). Permite transporte pasivo (difusión simple y facilitada) y activo (bomba Na+/K+ ATPasa).
- **Mitocondria**: Realiza el ciclo de Krebs en su matriz y la fosforilación oxidativa en las crestas para generar ATP.
- **RER**: Síntesis de proteínas de exportación y membrana.
- **REL**: Síntesis de lípidos, esteroides y detoxificación de fármacos.
- **Aparato de Golgi**: Glicosilación terminal, empaquetamiento y distribución vesicular.
- **Lisosomas**: Digestión celular mediante enzimas hidrolíticas ácidas.`,
        keyPedagogicalGuideline: "Para la habilidad 'Comparar RER y REL', contrasta la presencia/ausencia de ribosomas y su respectiva especialización funcional (proteínas vs. lípidos/detoxificación).",
        exactResourceRef: "Morfo I > Laminarios y Atlas (Láminas de Citología) y Temario Semana 1."
    },
    {
        id: "tejidos_fundamentales",
        keywords: ["tejido", "epitelio", "conectivo", "conjuntivo", "adiposo", "cartilago", "hueso", "muscular", "nervioso", "estratificado", "glandular", "fibroblasto"],
        course: "morfo1",
        week: "Semana 7 a 10",
        topicTitle: "Histología General: Tejidos Básicos Fundamentales",
        explanation: `📖 **Los 4 Tejidos Básicos del Cuerpo Humano**:
1. **Tejido Epitelial**: Avascular, células poligonales muy unidas, apoyadas sobre membrana basal.
   - *Revestimiento*: Simple (plano, cúbico, cilíndrico) o Estratificado (plano queratinizado o no queratinizado, urotelio/transición).
   - *Glandular*: Exocrino (glándulas salivales) y Endocrino (tiroides, suprarrenal).
2. **Tejido Conectivo**: Abundante matriz extracelular (fibras colágenas, elásticas, sustancia fundamental) y células (fibroblastos, macrófagos, adipocitos).
3. **Tejido Muscular**: Contracción mediante actina y miosina (esquelético estriado voluntario, cardíaco estriado involuntario con discos intercalares, y liso involuntario).
4. **Tejido Nervioso**: Neuronas y neuroglias.`,
        keyPedagogicalGuideline: "Al identificar al microscopio: en epitelios fíjate en la forma celular de la capa más superficial y en el número de estratos; en músculo cardíaco busca los discos intercalares.",
        exactResourceRef: "Morfo I > Laminarios y Atlas > Láminas Histológicas Figs 1 a 60."
    },
    {
        id: "sistema_locomotor",
        keywords: ["locomotor", "osteologia", "hueso", "articulacion", "articulaciones", "musculo", "esqueleto", "sinartrosis", "diartrosis", "craneo", "columna", "pelvis", "femur"],
        course: "morfo1",
        week: "Semana 11 a 15",
        topicTitle: "Sistema Locomotor: Osteología, Artrología y Miología",
        explanation: `🦴 **Organización del Sistema Locomotor**:
- **Osteología**: Huesos largos (diáfisis, epífisis, metáfisis), cortos, planos e irregulares. Hueso cortical compacto (osteonas/sistemas de Havers) y trabecular esponjoso.
- **Artrología (Clasificación Biomecánica)**:
  - *Sinartrosis*: Inmóviles (fibrosas como suturas craneales).
  - *Anfiartrosis*: Semimóviles (cartilaginosas como sínfisis púbica y discos intervertebrales).
  - *Diartrosis (Sinoviales)*: Móviles con cápsula, cavidad, líquido sinovial, cartílago hialino y ligamentos (esferoideas, gínglimos, trocoides, elipsoideas, sellares).
- **Miología**: Músculos agonistas, antagonistas y fijadores.`,
        keyPedagogicalGuideline: "Para clasificar una articulación, menciona siempre sus tres criterios: grado de movilidad, tejido de unión y forma de las superficies articulares.",
        exactResourceRef: "Morfo I > Temario Semanal > Semanas 11 a 15 > Clases Orientadoras AO 11 a AO 15."
    },

    // --- MORFO II ---
    {
        id: "sistema_nervioso_desarrollo",
        keywords: ["tubo neural", "cresta neural", "vesiculas encefalicas", "anencefalia", "espina bifida", "mielomeningocele", "prosencefalo", "mesencefalo", "rombencefalo", "telencefalo", "diencefalo"],
        course: "morfo2",
        week: "Semana 1 y 2",
        topicTitle: "Desarrollo del Sistema Nervioso y Defectos del Tubo Neural",
        explanation: `🧠 **Embriogénesis del Sistema Nervioso y Anomalías**:
- **Neurulación**: Inducción por la notocorda sobre el ectodermo para formar la placa neural, pliegues neurales y cierre del tubo neural (día 25 neuroporo anterior, día 27 neuroporo posterior).
- **Crestas Neurales**: Originan ganglios sensitivos y autonómicos, células de Schwann, médula suprarrenal y melanocitos.
- **Vesículas Encefálicas**:
  - *Primarias*: Prosencéfalo, Mesencéfalo, Rombencéfalo.
  - *Secundarias*: Telencéfalo (hemisferios), Diencéfalo (tálamo/hipotálamo), Mesencéfalo, Metencéfalo (puente/cerebelo), Mielencéfalo (bulbo).
- **Defectos del Cierre**: Anencefalia (fallo neuroporo anterior), Espina bífida oculta, meningocele y mielomeningocele (fallo neuroporo posterior). Prevenible con ácido fólico pregestacional.`,
        keyPedagogicalGuideline: "En preguntas de defectos congénitos, resalta la importancia de la prevención primaria comunitaria con suplementación de ácido fólico antes de la concepción.",
        exactResourceRef: "Morfo II > Temario Semanal > Semana 1 y 2 > Clase Orientadora AO 1 y AO 2 (PDF)."
    },
    {
        id: "vias_conduccion",
        keywords: ["via piramidal", "vias motoras", "haz corticoespinal", "extrapiramidal", "motoneurona", "babinski", "lemnisco medial", "espinotalamico", "cordon posterior", "sensitiva", "propiocepcion"],
        course: "morfo2",
        week: "Semana 4 y 5",
        topicTitle: "Vías de Conducción Nerviosa: Motoras (Descendentes) y Sensitivas (Ascendentes)",
        explanation: `🧠 **Sistemas de Vías de Conducción**:
- **Vía Piramidal (Haz Corticoespinal)**: Movimiento voluntario fino.
  - *Origen*: Células piramidales de Betz en corteza motora primaria (Área 4 de Brodmann).
  - *Trayecto*: Corona radiada, brazo posterior de cápsula interna, pedúnculos cerebrales, decusación piramidal en bulbo (85% cruza al cordón lateral, 15% anterior).
  - *Lesión*: Motoneurona superior (MNS) -> Parálisis espástica, hiperreflexia, clonus, signo de Babinski (+).
- **Vía Espinotalámica**: Dolor y temperatura (lateral) y tacto simple (anterior). Decusa a nivel medular.
- **Vía de Cordones Posteriores (Goll y Burdach / Lemnisco Medial)**: Propiocepción consciente, vibración y tacto epicrítico. Decusa en bulbo raquídeo.`,
        keyPedagogicalGuideline: "Diferencia siempre el nivel de decusación: el dolor/temperatura cruza a nivel medular casi de inmediato, mientras que la propiocepción consciente cruza arriba en el bulbo.",
        exactResourceRef: "Morfo II > Temario Semanal > Semanas 4 y 5 > Clase Orientadora AO 4 y AO 5."
    },
    {
        id: "pares_craneales_tronco",
        keywords: ["par craneal", "pares craneales", "tronco encefalico", "bulbo", "puente", "mesencefalo", "trigemino", "facial", "vago", "glosofaringeo", "oculomotor", "optico"],
        course: "morfo2",
        week: "Semana 6 a 8",
        topicTitle: "Tronco Encefálico y los 12 Pares Craneales",
        explanation: `🩺 **Los 12 Pares Craneales y su Localización en el Tronco**:
- I (Olfatorio) & II (Óptico): Prosencéfalo.
- III (Oculomotor) & IV (Troclear): Mesencéfalo.
- V (Trigémino): Puente (sensitivo de cara, motor de masticación).
- VI (Abducens), VII (Facial), VIII (Vestibulococlear): Surco bulbopontino.
- IX (Glosofaríngeo), X (Vago), XI (Accesorio): Surco retroolivar del bulbo.
- XII (Hipogloso): Surco preolivar del bulbo (motilidad lingual).`,
        keyPedagogicalGuideline: "Para cada par craneal debes dominar su origen real (núcleo en tronco), origen aparente (emergencia superficial) y foramen de salida en la base del cráneo.",
        exactResourceRef: "Morfo II > Temario Semanal > Semana 6 y 7 > Clase Orientadora AO 6 y AO 7."
    },
    {
        id: "endocrino_histologia",
        keywords: ["endocrino", "hipofisis", "tiroides", "paratiroides", "suprarrenal", "foliculo tiroideo", "coloide", "corteza suprarrenal", "glomerular", "fascicular", "reticular", "insulina", "pancreas"],
        course: "morfo2",
        week: "Semana 12 a 14",
        topicTitle: "Sistema Endocrino e Histofisiología Glandular",
        explanation: `🔬 **Glándulas Endocrinas y su Organización Microscópica**:
- **Adenohipófisis**: Células cromófilas (acidófilas: GH, Prolactina; basófilas: ACTH, TSH, FSH, LH) y cromófobas. Neurohipófisis: almacena oxitocina y ADH.
- **Tiroides**: Folículos tiroideos revestidos de epitelio simple y llenos de coloide (tiroglobulina). Células C parafoliculares secretan calcitonina.
- **Corteza Suprarrenal (3 Zonas)**:
  1. *Glomerular* (externa): Mineralocorticoides (Aldosterona).
  2. *Fascicular* (media, espongiocitos en cordones): Glucocorticoides (Cortisol).
  3. *Reticular* (interna): Andrógenos suprarrenales.
  - *Médula*: Células cromafines que secretan adrenalina y noradrenalina.`,
        keyPedagogicalGuideline: "En exámenes prácticos de láminas: el folículo tiroideo con coloide acidófilo es la estructura diagnóstica inequívoca más frecuente.",
        exactResourceRef: "Morfo II > Laminarios y Atlas > Figuras Endocrinas y AO 12 a AO 14."
    },

    // --- MORFO III ---
    {
        id: "glucolisis_krebs_respiracion",
        keywords: ["glucolisis", "krebs", "acido citrico", "cadena respiratoria", "fosforilacion oxidativa", "atp", "piruvato", "lactato", "acetil coa", "mitocondrial", "metabolismo glucidos"],
        course: "morfo3",
        week: "Semana 1 y 2",
        topicTitle: "Metabolismo de Glúcidos, Ciclo de Krebs y Fosforilación Oxidativa",
        explanation: `🍞 **Rutas Centrales del Metabolismo Energético**:
1. **Glucólisis (Citosol)**: 1 Glucosa -> 2 Piruvatos + 2 ATP netos + 2 NADH.
   - Enzimas marcapaso: *Hexoquinasa / Glucoquinasa*, *Fosfofructoquinasa-1 (PFK-1)* y *Piruvato quinasa*.
2. **Descarboxilación del Piruvato**: Complejo Piruvato Deshidrogenasa convierte piruvato en Acetil-CoA en la matriz mitocondrial.
3. **Ciclo de Krebs (Matriz Mitocondrial)**: Condensación de Acetil-CoA + Oxalacetato -> Citrato. Produce 3 NADH, 1 FADH2 y 1 GTP por vuelta.
4. **Cadena Respiratoria & Fosforilación Oxidativa (Membrana Interna)**: Los complejos I-IV bombean protones creando un gradiente electroquímico que activa la ATP sintasa. Rendimiento total: ~30-32 ATP por glucosa.`,
        keyPedagogicalGuideline: "Para explicar la regulación, nombra a la PFK-1 como la enzima clave marcapaso: es inhibida por ATP y citrato, y activada alostéricamente por AMP y Fructosa-2,6-bisfosfato.",
        exactResourceRef: "Morfo III > Temario Semanal > Semana 1 y 2 > Clase Orientadora AO 1 y AO 2."
    },
    {
        id: "lipidos_beta_oxidacion",
        keywords: ["lipidos", "grasas", "beta oxidacion", "acidos grasos", "lipoproteinas", "colesterol", "trigliceridos", "quilomicrones", "hdl", "ldl", "cuerpos cetonicos", "cetogenesis"],
        course: "morfo3",
        week: "Semana 3 y 4",
        topicTitle: "Metabolismo de Lípidos, Lipoproteínas y Beta-Oxidación",
        explanation: `🧈 **Metabolismo Lipídico**:
- **Beta-Oxidación (Mitocondria)**: Degradación oxidativa de ácidos grasos. Requiere lanzadera de carnitina (CPT-1). Cada ciclo libera 1 Acetil-CoA + 1 FADH2 + 1 NADH.
- **Cetogénesis (Hígado)**: En ayuno prolongado o diabetes no controlada, el exceso de Acetil-CoA se transforma en acetoacetato, beta-hidroxibutirato y acetona.
- **Lipoproteínas Plasmáticas**:
  - *Quilomicrones*: Transportan triglicéridos exógenos (dieta).
  - *VLDL*: Transportan triglicéridos endógenos desde el hígado.
  - *LDL*: Transporta colesterol a los tejidos periféricos (aterogénico).
  - *HDL*: Transporte reverso de colesterol desde los tejidos al hígado (protector).`,
        keyPedagogicalGuideline: "En correlación clínica: la cetoacidosis diabética se produce por la falta de insulina que activa masivamente la lipólisis y satura la capacidad del ciclo de Krebs.",
        exactResourceRef: "Morfo III > Temario Semanal > Semana 3 y 4 > Clase Orientadora AO 3 y AO 4."
    },
    {
        id: "sangre_inmunologia",
        keywords: ["sangre", "eritrocito", "hemoglobina", "leucocito", "neutrofilo", "linfocito", "plaqueta", "hemostasia", "coagulacion", "inmunidad", "anticuerpos", "antigeno", "ganglio", "bazo", "timo"],
        course: "morfo3",
        week: "Semana 8 a 10",
        topicTitle: "Fisiología Sanguínea, Hemostasia e Inmunología",
        explanation: `🛡️ **Sangre e Inmunidad**:
- **Eritrocitos y Hemoglobina**: Transporte de O2 unido al grupo hemo (Fe2+). Vida media: 120 días.
- **Leucocitos (Fórmula Leucocitaria Normal)**:
  - *Granulocitos*: Neutrófilos (55-65%, bacterias), Eosinófilos (1-4%, parásitos/alergias), Basófilos (0-1%, histamina).
  - *Agranulocitos*: Linfocitos (20-35%, inmunidad viral/adaptativa), Monocitos (4-8%, macrófagos).
- **Hemostasia**: Primaria (espasmo vascular + agregación plaquetaria) y Secundaria (cascada de coagulación intrínseca/extrínseca que produce fibrina).
- **Órganos Linfoides**:
  - *Primarios*: Médula ósea (linfocitos B) y Timo (linfocitos T).
  - *Secundarios*: Bazo (pulpa blanca y roja) y Ganglios linfáticos (corteza, paracorteza y médula).`,
        keyPedagogicalGuideline: "Al describir un frotis de sangre periférica, identifica neutrófilos por su núcleo polilobulado (3 a 5 lóbulos) y plaquetas como pequeños fragmentos anucleados.",
        exactResourceRef: "Morfo III > Laminarios y Atlas > Láminas de Sangre y Órganos Linfáticos (AO 8 a AO 10)."
    },
    {
        id: "reproductor_embarazo",
        keywords: ["reproductor", "utero", "ovario", "trompa", "testiculo", "espermatogenesis", "ovogenesis", "ciclo menstrual", "femenino", "masculino", "fecundacion", "placenta", "parto"],
        course: "morfo3",
        week: "Semana 13 a 16",
        topicTitle: "Aparato Reproductor Masculino y Femenino, Fecundación y Embarazo",
        explanation: `👶 **Morfofisiología Reproductiva**:
- **Aparato Femenino**: Ovarios (folículos primordiales a maduros de De Graaf), Trompas uterinas (fecundación en la ampolla), Útero (miometrio y endometrio con capas basal y funcional).
- **Aparato Masculino**: Testículos (túbulos seminíferos con células de Sertoli y células intersticiales de Leydig productoras de testosterona). Vías espermáticas: epidídimo, conducto deferente, uretra.
- **Ciclo Menstrual**: Fase proliferativa (estrógenos) -> Ovulación (pico LH día 14) -> Fase secretora (progesterona).`,
        keyPedagogicalGuideline: "En evaluaciones sobre ciclo ovárico vs. endometrial, recuerda que el estrógeno ovárico comanda la proliferación endometrial y la progesterona la secreción de glucógeno.",
        exactResourceRef: "Morfo III > Temario Semanal > Semanas 13 a 16 y Biblioteca Médica (Obstetricia Moderna - Juan Aller y SEGO)."
    },

    // --- TRATADOS MÉDICOS Y BIBLIOTECA DIGITAL ---
    {
        id: "neuroanatomia_afifi_fustinoni",
        keywords: ["neuroanatomia", "neurologia", "afifi", "fustinoni", "netter neurologia", "reflejo", "pares craneales examen", "sensibilidad", "motilidad", "babinski", "ataxia", "via piramidal", "haz corticoespinal", "cerebelo"],
        course: "morfo2",
        week: "Semana 5 a 10 / Clínica",
        topicTitle: "Neuroanatomía Funcional y Semiología del Sistema Nervioso",
        explanation: `🧠 **Bases Neuroanatómicas y Examen Neurológico (Afifi, Netter & Fustinoni)**:
- **Vías Motoras y Sensitivas**:
  - *Vía Piramidal (Corticoespinal)*: Motilidad voluntaria. Decusa en el 85-90% a nivel de las pirámides bulbares. Signo de lesión de 1ª motoneurona: espasticidad, hiperreflexia y signo de Babinski (+).
  - *Vía Espinotalámica*: Termoalgesia (dolor y temperatura).
  - *Cordones Posteriores (Goll y Burdach)*: Sensibilidad propioceptiva consciente, vibratoria (palestesia) y tacto epicrítico.
- **Semiología Neurológica de Fustinoni**:
  - Examen de los 12 pares craneales.
  - Tono muscular (espasticidad en navaja vs rigidez en rueda dentada).
  - Coordinación y taxia (pruebas índice-nariz, talón-rodilla, signo de Romberg).`,
        keyPedagogicalGuideline: "Para correlación clínica en guardias y revistas: consulta 'Neuroanatomía Funcional' de Afifi y 'Semiología del Sistema Nervioso' de Fustinoni en la Biblioteca Médica Digital.",
        exactResourceRef: "Biblioteca Médica Digital > Neuroanatomía (Afifi) & Semiología y Neurología (Fustinoni & Netter)."
    },
    {
        id: "anatomia_saladin_netter",
        keywords: ["netter", "saladin", "atlas", "anatomia", "forma y funcion", "morfofisiologia saladin", "osteologia", "miologia", "artrologia", "visceras", "torax", "abdomen"],
        course: "morfo1",
        week: "General Morfo I, II y III",
        topicTitle: "Anatomía Humana e Integración Fisiológica (Netter & Saladin)",
        explanation: `🫀 **Atlas de Netter & Tratado de Saladin**:
- **Atlas de Anatomía Humana de Frank H. Netter**: Láminas ilustradas de referencia mundial con relaciones topográficas precisas de cabeza, cuello, dorso, tórax, abdomen, pelvis y miembros.
- **Saladin (Anatomía y Fisiología)**: Enfoque unificador entre estructura anatómica macro/microscópica y función fisiológica celular y de sistemas orgánicos.`,
        keyPedagogicalGuideline: "Utiliza el Atlas de Netter para ubicación topográfica espacial y el Saladin para comprender la relación causa-efecto entre morfología y fisiología.",
        exactResourceRef: "Biblioteca Médica Digital > Atlas de Anatomía Humana (Netter) & Anatomía y Fisiología (Saladin)."
    }
];

/**
 * Generador Maestro de Respuestas del Asistente Académico de IA
 */
export function getAiTutorResponse(userQuery, activeCourse) {
    if (!userQuery || userQuery.trim().length === 0) {
        return "Por favor ingresa una pregunta o tema médico que desees consultar.";
    }

    const q = userQuery.toLowerCase().trim();
    const keywords = extractKeywords(q);

    // 1. Check direct matches in TOPIC_KNOWLEDGE_BASE
    let bestTopic = null;
    let maxMatches = 0;

    TOPIC_KNOWLEDGE_BASE.forEach(topic => {
        let score = 0;
        topic.keywords.forEach(kw => {
            if (q.includes(kw)) score += 3;
            else {
                keywords.forEach(userKw => {
                    if (kw.includes(userKw) || userKw.includes(kw)) score += 1;
                });
            }
        });

        // Boost score if course matches
        if (activeCourse && topic.course === activeCourse) {
            score += 2;
        }

        if (score > maxMatches) {
            maxMatches = score;
            bestTopic = topic;
        }
    });

    // 2. Search dynamic assets in Portal (AOs, Laminas, Libros)
    const matchingAos = findOrientadoras(keywords, activeCourse);
    const matchingLaminas = findLaminas(keywords, activeCourse);
    const matchingLibros = findLibros(keywords);

    // 3. Build synthesis response
    let response = "";

    if (bestTopic && maxMatches >= 3) {
        response += `### ${bestTopic.topicTitle}\n\n`;
        response += `${bestTopic.explanation}\n\n`;
        response += `---\n\n`;
        response += `#### 📍 ¿Dónde encontrarlo en el Portal Morfo?\n`;
        response += `- 🎓 **Materia y Ubicación**: ${bestTopic.exactResourceRef}\n`;

        if (matchingAos.length > 0) {
            response += `- 📑 **Clase Orientadora Oficial (PDF)**: [${matchingAos[0].ao}: ${matchingAos[0].title}](${matchingAos[0].pdfFile})${matchingAos[0].slidesFile ? ` | [📊 Diapositiva Explicativa](${matchingAos[0].slidesFile})` : ''}\n`;
        }

        if (matchingLaminas.length > 0) {
            response += `- 🔬 **Laminario / Atlas Virtual**: Revisa ${matchingLaminas.map(l => `**${l.name}**`).join(", ")}.\n`;
        }

        if (matchingLibros.length > 0) {
            const b = matchingLibros[0].book;
            response += `- 📚 **Biblioteca Médica Digital**: **${b.title}** (${b.category}) ${matchingLibros[0].matchingChapter ? `- Capítulo: *${matchingLibros[0].matchingChapter}*` : ''}.\n`;
        }

        response += `\n💡 **Clave Pedagógica para Evaluaciones**:\n> ${bestTopic.keyPedagogicalGuideline}\n`;
    } else {
        // Dynamic search based on extracted files and books
        response += `### 🩺 Orientación de Contenidos: "${userQuery}"\n\n`;
        response += `He rastreado la base de datos de Morfofisiología I, II y III, laminarios y biblioteca médica para tu consulta:\n\n`;

        let foundSomething = false;

        if (matchingAos.length > 0) {
            foundSomething = true;
            response += `#### 📑 Clases Orientadoras Directas (PDF):\n`;
            matchingAos.forEach(ao => {
                response += `- **${ao.ao}**: [${ao.title}](${ao.pdfFile})${ao.slidesFile ? ` &bull; [📊 Diapositiva Explicativa](${ao.slidesFile})` : ''}\n`;
            });
            response += `\n`;
        }

        if (matchingLaminas.length > 0) {
            foundSomething = true;
            response += `#### 🔬 Preparados Microscópicos en Laminarios y Atlas:\n`;
            matchingLaminas.forEach(l => {
                response += `- **${l.name}** (Disponible en la sección *Laminarios y Atlas*)\n`;
            });
            response += `\n`;
        }

        if (matchingLibros.length > 0) {
            foundSomething = true;
            response += `#### 📚 Textos de Consulta en Biblioteca Médica:\n`;
            matchingLibros.forEach(m => {
                response += `- **${m.book.title}** - *${m.book.author}* (${m.book.category}) ${m.matchingChapter ? `| *Capítulo: ${m.matchingChapter}*` : ''}\n`;
            });
            response += `\n`;
        }

        if (!foundSomething) {
            response += `💡 Puedes explorar los contenidos de este tema navegando a:\n`;
            response += `1. **Temario Semanal**: Selecciona la semana correspondiente al sistema que estás estudiando para leer la guía docente reformateada.\n`;
            response += `2. **Clases Orientadoras**: Descarga las diapositivas oficiales en PDF de los docentes del programa.\n`;
            response += `3. **Biblioteca Médica**: Consulta los tratados de referencia (*Harrison, Surós, Michans, CTO o Juan Aller*).\n\n`;
        }

        response += `💡 **Recomendación Metodológica del Docente Leonardo Morales**:\n`;
        response += `> Recuerda fundamentar tus respuestas vinculando siempre la **estructura morfológica** con su **mecanismo funcional fisiopatológico** y su aplicación en la práctica médica comunitaria.`;
    }

    return response;
}

if (typeof window !== "undefined") {
    window.getAiTutorResponse = getAiTutorResponse;
}
