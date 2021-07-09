import React, { useState, useContext } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import Page from "./Page";
import DispatchContext from "./../DispatchContext";
import StateContext from "./../StateContext";

const CreatePost = (props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      });
      appDispatch({
        type: "flashMessages",
        value: "Congrats, you created a new post.",
      });
      props.history.push(`/post/${response.data}`);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Page title="Create New Post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
};

export default withRouter(CreatePost);
