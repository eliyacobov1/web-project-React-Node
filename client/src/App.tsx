import React from 'react';
import './App.scss';
import {createApiClient, Ticket, Comment} from './api';
import Pagination from './components/Pagination'
import TicketList from "./components/TicketList";

export type AppState = {
	tickets?: Ticket[],
	numTickets?: number, // total number of tickets, used for pagination
	hiddenTickets?: string[], // ids of hidden tickets
	expandedTickets?: string[], // ids of expanded tickets
	hoveredTicket?: string, // ticket which the mouse is hovering over (id)
	search: string;
}

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {

	state: AppState = {
		search: ''
	}

	searchDebounce: any = null;

	async componentDidMount() {
		this.setState({
			tickets: await api.getPage(1),
			numTickets: (await api.getTickets()).length
		});
	}

	/**
	 * Q2.a clone the given ticket
	 */
	async cloneTicket(ticket: Ticket) {
		let newTicket = {...ticket};
		delete newTicket.id;
		delete newTicket.comments;
		delete newTicket.creationTime; // these properties are not duplicated
		// render the first page where the cloned ticket can be seen
		api.clone(ticket).then(() => this.componentDidMount())
		alert('Ticket cloned successfully!')
	}

	/**
	 * Q3 Show or hide the comment section
	 * of the ticket with the given id
	 */
	toggleCommentSection = (id: string) => {
		let tickets = this.state.tickets ? [...this.state.tickets] : []
		for(let i = 0; i < tickets.length; i += 1) {
			if(tickets[i].id === id) {
				const showComments = tickets[i].commentSection;
				tickets[i].commentSection = !showComments;
				this.setState({
					tickets: tickets
				})
			}
		}
	}

	/**
	 * Q3 add a comment to the ticket with given id
	 */
	addComment = async (id: string, comment: Comment) => {
		if (!comment)
			return;
		let tickets = this.state.tickets ? [...this.state.tickets] : []
		for(let i = 0; i < tickets.length; i += 1) {
			if(tickets[i].id === id) {
				tickets[i] = await api.addComment(tickets[i], comment);
				this.setState({
					tickets: tickets
				})
				alert('Comment added successfully!')
			}
		}
	}

	/**
	 * (Q1.b) event function that hides the ticket with the given id from the user
	 */
	hideTicket = (id: string) => {
		let hiddenTickets;
		if(typeof this.state.hiddenTickets != "undefined") {
			hiddenTickets = [...this.state.hiddenTickets]
			hiddenTickets.push(id)
		}
		else {
			hiddenTickets = [id]
		}

		this.setState({
			hiddenTickets: hiddenTickets
		} )
	}

	/**
	 * (Q1.d) add or remove a ticket id from the expanded tickets array
	 */
	toggleExpanded = (id: string) => {
		let expandedTickets: string[];
		if(typeof this.state.expandedTickets != "undefined") {
			expandedTickets = [...this.state.expandedTickets]
		}
		else {
			expandedTickets = []
		}

		if (expandedTickets.includes(id)){ // delete ticket from expanded array
			const index = expandedTickets.indexOf(id, 0);
			if (index > -1) {
				expandedTickets.splice(index, 1);
			}
		}
		else{ // add ticket to expanded array
			expandedTickets.push(id)
		}

		this.setState({
			expandedTickets: expandedTickets
		} )
	}

	/**
	 * set the currently hovered over ticket to be the given ticket
	 */
	setHoveringTicket = (ticket?: Ticket) => {
		this.setState({
			hoveredTicket: ticket ? ticket.id : undefined
		})
	}

	/**
	 * (Q1.b) return true if the ticket with given id is hidden, false otherwise
	 */
	isHidden = (id: string) => {
		let hiddenTickets = this.state.hiddenTickets
		if (typeof hiddenTickets != "undefined"){
			return hiddenTickets.includes(id);
		}
		else{
			return false;
		}
	}

	/**
	 * (Q1.d) return true if the ticket with given
	 * id should be in expanded view, false otherwise
	 */
	isExpanded = (id: string) => {
		let expandedTickets = this.state.expandedTickets
		if (typeof expandedTickets != "undefined"){
			return expandedTickets.includes(id);
		}
		else{
			return false;
		}
	}

	/**
	 * (Q1.b) make all of the hidden tickets visible again
	 */
	restoreTickets() {
		this.setState({
			hiddenTickets: []
		} )
	}

	renderTickets = (tickets: Ticket[]) => {
		return <TicketList app={this} tickets={tickets}/>
	}

	onSearch = async (val: string, newPage?: number) => {
		clearTimeout(this.searchDebounce);
		this.searchDebounce = setTimeout(async () => {
			this.setState({
				search: val
			});
		}, 300);
	}

	/**
	 * render the hidden tickets counter and restore button
	 */
	renderHiddenCount = (numHiddenTickets: number) => {
		let suffix = numHiddenTickets>1 ? 's' : ''
		if (numHiddenTickets > 0){
			return <div>&nbsp;({numHiddenTickets} hidden ticket{suffix} -&nbsp;
				<button onClick={() => this.restoreTickets()}> restore</button>)</div>
		}
		else{
			return null
		}
	}

	/**
	 * toggle light-mode and dark-mode
	 */
	toggleDarkMode = () => {
		document.body.classList.toggle('dark-mode')
	}

	render() {
		const {tickets, hiddenTickets} = this.state;
		const numHiddenTickets = hiddenTickets ? hiddenTickets.length : 0;
		const filteredTickets = tickets ? tickets.filter((t) =>
								(t.title.toLowerCase() + t.content.toLowerCase())
								.includes(this.state.search.toLowerCase())) : null;
		return (
			<div id="wrapper"> {/* ensures everything stays in place on window resize */}
				<main>
				<h1>Tickets List</h1>
				{/* Q1.c Dark mode button */}
				<h4 className='btn btn-outline-secondary dark-mode-btn' onClick={() => this.toggleDarkMode()}>Toggle Light/Dark Mode</h4>
				<header>
					<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
				</header>
				<div className='results wrapper-row'>
				{filteredTickets ? <div>Showing {filteredTickets.length-numHiddenTickets} results</div> : null }
				{this.renderHiddenCount(numHiddenTickets)}
				</div>
				{filteredTickets ? this.renderTickets(filteredTickets) : <h2>Loading..</h2>}
				{/* render pagination component only when not using search bar*/}
				{this.state.search === '' && <div className='page-section'><Pagination api={api} app={this}/></div>}
				</main>
			</div>)
	}
}

export default App;