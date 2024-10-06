const message = "Cannot change status from &1 to &2. Allowed status are: &3";

export default class InvalidStatusTransitionError extends Error {
  constructor(
    currentStatus: string,
    targetStatus: string,
    allowedCurrentStatusForTarget: string[]
  ) {
    super(
      message
        .replace("&1", currentStatus)
        .replace("&2", targetStatus)
        .replace("&3", allowedCurrentStatusForTarget.join(","))
    );
  }
}


