// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader';

// Route components
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';
import ManagerRoutes from './routes/ManagerRoutes';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Loader isLoading={isLoading}>
          <Toaster position="top-center" reverseOrder={false} />
          <UserRoutes />
          <AdminRoutes />
          <ManagerRoutes />
        </Loader>
      </Router>
    </Provider>
  );
};

export default App;
