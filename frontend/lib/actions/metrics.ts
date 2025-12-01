"use server";

interface MetricsResponse {
  success: boolean;
  data: {
    overview: {
      totalReferrals: number;
      activeReferrals: number;
      completedThisMonth: number;
      pendingReview: number;
      averageProcessingTime: string;
      successRate: number;
    };
    referralsByStatus: {
      pending?: number;
      scheduled?: number;
      inProgress?: number;
      completed?: number;
      cancelled?: number;
    };
    topSpecialties: Array<{
      specialty: string;
      count: number;
      percentage: number;
    }>;
    insuranceBreakdown: {
      topPayers: Array<{
        payer: string;
        count: number;
        approvalRate: number;
      }>;
    };
    appointments: {
      upcomingToday?: number;
      upcomingThisWeek?: number;
      upcomingThisMonth?: number;
    };
    providers: {
      totalSpecialists: number;
      availableSpecialists: number;
      utilizationRate: number;
    };
    trends: {
      dailyReferrals: Array<{
        date: string;
        count: number;
      }>;
    };
    urgencyLevels: Record<string, number>;
    efficiency: {
      averageExtractionTime: string;
      averageOrchestrationTime: string;
    };
    alerts: {
      pendingOver48h: number;
      upcomingHighRiskNoShows: number;
      totalAlerts: number;
    };
    timestamp: string;
  };
}

export async function getMetrics(): Promise<MetricsResponse | null> {
  try {
    const response = await fetch(`${process.env.BACKEND_BASE}/metrics`);

    if (!response.ok) {
      throw new Error(`Metrics fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data as MetricsResponse;
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return null;
  }
}
