import { json, redirect } from "@remix-run/node";
import { db } from "../utils/db.server";
import { getUserSession } from "../utils/session.server";
import { Link, useLoaderData } from "@remix-run/react";
import stylesUrl from "../styles/index.css";

export const links = () => [{ rel: "stylesheet", href: stylesUrl }];

export const loader = async ({ request }) => {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                roleFeaturePermissions: {
                  include: {
                    featurePermission: {
                      include: {
                        feature: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("User Data:", user);

    if (!user) {
      return json({ error: "User data not available" }, { status: 404 });
    }

    return { user, userId: session.userId };
  } catch (error) {
    console.error("Error loading user data:", error);
    return json({ error: "Error loading user data" }, { status: 500 });
  }
};

export default function UserDashboard() {
  const { user, userId } = useLoaderData();


  return (
    <div className="container">
      <div className="content">
        <h1>User Dashboard</h1>
        <p>Welcome, {user.username} !</p>
        <ul>
          {user.userRoles.map((userRole) => (
            <li key={userRole.id}>
              {userRole.role.roleName}
              <ul>
                {userRole.role.roleFeaturePermissions.map(
                  (roleFeaturePermission) => (
                    <li key={roleFeaturePermission.id}>
                      {roleFeaturePermission.featurePermission.feature
                        ? roleFeaturePermission.featurePermission.feature.featureName
                        : "Feature name not available"}
                      <br />
                      Permission:{" "}
                      {roleFeaturePermission.featurePermission.permission
                        ? "Allowed"
                        : "Not Allowed"}
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>

        <Link to="/userLogout">Logout</Link>
      </div>
    </div>
  );
}







