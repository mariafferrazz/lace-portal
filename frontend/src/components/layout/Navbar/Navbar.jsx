import { useEffect, useState } from "react";
import Container from "../../ui/Container";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../../ui/ThemeToggle";
import { menu } from "../../../data/menu";
import { loadContentNavigation } from "../../../features/content/public/navigation";
import { mergeDynamicMenu } from "../../../features/content/public/navigationMenu";

export default function Navbar() {
  const [items, setItems] = useState(menu);

  useEffect(() => {
    let active = true;
    const refreshMenu = () => loadContentNavigation()
      .then((contents) => active && setItems(mergeDynamicMenu(contents)))
      .catch(() => active && setItems(menu));

    refreshMenu();
    window.addEventListener("focus", refreshMenu);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshMenu);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 text-text backdrop-blur">
      <Container>
        <div className="flex h-24 items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            <DesktopMenu items={items} />
            <ThemeToggle />
            <MobileMenu items={items} />
          </div>
        </div>
      </Container>
    </header>
  );
}
