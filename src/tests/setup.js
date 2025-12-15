// Setup file for Vitest
import { vi } from 'vitest';

// Mock Supabase client
const createChainableMock = () => {
  const chain = {
    select: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    neq: vi.fn(() => chain),
    in: vi.fn(() => chain),
    is: vi.fn(() => chain),
    order: vi.fn(() => chain),
    limit: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve({ data: null, error: null })),
    maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
    then: vi.fn((resolve) => resolve({ data: [], error: null }))
  };
  return chain;
};

vi.mock('../environment.env', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => createChainableMock()),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) }))
    })),
    auth: {
      signUp: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signIn: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      signOut: vi.fn(() => Promise.resolve({ error: null })),
      getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null }))
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => Promise.resolve({ data: { path: 'test.webp' }, error: null })),
        createSignedUrl: vi.fn(() => Promise.resolve({ data: { signedUrl: 'https://example.com/test.webp' }, error: null }))
      }))
    }
  }
}));

// Mock del servicio de navegación
vi.mock('../services/navigation.js', () => ({
  navigation: {
    init: vi.fn(),
    navigate: vi.fn(),
    getCurrentRoute: vi.fn(() => '#'),
    onNavigate: vi.fn(() => () => {}),
    getViewportWidth: vi.fn(() => 1024)
  }
}));
