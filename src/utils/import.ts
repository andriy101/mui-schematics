import { Tree } from '@angular-devkit/schematics';
import { insertImport, 
         getSourceNodes, 
         findNodes } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';
import * as ts from 'typescript';

import { getSourceFile } from './';

export function insertBeforeLastElement(host: Tree, filePath: string, componentToAdd: string) {
  const moduleSource = getSourceFile(host, filePath);
  let alreadyExists = false;
  const closingElements = getSourceNodes(moduleSource)
    .filter(node => {
      if ((<any>node).tagName && (<any>node).tagName.escapedText === componentToAdd) {
        alreadyExists = true;
      } 
      const cond = (<any>node).tagName && (<any>node).tagName.escapedText === 'MuiThemeProvider'
      return !cond && node.kind === ts.SyntaxKind.JsxClosingElement;
    })
    .sort((a, b) => a.getStart() - b.getStart());

  if (!alreadyExists && closingElements && closingElements.length) {
    const recorder = host.beginUpdate(filePath);
    const insertPosition = closingElements[closingElements.length - 1].getStart();
    recorder.insertRight(insertPosition, `  <${componentToAdd} />\n` + '      ');
    host.commitUpdate(recorder);
  }  
}

export function insertAfterFirstElement(host: Tree, filePath: string, componentToAdd: string) {
  const moduleSource = getSourceFile(host, filePath);
  let alreadyExists = false;
  const openingElements = getSourceNodes(moduleSource)
    .filter(node => {
      if ((<any>node).tagName && (<any>node).tagName.escapedText === componentToAdd) {
        alreadyExists = true;
      } 
      const cond = (<any>node).tagName && (<any>node).tagName.escapedText === 'MuiThemeProvider'
      return !cond && node.kind === ts.SyntaxKind.JsxOpeningElement;
    })
    .sort((a, b) => a.getStart() - b.getStart());

  if (!alreadyExists && openingElements && openingElements.length) {
    const recorder = host.beginUpdate(filePath);
    const insertPosition = openingElements[0].getEnd();
    recorder.insertRight(insertPosition, `\n          <${componentToAdd} />` + '      ');
    host.commitUpdate(recorder);
  }  
}

/**
 * Adds a module import
 */
export function addImportToFile(host: Tree, 
  fileToEdit: string, 
  symbolName: string,
  moduleName: string,
  isDefault: boolean = false): Tree {
  const fileToEditSource = getSourceFile(host, fileToEdit); 

  const recorder = host.beginUpdate(fileToEdit);
  
  const change = insertImport(fileToEditSource,
                              fileToEdit,
                              symbolName, 
                              moduleName,
                              isDefault) as InsertChange;
  if (change.toAdd) {
    recorder.insertLeft(change.pos, change.toAdd);
  }

  host.commitUpdate(recorder);

  return host;
}

/**
 * Adds a file import
 */
export function addFileImportToFile(host: Tree, modulePath: string, fileNameToAdd: string, addEmptyLine: boolean = false, patternToRemove?: RegExp): Tree {
  const moduleSource = getSourceFile(host, modulePath);
  const fileImport = findFileImport(moduleSource, fileNameToAdd, patternToRemove);

  const recorder = host.beginUpdate(modulePath);

  // remove existing import, assure correct import order
  if (fileImport) {
    recorder.remove(fileImport.pos, fileImport.end - fileImport.pos);
  }

  const imports = getSourceNodes(moduleSource)
    .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
    .sort((a, b) => a.getStart() - b.getStart());
  const insertPosition = imports[imports.length - 1].getEnd();
  const importText = `${addEmptyLine ? '\n' : ''}\n${buildFileImportText(fileNameToAdd)}`;
  recorder.insertRight(insertPosition, importText);
  host.commitUpdate(recorder);

  return host;
}

/**
 * Determine if an import already exists.
 */
export function findFileImport(source: ts.SourceFile,
  fileName: string,
  patternToRemove?: RegExp): ts.Node | undefined {
  const allNodes = getSourceNodes(source);
  const matchingNodes = allNodes
    .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
    .filter((imp: ts.ImportDeclaration) => 
      imp.getText() === buildFileImportText(fileName) ||
      (patternToRemove && patternToRemove.test(imp.getText())));

  return matchingNodes.length ? matchingNodes.pop() : undefined;
}

/**
 * Determine if an import already exists.
 */
export function findModuleImport(source: ts.SourceFile,
  classifiedName: string,
  importPath: string): ts.Node | undefined {
  const allNodes = getSourceNodes(source);
  const matchingNodes = allNodes
    .filter(node => node.kind === ts.SyntaxKind.ImportDeclaration)
    .filter((imp: ts.ImportDeclaration) => imp.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral)
    .filter((imp: ts.ImportDeclaration) => {
      return (imp.moduleSpecifier as ts.StringLiteral).text === importPath;
    })
    .filter((imp: ts.ImportDeclaration) => {
      if (!imp.importClause) {
        return false;
      }
      const nodes = findNodes(imp.importClause, ts.SyntaxKind.ImportSpecifier)
        .filter(n => n.getText() === classifiedName);

      return nodes.length > 0;
    });

  return matchingNodes.length ? matchingNodes.pop() : undefined;
}

function buildFileImportText(fileName: string) {
  return `import '${fileName}';`;
}
