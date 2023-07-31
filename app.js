// Function to check if fan details exist in localStorage
function checkFanDetailsInLocalStorage() {
  const fanDetails = localStorage.getItem('fanDetails');
  if (fanDetails) {
    const useExistingDetails = confirm('Do you want to use the existing fan details?');
    if (useExistingDetails) {
      const { numFans, fanSize, numSetups, fanCost } = JSON.parse(fanDetails);
      document.getElementById('numFans').value = numFans;
      document.getElementById('fanSize').value = fanSize;
      document.getElementById('numSetups').value = numSetups;
      document.getElementById('fanCost').value = fanCost;
    } else {
      localStorage.removeItem('fanDetails');
    }
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
  localStorage.setItem('fanDetails', JSON.stringify(fanDetails));

  // Move to the next step (designing the form for chicken details)
  // You can call the function to display the chicken form here if you want to proceed to the next step automatically
}

// Check for fan details in localStorage when the page loads
document.addEventListener('DOMContentLoaded', checkFanDetailsInLocalStorage);


// Function to get the external temperature using the OpenWeatherMap API
async function getExternalTemperature() {
  try {
    // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
    const apiKey = 'YOUR_API_KEY';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=LATITUDE&lon=LONGITUDE&appid=${apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    const externalTemperature = data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
    return externalTemperature;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to handle form submission for chicken details
async function handleChickenDetailsFormSubmit(event) {
  event.preventDefault();

  // Retrieve form values
  const numChickens = parseInt(document.getElementById('numChickens').value);
  const chickenSize = parseFloat(document.getElementById('chickenSize').value);

  // Fetch external temperature using the OpenWeatherMap API
  const externalTemperature = await getExternalTemperature();

  if (externalTemperature !== null) {
    // Calculate chicken consumption based on the external temperature
    const chickenConsumption = calculateChickenConsumption(numChickens, chickenSize, externalTemperature);

    // Calculate fan consumption based on the chicken consumption and fan details
    const fanDetails = JSON.parse(localStorage.getItem('fanDetails'));
    const fanConsumption = calculateFanConsumption(fanDetails, chickenConsumption);

    // Display the results
    displayResults(chickenConsumption, fanConsumption);
  } else {
    alert('Failed to fetch weather data. Please try again later.');
  }
}

// Function to calculate chicken consumption based on number of chickens, chicken size, and external temperature
function calculateChickenConsumption(numChickens, chickenSize, externalTemperature) {
  // Your calculation logic here (you can define a suitable formula based on your requirements)
  // For this example, let's assume a simple calculation:
  // Chicken consumption (kg per hour) = (number of chickens * chicken size * (external temperature / 20))
  const chickenConsumption = numChickens * chickenSize * (externalTemperature / 20);
  return chickenConsumption;
}

// Function to calculate fan consumption based on fan details and chicken consumption
function calculateFanConsumption(fanDetails, chickenConsumption) {
  // Your calculation logic here (you can define a suitable formula based on your requirements)
  // For this example, let's assume a simple calculation:
  // Fan consumption (Watts per hour) = (number of fans * fan size * number of setups) + (fan cost * chicken consumption)
  const fanConsumption = (fanDetails.numFans * fanDetails.fanSize * fanDetails.numSetups) + (fanDetails.fanCost * chickenConsumption);
  return fanConsumption;
}

// Function to display the results on the webpage
function displayResults(chickenConsumption, fanConsumption) {
  // Your display logic here, for example:
  const resultContainer = document.createElement('div');
  resultContainer.className = 'bg-white p-4 shadow-md rounded-md mt-4';
  resultContainer.innerHTML = `
    <h2 class="text-lg font-bold mb-4">Results</h2>
    <p class="mb-2"><strong>Chicken Consumption (kg/hr):</strong> ${chickenConsumption.toFixed(2)}</p>
    <p><strong>Fan Consumption (Watts/hr):</strong> ${fanConsumption.toFixed(2)}</p>
  `;

  const formContainer = document.querySelector('.container');
  formContainer.appendChild(resultContainer);
}

// Move to the next step when the fan details form is submitted
const fanDetailsForm = document.getElementById('fanDetailsForm');
fanDetailsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.getElementById('fanDetailsForm').classList.add('hidden');
  document.getElementById('chickenDetailsForm').classList.remove('hidden');
});

// Attach form submission event listener for chicken details form
const chickenDetailsForm = document.getElementById('chickenDetailsForm');
chickenDetailsForm.addEventListener('submit', handleChickenDetailsFormSubmit);
