import { z } from 'zod';
import { rates } from './rates';

/** Tokens allow one price edit to update copy, SEO and FAQ together. */
export function withPrices(value: string): string {
  return Object.entries(rates).reduce(
    (copy, [id, rate]) => copy.replaceAll(`{{precio_${id}}}`, String(rate)),
    value,
  );
}
export function resolveCopy<T>(value: T): T {
  if (typeof value === 'string') return withPrices(value) as T;
  if (Array.isArray(value)) return value.map(resolveCopy) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveCopy(v)])) as T;
  return value;
}
const homeSchema = z.object({
  title: z.string().max(60),
  description: z.string().max(155),
  headline: z.string(),
  accent: z.string(),
  intro: z.string(),
  noteTitle: z.array(z.string()),
  noteBody: z.string(),
  spacesHeading: z.string(),
  communityTitle: z.array(z.string()),
  communityBody: z.array(z.string()),
});
export const homeCopy = homeSchema.parse(
  resolveCopy({
    title: 'Coworking en Maó, Menorca · Por horas | Republikken',
    description:
      'Despachos privados desde {{precio_despacho}} €/h + IVA, eventos y fitness en el centro de Maó. Sin permanencia. Reserva tu espacio y consulta disponibilidad.',
    headline: 'DESPACHOS Y SALAS',
    accent: 'POR HORAS EN MAÓ.',
    intro:
      'Un despacho para tus ideas. Una sala para compartirlas. Un lugar para moverte. En el centro de Maó, solo cuando lo necesitas.',
    noteTitle: ['Espacios flexibles.', 'Sin permanencia.', 'Reserva por horas.'],
    noteBody:
      'Espacios privados. Una comunidad profesional. Y la libertad de venir cuando lo necesitas.',
    spacesHeading: 'Elige el espacio que necesitas.',
    communityTitle: ['Trabaja con privacidad.', 'Conecta con otros profesionales.'],
    communityBody: [
      'Aquí conviven profesionales que reciben clientes, cuidan de otras personas, enseñan y crean. Proyectos distintos, una misma manera de entender el espacio.',
      'Un coworking en Maó para trabajar con privacidad y formar parte de algo. Especialmente pensado para profesionales de la salud, la belleza, el bienestar y el deporte, junto a quienes asesoran y acompañan a sus clientes.',
    ],
  }),
);
