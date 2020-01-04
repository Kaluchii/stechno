;$(function () {
    $('.js_to_checkout_btn').on('click', function (e) {
        e.preventDefault();

        if ($(this).hasClass('in-order')) {
            window.location = '/checkout.html';
        }

        $(this).addClass('in-order');

        /* Код добавления товара в корзину */
    });
});