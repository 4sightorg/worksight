# Jest Testing Guide

## What is Jest?

Jest is a JavaScript/TypeScript testing framework for unit and integration tests.

## How to Use

### 1. Install Jest

```sh
npm install --save-dev jest @types/jest ts-jest
```

### 2. Configure Jest

Add to `package.json` or create `jest.config.js`:

```js
module.exports = {
 preset: 'ts-jest',
 testEnvironment: 'node',
};
```

### 3. Write a Test

Create a file like `__tests__/math.test.ts`:

```typescript
import { add } from '../utils/math';

describe('add', () => {
 it('adds two numbers', () => {
  expect(add(1, 2)).toBe(3);
 });
});
```

### 4. Run Tests

```sh
npm test
```

### 5. Test API Routes

Use `node-mocks-http` or `supertest` to simulate API requests.

## Tips

- Use `describe` and `it` blocks for structure.
- Mock dependencies with `jest.mock`.
- Test edge cases and error handling.
