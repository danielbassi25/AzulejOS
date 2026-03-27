import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initSupabaseSync } from "@/data/supabase-sync";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/dashboard";
import SaudadePage from "@/pages/saudade";
import SaudadeDetailPage from "@/pages/saudade-detail";
import LettersPage from "@/pages/letters";
import LetterDetailPage from "@/pages/letter-detail";
import BuildPage from "@/pages/build";
import PlayPage from "@/pages/play";
import ScorePage from "@/pages/score";
import CreateMemoryPage from "@/pages/create-memory";
import WriteLetterPage from "@/pages/write-letter";
import CreateGoalPage from "@/pages/create-goal";
import EditMemoryPage from "@/pages/edit-memory";

const queryClient = new QueryClient();

function HomeRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/dashboard");
  }, [setLocation]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/saudade/new" component={CreateMemoryPage} />
      <Route path="/saudade/edit/:id" component={EditMemoryPage} />
      <Route path="/saudade/:id" component={SaudadeDetailPage} />
      <Route path="/saudade" component={SaudadePage} />
      <Route path="/letters/new" component={WriteLetterPage} />
      <Route path="/letters/:id" component={LetterDetailPage} />
      <Route path="/letters" component={LettersPage} />
      <Route path="/build/new" component={CreateGoalPage} />
      <Route path="/build" component={BuildPage} />
      <Route path="/play" component={PlayPage} />
      <Route path="/score" component={ScorePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SyncLoader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSupabaseSync().then(() => setReady(true));
  }, []);

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, hsl(220,70%,26%) 0%, hsl(218,72%,30%) 100%)',
      }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: '2.4rem',
          letterSpacing: '0.02em',
          color: 'hsl(42,30%,96%)',
        }}>
          Azulej<span style={{ color: 'hsl(42,36%,70%)' }}>OS</span>
        </h1>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '0.9rem',
          color: 'rgba(200,188,165,0.50)',
          marginTop: '12px',
        }}>
          Syncing your tiles...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SyncLoader>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </SyncLoader>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
