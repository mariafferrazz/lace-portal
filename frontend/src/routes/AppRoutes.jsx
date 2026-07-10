import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound";
import AccessPage from "../pages/Access/AccessPage";

// Cinema e Ditadura
import Filmes from "../pages/CinemaDitadura/Filmes";
import Verbetes from "../pages/CinemaDitadura/Verbetes";
import MostraIII from "../pages/CinemaDitadura/MostraIII";
import MostraIV from "../pages/CinemaDitadura/MostraIV";
import MostraV from "../pages/CinemaDitadura/MostraV";
import MostraVI from "../pages/CinemaDitadura/MostraVI";
import MostraVII from "../pages/CinemaDitadura/MostraVII";

// Produção Audiovisual
import Entrevistas from "../pages/ProducaoAudiovisual/Entrevistas";
import Podcasts from "../pages/ProducaoAudiovisual/Podcasts";

// Produção Acadêmica
import LinhasDeFugasVirais from "../pages/ProducaoAcademica/LinhasDeFugasVirais";
import Artigos from "../pages/ProducaoAcademica/Artigos";
import Traducoes from "../pages/ProducaoAcademica/Traducoes";
import Pesquisas from "../pages/ProducaoAcademica/Pesquisas";

// Eventos
import Eventos2021 from "../pages/Eventos/Eventos2021";
import Eventos2022 from "../pages/Eventos/Eventos2022";
import Eventos2023 from "../pages/Eventos/Eventos2023";
import Eventos2024 from "../pages/Eventos/Eventos2024";
import Eventos2025 from "../pages/Eventos/Eventos2025";
import SemanaAcademica2025 from "../pages/Eventos/SemanaAcademica2025";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />
          <Route path="/acesso" element={<AccessPage />} />

          {/* Cinema e Ditadura */}
          <Route path="/cinema-e-ditadura/filmes" element={<Filmes />} />
          <Route path="/cinema-e-ditadura/verbetes" element={<Verbetes />} />
          <Route path="/cinema-e-ditadura/iii-mostra" element={<MostraIII />} />
          <Route path="/cinema-e-ditadura/iv-mostra" element={<MostraIV />} />
          <Route path="/cinema-e-ditadura/v-mostra" element={<MostraV />} />
          <Route path="/cinema-e-ditadura/vi-mostra" element={<MostraVI />} />
          <Route path="/cinema-e-ditadura/vii-mostra" element={<MostraVII />} />

          {/* Produção Audiovisual */}
          <Route
            path="/producao-audiovisual/entrevistas"
            element={<Entrevistas />}
          />
          <Route
            path="/producao-audiovisual/podcasts"
            element={<Podcasts />}
          />

          {/* Produção Acadêmica */}
          <Route
            path="/producao-academica/linhas-de-fugas-virais"
            element={<LinhasDeFugasVirais />}
          />
          <Route
            path="/producao-academica/artigos"
            element={<Artigos />}
          />
          <Route
            path="/producao-academica/traducoes"
            element={<Traducoes />}
          />
          <Route
            path="/producao-academica/pesquisas"
            element={<Pesquisas />}
          />

          {/* Eventos */}
          <Route path="/eventos/2021" element={<Eventos2021 />} />
          <Route path="/eventos/2022" element={<Eventos2022 />} />
          <Route path="/eventos/2023" element={<Eventos2023 />} />
          <Route path="/eventos/2024" element={<Eventos2024 />} />
          <Route path="/eventos/2025" element={<Eventos2025 />} />
          <Route path="/eventos/semana-academica-2025" element={<SemanaAcademica2025 />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
