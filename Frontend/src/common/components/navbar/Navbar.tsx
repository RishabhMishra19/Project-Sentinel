import {useAppSelector} from "@/common/hooks/useAppSelector";

export default function Navbar() {

    const user = useAppSelector(state => state.auth.user);

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">

            <h1 className="text-lg font-semibold">
                Sentinel
            </h1>

            <div className="flex items-center gap-3">

                <span className="text-sm text-slate-600">
                    {user?.name}
                </span>

            </div>

        </header>
    );

}