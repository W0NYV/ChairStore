#version 300 es
precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;

in vec3 aVertexPosition;
in vec3 aVertexNormal;
in vec2 aTexCoord;

out vec3 vNormal;
out vec3 vEyeVector;
out vec2 vTexCoord;

void main(void) {

    vec4 vertex = uModelViewMatrix * vec4(aVertexPosition, 1.0);

    vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
    vEyeVector = -vec3(vertex.xyz);
    vTexCoord = aTexCoord;

    //gl_Positionに格納される値はクリップ空間座標の値
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}