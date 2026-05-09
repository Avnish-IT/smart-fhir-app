FHIR.oauth2.ready().then(async function(client) {
  console.log("SMART ready");

  const patientId = client.patient.id;

  // ================= PATIENT TABLE =================
  try {
    const patient = await client.request(`Patient/${patientId}`);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "Unknown";

    const gender = patient.gender || "N/A";
    const dob = patient.birthDate || "N/A";

    // Calculate age
    let age = "N/A";
    if (dob !== "N/A") {
      const birth = new Date(dob);
      const today = new Date();
      age = today.getFullYear() - birth.getFullYear();
    }

    document.getElementById("patient").innerHTML = `
      <h2>Patient Information</h2>
      <table>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>DOB</th>
          <th>Age</th>
        </tr>
        <tr>
          <td>${fullName}</td>
          <td>${gender}</td>
          <td>${dob}</td>
          <td>${age}</td>
        </tr>
      </table>
    `;
  } catch (e) {
    console.error("Patient error:", e);
    document.getElementById("patient").innerHTML =
      "<p>Error loading patient</p>";
  }

  // ================= SAFE REQUEST FUNCTION =================
  async function safeRequest(url) {
    try {
      return await client.request(url);
    } catch (e) {
      console.warn("Skipping:", url);
      return null;
    }
  }

  // ================= CONDITIONS TABLE =================
  const conditions = await safeRequest(
    `Condition?patient=${patientId}&_count=5`
  );

  if (conditions && conditions.entry) {
    let html = `
      <h3>Conditions</h3>
      <table>
        <tr><th>Condition</th></tr>
    `;

    conditions.entry.forEach(e => {
      const c = e.resource.code?.text || "Unknown";
      html += `<tr><td>${c}</td></tr>`;
    });

    html += "</table>";
    document.getElementById("conditions").innerHTML = html;
  } else {
    document.getElementById("conditions").innerHTML =
      "<h3>Conditions</h3><p>No data available</p>";
  }

  // ================= OBSERVATIONS TABLE =================
  const observations = await safeRequest(
    `Observation?patient=${patientId}&_count=5`
  );

  if (observations && observations.entry) {
    let html = `
      <h3>Observations</h3>
      <table>
        <tr>
          <th>Type</th>
          <th>Value</th>
        </tr>
    `;

    observations.entry.forEach(e => {
      const o = e.resource;
      const type = o.code?.text || "Unknown";
      const value = o.valueQuantity?.value || "N/A";

      html += `<tr><td>${type}</td><td>${value}</td></tr>`;
    });

    html += "</table>";
    document.getElementById("observations").innerHTML = html;
  } else {
    document.getElementById("observations").innerHTML =
      "<h3>Observations</h3><p>No data available</p>";
  }

  // ================= MEDICATIONS TABLE =================
  const meds = await safeRequest(
    `MedicationRequest?patient=${patientId}&_count=5`
  );

  if (meds && meds.entry) {
    let html = `
      <h3>Medications</h3>
      <table>
        <tr><th>Medication</th></tr>
    `;

    meds.entry.forEach(e => {
      const m =
        e.resource.medicationCodeableConcept?.text || "Unknown";
      html += `<tr><td>${m}</td></tr>`;
    });

    html += "</table>";
    document.getElementById("medications").innerHTML = html;
  } else {
    document.getElementById("medications").innerHTML =
      "<h3>Medications</h3><p>No data available</p>";
  }
});