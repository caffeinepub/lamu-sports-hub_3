import { useState } from "react";
import Layout from "./components/Layout";
import { useActivities } from "./hooks/use-backend";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import News from "./pages/News";
import Notifications from "./pages/Notifications";
import Officials from "./pages/Officials";
import Players from "./pages/Players";
import Settings from "./pages/Settings";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import type { TabId } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const { data: activities = [] } = useActivities();
  const notificationCount = activities.length;

  const PAGE_MAP: Record<TabId, React.ReactNode> = {
    home: <Home onNavigate={setActiveTab} />,
    matches: <Matches />,
    standings: <Standings />,
    teams: <Teams />,
    players: <Players />,
    news: <News />,
    admin: <Admin />,
    notifications: <Notifications />,
    settings: <Settings />,
    about: <About />,
    officials: <Officials />,
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      notificationCount={notificationCount}
    >
      {(Object.keys(PAGE_MAP) as TabId[]).map((tabId) => (
        <div
          key={tabId}
          className={tabId === activeTab ? "block animate-fade-in" : "hidden"}
          aria-hidden={tabId !== activeTab}
        >
          {PAGE_MAP[tabId]}
        </div>
      ))}
    </Layout>
  );
}
