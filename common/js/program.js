// シェーダを別ファイルから読み込んで、プログラムオブジェクトを作成するためのJS

'use strict';

const po = {
    
    //引数で受け取った配列の、中身のパスを順番に開き、
    //すべてをまとめて実行し、開いた結果を配列に入れて、Promiseを解決
    loadShader(pathArray) {
        if(Array.isArray(pathArray) !== true) {
            throw new Error('invalid argment');
        }

        const promises = pathArray.map((path) => {
            return fetch(path).then((response) => {return response.text();})
        });

        return Promise.all(promises);
    },

    createShader(source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            return shader;
        } else {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
    }, 

    createProgram(vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
    
        console.log(vs);
    
        gl.linkProgram(program);
    
        if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            return program;
        } else {
            alert(gl.getProgramInfoLog(program));
            return null;
        }
    }
};