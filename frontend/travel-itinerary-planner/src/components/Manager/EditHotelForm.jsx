import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Hotel, MapPin, Phone, Mail, Globe,Users, Image, Bed, Settings, Star, Clock, Calendar, X, Plus, AlignLeft, Tag } from 'lucide-react';
import api from '../../services/api';
import uploadImageToCloudinary from '../../utils/cloudinary';
import { toast } from 'react-hot-toast';
import { Navbar } from './ManagerNavbar';
import { Sidebar } from './ManagerSidebar';

const EditHotelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    category: '',
    location: { address: '', city: '', state: '', country: '' },
    contactInfo: { phone: '', email: '', website: '' },
    images: { mainImage: '', gallery: [] },
    roomTypes: [],
    services: [],
    checkInTime: '',
    checkOutTime: '',
    openingDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, servicesResponse, hotelResponse] = await Promise.all([
          api.get('/admin/categories'),
          api.get('/admin/services'),
          api.get(`/manager/hotels/${id}`),
        ]);

        setCategories(categoryResponse.data.data);
        setAvailableServices(servicesResponse.data.services);

        const hotelData = hotelResponse.data.hotel;
        setInitialValues({
          ...hotelData,
          category: hotelData.category,
          openingDate: hotelData.openingDate.split('T')[0],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load hotel data');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
      await api.put(`/manager/hotels/edit/${id}`, values);
      toast.success('Hotel updated successfully!');
      navigate('/manager/hotels');
    } catch (error) {
      console.error('Error updating hotel:', error);
      toast.error('Failed to update hotel');
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
        toast.error('Failed to upload image');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#00246B]"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-[#00246B] flex items-center">
              <Hotel className="mr-2" /> Edit Hotel
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                <Form className="space-y-8">
                  <FormSection title="Basic Information" icon={<AlignLeft />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Hotel Name" name="name" icon={<Hotel size={18} />} />
                      <FormField label="Category" name="category" as="select" icon={<Tag size={18} />}>
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </FormField>
                    </div>
                    <FormField label="Description" name="description" as="textarea" rows="4" icon={<AlignLeft size={18} />} />
                  </FormSection>

                  <FormSection title="Location" icon={<MapPin />}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField label="Address" name="location.address" icon={<MapPin size={18} />} />
                      <FormField label="City" name="location.city" icon={<MapPin size={18} />} />
                      <FormField label="State" name="location.state" icon={<MapPin size={18} />} />
                      <FormField label="Country" name="location.country" icon={<MapPin size={18} />} />
                    </div>
                  </FormSection>

                  <FormSection title="Contact Information" icon={<Phone />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField label="Phone" name="contactInfo.phone" type="tel" icon={<Phone size={18} />} />
                      <FormField label="Email" name="contactInfo.email" type="email" icon={<Mail size={18} />} />
                      <FormField label="Website" name="contactInfo.website" type="url" icon={<Globe size={18} />} />
                    </div>
                  </FormSection>

                  <FormSection title="Images" icon={<Image />}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Main Image</label>
                        {values.images.mainImage && (
                          <img
                            src={values.images.mainImage}
                            alt="Main"
                            className="h-32 w-32 object-cover rounded-md mt-2"
                          />
                        )}
                        <input
                          type="file"
                          onChange={(e) => handleImageUpload(e, 'main', setFieldValue, values)}
                          className="mt-2 block text-sm"
                        />
                        <ErrorMessage name="images.mainImage" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Gallery Images</label>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleImageUpload(e, 'gallery', setFieldValue, values)}
                          className="mt-2 block text-sm"
                        />
                        <div className="flex flex-wrap gap-4 mt-2">
                          {values.images.gallery.map((image, index) => (
                            <div key={index} className="relative">
                              <img src={image} alt={`Gallery ${index + 1}`} className="h-32 w-32 object-cover rounded-md" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedGallery = values.images.gallery.filter((_, i) => i !== index);
                                  setFieldValue('images.gallery', updatedGallery);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  <FormSection title="Room Types" icon={<Bed />}>
                    <FieldArray name="roomTypes">
                      {({ remove, push }) => (
                        <div>
                          {values.roomTypes.map((room, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4">
                              <FormField label="Type" name={`roomTypes.${index}.type`} icon={<Bed size={18} />} />
                              <FormField label="Number" name={`roomTypes.${index}.number`} type="number" icon={<Bed size={18} />} />
                              <FormField label="Price" name={`roomTypes.${index}.price`} type="number" icon={<Star size={18} />} />
                              <FormField label="Max Guests" name={`roomTypes.${index}.maxGuests`} type="number" icon={<Users size={18} />} />
                              <button type="button" onClick={() => remove(index)} className="text-red-500 mt-8">
                                <X size={20} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => push({ type: '', number: '', price: '', maxGuests: '' })}
                            className="flex items-center text-blue-500"
                          >
                            <Plus size={20} className="mr-1" /> Add Room Type
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </FormSection>

                  <FormSection title="Services" icon={<Settings />}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {availableServices.map(service => (
                        <div key={service._id} className="flex items-center">
                          <Field
                            type="checkbox"
                            name="services"
                            value={service._id}
                            id={`service-${service._id}`}
                            className="h-4 w-4 text-[#00246B] focus:ring-[#00246B] border-gray-300 rounded"
                          />
                          <label htmlFor={`service-${service._id}`} className="ml-2 block text-sm text-gray-900">
                            {service.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  <FormSection title="Additional Details" icon={<Clock />}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField label="Check-in Time" name="checkInTime" type="time" icon={<Clock size={18} />} />
                      <FormField label="Check-out Time" name="checkOutTime" type="time" icon={<Clock size={18} />} />
                      <FormField label="Opening Date" name="openingDate" type="date" icon={<Calendar size={18} />} />
                    </div>
                  </FormSection>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/manager/hotels')}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00246B]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-[#00246B] text-white rounded-md shadow-sm text-sm font-medium hover:bg-[#001a56] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00246B]"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Hotel'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormSection = ({ title, icon, children}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold mb-4 text-[#00246B] flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

const FormField = ({ label, name, icon, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </label>
    <Field
      name={name}
      id={name}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#00246B] focus:ring focus:ring-[#00246B] focus:ring-opacity-50"
      {...props}
    />
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default EditHotelForm;