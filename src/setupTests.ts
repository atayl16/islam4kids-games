// filepath: /Users/alishataylor/islam4kids-games/src/setupTests.ts
import '@testing-library/jest-dom';

// Polyfills for React Router v7 (requires TextEncoder/TextDecoder)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock the registry module to avoid import.meta.glob issues
jest.mock('./games/registry');
