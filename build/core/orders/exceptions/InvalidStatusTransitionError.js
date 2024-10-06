"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "Cannot change status from &1 to &2. Allowed status are: &3";
class InvalidStatusTransitionError extends Error {
    constructor(currentStatus, targetStatus, allowedCurrentStatusForTarget) {
        super(message
            .replace("&1", currentStatus)
            .replace("&2", targetStatus)
            .replace("&3", allowedCurrentStatusForTarget.join(",")));
    }
}
exports.default = InvalidStatusTransitionError;
module.exports = InvalidStatusTransitionError;
