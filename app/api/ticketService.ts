import type { Ticket } from "../types/ticket";
import type { Comment } from "../types/comment";


export const ticketService = {

    getTickets: async (params?: { page?: number; limit?: number }) => {
        const response = await api.get<Ticket[]>("/ticket/overviewData", { params });
        return response.data;
    },

    getTicketById: async (ticketId: string) => {
        const response = await api.get<Ticket>(`/ticket/${ticketId}`);
        return response.data;
    },

    createTicket: async (ticketData: Omit<Ticket, "id">) => {
        const response = await api.post<Ticket>("/ticket", ticketData);
        return response.data;
    },

    updateTicket: async (ticketId: string, ticketData: Partial<Ticket>) => {
        const response = await api.put<Ticket>(`/ticket/${ticketId}`, ticketData);
        return response.data;
    },

    addCommentToTicket: async (ticketId: string, commentData: Omit<Comment, "id" | "createdAt">) => {
        const response = await api.post<Comment>(`/ticket/${ticketId}/comments`, commentData);
        return response.data;
    },
};