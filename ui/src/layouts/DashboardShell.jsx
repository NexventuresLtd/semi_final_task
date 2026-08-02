import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell() {
  return (
    <div className="mesh-bg h-[100dvh] w-full flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto relative">
        <div className="flex flex-col min-h-full px-4 lg:px-6 pt-4 pb-8 max-w-[1600px] mx-auto w-full">
          <Topbar />
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}