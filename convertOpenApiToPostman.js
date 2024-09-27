const fs = require('fs');
const path = require('path');
const converter = require('openapi-to-postmanv2');

const specPath = path.join(__dirname, 'Petstore.yaml');
const openApiSpec = fs.readFileSync(specPath, 'utf8');

converter.convert({ type: 'string', data: openApiSpec }, {}, (err, conversionResult) => {
            if (!conversionResult.result) {
                            console.error('Could not convert', conversionResult.reason);
                        } else {
                                        const postmanCollection = conversionResult.output[0].data;
                                        const outputPath = path.join(__dirname, 'postman-collection.json');
                                        fs.writeFileSync(outputPath, JSON.stringify(postmanCollection, null, 2));
                                        console.log('Postman collection successfully written to', outputPath);
                                    }
});

