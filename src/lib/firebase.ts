
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, updateDoc, DocumentData, CollectionReference, Query } from "firebase/firestore";
import { UserRole, Product, ServiceRequest } from "@/types";

// Replace these placeholders with your actual Firebase configuration
// You can find these values in your Firebase project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_LIXww6VaQB0NBTBLnQXJRnDVUBJ-H8c",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "orva-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "orva-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "orva-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string, role: UserRole, userData: any) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Add user role and data to Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      role,
      ...userData,
      createdAt: new Date().toISOString()
    });
    
    return { user, error: null };
  } catch (error) {
    console.error("Error registering user:", error);
    return { user: null, error };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    
    return { user, userData, error: null };
  } catch (error) {
    console.error("Error logging in:", error);
    return { user: null, userData: null, error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error("Error logging out:", error);
    return { error };
  }
};

export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return { userData: userDoc.data(), error: null };
    } else {
      return { userData: null, error: "User not found" };
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { userData: null, error };
  }
};

// Products functions
export const addProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error adding product:", error);
    return { id: null, error };
  }
};

export const getProducts = async (filters = {}) => {
  try {
    const productsRef = collection(db, "products") as CollectionReference<Product>;
    // Change this line to fix the typing issue - make this a variable of type Query<Product>
    let productsQuery: Query<Product> = productsRef;
    
    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      // Create a query based on the collection reference
      productsQuery = query(productsRef, ...Object.entries(filters).map(([key, value]) => 
        where(key, "==", value)
      ));
    }
    
    const querySnapshot = await getDocs(productsQuery);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    return { products, error: null };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [] as Product[], error };
  }
};

// Service requests functions
export const createServiceRequest = async (requestData: any) => {
  try {
    const docRef = await addDoc(collection(db, "serviceRequests"), {
      ...requestData,
      status: "pending",
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    console.error("Error creating service request:", error);
    return { id: null, error };
  }
};

export const getServiceRequests = async (filters = {}) => {
  try {
    const requestsRef = collection(db, "serviceRequests") as CollectionReference<ServiceRequest>;
    // Change this line to fix the typing issue - make this a variable of type Query<ServiceRequest>
    let requestsQuery: Query<ServiceRequest> = requestsRef;
    
    // Apply filters if provided
    if (Object.keys(filters).length > 0) {
      // Create a query based on the collection reference
      requestsQuery = query(requestsRef, ...Object.entries(filters).map(([key, value]) => 
        where(key, "==", value)
      ));
    }
    
    const querySnapshot = await getDocs(requestsQuery);
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ServiceRequest[];
    
    return { requests, error: null };
  } catch (error) {
    console.error("Error fetching service requests:", error);
    return { requests: [] as ServiceRequest[], error };
  }
};

export const updateServiceRequest = async (requestId: string, updateData: any) => {
  try {
    const requestRef = doc(db, "serviceRequests", requestId);
    await updateDoc(requestRef, updateData);
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating service request:", error);
    return { success: false, error };
  }
};

export { auth, db };
