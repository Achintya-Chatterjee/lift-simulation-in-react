import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

import '@testing-library/jest-dom';

describe('App component', () => {
  it('should render the form inputs and button', () => {
    render(<App />);

    expect(screen.getByLabelText(/Number of Floors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Lifts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Simulation/i })).toBeInTheDocument();
  });

  it('should show an error message for invalid input values', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '11' } });

    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));

    expect(screen.getByText(/Please enter valid values/i)).toBeInTheDocument();
  });

  it('should not show an error for valid input values', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));

    expect(screen.queryByText(/Please enter valid values/i)).not.toBeInTheDocument();
  });
});
