import { h } from 'vue';

import BaseLink from './_base-link.vue';

const mountBaseLink = (options = {}) => {
  return mount(BaseLink, {
    global: {
      stubs: {
        RouterLink: {
          render() {
            return h(
              'a',
              { 'data-router-link': 'true' },
              this.$slots.default()
            );
          },
        },
      },
    },
    slots: {
      default: 'hello',
    },
    ...options,
  });
};

describe('@components/_base-link', () => {
  const originalConsoleWarn = global.console.warn;
  let warning: string | undefined;
  beforeEach(() => {
    warning = undefined;
    global.console.warn = jest.fn((text) => {
      warning = text;
    });
  });
  afterAll(() => {
    global.console.warn = originalConsoleWarn;
  });

  it('exports a valid component', () => {
    expect(BaseLink).toBeAComponent();
  });

  it('warns about missing required props', () => {
    mountBaseLink();
    expect(console.warn).toHaveBeenCalled();
    expect(warning).toMatch(/Invalid <BaseLink> props/);
  });

  it('warns about an invalid href', () => {
    mountBaseLink({
      props: {
        href: '/some/local/path',
      },
    });
    expect(console.warn).toHaveBeenCalled();
    expect(warning).toMatch(/Invalid <BaseLink> href/);
  });

  it('warns about an insecure href', () => {
    mountBaseLink({
      props: {
        href: 'http://google.com',
      },
    });
    expect(console.warn).toHaveBeenCalled();
    expect(warning).toMatch(/Insecure <BaseLink> href/);
  });

  it('renders an anchor element when passed an `href` prop', () => {
    const externalUrl = 'https://google.com/';
    const wrapper = mountBaseLink({
      props: {
        href: externalUrl,
      },
    });
    const element = wrapper.element as HTMLAnchorElement;
    expect(console.warn).not.toHaveBeenCalled();
    expect(element.tagName).toEqual('A');
    expect(element.href).toEqual(externalUrl);
    expect(element.target).toEqual('_blank');
    expect(element.textContent).toEqual('hello');
  });

  it('renders a RouterLink when passed a `name` prop', () => {
    const routeName = 'home';
    const wrapper = mountBaseLink({
      props: {
        name: routeName,
      },
    });
    const element = wrapper.element as HTMLAnchorElement;
    const vm = wrapper.vm;
    expect(console.warn).not.toHaveBeenCalled();
    expect(element.dataset.routerLink).toEqual('true');
    expect(element.textContent).toEqual('hello');
    expect(vm.routerLinkTo({})).toEqual({ name: routeName, params: {} });
  });

  it('renders a RouterLink when passed `name` and `params` props', () => {
    const routeName = 'home';
    const routeParams = { foo: 'bar' };
    const wrapper = mountBaseLink({
      props: {
        name: routeName,
        params: routeParams,
      },
    });
    const element = wrapper.element as HTMLAnchorElement;
    const vm = wrapper.vm;
    expect(console.warn).not.toHaveBeenCalled();
    expect(element.dataset.routerLink).toEqual('true');
    expect(element.textContent).toEqual('hello');
    expect(vm.routerLinkTo({})).toEqual({
      name: routeName,
      params: routeParams,
    });
  });

  it('renders a RouterLink when passed a `to` prop', () => {
    const routeName = 'home';
    const wrapper = mountBaseLink({
      props: {
        to: {
          name: routeName,
        },
      },
    });
    const element = wrapper.element as HTMLAnchorElement;
    const vm = wrapper.vm;
    expect(console.warn).not.toHaveBeenCalled();
    expect(element.dataset.routerLink).toEqual('true');
    expect(element.textContent).toEqual('hello');
    expect(vm.routerLinkTo({})).toEqual({ name: routeName, params: {} });
  });

  it('renders a RouterLink when passed a `to` prop with `params`', () => {
    const routeName = 'home';
    const routeParams = { foo: 'bar' };
    const wrapper = mountBaseLink({
      props: {
        to: {
          name: routeName,
          params: routeParams,
        },
      },
    });
    const element = wrapper.element as HTMLAnchorElement;
    const vm = wrapper.vm;
    expect(console.warn).not.toHaveBeenCalled();
    expect(element.dataset.routerLink).toEqual('true');
    expect(element.textContent).toEqual('hello');
    expect(vm.routerLinkTo({})).toEqual({
      name: routeName,
      params: routeParams,
    });
  });
});
