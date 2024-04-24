'use client';

import Image from 'next/image';
import { ColorModeScript, Box, Container } from '@chakra-ui/react'
import Theme from '../../(lib)/theme'
import Footer from '../../(components)/footer'
import Providers from '../../(components)/providers'
import logo from '../../../public/next.svg';

export default function Template({ children }) {
	return (
		<Providers>
			<ColorModeScript initialColorMode={Theme.config.initialColorMode} />
			<Box h='100%' display={'flex'} flexDir={'column'}>
				<Box pt={8} pb={8} display={'flex'} alignItems={'center'} justifyContent='center'>
					<Image
						src={logo}
						alt="Logo"
						width={120}
					/>
				</Box>
				<Container
					h='100%'
					display={'flex'}
					flexDir={'column'}
					justifyContent={'center'}
					alignItems={'center'}
					maxW={'container.sm'}
				>
					{children}
				</Container>
				<Footer />
			</Box>
		</Providers>
	);
};