import React, { useEffect, Suspense } from "react";
import { useImmerReducer } from "use-immer";
import axios from "axios";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import About from "./components/About";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import Profile from "./components/Profile";
import FlashMessages from "./components/FlashMessages";
import NotFound from "./components/NotFound";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import EditPost from "./components/EditPost";
import LoadingDotsIcon from "./components/LoadingDotsIcon";

const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
const CreatePost = React.lazy(() => import("./components/CreatePost"));

axios.defaults.baseURL = "https://reactcomplexapp-api.herokuapp.com/";

const App = () => {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0,
  };
  const reducer = (draft, action) => {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessages":
        draft.flashMessages.push(action.value);
        return;
      case "openSearch":
        draft.isSearchOpen = true;
        return;
      case "closeSearch":
        draft.isSearchOpen = false;
        return;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "closeChat":
        draft.isChatOpen = false;
        return;
      case "incrementUnreadChatCount":
        draft.unreadChatCount++;
        return;
      case "clearUnreadChatCount":
        draft.unreadChatCount = 0;
        return;
      default:
        return draft;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
  }, [
    state.loggedIn,
    state.user.token,
    state.user.username,
    state.user.avatar,
  ]);

  // Check if token has expired or not
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await axios.post(
            `/checkToken`,
            { token: state.user.token },
            {
              cancelToken: ourRequest.token,
            }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessages",
              value: "Your session has expired. Please log in again.",
            });
          }
        } catch (error) {
          console.log("There was a problem or the request was cancelled");
        }
      }

      fetchResults();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [dispatch, state.loggedIn, state.user.token]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route exact path="/">
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route exact path="/about-us">
                <About />
              </Route>
              <Route exact path="/create-post">
                <CreatePost />
              </Route>
              <Route exact path="/post/:id/edit">
                <EditPost />
              </Route>
              <Route exact path="/post/:id">
                <ViewSinglePost />
              </Route>
              <Route exact path="/terms">
                <Terms />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>

          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            unmountOnExit
            classNames="search-overlay"
          >
            <div className="search-overlay">
              <Suspense fallback={""}>
                <Search />
              </Suspense>
            </div>
          </CSSTransition>

          <Suspense fallback={""}>{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;
