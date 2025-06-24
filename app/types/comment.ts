// types/comment.ts

import type {
  EntityId,
  UserId,
  ISODateString
} from './common';

/**
 * Core Comment entity interface
 */
export interface Comment {
  id: EntityId;
  content: string;
  createdBy: UserId;
  createdAt: ISODateString;
  modifiedAt: ISODateString;
  ticketId: EntityId;
}

/**
 * Comment creation input (excludes auto-generated fields)
 */
export interface CreateCommentInput {
  content: string;
  ticketId: EntityId;
}

/**
 * Comment update input (only content can be modified)
 */
export interface UpdateCommentInput {
  content: string;
}

/**
 * Comment with user information expanded
 */
export interface CommentWithUser extends Comment {
  createdByUser: {
    id: UserId;
    name: string;
    email: string;
    avatar?: string;
  };
}

/**
 * Comment filtering parameters for list endpoints
 */
export interface CommentFilters {
  ticketId?: EntityId;
  createdBy?: UserId | UserId[];
  createdAfter?: ISODateString;
  createdBefore?: ISODateString;
  search?: string; // Search in content
}

/**
 * Comment thread structure for nested discussions
 * (Future enhancement - not in current schema but useful for expansion)
 */
export interface CommentThread extends Comment {
  parentId?: EntityId;
  replies?: CommentThread[];
  repliesCount: number;
}

/**
 * Comment activity summary for notifications
 */
export interface CommentActivity {
  ticketId: EntityId;
  ticketTitle: string;
  commentsCount: number;
  lastCommentAt: ISODateString;
  lastCommentBy: UserId;
  unreadCount?: number;
}

/**
 * Comment validation rules
 */
export const COMMENT_VALIDATION = {
  content: {
    minLength: 1,
    maxLength: 10000,
    required: true
  }
} as const;

/**
 * Comment sort options
 */
export enum CommentSortOrder {
  NEWEST_FIRST = 'newest',
  OLDEST_FIRST = 'oldest'
}

/**
 * Comment mention pattern for @username detection
 */
export const MENTION_PATTERN = /@(\w+)/g;

/**
 * Extract mentions from comment content
 */
export function extractMentions(content: string): string[] {
  const mentions = content.match(MENTION_PATTERN);
  return mentions ? mentions.map(mention => mention.slice(1)) : [];
}