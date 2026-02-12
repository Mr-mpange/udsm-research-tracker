import { downloadTrendData, journals } from "@/data/mockData";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export function TrendChart() {
  const [filter, setFilter] = useState<string>("all");

  const dataKey = filter === "all" ? "downloads" : filter;

  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">Download Trends</h2>
          <p className="text-xs text-muted-foreground font-sans-ui">Monthly download statistics</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border rounded-md px-3 py-1.5 bg-background text-foreground font-sans-ui"
        >
          <option value="all">All Journals</option>
          <option value="Tanzania Journal of Science">Tanzania J. of Science</option>
          <option value="Tanzania Journal of Health Research">Tanzania J. of Health Research</option>
          <option value="Other">Other Journals</option>
        </select>
      </div>
      <div className="p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={downloadTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 20% 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fontFamily: "system-ui" }} stroke="hsl(210 15% 45%)" />
            <YAxis tick={{ fontSize: 12, fontFamily: "system-ui" }} stroke="hsl(210 15% 45%)" />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(210 20% 88%)",
                fontFamily: "system-ui",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(210 100% 20%)"
              strokeWidth={2.5}
              dot={{ fill: "hsl(48 100% 50%)", stroke: "hsl(210 100% 20%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(48 100% 50%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
