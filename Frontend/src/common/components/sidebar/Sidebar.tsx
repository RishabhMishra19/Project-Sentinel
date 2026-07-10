import {NavLink} from "react-router-dom";

import {ROUTES} from "@/app/router/routes";

export default function Sidebar() {

    return (
        <aside className="flex h-full w-64 flex-col border-r bg-white">

            <div className="border-b p-6">

                <h2 className="text-xl font-bold">
                    Sentinel
                </h2>

            </div>

            <nav className="flex flex-col gap-2 p-4">

                <NavLink
                    to={ROUTES.DASHBOARD}
                    className="rounded-md px-4 py-2 hover:bg-slate-100"
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to={ROUTES.USERS}
                    className="rounded-md px-4 py-2 hover:bg-slate-100"
                >
                    Users
                </NavLink>

                <NavLink
                    to={ROUTES.ORGS}
                    className="rounded-md px-4 py-2 hover:bg-slate-100"
                >
                    Organizations
                </NavLink>

                <NavLink
                    to={ROUTES.PROJECTS}
                    className="rounded-md px-4 py-2 hover:bg-slate-100"
                >
                    Projects
                </NavLink>

            </nav>

        </aside>
    );

}