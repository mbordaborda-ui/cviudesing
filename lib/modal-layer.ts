/**
 * Registro mínimo de capas modales.
 * Permite que el atajo global de Escape sepa si hay una ficha abierta
 * sin depender del orden de listeners de la ventana.
 */
export const modalLayer = { open: false };

export function setModalOpen(open: boolean) {
  modalLayer.open = open;
}
