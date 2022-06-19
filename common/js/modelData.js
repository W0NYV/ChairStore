'use strict';

const modelData = {

    initBuffers(_vertices, _indices, mode, _objects) {

        const data = {};

        const vertices = _vertices;
    
        const indices = _indices;
        data.indices = indices;
    
        const normals = utils.calculateNormals(vertices, indices);
    
        const vao = gl.createVertexArray();
    
        gl.bindVertexArray(vao);
    
        const vertexBuffer = gl.createBuffer();
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        gl.enableVertexAttribArray(program.aVertexPosition);
        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    
        //法線
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(program.aVertexNormal);
        gl.vertexAttribPointer(program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
    
        const indexBuffer = gl.createBuffer();
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        
        data.vao = vao;
        data.ibo = indexBuffer;
        data.mode = mode;
        
        _objects.push(data);

        //バインド解除
        gl.bindVertexArray(vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    },

    //以下モデルたち
    
    //床
    floor(_dimension, _lines) {
        
        const data = {};
        const dimension = _dimension;
        const lines = 2 * _dimension / _lines;
    
        const inc = 2 * dimension / lines;
        const v = [];
        const i = [];
    
        for (let l = 0; l <= lines; l++) {
          v[6 * l] = -dimension;
          v[6 * l + 1] = 0;
          v[6 * l + 2] = -dimension + (l * inc);
    
          v[6 * l + 3] = dimension;
          v[6 * l + 4] = 0;
          v[6 * l + 5] = -dimension + (l * inc);
    
          v[6 * (lines + 1) + 6 * l] = -dimension + (l * inc);
          v[6 * (lines + 1) + 6 * l + 1] = 0;
          v[6 * (lines + 1) + 6 * l + 2] = -dimension;
    
          v[6 * (lines + 1) + 6 * l + 3] = -dimension + (l * inc);
          v[6 * (lines + 1) + 6 * l + 4] = 0;
          v[6 * (lines + 1) + 6 * l + 5] = dimension;
    
          i[2 * l] = 2 * l;
          i[2 * l + 1] = 2 * l + 1;
          i[2 * (lines + 1) + 2 * l] = 2 * (lines + 1) + 2 * l;
          i[2 * (lines + 1) + 2 * l + 1] = 2 * (lines + 1) + 2 * l + 1;
        }
        
        data.vertices = v;
        data.indices = i;
        
        return data;
      }

};