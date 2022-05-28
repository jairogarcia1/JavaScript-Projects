document.addEventListener('DOMContentLoaded', () => {
  // declaring all the global variables
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector(' #score')
  const play = document.querySelector('#play-button')
  const width = 10
  let timerId
  let nextRandom = 0
  let score = 0

  //  declaring five arrays with different shapes and 4 rotations for each Tetromino
  const iShapedTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const lShapedTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const oShapedTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const tShapedTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const zShapedTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  // this array hold all 5 tetromino
  const tetrominoes = [lShapedTetromino, zShapedTetromino, tShapedTetromino, oShapedTetromino, iShapedTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //  random Tetromino and the first rotation
  let random = Math.floor(Math.random() * tetrominoes.length)
  let current = tetrominoes[random][0]

  //  draws the ShapedTetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }
  //  removes the ShapedTetromino from the grid as the shape moves
  function erase () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  // timerId = setInterval(moveDown, 400)

  // assigned arrow keycodes for the user to move the tetrominoes in all directions
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)

  //  moves tetromino downward and uses the function freeze when the shape reaches the bottom of the grid
  function moveDown () {
    erase()
    currentPosition += width
    draw()
    freeze()
  }

  // freezes each tetromino at the bottom layer of grid when it reaches a "taken" square on the grid
  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //  randomly generates the new tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * tetrominoes.length)
      current = tetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // moves the tetromino left without going past the left margin
  function moveLeft () {
    erase()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if (!isAtLeftEdge) currentPosition -= 1

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }
    draw()
  }

  // moves the tetromino right without going past the right margin
  function moveRight () {
    erase()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!isAtRightEdge) currentPosition += 1
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }
    draw()
  }

  // rotates tetromino in the clockwise direction
  function rotate () {
    erase()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }
    current = tetrominoes[random][currentRotation]
    draw()
  }

  // displays the next Tetromino in the mini grid on the right
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  //  array holds the different five upcoming display shapes
  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lshape
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
  ]
  //  displays in mini grid
  function displayShape () {
    //  removes trace from previous shapes
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }
  //  begins game on click of the play button and moves the shape down at 400ms
  play.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 400)
      nextRandom = Math.floor(Math.random() * tetrominoes.length)
      displayShape()
    }
  })

  // adds score for every row that fills up completely
  function addScore () {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
      //  if a row clears the user gains 10 to their score
      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        //  every time a row is filled the method splice clears the space in that row,
        //  shifts the grid down, and adds a row at the top
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }
  //  the end of the game happens when the user runs out of space on the grid
  function gameOver () {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = ' GAME OVER'
      clearInterval(timerId)
    }
  }
})
