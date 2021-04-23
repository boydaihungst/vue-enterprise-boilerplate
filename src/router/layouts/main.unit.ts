import MainLayout from './main.vue';

describe('@layouts/main.vue', () => {
  it('renders its content', () => {
    const slotContent = 'Hello!';
    const wrapper = shallowMount(MainLayout, {
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
