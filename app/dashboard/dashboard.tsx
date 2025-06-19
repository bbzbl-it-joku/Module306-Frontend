// components/dashboard/Dashboard.tsx
import React, { useMemo, useState } from 'react';
import { StatsOverview } from './StatsOverview';
import { TicketList } from './TicketList';
import { Navigation } from '../navigation/navigation';
import { mockTickets } from '../types/ticket';
import type { TicketStats } from '../types/ticket';
import { useNavigate } from 'react-router';

export function Dashboard() {
  let tickets = mockTickets; // Use mock data for now
 
  /* some mocked ticket getter logic
    const getTickets = async () => {
    try {
      const response = await getTicketApi; // Replace with actual API endpoint from ticket service
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      tickets = await response.json();
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
    
    useEffect(() => {
    getTickets();
    }, []);
  */
  // Calculate ticket statistics from mock data
  const ticketStats: TicketStats = useMemo(() => {
    const stats = tickets.reduce(
      (acc, ticket) => {
        acc.total += 1;

        switch (ticket.status) {
          case 'open':
            acc.open += 1;
            break;
          case 'in-progress':
            acc.inProgress += 1;
            break;
          case 'under-review':
            acc.underReview += 1;
            break;
          case 'resolved':
            acc.resolved += 1;
            break;
          case 'closed':
            acc.closed += 1;
            break;
          case 'cancelled':
            acc.cancelled += 1;
            break;
        }

        return acc;
      },
      {
        total: 0,
        open: 0,
        inProgress: 0,
        underReview: 0,
        resolved: 0,
        closed: 0,
        cancelled: 0,
        overdue: 0,
        dueSoon: 0
      }
    );

    return stats;
  }, []);
  const navigate = useNavigate();
  // Handle ticket click navigation
  const handleTicketClick = (ticketId: string) => {
    // TODO: Navigate to ticket detail page
    console.log(`Navigate to ticket: ${ticketId}`);
    navigate(`/ticket/${ticketId}`);
  };
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    if (!activeFilter) {
      return tickets; // Show all tickets when no filter is active
    }

    return tickets.filter(ticket => ticket.status === activeFilter);
  }, [activeFilter]);


  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/8 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Header */}
      <Navigation currentPath="/dashboard" />

      {/* Page Header */}
      <div className="relative z-10 pt-20 pb-8 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-lg text-white/80">
              Overview of your project tickets and activity
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <StatsOverview stats={ticketStats} activeFilter={activeFilter} onFilterChange={handleFilterChange} />

        {/* Ticket List */}
        <TicketList
          tickets={filteredTickets}
          onTicketClick={handleTicketClick}
        />
      </div>
    </div>
  );
}

// Individual component exports for reusability
export { StatsOverview } from './StatsOverview';
export { TicketList } from './TicketList';
export { TicketCard } from './TicketCard';


