import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell() {
  return (
    <div className="mesh-bg min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col px-4 lg:px-6 pt-4 pb-8 max-w-[1600px] mx-auto w-full">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}