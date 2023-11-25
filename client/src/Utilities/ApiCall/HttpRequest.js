import axios from 'axios';

const baseUrl = process.env.REACT_APP_BASE_URL
console.log(baseUrl);
export default function HttpRequest({method, url, data}) {
  let token = localStorage.getItem("Auth")
    return axios({
        method: method,
        url: baseUrl+url,
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // Handle successful response here
        return response.data;
      })
      .catch(error => {
        // Handle error here
        throw new Error(`API call failed: ${error.message}`);
      });
}
