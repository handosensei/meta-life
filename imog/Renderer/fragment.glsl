varying vec2 vUv;
uniform sampler2D tWorld;
uniform sampler2D tVfx;
uniform sampler2D tVfxBloom;
uniform vec3 levels;
uniform float saturation;
uniform vec2 resolution;
uniform float uTime;

#pragma glslify: grain = require(glsl-film-grain)

vec3 gammaCorrect(vec3 color, float gamma){
    return pow(color, vec3(1.0/gamma));
}

vec3 levelRange(vec3 color, float minInput, float maxInput){
    return min(max(color - vec3(minInput), vec3(0.0)) / (vec3(maxInput) - vec3(minInput)), vec3(1.0));
}

vec3 finalLevels(vec3 color, float minInput, float gamma, float maxInput){
    return gammaCorrect(levelRange(color, minInput, maxInput), gamma);
}

vec3 czm_saturation(vec3 rgb, float adjustment) {
    // Algorithm from Chapter 16 of OpenGL Shading Language
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
}

void main() {
    vec4 worldColor = LinearTosRGB(texture2D(tWorld, vUv));

    // worldColor.rgb = finalLevels(worldColor.rgb, 0.0, 1.0, 1.0);
    vec4 vfxColor = texture2D(tVfx, vUv);
    vec4 vfxBloomColor = texture2D(tVfxBloom, vUv);
    // gl_FragColor = mix(worldColor, vfxColor / clamp(vfxColor.a, 0.001, 1.0), vfxColor.a) + vfxBloomColor;
    // gl_FragColor = mix(worldColor, vfxBloomColor, 0.1) + vfxBloomColor;
    gl_FragColor = worldColor; // + vfxBloomColor;
    gl_FragColor.rgb = czm_saturation(gl_FragColor.rgb, saturation);
    gl_FragColor.rgb = finalLevels(gl_FragColor.rgb, levels.x, levels.y, levels.z);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(grain(vUv + sin(uTime * 123.277), resolution / 2.0)), 0.07);

    // gl_FragColor.rgb = worldColor.rgb;

    // gl_FragColor.rgb = log2(  gl_FragColor.rgb + 1.0);
    // gl_FragColor.rgb = mix(vec3(0.0), vfxColor.rgb, vfxColor.a);

    // vec2 vigUv =  vUv * (1.0 - vUv.yx);
    // float vig = vigUv.x * vigUv.y * 15.0; // multiply with sth for intensity
    // vig = pow(vig, 0.8); // change pow for modifying the extend of the  vignette
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.0), (1.0 - vig) * 0.5);
}
