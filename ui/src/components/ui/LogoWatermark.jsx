import logo from "../../assets/logos/ferwafa-logo.png";

/**
 * Large, centered, low-opacity crest sitting behind page content.
 * Fixed so it doesn't scroll with the page; pointer-events disabled
 * so it never blocks interaction.
 */
export default function LogoWatermark({ className = "" }) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden="true"
      className={`
        pointer-events-none select-none fixed top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2 w-[640px] max-w-[70vw]
        opacity-[0.035] dark:opacity-[0.05] z-0 ${className}
      `}
    />
  );
}