/**
 * Ambient atmospheric backdrop.
 *
 * A single fixed, pointer-events-none layer beneath all content, in both
 * light and dark modes. Paints:
 *   - Aurora orbs that slowly drift (reduced-motion friendly)
 *   - A faint editorial grid that fades at the edges
 *   - Top + bottom page-edge vignette
 *   - Four corner registration marks — the print-magazine signature
 *
 * All visual work lives in `globals.css` under `.ambient-backdrop`.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="ambient-backdrop">
      <div className="ambient-vignette" />
      <div className="ambient-marks">
        <span className="mark-tl" />
        <span className="mark-tr" />
        <span className="mark-bl" />
        <span className="mark-br" />
      </div>
    </div>
  );
}
