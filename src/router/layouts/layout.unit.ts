import { InjectKey } from '@utils/const';
import Layout from './layout.vue';

describe('@layouts/layout.vue', () => {
  it('can change layout', () => {
    const changeLayoutTrigger = jest.fn();
    const layoutNameToLoad = 'default';
    const slotContent = 'Hello!';
    shallowMount(Layout, {
      props: {
        is: layoutNameToLoad,
      },
      slots: {
        default: {
          render() {
            return slotContent;
          },
        },
      },
      global: {
        provide: {
          [InjectKey.changeLayout as any]: changeLayoutTrigger,
        },
      },
    });
    expect(changeLayoutTrigger).toBeCalledWith(layoutNameToLoad);
  });
});
