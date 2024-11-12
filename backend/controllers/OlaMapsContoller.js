// src/controllers/OlaMapsController.js
const OlaMapsService = require('../services/OlaMapsService');
const olaMapsService = new OlaMapsService();

exports.autocomplete = async (req, res) => {
  const { query } = req.query;
  try {
    const data = await olaMapsService.autocompleteLocation(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reverseGeocode = async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const data = await olaMapsService.reverseGeocodeLocation(lat, lng);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDirections = async (req, res) => {
  const { origin, destination } = req.body;
  try {
    const data = await olaMapsService.getDirections(origin, destination);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
