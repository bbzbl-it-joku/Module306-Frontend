// types/common.ts

/**
 * Base identifier type for all entities
 */
export type EntityId = string;

/**
 * ISO 8601 date string type
 */
export type ISODateString = string;

/**
 * User identifier type
 */
export type UserId = string;

/**
 * Email address type
 */
export type EmailAddress = string;

/**
 * Ticket priority levels
 */
export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Ticket/Issue status values
 */
export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  UNDER_REVIEW = 'under-review',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

/**
 * Attachment link types for polymorphic associations
 */
export enum AttachmentLinkType {
  TICKET = 'ticket',
  COMMENT = 'comment'
}

/**
 * Common MIME types for file uploads
 */
export enum CommonMimeType {
  // Images
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  WEBP = 'image/webp',
  SVG = 'image/svg+xml',
  
  // Documents
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XLS = 'application/vnd.ms-excel',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  
  // Text
  TXT = 'text/plain',
  CSV = 'text/csv',
  JSON = 'application/json',
  XML = 'application/xml',
  
  // Archives
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed'
}

/**
 * Base audit fields for entities that track creation and modification
 */
export interface AuditFields {
  createdBy: UserId;
  createdAt: ISODateString;
  modifiedBy: UserId;
  modifiedAt: ISODateString;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Pagination response metadata
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}