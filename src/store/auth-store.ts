
import { createContext, useContext, useState, ReactNode } from "react"

// Use .tsx extension for JSX
// This file should be renamed to auth-store.tsx if not already
interface AuthState {
  user: any | null
  accessToken: string | null
}

interface AuthContextType extends AuthState {
  setUser: (user: any) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    // Optionally clear localStorage or cookies
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, setUser, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
