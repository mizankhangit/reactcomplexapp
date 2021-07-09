import React, { useContext } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedOut from "./HeaderLoggedOut";
import HeaderLoggenIn from "./HeaderLoggenIn";
import appState from "./../StateContext";

const Header = () => {
  const { loggedIn } = useContext(appState);

  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            reactcomplexapp
          </Link>
        </h4>
        {loggedIn ? <HeaderLoggenIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
};

export default Header;
