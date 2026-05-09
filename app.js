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

    document.getElementById("patient").innerHTML = `
      <h2>${fullName}</h2>
      <p><b>ID:</b> ${patientId}</p>
      <p><b>Gender:</b> ${patient.gender || "N/A"}</p>
      <p><b>DOB:</b> ${patient.birthDate || "N/A"}</p>
    `;
  } catch (e) {
    console.error("Patient error:", e);
    document.getElementById("patient").innerHTML = "<p>Error loading patient</p>";
  }

  // ================= CONDITIONS =================
  try {
    const conditions = await client.request(
      `Condition?patient=${patientId}&_count=5`
    );

    let html = "<h3>Conditions</h3>";

    if (!conditions.entry) {
      html += "<p>No conditions found</p>";
    } else {
      html += "<ul>";
      conditions.entry.forEach(e => {
        html += `<li>${e.resource.code?.text || "Unknown"}</li>`;
      });
      html += "</ul>";
    }

    document.getElementById("conditions").innerHTML = html;
  } catch (e) {
    console.error("Conditions error:", e);
    document.getElementById("conditions").innerHTML =
      "<h3>Conditions</h3><p>Error loading</p>";
  }

  // ================= OBSERVATIONS =================
  try {
    const observations = await client.request(
      `Observation?patient=${patientId}&_count=5`
    );

    let html = "<h3>Observations</h3>";

    if (!observations.entry) {
      html += "<p>No observations found</p>";
    } else {
      html += "<ul>";
      observations.entry.forEach(e => {
        const o = e.resource;
        html += `<li>${o.code?.text || "Unknown"}: ${
          o.valueQuantity?.value || "N/A"
        }</li>`;
      });
      html += "</ul>";
    }

    document.getElementById("observations").innerHTML = html;
  } catch (e) {
    console.error("Observations error:", e);
    document.getElementById("observations").innerHTML =
      "<h3>Observations</h3><p>Error loading</p>";
  }

  // ================= MEDICATIONS =================
  try {
    const meds = await client.request(
      `MedicationRequest?patient=${patientId}&_count=5`
    );

    let html = "<h3>Medications</h3>";

    if (!meds.entry) {
      html += "<p>No medications found</p>";
    } else {
      html += "<ul>";
      meds.entry.forEach(e => {
        html += `<li>${
          e.resource.medicationCodeableConcept?.text || "Unknown"
        }</li>`;
      });
      html += "</ul>";
    }

    document.getElementById("medications").innerHTML = html;
  } catch (e) {
    console.error("Medications error:", e);
    document.getElementById("medications").innerHTML =
      "<h3>Medications</h3><p>Error loading</p>";
  }
});