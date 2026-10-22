"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { SabbaticalRunwayTank } from "@/components/SabbaticalRunwayTank";

export default function SabbaticalRunwayPage() {
  return (
    <DashboardShell
      title="Sabbatical & Career Break Runway Tank"
      subtitle="Model career breaks, upskilling, startup attempts, and world travel without liquidating long-term equity."
      badge="Runway Reservoir"
    >
      <SabbaticalRunwayTank />
    </DashboardShell>
  );
}
