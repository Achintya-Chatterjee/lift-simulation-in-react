import React, { useState } from "react";
import Floor from "./components/Floor";
import Lift from "./components/Lift";
import { useLiftSimulation, LiftType } from "./liftSimulation";
const App: React.FC = () => {
  const [floorsCount, setFloorsCount] = useState<number>(0);
  const [liftsCount, setLiftsCount] = useState<number>(0);
  const [isSimulationStarted, setIsSimulationStarted] =
    useState<boolean>(false);
  const [lifts, setLifts] = useState<LiftType[]>([]);
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [activeUpRequests, setActiveUpRequests] = useState<Set<number>>(
    new Set()
  );
  const [activeDownRequests, setActiveDownRequests] = useState<Set<number>>(
    new Set()
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { findNearestAvailableLift, moveLift } = useLiftSimulation(
    lifts,
    pendingRequests,
    setLifts,
    setPendingRequests,
    activeUpRequests,
    setActiveUpRequests,
    activeDownRequests,
    setActiveDownRequests
  );
  const handleStartSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      floorsCount <= 0 ||
      floorsCount > 100 ||
      liftsCount <= 0 ||
      liftsCount > 10
    ) {
      setErrorMessage("Please enter valid values (Floors: 1-100, Lifts: 1-10)");
      return;
    }
    setErrorMessage(null);
    setIsSimulationStarted(true);
    const initializedLifts = initializeLifts(liftsCount);
    setLifts(initializedLifts);
  };
  const handleResetSimulation = () => {
    setIsSimulationStarted(false);
    setLifts([]);
    setPendingRequests([]);
    setActiveUpRequests(new Set());
    setActiveDownRequests(new Set());
    setFloorsCount(0);
    setLiftsCount(0);
    setErrorMessage(null);
  };

  const handleLiftRequest = (floorNumber: number, direction: "up" | "down") => {
    if (direction === "up" && activeUpRequests.has(floorNumber)) {
      console.log(
        `Up request for floor ${floorNumber} is already being served.`
      );
      return;
    }
    if (direction === "down" && activeDownRequests.has(floorNumber)) {
      console.log(
        `Down request for floor ${floorNumber} is already being served.`
      );
      return;
    }

    const availableLifts = lifts.filter(
      (lift) => lift.isAvailable && !lift.doorsOpen
    );
    if (availableLifts.length === 0) {
      setPendingRequests((prev) => [...prev, floorNumber]);
      return;
    }

    const nearestLift = findNearestAvailableLift(floorNumber, availableLifts);

    if (nearestLift) {
      if (direction === "up") {
        setActiveUpRequests((prev) => new Set(prev).add(floorNumber));
      } else if (direction === "down") {
        setActiveDownRequests((prev) => new Set(prev).add(floorNumber));
      }
      moveLift(nearestLift, floorNumber, direction);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <header className="py-6">
        <h1 className="text-3xl font-bold">Lift Simulation by Achintya</h1>
        <button
          className="bg-red-600 text-white py-2 px-4 rounded mt-4"
          onClick={handleResetSimulation}
          style={{ display: isSimulationStarted ? "block" : "none" }}
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
              role="alert"
            >
              {errorMessage}
            </div>
            <label htmlFor="floorsCount" className="block text-lg">
              Number of Floors (1-100):
            </label>
            <input
              type="number"
              id="floorsCount"
              value={floorsCount === 0 ? "" : floorsCount}
              onChange={(e) => setFloorsCount(Number(e.target.value) || 0)}
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
              value={liftsCount === 0 ? "" : liftsCount}
              onChange={(e) => setLiftsCount(Number(e.target.value) || 0)}
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
        <div className="relative w-full max-w-screen-lg h-auto flex flex-col mx-auto z-10">
          <div className="relative">
            <div className="relative grid grid-rows-[repeat(${floorsCount},_1fr)] z-10">
              {Array.from({ length: floorsCount + 1 }, (_, index) => (
                <Floor
                  key={index}
                  floorNumber={floorsCount - index}
                  floorHeight={120}
                  handleLiftRequest={handleLiftRequest}
                  isTopFloor={floorsCount - index === floorsCount}
                  isGroundFloor={floorsCount - index === 0}
                />
              ))}
            </div>
            <div className="relative flex justify-end w-full max-w-screen-lg h-full mx-auto bottom-24 left-0 z-0">
              <div className="flex justify-around items-end h-full mb-[200px] gap-2">
                {lifts.map((lift) => (
                  <Lift
                    key={lift.id}
                    id={lift.id}
                    liftStyle={lift.style}
                    doorsOpen={lift.doorsOpen}
                    currentFloor={lift.currentFloor}
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
const initializeLifts = (count: number): LiftType[] => {
  const initialLifts: LiftType[] = [];
  for (let i = 0; i < count; i++) {
    initialLifts.push({
      id: i + 1,
      currentFloor: 0,
      isMoving: false,
      doorsOpen: false,
      isAvailable: true,
      style: { bottom: "0px" },
    });
  }
  return initialLifts;
};
export default App;
