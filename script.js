const initialState = {
	cubes: 8,
	moves: 0
};

const K = 3;

const COMPUTER = {
	name: 'computer',
	getNextMove: minimax
};
const HUMAN = {
	name: 'human',
	getNextMove: getUserMove
};

const order = {
	first: COMPUTER,
	second: HUMAN
}

let currentState = initialState;

function toMove(state) {
	if ( state.moves % 2 === 0) {
		return order.first;
	}
	return order.second;
}

function _removeX(state, x) {
	return {
		cubes: state.cubes - x,
		moves: state.moves + 1
	}
}

function removeOne(state) {
	return _removeX(state, 1);
}


function removeTwo(state) {
	return _removeX(state, 2);
}


function removeK(state) {
	return _removeX(state, K);
}

function actions(state) {
	let allActions = [removeOne, removeTwo, removeK];
	let validActions = [];

	allActions.forEach((action) => {
		if (action(state).cubes >= 0) {
			validActions.push(action);
		} 
	})

	return validActions;
}

function result(state, action) {
	return action(state);
}

function isTerminal(state) {
	if (state.cubes === 0) {
		return true;
	}
	return false;
}

function utility(state, player) {
	// this runs only on terminal states
	if (toMove(state) === player) {
		return -1;
	}
	return 1;
}

function minimax(state) {
	const player = toMove(state);
	return maxValue(state, player).action;
}

// Return {val, action}
function maxValue(state, player) {
	let maxValueObj = {
		val: -111,
		action: undefined
	}

	if (isTerminal(state)) {
		maxValueObj.val = utility(state, player);
		return maxValueObj;
	}

	actions(state).forEach((action) => {
		const minValueObj = minValue(result(state, action), player);
		if (minValueObj.val > maxValueObj.val) {
			maxValueObj.val = minValueObj.val;
			maxValueObj.action = action;
		}
	});

	return maxValueObj;
}

// Return {val, action}
function minValue(state, player) {
	let minValueObj = {
		val: 111,
		action: undefined
	}

	if (isTerminal(state)) {
		minValueObj.val = utility(state, player);
		return minValueObj;
	}

	actions(state).forEach((action) => {
		const maxValueObj = maxValue(result(state, action), player);
		if (maxValueObj.val < minValueObj.val) {
			minValueObj.val = maxValueObj.val;
			minValueObj.action = action;
		}
	});

	return minValueObj;
}

function playMove(action) {
	currentState = result(currentState, action);
}

function getUserMove() {
	let move;

	while(!move) {
		move = prompt("Please make your move.", "Valid moves are 1, 2, k");
		if (!move || (['1','2','k'].indexOf(move) === -1)) {
    			move = false;
    			continue;
	  }

	  switch(move) {
	  	case '1': 
	  		return removeOne;
	  	case '2': 
	  		return removeTwo;
	  	case 'k': 
	  		return removeK;
	  }
	}
  
}

function game() {
	while(currentState.cubes > 0) {
		console.log(currentState);
		playMove(toMove(currentState).getNextMove(currentState));
	}

	if (toMove(currentState).name === "human") {
		console.log("Sorry " + toMove(currentState).name + " you have lost..")
	} else {
		console.log("Gongratulations! You have won!!!")
	}
}

game();