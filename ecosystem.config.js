module.exports = {
  apps: [
    {
      name: "dashboard-frontend",
      cwd: "./client",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3005,
      },
    },
    {
      name: "dashboard-backend",
      cwd: "./server",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3004,
      },
    },
  ],
};
