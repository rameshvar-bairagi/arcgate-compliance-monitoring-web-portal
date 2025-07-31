// src/utils/domHelpers.ts
export function toggleSidebar() {
  if (typeof document !== 'undefined') {
    document.body.classList.toggle('sidebar-collapse');
  }
}
