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
  const description = `This image is of ${cityData.name}, ${cityData.country} in ${cityData.year}.`;

  const cityHTML = `
    <div style="position: relative;">
      <img src="${cityData.image_url}" alt="${cityData.name}">
      <div class="description">${description}</div>
    </div>
  `;

  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = cityHTML;

  // Hide the description initially
  const descriptionDiv = outputDiv.querySelector(".description");
  descriptionDiv.style.display = "none";

  // Reset the Reveal button text
  const revealBtn = document.getElementById("reveal-btn");
  revealBtn.textContent = "Reveal";
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

// Add event listener for the Reveal button
document.getElementById("reveal-btn").addEventListener("click", () => {
  const descriptionDiv = document.querySelector(".description");
  const revealBtn = document.getElementById("reveal-btn");

  if (descriptionDiv.style.display === "none") {
    descriptionDiv.style.display = "block";
    revealBtn.textContent = "Hide";
  } else {
    descriptionDiv.style.display = "none";
    revealBtn.textContent = "Reveal";
  }
});

// Fetch and display cities
fetchCities();

