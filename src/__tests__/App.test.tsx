import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";

describe("Lift Simulation App", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should render the form inputs and button", () => {
    render(<App />);
    expect(screen.getByLabelText(/Number of Floors/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Lifts/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Start Simulation/i })
    ).toBeInTheDocument();
  });

  it("should show an error message for invalid input values", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: "101" } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: "11" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start Simulation/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Please enter valid values/i)).toBeInTheDocument();
    });
  });

  it("should initialize the correct number of lifts when valid input is provided", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: "5" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start Simulation/i }));
    });

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`lift-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`lift-${i}`)).toHaveTextContent("Current Floor: 0");
    }
  });

  it("should handle a lift request from the floor buttons", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: "2" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start Simulation/i }));
    });

    const floorButton = screen.getByText(/Floor-5/i).closest("div")?.querySelector("button");
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(10000); // Simulate lift movement time
    });

    // Verify that the lift has moved to floor 5
    expect(screen.getByTestId("lift-1")).toHaveTextContent("Current Floor: 5"); 
    expect(screen.getByTestId("doors-open")).toBeInTheDocument(); // Doors should be open
  });

  it("should close the doors after opening them", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: "2" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start Simulation/i }));
    });

    const floorButton = screen.getByText(/Floor-5/i).closest("div")?.querySelector("button");
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(10000); // Wait for the lift to arrive
    });

    expect(screen.getByTestId("doors-open")).toBeInTheDocument(); // Doors should be open

    await act(async () => {
      jest.advanceTimersByTime(2500); // Wait for doors to close
    });

    expect(screen.getByTestId("doors-closed")).toBeInTheDocument(); // Doors should be closed now
  });

  it("should select the nearest lift for the request", async () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText(/Number of Floors/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/Number of Lifts/i), { target: { value: "2" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Start Simulation/i }));
    });

    const floorButton = screen.getByText(/Floor-9/i).closest("div")?.querySelector("button");
    if (floorButton) {
      fireEvent.click(floorButton);
    }

    await act(async () => {
      jest.advanceTimersByTime(10000); // Wait for the lift to arrive
    });

    expect(screen.getByTestId("lift-1")).toHaveTextContent("Current Floor: 9"); // Lift should be at floor 9
    expect(screen.getByTestId("doors-open")).toBeInTheDocument(); // Doors should be open
  });
});
