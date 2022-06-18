'use strict';

let gl,
    program,
    VAO,
    indexBuffer,
    indices,
    projectionMatrix = mat4.create(),
    modelViewMatrix = mat4.create();

function getShader() {

    return new Promise((resolve) => {
        po.loadShader([
            './common/lib/vs.vert',
            './common/lib/fs.frag',
        ])
        .then((shaders) => {

            const vs = po.createShader(shaders[0], gl.VERTEX_SHADER);
            const fs = po.createShader(shaders[1], gl.FRAGMENT_SHADER);

            program = po.createProgram(vs, fs);

            program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
            program.uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
            
            resolve();
            
        });
    });
}

function initBuffers() {
    const vertices = sphere.vertices;

    indices = sphere.indices;

    VAO = gl.createVertexArray();

    gl.bindVertexArray(VAO);

    const vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.enableVertexAttribArray(program.aVertexPosition);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

    indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -1.5]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, 0 * Math.PI / 180, [0, 1, 0]);


    gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
    gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);

    // mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 10, 10000);
    // mat4.identity(modelViewMatrix);
    // mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -5]);
    // //mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [1, 0, 0]);
    // //mat4.rotate(modelViewMatrix, modelViewMatrix, 30 * Math.PI / 180, [0, 1, 0]);

    // gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);
    // gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);

    gl.bindVertexArray(VAO);
    
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);

}

function init() {
    // Retrieve the canvas
    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    // Set the canvas to the size of the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Retrieve a WebGL context
    gl = utils.getGLContext(canvas);
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);

    // Call the functions in an appropriate order
    getShader().then(() => {
        initBuffers();
        draw();
    });
  }

//ドキュメントが読み込まれたときに一度だけ実行
window.onload = init;