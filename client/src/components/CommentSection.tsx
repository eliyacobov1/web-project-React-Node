import React from "react";
import {Comment} from "../api"

/**
 * this components represents the comment section of a ticket
 */
const CommentSection = (props: {
    comments?: Comment[]
}) => {
    return(props.comments ? <ul className='tickets'>
        {props.comments.map((comment, index) =>
        <li key={index} className={'comment'}>
            <hr className='bold-line'/>
            <div className="col-sm-5">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <strong>{comment.author}</strong> <span className="text-muted">
                        commented on {new Date(comment.creationTime).toLocaleString()}</span>
                    </div>
                    <div className="panel-body">
                        {comment.content}
                    </div>
                </div>
            </div>
        </li>
        )}
    </ul> : null)
}

export default CommentSection;