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
