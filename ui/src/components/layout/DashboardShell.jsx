import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import TabBar from "./TabBar";
import LogoWatermark from "../ui/LogoWatermark";

export default function DashboardShell() {
  return (
    <div className="mesh-bg min-h-screen flex relative overflow-hidden">
      <LogoWatermark />
      <Sidebar />
      <div className="flex-1 flex flex-col px-4 lg:px-6 pt-4 pb-24 lg:pb-8 max-w-[1600px] mx-auto w-full relative z-10">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <TabBar />
    </div>
  );
}