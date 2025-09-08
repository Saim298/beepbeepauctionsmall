"use strict";
document.addEventListener("DOMContentLoaded", function () {

    $(function ($) {

      /* select two init */
      $(".select-two").select2({
        allowClear: true
      });
      $('.single-select').on('click', function () {
        const singleSelect = $('.select2-container--open');
        var selectType = $(this).attr('class').split(' ')[0];
        $(singleSelect[1]).addClass(selectType);
        const computedStyle = window.getComputedStyle(this);
        const width = computedStyle.width;
        $(singleSelect[1]).find('.select2-dropdown').css('right', '-'+(width));
      });
      $('.single-select-auto').on('click', function () {
        const singleSelect = $('.select2-container--open');
        var selectType = $(this).attr('class').split(' ')[0];
        $(singleSelect[1]).addClass(selectType);
      });

      /* Splitting init */
      Splitting();

      // editor init
      let existEditor = document.querySelector('#editor');
      if(existEditor){
        const quill = new Quill('#editor', {
          theme: 'snow',
          placeholder: 'Type your text here...'
        });
      }

      // Initialize the price range slider
      $('.timepicker').timepicker({
        timeFormat: "hh:mm tt",
        interval: 30,
        dynamic: false,
        dropdown: true,
        scrollbar: true,
        }).on('change', function() {
          const formattedTime = $(this).val().toLowerCase();
          if (formattedTime.includes('am')) {
            $(this).closest('.input-area').find('.anti').addClass('active');
            $(this).closest('.input-area').find('.post').removeClass('active');
          } else if (formattedTime.includes('pm')) {
            $(this).closest('.input-area').find('.post').addClass('active');
            $(this).closest('.input-area').find('.anti').removeClass('active');
          }
      });
    
      /* datepicker init */
      $(".datepicker").datepicker();

      // vehicles
      let vehiclesCarousel = document.querySelector('.vehicles-carousel');
      if(vehiclesCarousel){
        const swiper = new Swiper(vehiclesCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: vehiclesCarousel.closest('section').querySelector('.ara-next'),
            prevEl: vehiclesCarousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 4.2,
            },
            1600: {
                slidesPerView: 3.6,
            },
            1200: {
                slidesPerView: 2.9,
            },
            992: {
                slidesPerView: 2.4,
            },
            768: {
                slidesPerView: 2.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }

      // trending
      let trendingCarousel = document.querySelector('.trending-carousel');
      if(trendingCarousel){
        const swiper = new Swiper(trendingCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: trendingCarousel.closest('section').querySelector('.ara-next'),
            prevEl: trendingCarousel.closest('section').querySelector('.ara-prev'),
          },
          pagination: {
            el: trendingCarousel.closest('section').querySelector('.slider-pagination'),
            clickable: true,
          },
          breakpoints: {
            1700: {
                slidesPerView: 6,
                centeredSlides: false,
            },
            1600: {
                slidesPerView: 5.6,
            },
            1200: {
                slidesPerView: 4.9,
            },
            992: {
                slidesPerView: 3.4,
            },
            768: {
                slidesPerView: 3.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }

      // vehicles
      let vehiclesDetails = document.querySelector('.vehicles-details');
      if(vehiclesDetails){
        const swiper = new Swiper(vehiclesDetails, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: vehiclesDetails.closest('section').querySelector('.ara-next'),
            prevEl: vehiclesDetails.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 2.2,
            },
            1600: {
                slidesPerView: 2.6,
            },
            1200: {
                slidesPerView: 2.9,
            },
            992: {
                slidesPerView: 2.4,
            },
            768: {
                slidesPerView: 2.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }
      
      // team
      let teamCarousel = document.querySelector('.team-carousel');
      if(teamCarousel){
        const swiper = new Swiper(teamCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: teamCarousel.closest('section').querySelector('.ara-next'),
            prevEl: teamCarousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 4.2,
            },
            1600: {
                slidesPerView: 3.6,
            },
            1200: {
                slidesPerView: 2.9,
            },
            992: {
                slidesPerView: 2.4,
            },
            768: {
                slidesPerView: 2.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }
      
      // newProduct
      let newProductCarousel = document.querySelector('.new-product-carousel');
      if(newProductCarousel){
        const swiper = new Swiper(newProductCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: newProductCarousel.closest('section').querySelector('.ara-next'),
            prevEl: newProductCarousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 3.0,
            },
            1650: {
                slidesPerView: 2.6,
            },
            1200: {
                slidesPerView: 2.2,
            },
            992: {
                slidesPerView: 1.8,
            },
            768: {
                slidesPerView: 1.6,
            },
            480: {
                slidesPerView: 1.4,
            },
          },
        });
      }
      
      // specialOffers
      let specialOffersCarousels = document.querySelectorAll('.special-offers-carousel');
      specialOffersCarousels.forEach((carousel) => {
        const swiper = new Swiper(carousel, {
          loop: true,
          centeredSlides: false,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: carousel.closest('section').querySelector('.ara-next'),
            prevEl: carousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
              slidesPerView: 4.0,
            },
            1650: {
              slidesPerView: 2.8,
            },
            1200: {
              slidesPerView: 2.6,
              centeredSlides: true,
            },
            992: {
              slidesPerView: 1.8,
            },
            768: {
              slidesPerView: 1.6,
            },
            480: {
              slidesPerView: 1.4,
            },
          },
        });
      });

      // car-types
      let carTypesCarousel = document.querySelector('.car-types-carousel');
      if(carTypesCarousel){
        const swiper = new Swiper(carTypesCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: carTypesCarousel.closest('section').querySelector('.ara-next'),
            prevEl: carTypesCarousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 4.2,
            },
            1600: {
                slidesPerView: 3.6,
            },
            1200: {
                slidesPerView: 2.9,
            },
            992: {
                slidesPerView: 2.4,
            },
            768: {
                slidesPerView: 2.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }

      // book-online
      let bookOnlineCarousel = document.querySelector('.book-online-carousel');
      if(bookOnlineCarousel){
        const swiper = new Swiper(bookOnlineCarousel, {
          loop: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1.04,
          navigation: {
            nextEl: bookOnlineCarousel.closest('section').querySelector('.ara-next'),
            prevEl: bookOnlineCarousel.closest('section').querySelector('.ara-prev'),
          },
          breakpoints: {
            1700: {
                slidesPerView: 4,
            },
            1600: {
                slidesPerView: 3.6,
                centeredSlides: true,
            },
            1200: {
                slidesPerView: 2.9,
            },
            992: {
                slidesPerView: 2.4,
            },
            768: {
                slidesPerView: 2.2,
            },
            480: {
                slidesPerView: 1.6,
            },
          },
        });
      }

      // multi-slider
      let multiSlider = document.querySelectorAll('.multi-slider');
      multiSlider.forEach(function(multiSlider) {
        var swiper = new Swiper(multiSlider, {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          paginationClickable: true,
          spaceBetween: 12,
          pagination: {
            el: multiSlider.querySelector('.slider-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: multiSlider.closest('section').querySelector('.ara-next'),
            prevEl: multiSlider.closest('section').querySelector('.ara-prev'),
          },
        });
      });

      // multiSec-slider
      let multiSecSlider = document.querySelectorAll('.multi-sec-slider');
      multiSecSlider.forEach(function(multiSecSlider) {
        var swiper = new Swiper(multiSecSlider, {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          paginationClickable: true,
          spaceBetween: 12,
          pagination: {
            el: multiSecSlider.querySelector('.slider-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: multiSecSlider.closest('.multi-slider-parent').querySelector('.ara-next1'),
            prevEl: multiSecSlider.closest('.multi-slider-parent').querySelector('.ara-prev2'),
          },
        });
      });

      // banner-slider
      let bannerSlider = document.querySelectorAll('.banner-slider');
      bannerSlider.forEach(function(bannerSlider) {
        var swiper = new Swiper(bannerSlider, {
          loop: true,
          slidesPerView: 1,
          slidesToShow: 1,
          paginationClickable: true,
          spaceBetween: 12,
          pagination: {
            el: bannerSlider.closest('section').querySelector('.slider-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: bannerSlider.closest('section').querySelector('.ara-next'),
            prevEl: bannerSlider.closest('section').querySelector('.ara-prev'),
          },
        });
      });

      // testimonial
      let testimonialCarousel = document.querySelector('.testimonial-carousel');
      if(testimonialCarousel){
        const swiper = new Swiper(testimonialCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1,
          pagination: {
            el: testimonialCarousel.closest('section').querySelector('.slider-pagination'),
            clickable: true,
          },
          navigation: {
            nextEl: testimonialCarousel.closest('section').querySelector('.ara-next'),
            prevEl: testimonialCarousel.closest('section').querySelector('.ara-prev'),
          },
        });
      }      

      // premiumCars
      let premiumCarsCarousel = document.querySelector('.premium-cars-carousel');
      if(premiumCarsCarousel){
        const swiper = new Swiper(premiumCarsCarousel, {
          loop: true,
          centeredSlides: true,
          paginationClickable: true,
          autoplay: {
            delay: 200000,
            disableOnInteraction: false,
          },
          spaceBetween: 24,
          slidesPerView: 1,
          pagination: {
            el: premiumCarsCarousel.closest('section').querySelector('.slider-pagination'),
            clickable: true,
          },
        });
      }      

      // carouselInfinity
      let carouselInfinity = document.querySelectorAll('.carousel-infinity');
      if (carouselInfinity.length > 0) {
        carouselInfinity.forEach(function (carousel) {
          const swiper = new Swiper(carousel, {
            spaceBetween: 0,
            centeredSlides: false,
            speed: 21000,
            autoplay: {
              delay: 0,
            },
            loop: true,
            slidesPerView: 'auto',
            allowTouchMove: true,
            disableOnInteraction: true,
          });
        });
      }      

      // shop-details-slider 
      let shopDetailCarousel = document.querySelector('.shop-details-carousel');
      let shopDetailSlider = document.querySelector('.shop-details-slider');
      if(shopDetailSlider){
        var swiper = new Swiper(shopDetailCarousel, {
          slidesPerView: 3,
          loop: true,
          spaceBetween: 12,
          watchSlidesProgress: true,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
        });
        var swiper = new Swiper(shopDetailSlider, {
          loop: true,
          watchSlidesProgress: true,
          autoplay: {
            delay: 2000,
            disableOnInteraction: false,
          },
          thumbs: {
            swiper: swiper,
          },
        });
      }

    });
});