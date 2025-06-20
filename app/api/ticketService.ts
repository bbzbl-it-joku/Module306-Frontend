import type { Ticket } from "../types/ticket";
import type { Comment } from "../types/comment";
import { api } from "./apiClient";

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
        const response = await api.post<Comment>(`/comment/`, commentData);
        return response.data;
    },

    getCommentsForTicket: async (ticketId: string) => {
        const response = await api.get<Comment[]>(`/comment/${ticketId}`);
        return response.data;
    },


    updateComment: async (commentId: string, commentData: Partial<Comment>) => {
        const response = await api.put<Comment>(`/comment/${commentId}`, commentData);
        return response.data;
    },

    getAttachment : async (attachmentId: string, type: string, fileName: string, mimeType: string) => {
        const response = await api.get(`/attachment/${type}/${attachmentId}/${fileName}`)
        return response.data;
    }
};