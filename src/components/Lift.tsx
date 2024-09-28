import React from "react";

type LiftProps = {
  id: number;
  liftStyle: React.CSSProperties;
  doorsOpen: boolean;
  currentFloor: number; 
};

const Lift: React.FC<LiftProps> = ({
  id,
  liftStyle,
  doorsOpen,
  currentFloor,
}) => {
  return (
    <div className="relative w-16 h-24 bg-gray-800" style={liftStyle}>
      <div className="relative w-full h-full">
        {/* Left Door */}
        <div
          className={`absolute left-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-2500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-left`}
        />
        {/* Right Door */}
        <div
          className={`absolute right-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-2500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-right`}
        />
        {/* Lift ID and Door Status (hidden from users) */}
        <p
          data-testid={`lift-${id}`}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            border: 0,
          }}
        >
          Lift {id} - Current Floor: {currentFloor} {/* Show current floor */}
        </p>
        <p
          data-testid={`doors-${doorsOpen ? "open" : "closed"}`}
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            padding: 0,
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            border: 0,
          }}
        >
          Doors: {doorsOpen ? "Open" : "Closed"}
        </p>
      </div>
    </div>
  );
};

export default Lift;
