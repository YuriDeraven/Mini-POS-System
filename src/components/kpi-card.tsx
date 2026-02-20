"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  change?: number
  changeLabel?: string
  icon: React.ComponentType<{ className?: string }>
  trend?: "up" | "down" | "neutral"
}

export function KPICard({ title, value, change, changeLabel, icon: Icon, trend = "neutral" }: KPICardProps) {
  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-slate-600",
  }

  const trendBgColors = {
    up: "bg-emerald-50",
    down: "bg-red-50",
    neutral: "bg-slate-100",
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/50 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A1A1A]">
          <Icon className="h-6 w-6 text-[#FFC107]" />
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium", trendBgColors[trend])}>
            {trend === "up" ? (
              <TrendingUp className="h-3 w-3" />
            ) : trend === "down" ? (
              <TrendingDown className="h-3 w-3" />
            ) : null}
            <span className={trendColors[trend]}>{change > 0 ? "+" : ""}{change}%</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
        {changeLabel && <p className="mt-1 text-xs text-slate-400">{changeLabel}</p>}
      </div>
    </div>
  )
}
