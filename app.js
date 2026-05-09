FHIR.oauth2.ready().then(async function(client) {
  console.log("SMART ready");

  const patientId = client.patient.id;

  // ================= PATIENT =================
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
    document.getElementById("patient").innerHTML =
      "Error loading patient";
  }

  // ================= SAFE HELPER =================
  async function safeRequest(url) {
    try {
      return await client.request(url);
    } catch (e) {
      console.warn("Skipping:", url);
      return null;
    }
  }

  // ================= CONDITIONS =================
  const conditions = await safeRequest(
    `Condition?patient=${patientId}&_count=5`
  );

  if (conditions && conditions.entry) {
    let html = "<h3>Conditions</h3><ul>";
    conditions.entry.forEach(e => {
      html += `<li>${e.resource.code?.text || "Unknown"}</li>`;
    });
    html += "</ul>";
    document.getElementById("conditions").innerHTML = html;
  } else {
    document.getElementById("conditions").innerHTML =
      "<h3>Conditions</h3><p>No access / no data</p>";
  }

  // ================= OBSERVATIONS =================
  const observations = await safeRequest(
    `Observation?patient=${patientId}&_count=5`
  );

  if (observations && observations.entry) {
    let html = "<h3>Observations</h3><ul>";
    observations.entry.forEach(e => {
      const o = e.resource;
      html += `<li>${o.code?.text || "Unknown"}: ${
        o.valueQuantity?.value || "N/A"
      }</li>`;
    });
    html += "</ul>";
    document.getElementById("observations").innerHTML = html;
  } else {
    document.getElementById("observations").innerHTML =
      "<h3>Observations</h3><p>No access / no data</p>";
  }

  // ================= MEDICATIONS =================
  const meds = await safeRequest(
    `MedicationRequest?patient=${patientId}&_count=5`
  );

  if (meds && meds.entry) {
    let html = "<h3>Medications</h3><ul>";
    meds.entry.forEach(e => {
      html += `<li>${
        e.resource.medicationCodeableConcept?.text || "Unknown"
      }</li>`;
    });
    html += "</ul>";
    document.getElementById("medications").innerHTML = html;
  } else {
    document.getElementById("medications").innerHTML =
      "<h3>Medications</h3><p>No access / no data</p>";
  }
});