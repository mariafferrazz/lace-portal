import { useCallback, useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import Container from "../../components/ui/Container";
import Button from "../../components/ui/Button";
import api, { apiError } from "../../services/api";
import EditorialDashboard from "./access/components/EditorialDashboard";
import Login from "./access/components/Login";

export default function AccessPage() {
  const [user, setUser] = useState(null);
  const [contents, setContents] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [referenceOptions, setReferenceOptions] = useState({ films: [], articleAuthors: [] });
  const [dashboardError, setDashboardError] = useState("");
  const [checking, setChecking] = useState(true);

  const loadContents = useCallback(async (savedContent = null) => {
    if (savedContent?.id) setContents((current) => [{ ...savedContent, summaryOnly: false }, ...current.filter((item) => item.id !== savedContent.id)]);
    try {
      setDashboardError("");
      const { data } = await api.get("/contents/manage", { params: { summary: "1" } });
      setContents(data.contents || []);
    } catch (requestError) {
      setDashboardError(apiError(requestError));
    }
  }, []);

  const loadTeamMembers = useCallback(async () => {
    try {
      const { data } = await api.get("/team");
      setTeamMembers(data.members || []);
      return data.members || [];
    } catch {
      setTeamMembers([]);
      return [];
    }
  }, []);

  const loadReferenceOptions = useCallback(async () => {
    try {
      const { data } = await api.get("/contents/manage/options");
      const options = { films: data.films || [], articleAuthors: data.articleAuthors || [] };
      setReferenceOptions(options);
      return options;
    } catch {
      const empty = { films: [], articleAuthors: [] };
      setReferenceOptions(empty);
      return empty;
    }
  }, []);

  const ensureFormData = useCallback(async () => Promise.all([
    teamMembers.length ? teamMembers : loadTeamMembers(),
    referenceOptions.films.length || referenceOptions.articleAuthors.length ? referenceOptions : loadReferenceOptions(),
  ]), [loadReferenceOptions, loadTeamMembers, referenceOptions, teamMembers]);

  const refreshAll = useCallback(async (savedContent = null) => {
    await Promise.all([loadContents(savedContent), loadReferenceOptions()]);
  }, [loadContents, loadReferenceOptions]);

  useEffect(() => {
    api.get("/auth/me")
      .then(async ({ data }) => {
        setUser(data.user);
        await Promise.all([loadContents(), loadReferenceOptions()]);
      })
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, [loadContents, loadReferenceOptions]);

  function handleLogin(authenticatedUser) {
    setUser(authenticatedUser);
    refreshAll();
  }

  async function logout() {
    await api.post("/auth/logout");
    setUser(null);
    setContents([]);
    setTeamMembers([]);
    setReferenceOptions({ films: [], articleAuthors: [] });
  }

  if (checking) return <main className="grid min-h-[70vh] place-items-center"><p className="text-muted">Verificando acesso...</p></main>;

  return (
    <main className="bg-surface py-16 lg:py-24">
      <Container>
        {!user ? <Login onLogin={handleLogin} /> : <>
          <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Painel LACE</p><h1 className="mt-2 font-title text-4xl md:text-5xl">Ola, {user.name}</h1><p className="mt-2 text-muted">{user.role === "COORDINATOR" ? "Acesso de coordenacao" : "Acesso da Equipe LACE"}</p></div><Button variant="dark" type="button" onClick={logout}><LogOut className="inline" size={17} /> Sair</Button></header>
          {dashboardError && <p className="mb-6 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-sm font-semibold text-primary" role="status">{dashboardError}</p>}
          <EditorialDashboard user={user} contents={contents} refresh={refreshAll} teamMembers={teamMembers} referenceOptions={referenceOptions} ensureFormData={ensureFormData} onReferenceCreated={loadReferenceOptions} />
        </>}
      </Container>
    </main>
  );
}
