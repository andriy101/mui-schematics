### Material UI schematics

This project is enspired by [Angular Material Schematics](https://material.angular.io/guide/schematics) and adds [Material UI](https://material-ui.com/) support to your React JS project. Most of generated content is taken from the *Material UI Component Demos* section.

The engine under the hood is [Angular Devkit Schematics](https://www.npmjs.com/package/@angular-devkit/schematics) (and its CLI tool), which is mostly used for Angular apps (create, update, add component / service / class / interface, etc...). 


### (Optionally) install Angular Schematics

You may install it globally:

    # with npm
    npm install @angular-devkit/schematics-cli -g
    # or with yarn 
    yarn global add @angular-devkit/schematics-cli

After this you will have a global command `schematics`.
An alternative way to use schematics is to use it with [`npx`](https://www.npmjs.com/package/npx) command (`npx` comes with npm 5.2+ and higher):

    # this is equal to: schematics <ARGUMENTS>
    npx @angular-devkit/schematics <ARGUMENTS>


### Create a new React app using [Create React App](https://github.com/facebook/create-react-app) tool:

    # with npx
    npx create-react-app my-app
    # or with yarn
    yarn create react-app my-app
    # go to your new app
    cd my-app


### Install Material UI Schematics

Material UI Schematics module needs to be installed globally or locally as dev dependency:

    # globally with npm
    npm i -g mui-schematics 
    # or globally with yarn
    yarn global add mui-schematics 

    # or locally with npm
    npm i mui-schematics -D
    # or locally with yarn
    yarn add mui-schematics -D
    

### Adding (installing) Material UI using schematics

    # with schematics installed globally
    schematics mui-schematics:install
    # or with npx
    npx @angular-devkit/schematics-cli mui-schematics:install
    
`mui-schematics:install` argument means: 
* use `mui-schematics` module (which implements schematics collection, and has collection.json file with a list of available schematics).
* use schematics called `install` from within `mui-schematics` collection.

You can use `i` or `add` aliases instead:
 
    schematics mui-schematics:i
    schematics mui-schematics:add    

Running this command will update your `package.json` and `App.js` files and will also install needed npm modules. If you want to see which files will be modified without actually modifying anything, add `--dry-run` flag:

    schematics mui-schematics:install --dry-run

Available options: 
* *mainFile* - where should be initial imports added (defaults to `App.js`)
* *skipInstallModules* - do not add (and install) material ui dependencies (useful if you want to change theme config only)
* *theme* - ('light' / 'dark') - theme palette type to apply (defaults to 'light')
* *dry-run* - run through without making any changes
* *force* - forces overwriting of files, which is not allowed by default

After this point you may start your new app (or restart if you already started it):

    # with npm
    npm start
    # or with yarn
    yarn start
    

### Adding Material UI components with schematics

Further commands will add one of Material UI components by creating a new component under `src/components` folder (this folder will be created automatically if needed). The default location of components may be changed by providing desired location with `--path` flag. 

For example, running

    schematics mui-schematics:app-bar --name my-app-bar

will create following files under `src` folder:
```
my-app
...
└── src
    ├── App.css
    ├── App.js
    ...
    └── components
        └── my-app-bar
            ├── MyAppBar.css
            └── MyAppBar.js
```

adding `--flat` flag to the command will create `MyAppBar.css` and `MyAppBar.js` right under `components` folder, rather than nesting it under `my-app-bar` folder.

This also will update `App.js` file by adding the import of your new component and its use within code.

For simplicity, in further examples I will use only `schematics <ARGUMENTS>` command, assuming you installed `@angular-devkit/schematics-cli` globally. You also may use `npx @angular-devkit/schematics-cli <ARGUMENTS>` without installing anything globally.

Currently, schematics are implemented for six components which share common options:
* *name* - (mandatory) - component's name
* *path* - the path within /src to create the component (defaults to `components`)
* *flat* - flag to indicate if a dir is created    
* *mainFile* - where should be initial imports added (defaults to `App.js`)
* *init* - perform initial install along with creating component (requires app restart)
* *dry-run* - run through without making any changes
* *force* - forces overwriting of files, which is not allowed by default


### Implemented Material UI components

## [App Bar](https://material-ui.com/demos/app-bar/)

    schematics mui-schematics:app-bar --name <YOUR_COMPONENT_NAME>
    # or with ab alias
    schematics mui-schematics:ab --name <YOUR_COMPONENT_NAME>

Adds Material UI app-bar component to the top of your app.


## [Drawer](https://material-ui.com/demos/drawers/)

    schematics mui-schematics:drawer --name <YOUR_COMPONENT_NAME>
    # or with d alias
    schematics mui-schematics:d --name <YOUR_COMPONENT_NAME>

Adds Material UI drawer component to the bottom of your app.


## [Expansion Panel](https://material-ui.com/demos/expansion-panels/)

    schematics mui-schematics:expansion-panel --name <YOUR_COMPONENT_NAME>
    # or with ep alias
    schematics mui-schematics:ep --name <YOUR_COMPONENT_NAME>
    # or with accordion alias
    schematics mui-schematics:accordion --name <YOUR_COMPONENT_NAME>

Adds Material UI expansion panel component to the bottom of your app.

Additional option:
* *accordion* - flag to indicate if a panel should act as accordion

If this flag is provided [Controlled Accordion](https://material-ui.com/demos/expansion-panels/#controlled-accordion) will be created, otherwise [Simple Expansion Panel](https://material-ui.com/demos/expansion-panels/#simple-expansion-panel) will be created.


## [Grid List](https://material-ui.com/demos/grid-list/)

    schematics mui-schematics:grid-list --name <YOUR_COMPONENT_NAME>
    # or with gl alias
    schematics mui-schematics:gl --name <YOUR_COMPONENT_NAME>

Adds Material UI grid list component to the bottom of your app.

Additional option:
* *singleLine* - create single line (horizontal) grid list

If this flag is provided [Single line Grid list](https://material-ui.com/demos/grid-list/#single-line-grid-list) will be created, otherwise [Grid list with titlebars](https://material-ui.com/demos/grid-list/#grid-list-with-titlebars) will be created.


## [Stepper](https://material-ui.com/demos/steppers/)

    schematics mui-schematics:stepper --name <YOUR_COMPONENT_NAME>
    # or with s alias
    schematics mui-schematics:s --name <YOUR_COMPONENT_NAME>

Adds Material UI stepper component to the bottom of your app.

Additional option:
* *vertical* - crete vertical stepper

If this flag is provided [Vertical Stepper](https://material-ui.com/demos/steppers/#vertical-stepper) will be created, otherwise [Horizontal Linear - Alternative Label
](https://material-ui.com/demos/steppers/#horizontal-linear-alternative-label) will be created.


## [Table](https://material-ui.com/demos/tables/)

    schematics mui-schematics:table --name <YOUR_COMPONENT_NAME>
    # or with t alias
    schematics mui-schematics:t --name <YOUR_COMPONENT_NAME>

Adds Material UI table component to the bottom of your app. 


### Switching theme palette type

AT any time you can switch theme palette type (between 'dark' and 'light'):

    # switch to dark palette
    schematics mui-schematics:i --theme dark --skipInstallModules
    # switch to light palette
    schematics mui-schematics:i --theme light --skipInstallModules


### TODOS
* Add tests to generated cpmponents
* Add type script support
* Add more components with more configuration options
* Add more theme configuration options