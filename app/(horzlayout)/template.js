'use client';

import { ColorModeScript, Box, Container } from '@chakra-ui/react'
import Theme from '../(lib)/theme'
import Navbar from '../(components)/navbar'
import Footer from '../(components)/footer'
import Providers from '../(components)/providers'

export default function Template({ children }) {
	return (
		<Providers>
			<ColorModeScript initialColorMode={Theme.config.initialColorMode} />
			<Box h='100%' display={'flex'} flexDir={'column'}>
				<Navbar />

				<Container display={'flex'} flexDir={'column'} h='100%' maxW="container.xl" justifyContent={"center"} alignItems="center">
					{children}
				</Container>
				<Footer />
			</Box>
		</Providers>
	);
};
