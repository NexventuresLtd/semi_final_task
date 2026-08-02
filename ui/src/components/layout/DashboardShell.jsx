import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TabBar from "./TabBar";
import LogoWatermark from "../ui/LogoWatermark";

export default function DashboardShell() {
  return (
    <div className="mesh-bg h-[100dvh] w-full flex overflow-hidden relative">
      <LogoWatermark />
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto relative z-10">
        <div className="flex flex-col min-h-full px-4 lg:px-6 pt-4 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full">
          <Topbar />
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
      <TabBar />
    </div>
  );
}