'use client';

import {
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Heading,
	Text,
	Divider,
	Box,
	InputRightElement,
	InputGroup,
	Select,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { googleSignin, signup } from '../../../firebase/userAuthFunctions';
import { createUserDoc } from '../../../firebase/cloudFunctions';
import { verifyEmail, verifyPassword } from '../../../(util)/util';
import CustomSpinner from '../../../(components)/customSpinner';

export default function Page() {
	const router = useRouter();

	const [show, setShow] = useState(false)
	const handleClick = () => setShow(!show)

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [accountType, setAccountType] = useState("");

	const [emailValid, setEmailValid] = useState(true);
	const [passwordValid, setPasswordValid] = useState(true);

	const [showTOS, setShowTOS] = useState(false);
	const [showAccType, setShowAccType] = useState(false);
	const [signinType, setSigninType] = useState("");

	const [spinner, setSpinner] = useState(false);

	const handleSubmit = async () => {
		setSpinner(true)
		let { result, error } = await signup(email, password);

		if (error) {
			console.log(error)
			setSpinner(false)
		} else {
			let { result, error } = await createUserDoc(email, accountType)
			if (error) {
				setSpinner(false)
				console.log(error)
			} else {
				router.push("/");
			}
		}
	};

	const handleGoogleSubmit = async () => {
		setSpinner(true)
		let { result, error } = await googleSignin(email, password);
		let googleEmail = result.user.email
	
		if (error) {
			setSpinner(false)
			console.log(error)
		} else {
			let { result, error } = await createUserDoc(googleEmail, accountType)
			if (error) {
				setSpinner(false)
				console.log(error)
			} else {
				router.push("/");
			}
		}
	}

	return (
		<>
			<Box
				display='flex'
				flexDir={'column'}
				w='100%'
				h='100%'
				justifyContent='center'
				alignItems={'center'}
			>
				<CustomSpinner isOpen={spinner} />
				<Heading fontSize={'4xl'} pb='16px'>Create your account</Heading>
				<Stack>
					<FormControl pb='8px'>
						<FormLabel>Email address</FormLabel>
						<Input
							isInvalid={!emailValid}
							errorBorderColor='red.300'
							value={email}
							onChange={(event) => { setEmail(event.target.value) }}
							onBlur={(event) => {
								verifyEmail(email) ? setEmailValid(true) : setEmailValid(false)
							}}
							placeholder='Enter email' w='300px' type="email"
						/>
					</FormControl>
					<FormControl pb='8px'>
						<FormLabel>Password</FormLabel>
						<InputGroup w='300px' type="password" >
							<Input
								isInvalid={!passwordValid}
								errorBorderColor='red.300'
								value={password}
								type={show ? 'text' : 'password'}
								placeholder='Enter password'
								onChange={(event) => { setPassword(event.target.value); }}
								onBlur={(event) => {
									verifyPassword(password) ? setPasswordValid(true) : setPasswordValid(false)
								}}
							/>
							<InputRightElement width='4.5rem'>
								<Button h='1.75rem' size='sm' onClick={handleClick}>
									{show ? 'Hide' : 'Show'}
								</Button>
							</InputRightElement>
						</InputGroup>
					</FormControl>
					<Button variant={'outline'} bg='transparent' onClick={() => {
						if (emailValid && passwordValid) {
							setShowAccType(true);
							setSigninType("email")
						}
					}}>Continue</Button>
					<Box display='flex' flexDir='row'>
						<Text>Have an account?</Text> <Text pl='2px' color={'#2B6CB0'}><Link href='/login'>Sign in</Link></Text>
					</Box>
					<Box display='flex' flexDir='column' maxW={'300px'} textColor={'red.300'}>
						{!emailValid ? <Text>Please enter a valid email.</Text> : <></>}
						{!passwordValid ? <Text>Please enter a password with more than 8 characters.</Text> : <></>}
					</Box>
					<Divider />
					<Button
						variant={'outline'}
						leftIcon={<FcGoogle />} onClick={() => { setShowAccType(true); setSigninType("google") }}>
						Continue with Google
					</Button>
				</Stack>
			</Box>

			<Modal size={"3xl"} isOpen={showTOS} onClose={() => {
				setShowTOS(false)
			}}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize={24} textAlign={"center"}>Terms Of Service</ModalHeader>
					<ModalCloseButton />
					<ModalBody overflow={"scroll"}>
						<div className='overflow-scroll'>
							<Text fontSize='md'>Our aim with turingame.ai is to create a novel way for users to engage both with emerging AI technologies and other players. We have created a set of guidelines for user conduct when sending messages to ensure that turingame.ai remains an enjoyable experience for our users.</Text>
							<Divider marginY={15} />
							<Text as='b' fontSize='lg'>Be Respectful</Text>
							<Text fontSize='md'>We want to keep the turingame.ai experience fun and inviting for all. That is why we do not allow your in-game messages to contain explicit, harassing, or offensive content of any kind. We do not allow swearing, hateful conduct, harassment, or trolling.</Text>
							<br />
							<Text as='b' fontSize='lg'>Be Safe</Text>
							<Text fontSize='md'>We want our users to protect their personal security while using our service. We do not allow users to share personally identifying information such as full name or exact location.</Text>
							<br />
							<Text as='b' fontSize='lg'>No Spam or Advertising</Text>
							<Text fontSize='md'>We want users to be able to enjoy an engaging experience free from advertisements and irrelevant spam messages. We do not allow users to send advertising messages, links to outside sources, or repetitive spam.</Text>
							<Divider marginY={15} />
							<Text fontSize='md'>Violating these community guidelines may result in account suspension or deletion.</Text>
						</div>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='green' mr={3} onClick={() => {
							setShowTOS(false)
							if (signinType == "email") {
								handleSubmit()
							} else {
								handleGoogleSubmit()
							}

						}}>
							I Agree
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
			<Modal size={"md"} isOpen={showAccType} onClose={() => {
				setShowAccType(false)
			}}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader fontSize={24} textAlign={"center"}>Account Type</ModalHeader>
					<ModalCloseButton />
					<ModalBody overflow={"scroll"} >
						<FormControl pb='8px'>
							<FormLabel>Account Type</FormLabel>
							<Select placeholder='Select account type' onChange={(event) => { setAccountType(event.target.value); }}>
								<option value="PLAYER">Player</option>
								<option value="DEVELOPER">Developer</option>
							</Select>
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button mr={3} onClick={() => {
							setShowAccType(false)
							setShowTOS(true)
						}}>
							Continue
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}