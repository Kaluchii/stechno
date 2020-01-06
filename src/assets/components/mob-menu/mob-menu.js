;(function () {

    let $header = document.querySelector('.js_header'),
        $menuBg = document.querySelector('.js_menu_bg'),
        $menuToggler = document.querySelector('.js_menu_toggle');

    $menuBg.addEventListener('click', function () {
        $header.classList.remove('menu-is-open');
    });

    $menuToggler.addEventListener('click', function () {
        $header.classList.toggle('menu-is-open');
    });

}());