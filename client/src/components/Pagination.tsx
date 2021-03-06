import React, {Fragment} from 'react';
import {ApiClient, PAGE_SIZE} from "../api";
import App from "../App";

const LEFT_PAGE = -1;
const RIGHT_PAGE = -2;
const FIRST_PAGE = 1;
const SECOND_PAGE = 2;

export type PaginationState = {
    currentPage: number;
    totalPages: number;
}

// @ts-ignore
/**
 * Pagination component
 */
export class Pagination extends React.Component<{api: ApiClient, app: App},
    PaginationState> {
    private api: ApiClient;
    private app: App;

    constructor(props: { api: ApiClient, app: App }) {
        super(props);
        const {api, app} = props;
        this.api = api;
        this.app = app;
        this.state = {
            currentPage: 1,
            // @ts-ignore
            totalPages: 1
        };
    }

    /**
     * trigger a render after the numTicket field of app
     * is defined (during the app.componentDidMount() call)
     */
    componentDidMount() {
        this.app.componentDidMount().then(() =>
            this.setState({
            // @ts-ignore
            totalPages: Math.ceil(this.app.state.numTickets/ PAGE_SIZE)
            }))
    }

    /**
     * switch page by re-rendering the pagination-component and
     * making a get request to the server to fetch the tickets
     * appropriate to the new page and re-render the main App component
     */
    switchPage = async (pageNum: number) => {
        this.app.restoreTickets() // restore hidden tickets before moving to next page
        this.app.setState({
            tickets: await this.api.getPage(pageNum)
        });
        this.setState({
            currentPage: pageNum
        })
        return false;
    }

    /**
     * this function checks the location of the current page
     * in accordance to all of the other pages and returns the
     * numbers of the pages that should be displayed in the page-section
     */
    fetchPageNumbers = () => {
        const totalPages = this.state.totalPages;
        const currentPage = this.state.currentPage;
        let pageNumbers = [FIRST_PAGE];

        if(currentPage === FIRST_PAGE){
            pageNumbers.push(...[SECOND_PAGE, RIGHT_PAGE]);
        }
        else if (currentPage === SECOND_PAGE){
            pageNumbers.push(...[LEFT_PAGE, currentPage]);
            if (currentPage <= totalPages-1){
                if (currentPage < totalPages-1){
                    pageNumbers.push(currentPage+1)
                }
                pageNumbers.push(...[RIGHT_PAGE, totalPages]);
            }
        }
        else if (currentPage === totalPages){ // last page
            pageNumbers.push(...[LEFT_PAGE, currentPage-1, currentPage]);
        }
        else if (currentPage === totalPages - 1){ // one to the last page
            pageNumbers.push(...[LEFT_PAGE, currentPage-1, currentPage,
                RIGHT_PAGE, totalPages]);
        }
        else{
            pageNumbers.push(...[LEFT_PAGE, currentPage-1, currentPage,
                currentPage+1, RIGHT_PAGE, totalPages]);
        }
        return pageNumbers;
    }

    render() {
        // only 1 page or numTicket field of app was not defined
        if (this.state.totalPages === 1) return null;
        const {currentPage} = this.state;
        const pages = this.fetchPageNumbers();

        return (
            <Fragment>
                <nav aria-label="Countries Pagination">
                    <ul className="pagination">
                    {pages.map((page: number, index: number) => {
                        if (page === LEFT_PAGE) return (
                            <li key={index} className="page-item">
                                <button className="page-link" aria-label="Previous"
                                        onClick={() => this.switchPage(currentPage-1)}>
                                    <span aria-hidden="true">&laquo;</span>
                                    <span className="sr-only">Previous</span>
                                </button>
                            </li>);
                        if (page === RIGHT_PAGE) return (
                            <li key={index} className="page-item">
                                <button className="page-link" aria-label="Next"
                                        onClick={() => this.switchPage(currentPage+1)}>
                                    <span aria-hidden="true">&raquo;</span>
                                    <span className="sr-only">Next</span>
                                </button>
                            </li>);
                        return (
                            <li key={index} className={`page-item${currentPage === page ? ' active' : ''}`}>
                                <button className="page-link" onClick={() => this.switchPage(page)}>{page}</button>
                            </li>);})}
                    </ul>
                </nav>
            </Fragment>);}
}

export default Pagination;