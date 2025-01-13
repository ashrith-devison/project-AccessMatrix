module.exports = {
  apps: [
    {
      name: "Access Matrix API",
      script: "node",
      args: "-r dotenv/config --experimental-json-modules ./src/index.js",
      watch: true, 
      env: {
        NODE_ENV: "production", 
      },
    },
  ],
};
