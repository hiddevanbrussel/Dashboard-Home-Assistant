"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboards");
  }, [router]);
  return null;
}
