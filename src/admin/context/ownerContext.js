import { createContext, useContext } from 'react';

/**
 * Shared owner-dashboard state (active venue, signed-in user and shell actions).
 * Provided by <Dashboard /> so the Sidebar/TopBar show the same venue on every page
 * without each page having to thread the props through.
 */
export const OwnerContext = createContext(null);

export const useOwnerContext = () => useContext(OwnerContext) || {};
