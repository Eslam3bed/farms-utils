const apiKey = "a6b634036064472eae7203400230208";

async function getDeviceLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}


// Function to get the external temperature using the WeatherAPI
async function getExternalTemperature() {
  try {
    // Replace 'YOUR_API_KEY' with your actual WeatherAPI key
    // Replace 'LATITUDE' and 'LONGITUDE' with the actual GPS coordinates (latitude and longitude) of your location
    const { coords } = await getDeviceLocation();
    const { latitude, longitude } = coords;
    console.log(latitude, longitude);
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }
    const data = await response.json();
    const externalTemperature = data.current.temp_c;
    return externalTemperature;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}


// Function to calculate chicken consumption based on number of chickens, chicken size, and external temperature
function calculateChickenConsumption(
    numChickens,
    chickenSize,
    externalTemperature
  ) {
    // Assuming that chickens consume 0.1 kg/hr per chicken for every 10 degrees above 20°C
    // and additional 0.05 kg/hr per chicken for every 10 degrees above 25°C
    const baseConsumption = 0.1;
    const additionalConsumption = 0.05;
    const temperatureDifference = externalTemperature - 20;
  
    let totalConsumption = numChickens * chickenSize * baseConsumption;
    if (temperatureDifference > 5) {
      const additionalChickens =
        numChickens * Math.floor(temperatureDifference / 5);
      totalConsumption +=
        additionalChickens * chickenSize * additionalConsumption;
    }
  
    return totalConsumption;
  }

  function calculateChickenConsumption(
    numChickens,
    chickenSize,
    externalTemperature
  ) {
    // Assuming that chickens consume 0.1 kg/hr per chicken for every 10 degrees above 20°C
    // and additional 0.05 kg/hr per chicken for every 10 degrees above 25°C
    const baseConsumption = 0.1;
    const additionalConsumption = 0.05;
    const temperatureDifference = externalTemperature - 20;
  
    let totalConsumption = numChickens * chickenSize * baseConsumption;
    if (temperatureDifference > 5) {
      const additionalChickens =
        numChickens * Math.floor(temperatureDifference / 5);
      totalConsumption +=
        additionalChickens * chickenSize * additionalConsumption;
    }
  
    return totalConsumption;
  }