const { request } = require('undici');
const express = require('express');
const { clientId, clientSecret, port } = require('./config.json');

const app = express();

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

// START APP ON PORT AND SERVER FILES IN FOLDER: PUBLIC
app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
app.use(express.static('public'))