// src/controllers/hotelController.js
const hotelService = require('../services/hotelService');
const hotelRepository=require('../repositories/hotelRepository')
const HttpStatusCodes=require('../utils/httpStatusCodes')

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
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ 
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
              
              res.status(HttpStatusCodes.OK).json({
                success: true,
                hotels
              });
            } catch (error) {
              res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error retrieving hotels',
                error: error.message
              });
            }
          }
          async listAllHotels(req, res) {
            try {
              const hotels = await hotelService.getAllHotels();
              return res.status(HttpStatusCodes.OK).json({
                success: true,
                data: hotels,
              });
            } catch (error) {
              console.error('Error in listAllHotels:', error);
              return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal server error',
              });
            }
          }
          async searchHotels(req, res) {
            const { searchTerm, checkInDate, checkOutDate, guestCount } = req.query;
        
            try {
                const hotels = await hotelService.searchHotels({
                    searchTerm: searchTerm || undefined,
                    checkInDate: checkInDate || undefined,
                    checkOutDate: checkOutDate || undefined,
                    guestCount: guestCount ? parseInt(guestCount, 10) : undefined
                });
                return res.status(HttpStatusCodes.OK).json(hotels);
            } catch (error) {
                return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
            }
        }
          async getHotel(req, res) {
            const hotelId = req.params.id;
            console.log(hotelId);
            
    
            try {
                const hotel = await hotelService.getSingleHotelPage(hotelId);
                const serviceNames = hotel.services.map(service => service.name);
                console.log(serviceNames)
                res.status(HttpStatusCodes.OK).json({
                    success: true,
                    hotel: {
                      ...hotel.toObject(),
                      services: serviceNames 
                    }
                });
            } catch (error) {
                res.status(HttpStatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: error.message
                });
            }
        }
        async editHotel(req, res) {
          try {
            console.log('working.');
            
            const hotelId = req.params.id;
            const hotelData = req.body;
            const updatedHotel = await hotelService.editHotel(hotelId, hotelData);
      
            return res.status(HttpStatusCodes.OK).json({
              success: true,
              message: 'Hotel updated successfully',
              hotel: updatedHotel
            });
          } catch (error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              success: false,
              message: error.message
            });
          }
        }
      
        // List a hotel (make it publicly available)
        async listHotel(req, res) {
          try {
            const hotelId = req.params.id;
            const listedHotel = await hotelService.updateListingStatus(hotelId, true);
      
            return res.status(HttpStatusCodes.OK).json({
              success: true,
              message: 'Hotel listed successfully',
              hotel: listedHotel
            });
          } catch (error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              success: false,
              message: error.message
            });
          }
        }
      
        // Unlist a hotel (hide it from public)
        async unlistHotel(req, res) {
          try {
            const hotelId = req.params.id;
            const unlistedHotel = await hotelService.updateListingStatus(hotelId, false);
      
            return res.status(HttpStatusCodes.OK).json({
              success: true,
              message: 'Hotel unlisted successfully',
              hotel: unlistedHotel
            });
          } catch (error) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              success: false,
              message: error.message
            });
          }
        }
        async addReview(req, res) {
          const { hotelId } = req.params;
          const {rating, comment } = req.body;
          const userId=req.user._id
        
          try {
            if (!rating || rating < 0 || rating > 5) {
              return res.status(HttpStatusCodes.BAD_REQUEST).json({ message: 'Rating must be between 0 and 5' });
            }
        
            const response = await hotelRepository.addReviewToHotel(hotelId, userId, rating, comment);
        
            return res.status(HttpStatusCodes.OK).json(response);
          } catch (error) {
            console.error('Error adding review:', error);
            return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
          }
        };
        async  getHotelReviews (req, res){
          const { hotelId } = req.params;
        
          try {
            const reviews = await hotelService.fetchHotelReviews(hotelId);
            res.status(HttpStatusCodes.OK).json({ success: true, reviews });
          } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
          }
        };
          

}

module.exports = new HotelController();
