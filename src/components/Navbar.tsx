import React from "react";
import { Link, NavLink } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4" to="/home">
          <span className="me-2">🛍️</span> Chopits
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/produtos"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                Produtos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/usuarios"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                Usuários
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/sobre"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold text-white" : ""}`
                }
              >
                Sobre
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm px-3">
              Entrar / Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
