export const placeholderSagas = {
  en: [
    {
      theme: "e.g., High Fantasy, the lands of Middle-earth",
      task: "e.g., Go grocery shopping",
      role: "e.g., A Ranger of the North on a vital patrol",
      rule: "e.g., Take a 10-minute break",
    },
    {
      theme: "e.g., Space Opera, a galaxy far, far away",
      task: "e.g., Plan the week's meals",
      role: "e.g., A Jedi Knight deciphering ancient holocrons",
      rule: "e.g., Drink a glass of water",
    },
    {
      theme: "e.g., Cyberpunk world, the neon-drenched Night City",
      task: "e.g., Reply to pending emails",
      role: "e.g., A street samurai on a corporate espionage gig",
      rule: "e.g., Stretch for 2 minutes",
    },
    {
      theme: "e.g., Post-Apocalyptic, the Capital Wasteland",
      task: "e.g., Clean the kitchen",
      role: "e.g., A Lone Wanderer scavenging for supplies",
      rule: "e.g., Listen to one song",
    },
    {
      theme: "e.g., Wizarding World, Hogwarts School",
      task: "e.g., Study for an exam",
      role: "e.g., An Auror investigating a dark magic disturbance",
      rule: "e.g., Eat a healthy snack",
    },
  ],
  es: [
    {
      theme: "Ej: Alta Fantasía, las tierras de la Tierra Media",
      task: "Ej: Hacer la compra",
      role: "Ej: Un Montaraz del Norte en una patrulla vital",
      rule: "Ej: Descansar 10 minutos",
    },
    {
      theme: "Ej: Ópera Espacial, una galaxia muy, muy lejana",
      task: "Ej: Planificar las comidas de la semana",
      role: "Ej: Un Caballero Jedi descifrando antiguos holocrones",
      rule: "Ej: Beber un vaso de agua",
    },
    {
      theme: "Ej: Mundo Cyberpunk, la lluviosa Night City",
      task: "Ej: Responder emails pendientes",
      role: "Ej: Un samurái callejero en un golpe corporativo",
      rule: "Ej: Estirar durante 2 minutos",
    },
    {
      theme: "Ej: Post-apocalíptico, el Yermo Capital",
      task: "Ej: Limpiar la cocina",
      role: "Ej: Un Trotamundos Solitario buscando suministros",
      rule: "Ej: Escuchar una canción",
    },
    {
      theme: "Ej: Mundo Mágico, el Colegio Hogwarts",
      task: "Ej: Estudiar para un examen",
      role: "Ej: Un Auror investigando magia oscura",
      rule: "Ej: Tomar un snack saludable",
    },
  ],
};

const translations = {
  en: {
    header: {
      title: "SagaFlow",
      subtitle: "Turn your to-do list into an epic adventure.",
    },
    inputSection: {
      themeLabel: "Universe & Theme",
      inspireMe: "Inspire Me",
      tasksLabel: "Core Missions (Tasks)",
      addTask: "Add Mission",
      roleLabel: "Your Role (Optional)",
      rulesLabel: "Mission Rules (Optional)",
      addRule: "Add Rule",
      generateButton: "Generate Saga",
      generateButtonLoading: [
        "Crafting Your Saga...",
        "Summoning the Oracle...",
        "Weaving Your Fate...",
      ],
      clearButton: "Clear All",
    },
    missionCard: {
      loading: [
        "The Chronicler writes your destiny...",
        "The threads of fate are weaving...",
        "An ancient power awakens...",
        "Portals to your adventure are opening...",
      ],
      errorTitle: "A Shadow Falls",
      placeholderTitle: "The Stage is Set",
      placeholderBody: 'Your epic saga awaits its beginning. Fill in the details of your world and press "Generate Saga" to receive your mission.',
      objectivesTitle: "Mission Objectives",
      originalTaskLabel: "Original",
      rulesTitle: "Mission Rules",
    },
    feedbackModal: {
      loadingTitle: [
        "Awaiting the Oracle...",
        "Recording your Legend...",
        "Consulting the Stars...",
      ],
      loadingBody: [
        "The storyteller reflects on your great deeds...",
        "The annals of history are being updated...",
        "Your legend echoes through time...",
      ],
      closeButton: "Onward!",
    },
    toast: {
      successTitle: "Objective Complete!",
    },
    featsLog: {
      title: "Recount of Feats",
    },
    app: {
      errorRequired: "Theme and at least one task are required to begin your saga.",
      errorUnknown: "An unknown error occurred. The saga could not be written.",
      footer: "Forged with Gemini",
    },
    settings: {
      theme: "Theme",
      language: "Language",
    },
  },
  es: {
    header: {
      title: "SagaFlow",
      subtitle: "Transforma tu lista de tareas en una aventura épica.",
    },
    inputSection: {
      themeLabel: "Universo y Temática",
      inspireMe: "Inspírame",
      tasksLabel: "Misiones Clave",
      addTask: "Añadir Misión",
      roleLabel: "Tu Protagonista (Opcional)",
      rulesLabel: "Reglas de Misión (Opcional)",
      addRule: "Añadir Regla",
      generateButton: "Generar Saga",
      generateButtonLoading: [
        "Forjando tu Saga...",
        "Invocando al Oráculo...",
        "Tejiendo el Destino...",
      ],
      clearButton: "Empezar de Nuevo",
    },
    missionCard: {
      loading: [
        "El Cronista escribe tu destino...",
        "Los hilos del destino se entrelazan...",
        "Un poder ancestral despierta...",
        "Se abren los portales a tu aventura...",
      ],
      errorTitle: "Una Sombra Cae",
      placeholderTitle: "El Escenario Está Listo",
      placeholderBody: 'Tu saga épica aguarda. Dale forma a tu mundo y presiona "Generar Saga" para recibir tu llamado a la aventura.',
      objectivesTitle: "Objetivos de la Misión",
      originalTaskLabel: "Misión Original",
      rulesTitle: "Reglas de la Misión",
    },
    feedbackModal: {
      loadingTitle: [
        "Esperando al Oráculo...",
        "Grabando tu Leyenda...",
        "Consultando las Estrellas...",
      ],
      loadingBody: [
        "El narrador medita sobre tus hazañas...",
        "Los anales de la historia se actualizan...",
        "Tu leyenda resuena a través del tiempo...",
      ],
      closeButton: "¡Adelante!",
    },
    toast: {
      successTitle: "¡Objetivo Completado!",
    },
    featsLog: {
      title: "Crónica de Hazañas",
    },
    app: {
      errorRequired: "Para comenzar tu saga, necesitas un universo y al menos una misión.",
      errorUnknown: "Un error inesperado impidió que se escribiera la saga.",
      footer: "Forjado con Gemini",
    },
    settings: {
      theme: "Tema",
      language: "Idioma",
    },
  },
};

type Language = keyof typeof translations;

export const t = (key: string, lang: Language): string => {
  const keys = key.split('.');
  
  const findTranslation = (language: Language) => {
    let branch: any = translations[language];
    for (const k of keys) {
      if (branch === undefined) return undefined;
      branch = branch[k];
    }
    return branch;
  };

  let result = findTranslation(lang);

  if (result === undefined) {
    console.warn(`Translation not found for key: ${key} in language: ${lang}`);
    result = findTranslation('en');
  }

  if (result === undefined) {
    return key;
  }

  if (Array.isArray(result)) {
    return result[Math.floor(Math.random() * result.length)];
  }

  return result;
};
