# nodejs-backend
## Introduction
Hi there! 

This repository is used as a foundation to start a backend environment that uses Node JS, Express and MongoDB. It offers features such as authorization middlewares (JWT auth via access and refresh token, and auth via an api key), password-based authentication (salt hashing), role module permission authorization middleware, request body validation, cron job database backup, logging, custom exception classes, and a structured folder system.

There is also session token for cookies using Lucia but it is disabled. Some features such as Google OAuth 2.0 login and Redis were not used.

Feel free to explore!

## Setup
1. Install dependencies: `npm i`
2. Run `node ./app/common/utils/generateKeys.js` to generate asymmetric encryption keys
3. Start PM2: `pm2 start server.config.cjs`
4. Run `npm run init` to setup the required configurations
5. Make sure to setup the `.env` file
6. In `docs`, you can import the Postman collection to see some of the existing apis

## Useful PM2 Terminal Commands
- Start: `pm2 start server.config.cjs`
- Check logs: `pm2 log [id]`
- Restart: `pm2 restart [id | all]`
- Delete: `pm2 delete [id | all]`

### Setting Environment definition
- local: `pm2 start server.config.cjs` // Default
- development: `pm2 start server.config.cjs --env development`
- uat: `pm2 start server.config.cjs --env uat`
- production: `pm2 start server.config.cjs --env production`

### Environment Variables (.env)
Check `.env.sample` for the configurations needed for this repository 

## Troubleshooting