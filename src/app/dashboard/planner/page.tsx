"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function PlannerRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const exam = searchParams?.get("exam");
    router.replace(exam ? `/planner?exam=${exam}` : "/planner");
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#FF4D00] flex items-center justify-center font-headline text-black text-xl">
      Redirecting to Exam Planner...
    </div>
  );
}

export default function DashboardPlannerRedirect() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FF4D00] flex items-center justify-center font-headline text-black text-xl">
          Redirecting to Exam Planner...
        </div>
      }
    >
      <PlannerRedirectContent />
    </Suspense>
  );
}

