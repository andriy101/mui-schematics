import { strings } from '@angular-devkit/core';
import { chain, 
         Rule,
         Tree,
         mergeWith,
         move,
         apply,
         filter,
         url, 
         noop,
         template,
         schematic } from '@angular-devkit/schematics';
import { Schema } from './schema';

import { addImportToFile, insertBeforeLastElement } from '../utils/import';


/**
 * Scaffolds a new tree table component.
 * Internally it bootstraps the base component schematic
 */
export default function(options: Schema): Rule {
  return chain([
    options.init ? schematic('install', {}) : noop(),
    mergeWith(apply(url('./files'), [
      options.noTest ? filter(path => !path.endsWith('.test.js')) : noop(),
      filter(path => !path.endsWith('__.js') || path.includes('@singleLine') === options.singleLine),
      template({
        ...strings,
        ...options,
        'if-flat': (s: string) => options.flat ? '' : s,
        'singleLine': (s: string) => s 
      }),
      move(`src/${options.path}`)
    ])),
    (host: Tree) => {
      addImportToFile(
        host, 
        options.mainFile, 
        strings.classify(options.name), 
        `./${options.path}/${strings.dasherize(options.name)}/${strings.classify(options.name)}`,
        true)
    },
    (host: Tree) => {
      insertBeforeLastElement(
        host, 
        options.mainFile, 
        strings.classify(options.name))
    }
  ]);
}
