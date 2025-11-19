
export const placeholderSagas = {
  en: [
    {
      theme: "e.g., High Fantasy, the lands of Middle-earth",
      task: "e.g., Finish 1500-word History essay",
      role: "e.g., A Ranger of the North on a vital patrol",
      rule: "e.g., Turn off phone notifications",
    }
  ],
  es: [
    {
      theme: "Ej: Alta Fantasía, las tierras de la Tierra Media",
      task: "Ej: Terminar ensayo de Historia de 1500 palabras",
      role: "Ej: Un Montaraz del Norte en una patrulla vital",
      rule: "Ej: Poner el móvil en modo avión",
    }
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
      tasksLabel: "Core Missions (Real World Tasks)",
      addTask: "Add Mission",
      roleLabel: "Your Role (Optional)",
      rulesLabel: "Mission Rules (Habits/Breaks)",
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
      tutorial: "Replay Tutorial",
    },
    tutorial: {
      next: "Next",
      skip: "Skip",
      finish: "Finish",
      steps: [
        {
          title: "Welcome to SagaFlow",
          content: "Productivity meets epic storytelling. Let me show you how to turn your chores into legends.",
        },
        {
          title: "Choose Your World",
          content: "Start by defining the universe. Cyberpunk? Medieval Fantasy? Or simply 'The Office'. The AI adapts to anything.",
        },
        {
          title: "Define Your Missions",
          content: "List your real-world tasks here. 'Wash dishes', 'Send report', etc. These will become your heroic objectives.",
        },
        {
          title: "Ignite the Saga",
          content: "Click generate and watch as Gemini rewrites your boring list into a high-stakes narrative adventure.",
        },
        {
          title: "Fulfill Your Destiny",
          content: "Your mission appears here. As you check off tasks in real life, check them off here to receive epic feedback and track your feats.",
        },
      ],
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
      tasksLabel: "Misiones Clave (Tareas Reales)",
      addTask: "Añadir Misión",
      roleLabel: "Tu Protagonista (Opcional)",
      rulesLabel: "Reglas de Misión (Hábitos/Pausas)",
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
      tutorial: "Ver Tutorial",
    },
    tutorial: {
      next: "Siguiente",
      skip: "Saltar",
      finish: "Finalizar",
      steps: [
        {
          title: "Bienvenido a SagaFlow",
          content: "Donde la productividad encuentra la narrativa épica. Déjame mostrarte cómo convertir tus quehaceres en leyendas.",
        },
        {
          title: "Elige tu Mundo",
          content: "Define tu universo. ¿Cyberpunk? ¿Fantasía Medieval? ¿La Oficina? La IA se adaptará a cualquier cosa.",
        },
        {
          title: "Define tus Misiones",
          content: "Lista tus tareas reales aquí. 'Lavar platos', 'Enviar informe'. Estas se convertirán en tus objetivos heroicos.",
        },
        {
          title: "Inicia la Saga",
          content: "Haz clic en generar y observa cómo Gemini reescribe tu aburrida lista en una aventura de alto riesgo.",
        },
        {
          title: "Cumple tu Destino",
          content: "Tu misión aparecerá aquí. Al completar tareas en la vida real, márcalas aquí para recibir feedback épico y registrar tus hazañas.",
        },
      ],
    },
  },
};

type Language = keyof typeof translations;

export const t = (key: string, lang: Language): any => {
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
    // Only return a random element if it's an array of strings (flavor text).
    // If it contains objects (like tutorial steps), return the full array.
    if (result.length > 0 && typeof result[0] === 'string') {
      return result[Math.floor(Math.random() * result.length)];
    }
    return result;
  }

  return result;
};
