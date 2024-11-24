const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

startBtn.addEventListener('click', () => {
  recognition.start();
  statusText.textContent = 'Listening...';
});

recognition.onresult = (event) => {
  let command = event.results[0][0].transcript.toLowerCase().trim();
  console.log("Received command:", command);

  // voice feed back
  function giveVoiceFeedback(message) {
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US'; // Set the language
    speech.pitch = 1;      // Set the pitch
    speech.rate = 1;       // Set the speed
    speech.volume = 1;     // Set the volume
    window.speechSynthesis.speak(speech);
}


  if (command.startsWith("search for")) {
      const query = command.replace("search for", "").trim();
      fetch(`http://localhost:3003/search?query=${encodeURIComponent(query)}`)
          .then(response => response.text())
          .then(data => {
              const iframe = document.getElementById('search-results');
              iframe.srcdoc = data; // Inject search results HTML into iframe
              const feedbackMessage = `Here are the search results for "${query}".`;
              statusText.textContent = feedbackMessage;
              giveVoiceFeedback(feedbackMessage); // Provide voice feedback
          })
          .catch(error => {
              const errorMessage = "Failed to perform the search.";
              statusText.textContent = errorMessage;
              giveVoiceFeedback(errorMessage); // Provide voice feedback
              console.error("Error:", error);
          });
  } else if (command.includes("open")) {
      let appName = '';
      if (command.includes("open calculator")) {
          appName = 'calculator';
      } else if (command.includes("open notepad")) {
          appName = 'notepad';
      } else if (command.includes("open pc")) {
          appName = 'explorer';
      } else if (command.includes("open edge")) {
          appName = 'microsoft edge';
      } else if (command.includes("open chrome")) {
          appName = 'chrome';
      }

      if (appName) {
          fetch(`http://localhost:3003/open?app=${appName}`)
              .then(response => response.text())
              .then(data => {
                  statusText.textContent = data;
                  giveVoiceFeedback(data); // Provide voice feedback
              })
              .catch(error => {
                  const errorMessage = "Failed to connect to the server.";
                  statusText.textContent = errorMessage;
                  giveVoiceFeedback(errorMessage); // Provide voice feedback
                  console.error("Error:", error);
              });
      } else {
          const feedbackMessage = "Command not recognized.";
          statusText.textContent = feedbackMessage;
          giveVoiceFeedback(feedbackMessage); // Provide voice feedback
      }
  } else {
      const feedbackMessage = "Command not recognized.";
      statusText.textContent = feedbackMessage;
      giveVoiceFeedback(feedbackMessage); // Provide voice feedback
  }
};



recognition.onerror = (event) => {
  statusText.textContent = `Error occurred: ${event.error}`;
};
//  dynamic background
function updateBackground() {
  const hour = new Date().getHours();
  const body = document.body;

  let gradient;
  if (hour >= 5 && hour < 8) {
    // Early morning
    gradient = 'linear-gradient(to bottom, #FFD700, #FF4500)'; // Golden hour
  } else if (hour >= 8 && hour < 17) {
    // Daytime
    gradient = 'linear-gradient(to bottom, #87CEEB, #FFDD99)'; // Blue sky
  } else if (hour >= 17 && hour < 18) {
    // Evening
    gradient = 'linear-gradient(to bottom, #FF6347, #2E8B57)'; // Sunset colors
  } else {
    // Nighttime
    gradient = 'linear-gradient(to bottom, #2c3e50, #000000)'; // Dark night
  }

  body.style.background = gradient;
}

// Update the background immediately on page load
updateBackground();

// Optional: Update the background every hour (or periodically for smoother transitions)
setInterval(updateBackground, 60 * 60 * 1000);
