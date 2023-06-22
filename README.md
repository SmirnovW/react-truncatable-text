# react-truncatable-text

![GZipped size][npm-minzip-svg]

High-performing React component that truncates a long text.

**Check the demo here:**
[DEMO](https://react-truncatable-text-demo.vercel.app/)

## Features

- ⏱ **Smart Debouncing** - In cases when it's needed will try to save the resource and turn on the debouncing.
- 💾 **Smart Copy/Paste** - Copying even truncated text will add the full text to the clipboard.
- 🔦 **Smart Search** - Even after truncating, text can be found by built-in browser search.
- 📝 **TypeScript** - Good for TypeScript projects.
- ⚡️ **Performing better than native text-overflow** - Rendering only when the component is in view and only when changes are necessary.


## Installation

Install using Yarn

```sh
yarn add react-truncatable-text
```

or NPM:

```sh
npm install react-truncatable-text --save
```

## Usage

The `<TruncatableText />` can truncate any text that exceeds the length of its parent wrapper element.

```jsx
import { TruncatableText } from 'react-truncatable-text';

export const Component = () => (
<div style={{width: '50'}}>
  <TruncatableText tailLength={3}>
    This text is quite lengthy and needs to be shortened to fit into its parent container!
  </TruncatableText>
</div>
);

```

## Props

| Name                   | Type            | Default       | Attribute type   | Description                                                                                                                                                                                                                                                                                     |
| ---------------------- | --------------- | ------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **children**           | `string`        | `undefined`   | `Required`       | As a children, should be passed a plain string.                                                                                   |
| **tailLength**         | `number`        | `undefined`   | `Required`       | The length of the non-truncating text. In other words, the last N characters of the line that should always be shown.             |
| **title**              | `string`        | `''`          | `Optional`       | Text that appears as a hint on the hover of the original text                                                                     |
| **className**          | `string`        | `''`          | `Optional`       | CSS class of the component's container.                                                                                           |
| **debounced**          | `boolean`       | `false`       | `Optional`       | A boolean indicating whether should we enable smart debouncing or not.                                                            |
| **searchable**         | `boolean`       | `false`       | `Optional`       | A boolean indicating whether should be enabled search in truncated text.                                                  |

### Smart debouncing

The smart debouncing feature utilizes the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) to verify if a task is taking too long to calculate the text length and activate the debouncing mechanism.

### Smart Copy/Paste

To select the entire text, simply double-click on the component. Even if the text has been shortened, copying it will still copy the full original text to your clipboard.

### Smart search

To be able to find a search in the truncated text used the [hidden attribute](https://developer.chrome.com/articles/hidden-until-found/) with the `until-found` value.
> **Important!**
> Since the `until-found` has weak [browser compatibility](https://caniuse.com/mdn-html_global_attributes_hidden_until-found_value) for non-supporting browsers it will use fallback based on the scroll behavior. It might cause appearing a scrollbar.

### Performance

The component utilizes the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to handle only the visible component, so you can have a lot of components on the page and no worry about the performance issues. 

### Resizing

To manage resizes, the component utilizes the [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver). It creates a single ResizeObserver instance for each component, which can be reused whenever feasible.

### Canvas measureText API

For measuring text used the [CanvasRenderingContext2D.measureText()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText) method, that returns a TextMetrics object that contains information about the measured text.

[npm-minzip-svg]:
  https://img.shields.io/bundlephobia/minzip/react-truncatable-text.svg
