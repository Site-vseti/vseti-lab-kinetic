document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* Portfolio Slider 
        ==========================================================> */
    var slides = document.querySelectorAll('.slide'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        slideIndex = 1;

    showSlides(slideIndex);

    function showSlides(n) {
        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }


        for (let i = 0, length = slides.length; i < length; i++) {
            slides[i].style.display = 'none';
        }

        slides[slideIndex - 1].style.display = 'block';
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    prev.addEventListener('click', function () {
        plusSlides(-1);
        for (let i = 0, length = slides.length; i < length; i++) {
            slides[i].style.animation = 'slideLeft 0.3s';
        }
    });

    next.addEventListener('click', function () {
        plusSlides(1);
        for (let i = 0, length = slides.length; i < length; i++) {
            slides[i].style.animation = 'slideRight 0.3s';
        }
    });


    /* Feedback Slider 
        ==========================================================> */
    let feedbackSlides = document.querySelectorAll('.feedback-slide'),
        prevFeed = document.querySelector('.prevFeed'),
        nextFeed = document.querySelector('.nextFeed'),
        feedbackSlidesIndex = 1;

    showFeedSlides(slideIndex);

    function showFeedSlides(n) {
        if (n > feedbackSlides.length) {
            feedbackSlidesIndex = 1;
        }
        if (n < 1) {
            feedbackSlidesIndex = feedbackSlides.length;
        }


        for (let i = 0, length = feedbackSlides.length; i < length; i++) {
            feedbackSlides[i].style.display = 'none';
        }

        feedbackSlides[feedbackSlidesIndex - 1].style.display = 'block';
    }

    function plusFeedSlides(n) {
        showFeedSlides(feedbackSlidesIndex += n);
    }

    prevFeed.addEventListener('click', function () {
        plusFeedSlides(-1);
        for (let i = 0, length = feedbackSlides.length; i < length; i++) {
            feedbackSlides[i].style.animation = 'slideTop 0.3s';
        }
    });

    nextFeed.addEventListener('click', function () {
        plusFeedSlides(1);
        for (let i = 0, length = feedbackSlides.length; i < length; i++) {
            feedbackSlides[i].style.animation = 'slideBottom 0.3s';
        }
    });


    /* Popup Window
        ==========================================================> */
    let popupBtns = document.querySelectorAll('.popup_btn'),
        popupWindow = document.querySelector('.popup_window'),
        popupClose = document.querySelector('.popup_close');

    for (let i = 0; i < popupBtns.length; i++) {
        startModal(popupBtns[i]);
    }

    function startModal(btn) {

        btn.addEventListener('click', () => {
            popupWindow.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        popupClose.addEventListener('click', () => {
            popupWindow.style.display = 'none';
            document.body.style.overflow = 'scroll';
        });
    }
});