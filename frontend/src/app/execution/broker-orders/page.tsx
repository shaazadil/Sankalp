"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { OneTapBrokerExecution } from "@/components/OneTapBrokerExecution";

export default function BrokerOrdersPage() {
  return (
    <DashboardShell
      title="1-Tap Broker Multi-Basket Execution"
      subtitle="Transform passive budgeting advice into active orders. Directly dispatch SIP allocations to Zerodha, Groww, or Smallcase via UPI AutoPay."
      badge="Order Routing"
    >
      <OneTapBrokerExecution />
    </DashboardShell>
  );
}
