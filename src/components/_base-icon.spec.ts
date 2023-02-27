import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { mdiSync } from '@mdi/js';
import { IconSource } from '@src/constraint/const';
import BaseIcon from './_base-icon.vue';

// NOTE: Mock part of a module
// https://vitest.dev/api/vi.html#vi-mock
vi.mock('vue', async () => {
  const vueModule = await vi.importActual<typeof import('vue')>('vue');

  return {
    // include all original functions.
    ...vueModule,
    // replace only function useCssModule from vue module
    useCssModule: vi.fn().mockImplementation((): Record<string, string> => {
      return {
        iconCustomSomeIcon: 'generated-class-name',
      };
    }),
  };
});
// clear mock module above
afterAll(() => {
  vi.doUnmock('vue');
  vi.resetModules();
});

describe('@components/_base-icon', () => {
  it('renders a font-awesome icon', () => {
    const { element } = mount(BaseIcon, {
      props: {
        source: IconSource.AWESOME_FONT,
        icon: faUser,
      },
    });

    expect(element.tagName).toEqual('svg');
    expect(Array.from(element.classList)).toEqual(
      expect.arrayContaining(['svg-inline--fa', 'fa-user', 'fa-sm']),
    );
  });

  it('renders a mdi icon', () => {
    const { element } = mount(BaseIcon, {
      props: {
        source: IconSource.MDI_FONT,
        icon: mdiSync,
      },
    });

    expect(element.tagName).toEqual('svg');
    expect(element.firstElementChild?.tagName).toEqual('path');
    expect(
      element.firstElementChild?.attributes.getNamedItem('d')?.value,
    ).toEqual(mdiSync);
  });

  it('renders a custom icon', async () => {
    const mockStyleCss = {
      iconCustomSomeIcon: 'generated-class-name',
    };
    const { element } = shallowMount(BaseIcon as any, {
      ...(await createComponentMocks({
        // options component only ($style)
        style: mockStyleCss,
      })),
      props: {
        source: IconSource.CUSTOM,
        icon: 'some-icon',
      },
    });

    expect(element.className).toEqual('generated-class-name');
  });
});
