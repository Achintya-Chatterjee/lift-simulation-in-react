import React, { useState, useEffect } from "react";
import Floor from "./components/Floor";
import Lift from "./components/Lift";

type LiftType = {
  id: number;
  currentFloor: number;
  isMoving: boolean;
  doorsOpen: boolean;
  style: React.CSSProperties;
};

const App: React.FC = () => {
  const [floorsCount, setFloorsCount] = useState<number>(0);
  const [liftsCount, setLiftsCount] = useState<number>(0);
  const [isSimulationStarted, setIsSimulationStarted] =
    useState<boolean>(false);
  const [lifts, setLifts] = useState<LiftType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<
    Record<number, { up: boolean; down: boolean }>
  >({});
  const floorHeight = 120; // Adjusting height for better visibility

  // Initialize disabled buttons state for each floor
  useEffect(() => {
    const initialDisabledState: Record<number, { up: boolean; down: boolean }> =
      {};
    for (let i = 0; i <= floorsCount; i++) {
      initialDisabledState[i] = { up: false, down: false };
    }
    setDisabledButtons(initialDisabledState);
  }, [floorsCount]);

  useEffect(() => {
    if (isSimulationStarted) {
      initializeLifts(liftsCount);
    }
  }, [isSimulationStarted, liftsCount]);

  const initializeLifts = (count: number) => {
    const initialLifts: LiftType[] = [];
    for (let i = 0; i < count; i++) {
      initialLifts.push({
        id: i + 1,
        currentFloor: 0, // Set lifts to start at the ground floor
        isMoving: false,
        doorsOpen: false,
        style: { bottom: "0px" }, // Ensure bottom is explicitly set to 0
      });
    }
    setLifts(initialLifts);
  };

  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      floorsCount <= 0 ||
      floorsCount > 100 ||
      liftsCount <= 0 ||
      liftsCount > 10
    ) {
      alert("Please enter valid values (Floors: 1-100, Lifts: 1-10)");
      return;
    }
    setIsSimulationStarted(true);
  };

  const handleResetSimulation = () => {
    setIsSimulationStarted(false);
    setLifts([]);
    setPendingRequests([]);
    setFloorsCount(0);
    setLiftsCount(0);
  };

  const handleLiftRequest = (floorNumber: number, direction: "up" | "down") => {
    const availableLift = findNearestAvailableLift(floorNumber);
    if (availableLift) {
      moveLift(availableLift, floorNumber);

      // Disable the button that was pressed
      setDisabledButtons((prev) => ({
        ...prev,
        [floorNumber]: {
          ...prev[floorNumber],
          [direction]: true,
        },
      }));
    } else {
      setPendingRequests((prev) => [...prev, floorNumber]);
    }
  };

  const findNearestAvailableLift = (floorNumber: number): LiftType | null => {
    let nearestLift: LiftType | null = null;
    let minDistance = Infinity;
    for (const lift of lifts) {
      if (!lift.isMoving && !lift.doorsOpen) {
        // Ensure the lift is not moving and doors are closed
        const distance = Math.abs(lift.currentFloor - floorNumber);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLift = lift;
        }
      }
    }
    return nearestLift;
  };

  const moveLift = (lift: LiftType, destinationFloor: number) => {
    const floorsToMove = Math.abs(lift.currentFloor - destinationFloor);
    const timePerFloor = 2000; // 2 seconds per floor
    const totalTime = floorsToMove * timePerFloor;
    const destinationBottom = `${destinationFloor * floorHeight}px`; // Calculate the new `bottom` position
  
    // Move the lift to the destination
    setLifts((prevLifts) =>
      prevLifts.map((l) =>
        l.id === lift.id
          ? {
              ...l,
              isMoving: true,
              style: {
                ...l.style,
                bottom: destinationBottom, // Use the new bottom position
                transition: `bottom ${totalTime}ms linear`,
              },
            }
          : l
      )
    );
  
    // After the lift reaches the destination, open the doors
    setTimeout(() => {
      setLifts((prevLifts) =>
        prevLifts.map((l) =>
          l.id === lift.id
            ? {
                ...l,
                isMoving: false,
                doorsOpen: true,
                currentFloor: destinationFloor,
              }
            : l
        )
      );
  
      // Close the doors after 2.5 seconds
      setTimeout(() => {
        setLifts((prevLifts) =>
          prevLifts.map((l) =>
            l.id === lift.id ? { ...l, doorsOpen: false } : l
          )
        );
  
        // Re-enable the buttons after the lift reaches the floor
        setDisabledButtons((prev) => ({
          ...prev,
          [destinationFloor]: { up: false, down: false },
        }));
  
        // Handle pending requests if any
        if (pendingRequests.length > 0) {
          const nextFloor = pendingRequests.shift()!;
          moveLift(lift, nextFloor);
        }
      }, 2500); // Doors open for 2.5 seconds
    }, totalTime); // Wait until the lift reaches its destination before opening doors
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="py-6">
        <h1 className="text-3xl font-bold">Lift Simulation by Achintya</h1>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded mt-4"
          onClick={handleResetSimulation}
          style={{ display: isSimulationStarted ? "block" : "none" }} // Show reset button only after starting simulation
        >
          Reset Simulation
        </button>
      </header>
      {!isSimulationStarted ? (
        <form
          onSubmit={handleStartSimulation}
          className="bg-white p-6 rounded shadow-md max-w-md"
        >
          <div className="mb-4">
            <label htmlFor="floorsCount" className="block text-lg">
              Number of Floors (1-100):
            </label>
            <input
              type="number"
              id="floorsCount"
              value={floorsCount}
              onChange={(e) => setFloorsCount(Number(e.target.value))}
              min="1"
              max="100"
              required
              className="w-full px-4 py-2 border rounded mt-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="liftsCount" className="block text-lg">
              Number of Lifts (1-10):
            </label>
            <input
              type="number"
              id="liftsCount"
              value={liftsCount}
              onChange={(e) => setLiftsCount(Number(e.target.value))}
              min="1"
              max="10"
              required
              className="w-full px-4 py-2 border rounded mt-2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded mt-4"
          >
            Start Simulation
          </button>
        </form>
      ) : (
        <div className="relative w-full max-w-screen-lg h-auto flex flex-col mx-auto">
          <div className="relative flex-1 grid grid-cols-[1fr_5fr] gap-4">
            {/* Floors */}
            <div className="relative grid grid-rows-[repeat(${floorsCount},_1fr)]">
              {Array.from({ length: floorsCount + 1 }, (_, index) => (
                <Floor
                  key={index}
                  floorNumber={floorsCount - index}
                  floorHeight={floorHeight}
                  handleLiftRequest={handleLiftRequest}
                  isTopFloor={floorsCount - index === floorsCount}
                  isGroundFloor={floorsCount - index === 0}
                  disabledUp={disabledButtons[floorsCount - index]?.up || false}
                  disabledDown={
                    disabledButtons[floorsCount - index]?.down || false
                  }
                />
              ))}
            </div>

            {/* Lifts */}
            <div className="relative w-full max-w-screen-lg h-full mx-auto">
              <div className="relative flex justify-around items-end h-full">
                {lifts.map((lift) => (
                  <Lift
                    key={lift.id}
                    id={lift.id}
                    liftStyle={lift.style}
                    doorsOpen={lift.doorsOpen}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
