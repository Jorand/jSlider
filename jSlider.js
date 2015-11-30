/**
* @package jSlider
* @author Jorand Le Pape <http://www.github.com/Jorand>
* @github Jorand <http://www.github.com/Jorand/jSlider>
*/
(function($) {

	$.fn.jSlider = function(options) {

		var defauts = {
			'loop': true,
			'duration': 500,
			'offsetLeft': 0
		};

		var parametres = $.extend(defauts, options);

		return this.each(function() {

			var $element = $(this),
				$slider = $element.find('.jSlider'),
				$first = $slider.children().first(),
				$controls = $element.find('.jSlider-control, .jSlider-control-item'),
				$counter = $element.find('.jSlider-counter'),
				$total = $element.find('.jSlider-total'),
				
				childCount = $slider.children().length,
				sliderWidth = $slider.width(),
				childs = [],
				slideCount = 0,

				counter = 1;

			resize();

			$controls.click(function(event) {
				event.preventDefault();

				if (!$(this).hasClass('hide')) {

					slide($(this).hasClass('prev'));
				}
			});

			if (parametres.keyEvent) {

				$(document).keydown(function(e) {
					var k = e.keyCode;
					
					if (
						k >= 37 && k <= 40 // Is arrow keys
						&& !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey // Not meta keys, keeping keyboard shortcuts safe
						&& $('input:focus, select:focus').length === 0 // Not filling a form
					)
						e.preventDefault();
					else
						return;

					if (k == 39) {
						slide();
					}

					if (k == 37) {
						slide(true);
					}
				
				});
			}

			$(window).bind('resize', resize);
			update();

			function resize() {

				var lastChildIndex = 0;

				if (childs.length > 0) {

					lastChildIndex = childs[counter][0].childIndex;
				}

				sliderWidth = $slider.width();

				childs = [];

				var childSlideCount = 1;

				$first.stop(1).css({'margin-left': 0 + 'px'});

				$slider.children().each(function(i) {

					var slideOffset = sliderWidth;

					if (childs[childSlideCount] !== undefined) {
						slideOffset = childs[childSlideCount][0].childOffset + sliderWidth;
					}

					var childOffset = $(this).position().left + $(this).outerWidth();

					if (childOffset > slideOffset) {
						childSlideCount++;
					}

					if (!childs[childSlideCount])
						childs[childSlideCount] = [];

					childs[childSlideCount].push({
						childIndex: i,
						childSlide: childSlideCount,
						childOffset: $(this).position().left
					});
					
				});

				slideCount = childs.length-1;

				if (counter > slideCount)
					counter = slideCount;

				var sliderPos = childs[counter] !== undefined ? childs[counter][0].childOffset : 0;

				$first.stop(1).css({'margin-left': - sliderPos + 'px'});
				
				update();
			}

			function update() {

				if (!parametres.loop) {
						
					$controls.filter('.prev')[(counter === 1 ? 'add' : 'remove')+'Class']('hide');
					$controls.filter('.next')[(counter >= slideCount ? 'add' : 'remove')+'Class']('hide');
				}
				
				/* En px */
				//$first.stop(1).animate({'margin-left': -childWidth * (counter - 1) + 'px'}, parametres.duration);

				/* En % */
				//$first.stop(1).animate({'margin-left': - ((counter - 1) / slideCount) * 100 + '%'}, parametres.duration);

				/* En px step */
				var sliderPos = childs[counter] !== undefined ? childs[counter][0].childOffset : 0;

				if (sliderPos > 0) {
					sliderPos -= parametres.offsetLeft;
				}

				$first.stop(1).animate({'margin-left': - sliderPos + 'px'}, parametres.duration);
				
				$counter.text(counter);
				$total.text(slideCount);

			}

			function slide(prev) {

				prev = prev === true;
					
				if (prev) {
					counter --;
				}
				else {
					counter ++;
				}

				if (counter === 0) {
					counter = parametres.loop ? slideCount : 1;
				}

				if (counter > slideCount) {
					counter = parametres.loop ? 1 : slideCount;
				}

				update();
			}

		});
	};

})(jQuery);