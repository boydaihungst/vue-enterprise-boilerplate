export default function setup() {
  const requirePlugin = require.context(
    // Look for files in the current directory
    '.',
    // Do not look in subdirectories
    false,
    /^((?!index|\.unit\.).)*\.js$/
  );

  // For each matching file name...
  requirePlugin.keys().forEach((fileName) => {
    // Get the component config
    const pluginConfig = requirePlugin(fileName);
    // Get the PascalCase version of the component name
    pluginConfig.install();
  });
}
setup();
