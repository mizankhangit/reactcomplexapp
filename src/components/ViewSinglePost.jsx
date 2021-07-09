import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import Page from "./Page";
import LoadingDotsIcon from "./LoadingDotsIcon";
import NotFound from "./NotFound";
import StateContext from "./../StateContext";
import DispatchContext from "./../DispatchContext";

const ViewSinglePost = (props) => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [post, setPost] = useState({});
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();
    async function fetchPost() {
      try {
        const response = await axios.get(`/post/${id}`, {
          cancelToken: ourRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("There was a problem or the request was cancelled.");
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username;
    }
    return false;
  }

  async function deleteHandler() {
    const areYouSure = window.confirm(
      "Do you really want to delete this post?"
    );
    if (areYouSure) {
      try {
        const response = await axios.delete(`/post/${id}`, {
          data: { token: appState.user.token },
        });
        if (response.data === "Success") {
          appDispatch({
            type: "flashMessages",
            value: "Post was successfully deleted.",
          });
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log("There was a problem");
      }
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link
              to={`/post/${id}/edit`}
              data-tip="Edit"
              data-for="edit"
              className="text-primary mr-2"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />{" "}
            <span
              onClick={deleteHandler}
              data-tip="Delete"
              data-for="delete"
              className="delete-post-button text-danger"
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </span>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} alt="" />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} />
      </div>
    </Page>
  );
};

export default withRouter(ViewSinglePost);
