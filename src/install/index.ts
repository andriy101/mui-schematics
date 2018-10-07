import { chain, noop, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

import { addPackageToPackageJson } from '../utils/package';
import { Schema } from './schema';
import { addThemePaletteType } from '../utils/theme';

/**
 * Scaffolds the basics of a PrimeReact application, this includes:
 *  - Add Packages to package.json
 *  - Adds pre-built theme files imports
 */
export default function(options: Schema): Rule {
  return chain([
    options.skipInstallModules ? noop() : installNpmModules(),
    (host: Tree) => {
      addThemePaletteType(host, options.mainFile, options.theme);
    }
  ]);
}

/**
 * Add material ui packages to package.json if not already present.
 * Run npm install with material ui modules.
 */
function installNpmModules() {
  return (host: Tree, context: SchematicContext) => {
    const packageNames = [
      '@material-ui/core',
      '@material-ui/icons',
      'typeface-roboto'
    ];
    packageNames.forEach(pkg => addPackageToPackageJson(host, 'dependencies', pkg));
    // install latest packages
    const installerTask = new NodePackageInstallTask({
      packageManager: 'yarn'//,
      // packageName: packageNames.join(' ')
    });
    installerTask.toConfiguration = function () {
      return {
        name: 'node-package',
        options: {
          command: 'add',
          quiet: this.quiet,
          workingDirectory: this.workingDirectory,
          packageManager: this.packageManager,
          packageName: this.packageName,
        },
      };
    }
    context.addTask(installerTask);

    return host;
  };
}
