#version 300 es
precision mediump float;

uniform vec3 uLightDirection;

in vec3 vNormal;
in vec3 vEyeVector;

out vec4 fragColor;

void main(void) {

    vec3 L = normalize(uLightDirection);
    vec3 N = normalize(vNormal);

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

    fragColor = vec4(vec3(Id+Is+Ia), 1.0);
}