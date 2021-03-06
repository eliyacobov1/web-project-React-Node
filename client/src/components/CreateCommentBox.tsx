import React from "react";

/**
 * this component represents the form that is used to add a comment
 */
const CreateCommentBox = (props: {
    // @ts-ignore
    handleSubmit,
    ticketID: string
}) => {
    // @ts-ignore
    const processComment = (e) => {
        e.preventDefault();
        let authorVal = e.target[0].value.trim();
        let contentVal = e.target[1].value.trim();
        if (!contentVal || !authorVal) {
            return;
        }
        let comment = {ticketID: props.ticketID, author: authorVal,
            content: contentVal, creationTime: new Date().getTime()}
        // @ts-ignore
        document.getElementById("addon1").value = "";
        // @ts-ignore
        document.getElementById("addon2").value = ""; // clear form fields
        props.handleSubmit(props.ticketID, comment)
    }

    return(<form className="comment-form form-group" onSubmit={processComment}>
            <div className="input-group mb-2 mx-sm-2">
                <div className="input-group-prepend">
                    <span className="input-group-text">Author</span>
                </div>
                <input type="text" className="form-control" placeholder="Enter name / e-mail..." aria-label="" id="addon1"/>
            </div>
            <div className="input-group input-group-lg mb-2 mx-sm-2">
                <div className="input-group-prepend">
                    <span className="input-group-text">Comment</span>
                </div>
                <textarea className="form-control" placeholder="Type your comment..." id="addon2"/>
            </div>
            <div className="mb-2 mx-sm-2">
            <input type="submit" value="Post" id="addPost" className="btn btn-info" />
            </div>
        </form>)}

export default CreateCommentBox;