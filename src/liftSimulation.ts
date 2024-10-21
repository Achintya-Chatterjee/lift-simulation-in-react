export type LiftType = {
  id: number;
  currentFloor: number;
  isMoving: boolean;
  doorsOpen: boolean;
  style: React.CSSProperties;
};

export const useLiftSimulation = (
  lifts: LiftType[],
  pendingRequests: number[],
  setLifts: React.Dispatch<React.SetStateAction<LiftType[]>>,
  setDisabledButtons: React.Dispatch<
    React.SetStateAction<Record<number, { up: boolean; down: boolean }>>
  >,
  setPendingRequests: React.Dispatch<React.SetStateAction<number[]>>
) => {
  const findNearestAvailableLift = (floorNumber: number): LiftType | null => {
    let nearestLift: LiftType | null = null;
    let minDistance = Infinity;

    for (const lift of lifts) {
      if (!lift.isMoving && !lift.doorsOpen) {
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
    const timePerFloor = 2000;
    const totalTime = floorsToMove * timePerFloor;

    const destinationBottom = `${destinationFloor * 120}px`;

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

      setTimeout(() => {
        setLifts((prevLifts) =>
          prevLifts.map((l) =>
            l.id === lift.id ? { ...l, doorsOpen: false } : l
          )
        );

        setDisabledButtons((prev) => ({
          ...prev,
          [destinationFloor]: { up: false, down: false },
        }));

        if (pendingRequests.length > 0) {
          const nextFloor = pendingRequests[0];
          setPendingRequests((prev) => prev.slice(1));
          moveLift(lift, nextFloor);
        }
      }, 2500);
    }, totalTime);
  };

  return { findNearestAvailableLift, moveLift };
};
