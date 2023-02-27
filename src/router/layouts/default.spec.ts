import DefaultLayout from '@layouts/default.vue';
import { config } from '@vue/test-utils';
beforeAll(() => {
  config.global.renderStubDefaultSlot = true;
});

afterAll(() => {
  config.global.renderStubDefaultSlot = false;
});
describe('@layouts/default.vue', () => {
  it('Renders its content', async () => {
    const slotContent = 'Hello!';
    const wrapper = mount(DefaultLayout, {
      slots: {
        default: slotContent,
      },
      global: {
        stubs: {
          NavBar: true,
        },
      },
    });

    expect(wrapper.get('main').html()).toContain(slotContent);
  });
});
