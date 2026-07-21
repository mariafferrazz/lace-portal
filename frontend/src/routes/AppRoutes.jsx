import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";

const AccessPage = lazy(() => import("../pages/Access/AccessPage"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Filmes = lazy(() => import("../pages/CinemaDitadura/Filmes"));
const Verbetes = lazy(() => import("../pages/CinemaDitadura/Verbetes"));
const MostraIII = lazy(() => import("../pages/CinemaDitadura/MostraIII"));
const MostraIV = lazy(() => import("../pages/CinemaDitadura/MostraIV"));
const MostraV = lazy(() => import("../pages/CinemaDitadura/MostraV"));
const MostraVI = lazy(() => import("../pages/CinemaDitadura/MostraVI"));
const MostraVII = lazy(() => import("../pages/CinemaDitadura/MostraVII"));
const Entrevistas = lazy(() => import("../pages/ProducaoAudiovisual/Entrevistas"));
const Podcasts = lazy(() => import("../pages/ProducaoAudiovisual/Podcasts"));
const LinhasDeFugasVirais = lazy(() => import("../pages/ProducaoAcademica/LinhasDeFugasVirais"));
const Artigos = lazy(() => import("../pages/ProducaoAcademica/Artigos"));
const Pesquisas = lazy(() => import("../pages/ProducaoAcademica/Pesquisas"));
const Eventos2021 = lazy(() => import("../pages/Eventos/Eventos2021"));
const Eventos2022 = lazy(() => import("../pages/Eventos/Eventos2022"));
const Eventos2023 = lazy(() => import("../pages/Eventos/Eventos2023"));
const Eventos2024 = lazy(() => import("../pages/Eventos/Eventos2024"));
const Eventos2025 = lazy(() => import("../pages/Eventos/Eventos2025"));

const withSuspense = (element) => <Suspense fallback={null}>{element}</Suspense>;

export default function AppRoutes() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/admin" element={withSuspense(<AccessPage />)} />

        <Route element={<MainLayout />}>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Cinema e Ditadura */}
          <Route path="/cinema-e-ditadura/filmes" element={withSuspense(<Filmes />)} />
          <Route path="/cinema-e-ditadura/verbetes" element={withSuspense(<Verbetes />)} />
          <Route path="/cinema-e-ditadura/iii-mostra" element={withSuspense(<MostraIII />)} />
          <Route path="/cinema-e-ditadura/iv-mostra" element={withSuspense(<MostraIV />)} />
          <Route path="/cinema-e-ditadura/v-mostra" element={withSuspense(<MostraV />)} />
          <Route path="/cinema-e-ditadura/vi-mostra" element={withSuspense(<MostraVI />)} />
          <Route path="/cinema-e-ditadura/vii-mostra" element={withSuspense(<MostraVII />)} />

          {/* Produção Audiovisual */}
          <Route
            path="/producao-audiovisual/entrevistas"
            element={withSuspense(<Entrevistas />)}
          />
          <Route
            path="/producao-audiovisual/podcasts"
            element={withSuspense(<Podcasts />)}
          />

          {/* Produção Acadêmica */}
          <Route
            path="/producao-academica/linhas-de-fugas-virais"
            element={withSuspense(<LinhasDeFugasVirais />)}
          />
          <Route
            path="/producao-academica/artigos"
            element={withSuspense(<Artigos />)}
          />
          <Route
            path="/producao-academica/pesquisas"
            element={withSuspense(<Pesquisas />)}
          />

          {/* Eventos */}
          <Route path="/eventos/2021" element={withSuspense(<Eventos2021 />)} />
          <Route path="/eventos/2022" element={withSuspense(<Eventos2022 />)} />
          <Route path="/eventos/2023" element={withSuspense(<Eventos2023 />)} />
          <Route path="/eventos/2024" element={withSuspense(<Eventos2024 />)} />
          <Route path="/eventos/2025" element={withSuspense(<Eventos2025 />)} />

          {/* 404 */}
          <Route path="*" element={withSuspense(<NotFound />)} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
