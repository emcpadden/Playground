// This utility jquery plug in is used to determine if an element is visible 
// within the viewport of the browser
// http://jsfiddle.net/sod2pak3/
// http://jsfiddle.net/z4ugg8n9/5/

// There are several options that can be used to determine if any part of the element
// is visible, or just the top, bottom, left or right sides, etc.

// The following options can be passed in as parameters of an 
// object literal:
// (note: if options are not passed in then we will return  true 
// if any part of the element is visible)
// 
// top: "ignore"|"visible"|"hidden"|"hiddenAbove"|"hiddenBelow" (default: "ignore")
//		"ignore": we will not take the visiblity of the top of the element into account
//		"visible": checks to see if the top of the element is visible
//		"hidden": checks to see if the top of the element is hidden
//		"hiddenAbove": checks to see if the top of the element is hidden above the viewable area
//		"hiddenBelow": checks to see if the top of the element is hidden below the viewable area
// 
// bottom: "ignore"|"visible"|"hidden"|"hiddenAbove"|"hiddenBelow" (default: "ignore")
//		"ignore": we will not take the visiblity of the bottom of the element into account
//		"visible": checks to see if the bottom of the element is visible
//		"hidden": checks to see if the bottom of the element is hidden
//		"hiddenAbove": checks to see if the bottom of the element is hidden above the viewable area
//		"hiddenBelow": checks to see if the bottom of the element is hidden below the viewable area
// 
// left: "ignore"|"visible"|"hidden"|"hiddenLeft"|"hiddenRight" (default: "ignore")
//		"ignore": we will not take the visiblity of the left side of the element into account
//		"visible": checks to see if the left side of the element is visible
//		"hidden": checks to see if the left side of the element is hidden
//		"hiddenAbove": checks to see if the left side of the element is hidden above the viewable area
//		"hiddenBelow": checks to see if the left side of the element is hidden below the viewable area
// 
// right: "ignore"|"visible"|"hidden"|"hiddenLeft"|"hiddenRight" (default: "ignore")
//		"ignore": we will not take the visiblity of the right side of the element into account
//		"visible": checks to see if the right side of the element is visible
//		"hidden": checks to see if the right side of the element is hidden
//		"hiddenAbove": checks to see if the right side of the element is hidden above the viewable area
//		"hiddenBelow": checks to see if the right side of the element is hidden below the viewable area
// 
// criteria: "any"|"all"|"none" (default: "any") - 
//			"any": if no criteria (top|bottom|left|right) is specified, we will return true if any part of the element is visible
//				if there is some criteria (top|bottom|left|right) specified, then we will return true if any
//					of the specified criteria is met
//
//			"all": if no criteria (top|bottom|left|right) is specified, we will return true if the entire element is visible
//				if there is some criteria (top|bottom|left|right) specified, then we will return true if ALL 
//					of the specified criteria is met
//
//			"none": if no criteria (top|bottom|left|right) is specified, we will return true if none of the element is showing
//				if there is some criteria (top|bottom|left|right) specified, then we will return true NONE of
//					the specified criteria is met

(function($) {
	// if its not already defined, in case this gets included more than once
	$.fn.tgIsElementVisible = function(options){

		var isVisible = false;

		var defaultOptions = {
			criteria: "any",
			top: "ignore",  		// ignore, visible, hidden, hiddenAbove, hiddenBelow
			bottom: "ignore", 		// ignore, visible, hidden, hiddenAbove, hiddenBelow
			left: "ignore", 		// ignore, visible, hidden, hiddenLeft, hiddenRight
			right: "ignore" 		// ignore, visible, hidden, hiddenLeft, hiddenRight
		};
		options = $.extend(defaultOptions, options || {});

		var win = $(window);
		var viewport = {
			top : win.scrollTop(),
			left : win.scrollLeft()
		};
		viewport.right = viewport.left + win.width();
		viewport.bottom = viewport.top + win.height();

		var bounds = this.offset();
		bounds.right = bounds.left + this.outerWidth();
		bounds.bottom = bounds.top + this.outerHeight();

		var status = {
			any: (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom)),
			top: {
				hiddenAbove: bounds.top < viewport.top,
				hiddenBelow: bounds.top > viewport.bottom
			},
			bottom: {
				hiddenAbove: bounds.bottom < viewport.top,
				hiddenBelow: bounds.bottom > viewport.bottom
			},
			left: {
				hiddenLeft: bounds.left < viewport.left,
				hiddenRight: bounds.left > viewport.right
			},
			right: {
				hiddenLeft: bounds.right < viewport.left,
				hiddenRight: bounds.right > viewport.right
			}
		};
		status.top.hidden = status.top.hiddenAbove || status.top.hiddenBelow;
		status.top.visible = status.any && !status.top.hidden;
		status.bottom.hidden = status.bottom.hiddenAbove || status.bottom.hiddenBelow;
		status.bottom.visible = status.any && !status.bottom.hidden;
		status.left.hidden = status.left.hiddenLeft || status.left.hiddenRight;
		status.left.visible = status.any && !status.left.hidden;
		status.right.hidden = status.right.hiddenLeft || status.right.hiddenRight;
		status.right.visible = status.any && !status.right.hidden;
		status.all = status.top.visible && status.bottom.visible && status.left.visible && status.right.visible;
		status.none = !status.any;

		var criteriaTotalCount = (options.top !== "ignore" ? 1 : 0) + (options.bottom !== "ignore" ? 1 : 0) + (options.left !== "ignore" ? 1 : 0) + (options.right !== "ignore" ? 1 : 0);
		var criteriaPassedCount = 0;

		if(options.top !== "ignore") {
			criteriaPassedCount += (status.top[options.top] ? 1 : 0);
		}
		if(options.bottom !== "ignore") {
			criteriaPassedCount += (status.bottom[options.bottom] ? 1 : 0);
		}
		if(options.left !== "ignore") {
			criteriaPassedCount += (status.left[options.left] ? 1 : 0);
		}
		if(options.right !== "ignore") {
			criteriaPassedCount += (status.right[options.right] ? 1 : 0);
		}

		if (options.criteria === "any") {
			// if "any", and no criteria is specified in options (top|bottom|left|right) then return true
			//			if any part of the element is showing
			//	if some criteria is specified (top|bottom|left|right), then return true if any of the sides are visible that 
			//			are specified in the options
			isVisible = (criteriaTotalCount === 0 ? status.any : criteriaPassedCount > 0);
		} else if (options.criteria === "all") {
			// if all and no criteria is specified (top|bottom|left|right), then return true if the entire item (all sides) is visible
			// 
			// if some criteria is specified (top|bottom|left|right), then return true if all the specified 
			//		sides are visible
			isVisible = (criteriaTotalCount === 0 ? 
				(status.all) : 
				criteriaTotalCount === criteriaPassedCount);
		} else if (options.criteria === "none") {
			// if "none" and no criteria is specified (top|bottom|left|right), then return true if no part of the 
			//		element is visible
			// if some criteria is specified (top|bottom|left|right), then return true if all the specified 
			//		only if none of the sides specified are visible
			isVisible = criteriaTotalCount === 0 ? 
				status.none : 
				(criteriaPassedCount === 0);
		}

		return isVisible;
	};
})(jQuery);
	