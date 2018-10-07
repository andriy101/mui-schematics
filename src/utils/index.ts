import { Tree, SchematicsException } from '@angular-devkit/schematics';
import * as ts from 'typescript';


export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
      throw new SchematicsException(`Could not find ${path}.`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}