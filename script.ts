interface Property {
    name: string;
    type: string;
    color?: string;
    price?: number;
    rent?: number[];
    houseCost?: number;
    description?: string;
    amount?: number;
    houses?: number;
    owner?: Player;
}

const board: Property[] = [
    { name: "GO", type: "special", description: "Collect $100 when you pass." },
    { name: "Mediterranean Avenue", type: "property", color: "brown", price: 60, rent: [2, 10, 30, 90, 160, 250], houseCost: 50 },
    { name: "Kaunas", type: "property", color: "brown", price: 60, rent: [3, 15, 50, 100, 180, 300], houseCost: 50 },
    { name: "Baltic Avenue", type: "property", color: "brown", price: 60, rent: [4, 20, 60, 180, 320, 450], houseCost: 50 },
    { name: "Income Tax", type: "tax", amount: 200 },
    { name: "Reading Railroad", type: "railroad", color:"yellow", price: 200, rent: [25, 50, 100, 200] },
    { name: "Oriental Avenue", type: "property", color:"yellow", price: 100, rent: [6, 30, 90, 270, 400, 550], houseCost: 50 },
    { name: "Connecticut Avenue", type: "property", color:"yellow", price: 120, rent: [8, 40, 100, 300, 450, 600], houseCost: 50 },
    { name: "Jail", type: "special", description: "Just visiting or in jail." },
    { name: "Pacific Avenue", type: "property", color: "orange", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { name: "North Carolina Avenue", type: "property", color: "orange", price: 300, rent: [26, 130, 390, 900, 1100, 1275], houseCost: 200 },
    { name: "Pennsylvania Avenue", type: "property", color: "orange", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], houseCost: 200 },
    { name: "Luxury Tax", type: "tax", amount: 100 },
    { name: "Short Line", type: "railroad", color: "green", price: 200, rent: [25, 50, 100, 200] },
    { name: "Park Place", type: "property", color: "green", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], houseCost: 200 },
    { name: "Boardwalk", type: "property", color: "green", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], houseCost: 200 }
];

interface Player {
    name: string;
    position: number;
    ownedProperties: Property[];
    money: number;
}

const player1: Player = {
    name: "Player 1",
    position: 0,
    ownedProperties: [],
    money: 1000
};

const player2: Player = {
    name: "Player 2",
    position: 0,
    ownedProperties: [],
    money: 1000
};

let currentPlayer: Player = player1;

function displayBoard(): void {
    const boardElement = document.getElementById('board');
    if (boardElement) {

        boardElement.innerHTML = '';

        board.forEach((property, index) => {
            const box = document.createElement('div');
            box.classList.add('box');
            if (property.color) {
                box.style.background = property.color;
            }
            box.id = `box${index + 1}`;
            box.innerHTML = `
                <strong>${property.name}</strong><br>
                ${property.type}
                ${property.price ? `<br>Price: $${property.price}` : ''}
                ${property.rent ? `<br>Rent: $${property.rent[0]}` : ''}
                ${property.amount ? `<br>Tax: $${property.amount}` : ''}
                ${property.houses ? `<br>Houses: ${'🏠'.repeat(property.houses)}` : ''}
                ${property.description ? `<br>${property.description}` : ''}
            `;
            boardElement.appendChild(box);
        });
    }

    updatePlayerPosition(player1);
    updatePlayerPosition(player2);
}


function rollDice(): number {
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;

    const diceResultElement = document.getElementById('diceResult');
    if (diceResultElement) {
        diceResultElement.innerHTML = `Dice Roll: 🎲 ${die1} + 🎲 ${die2} = ${total}`;
    }

    console.log(`Rolled: ${die1} + ${die2} = ${total}`);
    return total;
}


function movePlayer(player: Player): void {
    const diceRoll = rollDice();
    player.position += diceRoll;

    if (player.position >= board.length) {
        player.position -= board.length;
        player.money += 100;
        alert(`${player.name} passed GO! Collect $100.`);
    }

    updatePlayerPosition(player);
    handlePropertyLanding(player, board[player.position]);
}


function updatePlayerPosition(player: Player): void {
    const tokenId = `token-${player.name}`;
    const existingToken = document.getElementById(tokenId);
    const boxId = `box${player.position + 1}`;
    const box = document.getElementById(boxId);

    if (existingToken) {
        existingToken.remove();
    }

    const token = document.createElement('span');
    token.id = tokenId;
    token.classList.add('token');

    token.innerText = player.name === 'Player 1' ? '🚗' : '🚙';

    if (box) {
        box.appendChild(token);
    }
}


function handlePropertyLanding(player: Player, property: Property): void {
    if (property.type === "property") {
        if (property.owner) {
            alert(`${property.name} is owned by ${property.owner.name}. Pay rent!`);
            payRent(player, property);
        } else {
            if (player.money >= (property.price || 0)) {
                const buy = confirm(`${player.name}, would you like to buy ${property.name} for $${property.price}?`);
                if (buy) {
                    buyProperty(player, property);
                }
            } else {
                alert(`${player.name} cannot afford ${property.name}`);
            }
        }
    } else if (property.type === "tax") {
        payTax(player, property);
    }

    updatePlayerPosition(player);
}

function checkGameOver(): void {
    if (player1.money <= 0) {
        alert(`Game over! ${player2.name} wins!`);
        disableGame();
    } else if (player2.money <= 0) {
        alert(`Game over! ${player1.name} wins!`);
        disableGame();
    }
}

function disableGame(): void {
    // Disable all gameplay buttons
    const rollButton = document.getElementById('rollButton') as HTMLButtonElement;
    const buildHouseButton = document.getElementById('buildHouseButton') as HTMLButtonElement;

    if (rollButton) rollButton.disabled = true;
    if (buildHouseButton) buildHouseButton.disabled = true;

    // Optionally, remove player tokens from the board
    document.querySelectorAll('.token').forEach(token => token.remove());
}


function payTax(player: Player, property: Property): void {
    if (property.type === "tax" && property.amount) {
        player.money -= property.amount;
        alert(`${player.name} landed on a tax space and paid $${property.amount} in taxes.`);
        updatePlayerInfo(player);
        checkGameOver();
    }
}

function payRent(player: Player, property: Property): void {
    if (!property.owner || property.owner === player) return;

    const rentIndex = property.houses || 0;
    const rentAmount = property.rent ? property.rent[rentIndex] : 0;

    if (player.money >= rentAmount) {
        player.money -= rentAmount;
        property.owner.money += rentAmount;
        alert(`${player.name} paid $${rentAmount} to ${property.owner.name} for rent.`);
    } else {
        alert(`${player.name} cannot afford to pay rent!`);
    }

    updatePlayerInfo(player);
    updatePlayerInfo(property.owner);
    checkGameOver();
}

function buyProperty(player: Player, property: Property): void {
    if (property.owner) {
        alert(`${property.name} is already owned by ${property.owner.name}.`);
        return;
    }

    if (player.money >= (property.price || 0)) {
        player.money -= property.price || 0;
        player.ownedProperties.push(property);
        property.owner = player;
        alert(`${player.name} bought ${property.name} for $${property.price}`);
        updatePlayerInfo(player);
        updatePlayerPosition(player);
        displayBoard();
        checkGameOver();
    } else {
        alert(`${player.name} cannot afford ${property.name}`);
    }
}

function buildHouse(player: Player, property: Property): void {
    if (property.owner !== player) {
        alert(`You don't own ${property.name}!`);
        return;
    }

    if ((property.houses || 0) >= 4) {
        alert(`${property.name} already has the maximum number of houses.`);
        return;
    }

    if (player.money >= (property.houseCost || 0)) {
        player.money -= property.houseCost || 0;
        property.houses = (property.houses || 0) + 1;
        alert(`${player.name} built a house on ${property.name}.`);
        updatePlayerInfo(player);
        updatePropertyDropdown(player);
        displayBoard();
        checkGameOver();
    } else {
        alert(`${player.name} cannot afford to build a house on ${property.name}.`);
    }
}

function updatePlayerInfo(player: Player): void {
    const playerPanel = document.getElementById(`player-${player.name}-info`);
    if (playerPanel) {
        const token = player.name === "Player 1" ? "🚗" : "🚙";
        playerPanel.innerHTML = `
            <strong>${token} ${player.name}</strong><br>
            Money: $${player.money}<br>
            Properties: ${player.ownedProperties.map(p => `${p.name} (Houses: ${'🏠'.repeat(p.houses || 0)})`).join(', ') || 'None'}
        `;
    }
}


function updatePropertyDropdown(player: Player): void {
    const propertySelect = document.getElementById('propertySelect') as HTMLSelectElement;
    if (propertySelect) {
        propertySelect.innerHTML = '<option value="">Select a Property</option>';
        player.ownedProperties.forEach(property => {
            const option = document.createElement('option');
            option.value = property.name;
            option.textContent = `${property.name} (Houses: ${property.houses || 0})`;
            propertySelect.appendChild(option);
        });
    }
}

function switchPlayer(): void {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    alert(`${currentPlayer.name}'s turn!`);
    updatePropertyDropdown(currentPlayer);
}


function initGame(): void {
    displayBoard();
    updatePlayerInfo(player1);
    updatePlayerInfo(player2);
    updatePropertyDropdown(player1);
    updatePropertyDropdown(player2)
    updatePlayerPosition(player1);
    updatePlayerPosition(player2);
}

function restartGame(): void {
    // Reset players
    player1.position = 0;
    player1.money = 1000;
    player1.ownedProperties = [];

    player2.position = 0;
    player2.money = 1000;
    player2.ownedProperties = [];

    // Reset board properties
    board.forEach(property => {
        if (property.type === "property" || property.type === "railroad") {
            property.owner = undefined;
            property.houses = 0;
        }
    });

    // Re-enable gameplay buttons
    const rollButton = document.getElementById('rollButton') as HTMLButtonElement;
    const buildHouseButton = document.getElementById('buildHouseButton') as HTMLButtonElement;

    if (rollButton) rollButton.disabled = false;
    if (buildHouseButton) buildHouseButton.disabled = false;

    // Reinitialize the game
    currentPlayer = player1;
    initGame();

    alert("Game has been restarted!");
}

document.getElementById('rollButton')?.addEventListener('click', () => {
    movePlayer(currentPlayer);
    switchPlayer();
});

document.getElementById('buildHouseButton')?.addEventListener('click', () => {
    const propertySelect = document.getElementById('propertySelect') as HTMLSelectElement;
    const selectedPropertyName = propertySelect.value;

    if (!selectedPropertyName) {
        alert('Please select a property.');
        return;
    }

    const selectedProperty = currentPlayer.ownedProperties.find(p => p.name === selectedPropertyName);

    if (selectedProperty) {
        buildHouse(currentPlayer, selectedProperty);
    } else {
        alert('Property not found or you do not own it.');
    }
});

document.getElementById('restartButton')?.addEventListener('click', restartGame);

initGame();
