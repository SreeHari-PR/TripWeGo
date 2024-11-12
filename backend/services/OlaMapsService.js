// src/services/OlaMapsService.js
const OlaMapsRepository = require('../repositories/OlaMapsRepository');

class OlaMapsService {
  constructor() {
    this.olaMapsRepository = new OlaMapsRepository();
  }

  async autocompleteLocation(query) {
    return await this.olaMapsRepository.autocomplete(query);
  }

  async reverseGeocodeLocation(lat, lng) {
    return await this.olaMapsRepository.reverseGeocode(lat, lng);
  }

  async getDirections(origin, destination) {
    return await this.olaMapsRepository.getDirections(origin, destination);
  }
}

module.exports = OlaMapsService;
