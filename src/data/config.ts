import { z } from 'zod';
import { rates } from './rates';

export const SHOW_PLAZA_MIRANDA = false;
export const site = {
  name: 'Republikken',
  tagline: 'Compartiendo ideas, energía y espacio',
  phone: '+34652505948',
  phoneDisplay: '652 505 948',
  email: 'contacto@republikkenmao.com',
  address: 'C/ Doctor Camps, 35',
  secondEntrance: 'Av. Josep Anselm Clavé, 56',
  postalCode: '07703',
  city: 'Maó',
  island: 'Menorca',
  hours: 'Lunes a sábado · 8:00–22:00',
  instagram: 'https://www.instagram.com/republikkenmao/',
  geo: { latitude: 39.8850761, longitude: 4.2593688 },
  maps: 'https://maps.app.goo.gl/N8jut3NzfJrWbjrJA',
  cobot: {
    general: 'https://republikken-mao.cobot.me/book',
    despacho: '', // [CONFIRMAR CON FRAN] URL profunda de cada recurso.
    eventos: '',
    fitness: '',
    miranda: '',
  },
  formEndpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || '',
  analytics: {
    provider: (import.meta.env.PUBLIC_ANALYTICS_PROVIDER || '') as '' | 'plausible' | 'ga4',
    id: import.meta.env.PUBLIC_ANALYTICS_ID || '',
    domain: import.meta.env.PUBLIC_ANALYTICS_DOMAIN || '',
  },
  // Activar únicamente con titularidad y textos revisados.
  legalVerified: false,
  legal: { owner: '[CONFIRMAR CON FRAN]', taxId: '[CONFIRMAR CON FRAN]' },
  chamber: { enabled: false, image: '/brand/sello-club-camara.svg', href: '' },
  socialProof: {
    enabled: false,
    testimonials: [] as { quote: string; author: string }[],
    brands: [] as { name: string; image: string }[],
  },
  locales: { active: ['es'], planned: ['ca', 'en'] },
};

export const faqSchema = z.object({ question: z.string(), answer: z.string() });
export type FAQItem = z.infer<typeof faqSchema>;
export const spaceSchema = z.object({
  id: z.enum(['despacho', 'eventos', 'fitness', 'miranda']),
  name: z.string(),
  shortName: z.string(),
  slug: z.string(),
  price: z.number().positive(),
  from: z.boolean(),
  lead: z.string(),
  detail: z.string(),
  metric: z.string(),
  includes: z.array(z.string()),
  site: z.enum(['mao', 'miranda']),
});

const allSpaces = spaceSchema.array().parse([
  {
    id: 'despacho',
    name: 'Despacho privado',
    shortName: 'Trabajar',
    slug: '/profesionales',
    price: rates.despacho,
    from: true,
    lead: 'Un espacio a la altura de tu trabajo.',
    detail:
      'Recibe a tus clientes, concéntrate o trabaja por un día. Un despacho cerrado, amueblado y con buena luz, solo para ti.',
    metric: 'Privacidad · Por horas o días',
    includes: [
      'Despacho cerrado y amueblado',
      'Buena luz',
      'Acceso a zonas comunes',
      'Limpieza y climatización',
    ],
    site: 'mao',
  },
  {
    id: 'eventos',
    name: 'Sala de eventos',
    shortName: 'Compartir',
    slug: '/eventos-formaciones',
    price: rates.eventos,
    from: true,
    lead: 'Tú traes la idea. Nosotros, el espacio.',
    detail:
      'Presentaciones, cursos y encuentros profesionales. Una sala versátil con proyección, sonido y catering a tu medida.',
    metric: '85 m² · Hasta 70 personas',
    includes: [
      'Proyector y pantalla',
      'Altavoz y wifi',
      '70 personas en auditorio',
      '24 personas con mesas',
    ],
    site: 'mao',
  },
  {
    id: 'fitness',
    name: 'Sala de yoga y fitness',
    shortName: 'Moverte',
    slug: '/entrenadores-fitness',
    price: rates.fitness,
    from: false,
    lead: 'Tu energía necesita su espacio.',
    detail:
      'Entrena, da clase o acompaña a tus clientes. Sala equipada para entrenamiento funcional, yoga y pilates, en exclusiva.',
    metric: 'Equipada · Uso exclusivo',
    includes: [
      'Esterillas y bloques',
      'Bandas elásticas',
      'Mancuernas y barras con peso',
      'Material de pilates',
    ],
    site: 'mao',
  },
  {
    id: 'miranda',
    name: 'Despacho Plaza Miranda',
    shortName: 'Trabajar',
    slug: '/espacios/plaza-miranda',
    price: rates.miranda,
    from: true,
    lead: 'Un despacho junto al puerto.',
    detail: 'Planta baja reformada con acceso a un patio común.',
    metric: 'Planta baja · Patio común',
    includes: ['Despacho privado', 'Patio común', 'Limpieza y climatización'],
    site: 'miranda',
  },
]);
export const spaces = allSpaces.filter((s) => s.site !== 'miranda' || SHOW_PLAZA_MIRANDA);
export type Space = z.infer<typeof spaceSchema>;
export const spaceForPath = (path: string) =>
  spaces.find((s) => s.slug === path) ||
  (path === '/reuniones-empresas' ? spaces.find((s) => s.id === 'eventos') : undefined);
export const spaceById = (id: string) => spaces.find((s) => s.id === id) || spaces[0];
export const priceLabel = (s: Space) => `${s.from ? 'Desde ' : ''}${s.price} €/h + IVA`;
export const whatsapp = (
  message = 'Hola, Fran. Me gustaría saber más sobre los espacios de Republikken.',
) => `https://wa.me/34652505948?text=${encodeURIComponent(message)}`;
export const reserveUrl = (id?: string) =>
  id ? `/reservar?espacio=${encodeURIComponent(id)}` : '/reservar';

export const commonFAQ = faqSchema.array().parse([
  {
    question: '¿Puedo reservar solo una hora?',
    answer:
      'Los espacios se alquilan por horas, sin permanencia. Consulta en el calendario las franjas y condiciones disponibles para el espacio que necesitas.',
  },
  {
    question: '¿Qué está incluido en el precio?',
    answer:
      'Limpieza, suministros y climatización. El despacho incluye acceso a zonas comunes; las salas, el equipamiento indicado en su ficha. Los precios se muestran sin IVA. El catering y los servicios de montaje o acompañamiento se presupuestan aparte.',
  },
  {
    question: '¿Tengo que firmar un contrato de alquiler?',
    answer:
      'No hay contrato de alquiler de larga duración ni permanencia. Reservas el tiempo que necesitas y aceptas las condiciones de la reserva.',
  },
  {
    question: '¿Qué actividades no se pueden realizar?',
    answer:
      'No acogemos fiestas privadas, música a alto volumen ni percusión. Tampoco actividades que requieren autorización sanitaria, como psicología clínica, fisioterapia o tratamientos con aparatología médica. Si tienes dudas sobre tu actividad, habla con Fran antes de reservar.',
  },
  {
    question: '¿Cómo accedo al espacio y qué pasa si cancelo?',
    answer:
      'Antes de confirmar, consulta con Fran las instrucciones de acceso y las condiciones de cambio o cancelación de tu reserva. Te ayudará a resolverlo por teléfono o WhatsApp.',
  },
]);
