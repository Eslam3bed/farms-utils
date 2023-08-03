// Function to check if fan details exist in localStorage
function updateFansDetailsForm(details) {
  if (!details) return;
  const { numFans, fanSize, numSetups, fanCost } = details;
  document.getElementById("numFans").value = numFans;
  document.getElementById("fanSize").value = fanSize;
  document.getElementById("numSetups").value = numSetups;
  document.getElementById("fanCost").value = fanCost;
}

// Function to get fan details from the fan details form
function getFanDetailsFromForm() {
  const numFans = parseInt(document.getElementById("numFans").value);
  const fanSize = parseInt(document.getElementById("fanSize").value);
  const numSetups = parseInt(document.getElementById("numSetups").value);
  const fanCost = parseFloat(document.getElementById("fanCost").value);

  return { numFans, fanSize, numSetups, fanCost };
}

// Function to save fan details to localStorage
function saveFanDetailsToLocalStorage(fanDetails) {
  localStorage.setItem("fanDetails", JSON.stringify(fanDetails));
}

// Function to load fan details from localStorage
function loadFanDetailsFromLocalStorage() {
  const fanDetails = localStorage.getItem("fanDetails");
  if (fanDetails) {
    updateFansDetailsForm(JSON.parse(fanDetails));
  }
}

// Function to handle form submission for fan details
function handleFanDetailsFormSubmit(event) {
  event.preventDefault();

  // Retrieve form values
  const numFans = parseInt(document.getElementById("numFans").value);
  const fanSize = parseInt(document.getElementById("fanSize").value);
  const numSetups = parseInt(document.getElementById("numSetups").value);
  const fanCost = parseFloat(document.getElementById("fanCost").value);

  // Store fan details in localStorage
  const fanDetails = { numFans, fanSize, numSetups, fanCost };
  saveFanDetailsToLocalStorage(fanDetails);

  // Move to the next step (designing the form for chicken details)
  document.getElementById("fanDetailsForm").classList.add("hidden");
  document.getElementById("chickenDetailsForm").classList.remove("hidden");
}

// Load fan details from localStorage when the page loads
loadFanDetailsFromLocalStorage();

// Function to handle form submission for chicken details
async function handleChickenDetailsFormSubmit(event) {
  event.preventDefault();

  // Retrieve form values
  const numChickens = parseInt(document.getElementById("numChickens").value);
  const chickenSize = parseFloat(document.getElementById("chickenSize").value);

  // Get the external temperature using the WeatherAPI
  const externalTemperature = await getExternalTemperature();

  // Calculate chicken consumption
  const chickenConsumption = calculateChickenConsumption(
    numChickens,
    chickenSize,
    externalTemperature
  );

  // Calculate best fan setup
  const fanDetails = getFanDetailsFromForm();
  // Function to calculate chicken consumption based on number of chickens, chicken size, and external temperature);
  const bestFanSetup = calculateBestFanSetup(fanDetails,chickenConsumption)

  // Display the results
  displayResults(
    chickenConsumption,
    bestFanSetup.totalFanConsumption,
    bestFanSetup
  );

  // Move to the next step (showing the results)
  document.getElementById("chickenDetailsForm").classList.add("hidden");
  document.getElementById("resultsSection").classList.remove("hidden");
}



// Function to calculate fan consumption based on fan details and chicken consumption
function calculateFanConsumption(fanDetails, chickenConsumption) {
  // Your calculation logic here (you can define a suitable formula based on your requirements)
  // For this example, let's assume a simple calculation:
  // Fan consumption (Watts per hour) = (number of fans * fan size * number of setups) + (fan cost * chicken consumption)
  const fanConsumption =
    fanDetails.numFans * fanDetails.fanSize * fanDetails.numSetups +
    fanDetails.fanCost * chickenConsumption;
  return fanConsumption;
}

// Function to display the results and best fan setup on the webpage
function displayResults(chickenConsumption, fanConsumption, bestFanSetup) {
  const resultContainer = document.createElement("div");
  resultContainer.className = "bg-white p-4 shadow-md rounded-md mt-4";

  const resultHeader = document.createElement("h2");
  resultHeader.className = "text-lg font-bold mb-4";
  resultHeader.textContent = "Results";
  resultContainer.appendChild(resultHeader);

  const chickenConsumptionParagraph = document.createElement("p");
  chickenConsumptionParagraph.textContent = `Chicken Consumption (kg/hr): ${chickenConsumption.toFixed(
    2
  )}`;
  resultContainer.appendChild(chickenConsumptionParagraph);

  const fanConsumptionParagraph = document.createElement("p");
  fanConsumptionParagraph.textContent = `Fan Consumption (Watts/hr): ${fanConsumption.toFixed(
    2
  )}`;
  resultContainer.appendChild(fanConsumptionParagraph);

  const bestFanSetupHeader = document.createElement("h2");
  bestFanSetupHeader.className = "text-lg font-bold mt-4";
  bestFanSetupHeader.textContent = "Best Fan Setup Option";
  resultContainer.appendChild(bestFanSetupHeader);

  const bestFanSetupDetails = document.createElement("div");
  bestFanSetupDetails.innerHTML = `
    <p><strong>Number of Fans:</strong> ${bestFanSetup.numFans}</p>
    <p><strong>Fan Size (m3/hr):</strong> ${bestFanSetup.fanSize}</p>
  `;
  resultContainer.appendChild(bestFanSetupDetails);

  // Show the results in a container with a border and some padding
  const resultWrapper = document.createElement("div");
  resultWrapper.className = "border border-gray-300 rounded-md p-4";
  resultWrapper.appendChild(resultContainer);

  // Remove any previous results before displaying the new ones
  const previousResult = document.querySelector(".result-wrapper");
  if (previousResult) {
    previousResult.remove();
  }

  // Add the new results to the page
  const formContainer = document.querySelector(".container");
  formContainer.appendChild(resultWrapper);
}

// Move to the next step when the fan details form is submitted
const fanDetailsForm = document.getElementById("fanDetailsForm");
fanDetailsForm.addEventListener("submit", handleFanDetailsFormSubmit);

// Attach form submission event listener for fan details form
const chickenDetailsForm = document.getElementById("chickenDetailsForm");
chickenDetailsForm.addEventListener("submit", handleChickenDetailsFormSubmit);

// Function to calculate the best fan setup based on fan details and chicken consumption
function calculateBestFanSetup(fanDetails, chickenConsumption) {
  console.log({chickenConsumption})
  const totalFanConsumption =
    fanDetails.numFans *
    fanDetails.fanSize *
    fanDetails.numSetups *
    fanDetails.fanCost;

  return {
    numFans: fanDetails.numFans,
    fanSize: fanDetails.fanSize,
    totalFanConsumption,
  };
}

// ... (rest of the code remains unchanged)

// Function to reset the form fields to their initial values
function resetForm() {
  document.getElementById("numChickens").value = "";
  document.getElementById("chickenSize").value = "";
  document.getElementById("numFans").value = "";
  document.getElementById("fanSize").value = "";
  document.getElementById("numSetups").value = "";
  document.getElementById("fanCost").value = "";
}

// Function to handle form reset
function handleFormReset() {
  document.getElementById("resultsSection").classList.add("hidden");
  document.getElementById("chickenDetailsForm").classList.remove("hidden");
  resetForm();
}

// Attach event listener for form reset button
const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", handleFormReset);

// ... (rest of the code remains unchanged)

// update the tempreture every 5 seconds element id temperature
function updateTemperature() {
  getExternalTemperature()
    .then((externalTemperature) => {
      document.getElementById(
        "temperature"
      ).textContent = `${externalTemperature}°C`;
    })
    .catch((error) => {
      console.error("Error fetching external temperature:", error);
    });
}
updateTemperature();
// @note: turn this on to update the tempreture every 1 minute
// setInterval(() => {
//   updateTemperature();
// }, 60000);
