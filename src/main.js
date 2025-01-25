import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchFormEl = document.querySelector('.js-search-form');
const galleryEl = document.querySelector('.js-gallery');
const loaderEl = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.js-load-more');
loadMoreBtn.hidden = true;

const lightbox = new SimpleLightbox('.js-gallery a');
let query = '';
let page = 1;
const perPage = 15;

const showLoader = () => (loaderEl.hidden = false);
const hideLoader = () => (loaderEl.hidden = true);

const fetchAndRenderImages = async () => {
  try {
    showLoader();
    const data = await fetchImages(query, page, perPage);
    if (data.hits.length === 0 && page === 1) {
      iziToast.warning({
        title: 'No Results',
        message: 'No images found. Try a different query.',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    renderGallery(data.hits, galleryEl);
    lightbox.refresh();

    if (page * perPage >= data.totalHits) {
      loadMoreBtn.hidden = true;
      iziToast.info({
        title: 'End of Results',
        message: "You've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
    } else {
      loadMoreBtn.hidden = false;
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
      timeout: 3000,
    });
    console.error(error);
  } finally {
    hideLoader();
  }
};

const onSearch = async event => {
  event.preventDefault();
  galleryEl.innerHTML = '';
  query = event.target.elements.user_query.value.trim();
  page = 1;
  loadMoreBtn.hidden = true;

  if (!query) {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  await fetchAndRenderImages();
};

const onLoadMore = async () => {
  page += 1;
  await fetchAndRenderImages();

  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchFormEl.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
