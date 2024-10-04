import React, { useState, useEffect } from 'react';
import { FaHotel, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaImage, FaBed, FaCog, FaStar, FaClock, FaCalendarAlt, FaTimes, FaPlus, FaAlignLeft, FaTag } from 'react-icons/fa';
import api from '../../services/api';
import uploadImageToCloudinary from '../../utils/cloudinary';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddHotelForm = ({ onSubmit, onCancel }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [hotel, setHotel] = useState({
        name: '',
        description: '',
        location: '',
        contactInfo: {
            phone: '',
            email: '',
            website: '',
        },
        images: {
            mainImage: '',
            gallery: []
        },
        roomTypes: [],
        services: [],
        category: '',
        rating: 0,
        checkInTime: '',
        checkOutTime: '',
        openingDate: '',
    });

    const [newRoomType, setNewRoomType] = useState({ type: '', number: '', price: '' });
    const [categories, setCategories] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, servicesResponse] = await Promise.all([
                    api.get('/admin/categories'),
                    api.get('/admin/services'),
                ]);
                setCategories(categoryResponse.data.data);
                setAvailableServices(servicesResponse.data.services);
            } catch (error) {
                console.error('Error fetching categories or services:', error);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotel(prevHotel => ({
            ...prevHotel,
            [name]: value
        }));
    };

    const handleNestedChange = (e, nestedField) => {
        const { name, value } = e.target;
        setHotel(prevHotel => ({
            ...prevHotel,
            [nestedField]: {
                ...prevHotel[nestedField],
                [name]: value
            }
        }));
    };

    const handleAddRoomType = () => {
        setHotel(prevHotel => ({
            ...prevHotel,
            roomTypes: [...prevHotel.roomTypes, newRoomType]
        }));
        setNewRoomType({ type: '', number: '', price: '' });
    };

    const handleImageUpload = async (e, type) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadResponse = await uploadImageToCloudinary(file);
                const imageUrl = uploadResponse.secure_url;

                if (type === 'main') {
                    setHotel(prevHotel => ({
                        ...prevHotel,
                        images: {
                            ...prevHotel.images,
                            mainImage: imageUrl
                        }
                    }));
                } else {
                    setHotel(prevHotel => ({
                        ...prevHotel,
                        images: {
                            ...prevHotel.images,
                            gallery: [...prevHotel.images.gallery, imageUrl]
                        }
                    }));
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleRemoveImage = (index) => {
        setHotel(prevHotel => ({
            ...prevHotel,
            images: {
                ...prevHotel.images,
                gallery: prevHotel.images.gallery.filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const manager = JSON.parse(localStorage.getItem('managerData'));
        console.log(manager._id, 'id');

        if (!manager) {
            console.error('Manager data not found in localStorage');
            return;
        }

        try {
            const response = await api.post(`/manager/add-hotel/${manager._id}`, hotel);

            onSubmit(response.data);
            console.log(response.data, 'hotel added');
            toast.success('Hotel added successfully!');
            navigate('/manager/hotels');
            setHotel({
                name: '',
                description: '',
                location: '',
                contactInfo: {
                    phone: '',
                    email: '',
                    website: '',
                },
                images: {
                    mainImage: '',
                    gallery: [],
                },
                roomTypes: [],
                services: [],
                category: '',
                rating: 0,
                checkInTime: '',
                checkOutTime: '',
                openingDate: '',
            });
        } catch (error) {
            console.error('Error adding hotel:', error);
            toast.error('Failed to add hotel, please try again.',error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Basic Information</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-lg font-medium text-gray-700">Hotel Name</label>
                                <div className="relative">
                                    <FaHotel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter hotel name"
                                        value={hotel.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                                <div className="relative">
                                    <FaAlignLeft className="absolute left-3 top-4 text-gray-400" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows="5"
                                        className="pl-10 pr-3 py-3 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Hotel description"
                                        value={hotel.description}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <select
                                        id="category"
                                        name="category"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={hotel.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Location & Contact</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="address" className="block text-lg font-medium text-gray-700">Address</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                        value={hotel.location.address}
                                        onChange={(e) => handleNestedChange(e, 'location')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="city" className="block text-lg font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        id="city"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={hotel.location.city}
                                        onChange={(e) => handleNestedChange(e, 'location')}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="state" className="block text-lg font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        id="state"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={hotel.location.state}
                                        onChange={(e) => handleNestedChange(e, 'location')}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="country" className="block text-lg font-medium text-gray-700">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        id="country"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={hotel.location.country}
                                        onChange={(e) => handleNestedChange(e, 'location')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-lg font-medium text-gray-700">Phone</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Phone number"
                                        value={hotel.contactInfo.phone}
                                        onChange={(e) => handleNestedChange(e, 'contactInfo')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Email address"
                                        value={hotel.contactInfo.email}
                                        onChange={(e) => handleNestedChange(e, 'contactInfo')}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="website" className="block text-lg font-medium text-gray-700">Website</label>
                                <div className="relative">
                                    <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="url"
                                        name="website"
                                        id="website"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Website URL"
                                        value={hotel.contactInfo.website}
                                        onChange={(e) => handleNestedChange(e, 'contactInfo')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Images</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Main Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        {hotel.images.mainImage ? (
                                            <div>
                                                <img src={hotel.images.mainImage} alt="Main" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={() => setHotel(prevHotel => ({ ...prevHotel, images: { ...prevHotel.images, mainImage: '' } }))}
                                                    className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label htmlFor="main-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                        <span>Upload a file</span>
                                                        <input id="main-image-upload" name="main-image-upload" type="file" className="sr-only" onChange={(e) => handleImageUpload(e, 'main')} accept="image/*" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Gallery Images</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="gallery-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input id="gallery-image-upload" name="gallery-image-upload" type="file" className="sr-only" onChange={(e) => handleImageUpload(e, 'gallery')} accept="image/*" multiple />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {hotel.images.gallery.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Room Types</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">Room Type</label>
                                    <input
                                        type="text"
                                        name="type"
                                        id="roomType"
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newRoomType.type}
                                        onChange={(e) => setNewRoomType({...newRoomType, type: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Number of Rooms</label>
                                    <input
                                        type="number"
                                        name="number"
                                        id="roomNumber"
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newRoomType.number}
                                        onChange={(e) => setNewRoomType({...newRoomType, number: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="roomPrice" className="block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="roomPrice"
                                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                        value={newRoomType.price}
                                        onChange={(e) => setNewRoomType({...newRoomType, price: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={handleAddRoomType}
                            >
                                <FaPlus className="mr-2" /> Add Room Type
                            </button>
                            <div className="mt-4">
                                <h3 className="text-lg font-medium text-gray-900">Added Room Types</h3>
                                <div className="mt-2 border-t border-gray-200">
                                    {hotel.roomTypes.map((room, index) => (
                                        <div key={index} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{room.type}</p>
                                                <p className="text-sm text-gray-500">{room.number} rooms, ${room.price} per night</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => {
                                                    const newRoomTypes = hotel.roomTypes.filter((_, i) => i !== index);
                                                    setHotel(prevHotel => ({...prevHotel, roomTypes: newRoomTypes}));
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Services & Details</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Services</label>
                                <div className="mt-2 space-y-2">
                                    {availableServices.length > 0 ? (
                                        availableServices.map(service => (
                                            service._id && service.name && (
                                                <div key={service._id} className="flex items-center">
                                                    <input
                                                        id={service._id}
                                                        name="services"
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        checked={hotel.services.includes(service._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setHotel(prevHotel => ({
                                                                    ...prevHotel,
                                                                    services: [...prevHotel.services, service._id]
                                                                }));
                                                            } else {
                                                                setHotel(prevHotel => ({
                                                                    ...prevHotel,
                                                                    services: prevHotel.services.filter(id => id !== service._id)
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={service._id} className="ml-2 block text-sm text-gray-900">
                                                        {service.name}
                                                    </label>
                                                </div>
                                            )
                                        ))
                                    ) : (
                                        <p>No services available</p>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">Check-in Time</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaClock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            name="checkInTime"
                                            id="checkInTime"
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                            value={hotel.checkInTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">Check-out Time</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaClock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            name="checkOutTime"
                                            id="checkOutTime"
                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                            value={hotel.checkOutTime}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700">Opening Date</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        name="openingDate"
                                        id="openingDate"
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                        value={hotel.openingDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            <div className="flex justify-between max-w-3xl mx-auto">
                <button
                    type="button"
                    className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                    onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
                >
                    {step > 1 ? 'Previous' : 'Cancel'}
                </button>
                <button
                    type={step === 5 ? 'submit' : 'button'}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={() => step < 5 && setStep(step + 1)}
                >
                    {step === 5 ?
                        <span className="flex items-center">
                            <FaPlus className="mr-2" />
                            Submit
                        </span> :
                        'Next'
                    }
                </button>
            </div>
        </form>
    );
};

export default AddHotelForm;