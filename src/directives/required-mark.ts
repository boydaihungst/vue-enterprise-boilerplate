import type { Directive } from 'vue';

const directive: Directive = {
  created(el, { value }) {
    const spanEl = document.createElement('span');

    spanEl.innerHTML = ' *';
    spanEl.classList.add('positive');
    if (value && typeof value === 'object') {
      spanEl.style.color = value.color;
      spanEl.style.fontSize = '12px';
      spanEl.innerHTML = ` (${value.text})`;
    }
    el.appendChild(spanEl);
  },
};

export default directive;
