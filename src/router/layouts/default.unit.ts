import DefaultLayout from './default.vue';

describe('@layouts/default.vue', () => {
  it('renders its content', () => {
    const slotContent = 'Hello!';
    const wrapper = shallowMount(DefaultLayout, {
      slots: {
        default: {
          render() {
            return slotContent;
          },
        },
      },
    });
    expect(wrapper.get('[data-test="main-container"]').html()).toContain(
      slotContent
    );
  });
});
