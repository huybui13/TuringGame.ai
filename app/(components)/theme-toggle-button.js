'use client';

import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export default function ThemeToggleButton() {
	const { toggleColorMode } = useColorMode()

	return (
		<IconButton
			aria-label="Toggle theme"
			colorScheme={useColorModeValue('purple', 'orange')}
			icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
			onClick={toggleColorMode}
			className="bg-red-200"
		></IconButton>
	);
};