;(function () {

    let $menuWrap = document.querySelector('.js_menu_wrap'),
        $navBtns = document.querySelectorAll('.js_nav_btn'),
        $navBackBtns = document.querySelectorAll('.js_nav_back_btn');

    $menuWrap.style.height = document.querySelector('.js_nav_list_main').offsetHeight + 'px';


    Array.from($navBtns).forEach(function ($item) {
        $item.addEventListener('click', function () {
            let $navList = this.nextElementSibling;

            if ($navList) {
                $navList.classList.add('is-active');
                $menuWrap.style.height = $navList.offsetHeight + 'px';
            }
        });
    });


    Array.from($navBackBtns).forEach(function ($item) {
        $item.addEventListener('click', function () {
            let $navList = this.closest('.js_nav_list'),
                $navListParent = $navList.parentNode.closest('.js_nav_list');

            $navList.classList.remove('is-active');
            $menuWrap.style.height = $navListParent.offsetHeight + 'px';
        });
    });

}());