import { Tree } from '@angular-devkit/schematics';

/**
 * Adds a package to the package.json
 */
export function addPackageToPackageJson(
    host: Tree, 
    type: string, 
    packageName: string, 
    version?: string): Tree {
  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json[type]) {
      json[type] = {};
    }

    if (!json[type][packageName]) {
      json[type][packageName] = version || 'latest';
      // override file only if needed
      host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
  }

  return host;
}
