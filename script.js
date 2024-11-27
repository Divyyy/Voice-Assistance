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
        else if(command.includes("open youtube")){
          appName = 'youtube';
        }
        else if (command.includes("open spotify")){
          appName = 'spotify';
        }
        else if (command.includes('open store')){
          appName = 'store';
        }
        else if (command.includes('open web whatsapp')){
          appName= 'webwa';
        }
        else if (command.includes('whatsapp desktop')){
          appName='whatsapp';
        }
        else if(command.includes('link')){
          appName = 'linkdin';
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
    body.style.backgroundImage = 'url(GOLDENHOUR.jpg)'; // Replace with your image URL
    body.style.backgroundSize = 'cover'; // Ensures the image covers the entire background
    body.style.backgroundPosition = 'center'; // Golden hour
  } else if (hour >= 8 && hour < 17) {
    // Daytime
    body.style.backgroundImage = 'url(DAYTIME.jpg)'; // Replace with your image URL
    body.style.backgroundSize = 'cover'; // Ensures the image covers the entire background
    body.style.backgroundPosition = 'center'; // Blue sky
  } else if (hour >= 17 && hour < 19) {
    // Evening
    body.style.backgroundImage = 'url(EVE.jpg)'; // Replace with your image URL
    body.style.backgroundSize = 'cover'; // Ensures the image covers the entire background
    body.style.backgroundPosition = 'center';// Sunset colors
  } else {
    // Nighttime
    body.style.backgroundImage = 'url(NIG.jpg)'
    body.style.backgroundSize = 'cover';
    body.style.backgroundPosition = 'center';
    body.style.color = 'white';
     // Dark night
  }

  
}

// Update the background immediately on page load
updateBackground();

// Optional: Update the background every hour (or periodically for smoother transitions)
setInterval(updateBackground, 60 * 60 * 1000);
