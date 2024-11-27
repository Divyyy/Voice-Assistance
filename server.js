const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3003;

// Allow CORS to connect frontend and backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Endpoint to open applications
app.get('/open', (req, res) => {
    const appName = req.query.app;

    // Define commands to open specific apps
    let command;
    switch (appName) {
        case 'calculator':
            command = 'calc'; // For Windows Calculator
            break;
        case 'notepad':
            command = 'notepad'; // For Windows Notepad
            break;
            case 'chrome':
                command = 'start chrome'; // For Google Chrome
                break;
                case 'explorer':
                    command = 'explorer shell:::{20D04FE0-3AEA-1069-A2D8-08002B30309D}'; // Directly opens "This PC"
                    break;
            case 'microsoft edge':
                command = 'start microsoft-edge:'; // For Microsoft Edge
                break;
            case 'youtube':
             command = 'start chrome https://www.youtube.com'; // Opens Chrome with YouTube
              break;
              case 'webwhatsapp':
             command = 'start chrome https://web.whatsapp.com/'; // Opens Chrome with whatsapp web
              break;
              case 'spotify':
             command = 'start spotify'; // Opens Chrome with YouTube
              break;
              case 'store':
                command='start ms-windows-store:'; // open ms store
                break;
                case 'whatsapp':
                command= 'start whatsapp:';
                break;
                case 'linkdin':
             command = 'start chrome https://www.linkedin.com/feed//'; // Opens Chrome with linkdin
              break;


            
        // Add more cases as needed
        default:
            return res.send('App not recognized');
    }

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            // Ignore errors specifically for "explorer" commands
            if (command.startsWith('explorer')) {
                console.warn(`Non-critical error for explorer command: ${error.message}`);
                return res.send(`${appName} opened successfully `);
            }
    
            // For other commands, handle the error normally
            console.error(`Error opening ${appName}:`, error);
            return res.send(`Failed to open ${appName}.`);
        }
    
        // Success case
        res.send(`${appName} opened successfully`);
    });
});

// for world wide search

const axios = require('axios');

app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.send('No search query provided');
    }
    

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            }
        });
        
        // Return the Google results page
        res.setHeader("Content-Security-Policy", "frame-ancestors *");
res.setHeader("X-Frame-Options", "ALLOWALL");

        res.send(response.data);
    } catch (error) {
        console.error('Error during Google search:', error.message);
        res.status(500).send('Failed to perform search.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
app.get('/search', (req, res) => {
    const query = req.query.query;
    console.log("Search query received:", query); // Log the query
  
    if (!query) {
      console.error("No query provided");
      return res.send('No search query provided');
    }
  
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const command = `start chrome "${searchUrl}"`;
    console.log("Executing command:", command); // Log the command to be executed
  
    // Execute the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send(`Failed to perform Google search for "${query}".`);
      }
      console.log(`Command output: ${stdout || stderr}`);
      res.send(`Searching Google for "${query}" using Chrome...`);
    });
  });
  
