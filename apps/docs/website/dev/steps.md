# Step-by-Step Guide: From 0 to Hero

This guide will walk you through the essentials of working on this project, from setup to advanced practices.

---

## 1. Project Setup

1. **Clone the repository**

   ```sh
   git clone <your-repo-url>
   cd worksight
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Start the development server**

   ```sh
   npm run dev
   ```

   Visit `http://localhost:3000` to see your app.

---

## 2. Documentation

- **Comment your code** as you write it. Use `//` for inline comments and `/** ... */` for function/class docs.
- **JSDoc Example:**

  ```typescript
  /**
   * Adds two numbers.
   * @param a First number
   * @param b Second number
   * @returns Sum of a and b
   */
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

- **Update the README** with any new features or setup changes.
- **Document API endpoints** in a dedicated file (e.g., `API.md`).

---

## 3. Error Handling

- **API routes:** Always use `try/catch` for async logic.

  ```typescript
  export default async function handler(req, res) {
    try {
      // ...your logic
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  ```

- **Frontend:** Show user-friendly error messages, not raw errors.
- **Never leak sensitive info** in error responses.

---

## 4. Testing

### a. Install a test framework

```sh
npm install --save-dev jest @types/jest ts-jest
```

### b. Configure Jest (if using TypeScript)

Add to `package.json` or create `jest.config.js`:

```js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
```

### c. Write your first test

Create a file like `__tests__/math.test.ts`:

```typescript
import { add } from '../utils/math';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

### d. Run tests

```sh
npm test
```

### e. Test API routes

Use `node-mocks-http` or `supertest` to simulate API requests.

---

## 5. Exploring Libraries Offline

- **Read code in `node_modules/<library>`**.
- **Look for `README.md` or docs** in the package folder.
- **Check `.d.ts` files** for TypeScript types and API hints.
- **Use your editor's intellisense/autocomplete**.
- **Create a scratch file** and try out library functions, logging results.

---

## 6. Next Steps

- Refactor code for clarity and maintainability.
- Add more tests for edge cases.
- Improve documentation as you learn.
- Sketch new features or UI ideas.
- Practice by building small features or utilities.

---

**Remember:**  
Start small, ask questions, and iterate. You’ll get better with every step!
