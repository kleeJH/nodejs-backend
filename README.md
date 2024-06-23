# nodejs-backend
## Setup
1. Install dependencies: `npm i`
2. Start PM2: `pm2 start server.config.cjs`

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

## Troubleshooting