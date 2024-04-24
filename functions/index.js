const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const firestore = require("firebase-admin/firestore");
const db = firestore.getFirestore();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	organization: "org-qFsBVi0IEWykZMwcc3NZdVz8",
	apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Create new user doc in firestore
exports.createUserDoc = functions.https.onCall(async (data, context) => {
	let result = null;
  
	// check if the user is banned, if he is banned send him an email and don't allow him to create a new user account.
	try {
	  const bannedSnapshot = await admin.firestore().collection('banned').where('email', '==', data.email).get();
	  if (!bannedSnapshot.empty) {
		const bannedUser = bannedSnapshot.docs[0].data();
		const message = {
		  to: bannedUser.email,
		  subject: 'You have been banned from our app',
		  text: `Dear ${bannedUser.name},\n\nWe regret to inform you that your account has been banned from our app for violating our terms of service. If you believe this decision was made in error, please contact our support team at support@example.com.\n\nBest regards,\nThe App Team`,
		};
		await admin.firestore().collection('banned').doc(bannedSnapshot.docs[0].id).update({ banned: true });
		await admin.firestore().collection('users').doc(bannedUser.id).delete();
		await admin.auth().deleteUser(bannedUser.uid);
		await admin.messaging().send(message);
		throw new functions.https.HttpsError('failed-precondition', 'This user is banned.');
	  }
  
	  result = await admin.firestore().collection('users').add({
		email: data.email,
		gameIDs: [],
		badges: [],
		wins: 0,
		losses: 0,
		modelIDs: [],
		userType: data.userType,
	  });
	} catch (e) {
	  throw new functions.https.HttpsError('failed-storage', 'Failed when storing the document in Firestore');
	}
  
	return { result: `Added new user to db: ${data.email} added.` };
});
  

// Create new game doc in firestore
exports.createGameDoc = functions.https.onCall(async (data, context) => {
	let result = null;

	try {
		result = await admin.firestore().collection("games").add({
			player1: data.uid,
			player2: null,
			player1Questions: [],
			player2Questions: [],
			player1Answers: [],
			player2Answers: [],
			player1Guess: "",
			player2Guess: "",
			gameStatus: "MATCHING",
			isAI: false

		})
	} catch (e) {
		throw new functions.https.HttpsError('failed-storage', 'failed when storing the game document in firestore')
	}

	return { result: `Started new game session with player: ${data.uid} added.` }
});

// Match players in firestore
exports.matchPlayersWithAI = functions.https.onCall(async (data, context) => {
	let result = null;
	try {
		// Check if user is currently in a game
		result = await db.collection("games").where("player1", "==", data.uid).where("gameStatus", "==", "STARTED").get()
		if (result.size > 0) {
			let deleteDocs = await db.collection("games").where("player1", "==", data.uid).where("gameStatus", "==", "MATCHING").get()
			deleteDocs.docs.forEach(async (doc, index) => {
				await db.collection("games").doc(doc.id).delete()
			})

			return { data: result.docs[0].data(), id: result.docs[0].id }
		}

		// Otherwise, place user in a game with AI
		result = await db.collection("games").where("player1", "==", data.uid).where("gameStatus", "==", "MATCHING").get()
		let ai = await db.collection("users").where("email", "==", "openai-gpt3.5").get()

		// Remove extra docs
		if (result.size > 1) {
			result.docs.forEach(async (doc, index) => {
				if (index == 0) {
					return
				}
				await db.collection("games").doc(doc.id).delete()
			})
		}

		// Add AI to game session
		await db.collection("games").doc(result.docs[0].id).set({ player2: ai.docs[0].id, gameStatus: "STARTED", isAI: true }, { merge: true })

		result = await db.collection("games").doc(result.docs[0].id).get()
	} catch (error) {
		throw new functions.https.HttpsError('internal', "idk")
	}

	return { data: result.data(), id: result.id }
});

exports.matchPlayersRandomly = functions.https.onCall(async (data, context) => {

});


exports.matchPlayersWithPlayers = functions.https.onCall(async (data, context) => {

});

exports.askQuestions = functions.https.onCall(async (data, context) => {
	let result = null;

	try {
		result = await admin.firestore().collection("games").doc(data.id).get()

		if (result.data().player1 == data.uid) {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player1Questions: data.questions,
			}, { merge: true })
		} else {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player2Questions: data.questions
			}, { merge: true })
		}
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}

	return { result: `Success` }
});

exports.answerQuestions = functions.https.onCall(async (data, context) => {
	let result = null;

	try {
		result = await admin.firestore().collection("games").doc(data.id).get()

		if (result.data().player1 == data.uid) {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player1Answers: data.answers,
			}, { merge: true })
		} else {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player2Answers: data.answers
			}, { merge: true })
		}
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}

	return { result: `Success` }
});

exports.getGameDocument = functions.https.onCall(async (data, context) => {
	let result = null;

	try {
		result = await admin.firestore().collection("games").doc(data.id).get()
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}

	return { data: result.data(), id: result.id }
});

exports.respondToPlayerGPT = functions.firestore.document('games/{gameID}').onUpdate(async (change, context) => {
	try {
		let ai = await db.collection("users").where("email", "==", "openai-gpt3.5").get()
		let gameDoc = change.after.data();

		if (gameDoc.player2 == ai.docs[0].id && gameDoc.gameStatus == "STARTED" && gameDoc.player1Questions.length > 0 && gameDoc.player2Questions.length == 0) {
			const response = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: "Your task today as a language model is to trick humans into thinking that you are human as well. You need to provide me with three questions to ask to the humans, however, there are certain requirements for these questions. The questions must not be knowledge specific (e.g., What is the distance from the earth to the sun?), include a wacky and funny question (e.g., Do you like to pick your nose?), and are questions a human might ask. Never ask the same question twice. Please ask three questions of this form and list them as shown below:\n[Question 1@Question 2@Question 3]\nYour questions:",
				temperature: 1,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});

			let aiQuestions = response.data.choices[0].text.trim().replace("[", "").replace("]", "").split("@");
			result = await admin.firestore().collection("games").doc(change.after.id).set({
				player2Questions: aiQuestions,
			}, { merge: true });

			const response2 = await openai.createCompletion({
				model: "text-davinci-003",
				prompt: `Your task today as a language model is to trick humans into thinking that you are human as well. You will answer three questions asked by a human, but make sure that the answers are as human as possible and never reveal that you are human. If the human provides a knowledge-based question (e.g., what is the distance between the Earth and the moon), answer with a stupid answer and not a fact-based answer. Here are the three questions:\n${gameDoc.player1Questions[0]}\n${gameDoc.player1Questions[1]}\n${gameDoc.player1Questions[2]}\n. Please answer the three questions and list them as shown below:\n[Answer 1@Answer 2@Answer 3]\nYour answers:`,
				temperature: 1,
				max_tokens: 256,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0,
			});

			let aiAnswers = response2.data.choices[0].text.trim().replace("[", "").replace("]", "").split("@")
			result = await admin.firestore().collection("games").doc(change.after.id).set({
				player2Answers: aiAnswers,
			}, { merge: true });
		}
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}
});

exports.finishGame = functions.https.onCall(async (data, context) => {
	let result = null;

	try {
		result = await admin.firestore().collection("games").doc(data.id).get()

		if (result.data().player1 == data.uid) {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player1Guess: data.correct ? "CORRECT" : "INCORRECT",
				gameStatus: "FINISHED"
			}, { merge: true })
		} else {
			result = await admin.firestore().collection("games").doc(data.id).set({
				player2Guess: data.correct ? "CORRECT" : "INCORRECT",
				gameStatus: "FINISHED"
			}, { merge: true })
		}
		result = await admin.firestore().collection("users").doc(data.uid).set({
			wins: data.correct ? firestore.FieldValue.increment(1) : firestore.FieldValue.increment(-1),
			losses: !data.correct ? firestore.FieldValue.increment(1) : firestore.FieldValue.increment(-1),
			gameIDs: firestore.FieldValue.arrayUnion(data.id)
		}, { merge: true })

		//TODO: End game for AI as well
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}

	return { result: `Success` }
});


exports.reportGame = functions.https.onCall(async (data, context) => {
	let result = null;
	console.log(data)
	try {
		result = await admin.firestore().collection("reports").add({
			reporterID: data.reporterID,
			gameID: data.gameID,
		})
	} catch (e) {
		console.log(e)
		throw new functions.https.HttpsError('internal', 'idk')
	}

	return { result: `Success` }
});