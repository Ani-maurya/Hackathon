const fs = require('fs');
const axios = require('axios');

// Postman API key
const postmanApiKey = '';

// Read the Postman collection JSON file
const postmanCollection = JSON.parse(fs.readFileSync('postman-collection.json', 'utf8'));

// Function to add test scripts to requests
function addTestScripts(item) {
    const script = `
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

if (pm.request.method === 'POST') {
    pm.test("Content-Type header is present", function () {
        pm.expect(pm.response.headers.has('Content-Type')).to.be.true;
    });
}
    `;

    if (!item.event) {
        item.event = [];
    }

    item.event.push({
        listen: 'test',
        script: {
            type: 'text/javascript',
            exec: script.trim().split('\n')
        }
    });

    return item;
}

// Recursive function to traverse items and add scripts
function traverseItems(items) {
    items.forEach(item => {
        if (item.item) {
            traverseItems(item.item);
        } else {
            addTestScripts(item);
        }
    });
}

// Add scripts to each request in the collection
traverseItems(postmanCollection.item);

// Postman API endpoint for updating collections
const url = `https://api.getpostman.com/collections/${postmanCollection.info._postman_id}`;

// Headers for the API request
const headers = {
    'X-Api-Key': postmanApiKey,
    'Content-Type': 'application/json'
};

// Update the collection with the new scripts
axios.put(url, { collection: postmanCollection }, { headers })
    .then(response => {
        if (response.status === 200) {
            console.log('Collection updated successfully with test scripts.');
        } else {
            console.log('Error updating collection:', response.data);
        }
    })
    .catch(error => {
        console.log('Error:', error.response ? error.response.data : error.message);
    });
