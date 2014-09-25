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
        this.$element      = $(element);
        this.options       = $.extend({}, Drawer.DEFAULTS, options);
        this.transitioning = null;

        if (this.options.parent) this.$parent = $(this.options.parent);
        if (this.options.toggle) this.toggle();
    };

    Drawer.VERSION  = 'proposed';

    Drawer.TRANSITION_DURATION = 350;

    Drawer.DEFAULTS = {
        toggle: true
    };


    Drawer.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return;

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

        var dimension = this.dimension();

        this.$element
            .removeClass('drawer')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true);

        this.transitioning = 1;

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('drawer in')[dimension]('');
            this.transitioning = 0;
            this.$element
                .trigger('shown.bs.drawer');
        };

        if (!$.support.transition) return complete.call(this);

        var scrollSize = $.camelCase(['scroll', dimension].join('-'));

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Drawer.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    };

    Drawer.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return;

        var startEvent = $.Event('hide.bs.drawer');
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;

        var dimension = this.dimension();

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

        this.$element
            .addClass('collapsing')
            .removeClass('drawer in')
            .attr('aria-expanded', false);

        this.transitioning = 1;

        var complete = function () {
            this.transitioning = 0;
            this.$element
                .removeClass('collapsing')
                .addClass('drawer')
                .trigger('hidden.bs.drawer')
        };

        if (!$.support.transition) return complete.call(this);

        this.$element
            [dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Drawer.TRANSITION_DURATION)
    };

    Drawer.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
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
        })
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
        var target  = $this.attr('data-target')
            || e.preventDefault()
            || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''); // strip for ie7
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