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
          async searchHotels(req, res) {
            console.log('gsjhdgfj');
            
            const { location } = req.query;
            console.log(req.query,'location')
        
            try {
              const hotels = await hotelService.searchHotels(location);
              console.log(hotels,'searched');
              
              return res.status(200).json(hotels);
            } catch (error) {
              return res.status(500).json({ error: error.message });
            }
          }
          async getHotel(req, res) {
            const hotelId = req.params.id;
    
            try {
                const hotel = await hotelService.getSingleHotelPage(hotelId);
                const serviceNames = hotel.services.map(service => service.name);
                console.log(serviceNames)
                res.status(200).json({
                    success: true,
                    hotel: {
                      ...hotel.toObject(),
                      services: serviceNames 
                    }
                });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }
          

}

module.exports = new HotelController();
