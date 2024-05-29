const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/*.js"];

const doc = {
  info: {
    title: "Beauty Butler API",
    description: "Your API Description",
  },
  host: "localhost:3000", // Your API server host
  basePath: "/", // Your API base path
  schemes: ["http"], // Your API protocols (http, https)
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  consumes: ["application/json"],
  produces: ["application/json"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./app"); // Start your express app
});
