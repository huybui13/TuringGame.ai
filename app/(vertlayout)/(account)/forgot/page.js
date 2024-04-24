'use client';

import {
	FormControl,
	FormLabel,
	Input,
	Button,
	Box,
	Heading,
	Stack,
	Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { resetPassword } from '../../../firebase/userAuthFunctions';

export default function Page() {
	const [email, setEmail] = useState("")
	const [success, setSuccess] = useState(false);
	const [failure, setFailure] = useState(false);

	const handleSubmit = async () => {
		let { result, error } = await resetPassword(email);
		if (error) {
			setFailure(true);
			setSuccess(false);
			console.log(error)
		} else {
			setSuccess(true);
			setFailure(false);
		}
	}

	return (
		<Box
			display='flex'
			flexDir={'column'}
			w='100%'
			h='100%'
			justifyContent='center'
			alignItems={'center'}
		>
			<Heading fontSize={'4xl'} pb='16px'>Reset your password</Heading>
			<Stack>
				<FormControl pb='8px'>
					<FormLabel>Email address</FormLabel>
					<Input
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder='Enter email' w='300px' type="email"
					/>
				</FormControl>
				<Button variant={'outline'} onClick={handleSubmit}>Send email</Button>
				<Box display='flex' flexDir='column' maxW={'300px'}>
					{success ? <Text textColor={'green.300'}>Please check your email address.</Text> : <></>}
					{failure ? <Text textColor={'red.300'}>Could not find an account associated with this email.</Text> : <></>}
				</Box>
			</Stack>
		</Box>
	);
}