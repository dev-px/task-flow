import logger from "../../config/logger.config.js";
import env from "../../config/env.config.js";
import transporter from "../../config/mailer.config.js";
import { EVENTS, systemEvents } from "../eventBus.js";

systemEvents.on(EVENTS.EMAIL_SEND_INVITE, async (payload) => {

});