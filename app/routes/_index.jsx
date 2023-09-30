import { Link } from "@remix-run/react";

import stylesUrl from "../styles/index.css";

export const links = () => [{ rel: "stylesheet", href: stylesUrl }];

export default function IndexRoute() {
  return (
    <div className="container">
      <div className="content">
        <h1>
          Remix <span>Permission Management System</span>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="/login">Admin Login</Link>
            </li>
            <li>
              <Link to="/UserLogin">User Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
