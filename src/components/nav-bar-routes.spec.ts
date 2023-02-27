import { h } from 'vue';
import NavBarRoutes from './nav-bar-routes.vue';

const mountRoutes = (options: any) => {
  return mount(
    {
      render() {
        return h('ul', null, h(NavBarRoutes, options.props));
      },
    },
    {
      global: {
        stubs: {
          BaseLink: {
            render() {
              return h(
                'a',
                null,
                // Fake scopedSlot of BaseLink
                this.$slots.default({
                  href: 'aaa',
                  navigate: '/aaa',
                  isExactActive: false,
                }),
              );
            },
          },
          ...options.stubs,
        },
      },
      ...options,
    },
  );
};

describe('@components/nav-bar-routes', () => {
  it('correctly renders routes with text titles', () => {
    const { element } = mountRoutes({
      props: {
        routes: [
          {
            name: 'aaa',
            title: 'bbb',
          },
        ],
      },
    });

    expect(element.textContent).toEqual('bbb');
  });

  it('correctly renders routes with function titles', () => {
    const { element } = mountRoutes({
      props: {
        routes: [
          {
            name: 'aaa',
            title: () => 'bbb',
          },
        ],
      },
    });

    expect(element.textContent).toEqual('bbb');
  });
});
