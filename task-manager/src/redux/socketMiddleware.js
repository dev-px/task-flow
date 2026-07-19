import { io } from "socket.io-client";
import { setConnectionState, receiveNotification } from "./slices/socketSlice";
import { setLogout } from "./slices/authSlice";
import toast from "react-hot-toast";

const socketMiddleware = () => {
  let socket = null;

  return (store) => (next) => (action) => {
    switch (action.type) {
      case "socket/connectSocket":
        // Prevent duplicate connections
        if (socket) return;

        // 1. Connect to the backend
        socket = io("http://localhost:5000", {
          // Optional: pass token in headers if you add auth middleware later
          // auth: { token: store.getState().auth.token }
        });

        // 2. Listen for successful connection
        socket.on("connect", () => {
          store.dispatch(setConnectionState(true));
          const state = store.getState();
          console.log("checking state socket", state);
          const adminId = state.auth.user?._id;
          // Emit the exact event your backend is waiting for
          if (adminId) {
            socket.emit("join_admin_room", adminId);
          }
        });

        socket.on("disconnect", () => {
          store.dispatch(setConnectionState(false));
        });

        socket.on("force_logout", (payload) => {
          console.log("force logout", payload);
          toast.error(payload.message || "Session expired.");
          store.dispatch(setLogout());
          setTimeout(() => {
            window.location.href = "/auth";
          }, 2000);
        });
        break;

      case "socket/disconnectSocket":
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        break;

      default:
        break;
    }

    return next(action);
  };
};

export default socketMiddleware;
