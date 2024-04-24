'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
	Container,
	Box,
	Text
} from '@chakra-ui/react'
import logo from '../../public/next.svg';
import ThemeToggleButton from '../(components)/theme-toggle-button'
import ProfileButton from '../(components)/profile-button';

export default function Navbar(props) {
	return (
		<Box
			as="nav"
			w="100%"
			zIndex={2}
			bg='transparent'
			mb={'auto'}
			{...props}
		>
			<Container
				display="flex"
				flexDirection={'row'}
				p={2}
				maxW="container.xxl"
				flexWrap={'wrap'}
				alignItems={'center'}
			>
				<Box
					pr={6}
					display={'flex'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<Link href="/">

						<Image
							src={logo}
							alt="Logo"
							width={100}
						/>
					</Link>
				</Box>

				<Box
					pr={6}
				>
					<Link href="/leaderboards">
						<Text
							fontSize={'lg'}
							fontWeight={'semibold'}
						>
							Leaderboards
						</Text>
					</Link>
				</Box>
				<Box pr={2} marginLeft={"auto"}>
					<ProfileButton />
				</Box>
				<Box>
					<ThemeToggleButton />
				</Box>
			</Container>
		</Box>
	);
};