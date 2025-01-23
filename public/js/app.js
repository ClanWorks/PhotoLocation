// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
// Import Firebase configuration
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Global variables
let cities = [];
let currentIndex = 0;

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Fetch data from Firestore
async function fetchCities() {
  try {
    const cityCollection = collection(db, "cities");
    const querySnapshot = await getDocs(cityCollection);

    if (querySnapshot.empty) {
      document.getElementById("output").innerHTML = "No cities found in the database.";
      return;
    }

    querySnapshot.forEach((doc) => {
      cities.push(doc.data());
    });

    // Shuffle the cities array for randomness
    shuffleArray(cities);

    // Display the first record
    displayCity(0);
    updateButtons();
  } catch (error) {
    console.error("Error fetching cities:", error);
    document.getElementById("output").innerHTML = "Failed to load data. Check the console for errors.";
  }
}

// Display a city by index
function displayCity(index) {
  const cityData = cities[index];
  const outputDiv = document.getElementById("output");
  const optionsContainer = document.getElementById("options-container");
  const feedbackContainer = document.getElementById("feedback-container");

  // Display image
  outputDiv.innerHTML = `<img src="${cityData.image_url}" alt="${cityData.name}">`;

  // Clear feedback
  feedbackContainer.textContent = "";

  // Generate multiple-choice options
  const options = generateOptions(cityData);
  optionsContainer.innerHTML = "";

  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = `${option.name}, ${option.country}`;
    button.onclick = () => {
      const isCorrect = option === cityData;
      feedbackContainer.textContent = isCorrect
        ? `Yes, this was ${cityData.name}, ${cityData.country} in ${cityData.year}.`
        : `Sorry, this was ${cityData.name}, ${cityData.country} in ${cityData.year}.`;
    };
    optionsContainer.appendChild(button);
  });
}

// Generate options with 1 correct and 2 incorrect answers
function generateOptions(correctCity) {
  const incorrectCities = cities.filter((city) => city !== correctCity);
  shuffleArray(incorrectCities);
  const selectedIncorrect = incorrectCities.slice(0, 2);
  const options = [correctCity, ...selectedIncorrect];
  shuffleArray(options);
  return options;
}

// Update button states
function updateButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === cities.length - 1;
}

// Add event listeners for navigation buttons
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    displayCity(currentIndex);
    updateButtons();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentIndex < cities.length - 1) {
    currentIndex++;
    displayCity(currentIndex);
    updateButtons();
  }
});

// Fetch and display cities
fetchCities();

