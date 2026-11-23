# Informe de calidad · Republikken

Verificación final: **14 de noviembre de 2026**. Proyecto local; sin despliegue ni transacciones comerciales reales.

## Resultado

- `astro check`: 0 errores, 0 advertencias y 0 sugerencias.
- Compilación estática: **20 páginas** y sus assets.
- Verificación estructural: **20 páginas, 0 errores**.
- Pruebas de interacción aisladas: **14/14 correctas**.
- Auditoría de dependencias npm: **0 vulnerabilidades conocidas** en el momento de la consulta.
- Lighthouse móvil: **16 páginas indexables**, rendimiento 99–100; accesibilidad, buenas prácticas y SEO 100.
- Home de escritorio: **100/100/100/100**.
- Presupuesto a 320 px: **100/100/100/100**, captura con ancho exacto de 320 px.

## Lighthouse móvil

Chrome local, Lighthouse 13.6.0, compilación de producción servida en `http://localhost:4322`. Perfil móvil estándar con limitación simulada. La tabla corresponde a la última pasada completa, conservando también el resultado de 99: no se seleccionó una muestra favorable para ocultarlo.

| Ruta | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| [/como-funciona](reports/lighthouse/como-funciona.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00006 |
| [/contacto](reports/lighthouse/contacto.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00000 |
| [/entrenadores-fitness](reports/lighthouse/entrenadores-fitness.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00163 |
| [/espacios](reports/lighthouse/espacios.html) | 100 | 100 | 100 | 100 | 1.36 s | 0.00001 |
| [/eventos-formaciones](reports/lighthouse/eventos-formaciones.html) | 99 | 100 | 100 | 100 | 0.76 s | 0.00141 |
| [/guias/despacho-por-horas-o-local](reports/lighthouse/guias-despacho-por-horas-o-local.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00001 |
| [/guias](reports/lighthouse/guias.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00000 |
| [/guias/junta-propietarios-mao](reports/lighthouse/guias-junta-propietarios-mao.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00001 |
| [/guias/presentacion-producto-mao](reports/lighthouse/guias-presentacion-producto-mao.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00000 |
| [/](reports/lighthouse/inicio.html) | 100 | 100 | 100 | 100 | 1.66 s | 0.00094 |
| [/preguntas-frecuentes](reports/lighthouse/preguntas-frecuentes.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00057 |
| [/presupuesto](reports/lighthouse/presupuesto.html) | 100 | 100 | 100 | 100 | 1.01 s | 0.00001 |
| [/profesionales](reports/lighthouse/profesionales.html) | 100 | 100 | 100 | 100 | 1.51 s | 0.00163 |
| [/reservar](reports/lighthouse/reservar.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00000 |
| [/reuniones-empresas](reports/lighthouse/reuniones-empresas.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00163 |
| [/tarifas](reports/lighthouse/tarifas.html) | 100 | 100 | 100 | 100 | 0.76 s | 0.00000 |

LCP máximo: **1.66 s**. CLS máximo: **0.00163**. TBT máximo: **105 ms**. Son medidas de laboratorio; INP y Core Web Vitals de campo requieren tráfico real.

Las páginas legales y el 404 llevan `noindex` de forma deliberada y se excluyen de la puntuación SEO comercial. Sí están incluidas en la comprobación de enlaces, HTML y metadatos. El detalle técnico completo, junto a entorno y fecha de cada medición, está en los JSON de `reports/lighthouse/`.

## Revisión visual

- Home completa en escritorio de 1350 px y móvil de 412 px.
- Landings de despacho y eventos en móvil, con tarifa y acceso a disponibilidad en el primer bloque.
- Presupuesto a 412 y 320 px: campos, opciones, validación preparada y barra persistente sin desbordamiento horizontal en las capturas.
- Imágenes OG de marca en 1200×630.
- Se corrigieron la alineación de la calculadora, repetición de copy, posición de la leyenda del mapa y nombre accesible del logo.

Capturas: [home escritorio](reports/inicio-desktop.jpg), [home móvil](reports/lighthouse/inicio-mobile.jpg), [presupuesto 320 px](reports/presupuesto-320.jpg).

## Estructura y datos

`scripts/verify.mjs` comprueba:

- Un H1, idioma y landmark principal por página.
- Títulos únicos de hasta 60 caracteres y descripciones únicas de hasta 155.
- Canonicals del dominio, imágenes OG existentes, dimensiones y alt de imágenes.
- Enlaces internos, assets y destinos de anclas; seguridad de enlaces a nuevas pestañas.
- JSON-LD parseable, Organization, WebSite y LocalBusiness; coherencia del teléfono y código postal.
- FAQ del schema idénticas al contenido visible, precios positivos y ofertas en EUR con IVA excluido.
- Ausencia de Plaza Miranda en HTML, JavaScript público, JSON y XML. Su URL devuelve 404.
- Sitemap con 16 rutas indexables; exclusión de legales y 404.

El resultado está en [structure.json](reports/structure.json). Esta validación local comprueba sintaxis, estructura y coherencia; **no es una certificación externa de Google Rich Results ni una garantía de resultados enriquecidos**. La validación con URLs públicas queda para el despliegue.

## Flujos de interacción

Las 14 pruebas de `scripts/interactions.mjs` ejecutan el código real del cliente sobre documentos compilados, usando JSDOM y red simulada:

1. Menú móvil, Escape y retorno de foco.
2. Calculadora: coste, diferencia y rechazo de horas inválidas.
3. Selección de espacio desde URL y cambio de enlaces Cobot/WhatsApp.
4. Espacio desconocido u oculto: selección segura del despacho.
5. Obligatorios y privacidad del presupuesto.
6. Aforos: 24 con mesas y 70 en auditorio.
7. Correo inválido, fecha pasada y domingo.
8. Mensaje WhatsApp codificado, sin envío ni ejecución de HTML.
9. Honeypot que impide la petición saliente.
10. Éxito de formulario únicamente después de respuesta HTTP correcta.
11. Fallo HTTP: recuperación y conservación de los datos en el formulario.
12. Google Maps ausente hasta aceptar las cookies opcionales y bloqueado al rechazarlas.
13. Banner y bloqueo de mapas operativos aunque Umami todavía no tenga identificador.
14. Umami configurado: rechazo sin carga y aceptación sin duplicar el script.

Resultado: [interactions.json](reports/interactions.json). No se han enviado mensajes a Fran, creado reservas, realizado pagos ni transmitido formularios reales.

## Límites y comprobación de lanzamiento

La herramienta de interacción con el navegador conectado falló al ejecutar las acciones. La inspección visual se realizó con capturas de Chrome obtenidas por Lighthouse; los flujos se verificaron en DOM aislado. No se afirma una prueba manual completa en todos los navegadores, dispositivos físicos o lectores de pantalla.

Queda por comprobar con las cuentas reales: recurso y pago de Cobot, proveedor de formulario si se activa, condiciones de acceso/cancelación y medición después de consentimiento en el hosting final. Los borradores legales necesitan datos y revisión; logo, fotos de salas y sello se sustituyen cuando lleguen los originales. Lista completa en [PENDIENTES.md](PENDIENTES.md).

No se presenta Lighthouse 100 como garantía permanente: depende del dispositivo, red, hosting y cambios futuros. La cifra 99 de eventos es el resultado observado en la última pasada completa.
