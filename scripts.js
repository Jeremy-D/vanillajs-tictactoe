//=====================================
//MAKE PLAYER FACTORY
//=====================================
//
//name:string, symbol:string, myTurn:boolean
const playerFactory = (name, symbol, myTurn) =>{
	const changeTurns = (myTurn) => {
		if(myTurn){
			myTurn = false
		} else {
			myTurn = true
		}
		return myTurn
	}

	const move = (array, index) => { 
			if(array[index]){
				console.log('try again')
				return false
			} else if (!array[index]) {
				array[index] = symbol;
				return true
			}
	};

	return {name, symbol, move, myTurn}
}

//=====================================
//USE MODULE PATTERN FOR GAME BOARD
//=====================================
const gameBoard = (()=>{
	const board = ['','','','','','','','',''];

	let name1 = 'player1';
	let name2 = 'player2';

	const player1 = playerFactory(name1, 'X');
	const player2 = playerFactory(name2, 'O');
	
	let currentPlayer = player1; 

	const changeTurns = () => {
		if(currentPlayer === player1){
			currentPlayer = player2
		} else {
			currentPlayer = player1
		}
		return currentPlayer
	}

	const winConditions = [
		[0,1,2],
		[3,4,5],
		[6,7,8],
		[0,3,6],
		[1,4,7],
		[2,5,8],
		[2,4,6],
		[0,4,8]
		];

	const checkWin = (arr, symbol) => {
		let winning = false
		winConditions.forEach((condition)=>{
			let win = true;
			condition.forEach((index)=>{
				if(arr[index] !== symbol){
					win = false;
				}
			})

			if(win == true){
				winning = true
				// alert(symbol + ' wins')
				// return true
			}
		})
		if(winning == true){
			return winning
		}
	}

	const checkTie = (arr)=>{
		let tie = false
		if(arr.indexOf('') == -1){
    	tie = true
  	} else {
    	tie = false
 	 	}
 	 	return tie
	}

	const reset = (arr)=>{
		return ['','','','','','','','',''];
	}
	let unusedSpaces = 9;
	return {board, reset, checkWin, checkTie, currentPlayer, changeTurns}
})()

//=====================================
//HANDLE USER INPUT THROUGH UI
//=====================================
const gameDisplayController = (()=>{
	const game = document.getElementById('game');
	const winMessage = document.getElementById('win-message');
	const reset = document.getElementById('reset');

	//dynamically create board-----------
	let spaceCounter = 0;
	let boardSpace = '';
	for(i = 0; i<9; i++) {
		boardSpace = `<div class="boardSpace" id="${i}"></div>`;
		game.insertAdjacentHTML('beforeend', boardSpace);
		spaceCounter++;
	}

	//add event listeners to boardspaces
	const boardSpaces = document.querySelectorAll('.boardSpace');
	//console.log(boardSpaces[0]);
	boardSpaces.forEach((space)=>{
		space.addEventListener('click', function(){ updateSpace(this) });
	});

	//run logic from the User Interface
	function updateSpace(me){
 		let id = me.id;
 		let theSpace = boardSpaces[id];
 		//only play the move if the move is good
 		if (gameBoard.currentPlayer.move(gameBoard.board, me.id)){
 			gameBoard.currentPlayer.move(gameBoard.board, me.id)
 			theSpace.innerHTML = gameBoard.currentPlayer.symbol
 		}

 		//check win
 		let win = gameBoard.checkWin(gameBoard.board, gameBoard.currentPlayer.symbol)
 		console.log(gameBoard.checkWin(gameBoard.board, gameBoard.currentPlayer.symbol))

 		//check tie
 		let tie = gameBoard.checkTie(gameBoard.board)
 		console.log('tie vvvvv')
 		console.log(tie)

 		
 		const displayControllerReset = () => {
 			console.log('RESET')
 			gameBoard.board = gameBoard.reset();
 			
 			//add unecessary fade animation to board spaces on reset
 			(function spacething(){
 				boardSpaces.forEach((space)=>{
 					space.classList.add('spaces-animation')
 					//space.classList.remove('spaces-animation')
 					setTimeout(function(){space.classList.remove('spaces-animation')}, 5050);
 				})
 				
 			})()

 			setTimeout(function(){boardSpaces.forEach((space)=>{
 				space.innerHTML = ''
 			})}, 5000)
 			winMessage.innerHTML = ''
 			//winMessage.innerHTML = gameBoard.currentPlayer.symbol + ' wins'
 			//alert(gameBoard.currentPlayer.symbol + ' wins')
 		}


 		const winMessageFunc = (condition)=>{
 			if (condition == win) {
 				winMessage.innerHTML = gameBoard.currentPlayer.symbol + ' wins'
 			} else if (condition == tie) {
 				winMessage.innerHTML = 'Tie'
 			}
 			winMessage.classList.add('message-animation')
			setTimeout(function(){winMessage.classList.remove('message-animation')}, 5000)
 		}

 		const regularReset = ()=>{
 			gameBoard.board = gameBoard.reset();
 			boardSpaces.forEach((space)=>{
 				space.innerHTML = ''
 			})
 		}

 		reset.addEventListener('click', regularReset)

 		if (win){
 			displayControllerReset()
 			winMessageFunc(win)
 		} else if (tie) {
 			displayControllerReset()
 			winMessageFunc(tie)
 		}

 		//change player AFTER checking win or tie conditions
 		gameBoard.currentPlayer = gameBoard.changeTurns()


	}
})()



