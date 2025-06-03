// types/ticket.ts

import {
  type EntityId,
  type UserId,
  type ISODateString,
  type AuditFields,
  TicketPriority,
  TicketStatus
} from './common';

/**
 * Core Ticket/Issue entity interface
 */
export interface Ticket extends AuditFields {
  id: EntityId;
  title: string;
  description: string;
  tags: string[];
  priority: TicketPriority;
  assignedTo?: UserId;
  status: TicketStatus;
  dueDate?: ISODateString;
}

/**
 * Ticket creation input (excludes auto-generated fields)
 */
export interface CreateTicketInput {
  title: string;
  description: string;
  tags?: string[];
  priority: TicketPriority;
  assignedTo?: UserId;
  status?: TicketStatus;
  dueDate?: ISODateString;
}

/**
 * Ticket update input (all fields optional except those that shouldn't change)
 */
export interface UpdateTicketInput {
  title?: string;
  description?: string;
  tags?: string[];
  priority?: TicketPriority;
  assignedTo?: UserId;
  status?: TicketStatus;
  dueDate?: ISODateString;
}

/**
 * Ticket filtering parameters for list endpoints
 */
export interface TicketFilters {
  status?: TicketStatus | TicketStatus[];
  priority?: TicketPriority | TicketPriority[];
  assignedTo?: UserId | UserId[];
  createdBy?: UserId | UserId[];
  tags?: string | string[];
  createdAfter?: ISODateString;
  createdBefore?: ISODateString;
  dueAfter?: ISODateString;
  dueBefore?: ISODateString;
  search?: string; // Search in title and description
}

/**
 * Ticket statistics for dashboard overview
 */
export interface TicketStats {
  total: number;
  open: number;
  inProgress: number;
  underReview: number;
  resolved: number;
  closed: number;
  cancelled: number;
  overdue: number;
  dueSoon: number; // Due within next 7 days
}

/**
 * Ticket with expanded relationships (includes comments, attachments count)
 */
export interface TicketWithMeta extends Ticket {
  commentsCount: number;
  attachmentsCount: number;
  lastActivity?: ISODateString;
}

/**
 * Ticket status transition validation
 */
export type TicketStatusTransition = {
  from: TicketStatus;
  to: TicketStatus;
  allowedRoles?: string[];
  requiresComment?: boolean;
};

/**
 * Valid status transitions mapping
 */
export const VALID_STATUS_TRANSITIONS: TicketStatusTransition[] = [
  { from: TicketStatus.OPEN, to: TicketStatus.IN_PROGRESS },
  { from: TicketStatus.OPEN, to: TicketStatus.CANCELLED },
  { from: TicketStatus.IN_PROGRESS, to: TicketStatus.UNDER_REVIEW },
  { from: TicketStatus.IN_PROGRESS, to: TicketStatus.OPEN },
  { from: TicketStatus.UNDER_REVIEW, to: TicketStatus.RESOLVED },
  { from: TicketStatus.UNDER_REVIEW, to: TicketStatus.IN_PROGRESS },
  { from: TicketStatus.RESOLVED, to: TicketStatus.CLOSED },
  { from: TicketStatus.RESOLVED, to: TicketStatus.IN_PROGRESS },
  { from: TicketStatus.CLOSED, to: TicketStatus.IN_PROGRESS, requiresComment: true }
];

// Replace the existing PRIORITY_COLORS and STATUS_COLORS in types/ticket.ts

/**
 * Ticket priority color mapping for glass morphism UI
 */
export const PRIORITY_COLORS: Record<TicketPriority, { bg: string; text: string; border: string }> = {
  [TicketPriority.LOW]: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-200',
    border: 'border-gray-300/30'
  },
  [TicketPriority.MEDIUM]: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-200',
    border: 'border-blue-300/30'
  },
  [TicketPriority.HIGH]: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-200',
    border: 'border-orange-300/30'
  },
  [TicketPriority.CRITICAL]: {
    bg: 'bg-red-500/20',
    text: 'text-red-200',
    border: 'border-red-300/30'
  }
};

/**
 * Ticket status color mapping for glass morphism UI
 */
export const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  [TicketStatus.OPEN]: {
    bg: 'bg-orange-500/20',
    text: 'text-orange-200',
    border: 'border-orange-300/30'
  },
  [TicketStatus.IN_PROGRESS]: {
    bg: 'bg-yellow-500/20',
    text: 'text-yellow-200',
    border: 'border-yellow-300/30'
  },
  [TicketStatus.UNDER_REVIEW]: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-200',
    border: 'border-purple-300/30'
  },
  [TicketStatus.RESOLVED]: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-200',
    border: 'border-blue-300/30'
  },
  [TicketStatus.CLOSED]: {
    bg: 'bg-green-500/20',
    text: 'text-green-200',
    border: 'border-green-300/30'
  },
  [TicketStatus.CANCELLED]: {
    bg: 'bg-gray-500/20',
    text: 'text-gray-200',
    border: 'border-gray-300/30'
  }
};

/**
 * Mock ticket data for development
 */
export const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Fix login authentication bug',
    description: 'Users unable to login with correct credentials. Error occurs intermittently during peak hours.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    assignedTo: 'john.doe@company.com',
    createdBy: 'jane.smith@company.com',
    createdAt: '2024-01-15T09:30:00Z',
    modifiedBy: 'jane.smith@company.com',
    modifiedAt: '2024-01-15T09:30:00Z',
    tags: ['bug', 'authentication', 'urgent']
  },
  {
    id: 'TKT-002',
    title: 'Implement dark mode theme',
    description: 'Add dark mode toggle to user preferences with system preference detection.',
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    assignedTo: 'alice.johnson@company.com',
    createdBy: 'bob.wilson@company.com',
    createdAt: '2024-01-10T14:20:00Z',
    modifiedBy: 'alice.johnson@company.com',
    modifiedAt: '2024-01-20T16:45:00Z',
    tags: ['feature', 'ui', 'theme']
  },
  {
    id: 'TKT-003',
    title: 'Database performance optimization',
    description: 'Query response times exceeding 2 seconds for user dashboard. Affects 15% of users.',
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.CRITICAL,
    assignedTo: 'charlie.brown@company.com',
    createdBy: 'diana.prince@company.com',
    createdAt: '2024-01-05T11:15:00Z',
    modifiedBy: 'charlie.brown@company.com',
    modifiedAt: '2024-01-18T13:30:00Z',
    tags: ['performance', 'database', 'optimization']
  },
  {
    id: 'TKT-004',
    title: 'Update user documentation',
    description: 'Revise API documentation for v2.0 release including new endpoints and examples.',
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    assignedTo: 'eve.adams@company.com',
    createdBy: 'frank.miller@company.com',
    createdAt: '2024-01-12T08:00:00Z',
    modifiedBy: 'eve.adams@company.com',
    modifiedAt: '2024-01-22T17:00:00Z',
    tags: ['documentation', 'api']
  },
  {
    id: 'TKT-005',
    title: 'Mobile responsive layout issues',
    description: 'Layout breaks on screens smaller than 768px. Navigation menu overlaps content.',
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    assignedTo: 'grace.hopper@company.com',
    createdBy: 'henry.ford@company.com',
    createdAt: '2024-01-20T10:30:00Z',
    modifiedBy: 'henry.ford@company.com',
    modifiedAt: '2024-01-20T10:30:00Z',
    tags: ['bug', 'responsive', 'mobile', 'css']
  }
];