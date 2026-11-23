# Decisiones de diseño e implementación

## Concepto: «Tu espacio. A tu ritmo.»

La idea reúne tres usos bajo una misma promesa: tener un lugar profesional cuando lo necesitas. La home empieza por esa libertad, orienta por intención y después muestra el espacio, la manera de reservar y las personas detrás del negocio. No parte de una lista de instalaciones ni compite con hoteles mediante precios ajenos inventados.

## Sistema visual

Blanco como fondo principal, crema para pausas y servicios incluidos, oliva para decisiones y bloques de marca. Oliva profundo para texto y oro solo en detalles decorativos. Syncopate Bold en titulares cortos y Poppins para el resto, alojadas localmente en subset latino. Cabecera contenida, retícula editorial, bordes finos, mucho espacio, números de sección y un cubo que conecta todos los soportes.

El hero combina una fotografía auténtica del despacho y una nota editorial oliva. Las salas sin fotografías confirmadas se representan con composiciones SVG/CSS de marca, nunca con interiores ficticios. La comunidad se apoya en la ocupación de los despachos permanentes, una prueba real; no hay testimonios simulados.

Se usan hover/foco, estados de formulario, menú accesible y transiciones de navegación CSS nativas. No hay carrusel, vídeo automático, cursor personalizado invasivo ni animación de entrada que retrase el contenido principal. Se respeta la preferencia de movimiento reducido.

## Conversión por intención

- **Profesionales:** privacidad, precio y reserva; casos de atención a clientes y una calculadora con costes alternativos aportados por el visitante.
- **Reuniones:** trabajo de equipos y juntas de 4–24 personas con mesas. Se explica que es la misma sala de eventos. Copy, H1 y FAQ propios.
- **Eventos:** actos y presentaciones hasta 70 asistentes. Presupuesto destacado por su valor comercial; reserva directa como segunda vía. Catering y servicios separados de la tarifa base.
- **Fitness:** material y uso exclusivo. Entrenamiento personal, yoga y pilates suelo; uso recurrente y difusión de clases como conversación con Fran.

Tarifa y acceso a disponibilidad están en la primera sección de cada landing. La cabecera mantiene la reserva en escritorio y una barra inferior ofrece reserva y WhatsApp en móvil. Los mensajes de WhatsApp cambian según espacio. El presupuesto pide solo datos útiles y deja opcionales los que no siempre se conocen.

## Integraciones honestas

Se verificaron la web oficial y Cobot. El enlace general de salas existe; no hay recursos individuales verificables en la vista pública consultada. La arquitectura permite configurarlos sin cambiar componentes. No se muestra un calendario falso ni se afirma disponibilidad en tiempo real.

Sin endpoint de formularios, la solicitud se prepara en el navegador y solo se envía cuando el visitante lo hace en WhatsApp. Con endpoint, el éxito depende de una respuesta HTTP correcta. Las pruebas de envío usan respuestas simuladas y no contactan a Fran.

El mapa y la etiqueta de Umami no se descargan al entrar. Ambos dependen del consentimiento de cookies opcionales: al aceptar se cargan automáticamente; al rechazar, el mapa se sustituye por un aviso. Las páginas legales son borradores marcados y no indexables, pendientes de datos reales y revisión.

## SEO, datos y rendimiento

Rutas del estudio conservadas. Títulos y descripciones únicos, canonical, sitemap, robots, Open Graph de 1200×630 por página y JSON-LD coherente con lo visible. Datos locales compartidos; ofertas por espacio con IVA excluido explícitamente, FAQ y breadcrumbs. Tres guías con intención informativa y enlaces a reserva o presupuesto.

Precios centralizados y copy resuelto mediante tokens. Zod valida datos; Astro genera HTML estático. Sin React ni dependencias de UI en cliente. Fotografías responsivas WebP, tipografías precargadas y JavaScript limitado a interacciones concretas.

Plaza Miranda se filtra antes de generar cualquier salida pública. Los idiomas pendientes no producen páginas vacías. Las futuras reseñas y el sello solo aparecen al activarse con contenido verificado.

## Alcance de los documentos

Los archivos adjuntos se han tratado como información del proyecto y propuesta de requisitos. No se han ejecutado las acciones ajenas al encargo web que aparecen en los documentos: campañas de Instagram, firma de correo, acceso a Odoo/WordPress, correos a Cámara o publicaciones externas. El prompt pide un proyecto Astro y preparación de despliegue; se entrega en el directorio local, sin modificar la web existente.
