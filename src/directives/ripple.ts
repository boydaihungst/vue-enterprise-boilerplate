import type { Directive } from 'vue';

const Ripple: Directive & { color?: string; zIndex?: string | number } = {
  beforeMount: function (el, binding) {
    // Default values.
    let props = {
      event: 'mousedown',
      transition: 600,
    };

    props = setPropsByModifiers(Object.keys(binding.modifiers), props);

    el.addEventListener(props.event, function (event: MouseEvent) {
      rippler(event, el);
    });

    const bg = binding.value || Ripple.color || 'rgba(0, 0, 0, 0.35)';
    const zIndex = Ripple.zIndex || '9999';

    function rippler(event: MouseEvent, el: HTMLElement) {
      const target = el;
      // Get border to avoid offsetting on ripple container position
      const targetBorder = parseInt(
        getComputedStyle(target).borderWidth.replace('px', ''),
      );

      // Get necessary variables
      const rect = target.getBoundingClientRect(),
        left = rect.left,
        top = rect.top,
        width = target.offsetWidth,
        height = target.offsetHeight,
        dx = event.clientX - left,
        dy = event.clientY - top,
        maxX = Math.max(dx, width - dx),
        maxY = Math.max(dy, height - dy),
        style = window.getComputedStyle(target),
        radius = Math.sqrt(maxX * maxX + maxY * maxY),
        border = targetBorder > 0 ? targetBorder : 0;

      // Create the ripple and its container
      const ripple = document.createElement('div'),
        rippleContainer = document.createElement('div');

      rippleContainer.className = 'ripple-container';
      ripple.className = 'ripple';

      //Styles for ripple
      ripple.style.marginTop = '0px';
      ripple.style.marginLeft = '0px';
      ripple.style.width = '1px';
      ripple.style.height = '1px';
      ripple.style.transition =
        'all ' + props.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.position = 'relative';
      ripple.style.zIndex = zIndex + '';
      ripple.style.backgroundColor = bg;

      //Styles for rippleContainer
      rippleContainer.style.position = 'absolute';
      rippleContainer.style.left = 0 - border + 'px';
      rippleContainer.style.top = 0 - border + 'px';
      rippleContainer.style.height = '0';
      rippleContainer.style.width = '0';
      rippleContainer.style.pointerEvents = 'none';
      rippleContainer.style.overflow = 'hidden';

      // Store target position to change it after
      const storedTargetPosition =
        target.style.position.length > 0
          ? target.style.position
          : getComputedStyle(target).position;

      // Change target position to relative to guarantee ripples correct positioning
      if (storedTargetPosition !== 'relative') {
        target.style.position = 'relative';
      }

      rippleContainer.appendChild(ripple);
      target.appendChild(rippleContainer);

      ripple.style.marginLeft = dx + 'px';
      ripple.style.marginTop = dy + 'px';

      // No need to set positioning because ripple should be child of target and to it's relative position.
      // rippleContainer.style.left    = left + (((window.pageXOffset || document.scrollLeft) - (document.clientLeft || 0)) || 0) + "px";
      // rippleContainer.style.top     = top + (((window.pageYOffset || document.scrollTop) - (document.clientTop || 0)) || 0) + "px";
      rippleContainer.style.width = width + 'px';
      rippleContainer.style.height = height + 'px';
      rippleContainer.style.borderTopLeftRadius = style.borderTopLeftRadius;
      rippleContainer.style.borderTopRightRadius = style.borderTopRightRadius;
      rippleContainer.style.borderBottomLeftRadius =
        style.borderBottomLeftRadius;
      rippleContainer.style.borderBottomRightRadius =
        style.borderBottomRightRadius;

      rippleContainer.style.direction = 'ltr';

      setTimeout(function () {
        ripple.style.width = radius * 2 + 'px';
        ripple.style.height = radius * 2 + 'px';
        ripple.style.marginLeft = dx - radius + 'px';
        ripple.style.marginTop = dy - radius + 'px';
      }, 0);

      function clearRipple() {
        setTimeout(function () {
          ripple.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }, 250);

        // Timeout set to get a smooth removal of the ripple
        setTimeout(function () {
          rippleContainer.parentNode?.removeChild(rippleContainer);
        }, 850);

        el.removeEventListener('mouseup', clearRipple, false);
        el.removeEventListener('mouseleave', clearRipple, false);
        el.removeEventListener('dragstart', clearRipple, false);

        // After removing event set position to target to it's original one
        // Timeout it's needed to avoid jerky effect of ripple jumping out parent target
        setTimeout(function () {
          let clearPosition = true;

          for (let i = 0; i < target.childNodes.length; i++) {
            if (target.children[i].className === 'ripple-container') {
              clearPosition = false;
            }
          }

          if (clearPosition) {
            if (storedTargetPosition !== 'static') {
              target.style.position = storedTargetPosition;
            } else {
              target.style.position = '';
            }
          }
        }, props.transition + 250);
      }

      if (event.type === 'mousedown') {
        el.addEventListener('mouseup', clearRipple, false);
        el.addEventListener('mouseleave', clearRipple, false);
        el.addEventListener('dragstart', clearRipple, false);
      } else {
        clearRipple();
      }
    }
  },
};

function setPropsByModifiers(
  modifiers: string[],
  props: {
    event: string;
    transition: number;
  },
) {
  let event = props.event;
  let transition = props.transition;

  modifiers.forEach(function (item) {
    if (isNaN(Number(item))) event = item;
    else transition = +item;
  });
  return {
    transition,
    event,
  };
}

export default Ripple;
