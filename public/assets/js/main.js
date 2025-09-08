"use strict";

document.addEventListener("DOMContentLoaded", function () {

  $(function ($) {

    // preloader
    $("#preloader").delay(300).animate({
      "opacity": "0"
    }, 500, function () {
      $("#preloader").css("display", "none");
    });

    // Click to Scroll Top
    var ScrollTop = $(".scrollToTop");
    var lastScrollTop = 0;
    $('.scrollToTop').on('click', function () {
      $('html, body').animate({
        scrollTop: 0
      }, 600);
      return false;
    });
    $(window).on('scroll', function() {
      var scrollTop = $(this).scrollTop();
      if (scrollTop < lastScrollTop) {
        $(ScrollTop).fadeIn();
      } else {
        $(ScrollTop).fadeOut();
      }
      if ($(this).scrollTop() < 600) {
        ScrollTop.removeClass("active");
      } else {
        ScrollTop.addClass("active");
      }
      lastScrollTop = scrollTop;
    });

    // Sticky Header
    var fixed_top = $(".header-section");
    if ($(window).scrollTop() > 50) {
      fixed_top.addClass("animated fadeInDown header-fixed");
    }
    else {
      fixed_top.removeClass("animated fadeInDown header-fixed");
    }
    
    // window on scroll function
    $(window).on("scroll", function () {

      // Sticky Header
      if ($(window).scrollTop() > 50) {
        fixed_top.addClass("animated fadeInDown header-fixed");
      }
      else {
        fixed_top.removeClass("animated fadeInDown header-fixed");
      }

      // Odometer Init 
      let windowHeight = $(window).height();
      $('.odometer').children().each(function () {
        if ($(this).isInViewport({ "tolerance": windowHeight, "toleranceForLast": windowHeight, "debug": false })) {
          var section = $(this).closest(".counters");
          section.find(".odometer").each(function () {
            $(this).html($(this).attr("data-odometer-final"));
          });
        }
      });

    });

    // sidebar item Toggle
    $('.single-item .cmn-head').on('click', function () {
      $(this).parents('.single-item').toggleClass('active');
      $(this).parents('.single-item').siblings().removeClass('active');
    });

    // target Items Remove from anywhere click
    var targetBox = $('.target-item');
    $(document).on('click', function(event) {      
      if (!targetBox.is(event.target) && !targetBox.has(event.target).length) {
        targetBox.removeClass('active');
      }
    });

    // Dropdown Active Remove
    $(".close-btn").on('click', function () {
      $('.single-item').removeClass('active');
    });

    // Input Increase and Decrease
    var minVal = 1, maxVal = 20;
    $(".increaseQty, .decreaseQty").on('click', function(){
      var $parentElm = $(this).parents(".qtySelector");
      $(this).addClass("clicked");
      setTimeout(() => $(".clicked").removeClass("clicked"), 100);
      var value = +$parentElm.find(".qtyValue").val();
      if ($(this).hasClass('increaseQty') && value < maxVal) value++;
      if ($(this).hasClass('decreaseQty') && value > minVal) value--;
      $parentElm.find(".qtyValue").val(value);
    });

    // Select all scroll containers
    const scrollWrappers = document.querySelectorAll('.scroll-content-wrapper');
    function isScreenWidthValid() {
      return window.innerWidth >= 1200;
    }
    scrollWrappers.forEach(scrollWrapper => {
      const scrollContent = scrollWrapper.querySelector('.scroll-content');
      const scrollContentXSecond = scrollWrapper.querySelector('.scroll-content.second');
      const scrollContentXThird = scrollWrapper.querySelector('.scroll-content.third');
      const scrollContentXFourth = scrollWrapper.querySelector('.scroll-content.fourth');
      const scrollContentXFifth = scrollWrapper.querySelector('.scroll-content.fifth');
      const scrollContentY = scrollWrapper.querySelector('.scroll-contentY');
      const scrollContentYSecond = scrollWrapper.querySelector('.scroll-contentY.second');
      const percentageArea = document.querySelector('.progress-circles');
      let scrollPosition = 0;
      let lastScrollY = window.scrollY;
      const increment = 0.5;
      function updateTransform(scrollPosition) {
        const percentage = ((scrollPosition + 30) / 60) * 100;
        if (scrollContentY) {
          scrollContentY.style.transform = `translateY(${-30-scrollPosition}%)`;
        }
        if (scrollContentYSecond) {
          scrollContentYSecond.style.transform = `translateY(${-30+scrollPosition}%)`;
        }
        if (isScreenWidthValid() && scrollContent) {
          scrollContent.style.transform = `translateX(${-scrollPosition}%)`;
        }
        if (scrollContentXSecond) {
          scrollContentXSecond.style.transform = `translateX(${-90+scrollPosition}%)`;
        }
        if (scrollContentXThird) {
          scrollContentXThird.style.transform = `translateX(${-30-scrollPosition}%)`;
        }
        if (scrollContentXFourth) {
          scrollContentXFourth.style.transform = `translateX(${-scrollPosition}%)`;
        }
        if (scrollContentXFifth) {
          scrollContentXFifth.style.transform = `translateX(${scrollPosition}%)`;
        }
        if (percentageArea) {
          percentageArea.style.setProperty('--value', `${percentage.toFixed(2)}`);
          percentageArea.querySelector('.progress-value').innerText = percentage.toFixed(0)+'%';
          if(percentage>99){
            percentageArea.querySelector('.progress-text').style.display = 'block';
            percentageArea.querySelector('.progress-value').style.display = 'none';
            document.querySelector('.sticky-area').style.top = 'initial';
          }else{
            percentageArea.querySelector('.progress-value').style.display = 'block';
            percentageArea.querySelector('.progress-text').style.display = 'none';
            document.querySelector('.sticky-area').style.top = '0';
          }
        }
      }
      function isSectionInViewport() {
        const rect = scrollWrapper.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom >= 0;
      }
      window.addEventListener('scroll', function () {
        if (isSectionInViewport()) {
          const delta = window.scrollY - lastScrollY;
          lastScrollY = window.scrollY;
          if (delta > 0) {
            scrollPosition += increment;
            if (scrollPosition > 30) {
              scrollPosition = 30;
            }
          }
          if (delta < 0) {
            scrollPosition -= increment;
            if (scrollPosition < -30) {
              scrollPosition = -30;
            }
          }
          updateTransform(scrollPosition);
        }
      });
    });

    // text fill animation
    function wrapTextIntoLines() {
      const sourceText = document.querySelectorAll('.source-text');
      if (sourceText.length === 0) return;
      const container = document.querySelector('.text-wrapper');
      const textSpan = document.querySelector('.source-text');
      const wrappedTextDiv = document.querySelector('.wrapped-text');
      wrappedTextDiv.innerHTML = '';
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      document.body.appendChild(tempSpan);
      const words = textSpan.textContent.trim().split(' ');
      let currentLine = [];
      let lineCount = 0;
      const containerWidth = container.offsetWidth;
      words.forEach(word => {
        currentLine.push(word);
        tempSpan.textContent = currentLine.join(' ');
        if (tempSpan.offsetWidth > containerWidth) {
          currentLine.pop();
          const lineSpan = document.createElement('span');
          lineSpan.className = 'text-animation';
          lineSpan.textContent = currentLine.join(' ');
          lineSpan.setAttribute('data-hover', currentLine.join(' '));
          wrappedTextDiv.appendChild(lineSpan);
          currentLine = [word];
          lineCount++;
        }
      });
      if (currentLine.length > 0) {
        const lineSpan = document.createElement('span');
        lineSpan.className = 'text-animation';
        lineSpan.textContent = currentLine.join(' ');
        lineSpan.setAttribute('data-hover', currentLine.join(' '));
        wrappedTextDiv.appendChild(lineSpan);
        lineCount++;
      }
      document.body.removeChild(tempSpan);
      const textAnimations = document.querySelectorAll('.text-animation');
      let scrollPosition = 0;
      let lastScrollY = window.scrollY;
      const increment = 1.5;
      const totalElements = textAnimations.length;
      function updateWidths(scrollPosition) {
        const percentPerElement = 100 / totalElements;
        const currentElementIndex = Math.floor(scrollPosition / percentPerElement);
        const currentElementProgress = (scrollPosition % percentPerElement) * totalElements;
        textAnimations.forEach((element, index) => {
          if (index < currentElementIndex) {
            element.style.setProperty('--hover-width', '100%');
          } else if (index === currentElementIndex) {
            element.style.setProperty('--hover-width', `${currentElementProgress}%`);
          } else {
            element.style.setProperty('--hover-width', '0%');
          }
        });
      }
      function isAnyElementInViewport() {
        for (let element of textAnimations) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom >= 0) {
            return true;
          }
        }
        return false;
      }
      window.addEventListener('scroll', function () {
        if (isAnyElementInViewport()) {
          const delta = window.scrollY - lastScrollY;
          lastScrollY = window.scrollY;
          if (delta > 0) {
            scrollPosition += increment;
            if (scrollPosition > 100) {
              scrollPosition = 100;
            }
          }
          if (delta < 0) {
            scrollPosition -= increment;
            if (scrollPosition < 0) {
              scrollPosition = 0;
            }
          }
          updateWidths(scrollPosition);
        }
      });
      window.addEventListener('load', wrapTextIntoLines);
      window.addEventListener('resize', wrapTextIntoLines);
    }wrapTextIntoLines();
    
    // Input toggle class
    const checkboxes = document.querySelectorAll('.single-checkbox.radio');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('click', () => {
        checkboxes.forEach(item => item.classList.remove('active'));
        checkbox.classList.toggle('active');
      });
    });    

    // Circle Text
    const text = document.querySelector(".circle-text.first p");
    const text2 = document.querySelector(".circle-text.second p");
    if (text) {
      text.innerHTML = text.innerText.split('').map(
        (char, i) =>
          `<span style="transform:rotate(${i * 11.2}deg)">${char}</span>`
      ).join('');
    }
    if (text2) {
      text2.innerHTML = text2.innerText.split('').map(
        (char, i) =>
          `<span style="transform:rotate(${i * 10.6}deg)">${char}</span>`
      ).join('');
    }

    // Animation Item VisualViewport 
    function enableRevealEffect() {
      const targetsAos = document.querySelectorAll('.reveal-single');
      const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-init');
          } else {
            entry.target.classList.remove('reveal-init');
          }
        });
      };
      const observer = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });
      targetsAos.forEach(target => {
        observer.observe(target);
      });
    }enableRevealEffect();

    // comments-area
    $('.single-comment .reply-btn').on('click', function () {
      $(this).next(".comment-form").slideToggle();
    });

    // Box Style 
    const targetBtn = document.querySelectorAll('.box-style')
    if (targetBtn) {
      targetBtn.forEach((element) => {
        element.addEventListener('mousemove', (e) => {
          const x = e.offsetX + 'px';
          const y = e.offsetY + 'px';
          element.style.setProperty('--x', x);
          element.style.setProperty('--y', y);
        })
      })
    }

    // video-controller
    const videoController = document.querySelector(".video-controller");
    if (videoController) {
      const mainVideo = videoController.querySelector("video");
      const videoButtonIcon = videoController.querySelector("button i");
      videoController.querySelector("button").addEventListener("click", () => {
        const isPaused = mainVideo.paused;
        mainVideo[isPaused ? "play" : "pause"]();
        videoButtonIcon.classList.toggle("ph-play", !isPaused);
        videoButtonIcon.classList.toggle("ph-pause", isPaused);
      });
    }    

    // progress-circle
    const progressCircle = document.querySelector('.progress-circle');
    if(progressCircle && progressCircle.r && progressCircle.r.baseVal){
      const radiusMath = progressCircle.r.baseVal.value;
      const circumference = 2 * Math.PI * radiusMath;
      progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
      progressCircle.style.strokeDashoffset = circumference;
      function setProgress(percent) {
        const offset = circumference - percent * circumference;
        progressCircle.style.strokeDashoffset = offset;
      }
      document.addEventListener('scroll', () => {
        const content = document.querySelector('.main-body-content');
        const contentRect = content.getBoundingClientRect();
        if (contentRect.bottom < 0 || contentRect.top > window.innerHeight) {
          setProgress(0);
          return;
        }
        if (contentRect.top < window.innerHeight && contentRect.bottom > 0) {
          const visibleHeight = Math.min(contentRect.bottom, window.innerHeight) - Math.max(contentRect.top, 0);
          const totalVisibleHeight = Math.min(content.offsetHeight, window.innerHeight);
          const scrollPosition = window.innerHeight - contentRect.top;
          const scrollPercent = Math.min(Math.max(scrollPosition / (content.offsetHeight + window.innerHeight - totalVisibleHeight), 0), 1);
          setProgress(scrollPercent);
        }
      });
    }
    
    // rating-container
    const ratingContainers = document.querySelectorAll('.rating-container');
    ratingContainers.forEach(container => {
      const getRating = parseFloat(container.getAttribute('data-rating')) || 0;
      const widthPercent = Math.min(Math.max((getRating / 5) * 100, 0), 100);
      const svgElement = container.querySelector('svg');
      const clonedSvgElement = svgElement.cloneNode(true);
      container.appendChild(clonedSvgElement);
      clonedSvgElement.style.setProperty('--fill-width', `${widthPercent}%`);
      clonedSvgElement.classList.add('position-absolute');
    });
    
    // box sized 
    function boxSizes() {
      const bodyWidth = window.innerWidth;
      $("[data-size]").each(function () {
        const $el = $(this);
        const baseSize = parseFloat($el.attr("data-size"));
        if (isNaN(baseSize)) return;
        let finalSize = baseSize;
        if (bodyWidth <= 991) {
          finalSize = baseSize * 0.65;
        } else if (bodyWidth <= 1199) {
          finalSize = baseSize * 0.75;
        }
        const sizePx = `${finalSize}px`;
        $el.css({
          width: sizePx,
          minWidth: sizePx,
        });
      });
    }boxSizes();
    $(window).on('resize', boxSizes);

    // magnific-popup
    $('.popup-video').magnificPopup({
      type: 'iframe'
    });

    // gridGallery
    $('.popup_img').magnificPopup({
        type:'image',
        gallery:{
            enabled: true
        }
    });

    // get value from range sliders
    const rangeSliders = document.querySelectorAll('.range-slider');
    if(rangeSliders){
      function updateSlider(slider) {
        const minValue = slider.min;
        const maxValue = slider.max;
        const currentValue = slider.value;
        slider.style.setProperty('--min', minValue);
        slider.style.setProperty('--max', maxValue);
        slider.style.setProperty('--value', currentValue);
        updateTotalValue(slider);
      }
      function updateTotalValue(slider) {
        let totalValue = 0;
        rangeSliders.forEach(slider => {
          totalValue += parseInt(slider.value);
        });
        updateThumbWithValue(slider, totalValue);
      }
      function updateThumbWithValue(slider, totalValue) {
        let sliderParent = slider.closest('.single-range');
        if (sliderParent) {
          let thumbValue = sliderParent.querySelector('.thumb-value');
          if (thumbValue) {
            thumbValue.textContent = `${totalValue} days`;
            thumbValue.style.left = `${(slider.value - slider.min) / (slider.max - slider.min) * 100}%`;
          }
        }
      }
      rangeSliders.forEach(slider => {
          updateSlider(slider);
          slider.addEventListener('input', () => updateSlider(slider));
      });
    }
    
    // Navbar Auto Active Class 
    var curUrl = $(location).attr('href');
    var terSegments = curUrl.split("/");
    var desired_segment = terSegments[terSegments.length - 1];
    var removeGarbage = desired_segment.split(".html")[0] + ".html";
    var checkLink = $('.menu-link a[href="' + removeGarbage + '"]');
    var targetClass = checkLink.addClass('active');
    targetClass.parents('.menu-link').addClass('active-parents');
    targetClass.parents('.menu-item').addClass('active-parents');
    targetClass.parents('.menu-item').addClass('onHovered');
    $('.active-parents > button').addClass('active');
    $('.active-parents > button').addClass('onHovered');

    // navbar custom
    $('.navbar-toggle-btn').on('click', function () {
      $('.navbar-toggle-item').slideToggle(300);
      $('body').toggleClass('overflow-hidden');
      $(this).toggleClass('open');
    });
    $('.menu-item button').on('click', function () {
      $(this).siblings("ul").slideToggle(300);
      $(this).toggleClass('onHovered');
    });
    $('.sub-menus').each(function() {
      if ($(this).parent('.menu-item').hasClass('active-parents')) {
        $(this).css("display", "block");
      }
    });

    // Grid List Activator
    const $gridButton = $('.grid-list-btn .grid-active');
    const $listButton = $('.grid-list-btn .list-active');
    const $gridTemplate = $('.grid-list-template');
    function toggleView(view) {
      if (view === 'grid') {
        $gridTemplate.removeClass('active');
        $gridButton.addClass('active');
        $listButton.removeClass('active');
      } else {
        $gridTemplate.addClass('active');
        $listButton.addClass('active');
        $gridButton.removeClass('active');
      }
    }
    $gridButton.on('click', function() {
        toggleView('grid');
    });
    $listButton.on('click', function() {
        toggleView('list');
    }); toggleView('grid');

    // Current Year
    $(".currentYear").text(new Date().getFullYear());

    // sidebar-toggler
    var primarySidebar = $('.sidebar-toggler .sidebar-head');
    $('.sidebar-toggler .toggler-btn').on('click', function () {
      $(this).closest('.sidebar-head').toggleClass('active');
      if (!$('.sidebar-head').hasClass('active')) {
        setTimeout(function () {
          primarySidebar.css("height", "24px");
        }, 550);
      } else {
        primarySidebar.css("height", "100%");
      }
    });

    // sidebar-toggler
    $('.section-sidebar .right-sidebar-btn, .right-sidebar .close-btn').on('click', function () {
      $('.right-sidebar').toggleClass('active');
    });
    
    // sidebar content toggler
    $('.collapse-single .header-area').on('click', function () {
      var $collapse = $(this).closest(".collapse-single");
      var $contentArea = $(this).next(".content-area");
      if ($collapse.hasClass("active")) {
        $collapse.removeClass("active");
        $contentArea.slideUp();
      } else {
        $collapse.addClass("active");
        $contentArea.slideDown();
      }
    });
    $(".collapse-single.active").each(function() {
      $(this).find(".content-area").slideDown();
    });

    // Mouse Follower
    const follower = document.querySelector(".mouse-follower .cursor-outline");
    const dot = document.querySelector(".mouse-follower .cursor-dot");
    window.addEventListener("mousemove", (e) => {
      follower.animate(
        [{
          opacity: 1,
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          easing: "ease-in-out"
        }],
        {
          duration: 3000,
          fill: "forwards"
        }
      );
      dot.animate(
        [{
          opacity: 1,
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          easing: "ease-in-out"
        }],
        {
          duration: 1500,
          fill: "forwards"
        }
      );
    });

    // Mouse Follower Hide Function
    $("a, button").on('mouseenter mouseleave', function () {
      $('.mouse-follower').toggleClass('hide-cursor');
    });

    // progress-area
    let progressBars = $('.progress-area');
    let observer = new IntersectionObserver(function(progressBars) {
      progressBars.forEach(function(entry, index) {
        if (entry.isIntersecting) {
          let width = $(entry.target).find('.progress-bar').attr('aria-valuenow');
          let count = 0;
          let time = 1000 / width;
          let progressValue = $(entry.target).find('.progress-value');
          setInterval(() => {
            if (count == width) {
              clearInterval();
            } else {
              count += 1;
              $(progressValue).text(count+'%')
            }
          }, time);
          $(entry.target).find('.progress-bar').css({"width": width + "%", "transition": "width 1s linear"});
        }else{
          $(entry.target).find('.progress-bar').css({"width": "0%", "transition": "width 1s linear"});
        }
      });
    });
    progressBars.each(function() {
      observer.observe(this);
    });
    $(window).on('unload', function() {
      observer.disconnect();
    });

    // custom Accordion
    $('.accordion-single .header-area').on('click', function () {
      var $accordion = $(this).closest(".accordion-single");
      var $contentArea = $(this).next(".content-area");
      if ($accordion.hasClass("active")) {
        $accordion.removeClass("active");
        $contentArea.slideUp();
      } else {
        $(".accordion-single").removeClass("active");
        $(".accordion-single .content-area").slideUp();
        $accordion.addClass("active");
        $contentArea.slideDown();
      }
    });
    $(".accordion-single.active").each(function() {
      $(this).find(".content-area").slideDown();
    });
    
    // Function to filter items
    function applyFilter(filterItem) {
      var filter = filterItem.data('filter');
      $('.filter-list .filter-links').removeClass('active');
      filterItem.find('.filter-links').addClass('active');
      var singleFilter = filterItem.closest('.singleFilter');
      var tabItem = singleFilter.find('.filterItems');
      var filterTags = filter.split(' ');
      tabItem.find('> div').removeClass('active');
      if (filter === '*') {
        tabItem.find('> div').addClass('active');
      } else {
        tabItem.find('> div').each(function() {
          var itemTags = $(this).data('tag').split(' ');
          for (var i = 0; i < filterTags.length; i++) {
            if (itemTags.includes(filterTags[i])) {
              $(this).addClass('active');
              break;
            }
          }
        });
      }
    }
    $('.filter-item.active').each(function() {
      applyFilter($(this));
      $('.filter-item.active').find('.filter-links').addClass('active');
    });
    $('.filter-list li').each(function(index) {
      $(this).on('click', function () {
        applyFilter($(this));
      });
    });

    // data background
    $("[data-bg]").each(function () {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-bg") + ")"
      );
    });

    // star select 
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', function() {
        const ratingValue = this.getAttribute('data-value');
        stars.forEach(star => star.classList.remove('selected'));
        for (let i = 0; i < ratingValue; i++) {
          stars[i].classList.add('selected');
        }
      });
    });    
    
    // Function to update the countdown for all elements
    function updateCountdown() {
      const countdownElements = document.querySelectorAll(".countdown");
      countdownElements.forEach(element => {
          const targetDateString = element.getAttribute("data-date");
          const [day, month, year] = targetDateString.split("-");
          const targetDate = new Date(`${year}-${month}-${day}T00:00:00Z`).getTime();
          const now = new Date().getTime();
          const distance = targetDate - now;
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if (distance < 0) {
            if (element.classList.contains("separate")) {
              element.innerText = "Countdown Finished";
            } else {
              element.innerText = "Countdown Finished";
            }
            element.classList.add("finished");
          } else {
            const paddedDays = String(days).padStart(2, '0');
            const paddedHours = String(hours).padStart(2, '0');
            const paddedMinutes = String(minutes).padStart(2, '0');
            const paddedSeconds = String(seconds).padStart(2, '0');
            if (element.classList.contains("separate")) {
              element.querySelector(".days").innerText = paddedDays;
              element.querySelector(".hours").innerText = paddedHours;
              element.querySelector(".minutes").innerText = paddedMinutes;
              element.querySelector(".seconds").innerText = paddedSeconds;
            } else {
              const formattedCountdown = `${paddedDays} : ${paddedHours} : ${paddedMinutes} : ${paddedSeconds}`;
              element.innerText = formattedCountdown;
            }
          }
      });
    }
    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
    
  });

});