import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Lift Simulation App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render the form inputs and button', () => {
    render(<App />);
    expect(screen.getByLabelText(/Number of Floors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Lifts/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Simulation/i })).toBeInTheDocument();
  });

  it('should show an error message for invalid input values', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '101' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '11' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
    });

    expect(await screen.findByText(/Please enter valid values/i)).toBeInTheDocument();
  });

  it('should initialize the correct number of lifts when valid input is provided', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '5' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
    });

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`lift-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`lift-${i}`)).toHaveTextContent('Current Floor:'); // Ensure correct initial floor
    }
  });

  it('should handle a lift request from the floor buttons', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
    });

    // Request lift at floor 5
    const floorButton = screen.getByText(/Floor-5/i).closest('div')?.querySelector('button');
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(8000); // Simulate the movement of the lift
    });

    expect(screen.getByTestId('lift-1')).toHaveTextContent('Current Floor: 5'); // Ensure correct floor is displayed
    expect(screen.getByTestId('doors-open')).toBeInTheDocument(); // Check if doors are open
  });

  it('should close the doors after opening them', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
    });

    const floorButton = screen.getByText(/Floor-5/i).closest('div')?.querySelector('button');
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(8000);
    });

    expect(screen.getByTestId('doors-open')).toBeInTheDocument(); // Check if doors are open

    await act(async () => {
      jest.advanceTimersByTime(2500);
    });

    expect(screen.getByTestId('doors-closed')).toBeInTheDocument(); // Check if doors are closed
  });

  it('should select the nearest lift for the request', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
    });

    const floorButton = screen.getByText(/Floor-9/i).closest('div')?.querySelector('button');
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(16000);
    });

    expect(screen.getByTestId('lift-1')).toHaveTextContent('Current Floor: 9'); // Check if the correct lift has moved
    expect(screen.getByTestId('doors-open')).toBeInTheDocument(); // Check if doors are open
  });
});
