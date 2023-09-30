import { Outlet, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getUser } from "../utils/session.server.ts";

export const loader = async ({ request }) => {
  const user = await getUser(request);

  if (!user) {
    throw new Error("Admin not authenticated.");
  }
  return json(user);
};

export default function AdminDashboard() {
  // Define inline styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f0f0f0",
  };

  const headerStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#00008B",
  };

  const navStyle = {
    listStyle: "none", // Remove bullets
    padding: 0,
  };

  const liStyle = {
    margin: "10px 0",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#0077cc",
    fontSize: "18px",
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1>Admin Dashboard</h1>
        <Link to="/logout" style={linkStyle}>
          Logout
        </Link>
      </header>
      <nav>
        <ul style={navStyle}>
          <li style={liStyle}>
            <Link to="/" style={linkStyle}>
              Home
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/createUser" style={linkStyle}>
              Create Users
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/userRole" style={linkStyle}>
              Manage Roles
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/features" style={linkStyle}>
              Manage Features
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/featuresPer" style={linkStyle}>
              Manage Permissions
            </Link>
          </li>
          <li style={liStyle}>
            <Link to="/roleFeaturesPer" style={linkStyle}>
              Manage Permissions Roles
            </Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

