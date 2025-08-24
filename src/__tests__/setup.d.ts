// Jest DOM matchers type declarations
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveFocus(): R;
      toHaveTextContent(text: string | RegExp): R;
    }
  }
}

export {};
