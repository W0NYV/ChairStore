#version 300 es
precision mediump float;

uniform vec3 uLightDirection;
uniform mat4 uNormalMatrix;
uniform bool uIsWireFrame;
uniform vec3 uDiffuseColor;
uniform sampler2D uSampler;

in vec3 vNormal;
in vec3 vEyeVector;
in vec2 vTexCoord;

out vec4 fragColor;

void main(void) {

    vec3 L = normalize(uLightDirection);
    vec3 N = normalize(vNormal);

    //ライトの向きを固定する
    // L = vec3(uNormalMatrix * vec4(L, 0.0));

    vec3 E = normalize(vEyeVector);
    vec3 R = reflect(L, N);

    float lambertTerm = dot(N, -L);
    float specular = pow(max(dot(R, E), 0.0), 30.0);

    vec4 Id = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 Ia = vec4(0.0);
    vec4 Is = vec4(0.0, 0.0, 0.0, 1.0);

    if(lambertTerm > 0.0) {
        Id = vec4(lambertTerm);
        Is = vec4(specular);
    }

    if(uIsWireFrame) {
        fragColor = vec4(vec3(0.75), 1.0);
    } else {
        Id *= vec4(uDiffuseColor, 1.0);
        //fragColor = texture(uSampler, vTexCoord);
        fragColor = vec4(vec3(Id+Is+Ia), 1.0) * texture(uSampler, vTexCoord);
    }
}