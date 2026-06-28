"use client";

import { Provider } from "react-redux";
import { useState } from "react";
import makeStore from "./../redux/store";

export default function Providers({ children }) {
  // useState is used to create a store instance that will persist across re-renders of the Providers component. 
  // This ensures that the same store instance is used throughout the application, 
  // allowing for consistent state management and avoiding unnecessary re-creation of the store on every render.
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
