const quoteDisplay = document.getElementById("quote-display");
const inputField = document.getElementById("input-field");
const wpmDisplay = document.getElementById("wpm");
const timeDisplay = document.getElementById("time");
const mistakesDisplay = document.getElementById("mistakes");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");

const startOverlay = document.getElementById("start-overlay");
const startBtn = document.getElementById("start-btn");

let timer;
let timeLeft = 60;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

const quotes = {
  beginner: [
    "A fast processor makes a smartphone run very smoothly.",
    "The elder brother always looks out for his family.",
    "Starting a cooking channel requires good video editing.",
    "Quick reflexes are needed to win a battle royale match.",
    "Learning to code is best done by building real things."
  ],
  moderate: [
    "First-year engineering students study applied physics, including lasers and polarization.",
    "Pitching your project to the judges during an ideathon can be highly rewarding.",
    "A data analyst evaluates large datasets to find patterns and assess business risks.",
    "Frontend development requires a good eye for design and strong logic skills.",
    "Total internal reflection is the core principle behind optical fiber communication."
  ],
  advanced: [
    "The Pixhawk 2.4.8 flight controller, paired with a Raspberry Pi 4, enables autonomous drone mapping.",
    "Funtouch OS 15 based on the Android 16 rollout introduces new background task management.",
    "Writing a Python script using DroneKit requires establishing a MAVLink connection to the UAV.",
    "Competitive BGis tournaments demand frame-perfect inputs and highly optimized network latency.",
    "Asynchronous JavaScript heavily relies on Promises and the event loop to manage non-blocking operations."
  ]
};

function loadQuote() {
  let currentMode = difficultySelect.value;
  let quoteArray = quotes[currentMode];
  let randomQuote = quoteArray[Math.floor(Math.random() * quoteArray.length)];
  
  quoteDisplay.innerHTML = "";
  
  randomQuote.split("").forEach(char => {
    quoteDisplay.innerHTML += `<span>${char}</span>`;
  });
  
  quoteDisplay.classList.add("blur-text");
  startOverlay.style.display = "flex";
  
  quoteDisplay.addEventListener("click", () => {
    if (startOverlay.style.display === "none") {
      inputField.focus();
    }
  });
}

startBtn.addEventListener("click", () => {
  startOverlay.style.display = "none"; 
  quoteDisplay.classList.remove("blur-text"); 
  inputField.focus(); 
});

function initTyping() {
  let characters = quoteDisplay.querySelectorAll("span");
  let typedChar = inputField.value.split("")[charIndex];

  if (charIndex < characters.length && timeLeft > 0) {
    
    if (!isTyping) {
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      if (charIndex > 0) {
        charIndex--;
        if (characters[charIndex].classList.contains("incorrect")) {
          mistakes--;
        }
        characters[charIndex].classList.remove("correct", "incorrect");
      }
    } else {
      if (characters[charIndex].innerText === typedChar) {
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++;
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++;
    }

    characters.forEach(span => span.classList.remove("active"));
    if (charIndex < characters.length) {
      characters[charIndex].classList.add("active");
    }

    let wpm = Math.round((((charIndex - mistakes) / 5) / (60 - timeLeft)) * 60);
    
    if (wpm < 0 || wpm === Infinity || isNaN(wpm)) {
      wpm = 0;
    }
    
    wpmDisplay.innerText = wpm;
    mistakesDisplay.innerText = mistakes;

    if (charIndex === characters.length) {
      clearInterval(timer);
      inputField.blur();
    }

  } else {
    clearInterval(timer);
    inputField.value = "";
  }
}

function initTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
    
    let wpm = Math.round((((charIndex - mistakes) / 5) / (60 - timeLeft)) * 60);
    if (wpm < 0 || wpm === Infinity || isNaN(wpm)) {
      wpm = 0;
    }
    wpmDisplay.innerText = wpm;
  } else {
    clearInterval(timer);
  }
}

function resetTest() {
  loadQuote();
  clearInterval(timer);
  timeLeft = 60;
  charIndex = 0;
  mistakes = 0;
  isTyping = false;
  inputField.value = "";
  timeDisplay.innerText = timeLeft;
  wpmDisplay.innerText = 0;
  mistakesDisplay.innerText = 0;
}

loadQuote();
inputField.addEventListener("input", initTyping);
restartBtn.addEventListener("click", resetTest);
difficultySelect.addEventListener("change", resetTest);


// Form Validation Logic

const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast"); 

contactForm.addEventListener("submit", function(event) {
  
  event.preventDefault(); 

  const emailInput = document.getElementById("email").value;
  const phoneInput = document.getElementById("phone").value;

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput)) {
    alert("Warning: Please enter a completely valid email address (e.g., name@gmail.com).");
    return;
  }

  //  Validate Phone
  if (phoneInput.trim() !== "") {
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneInput)) {
      alert("Warning: Phone number can only contain numbers and must be 10 to 15 digits long.");
      return;
    }
  }
  
  
  let formData = new FormData(contactForm);

  fetch(contactForm.action, {
    method: contactForm.method,
    body: formData,
    headers: {
      'Accept': 'application/json' 
    }
  })
  .then(response => {
    if (response.ok) {
     
      toast.classList.add("show");
      
      
      setTimeout(() => {
        toast.classList.remove("show");
      }, 4000);
      
     
      contactForm.reset();
    } else {
      alert("Oops! There was a problem submitting your form.");
    }
  })
  .catch(error => {
    alert("Oops! Something went wrong with your connection.");
  });
});
 
