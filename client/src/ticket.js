import React, {Component} from 'react';

class Ticket extends Component{
    constructor(props) {
        super(props);

        this.state = {
            hidden: false,
            hovered: false,
            expanded: false
        };
    }

    /**
     * changes the hidden status of the ticket
     */
    toggleHidden = () => {
        let isHidden = this.state.hidden;

        this.setState({
            hidden: !isHidden
        })
    };

    /**
     * changes the hidden status of the ticket
     */
    toggleHovered = () => {
        let isHovered = this.state.hovered;

        this.setState({
            hovered: !isHovered
        })
    };

    render(){
        const {hidden, hovered,expanded} = this.state

        return !hidden ?(
            <li key={this.props.id} className='ticket'
                onMouseOver={() => this.toggleHovered()}
                onMouseLeave={() => this.toggleHovered()}>
                {hovered && <button onClick={()=>this.toggleHidden()}>Hide</button>} {/*Q 1.b*/}
                <h5 className='title'>{this.props.title}</h5>
                <h5 className='content'>{this.props.content}</h5>
                <footer>
                    <div className='meta-data'>By {this.props.userEmail} | { new Date(this.props.creationTime).toLocaleString()}</div>
                </footer>
            </li>
        ): null;
    }
}

export default Ticket;
