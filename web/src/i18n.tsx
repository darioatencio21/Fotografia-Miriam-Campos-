import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

export type Lang = 'en' | 'es';

const en = {
  skipLink: 'Skip to content',
  loadError:
    'We could not reach the server. Check that the API is running and try reloading the page.',
  nav: {
    about: 'About me',
    services: 'Services',
    gallery: 'Gallery',
    testimonials: 'Testimonials',
  },
  bookCta: 'Book your session',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  langLabel: 'Language',
  mainNavAria: 'Main navigation',
  hero: {
    eyebrow: 'Lifestyle photography · golden hour',
    titleItalic: 'Creating memories',
    titleMain: 'that last a lifetime',
    sub: 'pictures are a photographer\'s means of expression as a writer\'s means are words. — Moonshine',
    viewGallery: 'View gallery',
    travel: 'Available to travel',
  },
  welcome: {
    eyebrow: "So glad you're here",
    titlePre: 'If you chase sunsets too, ',
    titleEm: "we're going to get along great.",
    text: 'We can catch the light in the mountains, out in the country or by the water; you choose the scenery. I arrive early to scout every corner and stay until the sky turns beautiful. Just bring the people you love and leave the rest to me.',
  },
  about: {
    eyebrow: 'Meet the photographer',
    portraitAlt: 'Portrait of Miriam Tellez at sunset',
    titlePre: "Hi there, I'm ",
    titleEm: 'Miriam',
    p1: "I'm a lifestyle photographer: I specialize in capturing people exactly as they are, bathed in that warm light that only shows up for a little while each day. It started with my mom's camera chasing sunsets, and I never stopped.",
    p2: 'Today I walk beside families, couples and moms-to-be through their most important chapters. I like to direct just enough — enough that you feel confident, little enough that everything stays real. In the end, that is what it is all about: photos that smell like that day.',
    points: [
      'Guided sessions with no awkward posing',
      'Locations chosen around the best light of every hour',
      'Photos edited by hand, one by one',
    ],
    cta: "Let's talk about your session",
  },
  statsBandLabel: 'Experience in numbers',
  services: {
    eyebrow: 'My services',
    titlePre: 'Choose how you want to ',
    titleEm: 'remember it',
    priceFrom: 'From',
    book: 'Book',
    scarcity: 'Limited weekend slots per season',
    viewAll: 'See more services',
  },
  gallery: {
    eyebrow: 'Gallery',
    titlePre: 'Moments already ',
    titleEm: 'kept',
    filtersLabel: 'Filter gallery by category',
    all: 'All',
    empty: 'There are no photos in this category yet. More coming soon.',
    close: 'Close full screen view',
    prev: 'Previous photo',
    next: 'Next photo',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    titlePre: 'Words from families who ',
    titleEm: 'keep coming back',
    starsAria: '{n} out of 5 stars',
  },
  insta: {
    eyebrow: 'Behind the scenes',
    titlePre: 'Follow the light on ',
    button: 'Open Instagram',
  },
  contact: {
    eyebrow: 'Contact',
    titlePre: 'Shall we meet at ',
    titleEm: 'golden hour',
    titleEnd: '?',
    intro:
      'Tell me which moment you want to keep and I will happily help you plan it. I reply within 24 hours.',
    email: 'Email',
    phone: 'Phone',
    area: 'Area',
    areaValue: 'Porterville, CA — available to travel',
    name: 'Full name *',
    namePlaceholder: 'Your name',
    emailField: 'Email *',
    emailPlaceholder: 'you@email.com',
    phoneField: 'Phone',
    phonePlaceholder: '+1 (000) 000-0000',
    date: 'Preferred date',
    sessionType: 'Session type *',
    chooseOption: 'Choose an option',
    other: 'Other',
    message: 'Message *',
    messagePlaceholder: "Tell me about your session: who's coming, where you dream of doing it…",
    submit: 'Send request',
    sending: 'Sending…',
    replyNote: 'I reply within 24 hours — no obligation, let’s just chat about your idea.',
    successTitle: 'Request received!',
    successText:
      'Thanks for reaching out. I will reply very soon to the email you left to schedule your session.',
    sendAnother: 'Send another request',
    errName: 'Please write your full name (2–25 characters).',
    errEmail: 'That email does not look right (max 30 characters).',
    errPhone: 'Enter a valid US phone number (10 digits, optional +1).',
    errPhoneRequired: 'Please enter your phone number.',
    errSession: 'Pick a session type.',
    errMessage: 'Tell me a bit more in your message (10–150 characters).',
    errDateRequired: 'Please select a preferred date.',
    genericError: 'We could not send your message. Please try again.',
    dateTaken: 'Heads up: that date is already taken. Please choose another day if you can.',
    termsSummary:
      'By sending this request you acknowledge the terms and conditions of service:',
    termsDeposit: 'A 30% deposit is required to confirm your session.',
    termsTravel:
      'Travel and lodging expenses for distant locations are the client\'s responsibility.',
    termsCancel:
      'Cancellations must be made at least 48 hours in advance; otherwise the deposit is forfeited.',
    termsReschedule:
      'You may reschedule once at no cost with at least 48 hours\' notice.',
    termsCheckbox: 'I have read and accept the terms and conditions *',
    errTerms: 'You must accept the terms and conditions to continue.',
    termsLink: 'Read full terms and conditions',
  },
  footer: {
    eyebrow: 'One last thing',
    bigA: 'Perfect light does not last long.',
    bigB: "Let's save it together.",
    navigate: 'Navigate',
    igEyebrow: 'Follow the light',
    writeMe: 'Write me',
    tagline: 'Lifestyle photography at golden hour. Porterville, CA — available to travel.',
    rightsTemplate: '{year} Miriam Tellez · All rights reserved',
    madeWith: 'Made with sunset light',
  },

  faq: {
    eyebrow: 'Frequent questions',
    titlePre: 'Everything you want to know ',
    titleEm: 'before the light',
    items: [
      {
        q: 'What should we wear?',
        a: "Earth tones and soft fabrics photograph beautifully at sunset. Avoid big logos and neon colors. After you book I'll send you a short style guide for your session type.",
      },
      {
        q: 'How many photos do we get, and when?',
        a: 'Between 50 and 400+ edited photos depending on your session (each service lists the exact amount). You receive a private online gallery within 2 weeks — 4 weeks for weddings.',
      },
      {
        q: 'Where do sessions take place?',
        a: "Around Porterville and California's Central Valley: open fields, parks, lakeside spots… I suggest locations based on the season and the golden-hour light. I am available to travel too.",
      },
      {
        q: "What if my kids don't cooperate?",
        a: "That's part of the plan! Sessions are playful and free of long poses. We play, we walk and we let moments happen — the best photos usually come out of beautiful chaos.",
      },
      {
        q: 'How do I book my date?',
        a: "Send your request through the contact form and I will confirm availability within 24 hours. A 30% deposit saves your date; the balance is due the day of the session. Travel and lodging costs for distant locations are the client's responsibility.",
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro:
      'Please read the following terms carefully before booking a session with Miriam Tellez Photography.',
    s1Title: '1. Deposit & Payment',
    s1:
      'A 30% deposit is required to confirm and reserve your session date. The remaining 70% is due on the day of the session, before or during the shoot. Deposits can be paid via Zelle, Venmo, or cash.',
    s2Title: '2. Travel & Lodging',
    s2:
      'Sessions located outside the Porterville, CA area may require travel and/or lodging expenses. These costs are the sole responsibility of the client and will be quoted in advance before confirming the booking.',
    s3Title: '3. Cancellation Policy',
    s3:
      'Cancellations must be made at least 48 hours before the scheduled session. If a cancellation is made within 48 hours of the session, the 30% deposit will be forfeited and is non-refundable.',
    s4Title: '4. Rescheduling',
    s4:
      'You may reschedule your session once at no additional cost, provided you give at least 48 hours\' notice. Additional reschedules may be subject to a new deposit.',
    s5Title: '5. No-Show',
    s5:
      'If the client does not show up to the scheduled session without prior notice, the full deposit will be forfeited.',
    s6Title: '6. Delivery',
    s6:
      'Edited photos are delivered via a private online gallery within 2 weeks of the session (4 weeks for weddings and large events). The gallery link remains active for 30 days.',
    s7Title: '7. Usage Rights',
    s7:
      'The client receives a personal, non-commercial license to print and share the delivered photos. Miriam Tellez Photography retains the right to use images for portfolio, social media, and marketing purposes unless the client requests otherwise in writing.',
    s8Title: '8. Liability',
    s8:
      'In the unlikely event of equipment failure or unforeseen circumstances that prevent the session from taking place, a full refund of the deposit will be issued or the session will be rescheduled at no cost.',
    back: '← Back to site',
  },
  review: {
    formTitle: 'Share your experience',
    formIntro: 'Lived a session with Miriam? Your words help other families decide.',
    yourName: 'Your name *',
    namePlaceholder: 'The name you want shown',
    ratingLabel: 'Your rating *',
    yourQuote: 'Your experience *',
    quotePlaceholder: 'How did you feel during your session? What did the photos make you feel?',
    submitReview: 'Send review',
    sendingReview: 'Sending…',
    thanksTitle: 'Thank you so much!',
    thanksText: 'Your review was received and will appear here very soon.',
    anotherReview: 'Write another review',
    toggleOpen: 'Leave your review',
    toggleClose: 'Close form',
    errAuthor: 'Write your name (2–30 characters).',
    errQuote: 'Tell us a bit more about your experience (15–300 characters).',
    errRating: 'Choose a rating from 1 to 5 stars.',
    genericError: 'We could not send your review. Please try again.',
  },
  admin: {
    brand: 'Miriam Tellez · Panel',
    loginTitle: 'Session requests',
    loginHint: 'Enter your admin passphrase.',
    passwordPlaceholder: 'Password',
    enter: 'Enter',
    checking: 'Verifying…',
    backToSite: '← Back to site',
    loading: 'Loading…',
    viewSite: 'View site',
    logout: 'Log out',
    navAria: 'Panel sections',
    views: {
      solicitudes: '📋 Requests',
      resenas: '★ Reviews',
      fotos: '📷 Photos',
    },
    calAria: 'Sessions calendar',
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    today: 'Today',
    legendAccepted: 'accepted',
    legendPending: 'pending',
    showing: 'Showing',
    seeAll: '(see all)',
    dayTitle: '{a} accepted, {p} pending',
    tabsAria: 'Filter requests',
    fAll: 'All',
    fPending: 'Pending',
    fAccepted: 'Accepted',
    fDeclined: 'Declined',
    typeFilterAria: 'Filter by session type',
    fSessionAll: 'All session types',
    sumReceived: 'Received',
    sumRate: 'Acceptance rate',
    sumConfirmed: 'Confirmed sessions',
    dayPanelFor: 'Sessions on',
    dayPanelClose: 'Close day detail',
    refresh: '↻ Refresh',
    excelTitle: 'Download all requests to open in Excel or Google Sheets',
    excelBtn: 'Download Excel',
    excelCount: '{n} requests',
    statusLabels: {
      pending: 'Pending',
      accepted: 'Accepted',
      declined: 'Declined',
    },
    flashAccepted: 'Request accepted. The confirmation was emailed to the client.',
    flashDeclined: 'Request declined. The notice was emailed to the client.',
    errLoadInquiries: 'Requests could not be loaded.',
    errUpdate: 'Could not update.',
    errExcel: 'The Excel file could not be downloaded.',
    emptyInquiries: 'No requests here yet.',
    confirmAccept: "Accept {name}'s session{when}? A confirmation email will be sent.",
    forDate: ' for ',
    contactBtn: '✉ Contact',
    acceptBtn: '✓ Accept',
    rejectBtn: '✕ Reject / date taken',
    contactSubject: 'About your request',
    yourReply: 'Your reply:',
    rejectLabel: 'Message for the client (sent by email):',
    rejectPlaceholder:
      'E.g.: Hi! That date is already booked. Would Saturday afternoon work for you?',
    sendReject: 'Send rejection with message',
    sendingShort: 'Sending…',
    cancel: 'Cancel',
    revPendingTitle: 'Awaiting approval ({n})',
    revPublishedTitle: 'Published ({n})',
    publish: '✓ Publish',
    discard: '🗑 Discard',
    hideFromSite: 'Hide from site',
    revPublishedFlash: 'Review by {name} published.',
    revHiddenFlash: 'Review by {name} hidden from the site.',
    revDiscardedFlash: 'Review discarded.',
    confirmDiscard: "Discard {name}'s review? This cannot be undone.",
    revEmpty: 'No published reviews yet.',
    errLoadReviews: 'Reviews could not be loaded.',
    errReviewAction: 'The action could not be completed.',
    uploadTitle: 'Upload new photo',
    categoryLabel: 'Category *',
    orientationLabel: 'Orientation (auto-detected)',
    portrait: 'Portrait',
    landscape: 'Landscape',
    descEs: 'Description (ES) *',
    descEn: 'Description (EN)',
    phAltEs: 'E.g.: Family hugging by the lake at sunset',
    phAltEn: 'Same as above if left empty',
    fileLabel: 'File * (JPG, PNG or WebP · max 12 MB · auto-optimized to WebP)',
    previewAlt: 'Preview',
    uploadBtn: '⬆ Upload photo',
    uploading: 'Uploading…',
    galleryTitle: 'Current gallery ({n})',
    errPickFile: 'Choose a photo first.',
    errPickCat: 'Select a category.',
    errPickAlt: 'Describe the photo (min 3 characters).',
    uploadedFlash: 'Photo added to the gallery ({cat}).',
    deletedFlash: 'Photo deleted.',
    delConfirm: 'Delete this photo from "{cat}"? The file will also be deleted.',
    delAria: 'Delete {alt}',
    errCats: 'Categories could not be loaded.',
    errUpload: 'The photo could not be uploaded.',
    errDeletePhoto: 'Could not delete.',
  },
};

export type Dictionary = typeof en;

const es: Dictionary = {
  skipLink: 'Saltar al contenido',
  loadError:
    'No pudimos conectar con el servidor. Verifica que la API esté corriendo e intenta recargar la página.',
  nav: {
    about: 'Sobre mí',
    services: 'Servicios',
    gallery: 'Galería',
    testimonials: 'Testimonios',
  },
  bookCta: 'Reserva tu sesión',
  openMenu: 'Abrir menú',
  closeMenu: 'Cerrar menú',
  langLabel: 'Idioma',
  mainNavAria: 'Navegación principal',
  hero: {
    eyebrow: 'Fotografía lifestyle · hora dorada',
    titleItalic: 'Creando recuerdos',
    titleMain: 'que duran toda la vida',
    sub: 'las fotos son el medio de expresión del fotógrafo, como las palabras lo son del escritor. — Moonshine',
    viewGallery: 'Ver galería',
    travel: 'Disponible para viajar',
  },
  welcome: {
    eyebrow: 'Qué alegría que estés aquí',
    titlePre: 'Si tú también persigues atardeceres, ',
    titleEm: 'vamos a llevarnos muy bien.',
    text: 'Podemos atrapar la luz en la montaña, en el campo o junto al agua; tú eliges el escenario. Yo llego antes para conocer cada rincón y me quedo hasta que el cielo se ponga bonito. Solo trae a las personas que quieres y yo me encargo del resto.',
  },
  about: {
    eyebrow: 'Conoce a la fotógrafa',
    portraitAlt: 'Retrato de Miriam Tellez al atardecer',
    titlePre: 'Hola, soy ',
    titleEm: 'Miriam',
    p1: 'Soy fotógrafa lifestyle: especialista en capturar a las personas tal como son, bañadas por esa luz cálida que solo existe un rato cada día. Empecé con la cámara de mi mamá persiguiendo atardeceres y nunca dejé de perseguirlos.',
    p2: 'Hoy acompaño a familias, parejas y futuras mamás en sus capítulos más importantes. Me gusta dirigir lo justo — suficiente para que te sientas seguro, poco para que todo siga siendo real. Al final, de eso se trata: fotos que huelen a ese día.',
    points: [
      'Sesiones guiadas sin poses incómodas',
      'Ubicaciones elegidas según la luz de cada hora',
      'Fotos editadas a mano, una por una',
    ],
    cta: 'Hablemos de tu sesión',
  },
  statsBandLabel: 'Experiencia en números',
  services: {
    eyebrow: 'Mis servicios',
    titlePre: 'Elige cómo quieres ',
    titleEm: 'recordarlo',
    priceFrom: 'Desde',
    book: 'Reservar',
    scarcity: 'Cupos de fin de semana limitados por temporada',
    viewAll: 'Ver más servicios',
  },
  gallery: {
    eyebrow: 'Galería',
    titlePre: 'Momentos ya ',
    titleEm: 'guardados',
    filtersLabel: 'Filtrar galería por categoría',
    all: 'Todas',
    empty: 'Aún no hay fotos en esta categoría. Muy pronto habrá más.',
    close: 'Cerrar vista a pantalla completa',
    prev: 'Foto anterior',
    next: 'Foto siguiente',
  },
  testimonials: {
    eyebrow: 'Testimonios',
    titlePre: 'Lo que dicen las familias que ',
    titleEm: 'volvieron',
    starsAria: '{n} de 5 estrellas',
  },
  insta: {
    eyebrow: 'El detrás de cámara',
    titlePre: 'Sigue la luz en ',
    button: 'Ir a Instagram',
  },
  contact: {
    eyebrow: 'Contacto',
    titlePre: '¿Nos vemos en la ',
    titleEm: 'hora dorada',
    titleEnd: '?',
    intro:
      'Cuéntame qué momento quieres guardar y con gusto te ayudo a planearlo. Respondo en menos de 24 horas.',
    email: 'Correo',
    phone: 'Teléfono',
    area: 'Zona',
    areaValue: 'Porterville, CA — disponible para viajar',
    name: 'Nombre completo *',
    namePlaceholder: 'Tu nombre',
    emailField: 'Correo *',
    emailPlaceholder: 'tucorreo@email.com',
    phoneField: 'Teléfono',
    phonePlaceholder: '+1 (000) 000-0000',
    date: 'Fecha tentativa',
    sessionType: 'Tipo de sesión *',
    chooseOption: 'Elige una opción',
    other: 'Otro',
    message: 'Mensaje *',
    messagePlaceholder: 'Cuéntame sobre tu sesión: quiénes son, dónde sueñas hacerla…',
    submit: 'Enviar solicitud',
    sending: 'Enviando…',
    replyNote: 'Respondo en menos de 24 horas — sin compromiso; hablemos de tu idea.',
    successTitle: '¡Solicitud recibida!',
    successText:
      'Gracias por escribirme. Te voy a responder muy pronto al correo que dejaste para agendar tu sesión.',
    sendAnother: 'Enviar otra solicitud',
    errName: 'Escribe tu nombre completo (2–25 caracteres).',
    errEmail: 'El correo no parece válido (máximo 30 caracteres).',
    errPhone: 'Ingresa un teléfono válido de EE.UU. (10 dígitos, +1 opcional).',
    errPhoneRequired: 'Ingresa tu número de teléfono.',
    errSession: 'Selecciona el tipo de sesión.',
    errMessage: 'Cuéntame un poco más en tu mensaje (10–150 caracteres).',
    errDateRequired: 'Selecciona una fecha tentativa.',
    genericError: 'No pudimos enviar tu mensaje. Intenta de nuevo.',
    dateTaken: 'Ojo: esa fecha ya está reservada. Elige otro día si puedes.',
    termsSummary:
      'Al enviar esta solicitud aceptas los términos y condiciones del servicio:',
    termsDeposit: 'Se requiere un anticipo del 30% para confirmar tu sesión.',
    termsTravel:
      'Los gastos de traslado y hospedaje en ubicaciones lejanas van por cuenta del cliente.',
    termsCancel:
      'Las cancelaciones deben hacerse con al menos 48 horas de anticipación; de lo contrario se pierde el anticipo.',
    termsReschedule:
      'Puedes reprogramar una vez sin costo con al menos 48 horas de anticipación.',
    termsCheckbox: 'He leído y acepto los términos y condiciones *',
    errTerms: 'Debes aceptar los términos y condiciones para continuar.',
    termsLink: 'Leer términos y condiciones completos',
  },
  footer: {
    eyebrow: 'Una última cosa',
    bigA: 'La luz perfecta dura poco.',
    bigB: 'Guardémosla juntos.',
    navigate: 'Navega',
    igEyebrow: 'Sigue la luz',
    writeMe: 'Escríbeme',
    tagline: 'Fotografía lifestyle en hora dorada. Porterville, CA — disponible para viajar.',
    rightsTemplate: '{year} Miriam Tellez · Todos los derechos reservados',
    madeWith: 'Hecho con luz de atardecer',
  },

  faq: {
    eyebrow: 'Preguntas frecuentes',
    titlePre: 'Todo lo que quieres saber ',
    titleEm: 'antes de la luz',
    items: [
      {
        q: '¿Qué ropa usamos?',
        a: 'Los tonos tierra y las telas suaves fotogenian hermoso al atardecer. Evita logos grandes y colores neón. Al reservar te envío una guía breve de estilo según tu tipo de sesión.',
      },
      {
        q: '¿Cuántas fotos recibimos y cuándo?',
        a: 'Entre 50 y más de 400 fotos editadas según tu sesión (cada servicio indica la cantidad exacta). Recibes una galería online privada en 2 semanas — 4 semanas en bodas.',
      },
      {
        q: '¿Dónde se realizan las sesiones?',
        a: 'En Porterville y el Central Valley de California: campos abiertos, parques, orillas del lago… Sugiero ubicaciones según la temporada y la luz de la hora dorada. También estoy disponible para viajar.',
      },
      {
        q: '¿Y si mis hijos no cooperan?',
        a: '¡Eso también es parte del plan! Las sesiones son juguetonas y sin poses largas. Jugamos, caminamos y dejamos que los momentos pasen — las mejores fotos salen del caos bonito.',
      },
      {
        q: '¿Cómo reservo mi fecha?',
        a: 'Envía tu solicitud desde el formulario de contacto y confirmo disponibilidad en menos de 24 horas. Un anticipo del 30% aparta tu fecha; el resto se paga el día de la sesión. Los gastos de traslado y hospedaje en ubicaciones lejanas van por cuenta del cliente.',
      },
    ],
  },
  terms: {
    title: 'Términos y Condiciones',
    intro:
      'Por favor lee los siguientes términos con cuidado antes de reservar una sesión con Miriam Tellez Photography.',
    s1Title: '1. Anticipo y pago',
    s1:
      'Se requiere un anticipo del 30% para confirmar y apartar la fecha de tu sesión. El 70% restante se paga el día de la sesión, antes o durante la fotografía. Los anticipos pueden hacerse por Zelle, Venmo o efectivo.',
    s2Title: '2. Traslado y hospedaje',
    s2:
      'Las sesiones fuera del área de Porterville, CA pueden requerir gastos de traslado y/o hospedaje. Estos costos son responsabilidad del cliente y se cotizan por adelantado antes de confirmar la reserva.',
    s3Title: '3. Política de cancelación',
    s3:
      'Las cancelaciones deben hacerse con al menos 48 horas de anticipación a la sesión programada. Si se cancela dentro de las 48 horas anteriores, el anticipo del 30% se pierde y no es reembolsable.',
    s4Title: '4. Reprogramación',
    s4:
      'Puedes reprogramar tu sesión una vez sin costo adicional, siempre que avises con al menos 48 horas de anticipación. Reprogramaciones adicionales pueden requerir un nuevo anticipo.',
    s5Title: '5. No show',
    s5:
      'Si el cliente no se presenta a la sesión programada sin aviso previo, se pierde el anticipo completo.',
    s6Title: '6. Entrega',
    s6:
      'Las fotos editadas se entregan a través de una galería online privada dentro de 2 semanas de la sesión (4 semanas para bodas y eventos grandes). El enlace de la galería permanece activo por 30 días.',
    s7Title: '7. Derechos de uso',
    s7:
      'El cliente recibe una licencia personal y no comercial para imprimir y compartir las fotos entregadas. Miriam Tellez Photography se reserva el derecho de usar las imágenes para su portafolio, redes sociales y fines de marketing, a menos que el cliente solicite lo contrario por escrito.',
    s8Title: '8. Responsabilidad',
    s8:
      'En el improbable caso de una falla de equipo o circunstancias imprevistas que impidan la realización de la sesión, se emitirá un reembolso completo del anticipo o se reprogramará la sesión sin costo.',
    back: '← Volver al sitio',
  },
  review: {
    formTitle: 'Comparte tu experiencia',
    formIntro: '¿Viviste una sesión con Miriam? Tus palabras ayudan a otras familias a decidirse.',
    yourName: 'Tu nombre *',
    namePlaceholder: 'El nombre que quieres que se muestre',
    ratingLabel: 'Tu calificación *',
    yourQuote: 'Tu experiencia *',
    quotePlaceholder: '¿Cómo te sentiste durante tu sesión? ¿Qué te hicieron sentir las fotos?',
    submitReview: 'Enviar reseña',
    sendingReview: 'Enviando…',
    thanksTitle: '¡Muchas gracias!',
    thanksText: 'Recibimos tu reseña y muy pronto aparecerá aquí.',
    anotherReview: 'Escribir otra reseña',
    toggleOpen: 'Deja tu reseña',
    toggleClose: 'Cerrar formulario',
    errAuthor: 'Escribe tu nombre (2–30 caracteres).',
    errQuote: 'Cuéntanos un poco más de tu experiencia (15–300 caracteres).',
    errRating: 'Elige una calificación de 1 a 5 estrellas.',
    genericError: 'No pudimos enviar tu reseña. Intenta de nuevo.',
  },
  admin: {
    brand: 'Miriam Tellez · Panel',
    loginTitle: 'Solicitudes de sesión',
    loginHint: 'Ingresa tu clave de administradora.',
    passwordPlaceholder: 'Contraseña',
    enter: 'Entrar',
    checking: 'Verificando…',
    backToSite: '← Volver al sitio',
    loading: 'Cargando…',
    viewSite: 'Ver sitio',
    logout: 'Salir',
    navAria: 'Secciones del panel',
    views: {
      solicitudes: '📋 Solicitudes',
      resenas: '★ Reseñas',
      fotos: '📷 Fotos',
    },
    calAria: 'Calendario de sesiones',
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    today: 'Hoy',
    legendAccepted: 'aceptada',
    legendPending: 'pendiente',
    showing: 'Mostrando',
    seeAll: '(ver todas)',
    dayTitle: '{a} aceptada(s), {p} pendiente(s)',
    tabsAria: 'Filtrar solicitudes',
    fAll: 'Todas',
    fPending: 'Pendientes',
    fAccepted: 'Aceptadas',
    fDeclined: 'Rechazadas',
    typeFilterAria: 'Filtrar por tipo de sesión',
    fSessionAll: 'Todos los tipos',
    sumReceived: 'Recibidas',
    sumRate: 'Tasa de aceptación',
    sumConfirmed: 'Confirmadas',
    dayPanelFor: 'Sesiones del',
    dayPanelClose: 'Cerrar detalle del día',
    refresh: '↻ Actualizar',
    excelTitle: 'Descarga todas las solicitudes para abrir en Excel o Google Sheets',
    excelBtn: 'Descargar Excel',
    excelCount: '{n} solicitudes',
    statusLabels: {
      pending: 'Pendiente',
      accepted: 'Aceptada',
      declined: 'Rechazada',
    },
    flashAccepted: 'Solicitud aceptada. Se envió la confirmación al cliente.',
    flashDeclined: 'Solicitud rechazada. Se envió el aviso al cliente.',
    errLoadInquiries: 'No se pudieron cargar las solicitudes.',
    errUpdate: 'No se pudo actualizar.',
    errExcel: 'No se pudo descargar el Excel.',
    emptyInquiries: 'No hay solicitudes aquí por ahora.',
    confirmAccept: '¿Aceptar la sesión de {name}{when}? Se enviará el correo de confirmación.',
    forDate: ' para el ',
    contactBtn: '✉ Contactar',
    acceptBtn: '✓ Aceptar',
    rejectBtn: '✕ Rechazar / fecha ocupada',
    contactSubject: 'Sobre tu solicitud',
    yourReply: 'Tu respuesta:',
    rejectLabel: 'Mensaje para el cliente (se envía por correo):',
    rejectPlaceholder:
      'Ej.: Hola! Esa fecha ya está reservada. ¿Te funciona el sábado en la tarde?',
    sendReject: 'Enviar rechazo con mensaje',
    sendingShort: 'Enviando…',
    cancel: 'Cancelar',
    revPendingTitle: 'Pendientes de aprobar ({n})',
    revPublishedTitle: 'Publicadas ({n})',
    publish: '✓ Publicar',
    discard: '🗑 Descartar',
    hideFromSite: 'Ocultar del sitio',
    revPublishedFlash: 'Reseña de {name} publicada.',
    revHiddenFlash: 'Reseña de {name} ocultada del sitio.',
    revDiscardedFlash: 'Reseña descartada.',
    confirmDiscard: '¿Descartar la reseña de {name}? No se puede deshacer.',
    revEmpty: 'Todavía no hay reseñas publicadas.',
    errLoadReviews: 'No se pudieron cargar las reseñas.',
    errReviewAction: 'No se pudo completar la acción.',
    uploadTitle: 'Subir nueva foto',
    categoryLabel: 'Categoría *',
    orientationLabel: 'Orientación (detectada)',
    portrait: 'Vertical',
    landscape: 'Horizontal',
    descEs: 'Descripción (ES) *',
    descEn: 'Description (EN)',
    phAltEs: 'Ej.: Familia abrazada junto al lago al atardecer',
    phAltEn: 'Igual que arriba si no lo escribes',
    fileLabel: 'Archivo * (JPG, PNG o WebP · máx. 12 MB · se optimiza a WebP automáticamente)',
    previewAlt: 'Vista previa',
    uploadBtn: '⬆ Subir foto',
    uploading: 'Subiendo…',
    galleryTitle: 'Galería actual ({n})',
    errPickFile: 'Elige una foto primero.',
    errPickCat: 'Selecciona una categoría.',
    errPickAlt: 'Describe la foto (mínimo 3 caracteres).',
    uploadedFlash: 'Foto agregada a la galería ({cat}).',
    deletedFlash: 'Foto eliminada.',
    delConfirm: '¿Eliminar esta foto de "{cat}"? También se borra el archivo.',
    delAria: 'Eliminar {alt}',
    errCats: 'No se pudieron cargar las categorías.',
    errUpload: 'No se pudo subir la foto.',
    errDeletePhoto: 'No se pudo eliminar.',
  },
};

const DICTIONARIES: Record<Lang, Dictionary> = { en, es };

function initialLang(): Lang {
  try {
    const saved = window.localStorage.getItem('mc-lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    return 'en';
  }
  return 'en';
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem('mc-lang', lang);
    } catch {}
  }, [lang]);

  const setLang = (next: Lang) => setLangState(next);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang debe usarse dentro de LanguageProvider');
  return ctx;
}
