'use client';

import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,

} from '@chakra-ui/react'
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../firebase/authContext';
import { logout } from '../firebase/userAuthFunctions';

export default function ProfileButton() {
	const { user } = useAuthContext()
	const router = useRouter();

	const handleLogout = async () => {
		let { result, error } = await logout();
		if (error) {
			console.log(error);
		} else {
			router.refresh();
		}
	}

	return (
		<>
			{user == null ?
				<Button
					bg={"transparent"}
					onClick={() => { router.push("/signup") }}
				>Sign up</Button>
				:
				<Menu>
					<MenuButton
						as={Button}
						bg={"transparent"}
					>
						Profile
					</MenuButton>
					<MenuList>
						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</MenuList>
				</Menu>
			}
		</>
	);
};