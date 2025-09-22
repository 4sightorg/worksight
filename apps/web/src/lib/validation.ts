// Safe JSON parsing and validation utilities
import { z } from 'zod';

/**
 * Safely parse JSON with optional validation schema
 * @param jsonString - The JSON string to parse
 * @param schema - Optional Zod schema for validation
 * @returns Parsed and validated data or null if invalid
 */
export function safeJsonParse<T>(
  jsonString: string | null | undefined,
  schema?: z.ZodSchema<T>
): T | null {
  if (!jsonString || typeof jsonString !== 'string') {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonString);
    
    if (schema) {
      const result = schema.safeParse(parsed);
      return result.success ? result.data : null;
    }
    
    return parsed;
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Safely decode and parse URL parameters
 * @param param - URL parameter to decode and parse
 * @param schema - Optional Zod schema for validation
 * @returns Parsed and validated data or null if invalid
 */
export function safeUrlParamParse<T>(
  param: string | null | undefined,
  schema?: z.ZodSchema<T>
): T | null {
  if (!param) {
    return null;
  }

  try {
    // Safely decode URI component
    const decoded = decodeURIComponent(param);
    return safeJsonParse(decoded, schema);
  } catch (error) {
    console.warn('Failed to decode URL parameter:', error);
    return null;
  }
}

/**
 * Sanitize string input to prevent XSS
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

/**
 * Safe localStorage operations with error handling
 */
export const safeStorage = {
  get: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = localStorage.getItem(key);
      return item;
    } catch (error) {
      console.warn(`Failed to read from localStorage (${key}):`, error);
      return null;
    }
  },

  getJson: <T>(key: string, schema?: z.ZodSchema<T>): T | null => {
    const item = safeStorage.get(key);
    return safeJsonParse(item, schema);
  },

  set: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`Failed to save to localStorage (${key}):`, error);
      return false;
    }
  },

  setJson: (key: string, value: unknown): boolean => {
    try {
      const jsonString = JSON.stringify(value);
      return safeStorage.set(key, jsonString);
    } catch (error) {
      console.warn(`Failed to stringify JSON for localStorage (${key}):`, error);
      return false;
    }
  },

  remove: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Failed to remove from localStorage (${key}):`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('Failed to clear localStorage:', error);
      return false;
    }
  },
};

// Common validation schemas
export const ValidationSchemas = {
  user: z.object({
    id: z.string(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    role: z.string().optional(),
    department: z.string().optional(),
    team: z.string().optional(),
  }),

  surveyResponse: z.object({
    questionId: z.string(),
    value: z.union([z.string(), z.number()]),
  }),

  offlineSurveyResponse: z.object({
    id: z.string(),
    user_id: z.string(),
    responses: z.record(z.string(), z.union([z.string(), z.number()])),
    burnout_score: z.number(),
    created_at: z.string(),
  }),

  surveyScores: z.object({
    workload: z.number().min(6).max(30),
    balance: z.number().min(5).max(25),
    support: z.number().min(5).max(25),
    engagement: z.number().min(9).max(45),
    overall: z.number().min(25).max(125),
  }),

  dimensionResult: z.object({
    score: z.number(),
    level: z.enum(['low', 'moderate', 'high', 'severe']),
    color: z.string(),
    title: z.string(),
    description: z.string(),
  }),

  burnoutResult: z.object({
    overallScore: z.number(),
    overallLevel: z.enum(['low', 'moderate', 'high', 'severe']),
    workload: z.object({
      score: z.number(),
      level: z.enum(['low', 'moderate', 'high', 'severe']),
      color: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    balance: z.object({
      score: z.number(),
      level: z.enum(['low', 'moderate', 'high', 'severe']),
      color: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    support: z.object({
      score: z.number(),
      level: z.enum(['low', 'moderate', 'high', 'severe']),
      color: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    engagement: z.object({
      score: z.number(),
      level: z.enum(['low', 'moderate', 'high', 'severe']),
      color: z.string(),
      title: z.string(),
      description: z.string(),
    }),
    recommendations: z.array(z.string()),
  }),

  sessionData: z.object({
    user: z.object({
      id: z.string(),
      email: z.string().optional(),
      name: z.string().optional(),
      role: z.string().optional(),
    }),
    accessToken: z.string(),
    timestamp: z.number(),
    saveLogin: z.boolean(),
  }),
};