import { InjectKey } from '@utils/const';
import Layout from './layout.vue';

describe('@layouts/main.vue', () => {
  it('can change layout', () => {
    const changeLayoutTrigger = jest.fn();
    const layoutNameToLoad = 'main';
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
