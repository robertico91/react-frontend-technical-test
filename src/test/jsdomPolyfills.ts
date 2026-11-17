/**
 * jsdom no implementa algunas APIs del navegador que usa la app. Estos sustitutos imitan lo
 * mínimo para que los componentes funcionen en los tests (no hay layout ni scroll real).
 */

// <dialog>: showModal() y close() con su evento "close", que es el que escucha SidePanel.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

Element.prototype.scrollTo ??= () => {};
Element.prototype.scrollIntoView ??= () => {};

// Sin layout no se puede saber si algo es visible: se considera visible si está en el documento.
Element.prototype.checkVisibility ??= function checkVisibility(this: Element) {
  return this.isConnected;
};
