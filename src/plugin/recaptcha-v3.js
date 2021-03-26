// import 'reflect-metadata';
import Vue from 'vue';
import { VueReCaptcha } from 'vue-recaptcha-v3';

const install = () => {
  Vue.use(VueReCaptcha, {
    siteKey: '6LdCSMQZAAAAAGBQ7Sf9Utah9slReKUYuLMVhzKw',
    loaderOptions: {
      useRecaptchaNet: true,
      autoHideBadge: false,
      renderParameters: {
        container: 'body',
        badge: 'bottomright',
        size: 'invisible',
      },
    },
  });
};

export { install };
