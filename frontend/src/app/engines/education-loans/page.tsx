"use client";

import React from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { EducationLoanEngine } from "@/components/EducationLoanEngine";

export default function EducationLoanPage() {
  return (
    <DashboardShell
      title="Higher Education Loan & Family EMI Splitter"
      subtitle="Model domestic and international degree debt, 60/40 parent co-payment splits, and 100% tax-free interest under Section 80E."
      badge="Core Engine 4"
    >
      <EducationLoanEngine monthlyIncome={75000} />
    </DashboardShell>
  );
}
