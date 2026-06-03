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
  it('renders the banner text', async () => {
    render(<App />);
    expect(screen.getByText(/Polyglot Cloud Migration/i)).toBeInTheDocument();
  });

  it('renders API Status section', () => {
    render(<App />);
    expect(screen.getByText(/API Status/i)).toBeInTheDocument();
  });

  it('renders Task Queue section', () => {
    render(<App />);
    expect(screen.getByText(/Task Queue/i)).toBeInTheDocument();
  });
});
