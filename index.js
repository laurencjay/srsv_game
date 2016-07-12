var gamePrompt = require('game-prompt');

//Player facts
var playerName;
var vehicleName;
var currentGallons = 1000;
var currentPlanet;
var collection = [];

// Planets
var planets = {
	M: {
		status: true,
		name : 'Mesnides',
		greeting: ['You\'ve arrived at Mesnides. As you land, a representative of the Mesnidian people is there to greet you.', '"Welcome, traveler, to Mesnides."', '"How can we assist you?"'],
		gallons: 20,
		artifact: 'Myoin Horn',
		artifactDescription: 'an ancient Mesnidian instrument',
		otherPlanets: '"Well, Laplides suffered from atomic war and has been uninhabited for centuries. You would do well to avoid it on your journey."'
	},

	L: {
		status: false,
		name : 'Laplides',
		warning: 'You enter orbit around Laplides. Looking down at the planet, you see signs of atomic war and realize there is no option but to turn around.',
		gallons: 50
	},

	K: {
		status: true,
		name : 'Kiyturn',
		greeting: ['You\'ve arrived at Kiyturn. As you land, a representative of the Kiyturnian people is there to greet you.', '"Hello, what brings you to Kiyturn? You\'re not here to cause trouble are you?"'],
		gallons: 120,
		artifact: 'Kiyturn Glass Bowl',
		artifactDescription: 'a symbol of our civilization',
		otherPlanets: '"I\'m sorry, but we do not leave our planet. The universe, to us, is a beautiful mystery."'
	},

	A: {
		status: false,
		name : 'Aenides',
		warning: 'You discover upon arrival to Aenides that they are a hostile people. You attempt to land, but they begin to fire upon your S.R.S.V. and you are forced to retreat.',
		gallons: 25
	},

	C: {
		status: false,
		name : 'Cramuthea',
		warning: 'Cramuthea has been abandoned due to global environmental disaster, but there are remnants of the people that left. You are able to refuel your ship (+500 gallons) and read a beacon signal that tells you the Cramuthean people have migrated to Smeon T9Q.',
		gallons: 200,
		refule: 500
	},

	S: {
		status: true,
		name : 'Smeon T9Q',
		greeting: ['You\'ve arrived at Smeon T9Q. As you land, a representative of the Smeonian people is there to greet you.', '"Hello, you must have come a long way! Fill your ship with 100 gallons. How can we assist you?"'],
		gallons: 400,
		artifact: 'Cramun Flower',
		artifactDescription: 'from our home planet',
		otherPlanets: '"The people of Aenides once tried to take over their home planet by force. It wasn\'t very nice, to be honest. I thought we were chill."',
		refule: 100
	},

	G: {
		status: true,
		name : 'Gleshan 7Z9',
		greeting: ['You\'ve arrived at Gleshan 7Z9. As you land, a representative of the Gleshan people is there to greet you.', '"Hello, traveler. We don\'t have much but how may we assist you?"'],
		gallons: 85,
		artifact: false,
		artifactDescription: '"We have no gifts for travelers, I\'m very sorry, we don\'t have much around here."',
		otherPlanets: '"There is some wealthy people from the planet of Cramuthea, they visited here once. Didn\'t even pick up the check though. Cheap bastards."'
	},

	E: {
		status: true,
		name: 'Earth',
		greeting: 'You\'ve arrived back on Earth. Adding 10 gallons to your tank.',
		gallons: 10,
		artifact: false,
		artifactDescription: 'You must travel to other planets to gather artifacts.',
		otherPlanets: 'You must travel to other planets and gather artifacts. Once you have three, come back to Earth to complete your mission.',
		refule: 10
	}
};

//Game Functions

function startGame() {
	gamePrompt('S.R.S.V. Press ENTER to start.', intro);
}

function intro() {
	gamePrompt('You are the captain of a Solo Research Space Vehicle (S.R.S.V.)' + 
				' on an expedition to explore foreign planets. Your mission is to' + 
				' make contact with three alien life forms, acquire an artifact' +  
				' representative of their culture, and bring back your findings to Earth.', collectInfo);
}

function collectInfo() {
	gamePrompt([
		'A voice comes on over the intercome.',
		'"Please state your name for identity verification, Captain."'
	], collectName);
}

function collectName(name) {
	playerName = name;

	gamePrompt([
		'"Thank you, Captain ' + playerName + '."',
		'"Please state your vehicle name for identity verification."'
	], collectVehicleName);
}

function collectVehicleName(name) {
	vehicleName = name;
	gamePrompt('"Thank you, Captain ' + playerName + '."', choosePlanet);
}

function choosePlanet() {
	gamePrompt('"Where to, Captain ' + playerName + '?"\n' +
				'(E)arth (10 lightyears)\n' +
				'(M)esnides (20 lightyears)\n' +
				'(L)aplides (50 lightyears)\n' +
				'(K)iyturn (120 lightyears)\n' +
				'(A)enides (25 lightyears)\n' +
				'(C)ramuthea (200 lightyears)\n' +
				'(S)meon T9Q (400 lightyears)\n' +
				'(G)leshan 7Z9 (85 lightyears)', setPlanet);
}

function setPlanet(planet) {
	currentPlanet = planets[planet];
	if (!currentPlanet) invalidPlanet();
	else {
		currentGallons -= currentPlanet.gallons;
		checkGas();
		gamePrompt('Flying to ' + currentPlanet.name + '...\n' +
			'You used ' + currentPlanet.gallons + ' gallons of gas. The ' + vehicleName + ' now has ' + currentGallons + ' gallons.', arrival);

	if (currentPlanet.refule) currentGallons += currentPlanet.refule;
	}
}

function arrival() {
	if (currentPlanet.name === 'Earth') reachedEarth();
	else if (currentPlanet.status) {
		gamePrompt(currentPlanet.greeting, chooseAction);
	} else gamePrompt(currentPlanet.warning, choosePlanet);
}

function invalidPlanet() {
	gamePrompt('"That is not a valid entry. Press ENTER to hear options again."', choosePlanet);
}

function invalidAction() {
	gamePrompt('That is not a valid action. Press ENTER to choose again.', chooseAction);
}

function chooseAction() {
	gamePrompt('Ask about (A)rtifact.\n ' +
				'Ask about other (P)lanets\n ' + 
				'(L)eave)', setAction);
}

function setAction(action) {
	switch (action.toUpperCase()) {
		case 'A':
			if (currentPlanet.artifact) addArtifact();
			else gamePrompt(currentPlanet.artifactDescription, chooseAction);
			break;
		case 'P':
			gamePrompt(currentPlanet.otherPlanets + '\n"How can we assist you?"', chooseAction);
			break;
		case 'L':
			choosePlanet();
			break;
		default:
			invalidAction();
	}
}

function addArtifact() {
	if (collection.indexOf(currentPlanet.artifact) < 0)  {
		collection.push(currentPlanet.artifact);
		gamePrompt(['"Here, take this ' + currentPlanet.artifact + ', ' + currentPlanet.artifactDescription + '."', currentPlanet.artifact + ' added to inventory.'], chooseAction);
	}
	else gamePrompt('This planet\'s artifact is already in your collection. Choose a different action.', chooseAction);

}

function checkGas() {
	if (currentGallons <= 0) loseGame();
}

function reachedEarth() {
	if (collection.length >= 3) {
		winGame();
	} else {
		currentGallons += 10;
		gamePrompt(currentPlanet.greeting, chooseAction);
	}
}

function loseGame() {
	console.log('As Daddy Yankee and Pitbull once exclaimed, Dame mas gasolina! But alas it is too late... YOU LOSE LO SIENTO :(');
	process.exit();
}

function winGame() {
	console.log('You got three artifacts! YOU WIN EVERYTHING :D :D :D');
	process.exit();
}

startGame();