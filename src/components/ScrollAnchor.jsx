// ScrollAnchor.jsx
import { useRef, useEffect } from "react";

export function ScrollAnchor({
  children,
  trigger = false,
  //byd负padding害我
}) {
  const anchorRef = useRef(null);

  useEffect(() => {
    if (trigger && anchorRef.current) {
      anchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        margin: "0px 0px 20px 0px",
      });
    }
  }, [trigger, children]);

  return (
    <>
      {children}
      <span ref={anchorRef} />
    </>
  );
}
