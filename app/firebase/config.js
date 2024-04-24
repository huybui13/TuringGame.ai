import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: remove these and put them in .env
const firebaseConfig = {
	apiKey: "AIzaSyCxRbEiOb4uzKvwdqUHpDjb6JHh30oo8ZU",
	authDomain: "turingame-ai.firebaseapp.com",
	projectId: "turingame-ai",
	storageBucket: "turingame-ai.appspot.com",
	messagingSenderId: "903547507674",
	appId: "1:903547507674:web:33d64ac7246a78c3a4e6e3",
	measurementId: "G-DTV3HLNGCN"
};

// Initialize Firebase and SDKs
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// 1- User doc
	// 1- uid
	// 2- email
	// 3- GameIDs
	// 4- Badges (in the future )
	// 5- wins
	// 6- loses
	// 7- userType (developer, personal, AI)
	// 8- modelIDs
// 2- Game doc
	// 1- GameID
	// 2- PlayerIDs (2 players)
	// 3- Player1Questions
	// 4- Player1Answers
	// 5- Player2Questions
	// 6- Player2Answers
	// 7- Status (Waiting, Started, Completed, Unfinished)
	// 8- Player1Status (Asked, Answered)
	// 9- Player2Status (Asked, Answered)
