# [Development server](https://forge-development.herokuapp.com/)

[![codecov](https://codecov.io/gh/saniok017/Server/branch/db-tests/graph/badge.svg)](https://codecov.io/gh/saniok017/Server) 
[![Build Status](https://travis-ci.com/saniok017/Server.svg?branch=db-tests)](https://travis-ci.com/saniok017/Server)
![Heroku](http://heroku-badge.herokuapp.com/?app=forge-development&style=flat)

# [main server](https://forgeserver.herokuapp.com/)

# [Documentation](https://documenter.getpostman.com/view/7419944/S1Lx1ouZ)

> Development branch.

## Quick Start

```bash
# Install dependencies for server
npm install

# Run the Express server only
npm run server

# Server runs on http://localhost:3000
```

## .env example

```bash
NODE_MONGODB_URI=mongodb://root:root@localhost:27017/random_coffee
NODE_JWT_SECRET=random_jwt

TELEGRAM_BOT_ENABLED=0
TELEGRAM_BOT_TOKEN=123

CORS_ENABLED=0
CORS_ORIGINS=http://localhost:3000,https://google.com
```

