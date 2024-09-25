import React, { useState, useEffect } from 'react';

type Lift = {
  id: number;
  currentFloor: number;
  isMoving: boolean;
  direction: 'up' | 'down' | null;
  doorsOpen: boolean;
};

const App: React.FC = () => {
  const [floors, setFloors] = useState<number | null>(null);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<number[]>([]); // Stores floor requests

  const initializeLifts = (numLifts: number) => {
    const initialLifts = Array.from({ length: numLifts }, (_, index) => ({
      id: index + 1,
      currentFloor: 1,
      isMoving: false,
      direction: null,
      doorsOpen: false,
    }));
    setLifts(initialLifts);
  };

  const requestLift = (floor: number) => {
    setRequests((prev) => [...prev, floor]); // Add floor request
  };

  const handleStartSimulation = () => {
    if (!floors || floors < 1 || floors > 100 || lifts.length < 1 || lifts.length > 10) {
      setError('Please enter valid values (Floors: 1-100, Lifts: 1-10)');
    } else {
      setError(null);
      console.log('Simulation started with', lifts.length, 'lifts and', floors, 'floors.');
    }
  };

  useEffect(() => {
    if (requests.length > 0) {
      handleLiftMovement();
    }
  }, [requests]);

  const handleLiftMovement = () => {
    const availableLift = findNearestLift(requests[0]);

    if (availableLift) {
      const updatedLifts = lifts.map((lift) => {
        if (lift.id === availableLift.id) {
          lift.isMoving = true;
          lift.direction = lift.currentFloor < requests[0] ? 'up' : 'down';

          // Simulate lift movement delay
          setTimeout(() => {
            lift.currentFloor = requests[0];
            lift.isMoving = false;
            lift.doorsOpen = true;
            setTimeout(() => {
              lift.doorsOpen = false;
              setRequests((prev) => prev.slice(1)); // Remove the handled request
            }, 2500); // Door open/close delay
          }, Math.abs(lift.currentFloor - requests[0]) * 2000); // Move 2s per floor
        }
        return lift;
      });

      setLifts(updatedLifts);
    }
  };

  const findNearestLift = (requestedFloor: number): Lift | null => {
    let nearestLift: Lift | null = null;
    let minDistance = Infinity;

    lifts.forEach((lift) => {
      if (!lift.isMoving) {
        const distance = Math.abs(lift.currentFloor - requestedFloor);
        if (distance < minDistance) {
          minDistance = distance;
          nearestLift = lift;
        }
      }
    });

    return nearestLift;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Lift Simulation</h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Number of Floors (1-100):</label>
            <input
              type="number"
              value={floors || ''}
              onChange={(e) => setFloors(Number(e.target.value))}
              min="1"
              max="100"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Number of Lifts (1-10):</label>
            <input
              type="number"
              onChange={(e) => initializeLifts(Number(e.target.value))}
              min="1"
              max="10"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleStartSimulation}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Start Simulation
          </button>
        </form>

        {/* Request Lift Buttons */}
        <div className="mt-6">
          {Array.from({ length: floors || 0 }, (_, index) => (
            <button
              key={index}
              className="m-2 p-2 bg-blue-500 text-white rounded"
              onClick={() => requestLift(index + 1)}
            >
              Request Lift at Floor {index + 1}
            </button>
          ))}
        </div>

        {/* Lift Status Display */}
        <div className="mt-6">
          {lifts.map((lift) => (
            <div key={lift.id} className="mb-2 p-2 border border-gray-400">
              <p>Lift {lift.id} - Current Floor: {lift.currentFloor}</p>
              <p>Status: {lift.isMoving ? 'Moving' : 'Idle'}</p>
              <p>Direction: {lift.direction || 'None'}</p>
              <p>Doors: {lift.doorsOpen ? 'Open' : 'Closed'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
