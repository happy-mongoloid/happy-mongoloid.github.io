






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



//  uniform float u_time;
//  uniform vec2 u_mouse;
//  uniform vec2 u_resolution;

vec3 colorB = vec3(0.7647, 0.0, 0.1255);
vec3 colorA =vec3(0.7647, 0.0, 0.0118);


float hash11( float n )
 {
return fract(sin(n)*43758.5453);
 }
 vec2 hash12(float i){
    float x = fract(sin(i*123.123)*543.2);
    float y = fract(sin(i*312.123)*345.2);
    return vec2(x,y);
}
float noise11(float x) {
    float fractX = fract(x);
    float intX = floor(x);
    float r0 = fract(sin(intX) * 43758.5453);
    float r1 = fract(sin(intX + 1.0) * 43758.5453);
    return mix(r0, r1, fractX);
}

vec2 eyes(vec2 uv, vec2 pos, float size, vec2 target, float intensity)
{
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;
    uv += 0.5;
    vec2 posL = pos;
    vec2 posR = pos;
    posL.x -= size*5.;
    float ldL = length(uv - posL);
    posR.x += size*12.;
    float rdL = length(uv - posR);
    float ld = smoothstep(size + 0.01, size, ldL);
    float rd = smoothstep(size + 0.01 , size, rdL);
    float shape = ld + rd;
    float tL = length(uv - posL + target*size);
     tL = smoothstep(size/3. + intensity, size/3., tL);
    float tR = length(uv - posR + target*size);
     tR = smoothstep(size/3. + intensity, size/3., tR);

     ld -= tL;
          rd -= tR;

    return vec2(ld + rd, shape);
}
float body(vec2 uv, vec2 pos,float seed){
 
    uv -= 0.5;
    uv.x *= u_resolution.x/u_resolution.y;
    
    uv += 0.5;
       uv -= pos;
	float angle = atan(uv.x,uv.y);
    float ns = noise11(angle*(5.0 * (uv.y - 1.0 + seed/22.)) + hash11(u_time/1111112.)*2. + 1.*12.);
    ns = noise11(50.0*ns - hash11(1.)*2.-1.*12. + length(pos)*112.);
    uv -= 0.5;
    uv.y *= 1.2;
    uv += 0.5;
float body = length(uv);
body = smoothstep(0.21 + ns/7.,0.2 + ns/7.,body);


return body;
}


vec3 unit(vec2 uv, vec2 pos , float size, vec2 target, vec3 bodyColor,float seed) {
  uv -= 0.5;
    uv *= 1.0 + seed/22. + 3.;
uv += 0.5;
   vec2 eyesCol  = eyes(uv, pos, 0.02, target, 0.01);

   vec3 col = body(uv,pos,seed)*colorB;
    col = mix(col, vec3(eyesCol.x), eyesCol.y);
    //  col = eyesCol;
    return col;
}

void main()
{
vec2 uv = fragCoord.xy / u_resolution.xy;
vec2 eyesUv = fragCoord.xy / u_resolution.xy;



vec2 m = vec2(0.0);


m = 1.0 - m;
m -= 0.5;


// uv *= 2.0;
// uv = fract(uv-1.);
vec3 col  = vec3(.0);


uv -= 0.5;
uv /= 0.25;
// uv += 0.5;

for(int i = 0; i < 12; i++){
    m.x = hash11(float(int(u_time/2. + float(i) )) + noise11(u_time/111112.)) - 0.5;
m.y = hash11(float(int(u_time/2.+ float(i))) - noise11(u_time/111112.)) - 0.5;
    vec2 pos = hash12(float(i) ) + 0.5 ;
    pos.x *= sin(u_time*1.1 + float(i) + noise11(u_time/2. + float(i)));
    pos.x /= noise11(u_time/2. + float(i));
    pos.y *= cos(u_time*1.1+ float(i)+ noise11(u_time/12. + float(i)));
    pos.y /= noise11(u_time/2. + float(i));
    pos = clamp(pos, -2.0, 1.7);
      if(i == 0){
       pos = vec2( 0.5);
       pos *= 4.;
    }
    vec3 unt = unit(uv, pos, 0.001, m,colorB,float(i)/12.);
  
    
    col += unt;
}
// vec2 pos = hash12(0.1234541);
//  col += unit(uv, pos, 0.1, m,colorB);

gl_FragColor = vec4(col,1.0);
}