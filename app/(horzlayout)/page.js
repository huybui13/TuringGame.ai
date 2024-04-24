'use client';

import {
	Heading,
	Stack,
	Text,
	Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '../firebase/authContext';

export default function Home() {
	const { user } = useAuthContext()
	const router = useRouter();

	useEffect(() => {
		localStorage.setItem("gameData", null)
	}, [])

	return (
			<Stack
				textAlign={'center'}
				align={'center'}
				spacing={{ base: 8, md: 10 }}
				py={{ base: 20, md: 28 }}>
				<Heading
					fontWeight={600}
					fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
					lineHeight={'110%'}>
					Think you can tell a human from a{' '}
					<Text as={'span'} color={'orange.400'}>
						machine?
					</Text>
				</Heading>
				<Stack direction={'row'}>
					<Button
						rounded={'full'} px={6}
						bg='orange'
						onClick={() => { 
							if (user == null) {router.push("signup");} else {router.push("load")} }}
					>
						{user == null ?  "Create account" : "Play Now"}
					</Button>
					<Button rounded={'full'} px={6}>
						Learn More
					</Button>
				</Stack>
			</Stack>
	)
}
