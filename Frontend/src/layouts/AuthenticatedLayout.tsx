import { Outlet } from "react-router-dom";

import Navbar from "@/common/components/navbar/Navbar";
import Sidebar from "@/common/components/sidebar/Sidebar";

export default function AuthenticatedLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto bg-slate-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
