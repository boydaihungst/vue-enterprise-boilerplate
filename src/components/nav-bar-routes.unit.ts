import { h } from 'vue';
import NavBarRoutes from './nav-bar-routes.vue';

const mountRoutes = (options) => {
  return mount(
    {
      render() {
        return h('ul', null, h(NavBarRoutes, { ...options.props }));
      },
    },
    {
      global: {
        stubs: {
          BaseLink: {
            render() {
              return h('a', null, this.$slots.default());
              // return <a>{this.$slots.default()}</a>;
            },
          },
          ...options.stubs,
        },
      },
      ...options,
    }
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
