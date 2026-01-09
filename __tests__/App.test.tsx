import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const linkElements = screen.getAllByText(/OpsPrep AI/i);
  expect(linkElements.length).toBeGreaterThan(0);
});