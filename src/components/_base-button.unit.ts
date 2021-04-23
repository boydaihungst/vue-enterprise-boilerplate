import BaseButton from './_base-button.vue';

describe('@components/_base-button', () => {
  it('renders its content', () => {
    const slotContent = 'foo';
    const wrapper = shallowMount(BaseButton, {
      slots: {
        default: {
          render() {
            return slotContent;
          },
        },
      },
    });
    expect(wrapper.get('[data-test="base-button"]').html()).toContain(
      slotContent
    );
  });
});
