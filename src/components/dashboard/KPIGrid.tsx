"use client";

import { BusinessKPIs } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Flame, Heart, ShieldCheck, TrendingDown,
  CheckCircle2, XCircle, Activity, Users,
} from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  color: "indigo" | "emerald" | "rose" | "amber" | "violet" | "cyan";
  bar?: number;        // 0–100
  status?: "good" | "warn" | "bad";
}

const COLOR_MAP = {
  indigo: { icon: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20", bar: "bg-indigo-500" },
  emerald:{ icon: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20",bar: "bg-emerald-500"},
  rose:   { icon: "text-rose-400",   bg: "bg-rose-500/10",   border: "border-rose-500/20",   bar: "bg-rose-500"  },
  amber:  { icon: "text-amber-400",  bg: "bg-amber-500/10",  border: "border-amber-500/20",  bar: "bg-amber-500" },
  violet: { icon: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20", bar: "bg-violet-500"},
  cyan:   { icon: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   bar: "bg-cyan-500"  },
};

function KPICard({ label, value, sub, icon: Icon, color, bar, status }: KPICardProps) {
  const c = COLOR_MAP[color];
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 space-y-4 hover:border-slate-600/60 transition-colors">
      <div className="flex items-start justify-between">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", c.bg, `border ${c.border}`)}>
          <Icon className={cn("w-4 h-4", c.icon)} />
        </div>
        {status && (
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            status === "good" ? "bg-emerald-500/10 text-emerald-400"
            : status === "warn" ? "bg-amber-500/10 text-amber-400"
            : "bg-rose-500/10 text-rose-400"
          )}>
            {status === "good" ? "Good" : status === "warn" ? "Monitor" : "Alert"}
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        <p className="text-slate-500 text-xs mt-1.5">{label}</p>
      </div>

      {bar !== undefined && (
        <div className="space-y-1.5">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", c.bar)}
              style={{ width: `${Math.min(bar, 100)}%` }}
            />
          </div>
          <p className="text-slate-600 text-xs">{sub}</p>
        </div>
      )}
      {bar === undefined && <p className="text-slate-600 text-xs">{sub}</p>}
    </div>
  );
}

export default function KPIGrid({ kpis }: { kpis: BusinessKPIs }) {
  const { customer_frustration_index, agent_empathy_score, issue_resolved, churn_risk } = kpis;

  const frustrationStatus: KPICardProps["status"] =
    customer_frustration_index >= 7 ? "bad" : customer_frustration_index >= 4 ? "warn" : "good";
  const empathyStatus: KPICardProps["status"] =
    agent_empathy_score >= 7 ? "good" : agent_empathy_score >= 5 ? "warn" : "bad";
  const churnStatus: KPICardProps["status"] =
    churn_risk === "High" ? "bad" : churn_risk === "Medium" ? "warn" : "good";

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h3 className="text-white font-semibold">Business KPIs</h3>
        <p className="text-slate-500 text-sm mt-0.5">Computed performance metrics</p>
      </div>

      <div className="grid grid-cols-2 gap-3 flex-1">
        <KPICard
          label="Customer Frustration Index"
          value={`${customer_frustration_index} / 10`}
          sub={`${Math.round(customer_frustration_index * 10)}% frustration intensity`}
          icon={Flame}
          color="rose"
          bar={customer_frustration_index * 10}
          status={frustrationStatus}
        />
        <KPICard
          label="Agent Empathy Score"
          value={`${agent_empathy_score} / 10`}
          sub={`${Math.round(agent_empathy_score * 10)}% empathy rating`}
          icon={Heart}
          color="emerald"
          bar={agent_empathy_score * 10}
          status={empathyStatus}
        />
        <KPICard
          label="Issue Resolution"
          value={issue_resolved ? "Resolved" : "Unresolved"}
          sub={issue_resolved ? "Customer query addressed" : "Requires follow-up action"}
          icon={issue_resolved ? CheckCircle2 : XCircle}
          color={issue_resolved ? "emerald" : "rose"}
          status={issue_resolved ? "good" : "bad"}
        />
        <KPICard
          label="Churn Risk Level"
          value={churn_risk}
          sub="Customer retention signal"
          icon={TrendingDown}
          color={churn_risk === "High" ? "rose" : churn_risk === "Medium" ? "amber" : "emerald"}
          status={churnStatus}
        />
        <KPICard
          label="Compliance Signal"
          value="Clear"
          sub="No regulatory flags detected"
          icon={ShieldCheck}
          color="cyan"
          status="good"
        />
        <KPICard
          label="Interaction Quality"
          value={agent_empathy_score >= 7 && issue_resolved ? "High" : agent_empathy_score >= 5 ? "Medium" : "Low"}
          sub="Overall CX interaction grade"
          icon={Activity}
          color="violet"
          status={agent_empathy_score >= 7 && issue_resolved ? "good" : agent_empathy_score >= 5 ? "warn" : "bad"}
        />
      </div>
    </div>
  );
}
