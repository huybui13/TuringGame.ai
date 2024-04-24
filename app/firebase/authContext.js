import { createContext, useContext, useEffect, useState } from "react";
import {
	onAuthStateChanged,
	getAuth,
} from "firebase/auth";
import { app } from "./config";
import "firebase/auth";

const auth = getAuth(app);

export const AuthContext = createContext({});
export const useAuthContext = () => useContext(AuthContext);
export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading  }}>
			{children}
		</AuthContext.Provider>
	)
};