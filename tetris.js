
var canvas;
var gl;
var program;

// Three Vertices        
var gridVertices = [];

// Outer grid padding in percentage
var outerGridPadding = 0;
var padding = outerGridPadding * 2;

var numberOfCols = 10;
var numberOfRows = 20;

// Draw grid rows
var rowGridSpacing = (2 - padding * 2) / numberOfRows;
var colGridSpacing = (2 - padding * 2) / numberOfCols;

var lowerTetrisPieceFlag = true;

// Draw grid
for (var i = 0; i <= numberOfRows; i++) {
    gridVertices.push(vec2(-1 + padding, -1 + padding + i*rowGridSpacing));
    gridVertices.push(vec2(1 - padding, -1 + padding + i*rowGridSpacing));
}

for (var i = 0; i <= numberOfCols; i++) {
    gridVertices.push(vec2(-1+padding + i*colGridSpacing, 1-padding));
    gridVertices.push(vec2(-1+padding + i*colGridSpacing, -1+padding));
}

var gameInterval;

var defaultGameSpeed = 600;
var increasedGameSpeed = 100;
var increaseGameSpeedFlag = false;

// Takes speed of game in parameter
function setGameSpeed(speed) {
    clearInterval(gameInterval);
    gameInterval = window.setInterval(lowerTetrisPiece, speed);
}

// Set up timer
setGameSpeed(defaultGameSpeed);

function lowerTetrisPiece() {
    for (var coordinates in currentBlock.location) {
        var xCoord = currentBlock.location[coordinates][0];
        var yCoord = currentBlock.location[coordinates][1];

        if (gameBoardState[xCoord][yCoord-1].occupied === true) {
            for (var coordinates in currentBlock.location) {
                var xCoord = currentBlock.location[coordinates][0];
                var yCoord = currentBlock.location[coordinates][1];

                gameBoardState[xCoord][yCoord].occupied = true;
                gameBoardState[xCoord][yCoord].color = currentBlock.color;
            }

            newBlockRequired = true;
            // lowerTetrisPieceFlag = false;
            break;
        }
    }
    // if (lowerTetrisPieceFlag) {
        currentBlock.centerOfRotation[1]--;
    // }
    // lowerTetrisPieceFlag = true;
    // console.log(currentBlock.centerOfRotation);
}


window.addEventListener("keyup", getUpKey, false);

function getUpKey (key) {
    if (key.key === "ArrowDown") {
        setGameSpeed(defaultGameSpeed);
        increaseGameSpeedFlag = false;
    }
}

window.addEventListener("keydown", getDownKey, false);

function getDownKey (key) {
    if (key.key === "ArrowDown" && !increaseGameSpeedFlag) {
        setGameSpeed(increasedGameSpeed);
        increaseGameSpeedFlag = true;
    }
    if (key.key === "ArrowUp") {
        tetriminoPieces.forEach(function(piece) {
            if (piece.type === currentBlock.type) {
                var newStyleNum = (currentBlock.styleNum + 1) % piece.styles.length;
                if (!checkPieceCollision(selectedBlock.styles[newStyleNum].orientation)) {
                    currentBlock.orientation = selectedBlock.styles[newStyleNum].orientation;
                    currentBlock.styleNum = newStyleNum;
                }
            }
        });
    }
    if (key.key === "ArrowLeft") {
        var xCoord = currentBlock.centerOfRotation[0];
        var yCoord = currentBlock.centerOfRotation[1];

        console.log(currentBlock.orientation);

        if (!checkWallCollision(currentBlock.orientation, "ArrowLeft")) {
            currentBlock.centerOfRotation[0]--;
        }

    }
    if (key.key === "ArrowRight") {
        var xCoord = currentBlock.centerOfRotation[0];
        var yCoord = currentBlock.centerOfRotation[1];

        if (!checkWallCollision(currentBlock.orientation, "ArrowRight")) {
            currentBlock.centerOfRotation[0]++;
        }
    }
}


function checkPieceCollision(blockOrientations) {
    var currentXCoord = currentBlock.centerOfRotation[0];
    var currentYCoord = currentBlock.centerOfRotation[1];

    for (var coordinates in blockOrientations) {
        var testXCoordinate = blockOrientations[coordinates][0] + currentXCoord;
        var testYCoordinate = blockOrientations[coordinates][1] + currentYCoord;

        if (gameBoardState[testXCoordinate][testYCoordinate].occupied === true) {
            return true;
        } 
        // if (testXCoordinate < 0 || testXCoordinate >= numberOfCols) {
        //     return true;
        // }
    }
    return false;
}
// Find current style location based on type.
// function getCurrentStyleLocations () {
//     tetriminoPieces.forEach(function(piece) {
//         if (piece.type === currentBlock.type) {
//             currentBlock.styleNum = newStyleNum;
//             return currentBlock.O
//         }
//     });
// }



var newBlockRequired = true;
var gameBoardState = [];

for (var i = 0; i < numberOfCols; i++) {
    var tempArray = [];
    for (var j = 0; j < numberOfRows; j++) {
        tempArray.push({
            occupied: false,
            color: vec4(Math.random(), Math.random(), Math.random(), 1.0),
            location: [i,j],
            cornerCoordinates: [
                convertCornerCoords(i,j),
                convertCornerCoords(i, j+1),
                convertCornerCoords(i+1, j+1),
                convertCornerCoords(i,j),
                convertCornerCoords(i+1, j+1),
                convertCornerCoords(i+1, j)
            ]
        });
    }
    gameBoardState.push(tempArray);
}

// ...................... //
// Tetrimino Orientations //
// ...................... //

var tetriminoPieces = [
    {
        type: "oPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(-1, 0),
                    vec2(0, 0),
                    vec2(-1, -1),
                    vec2(0, -1)
                ]
            }
        ],
        color: vec4(1.0, 1.0, 0.0, 1.0)
    },
    {
        type: "iPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(1, 0),
                    vec2(-1, 0),
                    vec2(-2, 0)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, 1),
                    vec2(0, -1),
                    vec2(0, -2)
                ]
            }
        ],
        color: vec4(0.0, 1.0, 1.0, 1.0)
    },
    {
        type: "sPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(1, 0),
                    vec2(0, -1),
                    vec2(-1, -1)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, 1),
                    vec2(1, 0),
                    vec2(1, -1)
                ]
            }
        ],
        color: vec4(0.0, 1.0, 0.0, 1.0)
    },
    {
        type: "zPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(0, -1),
                    vec2(1, -1)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(1, 0),
                    vec2(1, 1)
                ]
            }
        ],
        color: vec4(1.0, 0.0, 0.0, 1.0)
    },
    {
        type: "lPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(1, 0),
                    vec2(-1, -1)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(1, -1)
                ]
            },
            {
                type: 3,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(1, 0),
                    vec2(1, 1)
                ]
            },
            {
                type: 4,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(-1, 1)
                ]
            }
        ],
        color: vec4(1.0, 0.631, 0.0, 1.0)
    },
    {
        type: "jPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(1, 0),
                    vec2(1, -1)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(1, 1)
                ]
            },
            {
                type: 3,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(-1, 1),
                    vec2(1, 0)
                ]
            },
            {
                type: 4,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(-1, -1)
                ]
            }
        ],
        color: vec4(0.169, 0.0, 1.0, 1.0)
    },
    {
        type: "tPiece",
        styles: [
            {
                type: 1,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(1, 0),
                    vec2(0, -1)
                ]
            },
            {
                type: 2,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(1, 0)
                ]
            },
            {
                type: 3,
                orientation: [
                    vec2(0, 0),
                    vec2(-1, 0),
                    vec2(1, 0),
                    vec2(0, 1)
                ]
            },
            {
                type: 4,
                orientation: [
                    vec2(0, 0),
                    vec2(0, -1),
                    vec2(0, 1),
                    vec2(-1, 0)
                ]
            }
        ],
        color: vec4(0.737, 0.0, 1.0, 1.0)
    },
];

// Initialize 
var currentBlock = {};
var selectedBlock = {};

function selectCurrentBlock() {
    if (newBlockRequired) {
        // Display it in random location
        var randInitialX = 2 + Math.floor(Math.random() * (numberOfCols - 3));

        var initialLocation = [randInitialX, 19];

        // Randomly select piece
        var randPieceInt = Math.floor(Math.random() * tetriminoPieces.length);
        selectedBlock = tetriminoPieces[randPieceInt];

        var randomStyleInt = Math.floor(Math.random() * selectedBlock.styles.length);

        currentBlock.orientation = selectedBlock.styles[randomStyleInt].orientation;
        currentBlock.styleNum = randomStyleInt;

        for (var i = 0; i < currentBlock.orientation.length; i++) {
            console.log(currentBlock.orientation[i][1]);
            if (currentBlock.orientation[i][1] >= 1) {
                console.log("OUTISDE");
                initialLocation = [randInitialX, 18];
                break;
            }
        }

        currentBlock.type = selectedBlock.type;
        currentBlock.centerOfRotation = initialLocation;
        currentBlock.color = selectedBlock.color;
        currentBlock.location = [];
        currentBlock.cornerCoordinates = [];

        newBlockRequired = false;
    }
}


function convertCornerCoords(x, y) {
    var xCoord = (x/numberOfCols * 1) + ((numberOfCols - x)/(numberOfCols) * -1);
    var yCoord = (y/numberOfRows * 1) + ((numberOfRows - y)/(numberOfRows) * -1);
    return vec2(xCoord, yCoord);
}

function drawCurrentBlock() {
    // Reset current block location and corner coordinates
    currentBlock.location = [];
    currentBlock.cornerCoordinates = [];

    // Populate current block grid coordinates
    for (var blockSpace in currentBlock.orientation) {
        currentBlock.location.push(
            [currentBlock.centerOfRotation[0] + currentBlock.orientation[blockSpace][0], 
            currentBlock.centerOfRotation[1] + currentBlock.orientation[blockSpace][1]]
        );
    }

    for (var block in currentBlock.location) {
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0], currentBlock.location[block][1]));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0], currentBlock.location[block][1]+1));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0]+1, currentBlock.location[block][1]+1));

        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0], currentBlock.location[block][1]));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0]+1, currentBlock.location[block][1]+1));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0]+1, currentBlock.location[block][1]));

    }

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(currentBlock.cornerCoordinates), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(currentBlock.color), gl.STATIC_DRAW);
    
    var colorUniformLocation = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(colorUniformLocation, currentBlock.color[0], currentBlock.color[1], currentBlock.color[2], currentBlock.color[3]);

    gl.drawArrays(gl.TRIANGLES, 0, currentBlock.cornerCoordinates.length);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Sets up viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );
    // Determines the background used when clearing color buffers
    gl.clearColor( 0, 0, 0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(gridVertices), gl.STATIC_DRAW );    
    
    // // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    selectCurrentBlock();
    checkStackCollision();
    drawCurrentBlock();


    drawGameBoard();

    drawGridLines();
    window.requestAnimFrame(render);
}

function checkWallCollision(blockOrientations, keyPress) {
    var currentXCoord = currentBlock.centerOfRotation[0];
    var currentYCoord = currentBlock.centerOfRotation[1];

    var keyPressXCoord = 0;
    var keyPressYCoord = 0;

    if (keyPress === "ArrowLeft") {
        keyPressXCoord = -1;
    }
    if (keyPress === "ArrowRight") {
        keyPressXCoord = 1;
    }

    for (var coordinates in blockOrientations) {
        var testXCoordinate = blockOrientations[coordinates][0] + currentXCoord + keyPressXCoord;
        var testYCoordinate = blockOrientations[coordinates][1] + currentYCoord + keyPressYCoord;
        if (testXCoordinate < 0 || testXCoordinate >= numberOfCols) {
            return true;
        }
    }
    return false;
}

function checkStackCollision() {
    // Check for collisions on each individual square of the tetrimino
    for (var coordinates in currentBlock.location) {
        var xCoord = currentBlock.location[coordinates][0];
        var yCoord = currentBlock.location[coordinates][1];
        if (gameBoardState[xCoord][yCoord].occupied === undefined) {
            console.log("ERROR");
        }

        if (gameBoardState[xCoord][yCoord].occupied === true) {
            for (var coordinates in currentBlock.location) {
                var xCoord = currentBlock.location[coordinates][0];
                var yCoord = currentBlock.location[coordinates][1] + 1;

                if (gameBoardState[xCoord][yCoord].occupied === undefined) {
                    console.log("ERROR");
                }
                gameBoardState[xCoord][yCoord].occupied = true;
                gameBoardState[xCoord][yCoord].color = currentBlock.color;
            }

            newBlockRequired = true;

            break;
        }

        // Check to see if tetrimino hits the floor
        if (yCoord <= 0) {
            // Update gameboard to include tetrimino piece
            for (var coordinates in currentBlock.location) {
                var xCoord = currentBlock.location[coordinates][0];
                var yCoord = currentBlock.location[coordinates][1];
                if (gameBoardState[xCoord][yCoord].occupied === undefined) {
                    console.log("ERROR");
                }
                gameBoardState[xCoord][yCoord].occupied = true;
                gameBoardState[xCoord][yCoord].color = currentBlock.color;
            }

            newBlockRequired = true;

            break;
        }
    }
}

function drawGameBoard() {
    for (var i = 0; i < numberOfCols; i++) {
        for (var j = 0; j < numberOfRows; j++) {
            var gridSpot = gameBoardState[i][j];

            if (gridSpot.occupied === true) {
                var vBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(gridSpot.cornerCoordinates), gl.STATIC_DRAW );

                // Associate our shader variables with our data buffer
                var vPosition = gl.getAttribLocation( program, "vPosition" );
                gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
                gl.enableVertexAttribArray( vPosition );

                var cBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, flatten(gridSpot.color), gl.STATIC_DRAW);
                
                var colorUniformLocation = gl.getUniformLocation(program, "uColor");
                gl.uniform4f(colorUniformLocation, gridSpot.color[0], gridSpot.color[1], gridSpot.color[2], gridSpot.color[3]);

                gl.drawArrays(gl.TRIANGLES, 0, gridSpot.cornerCoordinates.length);
            }
        }
    }
}

function drawGridLines() {
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(gridVertices), gl.STATIC_DRAW );

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(currentBlock.color), gl.STATIC_DRAW);
    
    var colorUniformLocation = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(colorUniformLocation, 0.827, 0.827, 0.827, 1);

    gl.drawArrays( gl.LINES, 0, gridVertices.length);
}
