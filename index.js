const { request } = require('undici');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { clientId, clientSecret, port } = require('./config.json');

const fs = require("fs");
const { error } = require('console');

const app = express();

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// AUTHORIZATION VIA DISCORD
app.get('/', async ({ query }, response) => {
	const { code } = query;

	if (code) {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: `http://localhost:${port}/main`,
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();

			const userResult = await request('https://discord.com/api/users/@me', {
				headers: {
					authorization: `${oauthData.token_type} ${oauthData.access_token}`,
				},
			});

			console.log(await userResult.body.json());
		} catch (error) {
			// NOTE: An unauthorized token will not throw an error
			// tokenResponseData.statusCode will be 401
			console.error(error);
		}
	}

	return response.sendFile('index.html', { root: './public' });
});

// MAIN ROUTE
app.get('/main', ({ query }, response) => {
	return response.sendFile('main.html', { root: './public' });
});

// API CALLS

app.post('/API/GET', (request, response) => {
	fs.readFile(`./DATA/${request.body.faction}/${request.body.file}`, (err, data) => {
		if (err) throw err;
		response.send(data);
	})
})

app.post('/API/SESSION', (request, response) => {
	
});

// START APP ON PORT AND SERVER FILES IN FOLDER: PUBLIC
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.use(express.static('public'))