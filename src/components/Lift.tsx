import React from "react";

type LiftProps = {
  id: number;
  liftStyle: React.CSSProperties;
  doorsOpen: boolean;
};

const Lift: React.FC<LiftProps> = ({ liftStyle, doorsOpen }) => {
  return (
    <div className="relative w-16 h-24 bg-gray-800" style={liftStyle}>
      <div className="relative w-full h-full">
        {/* Left Door */}
        <div
          className={`absolute left-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-2500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-left`} // Set origin for scaling to the left
        />
        {/* Right Door */}
        <div
          className={`absolute right-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-2500 ease-in-out ${
            doorsOpen ? "scale-x-0" : "scale-x-100"
          } origin-right`} // Set origin for scaling to the right
        />
      </div>
    </div>
  );
};

export default Lift;
