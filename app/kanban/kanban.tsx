import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navigation } from '~/navigation/navigation';
import { mockTickets } from '../types/ticket'; // Assuming you have a separate file for mock data
import { TicketStatus, TicketPriority } from '../types/common'; // Assuming you have a separate file for types
import { ticketService } from '~/api/ticketService';
// Mock data and types (based on your existing structure)


const STATUS_COLORS = {
    [TicketStatus.OPEN]: {
        bg: 'bg-orange-300',
        text: 'text-orange-700',
        border: 'border-orange-400'
    },
    [TicketStatus.IN_PROGRESS]: {
        bg: 'bg-yellow-200',
        text: 'text-yellow-700',
        border: 'border-yellow-400'
    },
    [TicketStatus.UNDER_REVIEW]: {
        bg: 'bg-purple-300',
        text: 'text-purple-700',
        border: 'border-purple-400'
    },
    [TicketStatus.RESOLVED]: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300'
    },
    [TicketStatus.CLOSED]: {
        bg: 'bg-green-300',
        text: 'text-green-700',
        border: 'border-green-400'
    },
    [TicketStatus.CANCELLED]: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300'
    }
};

const PRIORITY_COLORS = {
    [TicketPriority.LOW]: {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-300'
    },
    [TicketPriority.MEDIUM]: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300'
    },
    [TicketPriority.HIGH]: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300'
    },
    [TicketPriority.CRITICAL]: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-300'
    }
};



// Kanban Card Component
type Ticket = typeof mockTickets[number];

function KanbanCard({ ticket, onClick }: { ticket: Ticket; onClick?: (id: string) => void }) {
    interface KanbanCardProps {
        ticket: Ticket;
        onClick?: (id: string) => void;
    }

    const formatDate = (dateString: string): string => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(new Date(dateString));
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick(ticket.id);
        }
    };

    return (
        <div
            className="group text-gray-50 hover:border-white/80  relative shadow-sm hover:shadow-md border border-white/30 rounded-lg transition-all duration-200  p-4 cursor-pointer overflow-hidden mb-3"

            onClick={handleCardClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-gray-200">#{ticket.id}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[ticket.priority].bg} ${PRIORITY_COLORS[ticket.priority].text}`}>
                    {ticket.priority}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-90 mb-2 line-clamp-2">
                {ticket.title}
            </h3>

            {/* Tags */}
            {ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {ticket.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-900 text-gray-60 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                    {ticket.tags.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-900 text-gray-60 rounded">
                            +{ticket.tags.length - 2}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-50">
                {ticket.assignedTo && (
                    <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-70">
                                {ticket.assignedTo.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="truncate max-w-16">
                            {ticket.assignedTo.split('@')[0]}
                        </span>
                    </div>
                )}
                <span>{formatDate(ticket.modifiedAt)}</span>
            </div>
        </div>
    );
}

// Kanban Column Component
interface KanbanColumnProps {
    title: string;
    tickets: Ticket[];
    status: (typeof TicketStatus)[keyof typeof TicketStatus];
    onTicketClick: (id: string) => void;
}

// In your KanbanColumn component, add state for controlling visibility
function KanbanColumn({ title, tickets, status, onTicketClick }: KanbanColumnProps) {
    const statusColors = STATUS_COLORS[status];
    const [showAll, setShowAll] = useState(false);

    // Sort tickets by modified date (newest first)
    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            return new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime();
        });
    }, [tickets]);

    // Limit tickets to 10 if not showing all
    const displayedTickets = showAll ? sortedTickets : sortedTickets.slice(0, 10);

    // Determine if we need a "Show All" button
    const hasMoreTickets = sortedTickets.length > 10;

    return (
        <div className="flex-1 min-w-80 max-w-md">
            {/* Column Header */}
            <div className={`rounded-t-lg p-4 ${statusColors.bg} border-l-4 ${statusColors.border}`}>
                <div className="flex items-center justify-between">
                    <h2 className={`font-semibold ${statusColors.text}`}>
                        {title}
                    </h2>
                    <span className={`inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-white ${statusColors.text}`}>
                        {tickets.length}
                    </span>
                </div>
            </div>

            {/* Column Content */}
            <div className="group relative backdrop-blur-md bg-black/60 border border-white/20 rounded-b-lg transition-all duration-300 p-6 overflow-hidden">
                {tickets.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">No tickets</p>
                    </div>
                ) : (
                    <>
                        {displayedTickets.map((ticket) => (
                            <KanbanCard
                                key={ticket.id}
                                ticket={ticket}
                                onClick={onTicketClick}
                            />
                        ))}

                        {/* "Show All" button */}
                        {hasMoreTickets && (
                            <div className="mt-4 text-center">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-md transition-colors"
                                >
                                    {showAll ? 'Show Less' : `Show All (${sortedTickets.length - 10} more)`}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// Ticket Detail Modal Component
interface TicketDetailModalProps {
    ticket: Ticket | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (ticket: Ticket) => void;
}

function TicketDetailModal({ ticket, isOpen, onClose, onSave }: TicketDetailModalProps) {
    const [editingTicket, setEditingTicket] = useState(ticket);
    const [newTag, setNewTag] = useState('');

    // Update local state when ticket prop changes
    React.useEffect(() => {
        if (ticket) {
            setEditingTicket(ticket);
        }
    }, [ticket]);

    if (!isOpen || !ticket) return null;

    interface HandleInputChange {
        (field: keyof Ticket, value: string): void;
    }

    const handleInputChange: HandleInputChange = (field, value) => {
        setEditingTicket(prev => prev ? {
            ...prev,
            [field]: value
        } : prev);
    };

    const handleAddTag = () => {
        if (
            editingTicket &&
            newTag.trim() &&
            !editingTicket.tags.includes(newTag.trim())
        ) {
            setEditingTicket(prev => prev ? ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }) : prev);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditingTicket(prev => prev ? ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }) : prev);
    };

    const handleSave = () => {
        if (editingTicket) {
            onSave(editingTicket);
        }
        onClose();
    };

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Ticket #{editingTicket ? editingTicket.id : ''}
                        </h2>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${editingTicket ? STATUS_COLORS[editingTicket.status].bg : ''} ${editingTicket ? STATUS_COLORS[editingTicket.status].text : ''}`}>
                            {editingTicket ? editingTicket.status.replace('-', ' ') : ''}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={editingTicket?.title ?? ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={editingTicket?.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status and Priority Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                value={editingTicket?.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={TicketStatus.OPEN}>Open</option>
                                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                                <option value={TicketStatus.UNDER_REVIEW}>Under Review</option>
                                <option value={TicketStatus.RESOLVED}>Resolved</option>
                                <option value={TicketStatus.CLOSED}>Closed</option>
                                <option value={TicketStatus.CANCELLED}>Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority
                            </label>
                            <select
                                value={editingTicket?.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value={TicketPriority.LOW}>Low</option>
                                <option value={TicketPriority.MEDIUM}>Medium</option>
                                <option value={TicketPriority.HIGH}>High</option>
                                <option value={TicketPriority.CRITICAL}>Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned To
                        </label>
                        <input
                            type="email"
                            value={editingTicket?.assignedTo || ''}
                            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                            placeholder="user@company.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {editingTicket?.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                placeholder="Add new tag"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Ticket Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Created by:</span>
                                <div className="font-medium">{editingTicket?.createdBy}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Created at:</span>
                                <div className="font-medium">{editingTicket?.createdAt ? formatDate(editingTicket.createdAt) : ''}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Last modified:</span>
                                <div className="font-medium">{editingTicket?.modifiedAt ? formatDate(editingTicket.modifiedAt) : ''}</div>
                            </div>
                            <div>
                                <span className="text-gray-500">Modified by:</span>
                                <div className="font-medium">{editingTicket?.modifiedBy}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

// Main Kanban Board Component
export default function KanbanBoard() {
    // State for modal and tickets
    const [tickets, setTickets] = useState(mockTickets);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Group tickets by status
    const groupedTickets = useMemo(() => {
        return tickets.reduce((acc: Record<(typeof TicketStatus)[keyof typeof TicketStatus], Ticket[]>, ticket) => {
            if (!acc[ticket.status]) {
                acc[ticket.status] = [];
            }
            acc[ticket.status].push(ticket);
            return acc;
        }, {} as Record<(typeof TicketStatus)[keyof typeof TicketStatus], Ticket[]>);
    }, [tickets]);

    // Define columns - three column layout
    const columns = [
        {
            id: TicketStatus.OPEN,
            title: 'Open',
            status: TicketStatus.OPEN,
            tickets: groupedTickets[TicketStatus.OPEN] || []
        },
        {
            id: TicketStatus.IN_PROGRESS,
            title: 'In Progress',
            status: TicketStatus.IN_PROGRESS,
            tickets: [
                ...(groupedTickets[TicketStatus.IN_PROGRESS] || []),
                ...(groupedTickets[TicketStatus.UNDER_REVIEW] || [])
            ]
        },
        {
            id: TicketStatus.CLOSED,
            title: 'Closed',
            status: TicketStatus.CLOSED,
            tickets: [
                ...(groupedTickets[TicketStatus.RESOLVED] || []),
                ...(groupedTickets[TicketStatus.CLOSED] || []),
                ...(groupedTickets[TicketStatus.CANCELLED] || [])
            ]
        }
    ];
    const navigate = useNavigate();

    // Handle ticket click to open modal
    const handleTicketClick = async (ticketId: string) => {

        navigate(`/ticket/${ticketId}`);

    }

        // Handle saving ticket changes
        const handleSaveTicket = (updatedTicket: Ticket) => {
            const now = new Date().toISOString();
            const ticketWithTimestamp = {
                ...updatedTicket,
                modifiedAt: now,
                modifiedBy: 'current.user@company.com' // In real app, get from auth context
            };

            setTickets(prevTickets =>
                prevTickets.map(ticket =>
                    ticket.id === updatedTicket.id ? ticketWithTimestamp : ticket
                )
            );
        };

        // Handle closing modal
        const handleCloseModal = () => {
            setIsModalOpen(false);
            setSelectedTicket(null);
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
                {/* Header */}
                <Navigation currentPath='/kanban' />
                <div className="relative z-10 pt-20 pb-8 backdrop-blur-md bg-white/5 border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-white-900 ">Kanban Board</h1>
                                    <p className="mt-2 text-gray-300">
                                        Manage tickets with a visual workflow
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                title={column.title}
                                tickets={column.tickets}
                                status={column.status}
                                onTicketClick={handleTicketClick}
                            />
                        ))}
                    </div>
                </div>


            </div>
        );
    }