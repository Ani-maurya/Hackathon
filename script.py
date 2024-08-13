import requests
import json

# Postman API key
postman_api_key = 'your_postman_api_key'

# Read the Postman collection JSON file
with open('postman-collection.json', 'r') as file:
    postman_collection = json.load(file)

# Function to add test scripts to requests
def add_test_scripts(item):
    script = '''
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

if (pm.request.method === 'POST') {
    pm.test("Content-Type header is present", function () {
        pm.expect(pm.response.headers.has('Content-Type')).to.be.true;
    });
}
'''
    if 'event' not in item:
        item['event'] = []
    
    item['event'].append({
        'listen': 'test',
        'script': {
            'type': 'text/javascript',
            'exec': script.split('\n')
        }
    })
    return item

# Recursive function to traverse items and add scripts
def traverse_items(items):
    for item in items:
        if 'item' in item:
            traverse_items(item['item'])
        else:
            item = add_test_scripts(item)

# Add scripts to each request in the collection
traverse_items(postman_collection['item'])

# Postman API endpoint for updating collections
url = f'https://api.getpostman.com/collections/{postman_collection["info"]["_postman_id"]}'

# Headers for the API request
headers = {
    'X-Api-Key': postman_api_key,
    'Content-Type': 'application/json'
}

# Update the collection with the new scripts
response = requests.put(url, headers=headers, data=json.dumps({'collection': postman_collection}))

if response.status_code == 200:
    print('Collection updated successfully with test scripts.')
else:
    print('Error updating collection:', response.text)
