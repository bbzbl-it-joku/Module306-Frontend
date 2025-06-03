// components/dashboard/TicketCard.tsx
import React from 'react';
import type { Ticket } from '../types/ticket';
import { STATUS_COLORS, PRIORITY_COLORS } from '../types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  onClick?: (ticketId: string) => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(ticket.id);
    }
  };

  return (
    <div
      className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-2xl hover:bg-black/70 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 p-6 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>

      {/* Header with ID and Status */}
      <div className="relative z-10 flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-mono text-white/60 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
            #{ticket.id}
          </span>
          <span
            className={`
              inline-flex px-3 py-1 text-xs font-medium rounded-full
              backdrop-blur-sm border border-white/20
              ${STATUS_COLORS[ticket.status].bg}
              ${STATUS_COLORS[ticket.status].text}
              bg-opacity-90
            `}
          >
            {ticket.status.replace('-', ' ')}
          </span>
        </div>
        <span
          className={`
            inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full
            backdrop-blur-sm border border-white/20
            ${PRIORITY_COLORS[ticket.priority].bg} 
            ${PRIORITY_COLORS[ticket.priority].text}
            shadow-md tracking-wide
          `}
        >
          {ticket.priority}
        </span>
      </div>

      {/* Title and Description */}
      <h3 className="relative z-10 text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-white transition-colors duration-200">
        {ticket.title}
      </h3>
      <p className="relative z-10 text-white/70 text-sm mb-4 line-clamp-2 group-hover:text-white/80 transition-colors duration-200">
        {ticket.description}
      </p>

      {/* Tags */}
      {ticket.tags.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 mb-4">
          {ticket.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex px-2 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with Assignee and Dates */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
        <div className="flex items-center space-x-4">
          {ticket.assignedTo && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <span className="text-xs font-medium text-white">
                  {ticket.assignedTo.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-white/70 group-hover:text-white/80 transition-colors duration-200">
                {ticket.assignedTo.split('@')[0]}
              </span>
            </div>
          )}
        </div>
        <div className="text-right text-white/60 group-hover:text-white/70 transition-colors duration-200">
          <div>Created: {formatDate(ticket.createdAt)}</div>
          <div>Updated: {formatDate(ticket.modifiedAt)}</div>
        </div>
      </div>

      {/* Animated border glow effect */}
      <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
}