
# Styles

Project is using SASS language (`.scss` flavor) for styling.

In order to maintain separation and prevent "leaking" of styles this project is using simplified version of BEM naming convention.

BEM stands for Block Element Modifier and is a way to uniquely define class names regardless of the project size. Originally BEM convention mandates double underscores between block and element and double dash between element and modifier with an optional single dash inside block, element and modifier names like:

```
block-name__element-name--modifier-name
```

Given that elements with a modifier are required to keep a separate class name with block and element only this can lead to a cumbersome markup:

``` html
<div class="block-name__element-name block-name__element-name--modifier1 block-name__element-name--modifier1">
```

In order to simplify and improve readability, we made couple of changes to the original convention:

- All block, element and modifier names have to be in lowercase with no dashes.
- In React components block name always corresponds to a component and has to be the same as component name but in all lowercase. There has to be exactly one block for every component.
- Modifier name is a separate class and it starts with a double dash.

This leads to the following class names:

``` html
<div className="blockname__elementname --modifier1 --modifier2">
```

Note that modifier names used like this still have some minimal risk of leaking down to sub-elements that might be having modifiers of their own with the same name. If a component being styled is a container-type component with arbitrary child components than modifier names should follow more conventional naming.

## Global styles

Global styles follow similar naming conventions with the exception that block name is prefixed with `ep-` like:

``` html
<btn className="ep-btn --primary --shadow">
```

All global styles are included in `index.scss` file.

## Constants

Project has a number of constants that are saved in `constants.scss` file. These constants can be reused across different components and global styles.

Number of variables in this file should be kept to a minimum and a new one should be introduced only when there is a need for a consistency across components. Do not add variables here if they are used in one place only.

Minor adjustments to color constants (slightly darker shades etc.) should be made by using sass color functions on an original color.

## Colors

Prefer HSL format of colors over RGB. HSL format is easier to manipulate and make lighter/darker, more/less saturated etc. If you are using Visual Studio Code you can easily convert to HSL by hovering over color and clicking on the header of the color picker popup.

