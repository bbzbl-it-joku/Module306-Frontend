import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navigation } from '~/navigation/navigation';

// Mock data and types (based on your existing structure)
const TicketStatus = {
    OPEN: 'open',
    IN_PROGRESS: 'in-progress',
    UNDER_REVIEW: 'under-review',
    RESOLVED: 'resolved',
    CLOSED: 'closed',
    CANCELLED: 'cancelled'
} as const;

const TicketPriority = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
} as const;

const STATUS_COLORS = {
    [TicketStatus.OPEN]: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-300'
    },
    [TicketStatus.IN_PROGRESS]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-300'
    },
    [TicketStatus.UNDER_REVIEW]: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-300'
    },
    [TicketStatus.RESOLVED]: {
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-300'
    },
    [TicketStatus.CLOSED]: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-300'
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

const mockTickets = [
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
    },
    {
        id: 'TKT-006',
        title: 'Implement file upload feature',
        description: 'Add ability to upload and attach files to tickets with preview functionality.',
        status: TicketStatus.UNDER_REVIEW,
        priority: TicketPriority.HIGH,
        assignedTo: 'bob.wilson@company.com',
        createdBy: 'alice.johnson@company.com',
        createdAt: '2024-01-18T11:00:00Z',
        modifiedBy: 'bob.wilson@company.com',
        modifiedAt: '2024-01-21T14:30:00Z',
        tags: ['feature', 'upload', 'files']
    }
];

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
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 border border-gray-200 cursor-pointer mb-3"
            onClick={handleCardClick}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-gray-500">#{ticket.id}</span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[ticket.priority].bg} ${PRIORITY_COLORS[ticket.priority].text}`}>
                    {ticket.priority}
                </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                {ticket.title}
            </h3>

            {/* Tags */}
            {ticket.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {ticket.tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                    {ticket.tags.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                            +{ticket.tags.length - 2}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                {ticket.assignedTo && (
                    <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-700">
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

function KanbanColumn({ title, tickets, status, onTicketClick }: KanbanColumnProps) {
    const statusColors = STATUS_COLORS[status];

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
            <div className="bg-gray-50 rounded-b-lg p-4 min-h-96 max-h-screen overflow-y-auto">
                {tickets.length === 0 ? (
                    <div className="text-center text-gray-400 mt-8">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-sm">No tickets</p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <KanbanCard
                            key={ticket.id}
                            ticket={ticket}
                            onClick={onTicketClick}
                        />
                    ))
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
    const handleTicketClick = (ticketId: string) => {

        navigate(`/ticket/${ticketId}`);

        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket) {
            setSelectedTicket(ticket);
            setIsModalOpen(true);
        }
    };

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