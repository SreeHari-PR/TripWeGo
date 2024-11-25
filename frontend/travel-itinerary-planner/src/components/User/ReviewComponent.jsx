import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewComponent = ({ hotelId, reviews, onAddReview }) => {
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  console.log(reviews,'hasdh')
  const handleRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setNewReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      alert('Please select a rating');
      return;
    }
    onAddReview({
      userName: 'Anonymous', // Replace with actual user name if available
      ...newReview,
    });
    setNewReview({ rating: 0, comment: '' });
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      <div className="mb-6">
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Rating
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`mr-1 ${
                    star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="comment"
            >
              Your Review
            </label>
            <textarea
              id="comment"
              rows={4}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newReview.comment}
              onChange={handleCommentChange}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit Review
          </button>
        </form>
      </div>
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">
                  {review.userName || 'Anonymous'}
                </span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{review.comment}</p>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        ) : (
          <p>No reviews available yet. Be the first to add one!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewComponent;
