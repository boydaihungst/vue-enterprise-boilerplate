import Vue from 'vue';
import Ripple from 'vue-ripple-directive';

const install = () => {
  Ripple.color = 'rgba(255, 255, 255, 0.35)';
  Vue.directive('ripple', Ripple);
};
export default install;
