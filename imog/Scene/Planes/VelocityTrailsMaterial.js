import * as THREE from 'three';

export default class VelocityTrailsMaterial extends THREE.ShaderMaterial {
  constructor(options) {
    super();

    this.uniforms = {
      ...THREE.ShaderLib.basic.uniforms,
      t: { value: 0 },
      randV: { value: Math.random() },
      alpha: { value: 1 },
      color: { value: options.color },
      highlightColor: { value: options.highlightColor },
    };

    this.blending = THREE.AdditiveBlending;
    this.depthTest = false;

    this.type = 'VelocityTrailsMaterial';
    this.name = 'VelocityTrailsMaterial';

    this.vertexShader = `
      #include <common>
      // #include <uv_pars_vertex>
      // #include <uv2_pars_vertex>
      #include <envmap_pars_vertex>
      #include <color_pars_vertex>
      #include <fog_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>

      varying vec2 vUv;

      void main() {
        // #include <uv_vertex>
        // #include <uv2_vertex>
        #include <color_vertex>
        #include <morphcolor_vertex>
        #if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
          #include <beginnormal_vertex>
          #include <morphnormal_vertex>
          #include <skinbase_vertex>
          #include <skinnormal_vertex>
          #include <defaultnormal_vertex>
        #endif
        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>
        #include <worldpos_vertex>
        #include <envmap_vertex>
        #include <fog_vertex>
        vUv = uv;
      }
    `;
    this.fragmentShader = `
      uniform vec3 diffuse;
      uniform float opacity;
      #ifndef FLAT_SHADED
        varying vec3 vNormal;
      #endif
      #include <common>
      #include <dithering_pars_fragment>
      #include <color_pars_fragment>
      #include <uv_pars_fragment>
      #include <uv2_pars_fragment>
      #include <map_pars_fragment>
      #include <alphamap_pars_fragment>
      #include <alphatest_pars_fragment>
      #include <aomap_pars_fragment>
      #include <lightmap_pars_fragment>
      #include <envmap_common_pars_fragment>
      #include <envmap_pars_fragment>
      #include <cube_uv_reflection_fragment>
      #include <fog_pars_fragment>
      #include <specularmap_pars_fragment>
      #include <logdepthbuf_pars_fragment>
      #include <clipping_planes_pars_fragment>

      varying vec2 vUv;
      uniform vec3 color;
      uniform vec3 highlightColor;
      uniform float t;
      uniform float randV;
      uniform float alpha;

      float rand(float n){return fract(sin(n) * 43758.5453123);}

      float noise(vec2 n) {
      	const vec2 d = vec2(0.0, 1.0);
        vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
      	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
      }

      float noise(float p){
      	float fl = floor(p);
        float fc = fract(p);
      	return mix(rand(fl), rand(fl + 1.0), fc);
      }

      void main() {
        #include <clipping_planes_fragment>
        vec4 diffuseColor = vec4( diffuse, opacity );
        #include <logdepthbuf_fragment>
        #include <map_fragment>
        #include <color_fragment>
        #include <alphamap_fragment>
        #include <alphatest_fragment>
        #include <specularmap_fragment>
        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        #ifdef USE_LIGHTMAP
          vec4 lightMapTexel = texture2D( lightMap, vUv2 );
          reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
        #else
          reflectedLight.indirectDiffuse += vec3( 1.0 );
        #endif
        #include <aomap_fragment>
        reflectedLight.indirectDiffuse *= diffuseColor.rgb;
        vec3 outgoingLight = reflectedLight.indirectDiffuse;
        #include <envmap_fragment>
        #include <output_fragment>

        // vec4 worldColor =
        gl_FragColor.rgb = color/255.0 * 0.5;
        // gl_FragColor.rgb += vec3(fract(vUv.y * 5.0 + t * 1.0 + randV));
        float n = noise(vec2(randV * 7362.736 + vUv.x * 10.0, vUv.y * 4.0 + t * mix(0.8, 1.0, vUv.x * 5.0) * 1.0));
        gl_FragColor.rgb = mix(gl_FragColor.rgb, highlightColor * 0.7 / 255.0, smoothstep(0.4, 0.6, n)) * 0.75;

        gl_FragColor.a = alpha;


        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>
      }
    `;
  }
}
