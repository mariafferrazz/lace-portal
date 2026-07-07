import Container from "../../ui/Container";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../../ui/ThemeToggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-text backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <DesktopMenu />
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
