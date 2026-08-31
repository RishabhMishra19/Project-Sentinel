type DashboardHeaderProps = {
    autoRefresh: boolean;
    setAutoRefresh: React.Dispatch<React.SetStateAction<DashboardHeaderProps["autoRefresh"]>>;
};

export const DashboardHeader = ({ autoRefresh, setAutoRefresh }: DashboardHeaderProps) => {
    return (
        <header className="mb-3 flex items-center justify-between">
            <div>
                <h1 className="text-lg font-semibold text-foreground">Processor Dashboard</h1>

                <p className="text-[9px] text-slate-600">
                    Real-time overview of Ingest, Processor and Stream processing
                </p>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="flex h-7 items-center gap-2 rounded-md border border-[#243149] bg-[#0b1322] px-2.5 text-[9px] text-slate-400"
                >
                    ◷ Last 30 minutes
                    <span className="text-slate-600">▾</span>
                </button>

                <button
                    type="button"
                    onClick={() => setAutoRefresh((value) => !value)}
                    className="flex h-7 items-center gap-2 rounded-md border border-[#243149] bg-[#0b1322] px-2.5 text-[9px] text-slate-400"
                >
                    Auto refresh
                    <span
                        className={`relative h-3.5 w-6 rounded-full ${
                            autoRefresh ? "bg-blue-500" : "bg-slate-700"
                        }`}
                    >
                        <span
                            className={`absolute top-[2px] h-2.5 w-2.5 rounded-full bg-white transition-transform ${
                                autoRefresh ? "translate-x-3" : "translate-x-[2px]"
                            }`}
                        />
                    </span>
                </button>

                <span className="text-sm text-blue-400">↻</span>
            </div>
        </header>
    );
};
