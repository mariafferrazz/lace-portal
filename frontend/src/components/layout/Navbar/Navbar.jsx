import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from "../../ui/Container";

import Logo from "./Logo";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "../../ui/ThemeToggle";
import { menu } from "../../../data/menu";
import { loadContentNavigation } from "../../../features/content/public/navigation";
import { mergeDynamicMenu } from "../../../features/content/public/navigationMenu";
import { CONTENT_UPDATED_EVENT } from "../../../features/content/contentEvents";

export default function Navbar() {
  const location = useLocation();
  const [items, setItems] = useState(menu);

  useEffect(() => {
    let active = true;
    const refreshMenu = () => loadContentNavigation()
      .then((contents) => active && setItems(mergeDynamicMenu(contents)))
      .catch(() => active && setItems(menu));

    refreshMenu();
    window.addEventListener("focus", refreshMenu);
    window.addEventListener(CONTENT_UPDATED_EVENT, refreshMenu);

    return () => {
      active = false;
      window.removeEventListener("focus", refreshMenu);
      window.removeEventListener(CONTENT_UPDATED_EVENT, refreshMenu);
    };
  }, [location.pathname]);

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
