    $.fn.videoPreview = function(options) {
        return this.each(function() {
            var elm = $(this);
			      var WIDTH = 192;
            
            var img = $('<img/>', { 'src': elm.data('source') }).hide().css({
                'position': 'absolute',
                'cursor': 'pointer'
            }).appendTo(elm);

            var frames = parseFloat(elm.data('frames'));
			var autostart = parseInt(elm.data('autostart'));
            var slider = $('<div/>').hide().css({
                'width': '2px',
                'height': '100%',
                'background': '#ddd',
                'position': 'absolute',
                'z-index': '1',
                'top': '0',
                'opacity': 0.6,
                'cursor': 'pointer'
            }).appendTo(elm);
            
            var width;
            
            function defaultPos() {
                img.css('left',Math.min(0,-Math.floor(2.0/3.0 * frames) * width)); //using time point:2/3 as preview 
            }
            var start = null;
            var can_anim = false;
            var played = true;
            function step(timestamp) {
                if (!start) start = timestamp;
                var left = (timestamp - start)/60;
                if (left < width && can_anim) {
                  slider.show().css('left', left - 1); // -1 because it's 2px width
                  img.css('left', Math.min(0,-Math.floor((left / width) * frames) * width));
                  window.requestAnimationFrame(step);
                } else {
                    if (left>=width) {
                        played = true;
                    }
                    if (can_anim) {
                        defaultPos();
                        slider.hide();
                    }
                }
            }

            img.load(function() {
              $(this).show();	
              if( 1 ) //isNaN(frames) || (frames === 1)
                frames = this.width/WIDTH;				
              width = this.width / frames;
              elm.css('width', width);
              defaultPos();
              if (autostart) {
                played = false;
                can_anim = true;
                window.requestAnimationFrame(step);
              }
            });
            elm.mousemove(function(e) {
                var left = e.clientX - elm.position().left;
                slider.show().css('left', left - 1); // -1 because it's 2px width
                img.css('left', Math.min(0,-Math.floor((left / width) * frames) * width));
                can_anim = false;
            }).mouseout(function(e) {
                can_anim = true;
                if (!played) {
                    window.requestAnimationFrame(step);
                } else {
                    slider.hide();
                    // defaultPos();
                }
            });
            
        });
    };

$('.video-preview').videoPreview();
