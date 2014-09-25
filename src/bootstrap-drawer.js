(function ($) {
    'use strict';

    var Drawer = function () {
        this.$body = $(document.body);
        this.$backdrop = null;
        this.isShown = null;
    };

    Drawer.prototype.show = function () {
        if (this.isShown) return;

        this.isShown = true;
        this.$backdrop = $('<div class="modal-backdrop" />').appendTo(this.$body);
    };

    Drawer.prototype.hide = function () {
        if (!this.isShown) return;

        this.isShown = false;
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };

    var drawer = new Drawer();

    $(document).on('show.bs.collapse', $.proxy(drawer.show, drawer));
    $(document).on('hide.bs.collapse', $.proxy(drawer.hide, drawer));
})(jQuery);