FHIR.oauth2.ready().then(async function(client) {
  try {
    console.log("SMART ready");

    const patientId = client.patient.id;

    const patient = await client.request(`Patient/${patientId}`);

    console.log("Patient FULL JSON:", patient);

    // -------- NAME --------
    const nameObj = patient.name?.[0];
    const fullName = nameObj
      ? `${nameObj.given?.join(" ") || ""} ${nameObj.family || ""}`
      : "Unknown";

    // -------- GENDER --------
    const gender = patient.gender || "Unknown";

    // -------- DOB --------
    const dob = patient.birthDate || "Unknown";

    // -------- AGE (safe calculation) --------
    let age = "Unknown";
    if (patient.birthDate) {
      const birthDate = new Date(patient.birthDate);
      const today = new Date();

      let years = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        years--;
      }

      age = years;
    }

    // -------- IDENTIFIER --------
    const identifier =
      patient.identifier?.[0]?.value || patientId;

    // -------- DISPLAY TABLE --------
    document.getElementById("patient").innerHTML = `
      <h2>Patient Information</h2>

      <table>
        <tr>
          <th>Name</th>
          <th>Gender</th>
          <th>Date of Birth</th>
          <th>Age</th>
          <th>ID</th>
        </tr>

        <tr>
          <td>${fullName}</td>
          <td>${gender}</td>
          <td>${dob}</td>
          <td>${age}</td>
          <td>${identifier}</td>
        </tr>
      </table>
    `;

  } catch (error) {
    console.error("ERROR:", error);

    document.getElementById("patient").innerHTML =
      "<h2>Error loading patient data</h2>";
  }
});