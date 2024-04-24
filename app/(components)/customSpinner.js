'use client';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	Spinner
} from '@chakra-ui/react'

export default function CustomSpinner({ isOpen }) {
	return (
		<Modal isOpen={isOpen} isCentered>
			<ModalOverlay backdropFilter='blur(2px)' />
			<ModalContent bg="transparent" shadow={"none"} display="flex" flexDir={"column"} justifyContent="center" alignItems={"center"}>
				<Spinner color='orange' size={"xl"} thickness={"4px"} />
			</ModalContent>
		</Modal>
	);
};