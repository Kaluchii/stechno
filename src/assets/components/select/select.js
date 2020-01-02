;(function () {

    let $selects = document.querySelectorAll('.js_select');

    for (let $select of $selects) {
        let $selectBtn = $select.querySelector('.js_select_btn'),
            $selectCurrValue = $select.querySelector('.js_current_value'),
            $selectOptions = $select.querySelectorAll('.js_select_option'),
            $selectInput = $select.querySelector('.js_select_input');

        $selectBtn.onclick = function () {
            $select.classList.toggle('is-open');
        };

        for (let $selectOption of $selectOptions) {
            $selectOption.onclick = function () {
                $selectInput.value = this.getAttribute('data-value');
                for (let $selectOption of $selectOptions) {
                    $selectOption.classList.remove('is-active');
                }
                this.classList.add('is-active');
                $select.classList.remove('is-open');
                $selectCurrValue.textContent = this.getAttribute('data-text');
            };
        }
    }


    document.addEventListener('click', closeAllSelect);

    function closeAllSelect(event) {
        for (let $select of $selects) {
            if (!$select.contains(event.target)) {
                $select.classList.remove('is-open');
            }
        }
    }

}());
