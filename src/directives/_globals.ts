import { App } from 'vue';
import requireContext from 'require-context.macro';

export function getGlobalDirectiveAll() {
  const requireDirectives = requireContext(
    '.',
    false,
    /^((?!index|\.unit\.|_globals).)*\.(ts|js)$/
  );
  return requireDirectives?.keys().map((fileName) => {
    // Get the component config
    const directiveConfig = requireDirectives(fileName);
    // Get the PascalCase version of the directive name
    const directive = directiveConfig.default || directiveConfig;
    return {
      name: fileName,
      directive: directive,
    };
  });
}

export function registerGlobalDirective(app: App<Element>) {
  const listGlobalDirective = getGlobalDirectiveAll();
  listGlobalDirective.forEach((directive) =>
    app.directive(directive.name, directive.directive)
  );
}
