import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	signInWithPopup,
	sendPasswordResetEmail,
} from "firebase/auth";
import { app } from "./config";
import "firebase/auth";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "./config";

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export async function login(email, password) {
	let result = null,
	  error = null;
	try {
		const bannedRef = collection(db, 'banned');
		const bannedSnapshot = await getDocs(query(bannedRef, where('email', '==', email)));
		if (!bannedSnapshot.empty) {
			window.alert('You are banned, please check your email for more details on why you were banned.');
			throw new Error("Banned User")
		  }
	  result = await signInWithEmailAndPassword(auth, email, password);
	} catch (e) {
	  error = e;
	}
  
	return { result, error };
}
  
  export async function signup(email, password) {
	let result = null,
	  error = null;
	try {
		const bannedRef = collection(db, 'banned');
		const bannedSnapshot = await getDocs(query(bannedRef, where('email', '==', email)));
		if (!bannedSnapshot.empty) {
			window.alert('You are banned, please check your email for more details on why you were banned.');
			throw new Error("Banned User")
		  }
	  result = await createUserWithEmailAndPassword(auth, email, password);
	} catch (e) {
	  error = e;
	}
  
	return { result, error };
  }
  

export async function logout() {
	let result = null,
		error = null;
	try {
		result = await signOut(auth);
	} catch (e) {
		error = e;
	}

	return { result, error };
}

export async function googleSignin() {
	let result = null,
	  error = null;
	try {
	  const { user } = await signInWithPopup(auth, googleAuthProvider);
	  const bannedRef = collection(db, 'banned');
	  const bannedSnapshot = await getDocs(query(bannedRef, where('email', '==', email)));
	  if (!bannedSnapshot.empty) {
		window.alert('You are banned, please check your email for more details on why you were banned.');
		throw new Error("Banned User")
		}
	  result = user;
	} catch (e) {
	  error = e;
	}
  
	return { result, error };
  }
  

export async function resetPassword(email) {
	let result = null,
		error = null;
	try {
		result = await sendPasswordResetEmail(auth, email);
	} catch (e) {
		error = e;
	}

	return { result, error };
}