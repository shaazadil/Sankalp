"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { ImpulseCoolingSandbox } from "@/components/ImpulseCoolingSandbox";

export default function ImpulseCoolingPage() {
  return (
    <DashboardShell
      title="Impulse Buy 72-Hour Cooling Sandbox"
      subtitle="Convert impulsive desires into human working days and 10-year compounding freedom. Delay the impulse to earn cash."
      badge="Psychology Engine"
    >
      <ImpulseCoolingSandbox monthlyIncome={75000} />
    </DashboardShell>
  );
}
