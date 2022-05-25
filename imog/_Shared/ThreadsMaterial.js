import * as THREE from 'three';

export default class ThreadsMaterial extends THREE.ShaderMaterial {
  constructor(options) {
    super();

    this.transparent = true;
    this.blending = THREE.AdditiveBlending;
    this.depthTest = false;

    this.uniforms = {
      ...THREE.ShaderLib.basic.uniforms,
      color: { value: options.color },
      backFace: { value: options.backFace || 0 },
    };

    // this.isMeshBasicMaterial = true;
    this.type = 'ThreadsMaterial';
    this.name = 'ThreadsMaterial';

    this.vertexShader = `
      #include <common>
      #include <uv_pars_vertex>
      #include <uv2_pars_vertex>
      #include <envmap_pars_vertex>
      #include <color_pars_vertex>
      #include <fog_pars_vertex>
      #include <morphtarget_pars_vertex>
      #include <skinning_pars_vertex>
      #include <logdepthbuf_pars_vertex>
      #include <clipping_planes_pars_vertex>

      varying vec3 vNN;
      varying vec3 vEye;

      void main() {
        #include <uv_vertex>
        #include <uv2_vertex>
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

        vec3 n = normalMatrix * normal;
        mat4 LM = modelMatrix;
        LM[2][3] = 0.0;
        LM[3][0] = 0.0;
        LM[3][1] = 0.0;
        LM[3][2] = 0.0;
        vec4 GN = LM * vec4(normal.xyz, 1.0);
        vNN = normalize(GN.xyz);
        vEye = normalize(GN.xyz-cameraPosition);
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

      uniform vec3 color;
      uniform float backFace;

      varying vec3 vNN;
      varying vec3 vEye;

      float map(float value, float min1, float max1, float min2, float max2) {
        return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
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

        float dotN = dot(vEye, normalize(vNN));
        float fresnelTerm = abs(dotN);
        fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
        fresnelTerm = clamp(pow(fresnelTerm, 3.5), 0.035, 1.0);
        vec4 worldColor = vec4(color/255.0 * fresnelTerm, 1.0);
        gl_FragColor = worldColor;

        float backFace = clamp(map(dotN, 0.2, -0.1, 1.0, 0.0), backFace, 1.0);
        gl_FragColor.rgb *= backFace;


        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>
      }
    `;
  }
}
