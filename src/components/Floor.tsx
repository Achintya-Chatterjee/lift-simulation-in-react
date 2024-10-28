import React from "react";

type FloorProps = {
  floorNumber: number;
  floorHeight: number;
  handleLiftRequest: (floorNumber: number, direction: "up" | "down") => void;
  isTopFloor: boolean;
  isGroundFloor: boolean;
};

const Floor: React.FC<FloorProps> = ({
  floorNumber,
  floorHeight,
  handleLiftRequest,
  isTopFloor,
  isGroundFloor,
}) => {
  return (
    <div
      className="relative flex items-center justify-between w-full border-b-2 border-green-700 z-10"
      style={{ height: `${floorHeight}px` }}
    >
      <div className="flex items-center space-x-4">
        {!isTopFloor && (
          <button
            onClick={() => handleLiftRequest(floorNumber, "up")}
            className="bg-green-700 text-white font-bold py-2 px-4 rounded-full z-10"
          >
            UP
          </button>
        )}
        <p className="font-bold text-green-800 z-10">Floor {floorNumber}</p>
        {!isGroundFloor && (
          <button
            onClick={() => handleLiftRequest(floorNumber, "down")}
            className="bg-green-700 text-white font-bold py-2 px-4 rounded-full z-10"
          >
            DOWN
          </button>
        )}
      </div>
    </div>
  );
};

export default Floor;
