






#ifdef GL_ES
    precision highp float;
    precision mediump int;
    #endif
      uniform float u_time; 
      uniform float u_startTime;
        uniform vec2 u_resolution;
      varying vec2 fragCoord;
      // Let's define PI constant
      #define pi 3.1415926535
    float t;




float width = 0.0;
float cellSize = 0.001;

float grid(vec2 uv)
{
  float d = length(uv) ;
float glow = 0.01;//1.0 - u_startTime/60.;
      // glow = clamp(glow,-0.,1.0)/12.;
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

    // vec2 uv = fragCoord.xy / u_resolution.xy-0.5;
    // uv.x *= u_resolution.x/u_resolution.y;
    // float grid = grid(uv);
    // vec3 col = vec3(grid);

	 float col;
    float t = u_time*.1;
   vec2 uv = fragCoord.xy / u_resolution.xy-0.5;

  float d = length(uv) ;
   uv /=  12.;
   
        float factor = 1.5;
        for(int i=0;i<9;i++)
        {
            uv *= -factor*factor;
            uv += sin(uv.yx/factor * (t*112.+1.))/factor;
            col += sin(uv.x-uv.y+col)+cos(uv.y-uv.x);
        }
    gl_FragColor = vec4(vec3(col/5.0),1.0);



    // gl_FragColor = vec4(col, 1.0);
}
