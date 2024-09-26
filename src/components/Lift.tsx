import React from 'react';

type LiftProps = {
  id: number;
  liftStyle: React.CSSProperties;
  doorsOpen: boolean;
};

const Lift: React.FC<LiftProps> = ({ liftStyle, doorsOpen }) => {
  return (
    <div
      className="absolute w-16 h-16 bg-gray-800"
      style={liftStyle} // Use `bottom` property for smooth lift movement
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute left-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-500 ${
            doorsOpen ? '-translate-x-full' : ''
          }`}
        ></div>
        <div
          className={`absolute right-0 top-0 h-full w-1/2 bg-gray-500 transition-transform duration-500 ${
            doorsOpen ? 'translate-x-full' : ''
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Lift;
