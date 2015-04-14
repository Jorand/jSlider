(function($) {

	$.fn.jSlider = function(options) {

		var defauts = {
			'loop': true,
			'duration': 500
		};

		var parametres = $.extend(defauts, options);

		return this.each(function() {

			var $element = $(this),
				$slider = $element.find('.jSlider'),
				$first = $slider.children().first(),
				$controls = $element.find('.jSlider-control'),

				childCount = $slider.children().length,
				sliderWidth = $slider.width(),
				childWidth = $slider.children().first().outerWidth(),
				slideCount = Math.round(sliderWidth / childWidth),

				slideCounter = 1,
				counter = 1;
			
			$controls.click(function(event) {
				event.preventDefault();

				slide($(this).hasClass('prev'));
			});

			$(window).bind('resize', resize);
			update();

			function resize() {

				sliderWidth = $slider.width();
				childWidth = $slider.children().first().outerWidth();
				slideCount = Math.round(sliderWidth / childWidth);
				
				update();
			}

			function update() {

				if (!parametres.loop) {
						
					$controls.filter('.prev')[(counter === 1 ? 'add' : 'remove')+'Class']('hide');
					$controls.filter('.next')[(counter >= childCount ? 'add' : 'remove')+'Class']('hide');
				}
				
				/* En px */
				//$first.stop(1).animate({'margin-left': -childWidth * (counter - 1) + 'px'}, parametres.duration);

				/* En % */
				$first.stop(1).animate({'margin-left': - ((counter - 1) / slideCount) * 100 + '%'}, parametres.duration);

			}

			function slide(prev) {

				prev = prev === true;
					
				if (prev) {
					counter -= slideCount;
				}
				else {
					counter += slideCount;
				}

				if (counter === 0) {
					counter = parametres.loop ? childCount : 1;
				}

				if (counter > childCount) {
					counter = parametres.loop ? 1 : childCount;
				}

				slideCounter = counter / slideCount;

				update();
			}

		});
	};

})(jQuery);
