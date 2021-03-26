import Vue from 'vue';

const install = () => {
  Vue.directive('required-mark', {
    bind(el, { value }) {
      const spanEl = document.createElement('span');
      spanEl.innerHTML = ' *';
      spanEl.classList.add('positive'); // TODO: UPDATE
      if (value && typeof value === 'object') {
        spanEl.style.color = value.color;
        spanEl.style.fontSize = '12px';
        spanEl.innerHTML = ` (${value.text})`;
      }
      el.appendChild(spanEl);
    },
  });
};
export default install;
