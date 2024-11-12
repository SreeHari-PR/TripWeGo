// src/repositories/OlaMapsRepository.js
const { OlaMapsSDK } = require('ola-maps-node-sdk');

class OlaMapsRepository {
  constructor() {
    this.olaMaps = new OlaMapsSDK({
      clientId: '1424b62b-626d-4efc-b64c-b6ed365be07f',
      clientSecret: 'd7tatn2n8Au5cPpJw2n1LszkmO88mXoh',
    });
  }

  async autocomplete(query) {
    try {
      const response = await this.olaMaps.Places.autocomplete(query);
      return response;
    } catch (error) {
      console.error('Error with autocomplete in OlaMapsRepository:', error);
      throw new Error('Failed to fetch autocomplete data');
    }
  }

  // Reverse Geocoding method
  async reverseGeocode(lat, lng) {
    try {
      const response = await this.olaMaps.Places.reverseGeocode(lat, lng);
      return response;
    } catch (error) {
      console.error('Error with reverseGeocode in OlaMapsRepository:', error);
      throw new Error('Failed to fetch reverse geocoding data');
    }
  }

  // Directions method
  async getDirections(origin, destination) {
    try {
      const response = await this.olaMaps.Routing.directions({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
      });
      return response;
    } catch (error) {
      console.error('Error with getDirections in OlaMapsRepository:', error);
      throw new Error('Failed to fetch directions');
    }
  }
}

module.exports = OlaMapsRepository;
