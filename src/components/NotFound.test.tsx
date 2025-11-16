import { render, screen } from '@testing-library/react';
import { NotFound } from './NotFound';

describe('NotFound', () => {
  it('renders 404 message', () => {
    render(<NotFound />);
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('provides a link back to home', () => {
    render(<NotFound />);
    const homeLink = screen.getByRole('link', { name: /games hub/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('has correct CSS class', () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('.not-found')).toBeInTheDocument();
  });
});
