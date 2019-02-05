
var canvas;
var gl;

// Three Vertices        
var vertices = [];

// Outer grid padding in percentage
var outerGridPadding = 0.01;
var padding = outerGridPadding * 2;

var numberOfCols = 10;
var numberOfRows = 20;

// Draw grid rows
var rowGridSpacing = (2 - padding * 2) / numberOfRows;
var colGridSpacing = (2 - padding * 2) / numberOfCols;

// Draw grid
for (var i = 0; i <= numberOfRows; i++) {
    vertices.push(vec2(-1 + padding, -1 + padding + i*rowGridSpacing));
    vertices.push(vec2(1 - padding, -1 + padding + i*rowGridSpacing));
}

for (var i = 0; i <= numberOfCols; i++) {
    vertices.push(vec2(-1+padding + i*colGridSpacing, 1-padding));
    vertices.push(vec2(-1+padding + i*colGridSpacing, -1+padding));
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Sets up viewport
    gl.viewport( 0, 0, canvas.width, canvas.height );
    // Determines the background used when clearing color buffers
    gl.clearColor( 0, 0, 0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );    
    
    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT ); 
    gl.drawArrays( gl.LINES, 0, vertices.length );
}

// Figure out how to draw a line across the top of the screen
// Figure out how to draw a grid

