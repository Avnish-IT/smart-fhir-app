FHIR.oauth2.ready().then(async function(client) {
  try {
    console.log("SMART ready");

    const patientId = client.patient.id;
    console.log("Patient ID:", patientId);

    // ================= PATIENT INFO =================
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

    // ================= CONDITIONS =================
    const conditions = await client.request(
      `Condition?patient=${patientId}&_count=5`
    );

    let condHTML = "<h3>Conditions</h3>";

    if (!conditions.entry) {
      condHTML += "<p>No conditions found</p>";
    } else {
      condHTML += "<table><tr><th>Condition</th></tr>";
      conditions.entry.forEach(e => {
        const c = e.resource.code?.text || "Unknown";
        condHTML += `<tr><td>${c}</td></tr>`;
      });
      condHTML += "</table>";
    }

    document.getElementById("conditions").innerHTML = condHTML;

    // ================= OBSERVATIONS =================
    const observations = await client.request(
      `Observation?patient=${patientId}&_count=5`
    );

    let obsHTML = "<h3>Observations</h3>";

    if (!observations.entry) {
      obsHTML += "<p>No observations found</p>";
    } else {
      obsHTML += "<table><tr><th>Type</th><th>Value</th></tr>";
      observations.entry.forEach(e => {
        const o = e.resource;
        const type = o.code?.text || "Unknown";
        const value = o.valueQuantity?.value || "N/A";

        obsHTML += `<tr><td>${type}</td><td>${value}</td></tr>`;
      });
      obsHTML += "</table>";
    }

    document.getElementById("observations").innerHTML = obsHTML;

    // ================= MEDICATIONS =================
    const meds = await client.request(
      `MedicationRequest?patient=${patientId}&_count=5`
    );

    let medHTML = "<h3>Medications</h3>";

    if (!meds.entry) {
      medHTML += "<p>No medications found</p>";
    } else {
      medHTML += "<table><tr><th>Medication</th></tr>";
      meds.entry.forEach(e => {
        const m =
          e.resource.medicationCodeableConcept?.text || "Unknown";
        medHTML += `<tr><td>${m}</td></tr>`;
      });
      medHTML += "</table>";
    }

    document.getElementById("medications").innerHTML = medHTML;

  } catch (error) {
    console.error("ERROR:", error);
    document.body.innerHTML = "<h2>Error loading dashboard</h2>";
  }
});