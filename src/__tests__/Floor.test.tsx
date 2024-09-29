import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Floor from "../components/Floor";

describe("Floor Component", () => {
  const handleLiftRequest = jest.fn();

  it("should render the floor with up and down buttons", () => {
    render(
      <Floor
        floorNumber={1}
        floorHeight={120}
        handleLiftRequest={handleLiftRequest}
        isTopFloor={false}
        isGroundFloor={false}
        disabledUp={false}
        disabledDown={false}
      />
    );

    expect(screen.getByText(/Floor-1/i)).toBeInTheDocument();
    expect(screen.getByText(/UP/i)).toBeInTheDocument();
    expect(screen.getByText(/DOWN/i)).toBeInTheDocument();
  });

  it("should call handleLiftRequest with correct parameters when UP button is clicked", () => {
    render(
      <Floor
        floorNumber={1}
        floorHeight={120}
        handleLiftRequest={handleLiftRequest}
        isTopFloor={false}
        isGroundFloor={false}
        disabledUp={false}
        disabledDown={false}
      />
    );

    fireEvent.click(screen.getByText(/UP/i));
    expect(handleLiftRequest).toHaveBeenCalledWith(1, "up");
  });

  it("should call handleLiftRequest with correct parameters when DOWN button is clicked", () => {
    render(
      <Floor
        floorNumber={1}
        floorHeight={120}
        handleLiftRequest={handleLiftRequest}
        isTopFloor={false}
        isGroundFloor={false}
        disabledUp={false}
        disabledDown={false}
      />
    );

    fireEvent.click(screen.getByText(/DOWN/i));
    expect(handleLiftRequest).toHaveBeenCalledWith(1, "down");
  });
});
