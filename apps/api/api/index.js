/**
 * Vercel serverless entry (Root Directory = apps/api).
 * Thin CJS shim over the Nest build so Vercel does not recompile TypeScript /
 * decorators itself — `nest build` already emitted dist/vercel.js.
 */
module.exports = require('../dist/vercel.js').default;
