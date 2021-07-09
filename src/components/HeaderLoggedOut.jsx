import axios from "axios";
import React, { useState, useContext } from "react";
import DispatchContext from "./../DispatchContext";

const HeaderLoggedOut = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const appDispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      if (response.data) {
        appDispatch({ type: "login", data: response.data });
        appDispatch({
          type: "flashMessages",
          value: "You have successfully logged in.",
        });
      } else {
        appDispatch({
          type: "flashMessages",
          value: "Invalid username or password",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-0 pt-2 pt-md-0">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="username"
            className="form-control form-control-sm input-dark"
            type="text"
            placeholder="Username"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input
            name="password"
            className="form-control form-control-sm input-dark"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-auto">
          <button type="submit" className="btn btn-success btn-sm">
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeaderLoggedOut;
