import { json, redirect } from "@remix-run/node";
import { db } from "../utils/db.server";
import { useLoaderData, Form } from "@remix-run/react";
import { useState } from "react";

export const loader = async ({ request }) => {
  try {
    const roles = await db.Role.findMany();
    const featurePermissions = await db.FeaturePermission.findMany();
    return json({ roles, featurePermissions });
  } catch (error) {
    console.error("Error loading data:", error);
    return json({ error: "Error loading data" }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    const formData = new URLSearchParams(await request.text());
    const roleId = formData.get("roleId");
    const featurePermissionId = formData.get("featurePermissionId");
    const permissionValue = formData.get("permissionValue");

    if (!roleId || !featurePermissionId || permissionValue === null) {
      return json({ error: "Invalid form data" }, { status: 400 });
    }

    // Convert roleId and featurePermissionId to integers
    const roleIdInt = parseInt(roleId, 10);
    const featurePermissionIdInt = parseInt(featurePermissionId, 10);

    if (isNaN(roleIdInt) || isNaN(featurePermissionIdInt)) {
      return json(
        { error: "Invalid roleId or featurePermissionId" },
        { status: 400 }
      );
    }

    // Create an association between the role and feature permission
    const association = await db.RoleFeaturePermission.create({
      data: {
        roleId: roleIdInt,
        featurePermissionId: featurePermissionIdInt,
        permission: permissionValue === "true",
      },
    });

    return "rolePermissions";
  } catch (error) {
    console.error("Error assigning role:", error);
    return json({ error: "Error assigning role" }, { status: 400 });
  }
};

export default function RolePermissionAssociation({ data }) {
  const { roles, featurePermissions } = useLoaderData();
  const [permissionValue, setPermissionValue] = useState("true"); // Initialize with "true"

  const handlePermissionChange = (e) => {
    setPermissionValue(e.target.value); // Update the permissionValue state
  };

  return (
    <div>
      <h1>Role and Permission Association</h1>
      <Form method="POST">
        <div>
          <label>Select Role:</label>
          <select name="roleId">
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Feature Permission:</label>
          <select name="featurePermissionId">
            <option value="">Select Feature Permission</option>
            {featurePermissions.map((permission) => (
              <option key={permission.id} value={permission.id}>
                {permission.permission}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Permission Value:</label>
          {/* Use radio buttons to select either true or false */}
          <label>
            <input
              type="radio"
              name="permissionValue"
              value="true"
              checked={permissionValue === "true"}
              onChange={handlePermissionChange}
            />{" "}
            True
          </label>
          <label>
            <input
              type="radio"
              name="permissionValue"
              value="false"
              checked={permissionValue === "false"}
              onChange={handlePermissionChange}
            />{" "}
            False
          </label>
        </div>
        <button type="submit" style={{ width: "100px", background: "cyan" }}>
          Assign Role
        </button>
      </Form>
    </div>
  );
}
