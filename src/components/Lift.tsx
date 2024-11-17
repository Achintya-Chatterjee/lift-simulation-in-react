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
        <div
          className={`absolute left-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-left`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-right`}
        />
      </div>
    </div>
  );
};

export default Lift;
