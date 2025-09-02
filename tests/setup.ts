import { expect, afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Optional cleanup hooks can go here if you add them later
// e.g., import { cleanup } from '@testing-library/react'; afterEach(cleanup)

Object.assign(globalThis, { expect, vi })
