// types/attachment.ts

import {
  type EntityId,
  type AttachmentLinkType,
  CommonMimeType
} from './common';

/**
 * Core Attachment entity interface
 */
export interface Attachment {
  id: EntityId;
  linkType: AttachmentLinkType;
  linkId: EntityId;
  url: string;
  mimeType: string;
}

/**
 * Attachment creation input (excludes auto-generated fields)
 */
export interface CreateAttachmentInput {
  linkType: AttachmentLinkType;
  linkId: EntityId;
  url: string;
  mimeType: string;
}

/**
 * Attachment with enhanced metadata for file management
 */
export interface AttachmentWithMeta extends Attachment {
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount?: number;
  lastDownloadedAt?: string;
}

/**
 * File upload progress tracking
 */
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  attachmentId?: EntityId;
}

/**
 * Attachment filtering parameters
 */
export interface AttachmentFilters {
  linkType?: AttachmentLinkType;
  linkId?: EntityId | EntityId[];
  mimeType?: string | string[];
  fileExtension?: string | string[];
  uploadedBy?: string;
  uploadedAfter?: string;
  uploadedBefore?: string;
}

/**
 * File type categories for UI organization
 */
export enum FileCategory {
  IMAGE = 'image',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  ARCHIVE = 'archive',
  TEXT = 'text',
  OTHER = 'other'
}

/**
 * MIME type to file category mapping
 */
export const MIME_TYPE_CATEGORIES: Record<string, FileCategory> = {
  // Images
  'image/jpeg': FileCategory.IMAGE,
  'image/png': FileCategory.IMAGE,
  'image/gif': FileCategory.IMAGE,
  'image/webp': FileCategory.IMAGE,
  'image/svg+xml': FileCategory.IMAGE,
  
  // Documents
  'application/pdf': FileCategory.DOCUMENT,
  'application/msword': FileCategory.DOCUMENT,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileCategory.DOCUMENT,
  
  // Spreadsheets
  'application/vnd.ms-excel': FileCategory.SPREADSHEET,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileCategory.SPREADSHEET,
  'text/csv': FileCategory.SPREADSHEET,
  
  // Text
  'text/plain': FileCategory.TEXT,
  'application/json': FileCategory.TEXT,
  'application/xml': FileCategory.TEXT,
  
  // Archives
  'application/zip': FileCategory.ARCHIVE,
  'application/x-rar-compressed': FileCategory.ARCHIVE
};

/**
 * File upload validation rules
 */
export const FILE_UPLOAD_VALIDATION = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerUpload: 5,
  allowedMimeTypes: Object.values(CommonMimeType),
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.txt', '.csv', '.json', '.xml',
    '.zip', '.rar'
  ]
} as const;

/**
 * Get file category from MIME type
 */
export function getFileCategory(mimeType: string): FileCategory {
  return MIME_TYPE_CATEGORIES[mimeType] || FileCategory.OTHER;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex >= 0 ? filename.slice(lastDotIndex) : '';
}

/**
 * Validate file upload constraints
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_UPLOAD_VALIDATION.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${FILE_UPLOAD_VALIDATION.maxFileSize / (1024 * 1024)}MB`
    };
  }

  if (!FILE_UPLOAD_VALIDATION.allowedMimeTypes.includes(file.type as CommonMimeType)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  const extension = getFileExtension(file.name).toLowerCase();
  if (!FILE_UPLOAD_VALIDATION.allowedExtensions.includes(extension as typeof FILE_UPLOAD_VALIDATION.allowedExtensions[number])) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}