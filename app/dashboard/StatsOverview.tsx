// components/dashboard/StatsOverview.tsx
import React from 'react';
import type { TicketStats } from '../types/ticket';

interface StatsOverviewProps {
  stats: TicketStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      ),
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-200',
      iconBg: 'bg-blue-500/30'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-200',
      iconBg: 'bg-orange-500/30'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20V4Z"/>
        </svg>
      ),
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-200',
      iconBg: 'bg-yellow-500/30'
    },
    {
      title: 'Closed Tickets',
      value: stats.closed,
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
      ),
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-200',
      iconBg: 'bg-green-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card) => (
        <div 
          key={card.title}
          className="group relative backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:-translate-y-1 p-6 cursor-pointer overflow-hidden"
        >
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/80 mb-1">
                {card.title}
              </p>
              <p className={`text-3xl font-bold text-white transition-colors duration-200 group-hover:${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.iconBg} backdrop-blur-sm p-3 rounded-full text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              {card.icon}
            </div>
          </div>
          
          {/* Animated border glow effect */}
          <div className="absolute inset-0 rounded-2xl border border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
}