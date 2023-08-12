import { useState, useEffect } from "react";

export default function Main() {
	const [cards, setCards] = useState([]);
	const [prevCards, selectCard] = useState([]);
	const [chars, setChars] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	useEffect(() => {
		console.log("effect loaded");

		fetch(`https://rickandmortyapi.com/api/character/${chars}`)
			.then((response) => response.json())
			.then((newCards) => updateCards(newCards));
	}, [chars]);

	function updateCards(newCards) {
		const newCardsArr = [];
		newCards.forEach((card) => {
			// console.log(card.image);
			newCardsArr.push({
				name: card.name,
				img: card.image,
			});
		});
		setCards(newCardsArr);
	}

	function handleClick(e) {
		const character = e.target.dataset.character;
		if (prevCards.includes(character)) {
			//Lose the game
			console.log("you clicked the same character");
			return;
		}
		console.log(character);
		selectCard([...prevCards, character]);
		shuffleCards();
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
        // Wipe previousCards state
        selectCard([]);

        // Update chars
        setChars(chars.map((char => char + 9)))
	}

    function checkWin() {
        if (prevCards.length === 9) {
			// Win round
			console.log("won this round");

			// Cause new round
			newRound();
		}
    }

    checkWin();

	return (
		<div className="main">
			<h2> Pick a different character each time! </h2>
			<div className="grid">
				{cards.map((card) => {
					return (
						<div
							key={card.name}
							className="card"
							style={{ backgroundImage: `url(${card.img}` }}
							onClick={handleClick}
							data-character={card.name}
						/>
					);
				})}
			</div>
		</div>
	);
}
