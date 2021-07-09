import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-top text-center small text-muted py-3">
      <p>
        <Link to="/" className="mx-1">
          Home
        </Link>{" "}
        |{" "}
        <Link to="/about-us" className="mx-1">
          About Us
        </Link>{" "}
        |{" "}
        <Link to="/terms" className="mx-1">
          Terms
        </Link>
      </p>
      <p className="m-0">
        Copyright &copy; {new Date().getFullYear()}{" "}
        <Link to="/" className="text-muted">
          ComplexApp
        </Link>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
