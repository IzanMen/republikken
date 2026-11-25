// Textos legales facilitados por Fran (noviembre de 2026).
// Cada página guarda su contenido como HTML que se pinta dentro de `.prose`.

const email = '<a href="mailto:contacto@republikkenmao.com">contacto@republikkenmao.com</a>';
const updated = '<p class="legal-updated">Última actualización: noviembre de 2026</p>';

const avisoLegal = `
${updated}
<h2>1. Titular del sitio web</h2>
<p>En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI), te informamos de que este sitio web es titularidad de:</p>
<ul>
  <li><strong>Titular:</strong> Republikken C.B.</li>
  <li><strong>NIF:</strong> E72910722</li>
  <li><strong>Representante:</strong> Francisco Javier Castillo Ruiz</li>
  <li><strong>Domicilio:</strong> C/ Doctor Camps, 35, 07703 Maó (Illes Balears)</li>
  <li><strong>Correo electrónico:</strong> ${email}</li>
  <li><strong>Teléfono:</strong> <a href="tel:+34652505948">652 505 948</a></li>
  <li><strong>Actividad:</strong> alquiler por horas de despachos y salas para trabajo, reuniones, eventos, formación y actividad física.</li>
</ul>

<h2>2. Objeto y condiciones de uso</h2>
<p>Este sitio web informa sobre los espacios de Republikken Maó y permite consultar su disponibilidad, reservarlos y pedir presupuesto. Al usarlo, aceptas este aviso legal.</p>
<p>Te comprometes a hacer un uso adecuado del sitio y a no utilizarlo para actividades ilícitas, para dañar sus sistemas o para introducir virus o código malicioso.</p>
<p>Las reservas se realizan a través de la plataforma Cobot y se rigen por las condiciones de reserva y cancelación que se muestran antes de confirmar el pago.</p>

<h2>3. Precios</h2>
<p>Los precios publicados no incluyen IVA, salvo que se indique lo contrario. El importe total con impuestos se muestra en la plataforma de reservas antes de confirmar. Republikken C.B. puede actualizar los precios en cualquier momento; el precio aplicable es el vigente al confirmar la reserva.</p>

<h2>4. Propiedad intelectual e industrial</h2>
<p>Los contenidos de este sitio (textos, fotografías, vídeos, diseño, logotipos y la marca Republikken Maó) pertenecen a Republikken C.B. o a terceros que han autorizado su uso. No está permitido reproducirlos, distribuirlos ni transformarlos sin autorización previa y por escrito.</p>
<p>Los logotipos de clientes que aparecen en el sitio pertenecen a sus respectivos titulares y se muestran con su autorización.</p>

<h2>5. Enlaces</h2>
<p>Este sitio puede incluir enlaces a sitios de terceros (Cobot, WhatsApp, Instagram, Google Maps). Republikken C.B. no controla esos sitios ni responde de sus contenidos ni de sus políticas.</p>

<h2>6. Responsabilidad</h2>
<p>Republikken C.B. procura que la información del sitio sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni la disponibilidad ininterrumpida del sitio. No responde de los daños derivados de interrupciones técnicas ajenas a su control ni del uso indebido del sitio por parte de los usuarios.</p>

<h2>7. Protección de datos y cookies</h2>
<p>El tratamiento de tus datos personales se explica en la <a href="/privacidad">Política de privacidad</a>, y el uso de cookies, en la <a href="/cookies">Política de cookies</a>.</p>

<h2>8. Legislación aplicable y jurisdicción</h2>
<p>Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de Maó, salvo que seas consumidor, en cuyo caso serán competentes los de tu domicilio.</p>
`;

const privacidad = `
${updated}
<h2>1. Responsable del tratamiento</h2>
<ul>
  <li><strong>Responsable:</strong> Republikken C.B., NIF E72910722</li>
  <li><strong>Domicilio:</strong> C/ Doctor Camps, 35, 07703 Maó (Illes Balears)</li>
  <li><strong>Contacto para protección de datos:</strong> ${email} · <a href="tel:+34652505948">652 505 948</a></li>
</ul>

<h2>2. Qué datos tratamos, para qué y con qué base legal</h2>
<div class="legal-table">
  <table>
    <thead>
      <tr><th scope="col">Finalidad</th><th scope="col">Datos</th><th scope="col">Base legal</th><th scope="col">Conservación</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>Responder a consultas y solicitudes de presupuesto (formulario, WhatsApp, teléfono o correo)</td>
        <td>Nombre, empresa o proyecto, correo, teléfono y lo que nos cuentes de tu evento</td>
        <td>Aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD)</td>
        <td>Hasta resolver la consulta y, si no hay contratación, un máximo de 1 año</td>
      </tr>
      <tr>
        <td>Gestionar reservas, pagos y acceso a los espacios</td>
        <td>Datos de identificación y contacto, datos de la reserva y de facturación</td>
        <td>Ejecución del contrato (art. 6.1.b RGPD)</td>
        <td>Mientras dure la relación y después durante los plazos legales</td>
      </tr>
      <tr>
        <td>Facturación y obligaciones contables y fiscales</td>
        <td>Nombre o razón social, NIF, dirección, importes</td>
        <td>Obligación legal (art. 6.1.c RGPD)</td>
        <td>6 años (Código de Comercio) y plazos de la normativa tributaria</td>
      </tr>
      <tr>
        <td>Enviarte novedades y promociones de Republikken Maó por correo o WhatsApp</td>
        <td>Nombre, correo y teléfono</td>
        <td>Tu consentimiento (art. 6.1.a RGPD y art. 21 LSSI) o, si ya eres cliente, nuestro interés legítimo para servicios similares</td>
        <td>Hasta que te des de baja</td>
      </tr>
      <tr>
        <td>Publicar fotos y vídeos de eventos y del espacio en la web y en redes</td>
        <td>Imagen y voz</td>
        <td>Tu consentimiento (art. 6.1.a RGPD)</td>
        <td>Hasta que lo retires</td>
      </tr>
      <tr>
        <td>Publicar testimonios y logotipos de clientes</td>
        <td>Nombre o iniciales, actividad, opinión, logotipo</td>
        <td>Tu consentimiento (art. 6.1.a RGPD)</td>
        <td>Hasta que lo retires</td>
      </tr>
      <tr>
        <td>Medir el uso del sitio web</td>
        <td>Ver la <a href="/cookies">Política de cookies</a></td>
        <td>Tu consentimiento</td>
        <td>Ver la <a href="/cookies">Política de cookies</a></td>
      </tr>
    </tbody>
  </table>
</div>
<p>No tomamos decisiones automatizadas ni elaboramos perfiles con tus datos. Si nos facilitas datos de otras personas (por ejemplo, asistentes a un evento), debes haberles informado antes. No incluyas datos de salud ni otros datos sensibles en tus mensajes.</p>

<h2>3. Comunicaciones comerciales</h2>
<p>Solo te enviaremos novedades y promociones si nos has dado tu consentimiento o si ya eres cliente y se trata de servicios similares a los que contrataste. Puedes darte de baja en cualquier momento, gratis, con el enlace que incluye cada correo, respondiendo «BAJA» por WhatsApp o escribiendo a ${email}.</p>

<h2>4. Uso de la imagen en eventos</h2>
<p>En algunos eventos y actividades podemos hacer fotos o vídeos para mostrar el espacio en la web y en nuestras redes sociales.</p>
<ul>
  <li>Avisaremos antes de grabar o fotografiar, y priorizamos planos del espacio y de grupo en los que las personas no sean identificables.</li>
  <li>Solo publicaremos imágenes en las que se te pueda identificar si nos has dado tu consentimiento.</li>
  <li>Si organizas un evento en nuestras salas, te pedimos que informes a los asistentes de que puede haber fotografías.</li>
  <li>Si no quieres aparecer, dínoslo antes o durante el evento. Si ya se ha publicado una imagen tuya, puedes pedir que la retiremos y lo haremos lo antes posible.</li>
  <li>Las imágenes de menores solo se publican con autorización de sus padres o tutores.</li>
</ul>

<h2>5. Testimonios y logotipos de clientes</h2>
<p>Publicamos opiniones de clientes y logotipos de empresas que trabajan con nosotros solo con su autorización previa. Puedes pedir en cualquier momento que retiremos tu testimonio o tu logotipo escribiendo a ${email}.</p>

<h2>6. Destinatarios y encargados del tratamiento</h2>
<p>No cedemos tus datos a terceros, salvo obligación legal (por ejemplo, a la Agencia Tributaria). Para prestar el servicio trabajamos con proveedores que tratan datos por cuenta nuestra, con los contratos exigidos por el RGPD:</p>
<ul>
  <li><strong>Cobot:</strong> plataforma de reservas, pagos y facturación de los espacios. Los pagos se procesan a través de Stripe; Republikken no accede a los datos completos de tu tarjeta.</li>
  <li><strong>MBM Consulting Group, S.L.:</strong> gestión contable, fiscal y de facturación.</li>
  <li><strong>Proveedores de alojamiento web y de correo electrónico:</strong> almacenan la web y gestionan nuestro correo.</li>
  <li><strong>WhatsApp (Meta):</strong> cuando eliges contactarnos o enviar tu solicitud por WhatsApp.</li>
  <li><strong>Umami Analytics:</strong> medición agregada del uso de la web, sin cookies y solo si la aceptas.</li>
</ul>

<h2>7. Transferencias internacionales</h2>
<p>Algunos proveedores, como Meta (WhatsApp), Google (Google Maps) y Stripe, así como algunos proveedores de alojamiento, correo o analítica, pueden tratar datos fuera del Espacio Económico Europeo. En esos casos, la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo aprobadas por la Comisión Europea.</p>

<h2>8. Tus derechos</h2>
<p>Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar los consentimientos que hayas dado, sin que ello afecte a los tratamientos anteriores. Escríbenos a ${email} indicando qué derecho quieres ejercer. Si es necesario, te pediremos que acredites tu identidad.</p>
<p>Si consideras que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).</p>

<h2>9. Seguridad</h2>
<p>Aplicamos medidas técnicas y organizativas adecuadas para proteger tus datos frente a pérdida, acceso no autorizado o alteración.</p>

<h2>10. Cambios en esta política</h2>
<p>Podemos actualizar esta política para adaptarla a cambios legales o de nuestros servicios. Publicaremos siempre la versión vigente en esta página, con su fecha de actualización.</p>
`;

const cookies = `
${updated}
<h2>1. Qué son las cookies</h2>
<p>Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos que un sitio web guarda en tu dispositivo. Sirven para que la web funcione, para recordar tus preferencias o para medir cómo se usa.</p>

<h2>2. Quién las utiliza</h2>
<p>El responsable es Republikken C.B. (NIF E72910722). Algunas cookies las instalan terceros cuyos servicios usamos en la web, como se indica en la tabla.</p>

<h2>3. Cookies que utiliza esta web</h2>
<p><strong>Necesarias.</strong> Hacen que la web funcione y guardan tu elección sobre las cookies. No requieren consentimiento.</p>
<p><strong>Analíticas.</strong> Usamos Umami Analytics para conocer, de forma agregada, qué páginas se visitan, desde qué tipo de dispositivo y navegador, de dónde llegan las visitas y su ubicación aproximada. Umami no instala cookies ni nos permite identificarte, pero solo se activa si aceptas.</p>
<p><strong>De terceros (contenidos incrustados).</strong> El mapa de Google Maps puede usar cookies o almacenamiento propio de Google. Solo se carga si aceptas; si rechazas, verás en su lugar un aviso para aceptar las cookies, y al aceptarlas el mapa aparece automáticamente.</p>
<div class="legal-table">
  <table>
    <thead>
      <tr><th scope="col">Nombre</th><th scope="col">Proveedor</th><th scope="col">Tipo</th><th scope="col">Finalidad</th><th scope="col">Duración</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>republikken-consent-v1</td>
        <td>Republikken (propio)</td>
        <td>Necesario · almacenamiento local</td>
        <td>Guardar tu elección sobre las cookies</td>
        <td>Hasta que cambies tu elección o borres los datos del navegador</td>
      </tr>
      <tr>
        <td>Almacenamiento de sesión</td>
        <td>Republikken (propio)</td>
        <td>Necesario · almacenamiento de sesión</td>
        <td>Transición visual entre páginas</td>
        <td>Se borra al cerrar la pestaña</td>
      </tr>
      <tr>
        <td>Umami Analytics</td>
        <td>Umami</td>
        <td>Analítica · sin cookies</td>
        <td>Medición agregada de visitas</td>
        <td>No instala cookies</td>
      </tr>
      <tr>
        <td>Google Maps</td>
        <td>Google</td>
        <td>Terceros</td>
        <td>Mostrar el mapa incrustado</td>
        <td>Según la <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener noreferrer">política de cookies de Google</a></td>
      </tr>
    </tbody>
  </table>
</div>
<p>Las fuentes tipográficas se sirven desde la propia web. Los enlaces a Cobot, WhatsApp e Instagram solo te llevan a esos servicios cuando los pulsas; allí se aplican sus propias políticas.</p>

<h2>4. Cómo aceptar, rechazar o cambiar tu elección</h2>
<p>Al entrar en la web te mostramos un aviso para aceptar o rechazar las cookies que no son necesarias. Rechazar es tan fácil como aceptar, y la web funciona igual en ambos casos.</p>
<p>Puedes cambiar tu elección cuando quieras desde el enlace «Configurar cookies» del pie de página o con el botón de abajo. También puedes borrar o bloquear las cookies desde la configuración de tu navegador.</p>
`;

const cookiesUpdates = `
<h2>5. Actualizaciones</h2>
<p>Revisaremos esta política cuando cambien las cookies que usa la web. La versión vigente estará siempre en esta página.</p>
`;

export const legalPages = [
  {
    slug: 'aviso-legal',
    title: 'Aviso legal',
    description:
      'Titular, condiciones de uso, precios y propiedad intelectual del sitio web de Republikken Maó.',
    body: avisoLegal,
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    description:
      'Qué datos tratamos en Republikken Maó, para qué, con qué base legal, cuánto tiempo y cómo ejercer tus derechos.',
    body: privacidad,
  },
  {
    slug: 'cookies',
    title: 'Política de cookies',
    description:
      'Qué cookies y almacenamiento usa la web de Republikken Maó y cómo aceptar, rechazar o cambiar tu elección.',
    body: cookies,
    after: cookiesUpdates,
  },
];
