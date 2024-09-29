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
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error message
  const floorHeight = 120; // Adjusting height for better visibility

  // Initialize disabled buttons state for each floor
  useEffect(() => {
    const initialDisabledState: Record<number, { up: boolean; down: boolean }> =
      {};
    for (let i = 0; i <= floorsCount; i++) {
      initialDisabledState[i] = { up: false, down: false };
    }
    setDisabledButtons(initialDisabledState);
    console.log("Initialized disabled buttons state:", initialDisabledState);
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
    console.log("Initialized lifts:", initialLifts);
  };

  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting simulation with:", { floorsCount, liftsCount });

    if (
      floorsCount <= 0 ||
      floorsCount > 100 ||
      liftsCount <= 0 ||
      liftsCount > 10
    ) {
      setErrorMessage("Please enter valid values (Floors: 1-100, Lifts: 1-10)"); // Set error message
      return;
    }

    setErrorMessage(null); // Clear any previous error messages
    setIsSimulationStarted(true);
    console.log("Simulation started.");
  };

  const handleResetSimulation = () => {
    console.log("Resetting simulation...");
    setIsSimulationStarted(false);
    setLifts([]);
    setPendingRequests([]);
    setFloorsCount(0);
    setLiftsCount(0);
    setErrorMessage(null); // Reset error message on reset
  };

  const handleLiftRequest = (floorNumber: number, direction: "up" | "down") => {
    console.log(
      `Lift request received for floor ${floorNumber} to go ${direction}.`
    );
    const availableLift = findNearestAvailableLift(floorNumber);
    console.log("Available Lift:", availableLift); // Log the available lift

    if (availableLift) {
      moveLift(availableLift, floorNumber);
      console.log(`Moving Lift ${availableLift.id} to Floor ${floorNumber}`); // Log when the lift is moving

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
      console.log(
        `No available lifts. Added floor ${floorNumber} to pending requests.`
      );
    }
  };

  const findNearestAvailableLift = (floorNumber: number): LiftType | null => {
    let nearestLift: LiftType | null = null;
    let minDistance = Infinity;
    for (const lift of lifts) {
      if (!lift.isMoving && !lift.doorsOpen) {
        // Exclude lifts that are moving or have open doors
        const distance = Math.abs(lift.currentFloor - floorNumber);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLift = lift;
        }
      }
    }
    console.log(
      `Nearest available lift for floor ${floorNumber}:`,
      nearestLift
    );
    return nearestLift;
  };

  const moveLift = (lift: LiftType, destinationFloor: number) => {
    const floorsToMove = Math.abs(lift.currentFloor - destinationFloor);
    const timePerFloor = 2000; // 2 seconds per floor
    const totalTime = floorsToMove * timePerFloor;
    const destinationBottom = `${destinationFloor * floorHeight}px`;

    // Move the lift to the destination
    console.log(
      `Moving lift ${lift.id} to destination floor ${destinationFloor} in ${totalTime} ms.`
    );
    setLifts((prevLifts) =>
      prevLifts.map((l) =>
        l.id === lift.id
          ? {
              ...l,
              isMoving: true,
              style: {
                ...l.style,
                bottom: destinationBottom,
                transition: `bottom ${totalTime}ms linear`,
              },
            }
          : l
      )
    );

    // After the lift reaches the destination, open the doors
    setTimeout(() => {
      console.log(
        `Lift ${lift.id} has reached floor ${destinationFloor}. Opening doors.`
      );
      setLifts((prevLifts) =>
        prevLifts.map((l) =>
          l.id === lift.id
            ? {
                ...l,
                isMoving: false,
                doorsOpen: true,
                currentFloor: destinationFloor, // Correctly update currentFloor here
              }
            : l
        )
      );

      // Close the doors after 2.5 seconds
      setTimeout(() => {
        console.log(`Closing doors for lift ${lift.id}.`);
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
          console.log(`Moving to next pending request for floor ${nextFloor}.`);
          moveLift(lift, nextFloor);
        }
      }, 2500);
    }, totalTime);
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
            <div
              className={`text-red-600 border border-red-600 p-2 rounded mb-4 ${
                errorMessage ? "" : "hidden"
              }`}
              role="alert" // Add role for accessibility
              aria-live="assertive" // Add aria-live for dynamic updates
            >
              {errorMessage}
            </div>
            <label htmlFor="floorsCount" className="block text-lg">
              Number of Floors (1-100):
            </label>
            <input
              type="number"
              id="floorsCount"
              value={floorsCount}
              onChange={(e) => {
                const value = Number(e.target.value);
                console.log("Updated floors count:", value);
                setFloorsCount(value);
              }}
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
              onChange={(e) => {
                const value = Number(e.target.value);
                console.log("Updated lifts count:", value);
                setLiftsCount(value);
              }}
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
                    currentFloor={lift.currentFloor} // Pass the current floor of the lift
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
