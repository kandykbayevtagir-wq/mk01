/** Static gradients rasterize once; only their small layers move. No blur or canvas. */
export function LiquidLight({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden="true" className={`liquid-light${dark ? " liquid-light--dark" : ""}`}>
      <span className="liquid-light__form liquid-light__form--graphite" />
      <span className="liquid-light__form liquid-light__form--silver" />
      <span className="liquid-light__form liquid-light__form--red" />
    </div>
  );
}

/** A masked moving glint; the component's existing border is the static fallback. */
export function LightTrail() {
  return <span aria-hidden="true" className="light-trail"><span /></span>;
}
