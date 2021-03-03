import React from 'react';
import './App.scss';
import {createApiClient, Ticket} from './api';

export type AppState = {
	tickets?: Ticket[],
	hiddenTickets?: string[], // id's of hidden tickets
	expandedTickets?: string[],
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
			tickets: await api.getTickets()
		});
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

		// Q 1.a, render a ticket only if it is not hidden
		return (<ul className='tickets'>
			{filteredTickets.map((ticket) => ( this.isHidden(ticket.id) ? null:
				<li key={ticket.id} className='ticket'
					onMouseOver={() => this.setHoveringTicket(ticket)}
					onMouseLeave={() => this.setHoveringTicket()}>
					{hoveredTicket === ticket.id && <button onClick={()=>this.hideTicket(ticket.id)}>Hide</button>} {/*Q 1.b*/}
					<h5 className='title'>{ticket.title}</h5>
					<h5 className='content'>{ticket.content}</h5>
					<footer>
						<div className='meta-data'>By {ticket.userEmail} | { new Date(ticket.creationTime).toLocaleString()}</div>
					</footer>
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
			<div className='wrapper-col'>
				<h1>Tickets List</h1>
				<h4 className='dark-mode-btn' onClick={() => this.toggleDarkMode()}>Toggle Light/Dark Mode</h4>
			</div>
			<header>
				<input type="search" placeholder="Search..." onChange={(e) => this.onSearch(e.target.value)}/>
			</header>
			<div className='results wrapper-row'>
			{tickets ? <div>Showing {tickets.length-numHiddenTickets} results</div> : null }
			{this.renderHiddenCount(numHiddenTickets)}
			</div>
			{tickets ? this.renderTickets(tickets, hoveredTicket) : <h2>Loading..</h2>}
		</main>)
	}
}

export default App;