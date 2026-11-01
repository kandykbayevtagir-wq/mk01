/** Static gradients rasterize once; only their small layers move. No blur or canvas. */
export function LiquidLight({ dark = false, lean = false }: { dark?: boolean; lean?: boolean }) {
  return (
    <div aria-hidden="true" className={`liquid-light${dark ? " liquid-light--dark" : ""}`}>
      <span className="liquid-light__form liquid-light__form--graphite" />
      {/* `lean` drops the third loop where another ambient layer already moves */}
      {!lean && <span className="liquid-light__form liquid-light__form--silver" />}
      <span className="liquid-light__form liquid-light__form--red" />
    </div>
  );
}

/** A masked moving glint; the component's existing border is the static fallback. */
export function LightTrail() {
  return <span aria-hidden="true" className="light-trail"><span /></span>;
}

/** One-pass edge highlight for hover, keyboard focus and touch press (CSS-only, no loop). */
export function CardSheen() {
  return <span aria-hidden="true" className="card-sheen"><span /></span>;
}
