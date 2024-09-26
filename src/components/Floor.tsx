// Floor Component (components/Floor.tsx)
import React from 'react';

type FloorProps = {
  floorNumber: number;
  floorHeight: number;
  handleLiftRequest: (floorNumber: number) => void;
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
      className="relative flex items-center justify-between border-t"
      style={{ height: `${floorHeight}px` }}
    >
      <div className="flex items-center space-x-2 ml-4">
        {!isTopFloor && (
          <button
            onClick={() => handleLiftRequest(floorNumber)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Up
          </button>
        )}
        {!isGroundFloor && (
          <button
            onClick={() => handleLiftRequest(floorNumber)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Down
          </button>
        )}
      </div>
      <div className="mr-4">
        <p className="font-bold">Floor {floorNumber}</p>
      </div>
    </div>
  );
};

export default Floor;
