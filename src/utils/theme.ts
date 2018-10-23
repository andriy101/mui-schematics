import { Tree } from '@angular-devkit/schematics';
import { isImported, getSourceNodes } from '@schematics/angular/utility/ast-utils';
import * as ts from 'typescript';

import { addImportToFile } from './import';
import { getSourceFile } from './';


export function addThemePaletteType(host: Tree, filePath: string, type: 'dark' | 'light') {
  const fileSource = getSourceFile(host, filePath);
  if (!isImported(fileSource, 'MuiThemeProvider', '@material-ui/core/styles')) {
    let classDeclaration: ts.Node | null = null;
    let openingElement: ts.Node | null = null;
    let closingElement: ts.Node | null = null;

    getSourceNodes(fileSource)
      .filter(node => [ts.SyntaxKind.ClassDeclaration, ts.SyntaxKind.JsxOpeningElement, ts.SyntaxKind.JsxClosingElement].includes(node.kind))
      .sort((a, b) => a.getStart() - b.getStart())
      .forEach(node => {
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
          classDeclaration = node;
        }
        else if (!openingElement && node.kind === ts.SyntaxKind.JsxOpeningElement) {
          openingElement = node;
        }
        else if (node.kind === ts.SyntaxKind.JsxClosingElement) {
          closingElement = node;
        }
      });

    const recorder = host.beginUpdate(filePath);
    if (classDeclaration) {
      
      recorder.insertRight((<ts.Node>classDeclaration).getStart(), 
`const theme = createMuiTheme({
  palette: {
    type: '${type}'
  },
  typography: {
    useNextVariants: true
  }
});\n\n`);
      
    }

    if (openingElement && closingElement) {
      recorder.insertRight((<ts.Node>openingElement).getStart() - 2, `<MuiThemeProvider theme={theme}>\n    `);
      recorder.insertLeft((<ts.Node>closingElement).getEnd(), `\n    </MuiThemeProvider>`);
    }

    host.commitUpdate(recorder);

    addImportToFile(host, filePath, 'MuiThemeProvider', '@material-ui/core/styles');
    addImportToFile(host, filePath, 'createMuiTheme', '@material-ui/core/styles');
  }
  else {
    const recorder = host.beginUpdate(filePath);

    getSourceNodes(fileSource)
      .filter((node: ts.Node) => node.kind === ts.SyntaxKind.StringLiteral && ['light', 'dark'].includes((<any>node).text))
      .sort((a, b) => a.getStart() - b.getStart())
      .forEach((node: ts.Node) => {
        if ((<any>node).text !== type) {
          recorder.remove(node.getStart(), node.getEnd() - node.getStart());
          recorder.insertRight(node.getStart(), `'${type}'`);
        }
      });

    // getSourceNodes(fileSource)
    //   .filter((node: ts.Node) => node.kind === ts.SyntaxKind.StringLiteral && node.getText().includes('\n'))
    //   .sort((a, b) => a.getStart() - b.getStart())
    //   .forEach((node: ts.Node) => {
    //       recorder.insertRight(node.getEnd(), ` - XXX- `);
    //   });

    host.commitUpdate(recorder);
  }
}

