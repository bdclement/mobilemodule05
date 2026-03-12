import React, { createContext, useContext } from "react";
import useResponsive from "../utils/responsive";

export const ResponsiveContext = createContext();

export function ResponsiveProvider({ children }) {
  const responsive = useResponsive();

  // Cela permet de créer un objet stable qui ne change que si les dimensions changent
  // Sans ça responsive est modifier a chaque fois, cela re-render donc les composants et ma navigation repart a son state initial

  return (
    <ResponsiveContext.Provider value={responsive}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export const useResponsiveContext = () => useContext(ResponsiveContext);