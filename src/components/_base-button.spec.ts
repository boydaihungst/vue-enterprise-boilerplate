import BaseButton from './_base-button.vue';

describe('@components/_base-button', () => {
  it('renders its content', () => {
    const slotContent = 'foo';
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.html()).toContain(slotContent);
  });
});
