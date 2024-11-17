export type LiftType = {
  id: number;
  currentFloor: number;
  isMoving: boolean;
  doorsOpen: boolean;
  isAvailable: boolean;
  style: React.CSSProperties;
};

export const useLiftSimulation = (
  lifts: LiftType[],
  pendingRequests: number[],
  setLifts: React.Dispatch<React.SetStateAction<LiftType[]>>,
  setPendingRequests: React.Dispatch<React.SetStateAction<number[]>>,
  activeUpRequests: Set<number>,
  setActiveUpRequests: React.Dispatch<React.SetStateAction<Set<number>>>,
  activeDownRequests: Set<number>,
  setActiveDownRequests: React.Dispatch<React.SetStateAction<Set<number>>>
) => {
  const findNearestAvailableLift = (
    floorNumber: number,
    availableLifts: LiftType[]
  ): LiftType | null => {
    let nearestLift: LiftType | null = null;
    let minDistance = Infinity;

    for (const lift of availableLifts) {
      const distance = Math.abs(lift.currentFloor - floorNumber);
      if (distance < minDistance) {
        minDistance = distance;
        nearestLift = lift;
      }
    }
    return nearestLift;
  };

  const moveLift = (
    lift: LiftType,
    destinationFloor: number,
    direction: "up" | "down"
  ) => {
    const floorsToMove = Math.abs(lift.currentFloor - destinationFloor);
    const travelTime = floorsToMove * 2000;

    const destinationBottom = `${destinationFloor * 120}px`;

    setLifts((prevLifts) =>
      prevLifts.map((l) =>
        l.id === lift.id
          ? {
              ...l,
              isAvailable: false,
              isMoving: true,
              doorsOpen: false,
              style: {
                ...l.style,
                bottom: destinationBottom,
                transition: `bottom ${travelTime}ms linear`,
              },
            }
          : l
      )
    );

    setTimeout(() => {
      setLifts((prevLifts) =>
        prevLifts.map((l) =>
          l.id === lift.id
            ? {
                ...l,
                currentFloor: destinationFloor,
                isMoving: false,
                doorsOpen: true,
              }
            : l
        )
      );

      setTimeout(() => {
        setLifts((prevLifts) =>
          prevLifts.map((l) =>
            l.id === lift.id
              ? { ...l, doorsOpen: false, isAvailable: true }
              : l
          )
        );

        if (direction === "up") {
          setActiveUpRequests((prev) => {
            const updated = new Set(prev);
            updated.delete(destinationFloor);
            return updated;
          });
        } else if (direction === "down") {
          setActiveDownRequests((prev) => {
            const updated = new Set(prev);
            updated.delete(destinationFloor);
            return updated;
          });
        }

        processPendingRequests();
      }, 2500);
    }, travelTime);
  };

  const processPendingRequests = () => {
    if (pendingRequests.length > 0) {
      const nextFloor = pendingRequests[0];
      setPendingRequests((prev) => prev.slice(1));
      handleLiftRequest(nextFloor, "up");
    }
  };

  return { findNearestAvailableLift, moveLift };
};
