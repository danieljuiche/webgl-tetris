
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

// Draw grid
for (var i = 0; i <= numberOfRows; i++) {
    gridVertices.push(vec2(-1 + padding, -1 + padding + i*rowGridSpacing));
    gridVertices.push(vec2(1 - padding, -1 + padding + i*rowGridSpacing));
}

for (var i = 0; i <= numberOfCols; i++) {
    gridVertices.push(vec2(-1+padding + i*colGridSpacing, 1-padding));
    gridVertices.push(vec2(-1+padding + i*colGridSpacing, -1+padding));
}


// Set up timer
window.setInterval(lowerTetrisPiece, 700);
function lowerTetrisPiece() {
    currentBlock.centerOfRotation[1]--;
    console.log(currentBlock.centerOfRotation);
}

var newBlockRequired = true;


// Orientations
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
        color: vec4(1.0, 0.0, 0.0, 1.0)
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
        color: vec4(0.0, 0.0, 1.0, 1.0)
    }
];

// Initialize 
var currentBlock = {};
var selectedBlock = {};

function selectCurrentBlock() {
    if (newBlockRequired) {
        // Randomly select piece
        var randPieceInt = Math.floor(Math.random() * tetriminoPieces.length);
        selectedBlock = tetriminoPieces[randPieceInt];

        // Display it in random location
        var initialLocation = [6, 20];

        currentBlock.type = selectedBlock.type;
        currentBlock.centerOfRotation = initialLocation;
        currentBlock.orientation = selectedBlock.styles[0].orientation;
        currentBlock.color = selectedBlock.color;
        currentBlock.location = [];
        currentBlock.cornerCoordinates = [];

        newBlockRequired = false;
    }
}


function convertCornerCoords(x, y) {
    var xCoord = x/numberOfCols * 1 + (numberOfCols - x)/(numberOfCols) * -1;
    var yCoord = y/numberOfRows * 1 + (numberOfRows - y)/(numberOfRows) * -1;
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
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0], currentBlock.location[block][1] - 1));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0] - 1, currentBlock.location[block][1]));
        currentBlock.cornerCoordinates.push(convertCornerCoords(currentBlock.location[block][0] - 1, currentBlock.location[block][1] - 1));
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

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, currentBlock.cornerCoordinates.length);
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

    drawCurrentBlock();    
    drawGridLines();

    window.requestAnimFrame(render);
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

// Example we are given in class uses flatten function. Can we include it here? Yes
// Is it possible to split up the draw arrays command? Or do I have to put everything into one buffer? It is possible to split up
// How do I separate my game logic? How do I set up my game board? What does the data structure look like?


// How do I set up my tetris pieces and then convert them into clip space coords?

// Unsure of how to set up my render function, how to manage game state with render?

// How do I incorporate color?
