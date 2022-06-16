import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  return (
    <>
      <div className="navbar">
        <button
          className={active === "Create Event" ? "active" : ""}
          onClick={() => {
            setActive("Create Event");
            navigate("/create");
          }}
        >
          Create Event
        </button>
        <button
          className={active === "Home" ? "active" : ""}
          onClick={() => {
            setActive("Home");
            navigate("/");
          }}
        >
          Home
        </button>
      </div>
      <Outlet />
    </>
  );
};
