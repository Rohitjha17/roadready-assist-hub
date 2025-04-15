
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData } from "@/lib/firebase";
import { User, UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  loading: boolean;
  userDataLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true,
  userDataLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(false);
      
      if (user) {
        setUserDataLoading(true);
        try {
          const { userData, error } = await getUserData(user.uid);
          
          if (userData) {
            setCurrentUser(userData as User);
            setUserRole(userData.role as UserRole);
          } else {
            console.error("Error fetching user data:", error);
            toast({
              title: "Error",
              description: "Failed to load user data. Please try again.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
        } finally {
          setUserDataLoading(false);
        }
      } else {
        setCurrentUser(null);
        setUserRole(null);
        setUserDataLoading(false);
      }
    });

    return unsubscribe;
  }, [toast]);

  const value = {
    currentUser,
    userRole,
    loading,
    userDataLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
