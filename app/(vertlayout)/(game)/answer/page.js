'use client';

import {
	Input,
	Button,
	Heading,
	Text,
	Box,
	SkeletonText,
	CircularProgress,
	CircularProgressLabel
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthContext } from '../../../firebase/authContext';
import { useGameContext } from '../../../firebase/gameContext';

import { answerQuestions, getGameDocument } from '../../../firebase/cloudFunctions';
import { wait } from '../../../(util)/util'
import { useTimer } from 'react-timer-hook';
import CustomSpinner from '../../../(components)/customSpinner';

const AnswerItem = ({ text, question, onChange, isLoading }) => {
	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
			pb="16px"
			justifyContent={"center"}
			alignItems={"center"}
		>
			{isLoading ?
				<SkeletonText startColor='white' endColor='gray' mb={2} w="100%" noOfLines={2} spacing='4' skeletonHeight='4' /> :
				<Heading fontSize={"2xl"} alignSelf={"flex-start"} pb="8px">{text}</Heading>
			}
			<Text alignSelf={"flex-start"} pb="4px">{question}</Text>

			<Input
				placeholder={"Type your answer..."}
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

	const [loading, setLoading] = useState(true);
	const [showSpinner, setShowSpinner] = useState(false);

	const [answer1, setAnswer1] = useState('');
	const [answer2, setAnswer2] = useState('');
	const [answer3, setAnswer3] = useState('');

	const [question1, setQuestion1] = useState("Question 1");
	const [question2, setQuestion2] = useState("Question 2");
	const [question3, setQuestion3] = useState("Question 3");

	const answers = [0, 1, 2]

	const updateAnswers = async () => {
		console.log(gameData)
		let { result, error } = await getGameDocument(gameData.data.id);
		console.log(result, error)
		if (result.data.data.player1 == user.uid) {
			setQuestion1(result.data.data.player2Questions[0])
			setQuestion2(result.data.data.player2Questions[1])
			setQuestion3(result.data.data.player2Questions[2])

		} else {
			setQuestion1(result.data.data.player1Questions[0])
			setQuestion2(result.data.data.player1Questions[1])
			setQuestion3(result.data.data.player1Questions[2])
		}
		setLoading(false);
	};

	useEffect(() => {
		if (gameData && user) {
			updateAnswers();
		}
	}, [gameData, user]);

	const handleSubmit = async () => {
		// Show loading spinner
		setShowSpinner(true);

		// Send the questions to the game doc
		let { _, error } = await answerQuestions([answer1, answer2, answer3], gameData.data.id, user.uid);
		if (error) {
			console.log(error)
		} else {
			// Check if other player answered the questions
			// Move to answer page
			let waiting = true;
			let response;
			while (waiting) {
				response = await getGameDocument(gameData.data.id);
				if (response.result.data.data.player1 == user.uid) {
					if (response.result.data.data.player2Answers.length != 0) {
						waiting = false;
					}
				} else {
					if (response.result.data.data.player1Answers.length != 0) {
						waiting = false;
					}
				}
				wait(2000);
			}
			setGameData(response.result);
			localStorage.setItem('gameData', JSON.stringify(response.result));
			router.push("/guess");
		}
	}

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
				Answer the 3 questions
			</Heading>
			{answers.map((answer, index) => {
				if (index == 0) {
					return (<AnswerItem
						text={question1}
						onChange={(event) => { setAnswer1(event.target.value) }}
						isLoading={loading}
					/>)
				} else if (index == 1) {
					return (<AnswerItem
						text={question2}
						onChange={(event) => { setAnswer2(event.target.value) }}
						isLoading={loading}
					/>)
				} else {
					return (<AnswerItem
						text={question3}
						onChange={(event) => { setAnswer3(event.target.value) }}
						isLoading={loading}
					/>)
				}

			})}
			<Button w="100%" variant={'outline'} onClick={() => {
				handleSubmit()
			}} >
				Submit
			</Button>
			{showSpinner ?
				<CustomSpinner isOpen={showSpinner} />
				:
				<>
				</>
			}
		</Box>
	);

}
