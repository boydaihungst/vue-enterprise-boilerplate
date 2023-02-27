import type { App, Directive } from 'vue';
export function getGlobalDirectiveAll() {
  // import all directive files in this directory
  // https://vitejs.dev/guide/features.html#glob-import
  // https://github.com/mrmlnc/fast-glob#pattern-syntax
  const directiveObject: Record<string, Directive> = import.meta.glob(
    [
      './*.{js,ts}',
      // Except these file
      '!./(setup|index|*.spec|*.unit|*.test|_globals).{js,ts}',
    ],
    {
      //https://vitejs.dev/guide/features.html#named-imports
      eager: true,
      import: 'default',
    },
  );

  return Object.entries(directiveObject).map(([filePath, directiveModule]) => {
    // get kebab case for directive. example: ./require-mark.ts-> require-mark -> v-require-mark=""
    const directiveName: string = filePath
      // Remove the "./" from the beginning
      .replace(/^\.\//, '')
      // Remove the file extension from the end
      .replace(/\.\w+$/, '');

    return {
      name: directiveName,
      directive: directiveModule,
    };
  });
}

export function registerGlobalDirective(app: App<Element>) {
  const listGlobalDirective = getGlobalDirectiveAll();

  listGlobalDirective.forEach((directive) =>
    app.directive(directive.name, directive.directive),
  );
}
