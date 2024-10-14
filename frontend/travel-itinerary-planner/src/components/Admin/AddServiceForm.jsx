import React from 'react';
import { useFormik } from 'formik';
import * as Icons from 'react-icons/fa';
import * as Yup from 'yup';
import api from '../../services/api';

const AddServiceForm = ({ onAddService }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      icon: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Service name is required'),
      description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
      icon: Yup.string().required('Please select an icon'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        const response = await api.post('/admin/add-service', {
          name: values.name,
          description: values.description,
          icon: values.icon,
        });

        onAddService(response.data.service);
        resetForm();
      } catch (error) {
        console.error('Error adding service:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Service Name
        </label>
        <input
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            formik.touched.name && formik.errors.name ? 'border-red-500' : ''
          }`}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          {...formik.getFieldProps('description')}
          className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            formik.touched.description && formik.errors.description ? 'border-red-500' : ''
          }`}
          rows="3"
        ></textarea>
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="icon" className="block text-sm font-medium text-gray-700">
          Icon
        </label>
        <select
          id="icon"
          {...formik.getFieldProps('icon')}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
            formik.touched.icon && formik.errors.icon ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select an icon</option>
          {Object.keys(Icons).map((iconName) => (
            <option key={iconName} value={iconName}>
              {iconName}
            </option>
          ))}
        </select>
        {formik.touched.icon && formik.errors.icon ? (
          <div className="text-red-500 text-sm mt-1">{formik.errors.icon}</div>
        ) : null}
      </div>

      <button
        type="submit"
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          formik.isSubmitting ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Adding...' : 'Add Service'}
      </button>
    </form>
  );
};

export default AddServiceForm;
