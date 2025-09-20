# Developer Guide

## Step-by-Step: From 0 to Hero

If you're new or want a full walkthrough, see [`docs/step-by-step.md`](docs/step-by-step.md) for a practical, hands-on guide covering:

- Project setup
- Documentation best practices
- Error handling patterns
- Writing and running tests
- Exploring libraries offline

## Documentation

- **Code Comments:**  
  Use clear, concise comments to explain complex logic, function purposes, and important decisions.
- **JSDoc/TypeDoc:**  
  Use JSDoc comments for functions, classes, and modules to describe parameters, return values, and usage.
- **README:**  
  Keep a top-level README with project purpose, setup instructions, usage, and contribution guidelines.
- **API Docs:**  
  Document API endpoints, request/response formats, authentication, and error codes (e.g., in an `API.md`).

## Error Handling

- **API Routes:**  
  Always return appropriate HTTP status codes and clear error messages.
  - Use `try/catch` for async operations.
  - Never expose sensitive error details to clients.
- **Frontend:**  
  Show user-friendly error messages. Log technical details to the console or a logging service.
- **Logging:**  
  Log errors on the server for debugging and monitoring.

## Testing

### How to Build Tests

1. **Choose a Test Framework**
   - For JavaScript/TypeScript: [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/).
2. **Write a Simple Test**
   - Create a `__tests__` folder or use `.test.ts`/`.spec.ts` files.
   - Example (Jest):

     ```typescript
     import { createJwt } from '../pages/api/protected';

     describe('createJwt', () => {
       it('should return a JWT string', () => {
         const token = createJwt('testuser');
         expect(typeof token).toBe('string');
       });
     });
     ```

3. **Run Tests**
   - Use `npm test` or `npx jest`.
4. **Test API Routes**
   - Use [supertest](https://github.com/ladjs/supertest) or similar to call your API endpoints in tests.
   - Example:

     ```typescript
     import handler from '../pages/api/protected';
     import { createMocks } from 'node-mocks-http';

     test('returns 401 without token', async () => {
       const { req, res } = createMocks({ method: 'GET' });
       await handler(req, res);
       expect(res._getStatusCode()).toBe(401);
     });
     ```

5. **Mock Dependencies**
   - Use Jest's `jest.mock()` to mock modules or functions.

### Tips for Exploring a Library Offline

- **Read the Installed Code:**  
  Go to `node_modules/<library>` and read the source files and any included docs or examples.
- **Check for Type Definitions:**  
  If using TypeScript, look at `.d.ts` files for available types and APIs.
- **Look for README/Docs:**  
  Many libraries include a `README.md` or docs folder in their npm package.
- **Experiment in a Local File:**  
  Import the library in a scratch file and try out its functions, logging results to the console.
- **Use Editor Intellisense:**  
  Modern editors (VSCode, etc.) provide autocomplete and inline docs for installed libraries.

---

**Tip:**  
Start with simple tests and documentation, then iterate and improve as your project grows.
