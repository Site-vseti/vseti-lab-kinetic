/* Preloader JS Section Start */
// loads all the files and elements
window.addEventListener('load',function(){
	document.querySelector('body').classList.add("loaded")
});
/* Preloader JS Section End */

/* Scroll Up Button JS Section Start */
$(document).ready(function(){
	// scroll button fading animation
	$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});
		// scroll body to 0px(top) on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});
});
/* Scroll Up Button JS Section End */

/* Navbar Slide Up Animation Section Start */
(function ($) {
var previousScroll = 20;
    // scroll functions
    $(window).scroll(function(e) {
        // add/remove class to navbar when scrolling to hide/show
        var scroll = $(window).scrollTop();
        if (scroll >= previousScroll) {
            $('.navbar').addClass("navbar-hide");
        }
		else if (scroll < previousScroll) {
            $('.navbar').removeClass("navbar-hide");
        }
        previousScroll = scroll;
    });    
})(jQuery);
/* Navbar Slide Up Animation Section End */