import React from 'react';
import {PAGE_SIZE} from "./api";

// @ts-ignore
const Pagination = ({api, app}) => {
    const pageNumbers = [];
    const totalTickets = app.state.numTickets || 1

    for (let i = 1; i <= Math.ceil(totalTickets/ PAGE_SIZE); i++) {
        pageNumbers.push(i);
    }

    const switchPage = async (pageNum: number) => app.setState({
        tickets: await api.getTicketPage(pageNum)
    })

    return (
        <nav>
        <ul className='pagination'>
            {pageNumbers.map(number =>
            (<li key={number} className='page-item'>
                <button onClick={() => switchPage(number)} className='page-link'>
                {number}</button>
            </li>))}
        </ul>
    </nav>);
};

export default Pagination;