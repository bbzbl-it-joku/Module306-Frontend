/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ticket/TicketDetail.tsx
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { mockTickets, STATUS_COLORS, PRIORITY_COLORS } from '../types/ticket';
import { CommentList } from './commentList';
import { CommentForm } from './commentForm';
import { AttachmentList } from './attachmentList';
import type { Comment, Attachment, AttachmentLinkType, Ticket } from '~/types';
import { Navigation } from '~/navigation/navigation';
import type { TicketStatus } from '~/types/common';
import { ticketService } from '~/api/ticketService';

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

  const [ticket, setTicket] = useState<Ticket>();

  React.useEffect(() => {
    // Simulate async fetch
    const fetchTicket = async () => {
      try {
        // const fetchedTicket = await ticketService.getTicketById(id as string);
        const fetchedTicket = mockTickets.find(t => t.id === id);
        setTicket(fetchedTicket as Ticket);
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    };
    fetchTicket();
  }, [id]);

  const [currentStatus, setCurrentStatus] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (ticket) {
      setCurrentStatus(ticket.status);
    }
  }, [ticket]);

  const [ticketComments, setTicketComments] = useState<Comment[]>([]);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        // Replace with your actual ticketService call
        // const fetchedComments = await ticketService.getCommentsByTicketId(id as string);
        // setTicketComments(fetchedComments);
        setTicketComments(mockComments.filter(comment => comment.ticketId === id));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    if (id) {
      fetchComments();
    }
  }, [id]);



  const [ticketAttachments, setTicketAttachments] = useState<Attachment[]>([]);

  React.useEffect(() => {
    const fetchAttachments = async () => {
      try {
        // Replace with your actual ticketService call
        // const fetchedAttachments = await ticketService.getAttachmentsByTicketId(id as string);
        // setTicketAttachments(fetchedAttachments);
        setTicketAttachments(mockAttachments.filter(attachment => attachment.linkId === id));
      } catch (error) {
        console.error('Error fetching attachments:', error);
      }
    };
    if (id) {
      fetchAttachments();
    }
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

  const handleAddComment = async (content: Comment) => {
    if (!id) return;

    const newComment: Comment = content;
    // In a real app, add the comment via the ticketService
    // await ticketService.addCommentToTicket(id, newComment);
    setTicketComments(prev => [...prev, newComment]);
    setComments(prev => [...prev, newComment]);
  };

  const handleStatusChange = (newStatus: string ) => {
    setCurrentStatus(newStatus as TicketStatus); // Update local state
    // In real app, this would make an API call
    if (!id) return;
   // ticketService.updateTicket(id, { status : newStatus as TicketStatus });
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

      <Navigation />


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
                  className="px-2 py-3 group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all duration-300  p-6 cursor-pointer overflow-hidden"
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="under-review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

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
            <div className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all p-6 overflow-hidden"
            >
              <h2 className="text-xl font-semibold text-gray-90 mb-4">Description</h2>
              <p className="text-gray-70 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Comments Section */}
            <div className="group relative backdrop-blur-md bg-black/60 border border-white/20  rounded-2xl hover:bg-black/70 transition-all duration-300 p-6  overflow-hidden"
            >
              <h2 className="text-xl font-semibold text-gray-90 mb-6">
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
            <div
              className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all duration-300  p-6 overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-90 mb-4">Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-50">Assigned To</dt>
                  <dd className="text-sm text-gray-90">
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
                  <dt className="text-sm font-medium text-gray-50">Created By</dt>
                  <dd className="text-sm text-gray-90 mt-1">{ticket.createdBy.split('@')[0]}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-50">Created</dt>
                  <dd className="text-sm text-gray-90 mt-1">{formatDate(ticket.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-50">Last Modified</dt>
                  <dd className="text-sm text-gray-90 mt-1">{formatDate(ticket.modifiedAt)}</dd>
                </div>
                {ticket.dueDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-50">Due Date</dt>
                    <dd className="text-sm text-gray-90 mt-1">{formatDate(ticket.dueDate)}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all duration-300  p-6  overflow-hidden"
              >
                <h3 className="text-lg font-semibold text-gray-90 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags
                    .filter((tag) => !!tag && (typeof tag === 'string' || typeof tag === 'number'))
                    .map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 border border-gray-200 rounded-lg  transition-colors group"                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all duration-300  p-6  overflow-hidden"
            >
              <h3 className="text-lg font-semibold text-gray-90 mb-4">
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