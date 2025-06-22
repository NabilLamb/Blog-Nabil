import React, { useState, useContext, useEffect } from "react";
import Logo from "/logo.png";
import { Link, useLocation } from "react-router-dom";
import { CiUser, CiMenuBurger, CiCircleRemove } from "react-icons/ci";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const location = useLocation();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { name: "ART", path: "/?category=art" },
    { name: "SCIENCE", path: "/?category=science" },
    { name: "TECHNOLOGY", path: "/?category=technology" },
    { name: "CINEMA", path: "/?category=cinema" },
    { name: "DESIGN", path: "/?category=design" },
    { name: "FOOD", path: "/?category=food" },
  ];

  // Determine active category based on URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("cat") || "";
    setActiveCategory(category);
  }, [location]);

  return (
    <div className="navbar">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <img src={Logo} alt="logo" />
          <span className="logo-text">Blog-Nabil</span>
        </Link>

        <div className="nav-items">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${
                activeCategory === item.name.toLowerCase() ? "active" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          {currentUser ? (
            <div className="user-info">
              <div className="user-name">
                <CiUser className="user-icon" />
                <span className="username">{currentUser.username}</span>
              </div>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <Link className="login-btn" to="/login">
              Login
            </Link>
          )}
          <Link className="write-btn" to="/write">
            <span className="btn-icon">✏️</span>
            <span className="btn-text">Write</span>
          </Link>
        </div>

        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <CiCircleRemove size={24} />
          ) : (
            <CiMenuBurger size={24} />
          )}
        </button>
      </div>

      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-nav-items">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`mobile-nav-item ${
                activeCategory === item.name.toLowerCase() ? "active" : ""
              }`}
              onClick={closeMobileMenu}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mobile-nav-right">
          {currentUser ? (
            <>
              <div className="mobile-user-info">
                <div className="mobile-user-name">
                  <CiUser className="user-icon" />
                  <span className="username">{currentUser.username}</span>
                </div>
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              className="mobile-login-btn"
              to="/login"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          )}
          <Link
            className="mobile-write-btn"
            to="/write"
            onClick={closeMobileMenu}
          >
            <span className="btn-icon">✏️</span>
            <span className="btn-text">Write</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;