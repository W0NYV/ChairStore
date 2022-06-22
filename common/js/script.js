'use strict';

let gl,
    program,

    objects = [],
    chair1 = [],
    chair2 = [],
    
    lastTime,
    
    angle = 0,
    mouseX = 0,
    mouseY = 0,
    zoom = 0,
    chairNumber = 0,
    mousePressed = false,

    projectionMatrix = mat4.create(),
    modelViewMatrix = mat4.create(),
    normalMatrix = mat4.create(),

    textures = [],
    lightDirection = [-0.25, -0.25, -0.25],
    currentColor,
    colors = [[1.0, 0.0, 0.0],
              [0.0, 1.0, 0.0],
              [0.0, 0.0, 1.0],
              [0.2, 0.2, 0.2],
              [0.8, 0.8, 0.8],
              [1.0, 1.0, 1.0]];

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
            program.aVertexNormal = gl.getAttribLocation(program, 'aVertexNormal');
            program.aTexCoord = gl.getAttribLocation(program, 'aTexCoord');

            program.uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
            program.uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
            program.uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');
            program.uLightDirection = gl.getUniformLocation(program, 'uLightDirection');
            program.uDiffuseColor = gl.getUniformLocation(program, 'uDiffuseColor');
            program.uIsWireFrame = gl.getUniformLocation(program, 'uIsWireFrame');
            program.uSampler = gl.getUniformLocation(program, 'uSampler');
            program.uSampler2 = gl.getUniformLocation(program, 'uSampler2');
            program.uUseSampler2 = gl.getUniformLocation(program, 'uUseSampler2');
            program.uUseTexture = gl.getUniformLocation(program, 'uUseTexture');
            program.uShiness = gl.getUniformLocation(program, 'uShiness');
            
            resolve();
            
        });
    });
}

function initModels() {

    const floor = modelData.floor(80, 2);

    modelData.initBuffers4Json('./common/lib/chair/chair001.json', "TRI", "palette", 0, chair1);
    modelData.initBuffers4Json('./common/lib/chair/chair002.json', "TRI", "white", 30.0, chair1);
    modelData.initBuffers4Json('./common/lib/chair/chair003.json', "TRI", "black", 30.0, chair1);
    modelData.initBuffers4Json('./common/lib/chair/chair004.json', "TRI", "black", 30.0, chair1);
    modelData.initBuffers4Json('./common/lib/chair/chair005.json', "TRI", "black", 30.0, chair1);
    
    modelData.initBuffers4Json('./common/lib/chair2/chair2_001.json', "TRI", "palette", 0, chair2);
    modelData.initBuffers4Json('./common/lib/chair2/chair2_002.json', "TRI", "white", 30.0, chair2);
    modelData.initBuffers4Json('./common/lib/chair2/chair2_003.json', "TRI", "white", 30.0, chair2);
    modelData.initBuffers4Json('./common/lib/chair2/chair2_004.json', "TRI", "black", 30.0, chair2);
    modelData.initBuffers4Json('./common/lib/chair2/chair2_005.json', "TRI", "black", 30.0, chair2);

    // modelData.initBuffers(sphere.vertices, sphere.indices, "TRI", "palette", objects);
    modelData.initBuffers(floor.vertices, floor.indices, "LINE", "black", objects);
}

function loadImg(path) {
    const texture = gl.createTexture();
    const image = new Image();
    image.src = path;

    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        textures.push(texture);
    };
}

function draw() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    mat4.perspective(projectionMatrix, 45, gl.canvas.width / gl.canvas.height, 0.1, 10000);

    gachiDraw(objects);        

    if(chairNumber == 0) {
        gachiDraw(chair2);
    } else if(chairNumber == 1) {
        gachiDraw(chair1);
    }
}

//ガチの描画
function gachiDraw(_objects) {
    try {
        _objects.forEach((object, index) => {

            mat4.identity(modelViewMatrix);
            mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -50 + zoom]);
            mat4.translate(modelViewMatrix, modelViewMatrix, [0, -15, 0]);
            mat4.rotate(modelViewMatrix, modelViewMatrix, 120 + -mouseY * Math.PI / 180, [1, 0, 0]);
            mat4.rotate(modelViewMatrix, modelViewMatrix, 180 + mouseX * Math.PI / 180, [0, 1, 0]);

            mat4.copy(normalMatrix, modelViewMatrix);
            mat4.invert(normalMatrix, normalMatrix);
            mat4.transpose(normalMatrix, normalMatrix);

            gl.uniformMatrix4fv(program.uNormalMatrix, false, normalMatrix);
            gl.uniformMatrix4fv(program.uModelViewMatrix, false, modelViewMatrix);
            gl.uniformMatrix4fv(program.uProjectionMatrix, false, projectionMatrix);

            gl.bindVertexArray(object.vao);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);

            if(object.texCoord) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, textures[0]);
                gl.uniform1i(program.uSampler, 0);
            
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, textures[1]);
                gl.uniform1i(program.uSampler2, 1);
            }

            if(object.mode == "TRI") {

                switch (object.color) {
                    case "black":
                        gl.uniform3fv(program.uDiffuseColor, colors[3]);
                        gl.uniform1i(program.uUseSampler2, false);
                        gl.uniform1i(program.uUseTexture, false);
                        break;
                    case "white":
                        gl.uniform3fv(program.uDiffuseColor, colors[4]);
                        gl.uniform1i(program.uUseSampler2, false);
                        gl.uniform1i(program.uUseTexture, false);
                        break;
                    case "palette":
                        switch (currentColor) {
                            case 'red':
                                gl.uniform3fv(program.uDiffuseColor, colors[0]);
                                gl.uniform1i(program.uUseSampler2, false);
                                gl.uniform1i(program.uUseTexture, false);
                                break;
                            case 'green':
                                gl.uniform3fv(program.uDiffuseColor, colors[1]);
                                gl.uniform1i(program.uUseSampler2, false);
                                gl.uniform1i(program.uUseTexture, false);
                                break;
                            case 'blue':
                                gl.uniform3fv(program.uDiffuseColor, colors[2]);
                                gl.uniform1i(program.uUseSampler2, false);
                                gl.uniform1i(program.uUseTexture, false);
                                break;
                            case 'white':
                                gl.uniform3fv(program.uDiffuseColor, colors[5]);
                                gl.uniform1i(program.uUseSampler2, false);
                                gl.uniform1i(program.uUseTexture, true);
                                break;
                            case 'white2':
                                gl.uniform3fv(program.uDiffuseColor, colors[5]);
                                gl.uniform1i(program.uUseSampler2, true);
                                gl.uniform1i(program.uUseTexture, true);
                                break;            
                            default:
                                gl.uniform3fv(program.uDiffuseColor, colors[0]);
                                gl.uniform1i(program.uUseSampler2, false);
                                gl.uniform1i(program.uUseTexture, false);
                        }
                        break;
                }

                gl.uniform1f(program.uShiness, object.shiness);
                gl.uniform1i(program.uIsWireFrame, false);
                gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT, 0);
            
            } else if(object.mode == "LINE") {
              
                gl.uniform1i(program.uIsWireFrame, true);
                gl.drawElements(gl.LINES, object.indices.length, gl.UNSIGNED_SHORT, 0);
            
            }

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        });
    } catch(error) {
        console.error(error);
    }
}

function animate() {
    let timeNow = new Date().getTime();
    if(lastTime) {
        const elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
    lastTime = timeNow;
}

function render() {
    requestAnimationFrame(render);
    animate();
    draw();
}

function init() {
    // Retrieve the canvas
    const canvas = utils.getCanvas('webgl-canvas');
    utils.autoResizeCanvas(canvas);

    // Retrieve a WebGL context
    gl = utils.getGLContext(canvas);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearDepth(100);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Call the functions in an appropriate order
    getShader().then(() => {
        initModels();
        control.palette();
        control.cameraControl();
        gl.uniform3fv(program.uLightDirection, lightDirection);
        loadImg('./common/lib/img/flower.jpg');
        loadImg('./common/lib/img/sea.png');
        render();
    });
}

//ドキュメントが読み込まれたときに一度だけ実行
window.onload = init;