import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jul", atual: 180, previsto: 170 },
  { month: "Ago", atual: 220, previsto: 210 },
  { month: "Set", atual: 195, previsto: 230 },
  { month: "Out", atual: 280, previsto: 260 },
  { month: "Nov", atual: 310, previsto: 290 },
  { month: "Dez", atual: 350, previsto: 320 },
  { month: "Jan", atual: 290, previsto: 340 },
  { month: "Fev", atual: 380, previsto: 360 },
  { month: "Mar", atual: null, previsto: 400 },
  { month: "Abr", atual: null, previsto: 430 },
];

export function RevenueChart() {
  return (
    <div className="rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-card-foreground">Receita vs Previsão AI</h2>
        <div className="flex items-center gap-4 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Realizado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" /> Previsão IA
          </span>
        </div>
      </div>
      <div className="p-4 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(210, 100%, 56%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(38, 92%, 58%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(38, 92%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215, 12%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}K`} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "hsl(210, 20%, 92%)" }}
            />
            <Area type="monotone" dataKey="atual" stroke="hsl(210, 100%, 56%)" fill="url(#colorAtual)" strokeWidth={2} connectNulls={false} />
            <Area type="monotone" dataKey="previsto" stroke="hsl(38, 92%, 58%)" fill="url(#colorPrevisto)" strokeWidth={2} strokeDasharray="4 4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
