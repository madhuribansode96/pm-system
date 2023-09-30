// routes/userRoles.tsx
import { json } from "@remix-run/node";
import { db } from "../utils/db.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  try {
    const roles = await db.Role.findMany();
    const users = await db.User.findMany();

    return json({ roles, users });
  } catch (error) {
    console.error("Error loading roles and users:", error);
    return json({ error: "Error loading roles and users" }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const userId = parseInt(form.get("userId"), 10);
  const roleIds = form
    .getAll("roleIds[]")
    .map((roleId) => parseInt(roleId, 10));

  try {
    // Iterate over the selected roleIds and associate them with the user
    for (const roleId of roleIds) {
      await createUserRole(userId, roleId);
    }
    return "user profile"; //redirect(/auth/${userId}); // Redirect to the user's profile page
  } catch (error) {
    console.error("Error creating user roles:", error);
    return json({ error: "Error creating user roles" }, { status: 500 });
  }
};

async function createUserRole(userId, roleId) {
  try {
    // Check if the user and role exist
    const user = await db.User.findUnique({
      where: { id: userId },
    });

    const role = await db.Role.findUnique({
      where: { id: roleId },
    });

    if (!user || !role) {
      console.error("User or role not found.");
      return;
    }

    // Create the UserRole entry
    const userRole = await db.UserRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    console.log(`UserRole created with ID: ${userRole.id}`);
  } catch (error) {
    console.error("Error creating UserRole:", error);
  }
}

function UserRoles() {
  const { roles, users } = useLoaderData();

  const buttonStyle = {
    width: "150px",
    color: "red",
  };

  const mainDivStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  };

  return (
    <div style={mainDivStyle}>
      <h1>User Roles</h1>
      <div>
        <form method="POST">
          <div>
            <label>Select User:</label>
            <select name="userId">
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h2>Select Roles:</h2>
            {roles.map((role) => (
              <label key={role.id}>
                <input type="checkbox" name="roleIds[]" value={role.id} />
                {role.roleName}
              </label>
            ))}
          </div>
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserRoles;
