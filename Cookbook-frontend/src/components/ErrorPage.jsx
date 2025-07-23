import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ code = 'Error', message = 'Something went wrong.' }) => {
  const navigate = useNavigate();
  const isNetworkError = code === 'Network Error' || message === 'Network Error';
  return (
    <div className="error-page-container">
      <h1 className="error-page-heading">{code}</h1>
      <p className="error-page-message" style={{ marginBottom: isNetworkError ? '1.5em' : '2em' }}>{message}</p>
      {isNetworkError ? (
        <div className="error-page-maintenance">
          <span role="img" aria-label="maintenance">🚧</span> The site is currently under maintenance or the server is unreachable.<br />
          Please try again later. <span role="img" aria-label="wrench">🔧</span>
        </div>
      ) : (
        <button
          className="error-page-btn"
          onClick={() => navigate('/')}
        >
          Go to Home
        </button>
      )}
    </div>
  );
};

export default ErrorPage; 