"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MockModeContextType {
  useMock: boolean;
  setUseMock: (v: boolean) => void;
}

const MockModeContext = createContext<MockModeContextType>({
  useMock: true,
  setUseMock: () => {},
});

export function MockModeProvider({ children }: { children: ReactNode }) {
  const [useMock, setUseMock] = useState(true);
  return (
    <MockModeContext.Provider value={{ useMock, setUseMock }}>
      {children}
    </MockModeContext.Provider>
  );
}

export function useMockMode() {
  return useContext(MockModeContext);
}
