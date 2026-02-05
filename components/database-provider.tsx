'use client';

import { useEffect, useState, createContext, useContext, type ReactNode } from 'react';
import { DatabaseService } from '@/lib/database';

interface DatabaseContextType {
  isReady: boolean;
  isSeeding: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isReady: false,
  isSeeding: false,
  error: null,
});

export function useDatabaseReady() {
  return useContext(DatabaseContext);
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function initDatabase() {
      try {
        const needsSeeding = await DatabaseService.needsSeeding();
        
        if (needsSeeding) {
          setIsSeeding(true);
          await DatabaseService.seedDatabase();
          setIsSeeding(false);
        }
        
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        setIsSeeding(false);
      }
    }

    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={{ isReady, isSeeding, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}
