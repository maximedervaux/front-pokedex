// src/components/SeverityAlert/SeverityAlert.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SeverityAlert from './Alert';


describe('SeverityAlert', () => {
  it('should render with info status for severity 1', () => {
    render(<SeverityAlert severity={1} text="This is an informational message." />);

    const alert = screen.getByRole('alert'); 
    expect(alert).toHaveAttribute('data-status', 'info');
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('This is an informational message.')).toBeInTheDocument();
  });

  it('should render with warning status for severity 2', () => {
    render(<SeverityAlert severity={2} text="Beware, something might be wrong!" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-status', 'warning');
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Beware, something might be wrong!')).toBeInTheDocument();
  });

  it('should render with error status for severity 3', () => {
    render(<SeverityAlert severity={3} text="An error has occurred!" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-status', 'error');
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('An error has occurred!')).toBeInTheDocument();
  });

  it('should render with success status for severity 4', () => {
    render(<SeverityAlert severity={4} text="Operation completed successfully." />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-status', 'success');
    expect(screen.getByText('Success')).toBeInTheDocument();
    expect(screen.getByText('Operation completed successfully.')).toBeInTheDocument();
  });

  it('should display the correct text content', () => {
    const testText = 'This is a custom message for the alert.';
    render(<SeverityAlert severity={1} text={testText} />);

    expect(screen.getByText(testText)).toBeInTheDocument();
  });
});