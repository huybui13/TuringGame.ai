'use client';

import Emoji from "a11y-react-emoji/lib/Emoji";
import { useEffect, useState } from "react";
export default function EmojiRandomizer({ isHuman }) {
	const humanEmojis = ["👧🏻", "🧒🏻", "👦🏼", "👩🏽", "🧑🏻", "👩🏼‍🦱", "🧑🏿‍🦱", "👱🏻", "👱🏼‍♂️", "👱🏾‍♀️", "🧑🏼‍🦲", "🧔🏻", "👴🏻"]
	const robotEmoji = "🤖"

	const [index, setIndex] = useState(0);

	useEffect(() => {
		setIndex(Math.floor(Math.random() * humanEmojis.length))
	}, []);

	if (isHuman) {
		return <Emoji label="human" symbol={humanEmojis[index]} />
	}
	return <Emoji label="robot" symbol={robotEmoji} />
}