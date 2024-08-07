import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;

console.log(baseUrl);
const HttpRequest = async ({ method, url, data }) => {
  
  try {
    const token = localStorage.getItem('_Auth');
    const response = await axios({
      method: method,
      url: `http://127.0.0.1:4000/${url}`, // Assuming you want to use the base URL
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': "application/json",
      },
    });

    // Handle successful response here
    return response.data;
  } catch (error) {
    // Handle error here
    throw error.response.data;
  }
};

export default HttpRequest;

