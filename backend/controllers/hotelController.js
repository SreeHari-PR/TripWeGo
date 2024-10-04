// src/controllers/hotelController.js
const hotelService = require('../services/hotelService');

class HotelController {

  async addHotel(req, res) {
    try {
        const managerId = req.params.id; ; 
        console.log(managerId);

        const hotelData = req.body; 
        console.log(hotelData, 'hotelData');
         const imageUrls = hotelData.images.gallery;
         const mainImageUrl = hotelData.images.mainImage
         console.log(imageUrls,'url')
        const hotel = await hotelService.addHotel(managerId, hotelData, { mainImageUrl, imageUrls });

        console.log(hotel, 'hotel added successfully');
        
        return res.status(201).json({ 
            success: true, 
            message: 'Hotel added successfully', 
            hotel 
        });
    } catch (error) {
        return res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
}

          async listHotelsByManager(req, res) {
            try {
              const { managerId } = req.query; 
              console.log(req.query, 'managerId'); 
              
              const hotels = await hotelService.listHotelsByManager(managerId); 
              
              console.log('Hotels found:', hotels); 
              
              res.status(200).json({
                success: true,
                hotels
              });
            } catch (error) {
              res.status(500).json({
                success: false,
                message: 'Error retrieving hotels',
                error: error.message
              });
            }
          }
          async listAllHotels(req, res) {
            try {
              const hotels = await hotelService.getAllHotels();
              return res.status(200).json({
                success: true,
                data: hotels,
              });
            } catch (error) {
              console.error('Error in listAllHotels:', error);
              return res.status(500).json({
                success: false,
                message: 'Internal server error',
              });
            }
          }
          

}

module.exports = new HotelController();
