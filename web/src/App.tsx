import { useEffect, useState } from 'react';
import type { GalleryCategory, Photo, Service, Stat, Testimonial } from './types';
import { fetchCategories, fetchPhotos, fetchServices, fetchStats, fetchTestimonials } from './lib/api';
import { useLang } from './i18n';
import Header from './components/Header';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import About from './components/About';
import Stats from './components/Stats';
import Services from './components/Services';
import Horizon from './components/Horizon';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPage from './components/Admin/AdminPage';

interface Content {
  services: Service[];
  testimonials: Testimonial[];
  stats: Stat[];
  photos: Photo[];
  categories: GalleryCategory[];
}

const EMPTY: Content = {
  services: [],
  testimonials: [],
  stats: [],
  photos: [],
  categories: [],
};

export default function App() {
  const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';
  return isAdminRoute ? <AdminPage /> : <Site />;
}

function Site() {
  const { t } = useLang();
  const [content, setContent] = useState<Content>(EMPTY);
  const [loadError, setLoadError] = useState(false);
  const route = window.location.pathname.replace(/\/+$/, '');
  const isServicesPage = route === '/servicios';
  const isTestimonialsPage = route === '/testimonios';
  const isBookingPage = route === '/reservar';
  const isSubpage = isServicesPage || isTestimonialsPage || isBookingPage;

  useEffect(() => {
    let active = true;
    Promise.all([fetchServices(), fetchTestimonials(), fetchStats(), fetchPhotos(), fetchCategories()])
      .then(([services, testimonials, stats, photos, categories]) => {
        if (active) setContent({ services, testimonials, stats, photos, categories });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isSubpage) return;
    const base = 'Miriam Tellez Photography';
    if (isServicesPage) document.title = `${base} · ${t.nav.services}`;
    else if (isBookingPage) document.title = `${base} · ${t.bookCta}`;
    else document.title = `${base} · ${t.nav.testimonials}`;
  }, [isSubpage, isServicesPage, isBookingPage, t]);

  return (
    <>
      <a className="skip-link" href="#contenido">
        {t.skipLink}
      </a>
      <Header />
      <main id="contenido" className={isSubpage ? 'subpage' : ''}>
        {isServicesPage ? (
          <Services services={content.services} />
        ) : isBookingPage ? (
          <Contact services={content.services} />
        ) : isTestimonialsPage ? (
          <Testimonials testimonials={content.testimonials} />
        ) : (
          <>
            <Hero />
            <Welcome />
            <About />
            <Stats items={content.stats} />
            <Services services={content.services} limit={3} />
            <Horizon />
            <Gallery photos={content.photos} categories={content.categories} />
            <Faq />
          </>
        )}
      </main>
      {!isBookingPage && <Footer />}
      {loadError && (
        <div className="load-error" role="alert">
          {t.loadError}
        </div>
      )}
    </>
  );
}
