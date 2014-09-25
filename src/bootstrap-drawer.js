/* ========================================================================
 * Bootstrap: bootstrap-drawer.js
 * Proposal for new mobile menu
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc & Ryan Walters.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


(function ($) {
    'use strict';

    // DRAWER PUBLIC CLASS DEFINITION
    // ==============================

    var Drawer = function (element, options) {
        this.$backdrop     = null;
        this.$body         = $(document.body);
        this.$element      = $(element);
        this.isShown       = null;
        this.options       = $.extend({}, Drawer.DEFAULTS, options);
        this.transitioning = null;

        if (this.options.parent) this.$parent = $(this.options.parent);
        if (this.options.toggle) this.toggle();
    };

    Drawer.VERSION  = 'proposed';

    Drawer.TRANSITION_DURATION = 200;

    Drawer.DEFAULTS = {
        toggle: true
    };

    /* --- SHOW --- */

    Drawer.prototype.show = function () {
        var that = this;

        if (this.transitioning || this.isShown) return;

        var startEvent = $.Event('show.bs.drawer');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;

        var actives = this.$parent && this.$parent.find('> .panel').children('.in, .collapsing');

        if (actives && actives.length) {
            var hasData = actives.data('bs.drawer');
            if (hasData && hasData.transitioning) return;
            Plugin.call(actives, 'hide');
            hasData || actives.data('bs.drawer', null);
        }

        this.$element
            .removeClass('drawer')
            .addClass('collapsing').width(0)
            .attr('aria-expanded', true);

        this.transitioning = 1;
        this.isShown = true;

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('drawer in').width('');
            this.transitioning = 0;
            this.$element
                .trigger('shown.bs.drawer');
        };

        if (!$.support.transition) return complete.call(this);

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Drawer.TRANSITION_DURATION);

        this.backdrop(function () {
            if ($.support.transition) that.$element[0].offsetWidth; // force reflow

            that.$element
                .addClass('in')
                .attr('aria-hidden', false);
        });
    };

    /* --- HIDE --- */

    Drawer.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return;

        var startEvent = $.Event('hide.bs.drawer');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;

        this.$element
            .addClass('collapsing')
            .removeClass('drawer in')
            .attr('aria-expanded', false);

        this.transitioning = 1;
        this.isShown = false;

        var complete = function () {
            this.transitioning = 0;
            this.$element
                .removeClass('collapsing')
                .addClass('drawer')
                .trigger('hidden.bs.drawer');
        };

        if (!$.support.transition) return complete.call(this);

        this.$element.width(0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Drawer.TRANSITION_DURATION);

        this.backdrop();
    };

    /* --- TOGGLE --- */

    Drawer.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']();
    };

    /* --- BACKDROP --- */

    Drawer.prototype.backdrop = function (callback) {
        var that = this;
        var animate = 'fade';

        if (this.isShown) {
            var doAnimate = $.support.transition && animate;

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                .appendTo(this.$body);

            this.$backdrop.on('click.dismiss.bs.drawer', $.proxy(that.hide, that));

            if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

            this.$backdrop.addClass('in');

            if (!callback) return;

            doAnimate ?
                this.$backdrop
                    .one('bsTransitionEnd', callback)
                    .emulateTransitionEnd(Drawer.TRANSITION_DURATION) :
                callback();

        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in');

            var callbackRemove = function () {
                that.$backdrop && that.$backdrop.remove();
                that.$backdrop = null;
                callback && callback();
            };

            $.support.transition ?
                this.$backdrop
                    .one('bsTransitionEnd', callbackRemove)
                    .emulateTransitionEnd(Drawer.TRANSITION_DURATION) :
                callbackRemove();

        } else if (callback) {
            callback();
        }
    };


    // DRAWER PLUGIN DEFINITION
    // ========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('bs.drawer');
            var options = $.extend({}, Drawer.DEFAULTS, $this.data(), typeof option == 'object' && option);

            if (!data && options.toggle && option == 'show') options.toggle = false;
            if (!data) $this.data('bs.drawer', (data = new Drawer(this, options)));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.drawer;

    $.fn.drawer             = Plugin;
    $.fn.drawer.Constructor = Drawer;


    // DRAWER NO CONFLICT
    // ==================

    $.fn.drawer.noConflict = function () {
        $.fn.drawer = old;
        return this;
    };


    // DRAWER DATA-API
    // ===============

    $(document).on('click.bs.drawer.data-api', '[data-toggle="drawer"]', function (e) {
        var href;
        var $this   = $(this);
        var target  = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
        var $target = $(target);
        var data    = $target.data('bs.drawer');
        var option  = data ? 'toggle' : $this.data();
        var parent  = $this.attr('data-parent');
        var $parent = parent && $(parent);

        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle="drawer"][data-parent="' + parent + '"]').not($this).addClass('closed').attr('aria-expanded', false);
            var isClosed = $target.hasClass('in');
            $this.toggleClass('closed', isClosed).attr('aria-expanded', !isClosed);
        }

        Plugin.call($target, option);
    });

})(jQuery);