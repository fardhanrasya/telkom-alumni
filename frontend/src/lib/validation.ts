import { webhookLogger } from "./logger";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface SanityWebhookSchema {
  _type: string;
  _id: string;
  _rev?: string;
  slug?: {
    current: string;
  };
  category?: string;
  operation?: "create" | "update" | "delete";
  projectId?: string;
  dataset?: string;
}

/**
 * Sanitize string input by removing potentially dangerous characters
 */
export function sanitizeString(
  input: string,
  maxLength: number = 1000
): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>\"'&]/g, "") // Remove potentially dangerous HTML characters
    .replace(/[\x00-\x1f\x7f-\x9f]/g, ""); // Remove control characters
}

/**
 * Validate and sanitize Sanity webhook payload
 */
export function validateWebhookPayload(payload: any): ValidationResult {
  const errors: string[] = [];

  // Check if payload is an object
  if (!payload || typeof payload !== "object") {
    return {
      isValid: false,
      errors: ["Payload must be a valid object"],
    };
  }

  // Validate required fields
  if (!payload._type || typeof payload._type !== "string") {
    errors.push("Missing or invalid _type field");
  }

  if (!payload._id || typeof payload._id !== "string") {
    errors.push("Missing or invalid _id field");
  }

  // Validate _type is one of expected values
  const allowedTypes = ["gallery", "post", "page"]; // Add other allowed types
  if (payload._type && !allowedTypes.includes(payload._type)) {
    errors.push(`Invalid document type: ${payload._type}`);
  }

  // Validate _id format (Sanity IDs are typically alphanumeric with dashes)
  if (payload._id && !/^[a-zA-Z0-9\-_]+$/.test(payload._id)) {
    errors.push("Invalid _id format");
  }

  // Validate optional fields
  if (payload._rev && typeof payload._rev !== "string") {
    errors.push("Invalid _rev field");
  }

  if (
    payload.operation &&
    !["create", "update", "delete"].includes(payload.operation)
  ) {
    errors.push(`Invalid operation: ${payload.operation}`);
  }

  // Validate slug structure
  if (payload.slug) {
    if (typeof payload.slug !== "object" || !payload.slug.current) {
      errors.push("Invalid slug structure");
    } else if (typeof payload.slug.current !== "string") {
      errors.push("Invalid slug.current field");
    } else if (!/^[a-zA-Z0-9\-_]+$/.test(payload.slug.current)) {
      errors.push("Invalid slug format");
    }
  }

  // Validate category
  if (payload.category && typeof payload.category !== "string") {
    errors.push("Invalid category field");
  }

  // Validate project and dataset
  if (payload.projectId && typeof payload.projectId !== "string") {
    errors.push("Invalid projectId field");
  }

  if (payload.dataset && typeof payload.dataset !== "string") {
    errors.push("Invalid dataset field");
  }

  // If validation failed, return errors
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  // Sanitize the payload
  const sanitizedData: SanityWebhookSchema = {
    _type: sanitizeString(payload._type, 50),
    _id: sanitizeString(payload._id, 100),
  };

  if (payload._rev) {
    sanitizedData._rev = sanitizeString(payload._rev, 100);
  }

  if (payload.slug?.current) {
    sanitizedData.slug = {
      current: sanitizeString(payload.slug.current, 200),
    };
  }

  if (payload.category) {
    sanitizedData.category = sanitizeString(payload.category, 100);
  }

  if (payload.operation) {
    sanitizedData.operation = payload.operation as
      | "create"
      | "update"
      | "delete";
  }

  if (payload.projectId) {
    sanitizedData.projectId = sanitizeString(payload.projectId, 50);
  }

  if (payload.dataset) {
    sanitizedData.dataset = sanitizeString(payload.dataset, 50);
  }

  return {
    isValid: true,
    errors: [],
    sanitizedData,
  };
}

/**
 * Validate request headers
 */
export function validateWebhookHeaders(headers: Headers): ValidationResult {
  const errors: string[] = [];

  // Check for required headers
  const signature = headers.get("sanity-webhook-signature");
  if (!signature) {
    errors.push("Missing sanity-webhook-signature header");
  } else if (!signature.startsWith("sha256=")) {
    errors.push("Invalid signature format");
  }

  const contentType = headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    errors.push("Invalid or missing content-type header");
  }

  // Validate user-agent (Sanity webhooks should have a specific user-agent)
  const userAgent = headers.get("user-agent");
  if (userAgent && !userAgent.includes("Sanity")) {
    // This is a warning, not an error, as user-agent can be spoofed
    webhookLogger.error("Suspicious user-agent detected", { userAgent });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate request size
 */
export function validateRequestSize(
  body: string,
  maxSize: number = 10 * 1024
): ValidationResult {
  const bodySize = Buffer.byteLength(body, "utf8");

  if (bodySize > maxSize) {
    return {
      isValid: false,
      errors: [
        `Request body too large: ${bodySize} bytes (max: ${maxSize} bytes)`,
      ],
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

/**
 * Comprehensive webhook request validation
 */
export function validateWebhookRequest(
  headers: Headers,
  body: string,
  maxBodySize: number = 10 * 1024
): ValidationResult {
  const errors: string[] = [];

  // Validate headers
  const headerValidation = validateWebhookHeaders(headers);
  if (!headerValidation.isValid) {
    errors.push(...headerValidation.errors);
  }

  // Validate request size
  const sizeValidation = validateRequestSize(body, maxBodySize);
  if (!sizeValidation.isValid) {
    errors.push(...sizeValidation.errors);
  }

  // Parse and validate JSON payload
  let payload: any;
  try {
    payload = JSON.parse(body);
  } catch (error) {
    errors.push("Invalid JSON payload");
    return {
      isValid: false,
      errors,
    };
  }

  // Validate payload structure
  const payloadValidation = validateWebhookPayload(payload);
  if (!payloadValidation.isValid) {
    errors.push(...payloadValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: payloadValidation.sanitizedData,
  };
}

/**
 * Validate IP address format
 */
export function validateIPAddress(ip: string): boolean {
  // IPv4 regex
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip) || ip === "unknown";
}

/**
 * Check if IP is from allowed ranges (if you want to whitelist Sanity IPs)
 */
export function isAllowedIP(ip: string): boolean {
  // In production, you might want to whitelist Sanity's IP ranges
  // For now, we'll allow all IPs but log suspicious ones

  if (!validateIPAddress(ip)) {
    webhookLogger.error("Invalid IP address format", { ip });
    return false;
  }

  // Add your IP whitelist logic here if needed
  // const allowedRanges = ['192.168.1.0/24', '10.0.0.0/8'];

  return true;
}
