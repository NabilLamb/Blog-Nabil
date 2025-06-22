import React from "react";
import Logo from "/logo.png";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRegCopyright,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Link to="/">
                <img src={Logo} alt="logo" className="footer-logo" />
              </Link>
              <p className="footer-tagline">
                Sharing knowledge and inspiring createivity through thoughtful
                content.
              </p>
              <div className="social-icons">
                <a
                  href="https://www.facebook.com/nabil.lambattan"
                  aria-label="Facebook"
                  target="_blank"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="https://www.instagram.com/nabil_lambattan/"
                  aria-label="Instagram"
                  target="_blank"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.linkedin.com/in/nabil-lambattan-227961186/"
                  aria-label="LinkedIn"
                  target="_blank"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            <div className="footer-bottom">
              <p className="copyright">
                <FaRegCopyright /> {currentYear} Nabil Lambattan. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
