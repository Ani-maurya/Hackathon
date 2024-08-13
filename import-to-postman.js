const fs = require('fs');
const axios = require('axios');
const path = require('path');

const collectionPath = path.join(__dirname, 'postman-collection.json');
const collectionData = fs.readFileSync(collectionPath, 'utf8');

// Replace with your Postman API key
const postmanApiKey = 'your-postman-api-key';

// Set your desired collection name here
const collectionName = 'Petstore';

const options = {
    method: 'POST',
    url: 'https://api.getpostman.com/collections',
    headers: {
        'X-Api-Key': postmanApiKey,
        'Content-Type': 'application/json'
    },
    data: JSON.stringify({
        collection: {
            ...JSON.parse(collectionData),
            info: {
                ...JSON.parse(collectionData).info,
                name: collectionName
            }
        }
    })
};

// Make the request to import the collection
axios(options)
    .then(response => {
        console.log('Collection successfully imported to Postman:', response.data);
    })
    .catch(error => {
        console.error('Error importing collection:', error.response.data);
    });
