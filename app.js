const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const path = require('path');

const port = process.env.PORT || 8000;

// EXPRESS SPECIFIC STUFF
app.use('/src', express.static('src'));
app.use('/static', express.static('static'));
app.use('/views', express.static('views'));
app.use(express.urlencoded());

// SERVE FAVICON
// app.use(favicon(path.join(__dirname, 'src', 'icon', 'icon.ico')));
app.use(favicon(path.join(__dirname, 'src', 'icon', 'icon.png')));

// ENDPOINTS
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// START THE SERVER
app.listen(port, () => {
	console.log(`The Application is running successfully on port ${port}`);
});