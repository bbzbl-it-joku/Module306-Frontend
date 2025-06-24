import type { Ticket, Comment } from "~/types";
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

    createTicket: async (ticketData: Omit<Ticket, "id">, attachments?: FileList) => {
        const response = await api.post<Ticket>("/ticket", { ticket: ticketData, files: attachments ?? [] }, { headers: { "Content-Type": "multipart/form-data" } });
        return response.data;
    },

    updateTicket: async (ticketId: string, ticketData: Partial<Ticket>, attachments?: FileList) => {
        const response = await api.put<Ticket>(`/ticket/${ticketId}`, { ticket: ticketData, files: attachments ?? [] }, { headers: { "Content-Type": "multipart/form-data" } });
        return response.data;
    },

    addCommentToTicket: async (ticketId: string, commentData: Omit<Comment, "id" | "createdAt">, attachments?: FileList) => {
        const response = await api.post<Comment>(`/comment/${ticketId}`, { comment: commentData, files: attachments ?? [] }, { headers: { "Content-Type": "multipart/form-data" } });
        return response.data;
    },

    getCommentsForTicket: async (ticketId: string) => {
        const response = await api.get<Comment[]>(`/comment/${ticketId}`);
        return response.data;
    },


    updateComment: async (ticketId: string, commentData: Partial<Comment>, attachments?: FileList) => {
        const response = await api.put<Comment>(`/comment/${ticketId}`, { comment: commentData, files: attachments ?? [] }, { headers: { "Content-Type": "multipart/form-data" } });
        return response.data;
    },

    getAttachment : async (attachmentId: string, type: string, fileName: string, mimeType: string) => {
        const response = await api.get(`/attachment/${type}/${attachmentId}/${fileName}?mimeType=${mimeType}`)
        return response.data;
    }
};