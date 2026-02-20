import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  role: UserRole;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('IT Department');

  const toggleRole = () => {
    setRole(prev => prev === 'Staff' ? 'IT Department' : 'Staff');
  };

  return (
    <RoleContext.Provider value={{ role, toggleRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
}
