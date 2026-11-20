import { z } from 'zod';
import { resolveCopy } from './copy';
import { faqSchema } from './config';

const schema = z.object({
  slug: z.string(),
  space: z.string(),
  title: z.string(),
  description: z.string(),
  heading: z.string(),
  accent: z.string(),
  intro: z.string(),
  sectionTitle: z.string(),
  sectionIntro: z.string(),
  uses: z.array(z.object({ title: z.string(), text: z.string() })),
  faqs: z.array(faqSchema),
  related: z.string(),
  relatedText: z.string(),
});
export const landings = schema.array().parse(
  resolveCopy([
    {
      slug: 'profesionales',
      space: 'despacho',
      title: 'Alquiler de despacho por horas en Maó | Republikken',
      description:
        'Tu despacho privado en el centro de Maó desde {{precio_despacho}} €/h + IVA. Amueblado, sin permanencia y con todo incluido. Consulta disponibilidad.',
      heading: 'ALQUILER DE DESPACHO',
      accent: 'POR HORAS EN MAÓ.',
      intro:
        'Recibe a tus clientes en un espacio a la altura de lo que haces. Sin montar una oficina. Sin atarte a ella.',
      sectionTitle: 'Un despacho privado para trabajar y recibir clientes.',
      sectionIntro:
        'Para profesionales que trabajan con personas. Llegas, preparas tu próxima cita y cierras la puerta para concentrarte.',
      uses: [
        {
          title: 'Recibir a tus clientes',
          text: 'Abogacía, asesoría, arquitectura o gestión inmobiliaria. Un entorno profesional para reunirte con tus clientes en el centro de Maó.',
        },
        {
          title: 'Acompañar a otras personas',
          text: 'Coaching, orientación, asesoría de imagen y bienestar sin actividad sanitaria. Un despacho para tus sesiones individuales.',
        },
        {
          title: 'Trabajar cuando lo necesitas',
          text: 'Un proyecto en Menorca, una jornada de concentración o una entrevista. Reserva por horas o días, según tu agenda.',
        },
      ],
      faqs: [
        {
          question: '¿Cuánto cuesta alquilar un despacho por horas en Maó?',
          answer:
            'Desde {{precio_despacho}} €/hora + IVA, con limpieza, suministros y climatización incluidos. Si necesitas muchas horas, consulta una tarifa adaptada a tu uso.',
        },
        {
          question: '¿Es un despacho privado o una mesa en una zona compartida?',
          answer:
            'Es un despacho privado, cerrado y amueblado. Durante tu reserva lo utilizas tú. También puedes acceder a las zonas comunes del centro.',
        },
        {
          question: '¿Puedo alquilar una consulta por horas?',
          answer:
            'Puedes realizar coaching, orientación o servicios de belleza y bienestar que no requieran autorización sanitaria. No se permiten consultas clínicas, fisioterapia ni tratamientos con aparatología médica.',
        },
        {
          question: '¿Puedo reservar una oficina por un día?',
          answer:
            'Sí. Puedes reservar el despacho por horas o por días. Consulta las franjas disponibles y pide una propuesta si vas a venir con regularidad.',
        },
      ],
      related: '/reuniones-empresas',
      relatedText: '¿Vienes con tu equipo? Descubre la sala de reuniones.',
    },
    {
      slug: 'eventos-formaciones',
      space: 'eventos',
      title: 'Alquiler de sala para eventos en Maó | Republikken',
      description:
        'Sala de 85 m² para eventos y formaciones en Maó, hasta 70 personas. Desde {{precio_eventos}} €/h + IVA. Reserva o pide presupuesto con catering.',
      heading: 'ALQUILER DE SALA PARA EVENTOS',
      accent: 'Y FORMACIONES EN MAÓ.',
      intro:
        'Tú traes el producto, nosotros, el escenario. Para presentar, enseñar y reunir a quienes importan.',
      sectionTitle: 'Una sala para presentaciones, cursos y encuentros profesionales.',
      sectionIntro:
        'Una presentación de producto, una formación o una jornada profesional. Elige el formato y hablamos de todo lo que necesitas.',
      uses: [
        {
          title: 'Presentaciones de producto',
          text: 'Acerca tu marca a los profesionales de Menorca. Cosmética, estética, bienestar, alimentación o tecnología, con espacio para explicar y demostrar.',
        },
        {
          title: 'Cursos y formaciones',
          text: 'Hasta 24 personas con mesas para trabajar. Proyector, pantalla, altavoz y wifi para acompañar tu contenido.',
        },
        {
          title: 'Encuentros profesionales',
          text: 'Hasta 70 personas en formato auditorio para charlas, jornadas, presentaciones de libros y encuentros de asociaciones.',
        },
      ],
      faqs: [
        {
          question: '¿Cuántas personas caben en la sala?',
          answer:
            'La sala tiene 85 m² y admite hasta 70 personas en formato auditorio o 24 personas en formato taller con mesas. Acordamos la distribución según tu evento.',
        },
        {
          question: '¿Qué incluye el alquiler de la sala de eventos?',
          answer:
            'Proyector, pantalla, altavoz, wifi, limpieza, suministros y climatización. La sala no tiene luz natural y dispone de iluminación cuidada. Catering, montaje a medida y acompañamiento tienen presupuesto aparte.',
        },
        {
          question: '¿Podéis organizar el catering?',
          answer:
            'Sí. Tenemos catering propio, desde un coffee break hasta una comida completa. Indícanos asistentes, horarios y necesidades alimentarias al pedir presupuesto. Si quieres llevar catering externo, consúltalo antes con Fran.',
        },
        {
          question: '¿Puedo combinar la sala con otros espacios?',
          answer:
            'Sí. La sala de yoga contigua puede servir para recepción o demostraciones, y un despacho puede funcionar como sala auxiliar. Sujeto a disponibilidad y presupuesto.',
        },
      ],
      related: '/reuniones-empresas',
      relatedText: '¿Es una reunión de equipo o una junta? Encuentra tu formato.',
    },
    {
      slug: 'reuniones-empresas',
      space: 'eventos',
      title: 'Alquiler de sala de reuniones en Maó | Republikken',
      description:
        'Sala de reuniones y juntas en Maó para grupos de 4 a 24 personas. Desde {{precio_eventos}} €/h + IVA, con proyector y wifi. Consulta disponibilidad.',
      heading: 'ALQUILER DE SALA DE REUNIONES',
      accent: 'EN MAÓ.',
      intro:
        'Un lugar para juntar al equipo, recibir a un cliente o celebrar una junta de propietarios. Con tiempo para hablar.',
      sectionTitle: 'Una sala de reuniones para empresas y equipos.',
      sectionIntro:
        'La sala de eventos se adapta a reuniones de 4 a 24 personas con mesas. Cuéntanos cuántos venís y qué vais a trabajar.',
      uses: [
        {
          title: 'Equipos y proyectos',
          text: 'Planificación, entrevistas y sesiones de trabajo. Reúne a tu equipo en un espacio separado del día a día.',
        },
        {
          title: 'Juntas de propietarios',
          text: 'Un lugar céntrico para las juntas ordinarias y extraordinarias de tu comunidad, con espacio para revisar documentos y proyectar.',
        },
        {
          title: 'Reuniones con clientes',
          text: 'Presenta una propuesta, comparte una pantalla y dedica la reunión a avanzar. Puedes añadir un coffee break bajo presupuesto.',
        },
      ],
      faqs: [
        {
          question: '¿Puedo celebrar una junta de propietarios?',
          answer:
            'Sí. La sala admite reuniones y juntas de hasta 24 personas con mesas. Si la comunidad es más numerosa, podemos valorar el formato auditorio, hasta 70 asistentes.',
        },
        {
          question: '¿Cuál es el precio de la sala de reuniones por horas?',
          answer:
            'Desde {{precio_eventos}} €/hora + IVA. Incluye proyector, pantalla, altavoz, wifi, limpieza, suministros y climatización. El montaje a medida y el catering se presupuestan aparte.',
        },
        {
          question: '¿Es una sala diferente a la de eventos?',
          answer:
            'Es el mismo espacio físico de 85 m², preparado para tu reunión. En esta modalidad priorizamos el trabajo en torno a mesas y los grupos de 4 a 24 personas.',
        },
        {
          question: '¿Puedo pedir una factura o una propuesta para mi empresa?',
          answer:
            'Comenta con Fran los datos y necesidades de tu empresa al preparar la reserva. Para varias sesiones o servicios adicionales puedes solicitar un presupuesto a medida.',
        },
      ],
      related: '/eventos-formaciones',
      relatedText: '¿Organizas un acto con público? Descubre eventos y formaciones.',
    },
    {
      slug: 'entrenadores-fitness',
      space: 'fitness',
      title: 'Alquiler de sala de yoga y fitness en Maó | Republikken',
      description:
        'Sala privada de yoga, pilates y entrenamiento en Maó por {{precio_fitness}} €/h + IVA. Material incluido y uso exclusivo. Consulta tus horas.',
      heading: 'ALQUILER DE SALA DE YOGA Y FITNESS',
      accent: 'EN MAÓ.',
      intro: 'Céntrate en tus alumnos y tus clientes. El espacio y el material ya están aquí.',
      sectionTitle: 'Una sala equipada para yoga, pilates y entrenamiento personal.',
      sectionIntro:
        'Un espacio para trabajar el movimiento, con uso exclusivo durante tu reserva. Desde una sesión individual hasta tus clases regulares.',
      uses: [
        {
          title: 'Entrenamiento personal',
          text: 'Trabaja con un cliente o en pareja. Mancuernas, barras con peso y bandas elásticas para preparar tus sesiones funcionales.',
        },
        {
          title: 'Yoga y pilates suelo',
          text: 'Esterillas, bloques y material de pilates. Una sala para acompañar a tus alumnos sin transportar todo el equipo.',
        },
        {
          title: 'Tu entrenamiento privado',
          text: 'Reserva para entrenar a tu ritmo, solo o en grupo reducido. La sala es de uso exclusivo durante las horas contratadas.',
        },
      ],
      faqs: [
        {
          question: '¿Cuánto cuesta alquilar la sala de yoga o fitness?',
          answer:
            '{{precio_fitness}} €/hora + IVA. El precio incluye el uso privado de la sala, su material, limpieza, suministros y climatización. Para uso recurrente, consulta los descuentos por volumen.',
        },
        {
          question: '¿Qué material de entrenamiento hay?',
          answer:
            'Esterillas, bandas elásticas, mancuernas, barras con peso, bloques y material de pilates. Si necesitas una pieza o cantidad concreta, consúltalo con Fran antes de reservar.',
        },
        {
          question: '¿La sala se comparte con otras personas?',
          answer:
            'No. La reserva te da uso exclusivo de la sala durante las horas contratadas. Puedes entrenar solo, con tu entrenador o con tu grupo.',
        },
        {
          question: '¿Puedo dar clases de forma regular?',
          answer:
            'Sí. Consulta la disponibilidad de tus franjas y una tarifa por volumen. También puedes hablar con Fran sobre dar visibilidad a tus clases en la web y en el Instagram de Republikken.',
        },
      ],
      related: '/eventos-formaciones',
      relatedText: '¿Preparas un taller más grande? Conoce la sala de eventos.',
    },
  ]),
);
