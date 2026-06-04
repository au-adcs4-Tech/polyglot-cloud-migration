import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ status: 'healthy', message: 'API is running', version: '1.0.0' }),
    })
  );
});

describe('App component', () => {
  it('renders the banner text', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});