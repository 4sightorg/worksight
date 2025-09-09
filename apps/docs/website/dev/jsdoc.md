# JSDoc Guide

## What is JSDoc?

JSDoc is a standard for documenting JavaScript/TypeScript code using special comments. It helps generate documentation and improves code readability and editor intellisense.

## How to Use

- Add JSDoc comments above functions, classes, and modules.
- Use `/** ... */` syntax.

### Example

```typescript
/**
 * Returns the sum of two numbers.
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a: number, b: number): number {
 return a + b;
}
```

## Generating Docs

1. Install JSDoc (optional, for JS projects):

   ```sh
   npm install --save-dev jsdoc
   ```

2. Run JSDoc to generate HTML docs:

   ```sh
   npx jsdoc src -r -d docs/jsdoc
   ```

   (For TypeScript, consider [TypeDoc](https://typedoc.org/).)

## Tips

- Document all public functions and classes.
- Use `@param`, `@returns`, and `@example` tags.
- Keep comments up to date as code changes.
