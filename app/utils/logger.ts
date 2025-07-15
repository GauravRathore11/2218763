// utils/logger.ts
export type LogLevel = "error" | "warn" | "info" | "debug" | "fatal";
export type LogPackage = "handler" | "db" | "ui" | "network"; 
export type LogStack = "frontend" | "backend"; 

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";

export async function Log(
  stack: LogStack,
  level: LogLevel,
  pkg: LogPackage,
  message: string
): Promise<void> {
  try {
    const body = {
      stack,
      level,
      package: pkg,
      message,
    };

    const response = await fetch(LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("Logging failed:", response.statusText);
    }
  } catch (err) {
    console.error("Error sending log:", err);
  }
}
