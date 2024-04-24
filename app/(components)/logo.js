'use client';

import Image from 'next/image';
import logo from '../../public/next.svg'
import { useRouter } from 'next/navigation';

export default function Logo() {
	const router = useRouter();

	return (
		<button>
			<Image
				onClick={() => {
					// TODO: Set game status to idle
					// TODO: Send to server
					router.push("/");
				}}
				src={logo}
				alt="Logo"
				width={120}
			/>
		</button>
	);
};