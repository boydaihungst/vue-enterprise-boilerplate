import { flushPromises } from '@vue/test-utils';

describe('@utils/dispatch-action-for-all-modules', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('dispatches actions from NOT namespaced modules', async () => {
    jest.doMock('@state/modules/module-loader', () => ({
      moduleA: {
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
      },
      moduleB: {
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
      },
    }));

    await (await import('./dispatch-action-for-all-modules')).default(
      'someAction'
    );

    const { moduleA, moduleB } = (
      await import('@state/modules/module-loader')
    ).default;
    flushPromises();
    expect(moduleA.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleB.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleA.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleB.actions.otherAction).not.toHaveBeenCalled();
  });

  it('dispatches actions from namespaced modules', async () => {
    jest.doMock('@state/modules/module-loader', () => ({
      moduleA: {
        namespaced: true,
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
      },
      moduleB: {
        namespaced: true,
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
      },
    }));

    await (await import('./dispatch-action-for-all-modules')).default(
      'someAction'
    );

    const { moduleA, moduleB } = (
      await import('@state/modules/module-loader')
    ).default;
    flushPromises();
    expect(moduleA.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleB.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleA.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleB.actions.otherAction).not.toHaveBeenCalled();
  });

  it('dispatches actions from deeply nested NOT namespaced modules', async () => {
    jest.doMock('@state/modules/module-loader', () => ({
      moduleA: {
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
        modules: {
          moduleB: {
            actions: {
              someAction: jest.fn(),
              otherAction: jest.fn(),
            },
            modules: {
              moduleC: {
                actions: {
                  someAction: jest.fn(),
                  otherAction: jest.fn(),
                },
              },
            },
          },
        },
      },
    }));

    await (await import('./dispatch-action-for-all-modules')).default(
      'someAction'
    );

    const { moduleA } = (await import('@state/modules/module-loader')).default;
    const { moduleB } = moduleA.modules;
    const { moduleC } = moduleB.modules;
    flushPromises();
    expect(moduleA.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleB.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleC.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleA.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleB.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleC.actions.otherAction).not.toHaveBeenCalled();
  });

  it('dispatches actions from deeply nested namespaced modules', async () => {
    jest.doMock('@state/modules/module-loader', () => ({
      moduleA: {
        namespaced: true,
        actions: {
          someAction: jest.fn(),
          otherAction: jest.fn(),
        },
        modules: {
          moduleB: {
            namespaced: true,
            actions: {
              someAction: jest.fn(),
              otherAction: jest.fn(),
            },
            modules: {
              moduleC: {
                namespaced: true,
                actions: {
                  someAction: jest.fn(),
                  otherAction: jest.fn(),
                },
              },
            },
          },
        },
      },
    }));

    await (await import('./dispatch-action-for-all-modules')).default(
      'someAction'
    );

    const { moduleA } = (await import('@state/modules/module-loader')).default;
    const { moduleB } = moduleA.modules;
    const { moduleC } = moduleB.modules;
    flushPromises();
    expect(moduleA.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleB.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleC.actions.someAction).toHaveBeenCalledTimes(1);
    expect(moduleA.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleB.actions.otherAction).not.toHaveBeenCalled();
    expect(moduleC.actions.otherAction).not.toHaveBeenCalled();
  });
});
