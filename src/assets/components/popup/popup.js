const popup = function () {
    let lastOpenedName = '';

    function open (name) {
        close(lastOpenedName);
        lastOpenedName = name;
        document.querySelector('.js_popup_' + name).classList.add('is-open');
    }


    function close (name = lastOpenedName) {
        if (!name) return;
        document.querySelector('.js_popup_' + name).classList.remove('is-open');
        lastOpenedName = '';
    }


    return {
        open,
        close
    };
}();