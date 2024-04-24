'use client';

import {
	Button,
	Heading,
	Box,
	Input,
	Spinner,
	Text,
	CircularProgress,
	CircularProgressLabel
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthContext } from '../../../firebase/authContext';
import { useGameContext } from '../../../firebase/gameContext';

import { askQuestions, getGameDocument } from '../../../firebase/cloudFunctions';
import { wait } from '../../../(util)/util'
import { useTimer } from 'react-timer-hook';
import CustomSpinner from '../../../(components)/customSpinner';

const QuestionItem = ({ text, onChange }) => {
	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
			pb="16px"
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Heading fontSize={"2xl"} alignSelf={"flex-start"} pb="16px">{text}</Heading>
			<Input
				placeholder={"Type your question..."}
				onChange={onChange}
				w='100%'
			/>
		</Box>
	)
};

export default function Page() {
	const router = useRouter();
	const { gameData, setGameData } = useGameContext();
	const { user } = useAuthContext();

	const [showSpinner, setShowSpinner] = useState(false);

	const [question1, setQuestion1] = useState('');
	const [question2, setQuestion2] = useState('');
	const [question3, setQuestion3] = useState('');

	const handleSubmit = async () => {
		// Show loading spinner
		setShowSpinner(true);

		// Send the questions to the game doc
		let { _, error } = await askQuestions([question1, question2, question3], gameData.data.id, user.uid);
		if (error) {
			console.log(error)
		} else {
			// Check if other player asked questions
			// Move to answer page
			let waiting = true;
			let response;
			while (waiting) {
				response = await getGameDocument(gameData.data.id);
				if (response.result.data.data.player1 == user.uid) {
					if (response.result.data.data.player2Questions.length != 0) {
						waiting = false;
					}
				} else {
					if (response.result.data.data.player1Questions.length != 0) {
						waiting = false;
					}
				}
				wait(2000);
			}
			setGameData(response.result);
			localStorage.setItem('gameData', JSON.stringify(response.result));
			router.push("/answer");
		}
	}

	const questions = [
		{ text: "Question 1", setQuestion: setQuestion1 },
		{ text: "Question 2", setQuestion: setQuestion2 },
		{ text: "Question 3", setQuestion: setQuestion3 },
	]

	const time = new Date()
	time.setSeconds(time.getSeconds() + 30);
	const {
		seconds,
		start,
	} = useTimer({
		expiryTimestamp: time, onExpire: () => {
			handleSubmit()
		}
	});

	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='80%'
			h='100%'
			justifyContent='center'
			alignItems={'center'}
		>
			<CircularProgress color='orange' value={(seconds / 30) * 100} thickness='10px' size='120px'>
				<CircularProgressLabel>{seconds}</CircularProgressLabel>
			</CircularProgress>

			<Heading fontSize={'4xl'} pb='16px'>
				Ask your 3 questions
			</Heading>
			{questions.map((question) => (
				<QuestionItem text={question.text} onChange={(event) => { question.setQuestion(event.target.value) }} />
			))}
			<Button w="100%" variant={'outline'} onClick={() => { handleSubmit() }}>Submit</Button>
			{showSpinner ?
				<CustomSpinner isOpen={showSpinner} />
				:
				<>
				</>
			}
		</Box>
	);
}
