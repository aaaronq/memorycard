import { useState, useEffect } from "react";
import rickW from "../assets/rickW.png"
import mortyL from "../assets/mortyL.png"

export default function Main() {
	const [cards, setCards] = useState([]);
	const [chars, setChars] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
	const [round, setRound] = useState(1);
	const [gameStatus, setGameStatus] = useState("ongoing");

	useEffect(() => {
		console.log("effect loaded");

		fetch(`https://rickandmortyapi.com/api/character/${chars}`)
			.then((response) => response.json())
			.then((newCards) => updateCards(newCards));
	}, [chars]);

	function updateCards(newCards) {
		const newCardsArr = [];
		newCards.forEach((card) => {
			newCardsArr.push({
				name: card.name,
				id: card.id,
				img: card.image,
				clicked: false,
			});
		});
		setCards(newCardsArr);
	}

	function handleClick(e) {
		const characterId = +e.target.dataset.characterid;
		const characterCard = cards.find((card) => card.id === characterId);
		if (characterCard.clicked) {
			//Lose the game
			setGameStatus("lost");
			return;
		}
		characterCard.clicked = true;
		console.log(characterCard.name);
		setCards([...cards, characterCard]);
		shuffleCards();
		checkWin();
	}

	function shuffleCards() {
		const newCards = [...cards];
		for (let i = newCards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[newCards[i], newCards[j]] = [newCards[j], newCards[i]];
		}
		setCards(newCards);
	}

	function newRound() {
		// Update chars
		setChars(chars.map((char) => char + 9));

		// Update round
		setRound(round + 1);
	}

	function checkWin() {
		if (cards.every((card) => card.clicked)) {
			if (round === 5) {
				setGameStatus("won");
				return;
			}
			console.log("won this round");
			newRound();
		}
	}

	return (
		<main>
			{gameStatus === "ongoing" ? (
				<>
					<h2>Pick a different character each time!</h2>
					<h3> Round {round} of 5 </h3>
					<div className="grid">
						{cards.map((card) => {
							return (
								<div
									key={card.id}
									className="card"
									style={{ backgroundImage: `url(${card.img}` }}
									onClick={handleClick}
									data-characterid={card.id}
								/>
							);
						})}
					</div>
				</>
			) 
			: gameStatus === "won" ? (
				<div className="gameOver">
					<h2> You won the game!</h2>
					<img src={rickW} alt="Won Game"/>
					<button onClick={() => location.reload()}> Play again?</button>
				</div>
			) :
				<div className="gameOver">
					<h2> You lost the game!</h2>
					<img src={mortyL} alt="Lost Game"/>
					<button onClick={() => location.reload()}> Play again?</button>
				</div>
			}	
		</main>
	);
}
