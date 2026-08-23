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
  requestsPerSec: string;
  responsesPerSec: string;
  avgResponseTime: string;
  kafkaMsgPerSec: string;
  kafkaProcessingTime: string;
  status: "Online" | "Offline" | "Connecting...";
}

interface StatCache {
  prevCount: number;
  prevTime: number;
  prevKafkaCount: number;
}

const PIPELINE_BLUEPRINT = [
  {
    layerName: "1. Ingest & Raw Logs Layer",
    description: "Accepts incoming client traffic and produces raw logs.",
    consumerGroup: "request_logs_group",
    sourceTopics: ["request_logs"],
    targetType: "Minute Analytics Rollups",
  },
  {
    layerName: "2. Minute Processing Layer",
    description: "Consumes raw logs and aggregates sliding window metrics every minute.",
    consumerGroup: "sentinel-analytics",
    sourceTopics: [
      "tenant_minute_analytics",
      "product_minute_analytics",
      "service_minute_analytics",
      "endpoint_minute_analytics",
    ],
    targetType: "Hour Analytics Rollups",
  },
  {
    layerName: "3. Hour Processing Layer",
    description: "Rolls minute streams up into hourly buckets.",
    consumerGroup: "sentinel-analytics",
    sourceTopics: [
      "tenant_hour_analytics",
      "product_hour_analytics",
      "service_hour_analytics",
      "endpoint_hour_analytics",
    ],
    targetType: "Day Analytics Rollups",
  },
  {
    layerName: "4. Day Processing & Cassandra Sink Layer",
    description: "Aggregates hourly streams into daily stats and writes to Cassandra tables.",
    consumerGroup: "sentinel-analytics",
    sourceTopics: [
      "tenant_day_analytics",
      "product_day_analytics",
      "service_day_analytics",
      "endpoint_day_analytics",
    ],
    targetType: "Persistent Cassandra Tables",
  },
];

export default function SystemMonitorPage() {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const [topicStatsMap, setTopicStatsMap] = useState<{ [key: string]: any }>({});

  const [apps, setApps] = useState<AppMetrics[]>([
    {
      id: 1,
      name: "Main Server",
      url: "http://localhost:3000/api/",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      requestsPerSec: "0.0/s",
      responsesPerSec: "0.0/s",
      avgResponseTime: "0 ms",
      kafkaMsgPerSec: "0.0/s",
      kafkaProcessingTime: "0 ms",
      status: "Offline",
    },
    {
      id: 2,
      name: "Ingest Server",
      url: "http://localhost:3000/api/ingest/",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      requestsPerSec: "0.0/s",
      responsesPerSec: "0.0/s",
      avgResponseTime: "0 ms",
      kafkaMsgPerSec: "0.0/s",
      kafkaProcessingTime: "0 ms",
      status: "Offline",
    },
    {
      id: 3,
      name: "Processor Server",
      url: "http://localhost:3000/api/processor/",
      cpu: "0.0%",
      memory: "0 MB",
      liveThreads: "0",
      runnableThreads: "0",
      dbConnections: "0",
      requestsPerSec: "0.0/s",
      responsesPerSec: "0.0/s",
      avgResponseTime: "0 ms",
      kafkaMsgPerSec: "0.0/s",
      kafkaProcessingTime: "0 ms",
      status: "Offline",
    },
  ]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statsCacheRef = useRef<{ [key: number]: StatCache }>({});

  const handleUrlChange = (id: number, newUrl: string) => {
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, url: newUrl } : app)));
  };

  const handleNameChange = (id: number, newName: string) => {
    setApps((prev) => prev.map((app) => (app.id === id ? { ...app, name: newName } : app)));
  };

  const fetchAllMetrics = async () => {
    const now = Date.now();
    const updatedApps = await Promise.all(
      apps.map(async (app) => {
        const cleanUrl = app.url.trim().replace(/\/$/, "");
        const isProcessor = app.name.toLowerCase().includes("processor");

        try {
          const [
            cpuRes,
            memRes,
            liveThreadRes,
            threadStatesRes,
            dbRes,
            reqRes,
            customStatsRes,
            topoRes,
          ] = await Promise.all([
            fetch(`${cleanUrl}/actuator/metrics/system.cpu.usage`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.memory.used`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.threads.live`),
            fetch(`${cleanUrl}/actuator/metrics/jvm.threads.states?tag=state:runnable`),
            fetch(`${cleanUrl}/actuator/metrics/hikaricp.connections.active`),
            fetch(`${cleanUrl}/actuator/metrics/http.server.requests`),
            isProcessor ? fetch(`${cleanUrl}/kafka-topology/stats`) : Promise.resolve(null),
            isProcessor ? fetch(`${cleanUrl}/kafka-topology`) : Promise.resolve(null),
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

          let totalRequests = 0;
          let totalTimeSum = 0;
          if (reqRes.ok) {
            const reqJson = await reqRes.json();
            totalRequests =
              reqJson.measurements.find((m: any) => m.statistic === "COUNT")?.value || 0;
            totalTimeSum =
              reqJson.measurements.find((m: any) => m.statistic === "TOTAL_TIME")?.value || 0;
          }

          let kafkaTotalMessages = 0;
          let kafkaAvgLatencyMs = 0;
          if (isProcessor && customStatsRes && customStatsRes.ok) {
            const statsJson = await customStatsRes.json();
            kafkaTotalMessages = statsJson.totalMessages || 0;
            kafkaAvgLatencyMs = statsJson.avgLatencyMs || 0;
          }

          if (isProcessor && topoRes && topoRes.ok) {
            const topoJson = await topoRes.json();
            const map: { [key: string]: any } = {};
            if (topoJson.topics) {
              topoJson.topics.forEach((t: any) => {
                map[t.topicName] = t;
              });
            }
            setTopicStatsMap(map);
          }

          const cached = statsCacheRef.current[app.id] || {
            prevCount: totalRequests,
            prevTime: now,
            prevKafkaCount: kafkaTotalMessages,
          };
          const timeElapsedSec = (now - cached.prevTime) / 1000;

          let rps = 0;
          let kafkaRps = 0;
          if (timeElapsedSec > 0) {
            rps = Math.max(0, totalRequests - cached.prevCount) / timeElapsedSec;
            if (isProcessor) {
              kafkaRps = Math.max(0, kafkaTotalMessages - cached.prevKafkaCount) / timeElapsedSec;
            }
          }

          statsCacheRef.current[app.id] = {
            prevCount: totalRequests,
            prevTime: now,
            prevKafkaCount: kafkaTotalMessages,
          };

          const avgTimeMs = totalRequests > 0 ? (totalTimeSum * 1000) / totalRequests : 0;
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
            requestsPerSec: `${rps.toFixed(1)}/s`,
            responsesPerSec: `${rps.toFixed(1)}/s`,
            avgResponseTime: `${avgTimeMs.toFixed(1)} ms`,
            kafkaMsgPerSec: isProcessor ? `${kafkaRps.toFixed(1)}/s` : app.kafkaMsgPerSec,
            kafkaProcessingTime: isProcessor
              ? `${kafkaAvgLatencyMs.toFixed(1)} ms`
              : app.kafkaProcessingTime,
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
            requestsPerSec: "---",
            responsesPerSec: "---",
            avgResponseTime: "---",
            kafkaMsgPerSec: "---",
            kafkaProcessingTime: "---",
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

  const processorApp = apps.find((app) => app.name.toLowerCase().includes("processor")) || apps[2];

  return (
    <div className="bg-gray-900 text-white font-sans p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-indigo-400">Project-Sentinel System Monitor</h1>
          <button
            onClick={toggleMonitor}
            className={`px-4 py-1.5 rounded text-sm font-semibold transition text-white ${
              isMonitoring ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {isMonitoring ? "Stop Global Monitoring" : "Start Global Monitoring"}
          </button>
        </div>

        {/* Grid layout for services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-gray-800 rounded-lg p-3.5 shadow-lg border border-gray-700 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <input
                    type="text"
                    value={app.name}
                    onChange={(e) => handleNameChange(app.id, e.target.value)}
                    className="bg-transparent font-semibold text-base text-indigo-300 border-b border-transparent focus:border-indigo-500 focus:outline-none w-2/3"
                  />
                  <span
                    className={`px-2 py-0.5 text-[10px] rounded font-medium ${
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

                <div className="mb-2.5">
                  <label className="text-[10px] text-gray-400 block mb-0.5">Base URL</label>
                  <input
                    type="text"
                    value={app.url}
                    onChange={(e) => handleUrlChange(app.id, e.target.value)}
                    disabled={isMonitoring}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-blue-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">CPU</p>
                  <p className="text-sm font-bold mt-0.5">{app.cpu}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-green-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">Memory</p>
                  <p className="text-sm font-bold mt-0.5">{app.memory}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-yellow-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">Threads</p>
                  <p className="text-sm font-bold mt-0.5">{app.liveThreads}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-purple-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">DB Conns</p>
                  <p className="text-sm font-bold mt-0.5">{app.dbConnections}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-teal-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">Req / Sec</p>
                  <p className="text-sm font-bold mt-0.5">{app.requestsPerSec}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-pink-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">Avg Latency</p>
                  <p className="text-sm font-bold mt-0.5">{app.avgResponseTime}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-amber-500">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">Kafka Msg/s</p>
                  <p className="text-sm font-bold mt-0.5">{app.kafkaMsgPerSec}</p>
                </div>
                <div className="bg-gray-900/50 p-2 rounded border-l-2 border-amber-300 col-span-2">
                  <p className="text-gray-400 text-[9px] uppercase tracking-wider">
                    Kafka Stream Latency
                  </p>
                  <p className="text-sm font-bold mt-0.5">{app.kafkaProcessingTime}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Blueprint-Based Data Pipeline Diagram with Multi-Listener Partition Breakdown */}
        <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <span>📊</span> Clean Architecture Data Pipeline & Partition Metrics
            </h2>
            <div className="text-xs text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span>{" "}
                Throughput: <strong className="text-white">{processorApp.kafkaMsgPerSec}</strong>
              </span>
            </div>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {PIPELINE_BLUEPRINT.map((layer, layerIdx) => (
              <div key={layerIdx} className="bg-gray-900/80 p-4 rounded-xl border border-gray-700">
                <div className="flex justify-between items-center border-b border-gray-800 pb-2 mb-3">
                  <div>
                    <h3 className="text-indigo-300 font-bold text-sm">{layer.layerName}</h3>
                    <p className="text-gray-400 text-[11px] font-sans mt-0.5">
                      {layer.description}
                    </p>
                  </div>
                  <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
                    Group: {layer.consumerGroup}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {layer.sourceTopics.map((topicName, tIdx) => {
                    const stats = topicStatsMap[topicName] || {
                      currentOffset: 0,
                      consumerGroups: [],
                    };

                    // Fallback support if single group data format is passed
                    const groupsToRender =
                      stats.consumerGroups && stats.consumerGroups.length > 0
                        ? stats.consumerGroups
                        : [
                            {
                              consumerGroupId: stats.consumerGroupId || layer.consumerGroup,
                              consumerLag: stats.consumerLag ?? 0,
                              activeConsumers: stats.activeConsumers || [],
                            },
                          ];

                    return (
                      <div key={tIdx} className="bg-gray-950 p-3 rounded-lg border border-gray-800">
                        <div className="text-amber-400 font-bold truncate mb-2" title={topicName}>
                          📦 {topicName}
                        </div>
                        <div className="flex justify-between items-center text-[11px] mb-3">
                          <span className="text-gray-400">Total Log Offset:</span>
                          <span className="text-white font-bold">{stats.currentOffset ?? 0}</span>
                        </div>

                        {/* Render each independent consumer group listener (Streams app + Cassandra listener) */}
                        {groupsToRender.map((group: any, gIdx: number) => (
                          <div
                            key={gIdx}
                            className="mb-2.5 pb-2 border-b border-gray-800/80 last:border-0 last:mb-0 last:pb-0"
                          >
                            <div className="flex justify-between items-center text-[10px] mb-1">
                              <span
                                className="text-emerald-400 font-semibold truncate max-w-[110px]"
                                title={group.consumerGroupId}
                              >
                                👥 {group.consumerGroupId}
                              </span>
                              <span
                                className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                  group.consumerLag > 0
                                    ? "text-red-400 bg-red-950/60"
                                    : "text-emerald-400 bg-emerald-950/60"
                                }`}
                              >
                                Lag: {group.consumerLag}
                              </span>
                            </div>

                            {/* Partition thread breakdown per listener group */}
                            <div className="space-y-1 mt-1">
                              {group.activeConsumers && group.activeConsumers.length > 0 ? (
                                group.activeConsumers.map((consumer: any, cIdx: number) => (
                                  <div
                                    key={cIdx}
                                    className="bg-gray-900 p-1.5 rounded flex justify-between items-center text-[10px]"
                                  >
                                    <span className="text-blue-300 truncate">
                                      P{consumer.assignedPartition}
                                    </span>
                                    <span className="text-gray-300">
                                      Off: {consumer.offset} | Lag:{" "}
                                      <strong className="text-red-400">{consumer.lag}</strong>
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-gray-500 italic">
                                  No Active Threads
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {layer.targetType && (
                  <div className="mt-3 text-right text-[11px] text-purple-400 font-sans flex items-center justify-end gap-1">
                    <span>Downstream Sink Target ➔</span>
                    <strong className="text-purple-200">{layer.targetType}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
