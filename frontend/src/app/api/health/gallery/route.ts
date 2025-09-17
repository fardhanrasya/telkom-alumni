import { NextRequest, NextResponse } from "next/server";
import { revalidationManager } from "@/lib/revalidation-manager";
import {
  webhookCircuitBreaker,
  revalidationCircuitBreaker,
} from "@/lib/error-recovery";
import { getLastUpdateTimestamp } from "@/sanity/services/gallery";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    webhook: ServiceHealth;
    revalidation: ServiceHealth;
    sanity: ServiceHealth;
    queue: QueueHealth;
  };
  metrics: {
    uptime: number;
    lastGalleryUpdate: number;
    totalRequests: number;
  };
}

interface ServiceHealth {
  status: "healthy" | "degraded" | "unhealthy";
  circuitBreaker?: {
    state: string;
    failureCount: number;
    successCount: number;
  };
  lastCheck: string;
  error?: string;
}

interface QueueHealth {
  status: "healthy" | "degraded" | "unhealthy";
  pending: number;
  processing: boolean;
}

// Simple metrics store (in production, use Redis or similar)
let metrics = {
  startTime: Date.now(),
  totalRequests: 0,
  lastHealthCheck: Date.now(),
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    metrics.totalRequests++;
    metrics.lastHealthCheck = Date.now();

    // Check Sanity connectivity
    const sanityHealth = await checkSanityHealth();

    // Check webhook circuit breaker
    const webhookHealth = checkWebhookHealth();

    // Check revalidation circuit breaker
    const revalidationHealth = checkRevalidationHealth();

    // Check queue status
    const queueHealth = checkQueueHealth();

    // Get last gallery update timestamp
    let lastGalleryUpdate = 0;
    try {
      lastGalleryUpdate = await getLastUpdateTimestamp();
    } catch (error) {
      // Non-critical error, continue with health check
    }

    // Determine overall health status
    const services = {
      webhook: webhookHealth,
      revalidation: revalidationHealth,
      sanity: sanityHealth,
      queue: queueHealth,
    };

    const overallStatus = determineOverallStatus(services);

    const healthStatus: HealthStatus = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services,
      metrics: {
        uptime: Date.now() - metrics.startTime,
        lastGalleryUpdate,
        totalRequests: metrics.totalRequests,
      },
    };

    const statusCode =
      overallStatus === "healthy"
        ? 200
        : overallStatus === "degraded"
          ? 200
          : 503;

    return NextResponse.json(healthStatus, { status: statusCode });
  } catch (error) {
    const errorStatus: HealthStatus = {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        webhook: {
          status: "unhealthy",
          lastCheck: new Date().toISOString(),
          error: String(error),
        },
        revalidation: {
          status: "unhealthy",
          lastCheck: new Date().toISOString(),
        },
        sanity: { status: "unhealthy", lastCheck: new Date().toISOString() },
        queue: { status: "unhealthy", pending: 0, processing: false },
      },
      metrics: {
        uptime: Date.now() - metrics.startTime,
        lastGalleryUpdate: 0,
        totalRequests: metrics.totalRequests,
      },
    };

    return NextResponse.json(errorStatus, { status: 503 });
  }
}

async function checkSanityHealth(): Promise<ServiceHealth> {
  try {
    // Simple connectivity test
    const timestamp = await getLastUpdateTimestamp();

    return {
      status: "healthy",
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "unhealthy",
      lastCheck: new Date().toISOString(),
      error: String(error),
    };
  }
}

function checkWebhookHealth(): ServiceHealth {
  const circuitState = webhookCircuitBreaker.getState();

  let status: "healthy" | "degraded" | "unhealthy" = "healthy";

  if (circuitState.state === "OPEN") {
    status = "unhealthy";
  } else if (
    circuitState.state === "HALF_OPEN" ||
    circuitState.failureCount > 0
  ) {
    status = "degraded";
  }

  return {
    status,
    circuitBreaker: {
      state: circuitState.state,
      failureCount: circuitState.failureCount,
      successCount: circuitState.successCount,
    },
    lastCheck: new Date().toISOString(),
  };
}

function checkRevalidationHealth(): ServiceHealth {
  const circuitState = revalidationCircuitBreaker.getState();

  let status: "healthy" | "degraded" | "unhealthy" = "healthy";

  if (circuitState.state === "OPEN") {
    status = "unhealthy";
  } else if (
    circuitState.state === "HALF_OPEN" ||
    circuitState.failureCount > 0
  ) {
    status = "degraded";
  }

  return {
    status,
    circuitBreaker: {
      state: circuitState.state,
      failureCount: circuitState.failureCount,
      successCount: circuitState.successCount,
    },
    lastCheck: new Date().toISOString(),
  };
}

function checkQueueHealth(): QueueHealth {
  const queueStatus = revalidationManager.getQueueStatus();

  let status: "healthy" | "degraded" | "unhealthy" = "healthy";

  if (queueStatus.pending > 10) {
    status = "degraded";
  } else if (queueStatus.pending > 50) {
    status = "unhealthy";
  }

  return {
    status,
    pending: queueStatus.pending,
    processing: queueStatus.processing,
  };
}

function determineOverallStatus(
  services: HealthStatus["services"]
): "healthy" | "degraded" | "unhealthy" {
  const statuses = Object.values(services).map((service) => service.status);

  if (statuses.some((status) => status === "unhealthy")) {
    return "unhealthy";
  }

  if (statuses.some((status) => status === "degraded")) {
    return "degraded";
  }

  return "healthy";
}

// Metrics endpoint
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    if (body.action === "reset-metrics") {
      metrics = {
        startTime: Date.now(),
        totalRequests: 0,
        lastHealthCheck: Date.now(),
      };

      // Reset circuit breakers
      webhookCircuitBreaker.reset();
      revalidationCircuitBreaker.reset();

      return NextResponse.json({ message: "Metrics reset successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
