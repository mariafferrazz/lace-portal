import { Link } from "react-router-dom";

export default function HomeLink({ children, onClick, ...props }) {
  function handleClick(event) {
    onClick?.(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <Link to="/" onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
