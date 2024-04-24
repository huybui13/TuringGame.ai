'use client';

import {
	Heading,
	Box,
	Spinner,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { createGameDoc, matchPlayer } from '../../../firebase/cloudFunctions';
import { useAuthContext } from '../../../firebase/authContext';
import { useGameContext } from '../../../firebase/gameContext';
import { useRouter } from 'next/navigation';

export default function Page() {
	const router = useRouter();

	const { user, loading } = useAuthContext()
	const { gameData, setGameData } = useGameContext()

	useEffect(() => {
		const _matchPlayer = async () => {
			let { result, error } = await matchPlayer(user.uid)
			if (error) {
				console.log(error)
			} else {
				setGameData(result);
				localStorage.setItem('gameData', JSON.stringify(result));
				router.push("/ask");
			}
		}

		const startGame = async () => {
			let { result, error } = await createGameDoc(user.uid)
			if (error) {
				console.log(error)
			} else {
				_matchPlayer();
			}
		}

		if (!loading && user) {
			startGame();
		}
	}, [loading]);

	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
			h='100%'
			justifyContent='center'
			alignItems={'center'}
		>
			<Heading fontSize={'3xl'} pb='16px'>Finding Match</Heading>
			<Spinner size={"xl"} thickness={"4px"} />
		</Box>
	);
};