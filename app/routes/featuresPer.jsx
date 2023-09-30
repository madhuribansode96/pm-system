import { db } from "../utils/db.server";
import { useLoaderData } from "@remix-run/react";

export let loader = async ({ request }) => {
  try {
    // Fetch data from the database using Prisma
    const features = await db.Feature.findMany();
    const featuresper = await db.FeaturePermission.findMany();
    const role = await db.Role.findMany();

    return {
      features,
      featuresper,
      role,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data from the backend");
  }
};

export const action = async ({ request }) => {
  const form = await request.formData();
  const featureId = parseInt(form.get("featureId"));
  const permission = form.get("permission");

  try {
    // Use the Prisma object to create a new entry in the database
    const featurePermission = await db.FeaturePermission.create({
      data: {
        featureId,
        permission,
      },
    });
    console.log("Data inserted successfully:", featurePermission);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
  return "features permissions"; //redirect("/features_permissions");
};

export default function FeaturesPermissions() {
  const { features, featuresper, role } = useLoaderData();

  const formStyle = {
    marginBottom: "20px",
  };

  const selectStyle = {
    marginRight: "10px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    backgroundColor: "#0077cc",
    color: "white",
    padding: "10px",
    textAlign: "left",
  };

  const tdStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "left",
  };

  return (
    <div>
      <h1>Permission Page</h1>
      <form method="POST" style={formStyle}>
        <div className="fet-1">
          <label htmlFor="featureDropdown">Feature: </label>
          <select id="featureDropdown" name="featureId" style={selectStyle}>
            <option value="">Select Feature</option>
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.featureName}
              </option>
            ))}
          </select>
          <label htmlFor="permissionDropdown">Permission: </label>
          <select id="permissionDropdown" name="permission" style={selectStyle}>
            <option value="">Select Permission</option>
            <option value="Create">Create</option>
            <option value="Read">Read</option>
            <option value="Delete">Delete</option>
            <option value="Update">Update</option>
            <option value="Execute">Execute</option>
          </select>
          <button type="submit">Submit</button>
        </div>
      </form>

      <div>
        <select id="roleDropdown" name="roleId">
          <option value="">Select Roles</option>
          {role.map((roles) => (
            <option key={roles.id} value={roles.id}>
              {roles.roleName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Feature</th>
              <th style={thStyle}>Permission</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>
                {features.map((feature) => (
                  <option key={feature.id} value={feature.id}>
                    {feature.featureName}
                  </option>
                ))}
              </td>
              <td style={tdStyle}>
                {featuresper.map((feature) => (
                  <option key={feature.id} value={feature.id}>
                    {feature.permission}
                  </option>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
