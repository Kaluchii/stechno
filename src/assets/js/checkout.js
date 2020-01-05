;$(function () {

    // Переключение способа доставки
    $('.js_delivery_variant').on('change', function () {
        let viaDelivery = $(this).val() === 'Доставка';

        $('.js_delivery_addr_wrap').toggle(viaDelivery);
        $('.js_delivery_addr').attr('disabled', !viaDelivery);
    });


    // Удаление товара из корзины
    $('.js_del_purchased_product').on('click', function () {
        let $product = $(this).closest('.js_purchased_product');

        $product.slideUp(200, function () {
            $product.remove();

            if (!$('.js_purchased_product').length) {
                $('.js_checkout').remove();
            }
        });

        /* Код удаления товара из корзины */
    });

});