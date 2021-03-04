import axios from 'axios';
import {APIPageLimitQuery, APIRootPagePath, APIRootPath} from '@fed-exam/config';

export const PAGE_SIZE = 20  // PAGE_SIZE is now an API constant

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
}

export type ApiClient = {
    getTicketPage: (page: number) => Promise<Ticket[]>;
    getTickets: () => Promise<Ticket[]>;
    clone: (ticket: Ticket) => Promise<Ticket>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: () => {
            return axios.get(APIRootPath).then((res) => res.data);
        },

        /**
         * Q 2.b get request endpoint for a specific page
         */
        getTicketPage: (page: number) => {
            return axios.get(`${APIRootPagePath}${page}${APIPageLimitQuery}${PAGE_SIZE}`)
                .then((res) => res.data);
        },

        /**
         * Q 2.a clone method
         */
        clone: (ticket: Ticket) => {
            return axios.post(APIRootPath, ticket).then((res) => res.data)
        }
    }
}
