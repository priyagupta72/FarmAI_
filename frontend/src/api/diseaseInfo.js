// export const fetchDiseaseInfoFromAPI = async (disease) => {
//     try {
//       const response = await fetch("http://localhost:5000/get-disease-info", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ disease }),
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(`Server error: ${response.status} - ${errorData.error || "Unknown error"} ${errorData.details || ""}`);
//       }
  
//       return await response.json();
//     } catch (error) {
//       console.error("Fetch error details:", error);
//       throw new Error(`not onnect to backend: ${error.message}`);
//     }
//   };








export const fetchDiseaseInfoFromAPI = async (disease) => {
  try {
    const response = await fetch(
      "https://farmai-h4bm.onrender.com/get-disease-info",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Server error: ${response.status} - ${errorData.error || "Unknown error"} ${errorData.details || ""}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error details:", error);
    throw new Error(`Cannot connect to backend: ${error.message}`);
  }
};
