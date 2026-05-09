FHIR.oauth2.ready().then(async function(client) {
  try {
    const patientId = client.patient.id;

    // -------- BASIC INFO --------
    const patient = await client.request(`Patient/${patientId}`);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "Unknown";

    document.getElementById("basic").innerHTML = `
      <h2>${fullName}</h2>
      <p><b>ID:</b> ${patientId}</p>
      <p><b>Gender:</b> ${patient.gender || "N/A"}</p>
      <p><b>DOB:</b> ${patient.birthDate || "N/A"}</p>
    `;

    // -------- CONDITIONS --------
    const conditions = await client.request(
      `Condition?patient=${patientId}&_count=10`
    );

    let condTable = "<h3>Conditions</h3><table><tr><th>Condition</th></tr>";

    if (!conditions.entry) {
      condTable += "<tr><td>No conditions found</td></tr>";
    } else {
      conditions.entry.forEach(e => {
        const c = e.resource.code?.text || "Unknown";
        condTable += `<tr><td>${c}</td></tr>`;
      });
    }

    condTable += "</table>";
    document.getElementById("conditions").innerHTML = condTable;

    // -------- OBSERVATIONS --------
    const observations = await client.request(
      `Observation?patient=${patientId}&_count=10`
    );

    let obsTable = "<h3>Observations</h3><table><tr><th>Type</th><th>Value</th></tr>";

    if (!observations.entry) {
      obsTable += "<tr><td colspan='2'>No observations found</td></tr>";
    } else {
      observations.entry.forEach(e => {
        const o = e.resource;
        const type = o.code?.text || "Unknown";
        const value = o.valueQuantity?.value || "N/A";

        obsTable += `<tr><td>${type}</td><td>${value}</td></tr>`;
      });
    }

    obsTable += "</table>";
    document.getElementById("observations").innerHTML = obsTable;

    // -------- MEDICATIONS --------
    const meds = await client.request(
      `MedicationRequest?patient=${patientId}&_count=10`
    );

    let medTable = "<h3>Medications</h3><table><tr><th>Medication</th></tr>";

    if (!meds.entry) {
      medTable += "<tr><td>No medications found</td></tr>";
    } else {
      meds.entry.forEach(e => {
        const m = e.resource.medicationCodeableConcept?.text || "Unknown";
        medTable += `<tr><td>${m}</td></tr>`;
      });
    }

    medTable += "</table>";
    document.getElementById("medications").innerHTML = medTable;

  } catch (error) {
    console.error("ERROR:", error);
    document.body.innerHTML = "<h2>Error loading dashboard</h2>";
  }
});