'use client';

import {
	Button,
	Heading,
	Text,
	Divider,
	Box,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
	SkeletonText,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Modal
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import EmojiRandomizer from '../../../(components)/emojiRandomizer'
import { getGameDocument, finishGame, reportGame } from '../../../firebase/cloudFunctions';
import { useGameContext } from '../../../firebase/gameContext';
import { useAuthContext } from '../../../firebase/authContext';

const AnswerItem = ({ question, answer, isLoading }) => {
	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
		>
			<Heading fontSize={"2xl"} alignSelf={"flex-start"} pb="8px">You asked...</Heading>
			{isLoading ?
				<SkeletonText startColor='white' endColor='gray' mb={2} w="100%" noOfLines={1} spacing='4' skeletonHeight='2' /> :
				<Text pb="4px">{question}</Text>
			}
			<Heading fontSize={"2xl"} alignSelf={"flex-start"} pb="8px">They answered...</Heading>
			{isLoading ?
				<SkeletonText startColor='white' endColor='gray' mb={2} w="100%" noOfLines={1} spacing='4' skeletonHeight='2' /> :
				<Text pb="4px">{answer}</Text>
			}
		</Box>
	)
};

const PlayAgain = ({ isCorrect, isOpen, cancelRef, isOpen2, cancelRef2, onClose2, onOpen2, router, gid, user }) => {
	//Skynet is real
	return (
		<>
			<Modal
				isOpen={isOpen}
				isCentered
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize='4xl' fontWeight='bold' color={isCorrect ? "green" : "red"}>
						{isCorrect ? "You guessed correctly!" : "Skynet is real..."}
					</ModalHeader>

					<ModalBody fontSize={'xl'}>
						Do you want to play again?
					</ModalBody>

					<ModalFooter>
						<Button onClick={async () => {
							let { result, error } = await reportGame(gid, user.uid);
							console.log(result, error)
							if (error) {
								console.log(error)
							} else {
								onOpen2()
							}
						}}>
							Report
						</Button>
						<Button ref={cancelRef} onClick={() => {
							router.push("/load")
						}} ml={3}>
							Play again
						</Button>
						<Button colorScheme='red' onClick={() => {
							router.push("/")
						}} ml={3}>
							Home
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<AlertDialog
				isOpen={isOpen2}
				leastDestructiveRef={cancelRef2}
				onClose={onClose2}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize='lg' fontWeight='bold'>
							Game has been reported
						</AlertDialogHeader>

						<AlertDialogBody>
							Thank you for your input. We will review the report and take action appropriately.
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef2} onClick={onClose2}>
								Ok
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	)
};

export default function Page() {
	const [showAnswer, setShowAnswer] = useState(false);
	const tmp = useDisclosure()
	const [correctness, setCorrectness] = useState(false)
	const cancelRef2 = useRef()
	const gameID = useRef()

	const router = useRouter()

	const { gameData, setGameData } = useGameContext();
	const { user } = useAuthContext();
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(true);

	const [answers, setAnswers] = useState([
		{ question: "Question 1?", answer: "Answer 1" },
		{ question: "Question 2?", answer: "Answer 2" },
		{ question: "Question 3?", answer: "Answer 3" },
	])

	const updateAnswers = async () => {
		let { result, error } = await getGameDocument(gameData.data.id);

		if (result.data.data.player1 == user.uid) {
			setAnswers([
				{ question: result.data.data.player1Questions[0], answer: result.data.data.player2Answers[0] },
				{ question: result.data.data.player1Questions[1], answer: result.data.data.player2Answers[1] },
				{ question: result.data.data.player1Questions[2], answer: result.data.data.player2Answers[2] }
			])
		} else {
			setAnswers([
				{ question: result.data.data.player2Questions[0], answer: result.data.data.player1Answers[0] },
				{ question: result.data.data.player2Questions[1], answer: result.data.data.player1Answers[1] },
				{ question: result.data.data.player2Questions[2], answer: result.data.data.player1Answers[2] }
			])
		}
		gameID.current = gameData.data.id;
		setLoading(false)
	};

	useEffect(() => {
		if (gameData && user && !done) {
			setDone(true);
			updateAnswers();
		}
	}, [gameData, user])

	const handleClick = (isHuman) => {
		if ((gameData.data.data.isAI && !isHuman) || (!gameData.data.data.isAI && isHuman)) {
			finishGame(true, gameData.data.id, user.uid)
			localStorage.removeItem("gameData")
			localStorage.removeItem("gameStatus")
			setCorrectness(true)
			setShowAnswer(true)
			return
		}

		finishGame(false, gameData.data.id, user.uid)
		localStorage.removeItem("gameData")
		setGameData(null)
		setCorrectness(false)
		setShowAnswer(true)
	};

	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
			h='100%'
			justifyContent='center'
			alignItems={'center'}
		>
			<Box
				display='flex'
				flexDir={'row'}
				w='100%'
				fontSize={'4xl'}
				justifyContent={"center"}
				alignItems={"center"}
				pb="16px"
				fontWeight={"medium"}
			>
				<Button
					h="60px"
					w="200px"
					fontSize={'4xl'}
					onClick={() => handleClick(true)}
				>
					Human&nbsp;<EmojiRandomizer isHuman={true} />
				</Button>
				&nbsp;or&nbsp;
				<Button
					h="60px"
					w="200px"
					fontSize={'4xl'}
					onClick={() => handleClick(false)}
				>
					AI&nbsp;<EmojiRandomizer isHuman={false} />
				</Button>
			</Box>
			{answers.map((answer, index) => {
				if (index === answers.length - 1) {
					return (
						<AnswerItem
							question={answer.question}
							answer={answer.answer}
							isLoading={loading}
						/>
					)
				}
				return (
					<>
						<AnswerItem
							question={answer.question}
							answer={answer.answer}
							isLoading={loading}
						/>
						<Divider m="16px" />
					</>
				)
			})}
			<PlayAgain
				isCorrect={correctness}
				isOpen={showAnswer}
				isOpen2={tmp.isOpen}
				cancelRef2={cancelRef2}
				onClose2={tmp.onClose}
				onOpen2={tmp.onOpen}
				router={router}
				gid={gameID.current}
				user={user}
			/>
		</Box>
	);
}