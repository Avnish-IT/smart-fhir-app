FHIR.oauth2.ready().then(async function(client) {
  console.log("SMART ready");

  const patientId = client.patient.id;

  // -------- PATIENT --------
  try {
    const patient = await client.request(`Patient/${patientId}`);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "Unknown";

    document.getElementById("patient").innerHTML =
      "Patient: " + fullName;
  } catch (e) {
    console.error("Patient error:", e);
  }

  // Safe API wrapper
  async function safeRequest(url) {
    try {
      return await client.request(url);
    } catch (e) {
      console.warn("Skipping:", url);
      return null;
    }
  }

  // -------- CONDITIONS --------
  const conditions = await safeRequest(`Condition?patient=${patientId}&_count=5`);
  if (conditions?.entry) {
    document.getElementById("conditions").innerHTML =
      "<h3>Conditions</h3><ul>" +
      conditions.entry.map(e => `<li>${e.resource.code?.text || "Unknown"}</li>`).join("") +
      "</ul>";
  }

  // -------- OBSERVATIONS --------
  const observations = await safeRequest(`Observation?patient=${patientId}&_count=5`);
  if (observations?.entry) {
    document.getElementById("observations").innerHTML =
      "<h3>Observations</h3><ul>" +
      observations.entry.map(e => {
        const o = e.resource;
        return `<li>${o.code?.text || "Unknown"}: ${o.valueQuantity?.value || "N/A"}</li>`;
      }).join("") +
      "</ul>";
  }

  // -------- MEDICATIONS --------
  const meds = await safeRequest(`MedicationRequest?patient=${patientId}&_count=5`);
  if (meds?.entry) {
    document.getElementById("medications").innerHTML =
      "<h3>Medications</h3><ul>" +
      meds.entry.map(e => `<li>${e.resource.medicationCodeableConcept?.text || "Unknown"}</li>`).join("") +
      "</ul>";
  }
});