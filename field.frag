






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



float glow = 0.01;
float width = 0.0;
float cellSize = 0.001;

float grid(vec2 uv)
{
  float d = length(uv);

    uv /= cellSize/2.0;
width += smoothstep(0.0,0.05,d)/3.;
float dVert = length(fract(uv.x ) - 0.5);
float dHorz = length(fract(uv.y ) - 0.5);
float grid = smoothstep(width + glow,width,dVert) + 
                 smoothstep(width + glow,width,dHorz);
                   d = smoothstep(0.1,0.0,d);
                 return grid*d;
}
void main()
{

    vec2 uv = fragCoord.xy / u_resolution.xy-0.5;
    uv.x *= u_resolution.x/u_resolution.y;
    float grid = grid(uv);
    vec3 col = vec3(grid);

    gl_FragColor = vec4(col, 1.0);
}
