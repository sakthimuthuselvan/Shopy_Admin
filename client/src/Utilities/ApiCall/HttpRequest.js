import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL;
console.log(baseUrl);

const HttpRequest = async ({ method, url, data }) => {
  try {
    const token = localStorage.getItem('Auth');
    const response = await axios({
      method: method,
      url: `${url}`, // Assuming you want to use the base URL
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Handle successful response here
    return response.data;
  } catch (error) {
    // Handle error here
    throw new Error(`API call failed: ${error.message}`);
  }
};

export default HttpRequest;

