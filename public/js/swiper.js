/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const roomsSwiper = new Swiper('.rooms-swiper', {
  spaceBetween: 20,
  centeredSlides: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});

const featureSwiper = new Swiper('.feature-swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  autoplay: {
    delay: 5000,
  },

  // If we need pagination
  pagination: {
    el: '.feature-swiper-pagination',
    clickable: true,
  },
});

const foodSwiper = new Swiper('.food-swiper', {
  spaceBetween: 20,
  grid: {
    fill: 'row',
    rows: 3,
  },
  navigation: {
    nextEl: '.food-swiper__button--next',
    prevEl: '.food-swiper__button--prev',
  },
});

const foodImageSwiper = new Swiper('.food-images-swiper', {
  // Optional parameters
  direction: 'horizontal',
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 16,
  loop: true,
  autoplay: {
    delay: 5000,
  },

  // If we need pagination
  pagination: {
    el: '.food-images-swiper-pagination',
    clickable: true,
  },
});

const factsSwiper = new Swiper('.facts-swiper', {
  // Optional parameters
  direction: 'horizontal',
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 16,
  loop: true,
  autoplay: {
    delay: 5000,
  },

  // If we need pagination
  pagination: {
    el: '.facts-images-swiper-pagination',
    clickable: true,
  },
});

const roomsPageSwiper = new Swiper('.rooms-page-swiper', {
  spaceBetween: 24,
  grid: {
    fill: 'row',
    rows: 6,
  },
  pagination: {
    el: '.rooms-page-swiper-pagination',
    clickable: true,
    renderBullet(index) {
      return `<span class="swiper-pagination-bullet swiper-pagination-bullet--square">${index + 1}</span>`;
    },
  },
  navigation: {
    nextEl: '.rooms-page-swiper__button--next',
    prevEl: '.rooms-page-swiper__button--prev',
  },
});
