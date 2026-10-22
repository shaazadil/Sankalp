"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { AccountAggregatorSync } from "@/components/AccountAggregatorSync";

export default function AccountAggregatorPage() {
  return (
    <DashboardShell
      title="Instant Account Aggregator Bank Sync"
      subtitle="Zero manual CSV uploads. Securely fetch live balances, salary credits, and auto-route them into your 5 Pots via RBI AA framework."
      badge="RBI Account Aggregator"
    >
      <AccountAggregatorSync />
    </DashboardShell>
  );
}
