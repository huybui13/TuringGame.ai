import { app } from './config';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "localhost", 5001);

// Create new user doc in firestore
export async function createUserDoc(email, userType) {
	let result = null, error = null;
	const createUserDocFunction = httpsCallable(functions, 'createUserDoc');

	try {
		result = await createUserDocFunction({ email: email, userType: userType })
	} catch (e) {
		error = e
	}

	return { result, error };
};

// Create new game session doc in firestore
export async function createGameDoc(uid) {
	let result = null, error = null;
	const createGameDocFunction = httpsCallable(functions, 'createGameDoc');

	try {
		result = await createGameDocFunction({ uid: uid })
	} catch (e) {
		error = e
	}

	return { result, error };
};

// Match a player
export async function matchPlayer(uid) {
	let result = null, error = null;
	const matchPlayerFunction = httpsCallable(functions, 'matchPlayersWithAI');

	try {
		result = await matchPlayerFunction({ uid: uid })
	} catch (e) {
		error = e
	}

	return { result, error };
};

export async function askQuestions(questions, gameID, userID) {
	let result = null, error = null;
	const askQuestionsFunction = httpsCallable(functions, 'askQuestions');

	try {
		result = await askQuestionsFunction({ questions: questions, id: gameID, uid: userID })
	} catch (e) {
		error = e
	}

	return { result, error };
};

export async function answerQuestions(answers, gameID, userID) {
	let result = null, error = null;
	const answerQuestionsFunction = httpsCallable(functions, 'answerQuestions');

	try {
		result = await answerQuestionsFunction({ answers: answers, id: gameID, uid: userID })
	} catch (e) {
		error = e
	}

	return { result, error };
};

export async function getGameDocument(gameID) {
	let result = null, error = null;
	const getGameDocumentFunction = httpsCallable(functions, 'getGameDocument');

	try {
		result = await getGameDocumentFunction({ id: gameID })
	} catch (e) {
		error = e
	}

	return { result, error };
};

export async function finishGame(correct, gameID, userID) {
	let result = null, error = null;
	const finishGameFunction = httpsCallable(functions, 'finishGame');

	try {
		result = await finishGameFunction({ correct: correct, id: gameID, uid: userID })
	} catch (e) {
		error = e
	}

	return { result, error };
};

export async function reportGame(gameID, reporterID) {
	let result = null, error = null;
	const reportGameFunction = httpsCallable(functions, 'reportGame');

	try {
		result = await reportGameFunction({ gameID: gameID, reporterID: reporterID })
	} catch (e) {
		error = e
	}

	return { result, error };
};
