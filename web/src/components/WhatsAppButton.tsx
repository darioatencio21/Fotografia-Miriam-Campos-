import { useLang } from '../i18n';

export const WHATSAPP_NUMBER = '15595550134';

const PRESET: Record<'en' | 'es', string> = {
  en: "Hi Miriam! I'd like information for a photo session.",
  es: '¡Hola Miriam! Quiero información para una sesión de fotos.',
};

export default function WhatsAppButton() {
  const { lang, t } = useLang();
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRESET[lang])}`;

  return (
    <a
      className="whatsapp-fab"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappAria}
      title={t.whatsappAria}
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.9 5 2.3 7L4.5 28l6.3-1.6c1.6.8 3.3 1.2 5.2 1.2 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.8c-1.7 0-3.3-.4-4.7-1.2l-.4-.2-3.7 1 1-3.5-.3-.4c-1.2-1.6-1.9-3.5-1.9-5.6 0-5.4 4.5-9.8 10-9.8s10 4.4 10 9.8-4.5 9.9-10 9.9zm5.5-7.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.5-.3z"
        />
      </svg>
    </a>
  );
}
