
export interface ThemeOption {
  universe: string;
  roles: string[];
}

export interface InspirationData {
  themes: ThemeOption[];
  tasks: string[];
  constraints: string[];
}

export const inspirationData: Record<'en' | 'es', InspirationData> = {
  en: {
    themes: [
      {
        universe: "Cyberpunk 2077 / Night City",
        roles: ["Netrunner Mercenary", "Corporate Fixer", "Street Samurai", "Trauma Team Medic"]
      },
      {
        universe: "Lord of the Rings / Middle-earth",
        roles: ["Ranger of the North", "Elven Scholar", "Dwarven Blacksmith", "Hobbit Adventurer"]
      },
      {
        universe: "Star Wars / The Galaxy",
        roles: ["Jedi Padawan", "Mandalorian Bounty Hunter", "Rebel Pilot", "Imperial Officer"]
      },
      {
        universe: "Marvel / Avengers Tower",
        roles: ["Tech Genius Hero", "Super Soldier", "Mystic Arts Sorcerer", "SHIELD Agent"]
      },
      // Requested X-Men Theme
      {
        universe: "X-Men / Xavier's Institute",
        roles: ["New Mutant Recruit", "Danger Room Commander", "Telepathic Student", "Wolverine's Apprentice"]
      },
      {
        universe: "Harry Potter / Hogwarts",
        roles: ["Gryffindor Prefect", "Auror Investigator", "Potion Master", "Department of Mysteries Clerk"]
      },
      {
        universe: "The Matrix / The Real World",
        roles: ["Operator", "Red Pill Resistance Member", "The One", "Zion Defender"]
      },
      {
        universe: "Zombie Apocalypse / Survivor Camp",
        roles: ["Supply Runner", "Base Fortification Expert", "Medic", "Scout"]
      },
      {
        universe: "Dungeons & Dragons / Forgotten Realms",
        roles: ["Level 5 Wizard", "Rogue Assassin", "Paladin of Light", "Bard Chronicler"]
      },
      {
        universe: "Star Trek / USS Enterprise",
        roles: ["Science Officer", "Chief Engineer", "Ship Captain", "Medical Officer"]
      },
      {
        universe: "Eldritch Horror / Lovecraftian 1920s",
        roles: ["Paranormal Investigator", "Occult Professor", "Private Detective", "Sanatorium Doctor"]
      },
      // Gaming & Pop Culture additions (15-25y)
      {
        universe: "Genshin Impact / Teyvat",
        roles: ["Knight of Favonius", "Liyue Qixing Secretary", "Fatui Harbinger", "Adventurers' Guild Member"]
      },
      {
        universe: "Elden Ring / The Lands Between",
        roles: ["Tarnished Warrior", "Sorcerer of Raya Lucaria", "Finger Maiden", "Recusant Knight"]
      },
      {
        universe: "Valorant / Future Earth",
        roles: ["Radiant Agent", "Sentinel Specialist", "Duelist Entry Fragger", "Shadow Operative"]
      },
      {
        universe: "League of Legends (Arcane) / Piltover & Zaun",
        roles: ["Hextech Inventor", "Undercity Brawler", "Piltover Enforcer", "Firelight Leader"]
      },
      {
        universe: "Minecraft / The Overworld",
        roles: ["Redstone Engineer", "Diamond Miner", "Nether Explorer", "Village Architect"]
      },
      {
        universe: "Stranger Things / Hawkins",
        roles: ["Psychic Test Subject", "Hellfire Club Leader", "Hawkins Lab Scientist", "Upside Down Explorer"]
      },
      {
        universe: "The Hunger Games / Panem",
        roles: ["District Tribute", "Rebel of District 13", "Victor Mentor", "Capital Stylist"]
      },
      {
        universe: "Avatar: The Last Airbender / Four Nations",
        roles: ["Firebending Master", "Water Tribe Warrior", "Earth Kingdom Guard", "Air Nomad Monk"]
      },
      {
        universe: "Spider-Verse / Multiverse",
        roles: ["Spider-Society Recruit", "Punk Rock Spidey", "Noir Detective", "Glitch Hunter"]
      }
    ],
    tasks: [
      "Finish the 10-page history essay",
      "Debug the login component code",
      "Prepare slides for tomorrow's presentation",
      "Complete the Calculus problem set",
      "Read 3 chapters of the textbook",
      "Reply to pending client emails",
      "Update the team Jira board",
      "Pay electricity and internet bills",
      "Clean the entire bathroom",
      "Do a full load of laundry",
      "Meal prep for the next 3 days",
      "Go to the gym for leg day",
      "Call mom to catch up",
      "Organize Desktop files and folders",
      "Schedule dentist appointment",
      "Review lecture notes for finals",
      "Write the monthly progress report",
      "Practice guitar for 30 minutes",
      "Go grocery shopping",
      "Vacuum the living room"
    ],
    constraints: [
      "Drink a glass of water every hour",
      "Use the Pomodoro technique (25/5)",
      "No social media until finished",
      "Stand up and stretch every 30 mins",
      "Put phone in Do Not Disturb mode",
      "Listen to Lo-Fi beats only",
      "Keep good posture",
      "Reward yourself with a snack after",
      "Take a 5-minute deep breathing break",
      "Clean your desk before starting",
      "Write down distractions on a notepad",
      "No multitasking allowed",
      "Use blue-light glasses",
      "Have a cup of tea/coffee nearby",
      "Turn off email notifications"
    ]
  },
  es: {
    themes: [
      // Anime Hits
      {
        universe: "One Piece / El Grand Line",
        roles: ["Pirata del Sombrero de Paja", "Almirante de la Marina", "Oficial Revolucionario", "Cazador de Recompensas"]
      },
      {
        universe: "Jujutsu Kaisen / Tokyo Jujutsu High",
        roles: ["Hechicero de Grado 1", "Usuario de Energía Maldita", "Recipiente de Sukuna", "Miembro del Clan Zen'in"]
      },
      {
        universe: "Shingeki no Kyojin / Las Murallas",
        roles: ["Explorador de la Legión", "Cambiante Titán", "Defensor de la Guarnición", "Policía Militar"]
      },
      {
        universe: "Demon Slayer / Era Taisho",
        roles: ["Cazador de Demonios", "Pilar (Hashira)", "Usuario de Respiración", "Herrero de Katanas"]
      },
      // Requested X-Men Theme
      {
        universe: "X-Men / Instituto Xavier",
        roles: ["Nuevo Recluta Mutante", "Comandante de la Sala de Peligro", "Estudiante Telepático", "Aprendiz de Wolverine"]
      },
      {
        universe: "Cyberpunk 2077 / Night City",
        roles: ["Mercenario Netrunner", "Fixer Corporativo", "Samurái Callejero", "Médico de Trauma Team"]
      },
      {
        universe: "El Señor de los Anillos / Tierra Media",
        roles: ["Montaraz del Norte", "Erudito Elfo", "Herrero Enano", "Aventurero Hobbit"]
      },
      {
        universe: "Star Wars / La Galaxia",
        roles: ["Padawan Jedi", "Cazarrecompensas Mandaloriano", "Piloto Rebelde", "Oficial Imperial", "Aprendiz Sith"]
      },
      {
        universe: "Marvel / Avengers",
        roles: ["Genio Tecnológico", "Súper Soldado", "Hechicero Supremo", "Agente de SHIELD"]
      },
      {
        universe: "Harry Potter / Hogwarts",
        roles: ["Prefecto de Gryffindor", "Investigador Auror", "Maestro de Pociones", "Funcionario del Ministerio"]
      },
      {
        universe: "Matrix / El Mundo Real",
        roles: ["Operador", "Miembro de la Resistencia", "El Elegido", "Defensor de Zion"]
      },
      {
        universe: "Apocalipsis Zombie / Refugio",
        roles: ["Corredor de Suministros", "Experto en Fortificaciones", "Médico de Campo", "Explorador"]
      },
      // Gaming & Pop Culture additions (15-25y)
      {
        universe: "Genshin Impact / Teyvat",
        roles: ["Caballero de Favonius", "Secretario de las 7 Estrellas", "Heraldo de los Fatui", "Miembro del Gremio de Aventureros"]
      },
      {
        universe: "Elden Ring / Las Tierras Intermedias",
        roles: ["Guerrero Sinluz", "Hechicero de Raya Lucaria", "Doncella del Dedo", "Caballero Recusante"]
      },
      {
        universe: "Valorant / Tierra Futura",
        roles: ["Agente Radiante", "Especialista Centinela", "Duelista de Entrada", "Operativo de las Sombras"]
      },
      {
        universe: "League of Legends (Arcane) / Piltover y Zaun",
        roles: ["Inventor Hextech", "Luchador de los Bajos Fondos", "Agente de la ley", "Líder de los Firelights"]
      },
      {
        universe: "Minecraft / El Overworld",
        roles: ["Ingeniero de Redstone", "Minero de Diamantes", "Explorador del Nether", "Arquitecto de Aldeas"]
      },
      {
        universe: "Stranger Things / Hawkins",
        roles: ["Sujeto de Pruebas Psíquico", "Líder del Club Hellfire", "Científico del Laboratorio", "Explorador del Upside Down"]
      },
      {
        universe: "Los Juegos del Hambre / Panem",
        roles: ["Tributo del Distrito", "Rebelde del Distrito 13", "Mentor Vencedor", "Estilista del Capitolio"]
      },
      {
        universe: "Avatar: La Leyenda de Aang / Cuatro Naciones",
        roles: ["Maestro Fuego", "Guerrero de la Tribu Agua", "Guardia del Reino Tierra", "Monje Nómada Aire"]
      },
      {
        universe: "Spider-Verse / Multiverso",
        roles: ["Recluta de la Spider-Society", "Spider-Punk", "Detective Noir", "Cazador de Glitches"]
      }
    ],
    tasks: [
      "Terminar el ensayo de historia de 10 pág.",
      "Preparar diapositivas para la presentación",
      "Resolver la guía de ejercicios de Cálculo",
      "Leer 3 capítulos del libro de texto",
      "Responder correos pendientes de clientes",
      "Pagar facturas de luz e internet",
      "Limpiar el baño a fondo",
      "Hacer toda la colada de la semana",
      "Cocinar tuppers para 3 días (Meal prep)",
      "Organizar archivos del Escritorio",
      "Pedir cita con el dentista",
      "Repasar apuntes para el final",
      "Escribir el reporte mensual de progreso",
      "Pasar la aspiradora"
    ],
    constraints: [
      "Beber un vaso de agua cada hora",
      "Usar técnica Pomodoro (25/5)",
      "Sin redes sociales hasta terminar",
      "Levantarse y estirar cada 30 min",
      "Poner el celular en No Molestar",
      "Mantener la espalda recta",
      "Premiarse con un snack al final",
      "Hacer 5 min de respiración profunda",
      "Despejar el escritorio antes de empezar",
      "Anotar distracciones en un papel",
      "Prohibido el multitasking",
      "Tener un té o café a mano",
      "Desactivar notificaciones de correo"
    ]
  }
};
