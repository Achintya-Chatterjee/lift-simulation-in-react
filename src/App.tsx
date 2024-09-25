import React, { useState } from 'react';

const App: React.FC = () => {
  const [floors, setFloors] = useState<number | null>(null);
  const [lifts, setLifts] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartSimulation = () => {
    if (!floors || !lifts || floors < 1 || floors > 100 || lifts < 1 || lifts > 10) {
      setError('Please enter valid values (Floors: 1-100, Lifts: 1-10)');
    } else {
      setError(null);
      // Proceed with simulation logic
      console.log('Starting simulation...');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Lift Simulation</h1>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label htmlFor="floors" className="block text-gray-700 font-medium">
              Number of Floors (1-100):
            </label>
            <input
              id="floors"
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
            <label htmlFor="lifts" className="block text-gray-700 font-medium">
              Number of Lifts (1-10):
            </label>
            <input
              id="lifts"
              type="number"
              value={lifts || ''}
              onChange={(e) => setLifts(Number(e.target.value))}
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
      </div>
    </div>
  );
};

export default App;
