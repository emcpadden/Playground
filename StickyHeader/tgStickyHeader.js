/*
 * tgStickyHeader
 *
 * Copyright (c) 2014 Tangoe
 */

// NOTE: Depends on tgIsElementVisible.js (and jQuery and jQuery Widget Factory of course)

(function($) {
    if (typeof $.tg !== 'undefined' && typeof $.tg.tgStickyHeader !== 'undefined') {
        return; //already defined so get out
    }

    $.widget("tg.tgStickyHeader", {
        options: {
        },

        _element: undefined, 
        _elementClone: undefined,
        _currentTop: undefined,
        _prevousTop: undefined,

        _create : function() {
            var self = this;
            this._element = self._element = $(self.element); 
            this._element.addClass('tg-stickyheader');
            var height = this._element.outerHeight();

            // create the header clone and hide it
            this._elementClone = this._element.clone()
                .addClass("tg-stickyheader--clone")
                .height(height)
                .css('position', 'fixed')
                .css('z-index', '999')
                .css('top', '-' + 2*height + "px");

            this._element.before(this._elementClone);
            this._element.addClass('tg-stickyheader--original');
            $(window).on("scroll", function() {
                if(self._element.tgIsElementVisible({top: "hiddenAbove" })) {
                    window.console.log("SCROLL-HEADER-HIDDEN-ABOVE");
                    self._elementClone.css('top', '0px');
                }
                else {
                    window.console.log("SCROLL-HEADER-VISIBLE-OR-HIDDEN-BELOW")
                    self._elementClone.css('top', '-' + 2*height + "px");
                }
            });
        },

        _init: function () {
        },

        _setOption: function (/*key , value*/) {
            $.Widget.prototype._setOption.apply(this, arguments);
        },

        destroy : function() {
            var self = this;
            // cleanup code here ...
            this._element.removeClass('tg-stickyheader');

            // remove the cloned header
           
            $.Widget.prototype.destroy.apply(self, arguments);
        }
    });
})(jQuery);

