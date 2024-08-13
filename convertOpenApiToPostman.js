const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const convertOpenApiToPostman = (openApiFilePath, outputFilePath) => {
  // Ensure paths are absolute
  const absoluteOpenApiFilePath = path.resolve(openApiFilePath);
  const absoluteOutputFilePath = path.resolve(outputFilePath);

  // Ensure the OpenAPI file exists
  if (!fs.existsSync(absoluteOpenApiFilePath)) {
    console.error(`OpenAPI file not found at: ${absoluteOpenApiFilePath}`);
    return;
  }

  // Run the postman-to-openapi command
  const command = `postman-to-openapi "${absoluteOpenApiFilePath}" "${absoluteOutputFilePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error converting OpenAPI to Postman: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`Postman collection generated successfully: ${absoluteOutputFilePath}`);
  });
};

// Example usage:
const openApiFile = './openapi.yaml'; // Replace with your OpenAPI file path
const outputPostmanFile = './postman_collection.json'; // Replace with your desired output file path

convertOpenApiToPostman(openApiFile, outputPostmanFile);