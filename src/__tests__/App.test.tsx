import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('Lift Simulation App', () => {
  beforeEach(() => {
    jest.useFakeTimers(); // Use fake timers to simulate time-based operations
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers(); // Reset timers to real after each test
  });

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

  it('should initialize the correct number of lifts when valid input is provided', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));

    // Ensure all lifts are displayed with the correct initial floor
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`lift-${i}-floor`)).toHaveTextContent(`Lift ${i} - Current Floor: 1`);
    }
  });

  it('should handle a lift request and move the nearest available lift', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
  
    // Request lift at floor 5
    fireEvent.click(screen.getByText(/Request Lift at Floor 5/i));
  
    // Log the lift's initial state
    console.log('Initial lift state:', screen.getByTestId('lift-1-floor').textContent);
  
    // Simulate lift movement (4 floors * 2s = 8000ms)
    await act(async () => {
      jest.advanceTimersByTime(8000); // Simulate the movement of the lift
    });
  
    // Log the lift's state after movement
    console.log('Lift state after moving:', screen.getByTestId('lift-1-floor').textContent);
  
    // Ensure lift 1 reaches floor 5
    const liftFloorElement = await screen.findByTestId('lift-1-floor');
    expect(liftFloorElement).toHaveTextContent('Lift 1 - Current Floor: 5');
  
    // Ensure doors are open
    const doorsElement = await screen.findByTestId('lift-1-doors');
    expect(doorsElement).toHaveTextContent('Doors: Open');
  });
  

  it('should close the doors after opening them', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
  
    // Request lift at floor 5
    fireEvent.click(screen.getByText(/Request Lift at Floor 5/i));
  
    // Log the initial state
    console.log('Initial lift state:', screen.getByTestId('lift-1-floor').textContent);
  
    // Simulate lift movement (4 floors * 2s = 8000ms)
    await act(async () => {
      jest.advanceTimersByTime(8000); // Simulate the movement of the lift
    });
  
    // Ensure doors are open
    const doorsElement = await screen.findByTestId('lift-1-doors');
    expect(doorsElement).toHaveTextContent('Doors: Open');
    console.log('Doors opened:', doorsElement.textContent);
  
    // Simulate door closing after 2.5 seconds
    await act(async () => {
      jest.advanceTimersByTime(2500); // Simulate doors closing
    });
  
    // Log after the doors close
    const doorsClosedElement = await screen.findByTestId('lift-1-doors');
    console.log('Doors closed:', doorsClosedElement.textContent);
  
    expect(doorsClosedElement).toHaveTextContent('Doors: Closed');
  });
  

  it('should select the nearest lift for the request', async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /Start Simulation/i }));
  
    // Request lift at floor 9
    fireEvent.click(screen.getByText(/Request Lift at Floor 9/i));
  
    // Log the initial state of lifts
    console.log('Initial lift-1 state:', screen.getByTestId('lift-1-floor').textContent);
    console.log('Initial lift-2 state:', screen.getByTestId('lift-2-floor').textContent);
  
    // Simulate lift movement (8 floors * 2s = 16000ms)
    await act(async () => {
      jest.advanceTimersByTime(16000); // Simulate the movement of the nearest lift
    });
  
    // Log the lift's state after movement
    console.log('Lift-1 state after moving:', screen.getByTestId('lift-1-floor').textContent);
    console.log('Lift-2 state after moving:', screen.getByTestId('lift-2-floor').textContent);
  
    const liftFloorElement = await screen.findByTestId('lift-1-floor');
    expect(liftFloorElement).toHaveTextContent('Lift 1 - Current Floor: 9');
  
    const doorsElement = await screen.findByTestId('lift-1-doors');
    expect(doorsElement).toHaveTextContent('Doors: Open');
  });
  

  it('should show an error if lift is requested before simulation starts', () => {
    render(<App />);
    expect(screen.queryByText(/Request Lift at Floor 5/i)).not.toBeInTheDocument();
  });

  it('should not show an error for valid input values', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: '5' } });
  });
});
