import { createContext, ReactNode, useContext, useState } from 'react';

interface EntitlementContextValue {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
}

const EntitlementContext = createContext<EntitlementContextValue | undefined>(
  undefined
);

export function EntitlementProvider({ children }: { children: ReactNode }) {
  // TODO: replace with real RevenueCat entitlement check once account is connected
  const [isPro, setIsPro] = useState(false);

  return (
    <EntitlementContext.Provider value={{ isPro, setIsPro }}>
      {children}
    </EntitlementContext.Provider>
  );
}

export function useEntitlement() {
  const context = useContext(EntitlementContext);
  if (!context) {
    throw new Error('useEntitlement must be used within EntitlementProvider');
  }
  return context;
}