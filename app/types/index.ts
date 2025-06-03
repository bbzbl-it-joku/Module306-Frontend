// types/index.ts

import type { ApiErrorResponse, PaginatedResponse } from './api';
import type { Attachment } from './attachment';
import { AttachmentLinkType, CommonMimeType, TicketPriority, TicketStatus } from './common';
import type { Ticket } from './ticket';
import type { Comment as TrackifyComment } from './comment';

// ============================================
// COMMON TYPES AND ENUMS
// ============================================
export type {
  EntityId,
  ISODateString,
  UserId,
  EmailAddress,
  AuditFields,
  PaginationParams,
  PaginationMeta
} from './common';

export {
  TicketPriority,
  TicketStatus,
  AttachmentLinkType,
  CommonMimeType
} from './common';

// ============================================
// TICKET TYPES
// ============================================
export type {
  Ticket,
  CreateTicketInput,
  UpdateTicketInput,
  TicketFilters,
  TicketStats,
  TicketWithMeta,
  TicketStatusTransition
} from './ticket';

export {
  VALID_STATUS_TRANSITIONS,
  PRIORITY_COLORS,
  STATUS_COLORS,
  mockTickets
} from './ticket';

// ============================================
// COMMENT TYPES
// ============================================
export type {
  Comment,
  CreateCommentInput,
  UpdateCommentInput,
  CommentWithUser,
  CommentFilters,
  CommentThread,
  CommentActivity
} from './comment';

export {
  CommentSortOrder,
  COMMENT_VALIDATION,
  MENTION_PATTERN,
  extractMentions
} from './comment';

// ============================================
// ATTACHMENT TYPES
// ============================================
export type {
  Attachment,
  CreateAttachmentInput,
  AttachmentWithMeta,
  FileUploadProgress,
  AttachmentFilters
} from './attachment';

export {
  FileCategory,
  MIME_TYPE_CATEGORIES,
  FILE_UPLOAD_VALIDATION,
  getFileCategory,
  getFileExtension,
  validateFileUpload,
  formatFileSize
} from './attachment';

// ============================================
// API TYPES
// ============================================
export type {
  ApiResponse,
  ApiErrorResponse,
  PaginatedResponse,
  
  // Ticket API
  GetTicketsRequest,
  GetTicketsResponse,
  GetTicketResponse,
  CreateTicketRequest,
  CreateTicketResponse,
  UpdateTicketRequest,
  UpdateTicketResponse,
  DeleteTicketResponse,
  GetTicketStatsResponse,
  
  // Comment API
  GetCommentsRequest,
  GetCommentsResponse,
  GetCommentResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
  
  // Attachment API
  GetAttachmentsRequest,
  GetAttachmentsResponse,
  GetAttachmentResponse,
  CreateAttachmentRequest,
  CreateAttachmentResponse,
  DeleteAttachmentResponse,
  FileUploadRequest,
  FileUploadResponse,
  
  // Bulk Operations
  BulkTicketOperationRequest,
  BulkOperationResponse,
  
  // Search
  SearchRequest,
  SearchResultItem,
  SearchResponse,
  AutocompleteRequest,
  AutocompleteResponse,
  
  // Validation
  FieldError,
  ValidationErrorResponse,
  ApiClientConfig
} from './api';

export {
  HTTP_ERROR_CODES
} from './api';

// ============================================
// TYPE GUARDS AND UTILITIES
// ============================================

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && response.success === false && response.error;
}

/**
 * Type guard to check if response is paginated
 */
export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return response && response.success && Array.isArray(response.data) && response.pagination;
}

/**
 * Type guard for ticket entity
 */
export function isTicket(entity: any): entity is Ticket {
  return entity && 
    typeof entity.id === 'string' &&
    typeof entity.title === 'string' &&
    typeof entity.description === 'string' &&
    Array.isArray(entity.tags) &&
    Object.values(TicketPriority).includes(entity.priority) &&
    Object.values(TicketStatus).includes(entity.status);
}

/**
 * Type guard for comment entity
 */
export function isComment(entity: any): entity is Comment {
  return entity &&
    typeof entity.id === 'string' &&
    typeof entity.content === 'string' &&
    typeof entity.ticketId === 'string' &&
    typeof entity.createdBy === 'string';
}

/**
 * Type guard for attachment entity
 */
export function isAttachment(entity: any): entity is Attachment {
  return entity &&
    typeof entity.id === 'string' &&
    typeof entity.url === 'string' &&
    typeof entity.mimeType === 'string' &&
    typeof entity.linkId === 'string' &&
    Object.values(AttachmentLinkType).includes(entity.linkType);
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

/**
 * Generate mock ticket data for development
 */
export function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
  const now = new Date().toISOString();
  return {
    id: `ticket-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Sample Ticket',
    description: 'This is a sample ticket for development purposes.',
    tags: ['sample', 'development'],
    priority: TicketPriority.MEDIUM,
    createdBy: 'user-123',
    createdAt: now,
    modifiedBy: 'user-123',
    modifiedAt: now,
    status: TicketStatus.OPEN,
    ...overrides
  };
}

/**
 * Generate mock comment data for development
export function createMockComment(overrides: Partial<TrackifyComment> = {}): TrackifyComment {
  const now = new Date().toISOString();
  return {
    id: `comment-${Math.random().toString(36).substr(2, 9)}`,
    content: 'This is a sample comment.',
    createdBy: 'user-123',
    createdAt: now,
    modifiedAt: now,
    ticketId: 'ticket-123',
    ...overrides
  };
}
}

/**
 * Generate mock attachment data for development
 */
export function createMockAttachment(overrides: Partial<Attachment> = {}): Attachment {
  return {
    id: `attachment-${Math.random().toString(36).substr(2, 9)}`,
    linkType: AttachmentLinkType.TICKET,
    linkId: 'ticket-123',
    url: 'https://example.com/files/sample.pdf',
    mimeType: CommonMimeType.PDF,
    ...overrides
  };
}