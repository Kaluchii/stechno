;$(function () {

    $('.js_banners_slider').slick({
        dots: false,
        edgeFriction: 0.1,
        touchThreshold: 15,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 10000,
        prevArrow: '.js_slider_prev',
        nextArrow: '.js_slider_next',
    });

    $('.js_product_slider').slick({
        dots: false,
        edgeFriction: 0.1,
        touchThreshold: 15,
        speed: 400,
        fade: true,
        prevArrow: '.js_slider_prev',
        nextArrow: '.js_slider_next',
        asNavFor: '.js_product_slider_nav'
    });

    $('.js_product_slider_nav').slick({
        arrows: false,
        dots: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        edgeFriction: 0.1,
        touchThreshold: 15,
        speed: 400,
        asNavFor: '.js_product_slider'
    });

    $('.js_nav_slide').on('click', function () {
        $('.js_product_slider_nav').slick('slickGoTo', $(this).data('index'));
    });


    // Открытие/закрытие поиска в шапке на десктопе
    $('.js_search_open_btn').on('click', function () {
        $(this).parent().addClass('is-open');
        $('.js_search_input').focus();
    });

    $(document).on('click', closeSearch);

    function closeSearch(event) {
        let $searchBlock = $('.js_search_block');

        if (!$searchBlock.has(event.target).length > 0) {
            $searchBlock.removeClass('is-open');
        }
    }


    $('.js_checkout_form').on('fail-send', function () {
        $('.js_notification').fadeIn();
        $('.js_checkout').remove();
        setTimeout(function () {
            $('.js_notification').fadeOut();
        }, 5000);
    });

    $('.js_request_form').on('fail-send', function () {
        $('.js_notification').fadeIn();
        setTimeout(function () {
            $('.js_notification').fadeOut();
        }, 5000);
    });

});
