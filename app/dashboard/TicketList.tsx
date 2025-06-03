// components/dashboard/TicketList.tsx
import React from 'react';
import { TicketCard } from './TicketCard';
import type { Ticket } from '../types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticketId: string) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 text-center">
        <div className="text-white/60 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No tickets found</h3>
        <p className="text-white/70">Create your first ticket to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">All Tickets</h2>
        <div className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
          {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}
        </div>
      </div>
      
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onClick={onTicketClick}
          />
        ))}
      </div>
    </div>
  );
}