FHIR.oauth2.ready().then(async function(client) {
  try {
    const patientId = client.patient.id;

    // ---------------- BASIC INFO ----------------
    const patient = await client.request(`Patient/${patientId}`);

    const name = patient.name?.[0];
    const fullName = name
      ? name.given.join(" ") + " " + name.family
      : "Unknown";

    const gender = patient.gender || "N/A";
    const birthDate = patient.birthDate || "N/A";

    document.getElementById("basic").innerHTML = `
      <h2>${fullName}</h2>
      <p><b>Gender:</b> ${gender}</p>
      <p><b>DOB:</b> ${birthDate}</p>
    `;

    // ---------------- CONDITIONS ----------------
    const conditions = await client.request(
      `Condition?patient=${patientId}&_count=10`
    );

    let condTable = "<h3>Conditions</h3><table><tr><th>Condition</th></tr>";

    conditions.entry?.forEach(e => {
      const c = e.resource.code?.text || "Unknown";
      condTable += `<tr><td>${c}</td></tr>`;
    });

    condTable += "</table>";
    document.getElementById("conditions").innerHTML = condTable;

    // ---------------- OBSERVATIONS ----------------
    const observations = await client.request(
      `Observation?patient=${patientId}&_count=10`
    );

    let obsTable = "<h3>Observations</h3><table><tr><th>Type</th><th>Value</th></tr>";

    observations.entry?.forEach(e => {
      const o = e.resource;
      const type = o.code?.text || "Unknown";
      const value = o.valueQuantity?.value || "N/A";

      obsTable += `<tr><td>${type}</td><td>${value}</td></tr>`;
    });

    obsTable += "</table>";
    document.getElementById("observations").innerHTML = obsTable;

    // ---------------- MEDICATIONS ----------------
    const meds = await client.request(
      `MedicationRequest?patient=${patientId}&_count=10`
    );

    let medTable = "<h3>Medications</h3><table><tr><th>Medication</th></tr>";

    meds.entry?.forEach(e => {
      const m = e.resource.medicationCodeableConcept?.text || "Unknown";
      medTable += `<tr><td>${m}</td></tr>`;
    });

    medTable += "</table>";
    document.getElementById("medications").innerHTML = medTable;

  } catch (error) {
    console.error(error);
    document.body.innerHTML = "<h2>Error loading dashboard</h2>";
  }
});