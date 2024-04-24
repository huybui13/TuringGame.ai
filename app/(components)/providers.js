'use client';

import {
	ChakraProvider
} from '@chakra-ui/react'
import theme from '../(lib)/theme'
import { AuthContextProvider } from "../firebase/authContext"
import { GameContextProvider } from '../firebase/gameContext';

export default function Providers({ children }) {
	return (
		<GameContextProvider>
			<AuthContextProvider>
				<ChakraProvider theme={theme}>
					{children}
				</ChakraProvider>
			</AuthContextProvider>
		</GameContextProvider>
	)
}