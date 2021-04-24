import { App, defineAsyncComponent } from 'vue';
import requireContext from 'require-context.macro';

export function getGlobalViewLayoutAll() {
  const requireComponent = requireContext(
    '.',
    false,
    /^(?!.*(?:layout.vue$)).*\.vue$/
  );

  return requireComponent.keys().map((layoutFileName) => {
    const layoutComponentName = layoutFileName.replace(/(^.\/)|(\.vue$)/g, '');
    const asynComponent: Promise<any> = requireComponent(layoutFileName);

    return {
      name: layoutComponentName,
      asynComponent,
    };
  });
}
export function registerLayoutComponent(app: App<Element>) {
  const listGlobalViewLayout = getGlobalViewLayoutAll();
  listGlobalViewLayout.forEach((component) =>
    app.component(
      component.name,
      defineAsyncComponent(() => import(`./${component.name}.vue`))
    )
  );
}
