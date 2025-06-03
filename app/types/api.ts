// types/api.ts

import type {
  EntityId,
  PaginationParams,
  PaginationMeta
} from './common';
import type {
  Ticket,
  CreateTicketInput,
  UpdateTicketInput,
  TicketFilters,
  TicketStats,
  TicketWithMeta
} from './ticket';
import type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
  CommentFilters,
  CommentWithUser
} from './comment';
import type {
  Attachment,
  CreateAttachmentInput,
  AttachmentFilters,
  AttachmentWithMeta
} from './attachment';

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  timestamp: string;
}

// ============================================
// TICKET API TYPES
// ============================================

/**
 * Get tickets list request parameters
 */
export interface GetTicketsRequest extends PaginationParams {
  filters?: TicketFilters;
}

/**
 * Get tickets list response
 */
export type GetTicketsResponse = PaginatedResponse<TicketWithMeta>;

/**
 * Get single ticket response
 */
export type GetTicketResponse = ApiResponse<Ticket>;

/**
 * Create ticket request body
 */
export type CreateTicketRequest = CreateTicketInput;

/**
 * Create ticket response
 */
export type CreateTicketResponse = ApiResponse<Ticket>;

/**
 * Update ticket request body
 */
export type UpdateTicketRequest = UpdateTicketInput;

/**
 * Update ticket response
 */
export type UpdateTicketResponse = ApiResponse<Ticket>;

/**
 * Delete ticket response
 */
export type DeleteTicketResponse = ApiResponse<{ id: EntityId }>;

/**
 * Get ticket statistics response
 */
export type GetTicketStatsResponse = ApiResponse<TicketStats>;

// ============================================
// COMMENT API TYPES
// ============================================

/**
 * Get comments list request parameters
 */
export interface GetCommentsRequest extends PaginationParams {
  filters?: CommentFilters;
}

/**
 * Get comments list response
 */
export type GetCommentsResponse = PaginatedResponse<CommentWithUser>;

/**
 * Get single comment response
 */
export type GetCommentResponse = ApiResponse<Comment>;

/**
 * Create comment request body
 */
export type CreateCommentRequest = CreateCommentInput;

/**
 * Create comment response
 */
export type CreateCommentResponse = ApiResponse<Comment>;

/**
 * Update comment request body
 */
export type UpdateCommentRequest = UpdateCommentInput;

/**
 * Update comment response
 */
export type UpdateCommentResponse = ApiResponse<Comment>;

/**
 * Delete comment response
 */
export type DeleteCommentResponse = ApiResponse<{ id: EntityId }>;

// ============================================
// ATTACHMENT API TYPES
// ============================================

/**
 * Get attachments list request parameters
 */
export interface GetAttachmentsRequest extends PaginationParams {
  filters?: AttachmentFilters;
}

/**
 * Get attachments list response
 */
export type GetAttachmentsResponse = PaginatedResponse<AttachmentWithMeta>;

/**
 * Get single attachment response
 */
export type GetAttachmentResponse = ApiResponse<Attachment>;

/**
 * Create attachment request body
 */
export type CreateAttachmentRequest = CreateAttachmentInput;

/**
 * Create attachment response
 */
export type CreateAttachmentResponse = ApiResponse<Attachment>;

/**
 * Delete attachment response
 */
export type DeleteAttachmentResponse = ApiResponse<{ id: EntityId }>;

/**
 * File upload request (multipart/form-data)
 */
export interface FileUploadRequest {
  file: File;
  linkType: string;
  linkId: EntityId;
}

/**
 * File upload response
 */
export interface FileUploadResponse extends ApiResponse<Attachment> {
  url: string;
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Bulk ticket operations request
 */
export interface BulkTicketOperationRequest {
  ticketIds: EntityId[];
  operation: 'delete' | 'update-status' | 'assign' | 'add-tags' | 'remove-tags';
  payload?: {
    status?: string;
    assignedTo?: string;
    tags?: string[];
  };
}

/**
 * Bulk operation response
 */
export interface BulkOperationResponse extends ApiResponse<{
  successCount: number;
  failureCount: number;
  failures?: Array<{
    id: EntityId;
    error: string;
  }>;
}> {}

// ============================================
// SEARCH AND AUTOCOMPLETE
// ============================================

/**
 * Global search request
 */
export interface SearchRequest {
  query: string;
  filters?: {
    entityTypes?: ('ticket' | 'comment')[];
    dateRange?: {
      start: string;
      end: string;
    };
  };
  limit?: number;
}

/**
 * Search result item
 */
export interface SearchResultItem {
  id: EntityId;
  type: 'ticket' | 'comment';
  title: string;
  excerpt: string;
  url: string;
  metadata: {
    createdAt: string;
    createdBy: string;
    status?: string;
    priority?: string;
  };
}

/**
 * Search response
 */
export type SearchResponse = ApiResponse<SearchResultItem[]>;

/**
 * Autocomplete request
 */
export interface AutocompleteRequest {
  field: 'tags' | 'assignedTo' | 'createdBy';
  query: string;
  limit?: number;
}

/**
 * Autocomplete response
 */
export type AutocompleteResponse = ApiResponse<string[]>;

// ============================================
// VALIDATION AND ERROR TYPES
// ============================================

/**
 * Field validation error
 */
export interface FieldError {
  field: string;
  message: string;
  code: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
  error: {
    code: 'VALIDATION_ERROR';
    message: string;
    details: {
      fields: FieldError[];
    };
  };
}

/**
 * HTTP status code to error type mapping
 */
export const HTTP_ERROR_CODES = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_SERVER_ERROR',
  502: 'BAD_GATEWAY',
  503: 'SERVICE_UNAVAILABLE',
  504: 'GATEWAY_TIMEOUT'
} as const;

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  headers?: Record<string, string>;
}