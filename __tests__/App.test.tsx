import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock everything BEFORE importing App
jest.mock('../context/UserContext', () => ({
  useUser: jest.fn(),
}));

// Home is a named export
jest.mock('../pages/Home', () => ({ 
  __esModule: true, 
  Home: () => <div /> 
}));

// These are default exports
jest.mock('../pages/QuestionBank', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../pages/MockInterview', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../pages/JobParser', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../pages/CheatSheets', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../pages/TaxonomyExplorer', () => ({ __esModule: true, default: () => <div /> }));
jest.mock('../pages/Profile', () => ({ __esModule: true, default: () => <div /> }));

// Login has a named export Login
jest.mock('../pages/Login', () => ({ 
  __esModule: true,
  Login: () => <div data-testid="login-page" /> 
}));

jest.mock('lucide-react', () => ({
  Terminal: () => <div />,
  BookOpen: () => <div />,
  Target: () => <div />,
  Trophy: () => <div />,
  Settings: () => <div />,
  ChevronRight: () => <div />,
  Search: () => <div />,
  Cpu: () => <div />,
  LayoutDashboard: () => <div />,
  BrainCircuit: () => <div />,
  FileText: () => <div />,
  MessageSquare: () => <div />,
  Menu: () => <div />,
  X: () => <div />,
  LogOut: () => <div />,
  Loader2: () => <div data-testid="loader" />,
  Mail: () => <div />,
  Lock: () => <div />,
  Chrome: () => <div />,
  ArrowRight: () => <div />,
  ShieldCheck: () => <div />,
  Cloud: () => <div />,
  Database: () => <div />,
  Layers: () => <div />,
  Briefcase: () => <div />,
  Sparkles: () => <div />,
  Zap: () => <div />,
}));

// Now import App
import App from '../App';
import { useUser } from '../context/UserContext';

describe('App Component', () => {
  it('renders loading state', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: true,
      logout: jest.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders login page when not authenticated', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: null,
      profile: null,
      loading: false,
      logout: jest.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders app dashboard when authenticated', () => {
    (useUser as jest.Mock).mockReturnValue({
      user: { uid: '123' },
      profile: { name: 'Test User', title: 'SRE' },
      loading: false,
      logout: jest.fn(),
    });

    render(<App />);
    expect(screen.getByText(/OpsPrep AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});
