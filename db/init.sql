CREATE TABLE services (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  title_en text NOT NULL,
  tagline text NOT NULL,
  tagline_en text NOT NULL,
  description text NOT NULL,
  description_en text NOT NULL,
  image_url text NOT NULL,
  duration text NOT NULL,
  duration_en text NOT NULL,
  location_note text NOT NULL,
  location_note_en text NOT NULL,
  deliverables jsonb NOT NULL DEFAULT '{"es":[],"en":[]}',
  price_from integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE testimonials (
  id serial PRIMARY KEY,
  author text NOT NULL,
  session_type text NOT NULL,
  session_type_en text NOT NULL,
  quote text NOT NULL,
  quote_en text NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE gallery_categories (
  id serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  label text NOT NULL,
  label_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE photos (
  id serial PRIMARY KEY,
  category_id integer REFERENCES gallery_categories(id) ON DELETE CASCADE,
  src text NOT NULL,
  alt text NOT NULL,
  alt_en text NOT NULL,
  orientation text NOT NULL DEFAULT 'portrait',
  width integer,
  height integer,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE stats (
  id serial PRIMARY KEY,
  value text NOT NULL,
  label text NOT NULL,
  label_en text NOT NULL,
  description text NOT NULL,
  description_en text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

CREATE TABLE inquiries (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  session_type text NOT NULL,
  event_date date,
  message text NOT NULL,
  lang text NOT NULL DEFAULT 'es',
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO services (slug, title, title_en, tagline, tagline_en, description, description_en, image_url, duration, duration_en, location_note, location_note_en, deliverables, price_from, sort_order) VALUES
('maternidad', 'Maternidad', 'Maternity',
 'La espera, en su luz más suave.', 'Waiting, in its softest light.',
 'Una sesión tranquila y sin prisas para celebrar el vientre: caminamos despacio, hablamos del bebé y dejamos que la luz haga el resto. Ideal entre las semanas 28 y 34.',
 'A calm, unhurried session to celebrate your bump: we walk slowly, talk about the baby and let the light do the rest. Ideal between weeks 28 and 34.',
 '/images/gallery/maternidad-01.jpg',
 '60 minutos', '60 minutes',
 '1 ubicación al aire libre', '1 outdoor location',
 '{"es":["60+ fotos editadas en alta resolución","Galería online privada","Entrega en 2 semanas","Ayuda con poses y vestuario"],"en":["60+ edited high-resolution photos","Private online gallery","Delivery within 2 weeks","Posing and wardrobe guidance"]}',
 220, 1),
('familias', 'Familias', 'Families',
 'El caos bonito de los vuestros.', 'Your beautiful kind of chaos.',
 'Fotografía lifestyle para familias de verdad: juegos, abrazos y carreras con los peores. Nadie tiene que posar perfecto; yo me encargo de que lo natural salga hermoso.',
 'Lifestyle photography for real families: games, hugs and wild sprints. Nobody has to pose perfectly; I make sure the natural moments turn out beautiful.',
 '/images/gallery/familias-01.jpg',
 '45 minutos', '45 minutes',
 '1 ubicación · hasta 6 personas', '1 location · up to 6 people',
 '{"es":["50+ fotos editadas","Personas extra desde $15 c/u","Galería online privada","Entrega en 2 semanas"],"en":["50+ edited photos","Extra people from $15 each","Private online gallery","Delivery within 2 weeks"]}',
 180, 2),
('parejas', 'Parejas', 'Couples',
 'Sin poses. Solo ustedes.', 'No poses. Just you two.',
 'Sesiones al atardecer para aniversarios, compromisos o simplemente porque. Nos reímos, caminamos y yo busco esos momentos que ni notan la cámara.',
 'Sunset sessions for anniversaries, engagements or simply because. We laugh, we walk and I hunt for the moments you never even notice.',
 '/images/gallery/engagement-03.jpg',
 '60 minutos', '60 minutes',
 '1–2 ubicaciones cercanas', '1–2 nearby locations',
 '{"es":["70+ fotos editadas","Guía de ubicaciones según hora dorada","Galería online privada","Entrega en 2 semanas"],"en":["70+ edited photos","Golden-hour location guide","Private online gallery","Delivery within 2 weeks"]}',
 200, 3),
('bodas', 'Bodas', 'Weddings',
 'Su día, contado en luz.', 'Your day, told in light.',
 'Cobertura completa desde los preparativos hasta la pista de baile. Documento cada mirada sin interrumpir nada, y entrego una galería para revivir el día completo.',
 'Full coverage from getting ready to the dance floor. I document every glance without interrupting anything, and deliver a gallery to relive the whole day.',
 '/images/gallery/bodas-01.jpg',
 '6–8 horas', '6–8 hours',
 'Preparativos, ceremonia y recepción', 'Getting ready, ceremony and reception',
 '{"es":["400+ fotos editadas","Segunda fotógrafa opcional","Galería online por 12 meses","Entrega en 4 semanas","Reunión previa incluida"],"en":["400+ edited photos","Optional second photographer","Online gallery for 12 months","Delivery within 4 weeks","Pre-wedding meeting included"]}',
  1200, 4),
('quinceanera', 'Quinceañera', 'Quinceañera',
 'Quince años, una sola vez.', 'Fifteen happens only once.',
 'Una sesión dedicada a la quinceañera: retratos con su vestido, momentos con la familia y ese brillo de una noche que no se repite. La acompañamos desde la idea hasta el último clic.',
 'A session all about the birthday girl: portraits in her dress, family moments and that once-in-a-lifetime glow. We guide her from the first idea to the final shot.',
 '/images/gallery/quinceanera-01.jpg',
 '90 minutos', '90 minutes',
 '1–2 ubicaciones · cambio de vestuario incluido', '1–2 locations · outfit change included',
 '{"es":["80+ fotos editadas","Retratos individuales y con familia","Galería online privada","Entrega en 2 semanas"],"en":["80+ edited photos","Solo and family portraits","Private online gallery","Delivery within 2 weeks"]}',
 280, 5),
('graduaciones', 'Graduaciones', 'Grads',
 'Tu logro, en su mejor luz.', 'Your achievement, in its best light.',
 'Sesiones de graduación relajadas en el campus o el lugar que elijas: caminamos, celebramos y te llevas retratos que valen cada examen aprobado. Toga, vestuario casual o ambos.',
 'Relaxed grad sessions on campus or wherever you choose: we walk, we celebrate, and you get portraits worth every passed exam. Cap and gown, casual looks or both.',
 '/images/gallery/graduaciones-01.jpg',
 '45 minutos', '45 minutes',
 'Campus o ubicación a elegir · toga opcional', 'Campus or location of choice · cap and gown optional',
 '{"es":["40+ fotos editadas","Combinación de toga y looks casuales","Galería online privada","Entrega en 2 semanas"],"en":["40+ edited photos","Cap-and-gown plus casual looks","Private online gallery","Delivery within 2 weeks"]}',
 180, 6),
('engagement', 'Prometidos', 'Engagement',
 'El sí antes del gran día.', 'The yes before the big day.',
 'La sesión de compromiso que cuenta cómo empezó todo: el anillo en primer plano, risas nerviosas y retratos para sus save-the-dates o simplemente para celebrar lo que viene.',
 'An engagement session that tells how it all began: ring close-ups, nervous laughter and portraits for your save-the-dates or simply to celebrate what is coming.',
 '/images/gallery/engagement-01.jpg',
 '60 minutos', '60 minutes',
 '1–2 ubicaciones · ideal hora dorada', '1–2 locations · golden hour ideal',
 '{"es":["60+ fotos editadas","Retratos con detalle de anillo incluidos","Galería online privada","Entrega en 2 semanas"],"en":["60+ edited photos","Ring-detail portraits included","Private online gallery","Delivery within 2 weeks"]}',
 220, 7);

INSERT INTO gallery_categories (slug, label, label_en, sort_order) VALUES
('maternidad', 'Maternidad', 'Maternity', 1),
('familias', 'Familias', 'Families', 2),
('parejas', 'Parejas', 'Couples', 3),
('bodas', 'Bodas', 'Weddings', 4),
('quinceanera', 'Quinceañera', 'Quinceañera', 5),
('graduaciones', 'Graduaciones', 'Grads', 6),
('engagement', 'Prometidos', 'Engagement', 7);

INSERT INTO photos (category_id, src, alt, alt_en, orientation, width, height, sort_order)
SELECT c.id, v.src, v.alt, v.alt_en, v.orientation, v.width, v.height, v.sort_order
FROM (VALUES
  ('maternidad',   '/images/gallery/maternidad-01.jpg',   'Maternidad · fotografía 1',   'Maternity session · photo 1',   'portrait',   427, 640, 1),
  ('maternidad',   '/images/gallery/maternidad-02.jpg',   'Maternidad · fotografía 2',   'Maternity session · photo 2',   'landscape',  640, 427, 2),
  ('maternidad',   '/images/gallery/maternidad-03.jpg',   'Maternidad · fotografía 3',   'Maternity session · photo 3',   'landscape',  640, 427, 3),
  ('maternidad',   '/images/gallery/maternidad-04.jpg',   'Maternidad · fotografía 4',   'Maternity session · photo 4',   'landscape',  640, 427, 4),
  ('familias',     '/images/gallery/familias-01.jpg',     'Familias · fotografía 1',     'Family session · photo 1',      'landscape',  640, 427, 1),
  ('familias',     '/images/gallery/familias-02.jpg',     'Familias · fotografía 2',     'Family session · photo 2',      'portrait',   427, 640, 2),
  ('familias',     '/images/gallery/familias-03.jpg',     'Familias · fotografía 3',     'Family session · photo 3',      'portrait',   427, 640, 3),
  ('familias',     '/images/gallery/familias-04.jpg',     'Familias · fotografía 4',     'Family session · photo 4',      'portrait',   427, 640, 4),
  ('familias',     '/images/gallery/familias-05.jpg',     'Familias · fotografía 5',     'Family session · photo 5',      'landscape',  640, 427, 5),
  ('familias',     '/images/gallery/familias-06.jpg',     'Familias · fotografía 6',     'Family session · photo 6',      'landscape',  640, 427, 6),
  ('parejas',      '/images/g-parejas-1.svg',             'Pareja caminando de la mano bajo un cielo crepuscular', 'Couple walking hand in hand under a dusk sky', 'portrait', NULL, NULL, 1),
  ('parejas',      '/images/g-parejas-2.svg',             'Aniversario de pareja frente al horizonte', 'Couple anniversary facing the horizon', 'landscape', NULL, NULL, 2),
  ('parejas',      '/images/g-parejas-3.svg',             'Compromiso al atardecer en la colina', 'Engagement at sunset on the hill', 'portrait', NULL, NULL, 3),
  ('bodas',        '/images/gallery/bodas-01.jpg',        'Bodas · fotografía 1',        'Wedding session · photo 1',     'portrait',   427, 640, 1),
  ('bodas',        '/images/gallery/bodas-02.jpg',        'Bodas · fotografía 2',        'Wedding session · photo 2',     'portrait',   427, 640, 2),
  ('bodas',        '/images/gallery/bodas-03.jpg',        'Bodas · fotografía 3',        'Wedding session · photo 3',     'landscape',  640, 427, 3),
  ('bodas',        '/images/gallery/bodas-04.jpg',        'Bodas · fotografía 4',        'Wedding session · photo 4',     'landscape',  640, 427, 4),
  ('quinceanera',  '/images/gallery/quinceanera-01.jpg',  'Quinceañera · fotografía 1',  'Quinceañera session · photo 1', 'portrait',   427, 640, 1),
  ('quinceanera',  '/images/gallery/quinceanera-02.jpg',  'Quinceañera · fotografía 2',  'Quinceañera session · photo 2', 'landscape',  640, 427, 2),
  ('quinceanera',  '/images/gallery/quinceanera-03.jpg',  'Quinceañera · fotografía 3',  'Quinceañera session · photo 3', 'portrait',   427, 640, 3),
  ('quinceanera',  '/images/gallery/quinceanera-04.jpg',  'Quinceañera · fotografía 4',  'Quinceañera session · photo 4', 'landscape',  640, 427, 4),
  ('quinceanera',  '/images/gallery/quinceanera-05.jpg',  'Quinceañera · fotografía 5',  'Quinceañera session · photo 5', 'portrait',   427, 640, 5),
  ('quinceanera',  '/images/gallery/quinceanera-06.jpg',  'Quinceañera · fotografía 6',  'Quinceañera session · photo 6', 'portrait',   427, 640, 6),
  ('quinceanera',  '/images/gallery/quinceanera-07.jpg',  'Quinceañera · fotografía 7',  'Quinceañera session · photo 7', 'portrait',   427, 640, 7),
  ('graduaciones', '/images/gallery/graduaciones-01.jpg', 'Graduaciones · fotografía 1', 'Graduation session · photo 1',  'landscape',  640, 427, 1),
  ('graduaciones', '/images/gallery/graduaciones-02.jpg', 'Graduaciones · fotografía 2', 'Graduation session · photo 2',  'portrait',   427, 640, 2),
  ('graduaciones', '/images/gallery/graduaciones-03.jpg', 'Graduaciones · fotografía 3', 'Graduation session · photo 3',  'portrait',   427, 640, 3),
  ('graduaciones', '/images/gallery/graduaciones-04.jpg', 'Graduaciones · fotografía 4', 'Graduation session · photo 4',  'portrait',   427, 640, 4),
  ('graduaciones', '/images/gallery/graduaciones-05.jpg', 'Graduaciones · fotografía 5', 'Graduation session · photo 5',  'portrait',   427, 640, 5),
  ('graduaciones', '/images/gallery/graduaciones-06.jpg', 'Graduaciones · fotografía 6', 'Graduation session · photo 6',  'portrait',   427, 640, 6),
  ('graduaciones', '/images/gallery/graduaciones-07.jpg', 'Graduaciones · fotografía 7', 'Graduation session · photo 7',  'portrait',   427, 640, 7),
  ('graduaciones', '/images/gallery/graduaciones-08.jpg', 'Graduaciones · fotografía 8', 'Graduation session · photo 8',  'portrait',   427, 640, 8),
  ('graduaciones', '/images/gallery/graduaciones-09.jpg', 'Graduaciones · fotografía 9', 'Graduation session · photo 9',  'portrait',   427, 640, 9),
  ('engagement',   '/images/gallery/engagement-01.jpg',   'Prometidos · fotografía 1',   'Engagement session · photo 1',  'portrait',   427, 640, 1),
  ('engagement',   '/images/gallery/engagement-02.jpg',   'Prometidos · fotografía 2',   'Engagement session · photo 2',  'portrait',   427, 640, 2),
  ('engagement',   '/images/gallery/engagement-03.jpg',   'Prometidos · fotografía 3',   'Engagement session · photo 3',  'portrait',   427, 640, 3)
) AS v(slug, src, alt, alt_en, orientation, width, height, sort_order)
JOIN gallery_categories c ON c.slug = v.slug;

INSERT INTO testimonials (author, session_type, session_type_en, quote, quote_en, rating, sort_order) VALUES
('Vanessa & Leo', 'Sesión de pareja', 'Couples session',
 'Nunca nos habíamos sentido tan cómodos frente a una cámara. Miriam nos hizo olvidar que nos estaba fotografiando; cuando vimos las fotos lloramos de felicidad.',
 'We had never felt so comfortable in front of a camera. Miriam made us forget she was photographing us; when we saw the pictures we cried tears of joy.', 5, 1),
('Familia Ríos', 'Familia · 3 niños', 'Family · 3 kids',
 'Con tres niños pequeños toda sesión es una aventura, pero ella los mantuvo entretenidos riendo todo el tiempo. Las fotos llenan toda nuestra sala y siempre recibimos cumplidos.',
 'With three little kids every session is an adventure, but she kept them entertained and laughing the whole time. Their photos fill our living room and we always get compliments.', 5, 2),
('Daniela M.', 'Maternidad', 'Maternity',
 'Me sentí poderosa y hermosa en cada foto. Capturó exactamente lo que quería recordar de mi embarazo: la calma antes de conocerte, pequeñín.',
 'I felt powerful and beautiful in every single photo. She captured exactly what I wanted to remember about my pregnancy: the calm before meeting you, little one.', 5, 3);

INSERT INTO stats (value, label, label_en, description, description_en, sort_order) VALUES
('+150', 'sesiones realizadas', 'sessions photographed',
 'De maternidades a bodas completas, cada sesión documentada con intención.',
 'From maternities to full weddings, every session documented with intention.', 1),
('+320', 'personas frente a mi cámara', 'people in front of my camera',
 'Familias, parejas y recién llegados que confiaron sus momentos más importantes.',
 'Families, couples and newcomers who trusted me with their biggest moments.', 2),
('9/10', 'clientes llegan recomendados', 'clients come recommended',
 'La mayor parte de mi agenda viene de familias que ya vivieron la experiencia.',
 'Most of my calendar comes from families who already lived the experience.', 3);
