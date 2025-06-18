const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
const app = express();
const port = 3003;

// ✅ Serve static frontend files from 'public' folder
app.use(express.static('public'));

// ✅ Allow CORS to connect frontend and backend
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// ✅ Endpoint to open applications
app.get('/open', (req, res) => {
    const appName = req.query.app;
    let command;

    switch (appName) {
        case 'calculator':
            command = 'calc';
            break;
        case 'notepad':
            command = 'notepad';
            break;
        case 'chrome':
            command = 'start chrome';
            break;
        case 'explorer':
            command = 'explorer shell:::{20D04FE0-3AEA-1069-A2D8-08002B30309D}';
            break;
        case 'microsoft edge':
            command = 'start microsoft-edge:';
            break;
        case 'youtube':
            command = 'start chrome https://www.youtube.com';
            break;
        case 'webwa':
            command = 'start chrome https://web.whatsapp.com/';
            break;
        case 'spotify':
            command = 'start spotify';
            break;
        case 'store':
            command = 'start ms-windows-store:';
            break;
        case 'whatsapp':
            command = 'start whatsapp:';
            break;
        case 'linkdin':
            command = 'start chrome https://www.linkedin.com/feed/';
            break;
        default:
            return res.send('App not recognized');
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            if (command.startsWith('explorer')) {
                console.warn(`Non-critical error for explorer command: ${error.message}`);
                return res.send(`${appName} opened successfully`);
            }
            console.error(`Error opening ${appName}:`, error);
            return res.send(`Failed to open ${appName}.`);
        }

        res.send(`${appName} opened successfully`);
    });
});

// ✅ Web search endpoint (GETs HTML from Google)
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.send('No search query provided');
    }

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            }
        });

        res.setHeader("Content-Security-Policy", "frame-ancestors *");
        res.setHeader("X-Frame-Options", "ALLOWALL");

        res.send(response.data);
    } catch (error) {
        console.error('Error during Google search:', error.message);
        res.status(500).send('Failed to perform search.');
    }
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
