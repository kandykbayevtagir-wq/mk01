/**
 * Card light layers (CSS-only, no loop): a one-pass edge sheen for hover,
 * keyboard focus and touch press, and a soft light that CardMagnet places at
 * the pointer (desktop) or the finger (touch).
 */
export function CardSheen() {
  return (
    <>
      <span aria-hidden="true" className="card-sheen">
        <span />
      </span>
      <span aria-hidden="true" className="card-light">
        <span />
      </span>
    </>
  );
}
