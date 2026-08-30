/**
 * Morfofisiología Humana II - Base de Datos de Clases Orientadoras y Laminarios Médicos
 * Contiene metadatos de las 14 Actividades Orientadoras, 44 Láminas Histológicas,
 * 61 Casos de Malformaciones Congénitas y Presentaciones PPT de Estudio.
 */

var CLASES_ORIENTADORAS_DATA = [
  {
    id: 1,
    ao: "AO 01",
    week: 1,
    title: "Generalidades del Sistema Nervioso y Sistema Nervioso Periférico",
    theme: "Tema 1: Generalidades y SNP",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+01.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+01DIA.pdf",
    description: "Concepto evolutivo del sistema nervioso, propiedades funcionales (excitabilidad y conductibilidad), origen embriológico y diferenciación del tubo neural. Organización del tejido nervioso: neuronas, neuroglias, sustancia gris y sustancia blanca. Concepto de arco reflejo y bases bioquímicas.",
    topics: ["Filogenia y ontogenia del SNC", "Tejido nervioso y neuroglias", "Sustancia gris y sustancia blanca", "Arco reflejo"]
  },
  {
    id: 2,
    ao: "AO 02",
    week: 1,
    title: "Sistema Nervioso Periférico: Receptores, Nervios Espinales y Plexos Somáticos",
    theme: "Tema 1: Generalidades y SNP",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+2.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+2DIA.pdf",
    description: "Receptores sensoriales periféricos, transducción, potencial generador y adaptación. Fibras mielínicas y amielínicas, vainas de Schwann y nodos de Ranvier. Constitución de los nervios espinales, ramos anteriores y formación de los plexos cervical, braquial, lumbar y sacrococcígeo.",
    topics: ["Transducción y receptores", "Fibras nerviosas y mielinización", "Nervios espinales y ganglios", "Plexos somáticos y lesiones"]
  },
  {
    id: 3,
    ao: "AO 03",
    week: 2,
    title: "Médula Espinal: Configuración Externa, Interna y Actividad Refleja",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+03.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+03DIA.pdf",
    description: "Límites, topografía y engrosamientos de la médula espinal. Sustancia gris (astas anteriores, posteriores y laterales; laminación de Rexed) y sustancia blanca (cordones o funículos anterior, lateral y posterior). Segmento medular, reflejo miotático y arco reflejo espinal.",
    topics: ["Configuración externa y raíces", "Sustancia gris medular", "Funículos y tractos medulares", "Reflejos espinales"]
  },
  {
    id: 4,
    ao: "AO 04",
    week: 3,
    title: "Tronco Encefálico: Médula Oblongada, Puente y Mesencéfalo",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+04.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+04DIA.pdf",
    description: "Morfología externa e interna del bulbo raquídeo, puente de Varolio y mesencéfalo. Cuarto ventrículo (fosa romboidea). Núcleos de los nervios craneales (pares III al XII), núcleos propios (olivares, rojos, sustancia negra) y centros reflejos vitales de la vida vegetativa.",
    topics: ["Médula oblongada y puente", "Mesencéfalo y colículos", "Fosa romboidea y IV ventrículo", "Núcleos de los pares craneales"]
  },
  {
    id: 5,
    ao: "AO 05",
    week: 4,
    title: "Cerebelo y Formación Reticular",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+05.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+05DIA.pdf",
    description: "Evolución filogenética del cerebelo (Arquicerebelo, Paleocerebelo, Neocerebelo). Morfología, corteza cerebelosa (capas molecular, de Purkinje y granular), núcleos profundos y pedúnculos cerebelosos. Funciones de equilibrio, tono muscular y coordinación motora. Sistema activador reticular ascendente (SARA).",
    topics: ["Capas de la corteza cerebelosa", "Núcleos centrales del cerebelo", "Coordinación motora y eferencias", "Formación reticular y vigilia"]
  },
  {
    id: 6,
    ao: "AO 06",
    week: 5,
    title: "Diencéfalo: Tálamo, Hipotálamo, Epitálamo y Tercer Ventrículo",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+06.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+06DIA.pdf",
    description: "Estructura y relaciones del diencéfalo y tercer ventrículo. Tálamo óptico como estación de relevo sensitivo-sensorial. Hipotálamo: núcleos hipotalámicos, funciones de integración autonómica, termorregulación, homeostasis e ingesta. Epitálamo y glándula pineal. Sistema Límbico y conducta.",
    topics: ["Núcleos talámicos y relevo", "Centros hipotalámicos homeostáticos", "Glándula pineal y melatonina", "Circuito de Papez y Sistema Límbico"]
  },
  {
    id: 7,
    ao: "AO 07",
    week: 6,
    title: "Telencéfalo: Corteza Cerebral, Áreas Funcionales y Ganglios Basales",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+07.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+07DIA.pdf",
    description: "Hemisferios cerebrales, cisuras, surcos y giros. Estructura histológica de la corteza cerebral (isocorteza en 6 capas). Mapa citoarquitectónico de Brodmann (áreas motoras, sensoriales y de asociación). Ganglios de la base (cuerpo estriado: núcleo caudado, putamen y globo pálido) y circuito extrapiramidal.",
    topics: ["Surcos y lóbulos cerebrales", "Capas histológicas corticales", "Áreas funcionales de Brodmann", "Núcleos basales y vía extrapiramidal"]
  },
  {
    id: 8,
    ao: "AO 08",
    week: 7,
    title: "Sistema Nervioso Autónomo (Vegetativo): Simpático y Parasimpático",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+08.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+08DIA.pdf",
    description: "Organización central y periférica del sistema nervioso autónomo. División simpática (toracolumbar) y parasimpática (craneosacra). Neurona preganglionar y posganglionar. Neurotransmisores (acetilcolina y noradrenalina), receptores adrenérgicos y colinérgicos. Respuestas fisiológicas de lucha o reposo.",
    topics: ["División simpática toracolumbar", "División parasimpática craneosacra", "Neurotransmisores y receptores", "Acciones viscerales y homeostasis"]
  },
  {
    id: 9,
    ao: "AO 09",
    week: 8,
    title: "Vías de Conducción Nerviosa Aferentes (Sensitivas y Sensoriales)",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+09.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+09DIA.pdf",
    description: "Cadenas neuronales de la aferencia. Vías de la sensibilidad somática general: termoalgésica (haz espinotalámico lateral), tacto simple (haz espinotalámico anterior) y propiocepción consciente/tacto discriminativo (fascículos grácil y cuneiforme). Vías espinocerebelosas inconscientes.",
    topics: ["Vía termoalgésica espinotalámica", "Sistema columna dorsal - lemnisco medial", "Vías espinocerebelosas", "Relevo talámico y corteza somestésica"]
  },
  {
    id: 10,
    ao: "AO 10",
    week: 9,
    title: "Vías de Conducción Nerviosa Eferentes (Motoras) y Control del Movimiento",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+10.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+10DIA.pdf",
    description: "Vía piramidal: tractos corticoespinal (anterior y lateral) y corticonuclear (geniculado). Motoneurona superior e inferior. Síndrome de motoneurona superior vs inferior. Vías extrapiramidales (rubroespinal, vestibuloespinal, reticuloespinal y tectoespinal) y control postural y motor fino.",
    topics: ["Tracto corticoespinal piramidal", "Tracto corticonuclear", "Síndromes motores piramidales", "Vías extrapiramidales de apoyo"]
  },
  {
    id: 11,
    ao: "AO 11",
    week: 10,
    title: "Órganos de los Sentidos: Analizador Visual (Ojo, Retina y Vía Óptica)",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+11.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+11DIA.pdf",
    description: "Globo ocular: túnicas fibrosa, vascular y nerviosa. Medios refringentes (córnea, humor acuoso, cristalino, cuerpo vítreo). Histología de la retina (10 capas, fotorreceptores: conos y bastones). Fotoquímica de la visión. Vía óptica (nervio, quiasma, tracto, cuerpo geniculado lateral y corteza visual primaria 17).",
    topics: ["Túnicas y medios transparentes del ojo", "Histología de la retina", "Fisiología de fotorreceptores", "Vía óptica y corteza occipital"]
  },
  {
    id: 12,
    ao: "AO 12",
    week: 11,
    title: "Órganos de los Sentidos: Analizador Auditivo y Vestibular",
    theme: "Tema 2: Sistema Nervioso Central",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+12.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+12DIA.pdf",
    description: "Oído externo, medio e interno. Estructura del laberinto óseo y membranoso. Órgano de Corti y cóclea (audición). Aparato vestibular: máculas utricular y sacular (gravedad y aceleración lineal) y crestas ampollares (aceleración angular). Vía auditiva y vía vestibular hacia núcleos vestibulares y cerebelo.",
    topics: ["Anatomía del oído medio e interno", "Histología del Órgano de Corti", "Máculas, otolitos y crestas ampollares", "Vías coclear y vestibular"]
  },
  {
    id: 13,
    ao: "AO 13",
    week: 12,
    title: "Sistema Endocrino: Eje Hipotálamo-Hipofisario y Glándulas Periféricas",
    theme: "Tema 3: Sistema Endocrino",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+13.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+13DIA.pdf",
    description: "Morfofisiología de las glándulas de secreción interna. Eje hipotálamo-hipofisario: adenohipófisis y neurohipófisis. Hormonas tróficas y liberadoras. Histología y función de tiroides, paratiroides, corteza y médula suprarrenal, y porción endocrina del páncreas (islotes de Langerhans).",
    topics: ["Eje hipotálamo - adenohipófisis", "Neurohipófisis y oxitocina / ADH", "Tiroides, paratiroides y suprarrenales", "Mecanismos de retroalimentación (feedback)"]
  },
  {
    id: 14,
    ao: "AO 14",
    week: 12,
    title: "Integración Neuroendocrina y Control Homeostático Global",
    theme: "Tema 3: Sistema Endocrino",
    pdfFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+14.pdf",
    slidesFile: "Morfo 2/Clases orientadoras/MFH+II+-+AO+14DIA.pdf",
    description: "Interacción de los sistemas nervioso y endocrino en la regulación del medio interno. Mecanismos de retroalimentación positiva y negativa. Respuesta neuroendocrina ante el estrés (eje simpático-adrenomedular y eje corticosuprarrenal). Adaptación metabólica y homeostasis integral.",
    topics: ["Integración neuro-hormonal", "Mecanismos de retroalimentación", "Fisiopatología del estrés y adaptación", "Resumen de Morfofisiología Humana II"]
  }
];

var LAMINARIO_HISTOLOGICO_DATA = [
  {
    id: 1,
    num: 1,
    title: "Fotomicrografía de Corteza Cerebral (Cresil Violeta 40x)",
    stain: "Cresil Violeta",
    magnification: "40x",
    category: "Cerebro / Corteza",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 1 Fotomicrografía cerebro cresil violeta 40x.jpg",
    description: "Corte histológico de corteza cerebral teñido con cresil violeta (tinción de Nissl). Se observan somas neuronales con grumos basófilos prominentes correspondientes al retículo endoplasmático rugoso y núcleos pálidos con nucléolo evidente."
  },
  {
    id: 2,
    num: 2,
    title: "Fotomicrografía de Médula Espinal (Cresil Violeta / H&E 40x)",
    stain: "Cresil Violeta",
    magnification: "40x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 2 Fotomicrografía cerebro cresil violeta 40x.jpg",
    description: "Detalle panorámico a 40x de tejido nervioso central mostrando la densidad de neuroglias y cuerpos neuronales multipolares con sustancia cromófila."
  },
  {
    id: 3,
    num: 3,
    title: "Fotomicrografía de Médula Espinal (Técnica Argéntica 200x)",
    stain: "Impregnación Argéntica",
    magnification: "200x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 3 Fotomicrografía  médula espinal argéntica 200x.jpg",
    description: "Asta anterior de médula espinal con impregnación de plata. Se aprecian grandes motoneuronas multipolares con su red dendrítica y axones proyectándose hacia las raíces motoras."
  },
  {
    id: 4,
    num: 4,
    title: "Fotomicrografía de Médula Espinal (Técnica Argéntica 400x)",
    stain: "Impregnación Argéntica",
    magnification: "400x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 4 Fotomicrografía  médula espinal argéntica 400x (1).jpg",
    description: "Alta resolución de motoneurona alfa medular. Se distinguen las neurofibrillas intracitoplasmáticas, el cono axónico desprovisto de gránulos y prolongaciones ramificadas."
  },
  {
    id: 5,
    num: 5,
    title: "Fotomicrografía de Corteza Cerebelosa (H&E 400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Cerebelo",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 5 Fotomicrografía cerebelo hematoxilina eosina 400x.jpg",
    description: "Transición entre la capa molecular y la capa granular del cerebelo. Se aprecian los pericariones piriformes de las células de Purkinje alineados en una monocapa característica."
  },
  {
    id: 6,
    num: 6,
    title: "Esquema Estructural de Fibra Nerviosa",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 6 Esquema Fibra nerviosa.JPG",
    description: "Ilustración esquemática del cilindroeje (axón), axolema, vaina de mielina formada por capas concéntricas de membrana plasmática de la célula de Schwann y neurolema."
  },
  {
    id: 7,
    num: 7,
    title: "Esquema de Fibra Nerviosa y Nodos de Ranvier",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 7 esquema fibra nerviosa.JPG",
    description: "Representación didáctica de los segmentos internodales y las interrupciones periódicas de la vaina mielínica (nodos de Ranvier) que permiten la conducción saltatoria del potencial de acción."
  },
  {
    id: 8,
    num: 8,
    title: "Diagrama Morfofuncional de Fibra Mielínica",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 8 Fibra nerviosa mielínica.JPG",
    description: "Estructura tridimensional de una fibra nerviosa periférica mielinizada mostrando la envoltura de endoneuro circundante y la disposición de los núcleos de las células de Schwann."
  },
  {
    id: 9,
    num: 9,
    title: "Fotomicrografía de Nervio Periférico Longitudinal (200x)",
    stain: "Hematoxilina y Eosina",
    magnification: "200x",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 9 fotomicrografía nervio perif long 200x.jpg",
    description: "Corte longitudinal de fascículo nervioso periférico. Las fibras nerviosas presentan un curso ondulado característico con núcleos alargados de células de Schwann y fibroblastos endoneurales."
  },
  {
    id: 10,
    num: 10,
    title: "Fotomicrografía de Nervio Periférico Longitudinal (400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 10 Fotomicrografía nervio perif long 400x.jpg",
    description: "Mayor aumento del corte longitudinal de nervio periférico evidenciando los espacios claros dejados por los lípidos mielínicos disueltos durante la preparación técnica."
  },
  {
    id: 11,
    num: 11,
    title: "Fotomicrografía de Nervio Periférico Longitudinal (800x)",
    stain: "Hematoxilina y Eosina",
    magnification: "800x",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 11 Fotomicrografía nervio perif long 800x.jpg",
    description: "Detalle ultraestructural al microscopio óptico a 800x de un nodo de Ranvier y la relación axón-célula de Schwann en una fibra mielínica madura."
  },
  {
    id: 12,
    num: 12,
    title: "Fotomicrografía de Ganglio Craneoespinal (Argéntica 40x)",
    stain: "Impregnación Argéntica",
    magnification: "40x",
    category: "Ganglio Nervioso",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 12 Fotomicrografía ganglio nervioso craneorspinal argentica 40x.jpg",
    description: "Vista panorámica de ganglio de la raíz dorsal (sensitivo). Se observan los acúmulos esféricos de neuronas pseudounipolares agrupadas en la periferia del ganglio y los tractos centrales de fibras."
  },
  {
    id: 13,
    num: 13,
    title: "Fotomicrografía de Ganglio Craneoespinal (Argéntica 400x)",
    stain: "Impregnación Argéntica",
    magnification: "400x",
    category: "Ganglio Nervioso",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 13 Fotomicrografía ganglio craneoespinal argentica 400x.jpg",
    description: "Detalle a 400x de neuronas ganglionares pseudounipolares teñidas con sales de plata. Se evidencia la emergencia en 'T' del axón único y la corona de células satélites que las rodea."
  },
  {
    id: 14,
    num: 14,
    title: "Fotomicrografía de Ganglio Nervioso (Argéntica 400x)",
    stain: "Impregnación Argéntica",
    magnification: "400x",
    category: "Ganglio Nervioso",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 14 Fotomicrografía ganglio nervioso argentica 400x.jpg",
    description: "Corte de ganglio con tinción argéntica contrastando las fibras nerviosas que ingresan y egresan del ganglio sensorial frente al estroma conectivo."
  },
  {
    id: 15,
    num: 15,
    title: "Fotomicrografía de Ganglio Nervioso (H&E 200x)",
    stain: "Hematoxilina y Eosina",
    magnification: "200x",
    category: "Ganglio Nervioso",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 15 Fotomicrografía  ganglio nervioso Hematoxilina eosina 200x.jpg",
    description: "Ganglio sensitivo con tinción universal H&E. Se identifican grandes cuerpos neuronales esféricos con núcleos centrales vesiculosos y cápsula de células gliocíticas satélites (anficitos)."
  },
  {
    id: 16,
    num: 16,
    title: "Fotomicrografía de Ganglio Nervioso (H&E 400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Ganglio Nervioso",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 16 Fotomicrografía  ganglio nervioso Hematoxilina eosina 400x.jpg",
    description: "Detalle a 400x de neurona pseudounipolar rodeada completamente por la capa de células capsulares satélites y tejido conjuntivo endoganglionar vascularizado."
  },
  {
    id: 17,
    num: 17,
    title: "Esquema de Receptores de Sensibilidad General (Corpúsculos)",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Receptores Sensoriales",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 17 esquema receptor sensibilidad general.JPG",
    description: "Morfología comparativa de mecanorreceptores encapsulados: Corpúsculo de Meissner (tacto fino), Corpúsculo de Pacini (presión y vibración) y terminaciones libres intraepidérmicas."
  },
  {
    id: 18,
    num: 18,
    title: "Esquema de Receptores de Ruffini, Krause y Huso Neuromuscular",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Receptores Sensoriales",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 18 Esquema receptor sensibilidad general.JPG",
    description: "Esquemas didácticos de corpúsculos de Ruffini (calor y estiramiento tisular), bulbos terminales de Krause (frío) y husos neuromusculares propioceptivos."
  },
  {
    id: 19,
    num: 19,
    title: "Fotomicrografía de Nervio Periférico Transversal (100x)",
    stain: "Hematoxilina y Eosina",
    magnification: "100x",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 19 Fotomicrografía nervio perif transv 100x.jpg",
    description: "Corte transversal panorámico de tronco nervioso mostrando los tres compartimentos de tejido conectivo: Epineuro (externo), Perineuro (delimitando fascículos) y Endoneuro (entre axones)."
  },
  {
    id: 20,
    num: 20,
    title: "Fotomicrografía de Nervio Periférico Transversal (400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Nervio Periférico",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 20 Fotomicrografía nervio perif transv 400x.jpg",
    description: "Detalle a 400x de fibras nerviosas en corte transversal. El punto acidófilo central corresponde al axón rodeado por el halo claro circular que ocupaba la vaina de mielina."
  },
  {
    id: 21,
    num: 21,
    title: "Esquema de Configuración Interna de la Médula Espinal",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 21 esquema médula espinal.JPG",
    description: "Diagrama en 'H' de la médula espinal distinguiendo astas anteriores (motoras somáticas), astas posteriores (sensitivas), comisura gris, conducto del epéndimo y cordones de sustancia blanca."
  },
  {
    id: 22,
    num: 22,
    title: "Fotomicrografía de Médula Espinal (Argéntica 400x)",
    stain: "Impregnación Argéntica",
    magnification: "400x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 22 Médula espinal argéntica 400x.jpg",
    description: "Campo de sustancia gris medular mostrando el denso neuropilo formado por prolongaciones neuronales y gliales impregnadas selectivamente con sales de plata."
  },
  {
    id: 23,
    num: 23,
    title: "Fotomicrografía de Médula Espinal (Argéntica 800x)",
    stain: "Impregnación Argéntica",
    magnification: "800x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 23 médula espinal argéntica 800x.jpg",
    description: "Gran aumento (800x) enfocado en sinapsis por contacto y terminales boutons sobre el soma y dendritas de neuronas radiculares medulares."
  },
  {
    id: 24,
    num: 24,
    title: "Fotomicrografía de Sustancia Blanca Medular (Argéntica 800x)",
    stain: "Impregnación Argéntica",
    magnification: "800x",
    category: "Médula Espinal",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 24 médula espinal argéntica sust blanca 800x.jpg",
    description: "Corte de cordón blanco medular. Se identifican axones mielinizados que viajan longitudinalmente en los tractos ascendentes y descendentes medulares."
  },
  {
    id: 25,
    num: 25,
    title: "Fotomicrografía de Célula de Purkinje (Impregnación Argéntica)",
    stain: "Impregnación Argéntica",
    magnification: "400x",
    category: "Cerebelo",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 25 Fotomicrografía célula Purkinje plata.jpg",
    description: "Neurona de Purkinje cerebelosa teñida con método argéntico de Golgi. Destaca el espectacular y frondoso árbol dendrítico ramificado en un único plano hacia la capa molecular."
  },
  {
    id: 26,
    num: 26,
    title: "Fotomicrografía de Corteza Cerebelosa (H&E 500x)",
    stain: "Hematoxilina y Eosina",
    magnification: "500x",
    category: "Cerebelo",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 26 fotomicrografía cerebelo hematoxilina eosina 500x.jpg",
    description: "Estratigrafía cerebelosa con H&E: capa molecular externa eosinófila con escasas células en cesta, capa intermedia de Purkinje y capa de granos intensamente basófila por miles de diminutos somas."
  },
  {
    id: 27,
    num: 27,
    title: "Esquema Citoarquitectónico de la Corteza Cerebral",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Cerebro / Corteza",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 27 Esquema Corteza cerebral.JPG",
    description: "Diagrama de las seis capas de la isocorteza cerebral: I. Molecular, II. Granular externa, III. Piramidal externa, IV. Granular interna, V. Piramidal interna (células gigantes de Betz) y VI. Multiforme."
  },
  {
    id: 28,
    num: 28,
    title: "Esquema de las Meninges Craneoespinales",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Meninges",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 28 Esquema meninges.JPG",
    description: "Disposición anatómica de las meninges: Duramadre (paquimeninge fibrosa), Aracnoides con sus trabéculas y espacio subaracnoideo con LCE, y Piamadre íntimamente adherida a la superficie neural."
  },
  {
    id: 29,
    num: 29,
    title: "Esquema de Senos Venosos y Vellosidades Aracnoideas",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Meninges",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 29 esquema meninges.JPG",
    description: "Ilustración de la reabsorción del líquido cerebroespinal a través de las granulaciones aracnoideas (vellosidades de Pacchioni) hacia el seno sagital superior."
  },
  {
    id: 30,
    num: 30,
    title: "Esquema del Botón y Receptor Gustativo",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Sentidos Especiales (Gusto)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 30 Esquema Receptor Gustativo.JPG",
    description: "Estructura del corpúsculo gustativo intrapapilar mostrando el poro gustativo apical, células sensoriales gustativas con microvellosidades, células de sostén y células basales regenerativas."
  },
  {
    id: 31,
    num: 31,
    title: "Fotomicrografía de Corpúsculo Gustativo (H&E 400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Sentidos Especiales (Gusto)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 31 Foromicrografía  corpúsculo gustativos hematoxilina eosina 400x.jpg",
    description: "Corte de papila lingual circunvalada mostrando los botones gustativos ovoides pálidos inmersos en el epitelio plano estratificado no queratinizado de las paredes del surco papilar."
  },
  {
    id: 32,
    num: 32,
    title: "Esquema de la Mucosa y Receptor Olfatorio",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Sentidos Especiales (Olfato)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 32 esquema Receptor Olfatorio.JPG",
    description: "Epitelio olfatorio neurosensorial con neuronas olfatorias bipolares, cilios olfatorios apicales con receptores odoríferos acoplados a proteína G, células sustentaculares y glándulas de Bowman."
  },
  {
    id: 33,
    num: 33,
    title: "Esquema General del Globo Ocular",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 33 Esquema Globo Ocular.JPG",
    description: "Corte sagital del ojo humano señalando córnea, esclera, coroides, cuerpo ciliar, iris, cristalino, cámara anterior, cámara posterior, retina, disco óptico y fóvea central."
  },
  {
    id: 34,
    num: 34,
    title: "Esquema de las 10 Capas de la Retina",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 34 Esquema capas de la Retina.JPG",
    description: "Estratigrafía retiniana de externa a interna: 1. Epitelio pigmentario, 2. Conos y bastones, 3. Limitante externa, 4. Nuclear externa, 5. Plexiforme externa, 6. Nuclear interna, 7. Plexiforme interna, 8. Células ganglionares, 9. Fibras del nervio óptico, 10. Limitante interna."
  },
  {
    id: 35,
    num: 35,
    title: "Fotomicrografía de Capas de la Retina (H&E 100x)",
    stain: "Hematoxilina y Eosina",
    magnification: "100x",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 35 Fotomicrografía capas de la  Retina hematoxilina eosina 100x.jpg",
    description: "Corte histológico panorámico de pared ocular mostrando la capa de epitelio pigmentario con gránulos de melanina y la alternancia de capas nucleares y plexiformes de la retina neural."
  },
  {
    id: 36,
    num: 36,
    title: "Fotomicrografía de Capas de la Retina (H&E 250x)",
    stain: "Hematoxilina y Eosina",
    magnification: "250x",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 36 Capas Retina hematoxilina eosina 250x.jpg",
    description: "Mayor aumento donde se identifican claramente los núcleos de conos y bastones (nuclear externa), los núcleos de células bipolares, horizontales y amacrinas (nuclear interna) y las neuronas ganglionares."
  },
  {
    id: 37,
    num: 37,
    title: "Esquema Fotorreceptor: Fotorreceptores Bastones",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 37 Esquema Bastones.JPG",
    description: "Estructura del bastón retiniano: segmento externo con discos membranosos apilados ricos en rodopsina para la visión escotópica (en penumbra), pedículo conectivo y cuerpo celular."
  },
  {
    id: 38,
    num: 38,
    title: "Esquema Fotorreceptor: Fotorreceptores Conos",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de la Visión (Ojo)",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 38 Esquema Conos.JPG",
    description: "Estructura del cono retiniano: segmento externo cónico con fotopsinas (yodopsinas) para la visión fotópica diurna y la discriminación de colores (rojo, verde y azul en la fóvea)."
  },
  {
    id: 39,
    num: 39,
    title: "Esquema Anatómico del Oído Interno (Laberinto)",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 39 esquema del oido interno.JPG",
    description: "Laberinto óseo y laberinto membranoso: caracol o cóclea con sus tres rampas, vestíbulo (utrículo y sáculo) y los tres canales semicirculares dispuestos en los tres planos del espacio."
  },
  {
    id: 40,
    num: 40,
    title: "Esquema de Máculas Vestibulares y Crestas Ampollares",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 40 Esquema Máculas y Crestas.JPG",
    description: "Receptores del equilibrio: mácula del utrículo y sáculo con su membrana otolítica (otoconias) y cresta ampollar con su cúpula gelatinosa sensible al flujo endolinfático."
  },
  {
    id: 41,
    num: 41,
    title: "Esquema de Células Sensoriales Ciliadas Vestibulares",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 41 esquema Células sensoriales receptor vestibular.JPG",
    description: "Morfología de las células ciliadas tipo I (en cáliz) y tipo II (cilíndricas), mostrando el quinetocilio y los estereocilios graduados cuya deflexión modula la despolarización celular."
  },
  {
    id: 42,
    num: 42,
    title: "Esquema Histológico del Órgano Espiral de Corti",
    stain: "Esquema Anatómico",
    magnification: "Esquema",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 42 Esquema del örgano de Corti.JPG",
    description: "Detalle del Órgano de Corti asentado sobre la membrana basilar: células ciliadas internas y externas, membrana tectoria, pilares de Corti (túnel de Corti) y células de sostén (Deiters y Hensen)."
  },
  {
    id: 43,
    num: 43,
    title: "Fotomicrografía de Órgano de Corti (H&E 400x)",
    stain: "Hematoxilina y Eosina",
    magnification: "400x",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 43Fotomicrografía Órgano de Corti hematoxilina eosina 400x.jpg",
    description: "Corte de la rampa media o conducto coclear mostrando el órgano espiral de Corti, la membrana basilar vibrátil y la estria vascular productora de endolinfa rica en potasio."
  },
  {
    id: 44,
    num: 44,
    title: "Fotomicrografía de Órgano de Corti (H&E 200x)",
    stain: "Hematoxilina y Eosina",
    magnification: "200x",
    category: "Órgano de Audición y Equilibrio",
    src: "Morfo 2/LAMINARIOS/LAMINARIOS HISTOLOGICO/Figura 44 Fotomicrografía Órgano de Corti hematoxilina eosina 200x.jpg",
    description: "Sección helicoidal del caracol a 200x exhibiendo la rampa vestibular, la rampa timpánica, el ganglio espiral de Corti en el modiolo y la rampa coclear intermedia."
  }
];

var LAMINARIO_MALFORMACIONES_DATA = [
  {
    id: 1,
    title: "Anencefalia (Meroanencefalia)",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/anencefalia.JPG",
    description: "Falla catastrófica en el cierre del neuroporo anterior/craneal alrededor del día 24-26 de gestación. Ausencia de bóveda craneal (acrania) y degeneración del tejido telencefálico expuesto al líquido amniótico (área cerebrovasculosa)."
  },
  {
    id: 2,
    title: "Niño con Anencefalia",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Niño con anencefalia.jpg",
    description: "Presentación clínica neonatal de anencefalia: ausencia de calota craneana, protrusión ocular ('ojos saltones o de sapo') por cavidades orbitarias poco profundas e implantación baja de orejas."
  },
  {
    id: 3,
    title: "Holoacrania o Acrania Completa",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Holoacrania o acrania.(ausencia completa de craneo).jpg",
    description: "Defecto severo caracterizado por la ausencia completa de los huesos de la bóveda craneal debido a falla en la migración mesenquimatosa periencefálica asociada a defectos del neuroectodermo."
  },
  {
    id: 4,
    title: "Acrania Congénita",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/ACRANI~2.JPG",
    description: "Espécimen patológico que evidencia la falta total de desarrollo del hueso frontal, parietales y porción escamosa del occipital, con exposición directa de la masa encefálica amorfa."
  },
  {
    id: 5,
    title: "Encefalocele Frontal",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/encefalocele frontal.JPG",
    description: "Herniación del tejido encefálico y meninges a través de un defecto óseo del cráneo en la región frontal anterior (craneosinostosis/disrafismo craneal anterior)."
  },
  {
    id: 6,
    title: "Meningocele Occipital",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/meningocele occipital.JPG",
    description: "Protrusión de las meninges rellenas de líquido cerebroespinal a través de un defecto óseo occipital, sin inclusión de tejido encefálico en el interior de la bolsa herniaria."
  },
  {
    id: 7,
    title: "Paciente con Meningocele",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Paciente con meningocele.jpg",
    description: "Caso clínico de paciente pediátrico con masa fluctuante meníngea recubierta por piel íntegra en la línea media lumbosacra / dorsal posterior."
  },
  {
    id: 8,
    title: "Mielomeningocele e Hidrocefalia Secundaria",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/mielomeningocele y 2ria hidrocefalia.JPG",
    description: "Forma grave de espina bífida quística abierta por fallo en el cierre del neuroporo posterior. La médula espinal y raíces nerviosas se encuentran atrapadas en la pared del saco, coexistiendo con malformación de Chiari II e hidrocefalia."
  },
  {
    id: 9,
    title: "Hendidura Facial Unilateral Grave (Labio y Paladar Hendido)",
    system: "Cabeza, Cuello y Cara",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Hendidura facial unilateral grave.jpg",
    description: "Falta de fusión entre el proceso maxilar prominente y el proceso nasal medial en la 6ta a 7ma semana de desarrollo embrionario, con extensión hacia el suelo de la fosa nasal y paladar primario."
  },
  {
    id: 10,
    title: "Tetralogía de Fallot",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/tetralogia de fallot.JPG",
    description: "Cardiopatía congénita cianógena clásica provocada por división desigual del tronco arterioso y cono por desplazamiento anterosuperior del tabique conotruncal. Se compone de: 1. Estenosis infundibular pulmonar, 2. Comunicación interventricular (CIV), 3. Cabalgamiento aórtico sobre el defecto, y 4. Hipertrofia ventricular derecha compensatoria."
  },
  {
    id: 11,
    title: "Coartación de la Aorta",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/coartacion de la aorta.JPG",
    description: "Estrechamiento significativo de la luz de la aorta torácica, usualmente situado distal al origen de la arteria subclavia izquierda cerca de la inserción del ligamento arterioso (tipo yuxtaductal)."
  },
  {
    id: 12,
    title: "Conducto Arterioso Persistente (CAP)",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/conducto arterioso persistente.JPG",
    description: "Fallo en el cierre fisiológico postnatal del sexto arco aórtico izquierdo (ductus arteriosus) que normalmente conecta la arteria pulmonar izquierda con el arco aórtico, produciendo un shunt izquierda-derecha continuo."
  },
  {
    id: 13,
    title: "Defectos Septales Atriales (CIA)",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/defectos septales atriales.JPG",
    description: "Comunicación interauricular por reabsorción excesiva del septum primum o hipoplasia del septum secundum dejando un agujero oval permeable persistente de gran tamaño."
  },
  {
    id: 14,
    title: "Defectos Septales Arteriales y Troncales",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/defectos septales arteriales.jpg",
    description: "Persistencia del tronco arterioso común por ausencia total de tabicación aortopulmonar por falta de migración de células de las crestas neurales cardíacas."
  },
  {
    id: 15,
    title: "Defecto Septal Interventricular Membranoso (CIV)",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/defecto septal interventricular membranoso.JPG",
    description: "Cardiopatía acianógena más común. Falta de desarrollo de la porción membranosa del tabique interventricular derivada del tejido de las almohadillas endocárdicas fusionadas."
  },
  {
    id: 16,
    title: "Anomalías del Arco Aórtico",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/anomalias del arco aortico.JPG",
    description: "Variantes patológicas y anomalías posicionales derivadas de la persistencia o regresión atípica de los 6 pares de arcos aórticos faríngeos embrionarios."
  },
  {
    id: 17,
    title: "Cayado Aórtico Doble",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/cayado aortico doble.JPG",
    description: "Persistencia anómala de la porción distal de la aorta dorsal derecha formando un anillo vascular completo que comprime la tráquea y el esófago provocando estridor y disfagia."
  },
  {
    id: 18,
    title: "Arco Aórtico Derecho / Interrumpido",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Arco Aortico.jpg",
    description: "Esquema morfológico de variantes vasculares mayores del arco aórtico y nacimiento anómalo de los troncos supraaórticos."
  },
  {
    id: 19,
    title: "Atresia Tricuspídea y Defectos Septales Compensatorios",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/atresia tricusp mas defectos septales atriales e interventriculares compensatorios.JPG",
    description: "Obliteración completa del orificio auriculoventricular derecho con hipoplasia ventricular derecha, requiriendo obligatoriamente CIA y CIV para la viabilidad circulatoria."
  },
  {
    id: 20,
    title: "Estenosis Pulmonar Derecha / Valvular",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/estenosis pulmonar derecha.JPG",
    description: "Fusión o engrosamiento de las valvas semilunares de la arteria pulmonar reduciendo el flujo sanguíneo hacia el lecho vascular pulmonar."
  },
  {
    id: 21,
    title: "Anomalías de Vena Cava (Persistencia Vena Cava Izquierda 1)",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/vena cava1.jpg",
    description: "Fallo en la regresión de la vena cardinal anterior izquierda que desemboca anómalamente en el seno coronario dilatado de la aurícula derecha."
  },
  {
    id: 22,
    title: "Anomalías de Vena Cava (Duplicación Vena Cava Inferior 2)",
    system: "Sistema Cardiovascular",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/vena cava2.jpg",
    description: "Falta de anastomosis entre las venas subcardinales y supracardinales embrionarias dando origen a doble vena cava inferior por debajo del nivel renal."
  },
  {
    id: 23,
    title: "Riñón en Herradura (Fusión Renal)",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/rinon en herradura.JPG",
    description: "Fusión de los polos inferiores de ambos riñones metanéfricos durante su ascenso en la pelvis falsa. El istmo parenquimatoso queda atrapado bajo el origen de la arteria mesentérica inferior."
  },
  {
    id: 24,
    title: "Riñón Pélvico (Ectopia Renal)",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/rinon pelvico.JPG",
    description: "Fallo en el ascenso del riñón definitivo desde su sitio embrionario en la pelvis verdadera hacia la fosa lumbar retroperitoneal."
  },
  {
    id: 25,
    title: "Riñón Poliquístico Congénito (Enfermedad Poliquística)",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/rinon poliquistico.JPG",
    description: "Alteración genética que provoca la dilatación quística progresiva de los túbulos colectores y nefronas debido a fallas en la interacción recíproca entre la yema ureteral y el blastema metanéfrico."
  },
  {
    id: 26,
    title: "Duplicación Completa del Uréter",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/duplicacion completa del ureter.JPG",
    description: "Nacimiento precoz de dos yemas ureterales independientes a partir del conducto mesonéfrico (de Wolff), originando dos uréteres completos que drenan independientemente en la vejiga o sitio ectópico."
  },
  {
    id: 27,
    title: "Duplicación Parcial del Uréter",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/duplicacion parcial del ureter.JPG",
    description: "Bifurcación temprana de una única yema ureteral antes de penetrar en el blastema metanéfrico, dando un uréter bífido en 'Y' con un solo orificio vesical común."
  },
  {
    id: 28,
    title: "Duplicación Ureteral Clínica Completa",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Duplicación Completa del Uretre.jpg",
    description: "Estudio anatómico y radiográfico mostrando la duplicidad pieloureteral completa según la regla de Weigert-Meyer."
  },
  {
    id: 29,
    title: "Duplicación Ureteral Parcial Radiológica",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Duplicación Parcial del Uretre.jpg",
    description: "Urograma excretor demostrando la unión proximal de los conductos pieloureterales en un trayecto vesical común."
  },
  {
    id: 30,
    title: "Hipospadias Congénito",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/hipospadias.JPG",
    description: "Fusión incompleta de los pliegues uretrales en la superficie ventral del pene debido a una insuficiente estimulación androgénica fetal, dejando el meato uretral ectópico ventral."
  },
  {
    id: 31,
    title: "Hipospadias Clínico Grado I - II",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Hipospadias1.jpg",
    description: "Aspecto clínico del glande y cuerpo esponjoso con desembocadura del meato en la cara ventral coronal o subcoronal."
  },
  {
    id: 32,
    title: "Micropene Congénito",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Micropene 1.jpg",
    description: "Longitud fálica significativamente menor a 2.5 desviaciones estándar para la edad gestacional por insuficiencia androgénica o hipopituitarismo primario."
  },
  {
    id: 33,
    title: "Hidrocele Congénito Infantil",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Hidocele.jpg",
    description: "Acumulación de líquido peritoneal en la cavidad de la túnica vaginal del testículo por falta de obliteración del conducto peritoneovaginal (processus vaginalis)."
  },
  {
    id: 34,
    title: "Útero Bicorne",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/utero bicorne.JPG",
    description: "Fusión incompleta de los extremos craneales de los conductos paramesonéfricos (de Müller), resultando en un útero con dos cuernos que desembocan en un solo cérvix."
  },
  {
    id: 35,
    title: "Útero y Vagina Dobles (Didelfo)",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/utero y vagina dobles.JPG",
    description: "Fallo total en la fusión de los conductos de Müller a lo largo de toda su extensión, produciendo dos cuerpos uterinos independientes, dos cérvix y tabique vaginal longitudinal completo."
  },
  {
    id: 36,
    title: "Atresia del Cérvix",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/atresia del cervix.JPG",
    description: "Falta de canalización del cordón uterovaginal distal en la porción cervical provocando obstrucción anatómica del tracto de salida uterino."
  },
  {
    id: 37,
    title: "Atresia Vaginal Congénita",
    system: "Sistema Urogenital",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Atresia Vaginal.jpg",
    description: "Fallo en la vacuolización y recanalización de la placa vaginal formada a partir de los bulbos sinovaginales del seno urogenital."
  },
  {
    id: 38,
    title: "Onfalocele Congénito",
    system: "Aparato Digestivo y Pared Abdominal",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/onfalocele.JPG",
    description: "Persistencia de la herniación fisiológica de las asas intestinales en el cordón umbilical más allá de la semana 10. Las vísceras quedan cubiertas por una membrana traslúcida de amnios y peritoneo."
  },
  {
    id: 39,
    title: "Hernia Diafragmática Congénita (Bochdalek)",
    system: "Aparato Digestivo y Pared Abdominal",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/hernia diafragmatica.JPG",
    description: "Fallo en el cierre de la membrana pleuroperitoneal posterolateral (generalmente izquierda) que permite el paso de vísceras abdominales al tórax provocando hipoplasia pulmonar grave."
  },
  {
    id: 40,
    title: "Sitios Anatómicos Frecuentes de Hernias Diafragmáticas",
    system: "Aparato Digestivo y Pared Abdominal",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/sitios mas comunes de las hernias diafragmaticas.JPG",
    description: "Esquema que ilustra el trígono lumbocostal (foramen de Bochdalek posterolateral), el trígono esternocostal (foramen de Morgagni retroesternal) y el hiato esofágico."
  },
  {
    id: 41,
    title: "Páncreas Anular",
    system: "Aparato Digestivo y Pared Abdominal",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/pancreas anular.JPG",
    description: "La yema pancreática ventral bífida migra en direcciones opuestas alrededor de la segunda porción del duodeno, formando un anillo glandular constrictor que causa estenosis/duodenal."
  },
  {
    id: 42,
    title: "Posiciones Anormales y Ectopias de Glándulas Parotídeas",
    system: "Cabeza, Cuello y Cara",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/posiciones anormales de las gland.parotideas.JPG",
    description: "Alteraciones en el brote y ramificación epitelial de la cavidad bucal primitiva que forman conductos accesorios o lóbulos ectópicos glandulares."
  },
  {
    id: 43,
    title: "Niña con Amelia Unilateral y Focomelia",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Niña con amelia unilateral.Paciente con un tipo de meromelia denominado focomelia.jpg",
    description: "Defectos por reducción de extremidades: Amelia (ausencia completa de un miembro) y Focomelia (ausencia de segmentos largos proximales con manos o pies insertados directamente al tronco)."
  },
  {
    id: 44,
    title: "Polidactilia y Sindactilia en Extremidades",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Polidactilia, dedos extra.Sindactilia, dedos fusionados.Hendidura del pie.jpg",
    description: "Polidactilia (presencia de dedos supernumerarios por inducción anómala de la zona de actividad polarizante ZPA) y Sindactilia (fusión de dedos por falla en la apoptosis interdigital mediada por BMP-4)."
  },
  {
    id: 45,
    title: "Polidactilia Preaxial / Postaxial",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/polidactilia.JPG",
    description: "Duplicación digital aislada en mano o pie con presencia de falanges bien formadas o rudimentos dérmicos digitiformes."
  },
  {
    id: 46,
    title: "Sindactilia Cutánea / Ósea",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/sindactilia.JPG",
    description: "Falta de separación de los rayos digitales durante la 7ma y 8va semana embrionaria con persistencia de membranas interdigitales."
  },
  {
    id: 47,
    title: "Bandas Amnióticas y Amputaciones Congénitas",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Amputaciones de dedos como consecuencia de la fonnación de bandas amnióticas.jpg",
    description: "Secuencia de bridas amnióticas: roturas precoces del amnios que generan hebras fibrosas que estrangulan, constriñen y amputan dedos o segmentos enteros de extremidades fetales in útero."
  },
  {
    id: 48,
    title: "Sirenomelia (Síndrome de Regresión Caudal)",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/sirenomelia.JPG",
    description: "Grave anomalía del mesodermo caudal antes del día 28 que provoca fusión de ambas extremidades inferiores en una sola estructura ('cola de sirena'), agenesia renal bilateral y ano imperforado."
  },
  {
    id: 49,
    title: "Acondroplasia Infantil y Juvenil",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Niño de 3 meses con acondroplasia.Acondroplasia en una niña de 15 años.jpg",
    description: "Forma más común de enanismo desproporcionado por mutación autosómica dominante con ganancia de función en el receptor FGFR3, alterando la osificación endocondral de huesos largos con macrocefalia."
  },
  {
    id: 50,
    title: "Pie Zambo Congénito (Pie Equinovaro)",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/pie zambo.JPG",
    description: "Deformidad musculoesquelética caracterizada por inversión, aducción del antepié y flexión plantar (equino) por oligohidramnios o restricciones mecánicas posicionales uterinas."
  },
  {
    id: 51,
    title: "Pie Hendido (Mano / Pie en Pinza de Langosta)",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/pie hendido.JPG",
    description: "Ectrodactilia: ausencia de los rayos digitales centrales (2do, 3ro o 4to rayo) con una hendidura profunda en 'V' en la parte media de la mano o pie."
  },
  {
    id: 52,
    title: "Costilla Cervical en Horquilla y Hemivértebra",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Costilla cervical en orquilla.Hemivertebra.jpg",
    description: "Anomalía segmentaria vertebral debida a la formación de solo la mitad del cuerpo vertebral por fallo en un centro de condrificación, asociándose a costilla supernumeraria en C7."
  },
  {
    id: 53,
    title: "Escoliosis Congénita por Hemivértebras",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/escoliosis congenita.jpg",
    description: "Desviación lateral y rotacional severa de la columna vertebral producida por defectos primarios en la segmentación o formación de los somitas embrionarios."
  },
  {
    id: 54,
    title: "Deformidad Cifoescoliótica",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Deformidad cifoescoliotica.jpg",
    description: "Curvatura anómala combinada del plano anteroposterior (cifosis) y lateral de la columna con compromiso restrictivo de la caja torácica."
  },
  {
    id: 55,
    title: "Espondilolistesis Congénita",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/Espondilolistesis.jpg",
    description: "Desplazamiento anterior patológico de un cuerpo vertebral sobre el subyacente (usualmente L5 sobre S1) por defecto o displasia de la pars interarticularis."
  },
  {
    id: 56,
    title: "Fallo en la Fusión de Componentes del Esternón",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/fallo en la fusion de lo componentes del esternon.JPG",
    description: "Hendidura esternal / fisura por falta de unión en la línea media de las dos barras esternales mesenquimatosas bilaterales en la semana 7."
  },
  {
    id: 57,
    title: "Teratoma Sacrococcígeo",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/teratoma sacrococcigeo.JPG",
    description: "Tumor congénito originado por restos pluripotenciales de la línea primitiva que no degeneraron en la región caudal, conteniendo derivados de las 3 hojas germinativas (ectodermo, mesodermo y endodermo)."
  },
  {
    id: 58,
    title: "Defectos Craneales en Radiografía Pediátrica",
    system: "Sistema Nervioso Central (Tubo Neural)",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/RADIO~29.JPG",
    description: "Estudio radiológico que documenta fontanelas ampliamente abiertas, disostosis craneocleidocraneal y huesos suturales wormianos."
  },
  {
    id: 59,
    title: "Malformación Craneofacial Congénita",
    system: "Cabeza, Cuello y Cara",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/NIÑOC~1C.JPG",
    description: "Presentación clínica con dismorfismo craneofacial complejo, retrognatismo e hipotelorismo ocular."
  },
  {
    id: 60,
    title: "Caso Clínico de Dismorfología Neonatal",
    system: "Aparato Locomotor y Extremidades",
    src: "Morfo 2/LAMINARIOS/Laminario (Malformaciones II)/9980.jpg",
    description: "Fotografía clínica de archivo de evaluación pediátrica neonatal en sala de cuidados perinatales ante anomalías congénitas múltiples."
  }
];

var LAMINARIOS_PPT_DATA = [
  {
    id: 1,
    title: "Laminario Completo de Morfofisiología Humana II",
    file: "Morfo 2/LAMINARIOS/laminariodmorfoii-130613104602-phpapp02.pptx",
    format: "PPTX (Presentación de Diapositivas)",
    size: "39.4 MB",
    description: "Compendio integral en diapositivas con microfotografías, esquemas y cortes histológicos y anatómicos del sistema nervioso, analizadores sensoriales y sistema endocrino para Morfo II."
  },
  {
    id: 2,
    title: "Laminario Básico Ilustrado de Morfofisiología",
    file: "Morfo 2/LAMINARIOS/Laminario-Basico.ppt",
    format: "PPT (Presentación)",
    size: "4.8 MB",
    description: "Guía visual resumida con los principales preparados de microscopía y esquemas representativos de los tejidos fundamentales y órganos neuroendocrinos."
  },
  {
    id: 3,
    title: "Laminario Anatómico de Morfología",
    file: "Morfo 2/LAMINARIOS/LAMINARIO ANATOMICO/laminario de morfo 1.ppt",
    format: "PPT (Presentación)",
    size: "9.7 MB",
    description: "Atlas esquemático de anatomía regional y segmentaria complementario para el estudio de las vías de conducción, órganos efectores y relaciones topográficas."
  }
];
