import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { landings } from '../../data/landings';
import { SHOW_PLAZA_MIRANDA } from '../../data/config';
const staticPages = [
  ['inicio', 'TU ESPACIO. A TU RITMO.'],
  ['espacios', 'HAZLO TUYO.'],
  ['tarifas', 'CUENTAS CLARAS.'],
  ['como-funciona', 'TAN FÁCIL COMO VENIR.'],
  ['presupuesto', 'HABLEMOS DE TU EVENTO.'],
  ['contacto', 'MEJOR, LO HABLAMOS.'],
  ['reservar', 'RESERVA TU ESPACIO.'],
  ['preguntas-frecuentes', 'TODO, MÁS CLARO.'],
  ['guias', 'IDEAS QUE PIDEN ESPACIO.'],
  ['aviso-legal', 'AVISO LEGAL'],
  ['privacidad', 'PRIVACIDAD'],
  ['cookies', 'TÚ DECIDES.'],
  ['404', 'UN ESPACIO POR ENCONTRAR.'],
];
export async function getStaticPaths() {
  const guides = await getCollection('guias');
  return [
    ...staticPages,
    ...landings.map((l) => [l.slug, `${l.heading} ${l.accent}`]),
    ...guides.map((g) => [`guias-${g.id}`, g.data.title]),
    ...(SHOW_PLAZA_MIRANDA ? [['espacios-plaza-miranda', 'TU DESPACHO JUNTO AL PUERTO.']] : []),
  ].map(([slug, title]) => ({ params: { slug }, props: { title } }));
}
const escape = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
export const GET: APIRoute = async ({ props }) => {
  const words = String(props.title).split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > 26) {
      lines.push(line);
      line = word;
    } else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f6f3e8"/><rect x="890" width="310" height="630" fill="#675f2e"/><text x="70" y="92" font-family="sans-serif" font-size="22" letter-spacing="5" fill="#675f2e">REPUBLIKKEN · MAÓ</text><path d="M70 135H820" stroke="#bcb59a"/>${lines.map((text, i) => `<text x="65" y="${250 + i * 68}" font-family="sans-serif" font-weight="600" font-size="56" letter-spacing="-1" fill="#3b3618">${escape(text)}</text>`).join('')}<text x="70" y="553" font-family="sans-serif" font-size="19" fill="#675f2e">ESPACIOS POR HORAS · EN EL CENTRO DE MAÓ</text><g transform="translate(947,205) scale(1.8)" fill="none" stroke="#e4cb72" stroke-width="2"><path d="M47 3 4 28v51l43-25V3Z" fill="#e4cb72" stroke="none"/><path d="m53 4 43 25v50L53 54V4ZM49 61 7 85l42 25 43-25-43-24Z"/></g></svg>`;
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(buffer), { headers: { 'Content-Type': 'image/png' } });
};
