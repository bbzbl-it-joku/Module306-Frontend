/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ticket/TicketDetail.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockTickets, STATUS_COLORS, PRIORITY_COLORS } from '../types/ticket';
import { CommentList } from './commentList';
import { CommentForm } from './commentForm';
import { AttachmentList } from './attachmentList';
import type { Comment, Attachment, AttachmentLinkType } from '~/types';
import { Navigation } from '~/navigation/navigation';
import type { TicketStatus } from '~/types/common';
// Mock comments data
const mockComments: Comment[] = [
  {
    id: 'comment-1',
    content: 'I\'ve started investigating this issue. It seems to be related to session timeout handling during high traffic.',
    createdBy: 'john.doe@company.com',
    createdAt: '2024-01-15T10:30:00Z',
    modifiedAt: '2024-01-15T10:30:00Z',
    ticketId: 'TKT-001'
  },
  {
    id: 'comment-2',
    content: 'Found the root cause. The authentication service is not properly handling concurrent requests. Working on a fix.',
    createdBy: 'john.doe@company.com',
    createdAt: '2024-01-16T14:20:00Z',
    modifiedAt: '2024-01-16T14:20:00Z',
    ticketId: 'TKT-001'
  },
  {
    id: 'comment-3',
    content: 'Thanks for the quick turnaround on this! Let me know when you have a timeline for the fix.',
    createdBy: 'jane.smith@company.com',
    createdAt: '2024-01-16T15:45:00Z',
    modifiedAt: '2024-01-16T15:45:00Z',
    ticketId: 'TKT-001'
  }
];

// Mock attachments data
const mockAttachments: Attachment[] = [
  {
    id: 'attachment-1',
    linkType: 'ticket' as AttachmentLinkType,
    linkId: 'TKT-001',
    url: '/files/error-logs.zip',
    mimeType: 'application/zip'
  },
  {
    id: 'attachment-2',
    linkType: 'ticket' as AttachmentLinkType,
    linkId: 'TKT-001',
    url: '/files/screenshot.png',
    mimeType: 'image/png'
  }
];

export function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>(mockComments);

  const ticket = useMemo(() => {
    return mockTickets.find((t: { id: any; }) => t.id === id);
  }, [id]);

  const [currentStatus, setCurrentStatus] = useState(ticket?.status); // Add this line


  const ticketComments = useMemo(() => {
    return comments.filter(comment => comment.ticketId === id);
  }, [comments, id]);

  const ticketAttachments = useMemo(() => {
    return mockAttachments.filter(attachment => attachment.linkId === id);
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const handleAddComment = (content: Comment) => {
    if (!id) return;
    
    const newComment: Comment = content;
    
    setComments(prev => [...prev, newComment]);
  };

 const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as TicketStatus); // Update local state
    // In real app, this would make an API call
    console.log(`Updating ticket ${id} status to ${newStatus}`);
  };

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket Not Found</h1>
          <p className="text-gray-600 mb-6">The ticket you&apos;re looking for doesn&apos;t exist.</p>
            <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
            Back
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Header */}

      <Navigation/>


      <div className="relative z-10 pt-20 pb-8 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="text-white-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-sm font-mono text-white-500">#{ticket.id}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${STATUS_COLORS[ticket.status].bg} ${STATUS_COLORS[ticket.status].text}`}>
                      {currentStatus?.replace('-', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${PRIORITY_COLORS[ticket.priority].bg} ${PRIORITY_COLORS[ticket.priority].text}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-white-900">{ticket.title}</h1>
                </div>
              </div>
              <div className="flex space-x-3 bg-black-90">
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="border border-black-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black transition-colors"
                 >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Edit Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ticket Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Comments ({ticketComments.length})
              </h2>
              
              <CommentForm onSubmit={handleAddComment} ticketID={ticket.id} />
              
              <div className="mt-6">
                <CommentList comments={ticketComments} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                  <dd className="text-sm text-gray-900">
                    {ticket.assignedTo ? (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {ticket.assignedTo.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{ticket.assignedTo.split('@')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created By</dt>
                  <dd className="text-sm text-gray-900 mt-1">{ticket.createdBy.split('@')[0]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                  <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.modifiedAt)}</dd>
                </div>
                {ticket.dueDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className="text-sm text-gray-900 mt-1">{formatDate(ticket.dueDate)}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags
                    .filter((tag) => !!tag && (typeof tag === 'string' || typeof tag === 'number'))
                    .map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attachments ({ticketAttachments.length})
              </h3>
              <AttachmentList attachments={ticketAttachments} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}