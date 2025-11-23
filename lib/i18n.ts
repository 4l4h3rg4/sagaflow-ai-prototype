

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
      generateButtonLoading: "Materializing...",
      clearButton: "Start Over",
      active: "Active",
      optional: "Optional",
      backButton: "← Back",
    },
    tooltips: {
      inspire: "Summon creative ideas",
      remove: "Dismiss item",
      reorder: "Realign destiny",
      add: "Add new objective",
      narrate: "Listen to the chronicle",
      settings: "Configuration",
      themeLight: "Daydream Mode",
      themeDark: "Starfall Mode",
      themeMystic: "Mystic Mode",
      langEN: "Switch to English",
      langES: "Switch to Spanish",
    },
    loadingPhases: [
      "Opening the portal to your world...",
      "Translating tasks into epic quests...",
      "Preparing your inventory...",
      "Consulting the map...",
      "Lighting the path ahead...",
      "Drafting your legend...",
    ],
    missionCard: {
      loading: [
        "Your story is coming to life...",
        "The ink is drying on your scroll...",
        "Adventure is calling...",
      ],
      errorTitle: "The Magic Fluctuated",
      placeholderTitle: "The Stage is Set",
      placeholderBody: 'Your epic saga awaits. Define your world above and press "Generate Saga" to begin your journey.',
      objectivesTitle: "Quest Objectives",
      originalTaskLabel: "Original Task",
      rulesTitle: "Code of Conduct",
      heroDefault: "Hero",
    },
    feedbackModal: {
      loadingTitle: [
        "Victory Secured!",
        "Recording Triumph...",
        "Splendid Work!",
      ],
      loadingBody: [
        "Archiving this achievement in your history...",
        "Your legend grows brighter...",
        "Feeling the satisfaction of a job well done...",
      ],
      closeButton: "Journey On!",
    },
    fallbackFeedback: {
      title: "Victory!",
      message: "You have completed all your objectives. A legendary achievement!"
    },
    toast: {
      successTitle: "Quest Updated!",
    },
    featsLog: {
      title: "Journal of Deeds",
    },
    app: {
      errorRequired: "To begin, we need a universe and at least one mission.",
      errorUnknown: "The connection to the story faded. Please try again.",
      footer: "Powered by Gemini",
    },
    settings: {
      theme: "Atmosphere",
      language: "Language",
      tutorial: "Replay Tutorial",
    },
    tutorial: {
      next: "Let's Begin",
      skip: "Skip",
      finish: "Ready",
      onboardingSteps: [
        {
          image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Raccoon.png",
          emoji: "🦝", 
          title: "Welcome, Traveler",
          // Format: Window Title ||| Hook/Headline ||| Body ||| Footer
          content: "Welcome to the SagaFlow Demo|||Ready to turn that boring to-do list into your next adventure?|||Thank you for starting *your journey*.\nWe've been expecting you!|||Remember, this realm is still in Development. Let's keep in touch!",
          socialLinks: [
            { label: "Updates & Beacons", url: "https://beacons.ai/sagaflow/" },
            { label: "Instagram", url: "https://www.instagram.com/sagaflowdev/" }
          ]
        },
        {
          emoji: "✨",
          title: "Writer's Block?",
          content: "No ideas? In a rush? Tap this magic button. It fills empty spots with instant creativity.",
        },
        {
          emoji: "🌍",
          title: "Build Your World",
          content: "Where is your story set? Hogwarts? Night City? Eden Academy? Type it here and SagaCore does the rest.",
        },
        {
          emoji: "🦸",
          title: "Who are you?",
          content: "Don't just be 'yourself.' Be a Sith or a Jedi, a Warrior or a Mage. Define who saves the day today.",
        },
        {
          emoji: "📝",
          title: "The Real Mission",
          content: "Here goes the boring stuff. List your REAL tasks (e.g., 'Review Chapter 5', 'Algebra Exercises', 'Wash Dishes'). We transform them into epic quests.",
        },
        {
          emoji: "🛡️",
          title: "Code of Honor",
          content: "Add constraints like 'No phone' or 'Drink water'. These become the sacred laws of your journey.",
        },
        {
          emoji: "🔮",
          title: "Forged by Magic",
          content: "When ready, press here. The magic takes a few seconds to materialize your unique saga.",
        },
      ],
      missionSteps: [
        {
            title: "Your Saga Begins",
            content: "You are no longer in your room. Read the scenario above to understand your new reality and mission.",
        },
        {
            title: "The Narrator",
            content: "Tired eyes? Click the speaker icon to have the AI narrate your mission briefing with a cinematic voice.",
        },
        {
            title: "Execute & Conquer",
            content: "This is the magic. When you finish a task in REAL LIFE, check it off here to receive an immediate narrative reward.",
        },
        {
            title: "Journal of Deeds",
            content: "Your victories are recorded here. Watch your legend grow with every step you take.",
        },
        {
            title: "Return / Edit",
            content: "Need to adjust the plan? Use this button to go back to the configuration.",
        }
      ]
    },
  },
  es: {
    header: {
      title: "SagaFlow",
      subtitle: "Convierte tu lista de tareas en una leyenda.",
    },
    inputSection: {
      themeLabel: "Universo y Temática",
      inspireMe: "Inspírame",
      tasksLabel: "Tus Tareas",
      addTask: "Añadir Tarea",
      roleLabel: "Tu Protagonista (Opcional)",
      rulesLabel: "Reglas / Restricciones",
      addRule: "Añadir Regla",
      generateButton: "Generar Saga",
      generateButtonLoading: "Creando Aventura...",
      clearButton: "Empezar de Nuevo",
      active: "Activas",
      optional: "Opcional",
      backButton: "← Volver",
    },
    tooltips: {
      inspire: "Generar ideas aleatorias",
      remove: "Eliminar",
      reorder: "Reordenar",
      add: "Añadir objetivo",
      narrate: "Narrar historia",
      settings: "Configuración",
      themeLight: "Modo Día",
      themeDark: "Modo Noche",
      themeMystic: "Modo Místico",
      langEN: "Cambiar a Inglés",
      langES: "Cambiar a Español",
    },
    loadingPhases: [
      "Abriendo el portal a tu mundo...",
      "Traduciendo tareas a misiones épicas...",
      "Preparando tu inventario...",
      "Consulting the map...",
      "Iluminando el camino...",
      "Escribiendo tu leyenda...",
    ],
    missionCard: {
      loading: [
        "Tu historia está cobrando vida...",
        "La tinta se seca en el pergamino...",
        "La aventura te llama...",
      ],
      errorTitle: "Hubo un problema mágico",
      placeholderTitle: "El Escenario Está Listo",
      placeholderBody: 'Tu saga épica aguarda. Define tu mundo arriba y presiona "Generar Saga" para comenzar tu viaje.',
      objectivesTitle: "Objetivos de la Misión",
      originalTaskLabel: "Tarea Original",
      rulesTitle: "Reglas de la Misión",
      heroDefault: "Héroe",
    },
    feedbackModal: {
      loadingTitle: [
        "¡Victoria Asegurada!",
        "Registrando Triunfo...",
        "¡Excelente Trabajo!",
      ],
      loadingBody: [
        "Guardando este logro en tu historia...",
        "Tu leyenda crece...",
        "Sintiendo la satisfacción del deber cumplido...",
      ],
      closeButton: "¡Continuar!",
    },
    fallbackFeedback: {
      title: "¡Victoria!",
      message: "Has completado todos tus objetivos. ¡Un logro legendario!"
    },
    toast: {
      successTitle: "¡Progreso Guardado!",
    },
    featsLog: {
      title: "Diario de Hazañas",
    },
    app: {
      errorRequired: "Para comenzar, necesitamos un universo y al menos una tarea.",
      errorUnknown: "La conexión con la historia se perdió. Inténtalo de nuevo.",
      footer: "Motor SagaCore by SagaFlow",
    },
    settings: {
      theme: "Tema Visual",
      language: "Idioma",
      tutorial: "Ver Tutorial",
    },
    tutorial: {
      next: "¡Vamos!",
      skip: "Saltar",
      finish: "¡Listo!",
      onboardingSteps: [
        {
          image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Raccoon.png",
          emoji: "🦝", 
          title: "Bienvenido, Viajero",
          // Format: Window Title ||| Hook/Headline ||| Body ||| Footer
          content: "Bienvenido a la Demo de SagaFlow|||¿Listo para convertir esa aburrida lista de pendientes en tu próxima aventura?|||Muchas gracias por comenzar *tu viaje*.\n¡Te estábamos esperando!|||Recuerda que esta app sigue en Desarrollo. ¡Sigamos en contacto!",
          socialLinks: [
            { label: "Novedades y Beacons", url: "https://beacons.ai/sagaflow/" },
            { label: "Instagram", url: "https://www.instagram.com/sagaflowdev/" }
          ]
        },
        {
          emoji: "✨",
          title: "¿Bloqueo Creativo?",
          content: "¿Sin ideas o con prisa? Toca este botón mágico. Rellenará los espacios vacíos con creatividad instantánea.",
        },
        {
          emoji: "🌍",
          title: "Construye tu Mundo",
          content: "¿Dónde ocurre tu historia? ¿Hogwarts? ¿Night City? ¿La Academia Eden? Escríbelo aquí y SagaCore hará el resto.",
        },
        {
          emoji: "🦸",
          title: "¿Quién eres tú?",
          content: "¿No seas 'tú mismo'. Puedes ser un Sith o un Jedi, un Guerrero o un Mago. Define quién va a salvar el día hoy.",
        },
        {
          emoji: "📝",
          title: "La Misión Real",
          content: "Aquí va lo aburrido. Escribe tus tareas REALES (ej. 'Repasar Capítulo 5', 'Resolver Ejercicios de Álgebra', 'Lavar los Platos'). Nosotros las traduciremos a lenguaje épico.",
        },
        {
          emoji: "🛡️",
          title: "Código de Honor",
          content: "Añade condiciones como 'Sin celular' o 'Beber agua'. Se convertirán en leyes sagradas de tu viaje.",
        },
        {
          emoji: "🔮",
          title: "Forged by Magic",
          content: "Cuando estés listo, presiona aquí. La magia tarda unos segundos en materializarse.",
        },
      ],
      missionSteps: [
        {
            title: "Tu Saga Comienza",
            content: "Ya no estás en tu habitación. Lee el escenario arriba para entender tu nueva realidad y objetivo.",
        },
        {
            title: "El Narrador",
            content: "¿Ojos cansados? Haz clic en el altavoz para que la IA narre tu informe de misión con voz cinematográfica.",
        },
        {
            title: "Ejecuta y Gana",
            content: "Aquí está la magia. Cuando termines una tarea en la VIDA REAL, márcala aquí para recibir una recompensa narrativa inmediata.",
        },
        {
            title: "Diario de Hazañas",
            content: "Tus victorias se registran aquí abajo. Observa cómo crece tu leyenda con cada paso.",
        },
        {
            title: "Volver / Editar",
            content: "¿Necesitas ajustar el plan? Usa este botón para regresar a la configuración.",
        }
      ]
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
      return result;
    }
    return result;
  }

  return result;
};
