import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import DispatchContext from "./../DispatchContext";
import StateContext from "./../StateContext";

const HeaderLoggenIn = () => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLoggedOut() {
    appDispatch({ type: "logout" });
    appDispatch({
      type: "flashMessages",
      value: "You have successfully logged out.",
    });
  }

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: "openSearch" });
  }

  return (
    <div className="flex-row my-3 my-md-0">
      <span
        data-for="search"
        data-tip="Search"
        onClick={handleSearchIcon}
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </span>
      <ReactTooltip place="bottom" id="search" className="custom-tooltip" />{" "}
      <span
        onClick={() => appDispatch({ type: "toggleChat" })}
        data-for="chat"
        data-tip="Chat"
        className={`mr-2 header-chat-icon ${
          appState.unreadChatCount ? "text-danger" : "text-white"
        }`}
      >
        <i className="fas fa-comment"></i>
        {appState.unreadChatCount ? (
          <span className="chat-count-badge text-white">
            {appState.unreadChatCount < 10 ? appState.unreadChatCount : "9+"}
          </span>
        ) : (
          ""
        )}
      </span>
      <ReactTooltip place="bottom" id="chat" className="custom-tooltip" />{" "}
      <Link
        data-for="profile"
        data-tip="My Profile"
        to={`/profile/${appState.user.username}`}
        className="mr-2"
      >
        <img
          className="small-header-avatar"
          src={appState.user.avatar}
          alt=""
        />
      </Link>{" "}
      <ReactTooltip place="bottom" id="profile" className="custom-tooltip" />
      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>{" "}
      <button onClick={handleLoggedOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
};

export default HeaderLoggenIn;
