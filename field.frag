






#ifdef GL_ES
    precision highp float;
    precision mediump int;
    #endif
      uniform float u_time;
        uniform vec2 u_resolution;
      varying vec2 fragCoord;
      // Let's define PI constant
      #define pi 3.1415926535
    float t;




const float lineThickness = 0.0001;
const float neonRadius = 0.;
const vec3 neonColor = vec3(1.0, 1.0, 1.0);

void main()
{
   	vec2 uv = fragCoord.xy / u_resolution.xy-0.5;
    // vec2 uv = gl_FragCoord.xy / u_resolution.xy-0.5;
	uv.x *= u_resolution.x/u_resolution.y;
       float aspectRatio = u_resolution.x / u_resolution.y;
    // Create a grid of crossed lines
    float lines = step(mod(uv.x, 0.001), lineThickness) +
                  step(mod(uv.y, 0.001), lineThickness);
    vec2 iMouse = vec2(0.5);
    // Calculate the distance from the mouse
    vec2 mouse = (iMouse - u_resolution.xy) / u_resolution.y;
    float dist = distance(uv, iMouse.xy / u_resolution.xy * vec2(aspectRatio, 1.0));
    
    // Add neon effect when the mouse is near the lines
    float neon = smoothstep(neonRadius, 0.0, dist);
    
    // Mix the neon color with the grid color
    vec3 color = mix(vec3(0.1), neonColor, neon);
    
    // Output the final color
    gl_FragColor = vec4(color * lines, 1.0);
}
