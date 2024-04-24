import { createContext, useContext, useEffect, useState } from "react";
import {
	onAuthStateChanged,
	getAuth,
} from "firebase/auth";
import { app } from "./config";
import "firebase/auth";

const auth = getAuth(app);

export const GameContext = createContext({});
export const useGameContext = () => useContext(GameContext);
export const GameContextProvider = ({ children }) => {
	const [gameStatus, setGameStatus] = useState("IDLE"); // IDLE, MATCHED, ASKED, ANSWERED
	const [gameData, setGameData] = useState(null);
	const [gameDataLoading, setGameDataLoading] = useState(true);

	useEffect(() => {
		const _gameData = JSON.parse(localStorage.getItem('gameData'));
		const _gameStatus = JSON.parse(localStorage.getItem('gameStatus'));
		if (_gameData) {
			setGameData(_gameData)
		} else {
			setGameData(null)
		}
		if (_gameStatus) {
			setGameStatus(_gameStatus.gameStatus)
		} else {
			setGameStatus("IDLE")
		}

		setGameDataLoading(false);
	}, []);

	return (
		<GameContext.Provider value={{ gameStatus, setGameStatus, gameData, setGameData }}>
			{children}
		</GameContext.Provider>
	)
};