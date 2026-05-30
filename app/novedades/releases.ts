// Notas de parche / novedades de xRO.
// Cada entrada de `RELEASES` es un parche. El más reciente va primero (orden descendente).
// Para publicar un parche nuevo: añade un objeto al principio del array.

export type EntryKind = 'novedad' | 'mejora' | 'calidad-de-vida' | 'correccion';

export interface ReleaseEntry {
  kind: EntryKind;
  title: string;
  lead?: string;       // párrafo introductorio opcional
  bullets: string[];   // puntos del cambio
}

export interface Release {
  /** Identificador para el ancla de URL (#slug). */
  slug: string;
  /** Etiqueta corta de versión, p. ej. "Parche inaugural". */
  version: string;
  /** Fecha ISO (YYYY-MM-DD). Se formatea en la página. */
  date: string;
  /** Titular del parche. */
  title: string;
  /** Resumen de una o dos frases. */
  summary: string;
  entries: ReleaseEntry[];
}

export const KIND_META: Record<EntryKind, { label: string; color: string }> = {
  'novedad':         { label: 'Novedad',         color: 'var(--jade-500)' },
  'mejora':          { label: 'Mejora',          color: 'var(--amber-500)' },
  'calidad-de-vida': { label: 'Calidad de vida', color: 'var(--cobalt-500)' },
  'correccion':      { label: 'Corrección',      color: 'var(--crimson-500)' },
};

export const RELEASES: Release[] = [
  {
    slug: 'quests-4th-job',
    version: 'Contenido 4th Job',
    date: '2026-05-30',
    title: 'Quests oficiales de cambio a 4th Job para las 18 clases',
    summary:
      'Todos los quests de cambio a 4th job están ya en el servidor, basados en las guías oficiales de iRO. Cada clase tiene su propia cadena de NPCs, pruebas y recompensa (Hourglass Necklace). El jobmaster sigue disponible como atajo.',
    entries: [
      {
        kind: 'novedad',
        title: 'Quests de 4th job implementados para todas las clases',
        lead:
          'Cada clase 3rd job transcendente ahora tiene su quest oficial de cambio a 4th job con historia, NPCs y mecánicas propias. Basados en las guías de iRO Wiki.',
        bullets: [
          'Dragon Knight: 4 trials en Abyss Lake (Oscar en Geffen Field).',
          'Arch Mage: ritual de 3 esencias en Mansión Barmund.',
          'Cardinal: 3 Libros de Ilusión + derrotar a Dark Illusion en Glast Heim.',
          'Shadow Cross / Abyss Chaser: investigación de la sombra en Veins + items de cristal oscuro.',
          'Windhawk: prueba de supervivencia en Luluka Forest.',
          'Meister: trial en el Núcleo de Juperos + evaluación de Maura en Verus.',
          'Imperial Guard: torneo de caballeros en el Palacio de Prontera.',
          'Biolo: investigación y síntesis en los laboratorios de Verus.',
          'Elemental Master: caza de criaturas de maná + batalla de esencias.',
          'Inquisitor: 3 rondas de sellado demoniaco bajo el Monasterio de Prontera.',
          'Trouvere / Troubadour: misiones de caza y diálogo + ritual en Odin Temple.',
          'Sky Emperor: recolección de materiales naturales + prueba final en Mjolnir.',
          'Shinkiro / Shiranui: purificación de Amatsu + duelo con Yeongwi.',
          'Hyper Novice: resolver el enigma de los 8 novices en la Sala de Memorias.',
          'Night Watch: prueba de tiro y oleadas de combate (ya disponible desde antes).',
        ],
      },
      {
        kind: 'calidad-de-vida',
        title: 'Recompensa: Hourglass Necklace',
        bullets: [
          'Todos los quests de 4th job recompensan con la Hourglass Necklace (POW, SPL, STA, WIS, CRT y CON +6).',
          'El quest es la única vía para cambiar a 4th job — no hay atajos.',
        ],
      },
    ],
  },
  {
    slug: 'pets-homunculos-gramps',
    version: 'Rates y contenido',
    date: '2026-05-30',
    title: 'Intimidad x10, Gramps hasta nivel 275 y nuevos NPCs',
    summary:
      'Los rates de intimidad de pets y homúnculos ya van a la par del servidor x10, el homúnculo se queda despierto 5 horas, el Monster Hunter llega hasta nivel 275 y hay nuevos NPCs de utilidad en Lasagna y Midgard Camp.',
    entries: [
      {
        kind: 'mejora',
        title: 'Intimidad de pets y homúnculos x10',
        lead:
          'Alimentar a tu compañero ahora da diez veces más intimidad, proporcional al ritmo del servidor.',
        bullets: [
          'La intimidad sube x10 con cada comida, tanto para pets como para homúnculos.',
          'El homúnculo permanece invocado 5 horas antes de vaporizarse (antes se limitaba a 30 minutos por un tope de Renewal).',
        ],
      },
      {
        kind: 'novedad',
        title: 'Monster Hunter activo hasta nivel 275',
        lead:
          'El sistema de misiones de caza (Gramps) ya cubre todo el rango de niveles del servidor.',
        bullets: [
          'Tramo de entrada: nivel 140 en Eclage (Menblatt).',
          'Tramos intermedios a nivel 150 y 160.',
          'Misiones de alto nivel de 175 a 275 con monstruos acordes.',
        ],
      },
      {
        kind: 'novedad',
        title: 'NPC Eat Gear Mimic',
        lead:
          'Un Mimic peculiar dispuesto a comerse el equipo que llevas puesto a cambio de una recompensa.',
        bullets: [
          'Destruye un equipo equipado (arma, armadura, accesorio…) y te da materiales y Cash Points a cambio.',
          'Estilo iRO, para quienes quieran convertir equipo viejo en algo de valor.',
        ],
      },
      {
        kind: 'calidad-de-vida',
        title: 'Nuevos NPCs en Lasagna y Midgard Camp',
        bullets: [
          'Kafra de viaje y curandera disponibles en Lasagna: parte y recupérate sin salir del mapa.',
          'Midgard Camp accesible directamente desde la Kafra de Prontera.',
        ],
      },
      {
        kind: 'mejora',
        title: 'Combate más fluido',
        bullets: [
          'Reducido el retardo de movimiento tras recibir daño: el personaje reacciona más ágil.',
          'Eliminado el delay acumulado de skills multihit (Lord of Vermillion, Jupitel Thunder y similares).',
        ],
      },
      {
        kind: 'correccion',
        title: 'Fix quest Illusion of Underwater',
        bullets: [
          'El NPC Jerimon aparece ahora en su ubicación correcta (Biblioteca Este de Prontera) en lugar de un mapa inaccesible.',
        ],
      },
      {
        kind: 'novedad',
        title: 'Recuperación de contraseña y email desde la web',
        bullets: [
          'Si olvidaste tu contraseña o no recuerdas con qué email te registraste, recupéralo desde /cuenta/recuperar.',
          'Flujo en dos pasos: introduce tu usuario, recibe un código en el email y establece contraseña nueva.',
        ],
      },
      {
        kind: 'mejora',
        title: 'Avatares de personaje en el perfil',
        bullets: [
          'Elige un retrato de personaje de RO para tu perfil desde el selector de avatares en /cuenta.',
        ],
      },
      {
        kind: 'novedad',
        title: 'Sistema de soporte',
        bullets: [
          'Abre incidencias o reportes directamente desde la web en /soporte.',
          'El equipo de administración gestiona los tickets en un panel interno.',
        ],
      },
    ],
  },
  {
    slug: 'homunculos-ia',
    version: 'Homúnculos',
    date: '2026-05-27',
    title: 'Homúnculos con IA mejorada, autoloot y skills de quest libres',
    summary:
      'Tu homúnculo ahora pelea, castea y te sigue por su cuenta con una IA mucho más lista, recoge el loot por ti, y las skills de quest (como Bioethics) se aprenden libremente. Se instala solo: actualiza desde el launcher.',
    entries: [
      {
        kind: 'novedad',
        title: 'IA de homúnculo mejorada',
        lead:
          'Se acabó microgestionar al homúnculo: ahora actúa por su cuenta de forma mucho más inteligente.',
        bullets: [
          'Ataca lo que atacas, lanza sus propias skills y te sigue sin que tengas que estar encima.',
          'Compatible con todos los homúnculos, incluidos los Homunculus S.',
          'Actívala en el juego con el comando /hoai y re-invoca tu homúnculo (vaporizar y volver a llamar) para que cargue.',
          'Se instala sola: el launcher la descarga al actualizar el cliente, no tienes que hacer nada.',
        ],
      },
      {
        kind: 'mejora',
        title: 'Autoloot del homúnculo',
        bullets: [
          'Lo que mate tu homúnculo te entrega el loot directamente a tu inventario, sin que tengas que recogerlo.',
        ],
      },
      {
        kind: 'calidad-de-vida',
        title: 'Skills de quest aprendibles',
        bullets: [
          'Las skills de quest (como Bioethics, necesaria para invocar al homúnculo) ahora se aprenden libremente, sin tener que hacer la quest.',
          'Para que Alchemist, Creator y Geneticist puedan usar su homúnculo sin fricción.',
        ],
      },
      {
        kind: 'mejora',
        title: 'Launcher renovado',
        lead:
          'El launcher de xRO estrena imagen y atajos, y mantiene tu cliente al día sin que te preocupes.',
        bullets: [
          'Acceso directo a estas Novedades, al Discord, a la web y al registro desde el propio launcher.',
          'Estado del servidor en vivo: si está online y cuántos jugáis en ese momento.',
          'Actualiza el cliente solo (incluida la nueva IA del homúnculo). Y si personalizas la configuración de la IA, ya no te la sobrescribe al parchear.',
        ],
      },
    ],
  },
  {
    slug: 'parche-inaugural',
    version: 'Parche inaugural',
    date: '2026-05-27',
    title: 'Tienda cosmética, recompensas del Eden y mejoras de exploración',
    summary:
      'El primer parche de xRO deja la tienda de cash 100% cosmética, premia las misiones del Eden Group con Cash Points y habilita /memo en decenas de dungeons. Actualiza desde el launcher para tenerlo todo.',
    entries: [
      {
        kind: 'mejora',
        title: 'Tienda de cash renovada: solo cosméticos',
        lead:
          'La tienda pasa a ser 100% cosmética. Sin ventajas de pago: lo que compras es estética, no poder.',
        bullets: [
          'Alrededor de 1.500 costumes disponibles (sombreros, accesorios mid y low, y mantos) que se ven correctamente en el cliente.',
          'Eliminados todos los items rotos o sin sprite, esos que aparecían como «unknown item» o fallaban al cargar el recurso.',
          'Organizada por pestañas según el tipo: Cabeza (Top), Cabeza (Mid), Cabeza (Low) y Manto / Garment.',
          'Precios variados según la rareza, desde 50 hasta 1.500 cash points.',
          'La pestaña de equipo permanente queda reservada —vacía por ahora— para futuro contenido.',
        ],
      },
      {
        kind: 'novedad',
        title: 'Cash Points como recompensa del Eden Group',
        lead:
          'Las misiones del Eden Group ahora dan Cash Points, así que progresar también te acerca a los cosméticos.',
        bullets: [
          'Cada misión del Eden Group completada otorga Cash Points: +25 en misiones de nivel inferior a 100 y +50 en misiones de nivel 100 o superior.',
          'Corregido: las Eden Merit Badge se entregaban por error al aceptar la misión; ahora se reciben solo al completarla.',
        ],
      },
      {
        kind: 'calidad-de-vida',
        title: '/memo habilitado en las entradas de los dungeons',
        bullets: [
          'Ya puedes usar /memo (Warp Portal) en las entradas de 43 dungeons que antes no lo permitían.',
          'Incluye Magma Dungeon, Ice Cave, Thor Volcano, Glast Heim, las Pirámides, la Sphinx, Clock Tower y muchos más.',
        ],
      },
      {
        kind: 'correccion',
        title: 'Arreglada la quest «Brigan Collection» (Eden 100+)',
        bullets: [
          'El NPC Gelkah no cargaba por un error en su script y la quest no se podía entregar. Ya está corregido.',
          'Además, quien ya hubiera empezado la cadena puede terminarla aunque supere el nivel 110.',
        ],
      },
    ],
  },
];
