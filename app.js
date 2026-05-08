FHIR.oauth2.ready().then(async function(client) {
  try {
    console.log("client:", client);

    const patientId = client.patient.id;
    console.log("Patient ID:", patientId);

    // THIS uses correct server automatically
    const patient = await client.request(`Patient/${patientId}`);

    console.log("Patient:", patient);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "No name";

    document.getElementById("patient").innerHTML =
      "Patient: " + fullName;

  } catch (error) {
    console.error("ERROR:", error);
    document.getElementById("patient").innerHTML =
      "Error loading patient data";
  }
});