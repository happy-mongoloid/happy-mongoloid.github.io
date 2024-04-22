 
 
 
 
 
 
 varying vec2 fragCoord;
       uniform vec2 u_resolution;

      void main () {
        fragCoord = uv*u_resolution.xy;
        // fragCoord;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0)/12.0;
      }