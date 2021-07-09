import React from "react";
import { Link } from "react-router-dom";
import Page from "./Page";

const NotFound = () => {
  return (
    <Page title="Not Found">
      <h2>Whoops, we cannot find that page.</h2>
      <p className="lead text-muted">
        You can always visit the <Link to="/">homepage</Link> to get a fresh
        start.
      </p>
    </Page>
  );
};

export default NotFound;
