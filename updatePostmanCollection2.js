const fs = require('fs');
const axios = require('axios');
const path = require('path');

const postmanApiKey = ''; // Replace with your Postman API key
const collectionName = 'Petstore'; // Replace with your collection name

const addScriptsToRequests = (items) => {
    items.forEach(item => {
        if (item.item) {
            // If the item is a folder, recursively call the function
            addScriptsToRequests(item.item);
        } else if (item.request) {
            const method = item.request.method.toUpperCase();
            let script = [];

            switch (method) {
                case 'GET':
                    script.push(`pm.test("Response is OK", function () {`);
                    script.push(`    pm.response.to.have.status(200);`);
                    script.push(`});`);
                    script.push(`if (pm.response.code === 401) {`);
                    script.push(`    console.log("Unauthorized access!");`);
                    script.push(`}`);
                    break;

                case 'POST':
                    script.push(`pm.test("Response is Created", function () {`);
                    script.push(`    pm.response.to.have.status(201);`);
                    script.push(`});`);
                    script.push(`if (pm.response.code === 400) {`);
                    script.push(`    console.log("Bad Request! Check your input.");`);
                    script.push(`}`);
                    break;

                case 'PUT':
                    script.push(`pm.test("Response is OK", function () {`);
                    script.push(`    pm.response.to.have.status(200);`);
                    script.push(`});`);
                    script.push(`if (pm.response.code === 404) {`);
                    script.push(`    console.log("Resource not found!");`);
                    script.push(`}`);
                    break;

                case 'DELETE':
                    script.push(`pm.test("Response is No Content", function () {`);
                    script.push(`    pm.response.to.have.status(204);`);
                    script.push(`});`);
                    script.push(`if (pm.response.code === 404) {`);
                    script.push(`    console.log("Resource not found!");`);
                    script.push(`}`);
                    break;

                default:
                    console.log(`No script added for method: ${method}`);
            }

            item.event = [
                {
                    listen: 'test',
                    script: {
                        type: 'text/javascript',
                        exec: script
                    }
                }
            ];
        }
    });
};

const getCollectionIdByName = async (name) => {
    const response = await axios.get('https://api.getpostman.com/collections', {
        headers: { 'X-Api-Key': postmanApiKey }
    });

    const collection = response.data.collections.find(coll => coll.name === name);
    return collection ? collection.id : null;
};

const getCollection = async (collectionId) => {
    const response = await axios.get(`https://api.getpostman.com/collections/${collectionId}`, {
        headers: { 'X-Api-Key': postmanApiKey }
    });
    return response.data.collection;
};

const updateCollection = async (collectionId, collection) => {
    const options = {
        method: 'PUT',
        url: `https://api.getpostman.com/collections/${collectionId}`,
        headers: {
            'X-Api-Key': postmanApiKey,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ collection })
    };

    await axios(options);
    console.log('Collection successfully updated in Postman.');
};

const main = async () => {
    try {
        const collectionId = await getCollectionIdByName(collectionName);
        if (!collectionId) {
            console.error(`Collection with name "${collectionName}" not found.`);
            return;
        }

        const collection = await getCollection(collectionId);
        addScriptsToRequests(collection.item); // Start with the root items
        await updateCollection(collectionId, collection);
    } catch (error) {
        console.error('Error updating collection:', error.response ? error.response.data : error.message);
    }
};

main();
