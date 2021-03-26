const requireDirectives = require.context(
  // Look for files in the current directory
  '.',
  // Do not look in subdirectories
  false,
  /^((?!index|\.unit\.|_globals).)*\.js$/
);

// For each matching file name...
requireDirectives.keys().forEach((fileName) => {
  // Get the component config
  const directive = requireDirectives(fileName);
  // Get the PascalCase version of the component name
  directive.default();
});
