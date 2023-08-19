const axios = require('axios');

const API_KEY = 'YCIL9OuyxhhXMvzEfCzRgh1OBVPrwcfXTCIXgD6Aes9w13Flgi';
const API_SECRET = 'ZOg0BgCBiYFQ23PRn5IimA9Erauum8CbW51Yn6JD';

const baseURL = 'https://api.petfinder.com/v2';

const adoptableArray = []
// Authenticate and get an access token
async function getAccessToken() {
  const response = await axios.post(`${baseURL}/oauth2/token`, {
    grant_type: 'client_credentials',
    client_id: API_KEY,
    client_secret: API_SECRET
  });

  return response.data.access_token;
}

// Fetch pets by organization ID
async function getPetsByOrganization(organizationId) {
  const accessToken = await getAccessToken();

  const response = await axios.get(`${baseURL}/animals`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: {
      organization: organizationId
    }
  });

  return response.data.animals;
	console.log(response.data.animals)
	adoptableArray.push(response.data.animals);
}

module.exports = {
	adoptableArray,
  getPetsByOrganization
};
