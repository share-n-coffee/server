# demoproject

> Demoproject app built with the express along with mongodb for data storage, passport for authentication.

## Quick Start

- GO to [telegram](https://telepass.me/my_apps) and click `Create new app`
- Name your app
- set Redirect URL to `http://localhost:3000/auth/telegram/callback`
- smash `Create` button
- and finaly set your Secret and App ID in `./server/config/config.json`

```bash
# Install dependencies for server
npm install

# Install dependencies for client
cd .client   than   npm install

# Run the client & server with concurrently
npm run dev

# Run the Express server only
npm run server

# Run the React client only
npm run client

# Server runs on http://localhost:3000 and client on http://localhost:5000
```
