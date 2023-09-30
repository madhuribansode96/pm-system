import { json } from "@remix-run/node";
import { db } from "../utils/db.server";

export const loader = async ({ request }) => {
  try {
    // Load data or perform any necessary logic
    const data = { message: "Data loaded for /features" };
    return json(data);
  } catch (error) {
    console.error("Error loading data:", error);
    return json({ error: "Error loading data" }, { status: 500 });
  }
};

export const action = async ({ request }) => {
  try {
    const formData = new URLSearchParams(await request.text());
    const featureName = formData.get("featureName");
    const groupName = formData.get("groupName");
    console.log("Received form data:", formData);

    // Create a new feature in the database
    const createdFeature = await db.Feature.create({
      data: {
        featureName,
        groupName,
      },
    });

    // Return the created feature as JSON data
    return json({ success: true, createdFeature });
  } catch (error) {
    console.error("Error creating feature:", error);
    // Handle errors or validation failures and return an error response
    return json({ error: "Error creating feature" }, { status: 400 });
  }
};

export default function Features({ data }) {
  // Define your component logic here
  // You can create a form for creating features and display a success message

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const inputStyle = {
    marginBottom: "10px",
    padding: "5px",
  };

  const buttonStyle = {
    backgroundColor: "#0077cc",
    color: "white",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  };

  const successMessageStyle = {
    color: "green",
    marginTop: "10px",
  };

  const errorMessageStyle = {
    color: "red",
    marginTop: "10px",
  };

  const centerH1Style = {
    textAlign: "center",
  };

  return (
    <div>
      <h1 style={centerH1Style}>Feature Management</h1>
      <form method="POST" style={formStyle}>
        <div>
          <label>Feature Name:</label>
          <input type="text" name="featureName" style={inputStyle} />
        </div>
        <div>
          <label>Group Name:</label>
          <input type="text" name="groupName" style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>
          Create Feature
        </button>
      </form>
      {/* Display success or error message based on data */}
      {data && data.success && (
        <div style={successMessageStyle}>
          Feature created successfully! ID: {data.createdFeature.id}
        </div>
      )}
      {data && data.error && (
        <div style={errorMessageStyle}>
          Error creating feature. Please try again.
        </div>
      )}
    </div>
  );
}
