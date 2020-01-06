;$(function () {

    $('.js_form').on('submit', function (e) {
        e.preventDefault();
        finalValidation($(this));
    });


    let inSendingProcess = false;

    function finalValidation($form) {
        if (inSendingProcess) return;

        let validForm = fieldsCheck($form);

        if (validForm) {
            inSendingProcess = true;
            $form.find('.js_send_form_btn').addClass('has-waiting');
            sendForm($form);
        }
    }


    function sendForm($form) {
        let requestUrl = $form.attr('action'),
            requestMethod = $form.attr('method') || 'POST',
            response,
            formData = new FormData($form.get(0));

        response = ajaxDataSend(requestMethod, requestUrl, formData);
        response.done(function (data) {
            if (!data.error) {
                clearFormFields($form);
                $form.trigger('success-send');
            }
        });
        response.fail(function (data) {
            $form.trigger('fail-send');
            console.error(data);
        });
        response.always(function () {
            $form.find('.js_send_form_btn').removeClass('has-waiting');
            inSendingProcess = false;
        });
    }


    // Проверка почты на соответствие маске *@*.*
    function isEmail(mail) {
        let regex = /\S+@\S+/igm;
        return regex.test(mail);
    }


    // Очистка формы
    function clearFormFields($form) {
        $form.find('.js_form_input').each(function () {
            $(this).val('');
            $(this).trigger('change');
            $(this).parent().removeClass('is-valid has-error has-content');
        });
    }


    // Проверка отдельного поля на валидность
    function fieldValid($input) {
        if ($input.attr('type') === 'checkbox') {
            return !$input.prop('required') || $input.prop('checked');
        }

        if ($input.prop('disabled')) {
            return true;
        }

        if (!$input.prop('required') || $input.val() !== '') {

            if ($input.attr('type') === 'email') {
                return !$input.prop('required') || isEmail($input.val());
            } else {
                return true;
            }

        } else {
            return false;
        }
    }


    $('.js_form_input')
        .on('change', function () {
            if ($(this).val() !== '') {
                $(this).parent().addClass('has-content');
            } else {
                $(this).parent().removeClass('has-content');
            }
            return fieldCheck($(this));
        })
        .on('focusout', function () {
            $(this).parent().removeClass('is-filling');
        })
        .on('input', function () {
            $(this).parent().addClass('is-filling');
        });


    // Проверка полей формы на отсутствие пустых полей и валидность
    function fieldsCheck($form) {
        let checked = true;
        let focus = true;
        $form.find('.js_form_input').each(function () {
            if ($(this)[0].tagName === 'INPUT' || $(this)[0].tagName === 'SELECT' || $(this)[0].tagName === 'TEXTAREA') {
                checked = fieldCheck($(this)) && checked;
                if (focus && !checked) {
                    $(this).focus();
                    focus = false;
                }
            }
        });
        return checked;
    }


    // Добавление классов полю по результатам валидации
    function fieldCheck($input) {
        let $parent = $input.parent();

        if (fieldValid($input)) {
            if ($parent.hasClass('has-error')) {
                $parent.removeClass('has-error')
            }
            $parent.addClass('is-valid');

            return true;
        } else {
            if ($parent.hasClass('is-valid')) {
                $parent.removeClass('is-valid')
            }
            $parent.addClass('has-error');

            return false;
        }
    }


    function ajaxDataSend(type, url, data) {
        return $.ajax(
            {
                type: type,
                url: url,
                // dataType: 'json',
                contentType: false,
                processData: false,
                data: data,
                headers: {
                }
            }
        );
    }

});
