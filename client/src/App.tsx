import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';
import Pagination from './Pagination'

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
			tickets: await api.getTicketPage(1),
			numTickets: (await api.getTickets()).length
		});
		console.log(await api.getTickets())
	}

	async cloneTicket(ticket: Ticket) {
		const tickets = this.state.tickets ? this.state.tickets : []
		this.setState({
			tickets: [await api.clone(ticket), ...tickets]
		})
	}

	/**
	 * (Q 1.b) event function that hides the ticket with the given id from the user
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
	 * (Q 1.d) add or remove a ticket id from the expanded tickets array
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
	 * (Q 1.b) return true if the ticket with given id is hidden, false otherwise
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
	 * (Q 1.d) return true if the ticket with given
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
	 * (Q 1.b) make all of the hidden tickets visible again
	 */
	restoreTickets() {
		this.setState({
			hiddenTickets: []
		} )
	}


	renderTickets = (tickets: Ticket[], hoveredTicket?: string) => {
		const filteredTickets = tickets
			.filter((t) => (t.title.toLowerCase() + t.content.toLowerCase()).includes(this.state.search.toLowerCase()));

		// Q 1.b, render a ticket only if it is not hidden
		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => ( this.isHidden(ticket.id) ? null:
				<li key={ticket.id} className={'ticket'}
					onMouseOver={() => this.setHoveringTicket(ticket)}  onMouseLeave={() => this.setHoveringTicket()}>
					{/* ticket starts here*/}
					{hoveredTicket === ticket.id && <button onClick={()=>this.hideTicket(ticket.id)}>Hide</button>}
					<h5 className='title'>{ticket.title}</h5>
					{/* Q 1.d, only 3 lines of the ticket are visible by default*/}
					<div className={this.isExpanded(ticket.id) ? '' : 'truncate-overflow'}>
						<h5 className='content'>{ticket.content}</h5></div>
					{/* see more/ see less button */}
					<button onClick={() => this.toggleExpanded(ticket.id)} className='see-more-btn'>
						{this.isExpanded(ticket.id) ? 'See less' : 'See more'}</button>
					<footer>
						<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
						{/* clone button */}
						<button onClick={() => this.cloneTicket(ticket)} className='clone-btn'>
							clone</button>
					</footer>
					{/* ticket ends here*/}
				</li>))}
		</ul>);
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
		const {tickets, hiddenTickets, hoveredTicket} = this.state;
		const numHiddenTickets = hiddenTickets ? hiddenTickets.length : 0;

		return (<main>
			<h1>Tickets List</h1>
			{/* Q 1.c Dark mode button */}
			<h4 className='btn btn-outline-secondary dark-mode-btn' onClick={() => this.toggleDarkMode()}>Toggle Light/Dark Mode</h4>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			<div className='results wrapper-row'>
			{tickets ? <div>Showing {tickets.length-numHiddenTickets} results</div> : null }
			{this.renderHiddenCount(numHiddenTickets)}
			</div>
			{tickets ? this.renderTickets(tickets, hoveredTicket) : <h2>Loading..</h2>}
			<Pagination api={api} app={this}/>
		</main>)
	}
}

export default App;