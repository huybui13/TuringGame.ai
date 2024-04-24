import '../../globals.css';
import { Manrope } from '@next/font/google';

const manrope = Manrope({
	subsets: ['latin'],
	display: 'swap',
});

export default function RootLayout({ children }) {
	return (
		<html lang="en" className={manrope.className}>
			<head>
				<title>turingame.ai</title>
			</head>

			<body>
				{children}
			</body>
		</html>
	);
};