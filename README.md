# Republikken · Web de espacios por horas

Proyecto Astro estático, en español, construido en este directorio. 20 páginas, fuentes locales, fotografías del negocio optimizadas, componentes reutilizables y JavaScript sin framework para interacciones puntuales.

## Arranque

Requiere Node **22.23.4 o superior**; recomendado Node 24 y npm. La versión instalada de Astro es **7.4.12**, consultada en npm al iniciar el proyecto. El lockfile fija el árbol reproducible de dependencias.

```bash
npm ci
npm run dev
```

Abre la URL que imprima Astro. El puerto habitual es `http://localhost:4321`; si está ocupado, Astro elige otro.

```bash
npm run build       # tipos + producción en dist/
npm run preview     # servir la compilación de producción
npm run verify      # páginas, enlaces, SEO, JSON-LD y ausencia de sede oculta
npm test            # interacciones con DOM y red simulados
```

Astro 7 puede dejar la vista previa en segundo plano. Usa `npx astro preview status`, `npx astro preview logs` y `npx astro preview stop` para gestionarla. La vista previa y el servidor de desarrollo pueden coexistir; Lighthouse debe medir **producción**, nunca el servidor de desarrollo.

## Editar el contenido

| Qué modificar                                                   | Archivo                                       |
| --------------------------------------------------------------- | --------------------------------------------- |
| Precios base por hora, sin IVA                                  | `src/data/rates.ts`                           |
| Teléfono, dirección, horario, Cobot, analítica, sello, banderas | `src/data/config.ts`                          |
| Descripción y equipamiento de espacios                          | `src/data/config.ts`, `allSpaces`             |
| Copy principal de home                                          | `src/data/copy.ts`, `homeCopy`                |
| Títulos, SEO, casos de uso y FAQ por público                    | `src/data/landings.ts`                        |
| Preguntas frecuentes generales                                  | `src/data/config.ts`, `commonFAQ`             |
| Artículos y metadatos                                           | `src/content/guias/*.md`                      |
| Textos legales en borrador                                      | `src/data/legal.ts`                           |
| Contenido auxiliar de páginas y bloques                         | `src/pages/*.astro`, `src/components/*.astro` |
| Colores, tipografía, medidas, movimiento, responsive            | `src/styles/global.css`                       |

Un precio se modifica **una sola vez** en `rates.ts`. Las fichas, reserva, tarifas, calculadoras, ofertas estructuradas, FAQ y metadescripciones se actualizan a partir de esos valores. Dentro de los archivos de datos se pueden usar tokens `{{precio_despacho}}`, `{{precio_eventos}}` y `{{precio_fitness}}`. `withPrices()` los resuelve al generar la web. El cálculo es orientativo, sin IVA, descuentos ni servicios adicionales; no afirma precios de competidores.

Los esquemas Zod validan espacios, landings, FAQ, copy principal y guías. Las guías se cargan con las colecciones de contenido de Astro (`src/content.config.ts`). No hay CMS ni servidor de contenidos que mantener.

## Rutas

- `/`: propuesta, tres accesos, espacios, proceso, comunidad, Fran, ubicación y FAQ.
- `/profesionales`: despacho privado, casos de uso y calculadora.
- `/reuniones-empresas`: misma sala de eventos, intención reuniones y juntas de 4–24 personas.
- `/eventos-formaciones`: actos y formación para hasta 70 personas, presupuesto como CTA prioritario.
- `/entrenadores-fitness`: sala de yoga, pilates y fitness; uso exclusivo, entrenamiento personal, material y clases recurrentes.
- `/pases-bonos`: oferta estacional de junio a finales de septiembre y consulta fuera de temporada.
- `/espacios`, `/tarifas`, `/como-funciona`, `/reservar`.
- `/presupuesto`, `/contacto`, `/preguntas-frecuentes`.
- `/guias` y tres guías informativas con enlaces comerciales.
- `/aviso-legal`, `/privacidad`, `/cookies`: borradores `noindex` pendientes de completar.
- `404.html`: página de error; configurar el hosting para usarla con estado HTTP 404.

## Conectar Cobot

La URL pública de reservas es `https://republikken-mao.cobot.me/book`. La página de pases y bonos enlaza la portada pública de Cobot, donde se publica la oferta estacional.

1. En Cobot, habilita los recursos de reserva externa y comprueba tarifas, IVA, horarios, condiciones y pago.
2. Copia la **URL real de cada recurso** a `site.cobot.despacho`, `.eventos` y `.fitness`.
3. Compila de nuevo. El selector pasa a enlazar al recurso exacto automáticamente.
4. Prueba manualmente un recorrido de disponibilidad y pago con el responsable del negocio.

Sin enlaces individuales, `/reservar` abre el calendario general en otra pestaña y explica que hay que elegir el recurso allí. WhatsApp sigue disponible. **La web no inventa disponibilidad, no confirma reservas ni simula pagos.** No se ha realizado ninguna compra ni reserva durante el desarrollo. El calendario público consultado no exponía recursos verificables: falta validar su configuración comercial.

Se ha elegido enlace profundo en lugar de iframe: mantiene el consentimiento y las sesiones de pago en Cobot, evita depender de permisos de incrustación y no carga terceros antes de una acción del visitante.

## Presupuestos y formulario

Por defecto, el formulario valida los campos y prepara un mensaje de WhatsApp. El visitante lo revisa y lo envía allí. La confirmación dice expresamente **«Todavía no se ha enviado»**. No hay datos almacenados en el navegador ni envíos automáticos.

Para recibir solicitudes directamente, copia `.env.example` a `.env` y configura un endpoint compatible con FormData y respuesta HTTP JSON, por ejemplo Formspree:

```dotenv
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/TU_ID_REAL
```

El frontend valida obligatorios, correo, fecha no pasada, días de apertura y aforos de 24/70, incluye honeypot `_gotcha`, timeout y estados de envío/error. Solo muestra éxito después de una respuesta HTTP satisfactoria. Si falla, conserva los valores y ofrece contacto directo.

El proveedor debe validar también los campos en servidor, limitar frecuencia, gestionar spam y devolver un estado HTTP apropiado. Configura dominio autorizado, destinatario y retención de datos en el proveedor. Completa la política de privacidad y los contratos de tratamiento antes de habilitarlo. Las variables `PUBLIC_*` son públicas: **no contienen secretos**.

## Analítica y cookies

La integración prevista es **Umami Analytics**. Antes de publicar, crea la propiedad e incorpora sus datos al entorno de producción:

```dotenv
PUBLIC_UMAMI_WEBSITE_ID=00000000-0000-4000-8000-000000000000
PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

La etiqueta solo carga después de Aceptar. Rechazar tiene igual peso visual. La preferencia se guarda bajo `republikken-consent-v1` y se puede cambiar desde el footer. Si se revoca después de cargar Umami o Google Maps, la página se recarga para retirar ese contenido externo.

Eventos: `reserve_click` (espacio), `whatsapp_click`, `phone_click`, `quote_prepared` (WhatsApp, sin afirmar envío), `quote_submit` (respuesta del proveedor confirmada), `view_prices` y `calculator_use`. Nunca se adjuntan nombre, correo, teléfono ni texto del formulario a los eventos. El mapa de Google se carga automáticamente al aceptar las cookies opcionales; si se rechazan, aparece un aviso en su lugar.

## Fotos, marca y sello de Cámara

Imágenes originales en `src/assets/images/`; las utilizadas se sirven con `astro:assets`, dimensiones, WebP y tamaños adaptativos. El resto se conserva como material auténtico disponible para futuras secciones. Procedencia documentada en `FUENTES.md`.

Para sustituir una imagen, mantén o cambia el import en el componente correspondiente, revisa su `alt` y su encuadre. Cambia `SpaceArt` por `<Image>` cuando lleguen fotos de eventos y fitness; las composiciones actuales son gráficos de marca, no fotografías ni planos del local.

Logo provisional en `src/components/Logo.astro` y `public/brand/logo.svg`. Sustituye por el SVG original autorizado y actualiza favicon/OG si corresponde. Instrucciones adicionales en `src/assets/brand/README.md`. Las imágenes de compartir se generan como PNG de 1200×630 en `/og/` durante el build; cada página tiene una propia.

El sello está desactivado en `site.chamber`. Añade el SVG oficial a `public/brand/`, configura el enlace y activa `enabled` tras confirmar autorización. El PDF solo aporta instrucciones, no el archivo «Sello Club Cámara HTML.txt» que menciona. No se ha fingido una acreditación ni se ha inyectado código externo desconocido.

## Sede oculta y testimonios

`SHOW_PLAZA_MIRANDA = false` filtra los datos antes de renderizar. No se genera su página, opción de reserva, imagen OG, enlace, JSON-LD ni entrada de sitemap; `npm run verify` comprueba también los bundles públicos.

Para activarla: completa dirección, tarifa, fotos y enlace Cobot, cambia la bandera y revisa `/espacios/plaza-miranda`, listado de espacios y selector de reserva. La ficha está preparada; aún requiere esos datos para una publicación correcta. No reutilices la dirección de la sede principal como dirección de la nueva sede.

Testimonios y marcas: `site.socialProof.enabled` está desactivado y los arrays vacíos. `SocialProof.astro` solo renderiza datos reales que introduzcas. No se han inventado opiniones, logos, valoraciones ni contadores.

## Idiomas

Astro i18n está configurado con español como único idioma activo. `site.locales.planned` documenta `ca` y `en`. Al incorporar traducciones reales, añade los locales en `astro.config.mjs`, crea sus rutas, externaliza las cadenas restantes y genera alternates `hreflang` por equivalencia de páginas. No se publican versiones vacías ni hreflang hacia páginas inexistentes.

## Despliegue estático

No se ha publicado ni modificado la web en producción. Completa `PENDIENTES.md` antes del lanzamiento.

- **Netlify:** `netlify.toml` incluido, comando `npm run build`, directorio `dist`.
- **Vercel:** `vercel.json` incluido, framework Astro, salida `dist`.
- **Cloudflare Pages:** comando `npm run build`, salida `dist`, Node 24. Sin adaptador Worker ni SSR.
- Otro hosting: sirve `dist/` como archivos estáticos, resuelve rutas limpias a sus `index.html` y usa `404.html` para rutas inexistentes.

Establece `SITE_URL` si el dominio definitivo cambia y recompila: controla canonicals, sitemap, JSON-LD y OG. No añadas barras finales a las URLs canónicas. Activa HTTPS, compresión Brotli/gzip y caché de assets con hash.

`public/_headers` aplica cabeceras en Netlify/Cloudflare Pages y `vercel.json` cubre Vercel. Se incluyen `nosniff`, política de referrer, protección frente a framing y denegación de permisos no usados. Evalúa HSTS después de confirmar HTTPS en todos los subdominios. Una CSP estricta necesita hashes/nonces de los scripts JSON-LD y las fuentes/hosts de los proveedores elegidos; documenta y ensaya primero `Content-Security-Policy-Report-Only`, sin copiar `unsafe-inline` como solución genérica.

## Verificación y alcance de las pruebas

```bash
npm run build
npm run verify
npm test
AUDIT_URL=http://localhost:4322 npm run audit
```

Para auditar rutas concretas: `npm run audit -- / /profesionales`. Requiere Chrome local; ajusta `CHROME_PATH` si corresponde. No ejecutes auditorías en paralelo si quieres comparar rendimiento. Los informes incluyen perfil, URL y fecha. Las páginas legales y el 404 se excluyen del objetivo SEO 100 porque llevan `noindex` deliberadamente.

- `reports/structure.json`: rutas, títulos, descripciones, enlaces y schema.
- `reports/interactions.json`: pruebas DOM con red simulada; nunca envíos reales.
- `reports/lighthouse/`: HTML/JSON y capturas de cada página auditada.
- `INFORME_CALIDAD.md`: resultados y límites de comprobación.

Los resultados de Lighthouse en laboratorio no sustituyen Core Web Vitals de tráfico real ni una auditoría manual integral WCAG. Para reservas, pagos y correos reales falta la comprobación final con las cuentas y condiciones del negocio.
