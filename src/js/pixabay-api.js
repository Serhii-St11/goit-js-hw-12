import axios from 'axios';

const API_KEY = '48273620-0132f44a126025621a132d295';
const BASE_URL = 'https://pixabay.com/api/';

export const fetchImages = async (query, page, perPage) => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
    page,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  return response.data;
};
