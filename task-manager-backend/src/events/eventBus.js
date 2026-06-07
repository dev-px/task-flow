import EventEmitter from "events";

class EventBus extends EventEmitter {}
export const systemEvents = new EventBus();

// No magic strings!
export const EVENTS = {
  AUDIT_LOG_TRIGGERED: "AUDIT_LOG_TRIGGERED",
  EMAIL_SEND_INVITE: "EMAIL_SEND_INVITE",
};