FHIR.oauth2.ready().then(async (client) => {
  try {

    // Get patient
    const patient = await client.patient.read();

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "No name available";

    document.getElementById("patient").innerHTML =
      "Patient: " + fullName;

    // OPTIONAL: get observations (labs)
    const observations = await client.request(
      `Observation?patient=${client.patient.id}&_count=5`
    );

    console.log("Observations:", observations);

  } catch (error) {
    console.error(error);
    document.getElementById("patient").innerHTML =
      "Error loading patient data";
  }
});