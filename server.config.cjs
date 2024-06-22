module.exports = {
  apps: [
    {
      name: "nodejs_backend",
      script: "./server.js",

      watch: true,
      autorestart: true,
      cron_restart: "0 2 * * *",
      merge_logs: true,
      ignore_watch: [".git", "node_modules"],
      watch_options: {
        followSymlinks: false,
      },

      env_local: {
        NODE_ENV: "local",
      },
      env_development: {
        NODE_ENV: "development",
      },
      env_uat: {
        NODE_ENV: "uat",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
