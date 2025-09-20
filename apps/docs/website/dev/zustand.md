# Zustand Guide

## What is Zustand?

Zustand is a small, fast, and scalable state management library for React.

## How to Use

1. **Install Zustand**

   ```sh
   npm install zustand
   ```

2. **Create a Store**

   ```typescript
   import { create } from 'zustand';

   type State = {
     count: number;
     increment: () => void;
   };

   export const useStore = create<State>((set) => ({
     count: 0,
     increment: () => set((state) => ({ count: state.count + 1 })),
   }));
   ```

3. **Use in Components**

   ```typescript
   import { useStore } from '../stores/useStore';

   function Counter() {
     const count = useStore((state) => state.count);
     const increment = useStore((state) => state.increment);
     return <button onClick={increment}>Count: {count}</button>;
   }
   ```

## Tips

- Use selectors to avoid unnecessary re-renders.
- Organize stores by feature/module.
- Zustand works with both React and Next.js (client components).
