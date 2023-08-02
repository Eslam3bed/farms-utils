// Function to check if fan details exist in localStorage
function checkFanDetailsInLocalStorage() {
  const fanDetails = localStorage.getItem('fanDetails');
  if (fanDetails) {
    const useExistingDetails = confirm('Do you want to use the existing fan details?');
    if (useExistingDetails) {
      const { numFans, fanSize, numSetups, fanCost } = JSON.parse(fanDetails) || {}
      document.getElementById('numFans').value = numFans;
      document.getElementById('fanSize').value = fanSize;
      document.getElementById('numSetups').value = numSetups;
      document.getElementById('fanCost').value = fanCost;
    } else {
      localStorage.removeItem('fanDetails');
    }
  }
}

// Function to save fan details to localStorage
function saveFanDetailsToLocalStorage(fanDetails) {
  localStorage.setItem('fanDetails', JSON.stringify(fanDetails));
}

// Function to load fan details from localStorage
function loadFanDetailsFromLocalStorage() {
  const fanDetails = localStorage.getItem('fanDetails');
  if (fanDetails) {
    const { numFans, fanSize, numSetups, fanCost } = JSON.parse(fanDetails);
    document.getElementById('numFans').value = numFans;
    document.getElementById('fanSize').value = fanSize;
    document.getElementById('numSetups').value = numSetups;
    document.getElementById('fanCost').value = fanCost;
  }
}

// Function to handle form submission for fan details
function handleFanDetailsFormSubmit(event) {
  event.preventDefault();

  // Retrieve form values
  const numFans = parseInt(document.getElementById('numFans').value);
  const fanSize = parseInt(document.getElementById('fanSize').value);
  const numSetups = parseInt(document.getElementById('numSetups').value);
  const fanCost = parseFloat(document.getElementById('fanCost').value);

  // Store fan details in localStorage
  const fanDetails = { numFans, fanSize, numSetups, fanCost };
  saveFanDetailsToLocalStorage(fanDetails);

  // Move to the next step (designing the form for chicken details)
  document.getElementById('fanDetailsForm').classList.add('hidden');
  document.getElementById('chickenDetailsForm').classList.remove('hidden');
}

// Load fan details from localStorage when the page loads
loadFanDetailsFromLocalStorage();

// ... (rest of the code remains unchanged)

// Check for fan details in localStorage when the page loads
document.addEventListener('DOMContentLoaded', checkFanDetailsInLocalStorage);


const apiKey = 'a6b634036064472eae7203400230208';
// Function to get the external temperature using the OpenWeatherMap API
// Function to get the external temperature using the WeatherAPI
async function getExternalTemperature() {
  try {
    // Replace 'YOUR_API_KEY' with your actual WeatherAPI key
    // Replace 'LATITUDE' and 'LONGITUDE' with the actual GPS coordinates (latitude and longitude) of your location
    const latitude = 'LATITUDE';
    const longitude = 'LONGITUDE';
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=London&aqi=ye`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    const externalTemperature = data.current.temp_c;
    return externalTemperature;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}
// Function to get fan details from the fan details form
function getFanDetailsFromForm() {
  const numFans = parseInt(document.getElementById('numFans').value);
  const fanSize = parseInt(document.getElementById('fanSize').value);
  const numSetups = parseInt(document.getElementById('numSetups').value);
  const fanCost = parseFloat(document.getElementById('fanCost').value);

  return { numFans, fanSize, numSetups, fanCost };
}

// Function to handle form submission for chicken details
function handleChickenDetailsFormSubmit(event) {
  event.preventDefault();

  // Retrieve form values
  const numChickens = parseInt(document.getElementById('numChickens').value);
  const chickenSize = parseFloat(document.getElementById('chickenSize').value);

  // Get the external temperature using the WeatherAPI
  getExternalTemperature()
    .then((externalTemperature) => {
      // Calculate chicken consumption
      const chickenConsumption = calculateChickenConsumption(numChickens, chickenSize, externalTemperature);

      // Calculate best fan setup
      const fanDetails = getFanDetailsFromForm();
      const bestFanSetup = calculateBestFanSetup(fanDetails, chickenConsumption);

      // Display the results
      displayResults(chickenConsumption, bestFanSetup.totalFanConsumption, bestFanSetup);

      // Move to the next step (showing the results)
      document.getElementById('chickenDetailsForm').classList.add('hidden');
      document.getElementById('resultsSection').classList.remove('hidden');
    })
    .catch((error) => {
      console.error('Error fetching external temperature:', error);
    });
}

// ... (rest of the code remains unchanged)


// Function to calculate chicken consumption based on number of chickens, chicken size, and external temperature
function calculateChickenConsumption(numChickens, chickenSize, externalTemperature) {
  // Assuming that chickens consume 0.1 kg/hr per chicken for every 10 degrees above 20°C
  // and additional 0.05 kg/hr per chicken for every 10 degrees above 25°C
  const baseConsumption = 0.1;
  const additionalConsumption = 0.05;
  const temperatureDifference = externalTemperature - 20;

  let totalConsumption = numChickens * chickenSize * baseConsumption;
  if (temperatureDifference > 5) {
    const additionalChickens = numChickens * Math.floor(temperatureDifference / 5);
    totalConsumption += additionalChickens * chickenSize * additionalConsumption;
  }

  return totalConsumption;
}

// Function to calculate fan consumption based on fan details and chicken consumption
function calculateFanConsumption(fanDetails, chickenConsumption) {
  // Your calculation logic here (you can define a suitable formula based on your requirements)
  // For this example, let's assume a simple calculation:
  // Fan consumption (Watts per hour) = (number of fans * fan size * number of setups) + (fan cost * chicken consumption)
  const fanConsumption = (fanDetails.numFans * fanDetails.fanSize * fanDetails.numSetups) + (fanDetails.fanCost * chickenConsumption);
  return fanConsumption;
}

// Function to display the results and best fan setup on the webpage
function displayResults(chickenConsumption, fanConsumption, bestFanSetup) {
  const resultContainer = document.createElement('div');
  resultContainer.className = 'bg-white p-4 shadow-md rounded-md mt-4';

  const resultHeader = document.createElement('h2');
  resultHeader.className = 'text-lg font-bold mb-4';
  resultHeader.textContent = 'Results';
  resultContainer.appendChild(resultHeader);

  const chickenConsumptionParagraph = document.createElement('p');
  chickenConsumptionParagraph.textContent = `Chicken Consumption (kg/hr): ${chickenConsumption.toFixed(2)}`;
  resultContainer.appendChild(chickenConsumptionParagraph);

  const fanConsumptionParagraph = document.createElement('p');
  fanConsumptionParagraph.textContent = `Fan Consumption (Watts/hr): ${fanConsumption.toFixed(2)}`;
  resultContainer.appendChild(fanConsumptionParagraph);

  const bestFanSetupHeader = document.createElement('h2');
  bestFanSetupHeader.className = 'text-lg font-bold mt-4';
  bestFanSetupHeader.textContent = 'Best Fan Setup Option';
  resultContainer.appendChild(bestFanSetupHeader);

  const bestFanSetupDetails = document.createElement('div');
  bestFanSetupDetails.innerHTML = `
    <p><strong>Number of Fans:</strong> ${bestFanSetup.numFans}</p>
    <p><strong>Fan Size (m3/hr):</strong> ${bestFanSetup.fanSize}</p>
  `;
  resultContainer.appendChild(bestFanSetupDetails);

  // Show the results in a container with a border and some padding
  const resultWrapper = document.createElement('div');
  resultWrapper.className = 'border border-gray-300 rounded-md p-4';
  resultWrapper.appendChild(resultContainer);

  // Remove any previous results before displaying the new ones
  const previousResult = document.querySelector('.result-wrapper');
  if (previousResult) {
    previousResult.remove();
  }

  // Add the new results to the page
  const formContainer = document.querySelector('.container');
  formContainer.appendChild(resultWrapper);
}

// Move to the next step when the fan details form is submitted
const fanDetailsForm = document.getElementById('fanDetailsForm');
fanDetailsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('fanDetailsForm').classList.add('hidden');
  document.getElementById('chickenDetailsForm').classList.remove('hidden');
});

// Attach form submission event listener for fan details form
const chickenDetailsForm = document.getElementById('chickenDetailsForm');
chickenDetailsForm.addEventListener('submit', handleChickenDetailsFormSubmit);


// Function to calculate the best fan setup based on fan details and chicken consumption
function calculateBestFanSetup(fanDetails, chickenConsumption) {
  const totalFanConsumption = fanDetails.numFans * fanDetails.fanSize * fanDetails.numSetups * fanDetails.fanCost;

  return {
    numFans: fanDetails.numFans,
    fanSize: fanDetails.fanSize,
    totalFanConsumption,
  };
}

// ... (rest of the code remains unchanged)

// Function to reset the form fields to their initial values
function resetForm() {
  document.getElementById('numChickens').value = '';
  document.getElementById('chickenSize').value = '';
  document.getElementById('numFans').value = '';
  document.getElementById('fanSize').value = '';
  document.getElementById('numSetups').value = '';
  document.getElementById('fanCost').value = '';
}

// Function to handle form reset
function handleFormReset() {
  document.getElementById('resultsSection').classList.add('hidden');
  document.getElementById('chickenDetailsForm').classList.remove('hidden');
  resetForm();
}

// Attach event listener for form reset button
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', handleFormReset);

// ... (rest of the code remains unchanged)
