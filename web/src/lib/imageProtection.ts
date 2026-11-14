function targetImage(node: EventTarget | null): HTMLImageElement | null {
  if (!(node instanceof Element)) return null;
  const img = node.closest('img');
  return img instanceof HTMLImageElement ? img : null;
}

function selectionHasImage(): boolean {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;
  for (let i = 0; i < selection.rangeCount; i++) {
    const fragment = selection.getRangeAt(i).cloneContents();
    if (fragment.querySelector('img')) return true;
  }
  return false;
}

/**
 * Disuade la copia y descarga casual de las imágenes del sitio:
 * bloquea el arrastre, el menú contextual sobre imágenes y su copia
 * desde el portapapeles. No impide capturas de pantalla ni el acceso
 * directo a los archivos por red.
 */
export function installImageProtection(): void {
  document.addEventListener(
    'dragstart',
    (event) => {
      if (targetImage(event.target)) event.preventDefault();
    },
    true
  );

  document.addEventListener(
    'contextmenu',
    (event) => {
      if (targetImage(event.target)) event.preventDefault();
    },
    true
  );

  document.addEventListener(
    'copy',
    (event) => {
      if (targetImage(event.target) || selectionHasImage()) {
        event.preventDefault();
        event.clipboardData?.setData('text/plain', '');
      }
    },
    true
  );

  document.addEventListener(
    'cut',
    (event) => {
      if (targetImage(event.target)) event.preventDefault();
    },
    true
  );
}
