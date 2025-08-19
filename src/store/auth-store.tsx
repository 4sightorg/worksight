
"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  accessToken: string
  lastLogin?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null && accessToken !== null

  const logout = async () => {
    try {
      // Dynamic import to avoid circular dependency
      const { signOut: authSignOut } = await import("@/lib/auth")
      await authSignOut()
      setUser(null)
      setAccessToken(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const refreshUser = async () => {
    setIsLoading(true)
    try {
      // Dynamic import to avoid circular dependency
      const { getCurrentUser } = await import("@/lib/auth")
      const currentUser = await getCurrentUser()
      if (currentUser) {
        setUser(currentUser)
        setAccessToken(currentUser.accessToken)
      } else {
        setUser(null)
        setAccessToken(null)
      }
    } catch (error) {
      console.error("Error refreshing user:", error)
      setUser(null)
      setAccessToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize auth state on mount
  useEffect(() => {
    refreshUser()
  }, [])

  // Set up auth state listeners for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "accessToken") {
        refreshUser()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        accessToken, 
        isLoading, 
        isAuthenticated,
        setUser, 
        setAccessToken, 
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
