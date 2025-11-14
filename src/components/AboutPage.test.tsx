import { render, screen } from '@testing-library/react';
import { AboutPage } from './AboutPage';

describe('AboutPage', () => {
  it('renders the main heading', () => {
    render(<AboutPage />);
    expect(screen.getByText('About Islam4Kids Games')).toBeInTheDocument();
  });

  it('displays beta testing notice', () => {
    render(<AboutPage />);
    expect(screen.getByText('Beta Testing')).toBeInTheDocument();
    expect(
      screen.getByText(/All games are currently in active development/)
    ).toBeInTheDocument();
  });

  it('shows feedback section with email link', () => {
    render(<AboutPage />);
    expect(screen.getByText('We Value Your Feedback')).toBeInTheDocument();

    const emailLink = screen.getByRole('link', { name: /support@islam4kids.org/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@islam4kids.org');
  });

  it('displays goals section with list', () => {
    render(<AboutPage />);
    expect(screen.getByText('Our Goals')).toBeInTheDocument();
    expect(
      screen.getByText('Create engaging educational content about Islam')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Help children learn Islamic terms, concepts, and history')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Provide a safe, ad-free environment for Muslim children')
    ).toBeInTheDocument();
  });

  it('shows coming soon section', () => {
    render(<AboutPage />);
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(
      screen.getByText(/Check back regularly for updates/)
    ).toBeInTheDocument();
  });

  it('has correct structure with sections', () => {
    const { container } = render(<AboutPage />);

    expect(container.querySelector('.about-page')).toBeInTheDocument();
    expect(container.querySelector('.about-container')).toBeInTheDocument();
    expect(container.querySelector('.beta-notice')).toBeInTheDocument();
    expect(container.querySelector('.feedback-section')).toBeInTheDocument();
    expect(container.querySelector('.goals-section')).toBeInTheDocument();
    expect(container.querySelector('.coming-soon')).toBeInTheDocument();
  });
});
