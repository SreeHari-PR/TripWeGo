import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const ManagerOtpPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const { state } = useLocation();
    const email = state?.email || '';
    const navigate = useNavigate();

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        if (timer === 0) {
            clearInterval(countdown);
            toast.error('OTP has expired. Please request a new one.');
        }

        return () => clearInterval(countdown);
    }, [timer]);

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) {
            toast.error('Please enter a valid number');
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`).focus();
        }
    };

    const handleOtpVerification = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');
        try {
            const response = await api.post('/manager/manager-otp', { email, otp: otpCode });
            toast.success(response.data.message);
            navigate('/manager/login');
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    const handleResendOtp = async () => {
        try {
            await api.post('/manager/resend-otp', { email });
            setOtp(['', '', '', '', '', '']);
            setTimer(60);
            toast.success('A new OTP has been sent to your email.');
        } catch (error) {
            toast.error('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-100"
             style={{ backgroundImage: `url(/src/assets/blurry-gradient-haikei.svg)` }}>
            <div className="w-full max-w-sm p-8 bg-white bg-opacity-80 shadow-md rounded-lg"
            style={{ backdropFilter: 'blur(100px)' }}>
                <h2 className="text-2xl font-bold text-center mb-6">Enter OTP</h2>
                <form onSubmit={handleOtpVerification}>
                    <div className="flex justify-center mb-4 space-x-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-input-${index}`}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                className="w-10 px-2 py-2 text-center border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                maxLength="1"
                                required
                            />
                        ))}
                    </div>
                    <p className="text-center text-gray-500 mb-4">Time remaining: {timer}s</p>
                    <button
                        type="submit"
                        className={`w-full text-white font-bold py-2 px-4 rounded transition duration-300 ${
                            timer === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        disabled={timer === 0}
                    >
                        {timer > 0 ? 'Verify OTP' : 'OTP Expired'}
                    </button>
                </form>
                {timer === 0 && (
                    <button
                        onClick={handleResendOtp}
                        className="mt-4 w-full text-blue-500 font-bold py-2 px-4 rounded border border-blue-500 hover:bg-blue-500 hover:text-white transition duration-300"
                    >
                        Resend OTP
                    </button>
                )}
            </div>
        </div>
    );
};

export default ManagerOtpPage;
