import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaHotel, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaImage, FaBed, FaCog, FaStar, FaClock, FaCalendarAlt, FaTimes, FaPlus, FaAlignLeft, FaTag } from 'react-icons/fa';
import api from '../../services/api';
import uploadImageToCloudinary from '../../utils/cloudinary';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddHotelForm = ({ onSubmit, onCancel }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
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

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Hotel name is required'),
        description: Yup.string().required('Description is required'),
        category: Yup.string().required('Category is required'),
        location: Yup.object().shape({
            address: Yup.string().required('Address is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            country: Yup.string().required('Country is required'),
        }),
        contactInfo: Yup.object().shape({
            phone: Yup.string().required('Phone number is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            website: Yup.string().url('Invalid URL'),
        }),
        images: Yup.object().shape({
            mainImage: Yup.string().required('Main image is required'),
            gallery: Yup.array().of(Yup.string()),
        }),
        roomTypes: Yup.array().of(
            Yup.object().shape({
                type: Yup.string().required('Room type is required'),
                number: Yup.number().required('Number of rooms is required').positive().integer(),
                price: Yup.number().required('Price is required').positive(),
                maxGuests: Yup.number().required('Max guests is required').positive().integer(),
            })
        ),
        services: Yup.array().of(Yup.string()),
        checkInTime: Yup.string().required('Check-in time is required'),
        checkOutTime: Yup.string().required('Check-out time is required'),
        openingDate: Yup.date().required('Opening date is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const manager = JSON.parse(localStorage.getItem('managerData'));
            if (!manager) {
                console.error('Manager data not found in localStorage');
                return;
            }

            const response = await api.post(`/manager/add-hotel/${manager._id}`, values);
            onSubmit(response.data);
            toast.success('Hotel added successfully!');
            navigate('/manager/hotels');
        } catch (error) {
            console.error('Error adding hotel:', error);
            toast.error('Failed to add hotel');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageUpload = async (e, type, setFieldValue, values) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const uploadResponse = await uploadImageToCloudinary(file);
                const imageUrl = uploadResponse.secure_url;

                if (type === 'main') {
                    setFieldValue('images.mainImage', imageUrl);
                } else {
                    setFieldValue('images.gallery', [...values.images.gallery, imageUrl]);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const renderStep = (values, errors, touched, setFieldValue) => {
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
                                    <Field
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter hotel name"
                                    />
                                </div>
                                <ErrorMessage name="name" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                                <div className="relative">
                                    <FaAlignLeft className="absolute left-3 top-4 text-gray-400" />
                                    <Field
                                        as="textarea"
                                        id="description"
                                        name="description"
                                        rows="5"
                                        className="pl-10 pr-3 py-3 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Hotel description"
                                    />
                                </div>
                                <ErrorMessage name="description" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Field
                                        as="select"
                                        id="category"
                                        name="category"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category._id}>{category.name}</option>
                                        ))}
                                    </Field>
                                </div>
                                <ErrorMessage name="category" component="div" className="text-red-500" />
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
                                <label htmlFor="location.address" className="block text-lg font-medium text-gray-700">Address</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Field
                                        type="text"
                                        name="location.address"
                                        id="location.address"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Street address"
                                    />
                                </div>
                                <ErrorMessage name="location.address" component="div" className="text-red-500" />
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="location.city" className="block text-lg font-medium text-gray-700">City</label>
                                    <Field
                                        type="text"
                                        name="location.city"
                                        id="location.city"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage name="location.city" component="div" className="text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="location.state" className="block text-lg font-medium text-gray-700">State</label>
                                    <Field
                                        type="text"
                                        name="location.state"
                                        id="location.state"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage name="location.state" component="div" className="text-red-500" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="location.country" className="block text-lg font-medium text-gray-700">Country</label>
                                    <Field
                                        type="text"
                                        name="location.country"
                                        id="location.country"
                                        className="pl-3 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <ErrorMessage name="location.country" component="div" className="text-red-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contactInfo.phone" className="block text-lg font-medium text-gray-700">Phone</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Field
                                        type="tel"
                                        name="contactInfo.phone"
                                        id="contactInfo.phone"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Phone number"
                                    />
                                </div>
                                <ErrorMessage name="contactInfo.phone" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contactInfo.email" className="block text-lg font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Field
                                        type="email"
                                        name="contactInfo.email"
                                        id="contactInfo.email"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Email address"
                                    />
                                </div>
                                <ErrorMessage name="contactInfo.email" component="div" className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="contactInfo.website" className="block text-lg font-medium text-gray-700">Website</label>
                                <div className="relative">
                                    <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <Field
                                        type="url"
                                        name="contactInfo.website"
                                        id="contactInfo.website"
                                        className="pl-10 pr-3 py-4 w-full text-lg border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Website URL"
                                    />
                                </div>
                                <ErrorMessage name="contactInfo.website" component="div" className="text-red-500" />
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
                                        {values.images.mainImage ? (
                                            <div>
                                                <img src={values.images.mainImage} alt="Main" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                                <button
                                                    type="button"
                                                    onClick={() => setFieldValue('images.mainImage', '')}
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
                                                        <input id="main-image-upload" name="main-image-upload" type="file" className="sr-only" onChange={(e) => handleImageUpload(e, 'main', setFieldValue, values)} accept="image/*" />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <ErrorMessage name="images.mainImage" component="div" className="text-red-500" />
                            </div>
                            <div>
                                <label className="block text-lg font-medium text-gray-700 mb-2">Gallery Images</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                                    <div className="space-y-1 text-center">
                                        <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="gallery-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                <span>Upload a file</span>
                                                <input id="gallery-image-upload" name="gallery-image-upload" type="file" className="sr-only" onChange={(e) => handleImageUpload(e, 'gallery', setFieldValue, values)} accept="image/*" multiple />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                {values.images.gallery.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img src={image} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                                            onClick={() => {
                                                const newGallery = values.images.gallery.filter((_, i) => i !== index);
                                                setFieldValue('images.gallery', newGallery);
                                            }}
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
                        <FieldArray name="roomTypes">
                            {({ push, remove }) => (
                                <div className="space-y-6">
                                    {values.roomTypes.map((room, index) => (
                                        <div key={index} className="space-y-4">
                                            <div className="grid grid-cols-4 gap-4">
                                                <div>
                                                    <label htmlFor={`roomTypes.${index}.type`} className="block text-sm font-medium text-gray-700">Room Type</label>
                                                    <Field
                                                        type="text"
                                                        name={`roomTypes.${index}.type`}
                                                        className="mt-1 h-12 py-3 px-4 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                                                    />
                                                    <ErrorMessage name={`roomTypes.${index}.type`} component="div" className="text-red-500" />
                                                </div>
                                                <div>
                                                    <label htmlFor={`roomTypes.${index}.number`} className="block text-sm font-medium text-gray-700">Number of Rooms</label>
                                                    <Field
                                                        type="number"
                                                        name={`roomTypes.${index}.number`}
                                                        className="mt-1 h-12 py-3 px-4 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                                                    />
                                                    <ErrorMessage name={`roomTypes.${index}.number`} component="div" className="text-red-500" />
                                                </div>
                                                <div>
                                                    <label htmlFor={`roomTypes.${index}.price`} className="block text-sm font-medium text-gray-700">Price</label>
                                                    <Field
                                                        type="number"
                                                        name={`roomTypes.${index}.price`}
                                                        className="mt-1 h-12 py-3 px-4 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                                                    />
                                                    <ErrorMessage name={`roomTypes.${index}.price`} component="div" className="text-red-500" />
                                                </div>
                                                <div>
                                                    <label htmlFor={`roomTypes.${index}.maxGuests`} className="block text-sm font-medium text-gray-700">Max Guests</label>
                                                    <Field
                                                        type="number"
                                                        name={`roomTypes.${index}.maxGuests`}
                                                        className="mt-1 h-12 py-3 px-4 border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md"
                                                    />
                                                    <ErrorMessage name={`roomTypes.${index}.maxGuests`} component="div" className="text-red-500" />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-900"
                                                onClick={() => remove(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => push({ type: '', number: '', price: '', maxGuests: '' })}
                                    >
                                        <FaPlus className="mr-2" /> Add Room Type
                                    </button>
                                </div>
                            )}
                        </FieldArray>
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
                                                    <Field
                                                        type="checkbox"
                                                        name="services"
                                                        value={service._id}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                                        <Field
                                            type="time"
                                            name="checkInTime"
                                            id="checkInTime"
                                            className="h-12 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full border-2 border-gray-300 rounded-md sm:text-sm"
                                        />
                                    </div>
                                    <ErrorMessage name="checkInTime" component="div" className="text-red-500" />
                                </div>
                                <div className="sm:col-span-3">
                                    <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">Check-out Time</label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaClock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Field
                                            type="time"
                                            name="checkOutTime"
                                            id="checkOutTime"
                                            className="h-12 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full border-2 border-gray-300 rounded-md sm:text-sm"
                                        />
                                    </div>
                                    <ErrorMessage name="checkOutTime" component="div" className="text-red-500" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700">Opening Date</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Field
                                        type="date"
                                        name="openingDate"
                                        id="openingDate"
                                        className="h-12 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full border-2 border-gray-300 rounded-md sm:text-sm"
                                    />
                                </div>
                                <ErrorMessage name="openingDate" component="div" className="text-red-500" />
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Formik
            initialValues={{
                name: '',
                description: '',
                location: { address: '', city: '', state: '', country: '' },
                contactInfo: { phone: '', email: '', website: '' },
                images: { mainImage: '', gallery: [] },
                roomTypes: [],
                services: [],
                category: '',
                rating: 0,
                checkInTime: '',
                checkOutTime: '',
                openingDate: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="space-y-8">
                    {renderStep(values, errors, touched, setFieldValue)}
                    <div className="flex justify-between max-w-3xl mx-auto">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
                            onClick={() => step > 1 ? setStep(step - 1) : onCancel()}
                        >
                            {step > 1 ? 'Previous' : 'Cancel'}
                        </button>
                        {step < 5 ? (
                            <button
                                type="button"
                                className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onClick={() => setStep(step + 1)}
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                disabled={isSubmitting}
                            >
                                <span className="flex items-center">
                                    <FaPlus className="mr-2" />
                                    Submit
                                </span>
                            </button>
                        )}
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default AddHotelForm;