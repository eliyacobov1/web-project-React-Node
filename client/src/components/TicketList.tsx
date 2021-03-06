import React from "react";
import App from "../App";
import {Ticket} from "../api";
import CreateCommentBox from "./CreateCommentBox";
import CommentSection from "./CommentSection";

/**
 * this component renders each ticket in the array tickets
 */
const TicketList = (props: {
    app: App,
    tickets: Ticket[],
}) => {
    const app = props.app;  // main App component
    // Q1.b, render a ticket only if it is not hidden
    return (<ul className='tickets'>
        {props.tickets.map((ticket) => (app.isHidden(ticket.id) ? null:
            <li key={ticket.id} className={'ticket'}
                onMouseOver={() => app.setHoveringTicket(ticket)}  onMouseLeave={() => app.setHoveringTicket()}>
                {/* ticket starts here*/}
                {app.state.hoveredTicket === ticket.id && <button onClick={()=>app.hideTicket(ticket.id)}>Hide</button>}
                <h5 className='title'>{ticket.title}</h5>
                {/* Q1.d, only 3 lines of the ticket are visible by default*/}
                <div className={app.isExpanded(ticket.id) ? '' : 'truncate-overflow'}>
                    <h5 className='content'>{ticket.content}</h5></div>
                {/* see more/ see less button */}
                <button onClick={() => app.toggleExpanded(ticket.id)} className='see-more-btn'>
                    {app.isExpanded(ticket.id) ? 'See less' : 'See more'}</button>
                {ticket.commentSection && <div>
                    {/* comment section and new comment */}
                    <hr className='bold-line'/>
                    <CreateCommentBox handleSubmit={app.addComment} ticketID={ticket.id}/>
                    <CommentSection comments={ticket.comments}/>
                </div>}
                <footer>
                    <div className='wrapper-row'>
                        <div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
                        {/* ticket labels */}
                        {ticket.labels ? ticket.labels.map((label) => (
                            <span className='label'>{label}</span>)) : null}
                    </div>
                    <div className='wrapper-row'>
                    {/* Q3 show/hide comments button */}
                    <button className="bottom-right-btn bg-info"
                            onClick={() => app.toggleCommentSection(ticket.id)}>
                        {ticket.commentSection ? 'Hide Comments': 'Show Comments'}
                    </button>
                    {/* clone button */}
                    <button onClick={() => app.cloneTicket(ticket)} className='bottom-right-btn bg-success'>
                        clone</button>
                    </div>
                </footer>
                {/* ticket ends here*/}
            </li>))}
    </ul>);
}

export default TicketList;