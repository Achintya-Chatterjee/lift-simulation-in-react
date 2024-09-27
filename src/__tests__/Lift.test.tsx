import '@testing-library/jest-dom'; 
import React from "react";
import { render, screen } from "@testing-library/react";
import Lift from "../components/Lift";

describe("Lift Component", () => {
  it("should render the lift with doors closed", () => {
    render(<Lift id={1} liftStyle={{ bottom: "0px" }} doorsOpen={false} />);
    expect(screen.getByTestId(`lift-${1}`)).toBeInTheDocument();
    expect(screen.getByTestId(`doors-closed`)).toBeInTheDocument();    
  });

  it("should render the lift with doors open", () => {
    render(<Lift id={1} liftStyle={{ bottom: "0px" }} doorsOpen={true} />);
    expect(screen.getByTestId(`lift-${1}`)).toBeInTheDocument();
    expect(screen.getByTestId(`doors-open`)).toBeInTheDocument(); 
  });
});
