;(function () {

    // Start //
    // Фильтр на мобиле
    let $filter = document.querySelector('.js_filter'),
        $filterClose = document.querySelector('.js_filter_close'),
        $filterToggler = document.querySelector('.js_filter_toggle');

    if ($filterToggler) {
        $filterToggler.addEventListener('click', toggleFilter);
        $filterClose.addEventListener('click', closeFilter);


        function toggleFilter () {
            $filter.classList.toggle('is-open');
        }

        function closeFilter () {
            $filter.classList.remove('is-open');
        }

        document.addEventListener('click', clickHandler);

        function clickHandler (event) {
            if (!$filter.contains(event.target) && $filterToggler !== event.target) {
                $filter.classList.remove('is-open');
            }
        }
    }
    // End //

}());
