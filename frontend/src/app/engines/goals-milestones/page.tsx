"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { GoalsMilestonesEngine } from "@/components/GoalsMilestonesEngine";

export default function GoalsMilestonesPage() {
  return (
    <DashboardShell
      title="Life Milestone & Wedding Goal Planner"
      subtitle="Calculate exact monthly SIP required for weddings, car down payments, or home purchases factoring in parent contributions & SGB gold hedges."
      badge="Core Engine 5"
    >
      <GoalsMilestonesEngine monthlyIncome={75000} />
    </DashboardShell>
  );
}
