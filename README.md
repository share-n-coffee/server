# # [Development server](https://forge-development.herokuapp.com/)

[![codecov](https://codecov.io/gh/saniok017/Server/branch/master/graph/badge.svg)](https://codecov.io/gh/saniok017/Server) 
[![Build Status](https://travis-ci.com/saniok017/Server.svg?branch=master)](https://travis-ci.com/saniok017/Server)
![Heroku](http://heroku-badge.herokuapp.com/?app=forge-development&style=flat)

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
