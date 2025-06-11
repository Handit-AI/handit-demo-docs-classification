import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for large files
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Classify a document using the backend API
 * @param {File} file - The file to upload (optional)
 * @param {string} url - The URL to process (optional)
 * @returns {Promise} API response
 */
export const classifyDocument = async (file = null, url = null) => {
  try {
    if (!file && !url) {
      throw new Error('Either file or URL must be provided');
    }

    let response;

    if (file) {
      // Handle file upload
      const formData = new FormData();
      formData.append('document', file);

      response = await apiClient.post('/api/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Progress tracking for file uploads
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${progress}%`);
        },
      });
    } else {
      // Handle URL processing
      response = await apiClient.post('/api/process-document', {
        url: url,
      });
    }

    return response.data;
  } catch (error) {
    console.error('Error classifying document:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      throw new Error(
        error.response.data?.details || 
        error.response.data?.error || 
        'Server error occurred'
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error(
        'Cannot connect to the server. Please make sure the backend is running on port 3000.'
      );
    } else {
      // Something else went wrong
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

/**
 * Get server health status
 * @returns {Promise} Health status
 */
export const getHealthStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking server health:', error);
    throw new Error('Server is not responding');
  }
};

/**
 * Get system information
 * @returns {Promise} System info including supported file types
 */
export const getSystemInfo = async () => {
  try {
    const response = await apiClient.get('/api/info');
    return response.data;
  } catch (error) {
    console.error('Error getting system info:', error);
    throw new Error('Cannot get system information');
  }
};

/**
 * Test backend connection
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const testConnection = async () => {
  try {
    await getHealthStatus();
    return true;
  } catch (error) {
    return false;
  }
}; 