"use client";
import { useId, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { money, number } from "@/lib/ionco-data";
const series: Record<string, number[]> = {
  "7D": [
    38, 42, 39, 46, 43, 48, 52, 49, 51, 62, 58, 64, 63, 70, 66, 73, 72, 75, 69,
    78, 82, 79, 85, 80, 91, 87, 90, 88,
  ],
  "30D": [
    16, 24, 20, 22, 31, 28, 37, 29, 35, 40, 37, 46, 50, 46, 51, 49, 64, 57, 68,
    62, 73, 70, 76, 68, 85, 79, 86, 88,
  ],
  "90D": [
    9, 13, 12, 21, 18, 25, 20, 29, 26, 31, 35, 30, 38, 40, 35, 47, 45, 53, 56,
    49, 65, 63, 58, 71, 69, 78, 76, 88,
  ],
};
export function PortfolioChart({
  value = 11810,
  title = "Portfolio performance",
  price = false,
  admin = false,
}: {
  value?: number;
  title?: string;
  price?: boolean;
  admin?: boolean;
}) {
  const [range, setRange] = useState("30D");
  const uid = useId().replace(/:/g, "");
  const data = series[range];
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 600},${185 - v * 1.75}`)
    .join(" ");
  const path = `M ${points.replace(/ /g, " L ")}`;
  const labels =
    range === "7D"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : range === "30D"
        ? ["Day 1", "Day 5", "Day 10", "Day 15", "Day 20", "Day 25", "Day 30"]
        : [
            "Week 1",
            "Week 3",
            "Week 5",
            "Week 7",
            "Week 9",
            "Week 11",
            "Week 13",
          ];
  return (
    <section className="panel panel-pad">
      <div className="chart-toolbar">
        <div>
          <div className="panel-title">
            <h2>{title}</h2>
          </div>
          <div className="chart-main-value">
            {price
              ? money(value)
              : admin
                ? number(value) + " INC"
                : money(value)}
          </div>
          <div className="chart-sub">
            {price
              ? "Illustrative INC / USDT price"
              : admin
                ? "Current demo staked balance"
                : "Current demo portfolio value"}
          </div>
        </div>
        <Tabs value={range} onValueChange={setRange} className="range-tabs">
          <TabsList aria-label={`${title} time range`}>
            {Object.keys(series).map((r) => (
              <TabsTrigger key={r} value={r}>
                {r}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div className="chart-wrap">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 190"
          preserveAspectRatio="none"
          role="img"
          aria-label={`${range} illustrative ${title.toLowerCase()} chart. Synthetic data, not historical returns.`}
        >
          <defs>
            <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64e5e4" stopOpacity=".2" />
              <stop offset="100%" stopColor="#64e5e4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[30, 75, 120, 165].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="#26404d"
              strokeWidth=".6"
              strokeDasharray="3 5"
            />
          ))}
          <path d={`${path} L 600,190 L 0,190 Z`} fill={`url(#area-${uid})`} />
          <path
            d={path}
            fill="none"
            stroke="#70dcd7"
            strokeWidth="2.3"
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="chart-axis">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
      <div className="chart-note">
        {range} illustrative history · not actual market or account performance
      </div>
    </section>
  );
}
