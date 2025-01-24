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
let selectedCities = [];
let currentQuestion = 0;
let score = 0;

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

    // Select 5 random cities for the game
    shuffleArray(cities);
    selectedCities = cities.slice(0, 5);

    // Start the game
    displayQuestion();
  } catch (error) {
    console.error("Error fetching cities:", error);
    document.getElementById("output").innerHTML = "Failed to load data. Check the console for errors.";
  }
}

// Display the current question
function displayQuestion() {
  const cityData = selectedCities[currentQuestion];
  const outputDiv = document.getElementById("output");
  const optionsContainer = document.getElementById("options-container");
  const feedbackContainer = document.getElementById("feedback-container");
  const questionNumberDiv = document.getElementById("question-number");

  // Display question number
  questionNumberDiv.textContent = `Question ${currentQuestion + 1} / ${selectedCities.length}`;

  // Display image
  outputDiv.innerHTML = `<img src="${cityData.image_url}" alt="${cityData.name}">`;

  // Clear feedback and options
  feedbackContainer.textContent = "";
  optionsContainer.innerHTML = "";

  // Generate multiple-choice options
  const options = generateOptions(cityData);
  options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = `${option.name}, ${option.country}`;
    button.onclick = () => handleAnswer(option, cityData);
    optionsContainer.appendChild(button);
  });

  // Hide next question button
  document.getElementById("next-question-btn").style.display = "none";
}

// Handle answer selection
function handleAnswer(selectedOption, correctOption) {
  const feedbackContainer = document.getElementById("feedback-container");

  if (selectedOption === correctOption) {
    feedbackContainer.textContent = `Correct! This is ${correctOption.name}, ${correctOption.country} in ${correctOption.year}.`;
    score++;
  } else {
    feedbackContainer.textContent = `Wrong! This was ${correctOption.name}, ${correctOption.country} in ${correctOption.year}.`;
  }

  // Show next question button
  const nextQuestionBtn = document.getElementById("next-question-btn");
  nextQuestionBtn.style.display = "block";
  nextQuestionBtn.onclick = nextQuestion;
}

// Move to the next question or end the game
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < selectedCities.length) {
    displayQuestion();
  } else {
    endGame();
  }
}

// End the game and display the score
function endGame() {
  const outputDiv = document.getElementById("output");
  const optionsContainer = document.getElementById("options-container");
  const feedbackContainer = document.getElementById("feedback-container");

  outputDiv.innerHTML = "Game Over!";
  optionsContainer.innerHTML = "";
  feedbackContainer.textContent = `Your final score is ${score} / ${selectedCities.length}.`;
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

// Start the game
fetchCities();

