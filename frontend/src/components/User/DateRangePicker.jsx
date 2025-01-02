import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const DateRangePicker = ({ onDateChange }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FaCalendarAlt className="text-gray-600" />
        <span className="font-semibold">Select Dates</span>
      </div>
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
          onDateChange(update);
        }}
        isClearable={true}
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholderText="Select check-in and check-out dates"
      />
    </div>
  );
};

export default DateRangePicker;