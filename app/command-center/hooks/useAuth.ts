'use client';
import { useState, useCallback } from 'react';
import { TEAM } from '../data/seed';
import type { TeamMember } from '../data/seed';

export function useAuth() {
  const [user, setUser] = useState<TeamMember | null>(null);
  const [error, setError] = useState(false);

  const login = useCallback((memberId: string, pin: string) => {
    const member = TEAM.find(m => m.id === memberId);
    if (member && member.pin === pin) {
      setUser(member);
      setError(false);
      return true;
    }
    setError(true);
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(false);
  }, []);

  const clearError = useCallback(() => setError(false), []);

  return { user, error, login, logout, clearError };
}
