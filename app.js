FHIR.oauth2.ready().then(async function(client) {
  try {
    console.log("Client:", client);

    // Get patient ID from context
    const patientId = client.patient.id;

    if (!patientId) {
      throw new Error("No patient in context");
    }

    console.log("Patient ID:", patientId);

    // Fetch patient resource
    const patient = await client.request(`Patient/${patientId}`);

    console.log("Patient Data:", patient);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "No name available";

    document.getElementById("patient").innerHTML =
      "Patient: " + fullName;

  } catch (error) {
    console.error("ERROR:", error);
    document.getElementById("patient").innerHTML =
      "Error loading patient data";
  }
});