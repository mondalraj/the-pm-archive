/**
 * Global grain / paper-texture overlay. Sits above content but below modals.
 * Appearance is themed via CSS variables in `globals.css` — the opacity
 * shifts slightly between light and dark modes for the right tactile feel.
 */
export function GrainOverlay() {
  return <div aria-hidden className="grain-overlay" />;
}
