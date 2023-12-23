function generateSudoku() {
    const grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
    fill(grid, 0, 0);
    return grid;
  }
  
  function fill(grid, row, col) {
    if (row == 9) {
      return true;
    }
    if (col == 9) {
      return fill(grid, row + 1, 0);
    }
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const num of nums) {
      if (isValid(grid, row, col, num)) {
        grid[row][col] = num;
        if (fill(grid, row, col + 1)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    return false;
  }
  
  function isValid(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] == num || grid[i][col] == num) {
        return false;
      }
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (grid[i][j] == num) {
          return false;
        }
      }
    }
    return true;
  }
  
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  function displaySudoku(grid) {
    const sudokuContainer = document.querySelector('#sudoku-container');
    sudokuContainer.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
      for (let j = 0; j < 9; j++) {
        const cell = document.createElement('input');
        cell.type = 'text';
        cell.maxLength = 1;
        cell.value = grid[i][j] || '';
        cell.readOnly = !!grid[i][j];
        cell.classList.add('cell');
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.classList.remove("changing","wrong");
        row.appendChild(cell);
      }
      sudokuContainer.appendChild(row);
    }
  }
  
  const generateButton = document.querySelector('#generate-button');
  const sudokuContainer = document.querySelector('#sudoku-container');
  let grid = generateSudoku();
  displaySudoku(grid);
  
  generateButton.addEventListener('click', () => {
    solveClicked = false;
    grid = generateSudoku();
    displaySudoku(grid);
  });
  
  sudokuContainer.addEventListener('input', (event) => {
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const value = cell.value;
    grid[row][col] = value ? parseInt(value) : 0;
  });
  

  function generateSudoku() {
    const grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));
    fill(grid, 0, 0);
    // Remove 60 numbers to create a challenging but solvable puzzle
    for (let i = 0; i < 60; i++) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (grid[row][col] != 0) {
        grid[row][col] = 0;
      } else {
        i--;
      }
    }
    return grid;
  }






// Function to find the next empty cell in the Sudoku puzzle
function findEmpty(board) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === '') { // just changed
        return [i, j];
      }
    }
  }
  return [-1, -1]; // no empty cell
}

// Function to check if a number is valid in a given cell of the Sudoku puzzle
function isValid(board, row, col, num) {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num && i !== col) { // just changed
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num && i !== row) { // just changed
      return false;
    }
  }

  // Check subgrid
  const subgridRow = Math.floor(row / 3) * 3;
  const subgridCol = Math.floor(col / 3) * 3;
  for (let i = subgridRow; i < subgridRow + 3; i++) {
    for (let j = subgridCol; j < subgridCol + 3; j++) {
      if (board[i][j] === num && (i !== row || j !== col)) { // just changed
        return false;
      }
    }
  }

  return true;
}

let solveClicked = false;

// Function to solve the Sudoku puzzle
async function solveSudoku(board) {
  const rowCol = findEmpty(board);
  const row = rowCol[0];
  const col = rowCol[1];

  // base case: no empty cell
  if (row === -1) {
    return true;
  }

  // changed

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      //highlight cell green 
      updateState(board);
      if(solveClicked){
        highlightCell(row,col, "changing");
        await delay(0.1);
      }
      if (await solveSudoku(board)) {
        // update the webpage with the solved puzzle
        updateState(board);
        return true;
      }
      board[row][col] = ''; // backtrack

      if(solveClicked){
        highlightCell(row,col,"empty");
        await delay(0.2);
      } 
    }
  }
  // no valid number found
  return false;
}

function highlightCell(row, col, className){
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if(cell.value){
        cell.classList.add(className);
    } else {
        cell.classList.remove(className);
    }
}

function delay(ms) {
    return new Promise(resolve =>setTimeout(resolve,ms));
}

// Function to get the current state of the Sudoku puzzle from the webpage
function getCurrentState() {
  const board = [];
  for (let i = 0; i < 9; i++) {
    board[i] = [];
    for (let j = 0; j < 9; j++) {
      const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
      const value = cell.value ? parseInt(cell.value) : ''; // just changed
      board[i][j] = value;
    }
  }
  return board;
}

// Function to update the Sudoku puzzle on the webpage OLD VERSION
// function updateState(board) {
//   for (let i = 0; i < 9; i++) {
//     for (let j = 0; j < 9; j++) {
//       const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
//       cell.value = board[i][j];
//       cell.classList.remove("changing");
//       if(board[i][j] == 0 || board[i][j] == ''){
//         cell.setAttribute("class","cell");
//       } else {
//         cell.setAttribute("class","cell filled");
//         cell.setAttribute("readonly", true);
//       }
//     }
//   }
// }

function updateState(board) {
    let allFilled = true;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        cell.value = board[i][j];
        cell.classList.remove("changing");
        if (board[i][j] == 0 || board[i][j] == '') {
          cell.setAttribute("class", "cell");
          allFilled = false;
        } else {
          cell.setAttribute("color","green");
          cell.setAttribute("readonly", true);
  
        //   if (cell.dataset.initialVal === undefined) {
        //     cell.dataset.initialVal = board[i][j];
        //   }
  
        //   if (cell.dataset.initialVal != board[i][j]) {
        //     cell.classList.add("changing");
        //   }
        }
      }
    }
  
    if (allFilled) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
          cell.setAttribute("class", "cell filled");
          cell.setAttribute("readonly", true);
        }
      }
    }
  }

  
  // Add event listener to the solve button
  const solveButton = document.getElementById("solve-button");
  solveButton.addEventListener("click", async() => {
    // Get the current state of the puzzle from the webpage
    const board = getCurrentState();

    // NEW
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            if(board[i][j] == 0){
                highlightCell(i, j, "changing");
                await delay(100);
                solveClicked = true;
                if(await solveSudoku(board)){
                    updateState(board);
                    return;
                } else {
                    alert("This sudoku puzzle cannot be solved.");
                    return;
                }
            }
        }
    }


    // OLD
     
    // solveClicked = true;

    // // Solve the puzzle
    // if (solveSudoku(board)) {
    //   // Update the webpage with the solved puzzle
    //   updateState(board);
    // } else {
    //   // Update the webpage to indicate that the puzzle cannot be solved
    //   alert("This Sudoku puzzle cannot be solved.");
    // }
  });
  
  
  const emptyButton = document.getElementById("empty-button");
  emptyButton.addEventListener("click", () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.value = "";
      cell.classList.remove("filled");
      cell.removeAttribute("readonly");
    });
  });
  