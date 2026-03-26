import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
