# cra

A UI component library built with LitElement for Castle Rock Associates.

## Installation

Install the library through npm:

```
npm install cra-web-components --save
```

---

## Integration of Components

### Load the whole bundle

The most simple and common way of including the components into an application is by loading the core bundle:

```js
// include bundle through module import
import 'cra-web-components';
```

### Load single components

As an alternative, you can also load individual components to reduce loading time. Be aware that components are inter-dependent and should be imported independently:

```js
// include individual components and styles through module import
import 'cra-web-components/components/button';
import 'cra-web-components/components/text';
```
