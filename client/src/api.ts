import axios from 'axios';
import {APIPageLimitQuery, APIPageQuery, APIRootPagePath, APIRootPath, APISearchQuery} from '@fed-exam/config';

export const PAGE_SIZE = 20  // PAGE_SIZE is now an API constant

export type Ticket = {
    id: string,
    title: string;
    content: string;
    creationTime: number;
    userEmail: string;
    labels?: string[];
    comments?: Comment[]
}

/**
 * Q3 added anonymous comment mechanism
 */
export type Comment = {
    ticketID: string, // foreign key
    author: string,
    content: string,
    creationTime: number
}

export type ApiClient = {
    getPage: (page: number, searchVal: string) => Promise<Ticket[]>;
    getTickets: (searchVal: string) => Promise<Ticket[]>;
    clone: (ticket: Ticket) => Promise<Ticket>;
    addComment: (ticket: Ticket, comment: Comment) => Promise<Ticket>;
}

export const createApiClient = (): ApiClient => {
    return {
        getTickets: (searchVal: string) => {
            if(searchVal !== ''){
                return axios.get(`${APIRootPath}${APISearchQuery}${searchVal}`)
                    .then((res) => res.data);
            }
            return axios.get(APIRootPath).then((res) => res.data);
        },

        /**
         * Q2.b get request endpoint for a specific page
         */
        getPage: (page: number, searchVal: string) => {
            if(searchVal !== ''){
                // get paginated data with accordance to searchVal
                return axios.get(`${APIRootPath}${APISearchQuery}${searchVal}&${APIPageQuery}\
                ${page}${APIPageLimitQuery}${PAGE_SIZE}`)
                    .then((res) => res.data).catch(error => console.log(error));
            }
            return axios.get(`${APIRootPagePath}${page}${APIPageLimitQuery}${PAGE_SIZE}`)
                .then((res) => res.data).catch(error => console.log(error));
        },

        /**
         * Q2.a Clone method
         */
        clone: (obj) => {
            return axios.post(APIRootPath, obj).then((res) => res.data)
                .catch(error => console.log(error));
        },

        /**
         * Q3 add comment to ticket
         */
        addComment: (ticket, comment) => {
            let comments = ticket.comments ? ticket.comments : []
            comments.push(comment)
            ticket ={...ticket, comments: comments}
            return axios.put(APIRootPath, ticket).then((res) => res.data)
                .catch(error => console.log(error));
        }

    }
}
