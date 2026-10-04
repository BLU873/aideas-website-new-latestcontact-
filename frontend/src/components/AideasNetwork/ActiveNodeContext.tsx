'use client';

import { createContext, useContext } from 'react';

export interface ActiveNodeContextType {
  activeFocusNodeId: string;
  hoveredNodeId: string | null;
  isFinalPhase: boolean;
}

export const ActiveNodeContext = createContext<ActiveNodeContextType>({
  activeFocusNodeId: 'hod',
  hoveredNodeId: null,
  isFinalPhase: false,
});

export function useActiveNode() {
  return useContext(ActiveNodeContext);
}
