import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';
import { AuthContext } from '@/app/lib/contexts/AuthContext';

vi.mock('bootstrap', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Offcanvas: class MockOffcanvas {
      constructor() {
        
      }
      toggle = vi.fn();
      dispose = vi.fn();
    },
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const renderWithMockAuth = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider value={providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

describe('Header Component', () => {
  it('should display login and register buttons when not authenticated', () => {
    const providerProps = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    renderWithMockAuth(<Header />, { providerProps });

    const loginLinks = screen.getAllByRole('link', { name: /登入/i });
    expect(loginLinks.length).toBeGreaterThan(0);

    expect(screen.getByRole('link', { name: /註冊/i })).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: /登出/i })
    ).not.toBeInTheDocument();
  });

  it('should display user name and Logout button when authenticated', ()=>{
    const providerProps = {
      isAuthenticated: true,
      user: { name: '測試使用者' }, 
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      register: vi.fn(),
    };

    renderWithMockAuth(<Header />, { providerProps })

    expect(screen.getByText(/你好, 測試使用者/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登出/i })).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /登入/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /註冊/i })).not.toBeInTheDocument();
  })
});
