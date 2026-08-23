import React, { useState, useEffect, useRef } from "react";

interface AppMetrics {
  id: number;
  name: string;
  url: string;
  cpu: string;
  memory: string;
  liveThreads: string;
  runnableThreads: string;
  dbConnections: string;
  status: "Online" | "Offline" | "Connecting...";
}

export default function SystemMonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  // State for the 3 Spring Boot websites
  const [apps, setApps] = useState<AppMetrics[]>([
    {
      id: 1,
      name: "Service Alpha",
      url: "http://localhost:8080",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      status: "Offline",
    },
    {
      id: 2,
      name: "Service Beta",
      url: "http://localhost:8081",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      status: "Offline",
    },
    {
      id: 3,
      name: "Service Gamma",
      url: "http://localhost:8082",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      status: "Offline",
    },
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleUrlChange = (id: number, newUrl: string) => {
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, url: newUrl } : app)));
  };

  const handleNameChange = (id: number, newName: string) => {
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, name: newName } : app)));
  };

  const fetchAllMetrics = async () => {
    const updatedApps = await Promise.all(
      apps.map(async (app) => {
        const cleanUrl = app.url.trim().replace(/\/$/, "");
        try {
          const [cpuRes, memRes, liveThreadRes, threadStatesRes, dbRes] = await Promise.all([
            fetch(`${cleanUrl}/actuator/metrics/system.cpu.usage`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.memory.used`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.threads.live`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.threads.states?tag=state:RUNNABLE`),
            fetch(`${cleanUrl}/actuator/metrics/hikaricp.connections.active`),
          ]);

          if (!cpuRes.ok || !memRes.ok || !liveThreadRes.ok) {
            throw new Error("Endpoint failure");
          }

          const cpuJson = await cpuRes.json();
          const memJson = await memRes.json();
          const liveThreadJson = await liveThreadRes.json();

          let runnableThreads = 0;
          if (threadStatesRes.ok) {
            const stateJson = await threadStatesRes.json();
            runnableThreads = stateJson.measurements[0].value;
          }

          let activeDbConns = 0;
          if (dbRes.ok) {
            const dbJson = await dbRes.json();
            activeDbConns = dbJson.measurements[0].value;
          }

          const cpuVal = Number((cpuJson.measurements[0].value * 100).toFixed(1));
          const memValMb = Number((memJson.measurements[0].value / (1024 * 1024)).toFixed(1));
          const liveThreads = liveThreadJson.measurements[0].value;

          return {
            ...app,
            cpu: `${cpuVal}%`,
            memory: `${memValMb} MB`,
            liveThreads: `${liveThreads}`,
            runnableThreads: `${runnableThreads}`,
            dbConnections: `${activeDbConns}`,
            status: "Online" as const,
          };
        } catch (error) {
          return {
            ...app,
            cpu: "---",
            memory: "---",
            liveThreads: "---",
            runnableThreads: "---",
            dbConnections: "---",
            status: "Offline" as const,
          };
        }
      }),
    );

    setApps(updatedApps);
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    fetchAllMetrics();
    intervalRef.current = setInterval(fetchAllMetrics, 3000);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const toggleMonitor = () => {
    if (isMonitoring) stopMonitoring();
    else startMonitoring();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white font-sans p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-400">Multi-Service System Monitor</h1>
          <button
            onClick={toggleMonitor}
            className={`px-6 py-2 rounded font-semibold transition text-white ${
              isMonitoring ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isMonitoring ? "Stop Global Monitoring" : "Start Global Monitoring"}
          </button>
        </div>

        {/* Grid layout for the 3 Spring Boot Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-gray-800 rounded-lg p-5 shadow-lg border border-gray-700 flex flex-col justify-between"
            >
              {/* Card Header & Configuration */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <input
                    type="text"
                    value={app.name}
                    onChange={(e) => handleNameChange(app.id, e.target.value)}
                    className="bg-transparent font-semibold text-lg text-indigo-300 border-b border-transparent focus:border-indigo-500 focus:outline-none w-2/3"
                  />
                  <span
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      app.status === "Online"
                        ? "bg-green-900 text-green-300 border border-green-700"
                        : app.status === "Offline"
                          ? "bg-red-900 text-red-300 border border-red-700"
                          : "bg-yellow-900 text-yellow-300 border border-yellow-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="text-xs text-gray-400 block mb-1">Base URL</label>
                  <input
                    type="text"
                    value={app.url}
                    onChange={(e) => handleUrlChange(app.id, e.target.value)}
                    disabled={isMonitoring}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Stats Grid for the Service */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-gray-900/50 p-3 rounded border-l-2 border-blue-500">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">CPU Usage</p>
                  <p className="text-lg font-bold mt-0.5">{app.cpu}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded border-l-2 border-green-500">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Memory Used</p>
                  <p className="text-lg font-bold mt-0.5">{app.memory}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded border-l-2 border-yellow-500">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">Live Threads</p>
                  <p className="text-lg font-bold mt-0.5">{app.liveThreads}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded border-l-2 border-orange-500">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">
                    Runnable Threads
                  </p>
                  <p className="text-lg font-bold mt-0.5">{app.runnableThreads}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded border-l-2 border-purple-500 col-span-2">
                  <p className="text-gray-400 text-[10px] uppercase tracking-wider">
                    Active DB Connections
                  </p>
                  <p className="text-lg font-bold mt-0.5">{app.dbConnections}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
