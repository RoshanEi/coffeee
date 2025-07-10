'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Zap, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export function WebGL3DCoffee() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [coffeeLevel, setCoffeeLevel] = useState([75]);
  const [steamIntensity, setSteamIntensity] = useState([50]);
  const [coffeeColor, setCoffeeColor] = useState('#8B4513');
  
  // WebGL context and shader program
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const timeRef = useRef(0);

  // Vertex shader source
  const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec2 aTexCoord;
    
    uniform mat4 uModelMatrix;
    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform mat4 uNormalMatrix;
    uniform float uTime;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vTexCoord;
    varying float vWave;
    
    void main() {
      vec3 position = aPosition;
      
      // Add wave effect for coffee surface
      if (position.y > 0.5) {
        float wave = sin(position.x * 10.0 + uTime * 2.0) * 0.02 + 
                    cos(position.z * 8.0 + uTime * 1.5) * 0.015;
        position.y += wave;
        vWave = wave;
      } else {
        vWave = 0.0;
      }
      
      vec4 worldPosition = uModelMatrix * vec4(position, 1.0);
      gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;
      
      vNormal = normalize((uNormalMatrix * vec4(aNormal, 0.0)).xyz);
      vPosition = worldPosition.xyz;
      vTexCoord = aTexCoord;
    }
  `;

  // Fragment shader source
  const fragmentShaderSource = `
    precision mediump float;
    
    uniform vec3 uLightPosition;
    uniform vec3 uCameraPosition;
    uniform vec3 uCoffeeColor;
    uniform float uTime;
    uniform float uCoffeeLevel;
    uniform float uSteamIntensity;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vTexCoord;
    varying float vWave;
    
    // Noise function for steam effect
    float noise(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(uLightPosition - vPosition);
      vec3 viewDir = normalize(uCameraPosition - vPosition);
      vec3 reflectDir = reflect(-lightDir, normal);
      
      // Base coffee color with depth variation
      vec3 baseColor = uCoffeeColor;
      float depth = (vPosition.y + 1.0) * 0.5;
      baseColor = mix(baseColor * 0.6, baseColor, depth);
      
      // Lighting calculations
      float ambient = 0.3;
      float diffuse = max(dot(normal, lightDir), 0.0);
      float specular = pow(max(dot(viewDir, reflectDir), 0.0), 32.0) * 0.5;
      
      // Coffee surface effects
      if (vPosition.y > uCoffeeLevel - 0.1) {
        // Surface foam effect
        float foam = noise(vTexCoord * 20.0 + uTime * 0.1) * 0.3;
        baseColor = mix(baseColor, vec3(0.9, 0.8, 0.7), foam);
        
        // Wave highlights
        float waveHighlight = abs(vWave) * 2.0;
        specular += waveHighlight;
      }
      
      // Steam effect for upper regions
      if (vPosition.y > uCoffeeLevel + 0.2) {
        float steamNoise = noise(vTexCoord * 5.0 + uTime * 0.5) * uSteamIntensity * 0.01;
        float steamAlpha = smoothstep(uCoffeeLevel + 0.2, uCoffeeLevel + 0.8, vPosition.y);
        baseColor = mix(baseColor, vec3(1.0, 1.0, 1.0), steamNoise * steamAlpha);
      }
      
      vec3 finalColor = baseColor * (ambient + diffuse) + vec3(specular);
      
      // Add rim lighting
      float rim = 1.0 - max(dot(viewDir, normal), 0.0);
      rim = smoothstep(0.6, 1.0, rim);
      finalColor += vec3(0.3, 0.2, 0.1) * rim * 0.5;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  };

  const createProgram = (gl: WebGLRenderingContext): WebGLProgram | null => {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return null;
    
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  };

  const createCoffeeGeometry = () => {
    const vertices: number[] = [];
    const normals: number[] = [];
    const texCoords: number[] = [];
    const indices: number[] = [];
    
    const segments = 32;
    const rings = 16;
    
    // Generate coffee cup geometry
    for (let ring = 0; ring <= rings; ring++) {
      const y = (ring / rings) * 2 - 1; // -1 to 1
      const radius = 0.3 + (1 - Math.abs(y)) * 0.4; // Cup shape
      
      for (let segment = 0; segment <= segments; segment++) {
        const theta = (segment / segments) * Math.PI * 2;
        const x = Math.cos(theta) * radius;
        const z = Math.sin(theta) * radius;
        
        vertices.push(x, y, z);
        
        // Calculate normal
        const nx = Math.cos(theta);
        const nz = Math.sin(theta);
        normals.push(nx, 0, nz);
        
        // Texture coordinates
        texCoords.push(segment / segments, ring / rings);
      }
    }
    
    // Generate indices
    for (let ring = 0; ring < rings; ring++) {
      for (let segment = 0; segment < segments; segment++) {
        const current = ring * (segments + 1) + segment;
        const next = current + segments + 1;
        
        indices.push(current, next, current + 1);
        indices.push(next, next + 1, current + 1);
      }
    }
    
    return { vertices, normals, texCoords, indices };
  };

  const initWebGL = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
    
    glRef.current = gl;
    
    // Create shader program
    const program = createProgram(gl);
    if (!program) return;
    
    programRef.current = program;
    gl.useProgram(program);
    
    // Create geometry
    const geometry = createCoffeeGeometry();
    
    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.vertices), gl.STATIC_DRAW);
    
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);
    
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.texCoords), gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(geometry.indices), gl.STATIC_DRAW);
    
    // Get attribute and uniform locations
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    const aNormal = gl.getAttribLocation(program, 'aNormal');
    const aTexCoord = gl.getAttribLocation(program, 'aTexCoord');
    
    // Bind attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(aNormal);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.enableVertexAttribArray(aTexCoord);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    
    setIsLoaded(true);
  };

  const render = () => {
    const gl = glRef.current;
    const program = programRef.current;
    if (!gl || !program) return;
    
    timeRef.current += 0.016; // ~60fps
    
    // Clear canvas
    gl.clearColor(0.95, 0.95, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Set viewport
    const canvas = canvasRef.current;
    if (canvas) {
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    
    // Create matrices
    const modelMatrix = createModelMatrix();
    const viewMatrix = createViewMatrix();
    const projectionMatrix = createProjectionMatrix();
    const normalMatrix = createNormalMatrix(modelMatrix);
    
    // Set uniforms
    const uModelMatrix = gl.getUniformLocation(program, 'uModelMatrix');
    const uViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
    const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
    const uNormalMatrix = gl.getUniformLocation(program, 'uNormalMatrix');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uLightPosition = gl.getUniformLocation(program, 'uLightPosition');
    const uCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
    const uCoffeeColor = gl.getUniformLocation(program, 'uCoffeeColor');
    const uCoffeeLevel = gl.getUniformLocation(program, 'uCoffeeLevel');
    const uSteamIntensity = gl.getUniformLocation(program, 'uSteamIntensity');
    
    gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
    gl.uniformMatrix4fv(uNormalMatrix, false, normalMatrix);
    gl.uniform1f(uTime, timeRef.current);
    gl.uniform3f(uLightPosition, 2, 3, 2);
    gl.uniform3f(uCameraPosition, 0, 0, 3);
    
    // Convert hex color to RGB
    const r = parseInt(coffeeColor.slice(1, 3), 16) / 255;
    const g = parseInt(coffeeColor.slice(3, 5), 16) / 255;
    const b = parseInt(coffeeColor.slice(5, 7), 16) / 255;
    gl.uniform3f(uCoffeeColor, r, g, b);
    
    gl.uniform1f(uCoffeeLevel, (coffeeLevel[0] / 100) * 0.8 - 0.4);
    gl.uniform1f(uSteamIntensity, steamIntensity[0] / 100);
    
    // Draw
    gl.drawElements(gl.TRIANGLES, 32 * 16 * 6, gl.UNSIGNED_SHORT, 0);
    
    animationRef.current = requestAnimationFrame(render);
  };

  const createModelMatrix = (): Float32Array => {
    const matrix = new Float32Array(16);
    
    // Identity matrix
    matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
    
    // Apply rotations
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y + timeRef.current * 0.5);
    const sinY = Math.sin(rotation.y + timeRef.current * 0.5);
    
    // Rotation around Y axis
    matrix[0] = cosY;
    matrix[2] = sinY;
    matrix[8] = -sinY;
    matrix[10] = cosY;
    
    return matrix;
  };

  const createViewMatrix = (): Float32Array => {
    const matrix = new Float32Array(16);
    
    // Simple view matrix (camera at z=3, looking at origin)
    matrix[0] = 1; matrix[5] = 1; matrix[10] = 1; matrix[15] = 1;
    matrix[14] = -3; // Move camera back
    
    return matrix;
  };

  const createProjectionMatrix = (): Float32Array => {
    const matrix = new Float32Array(16);
    const canvas = canvasRef.current;
    if (!canvas) return matrix;
    
    const aspect = canvas.width / canvas.height;
    const fov = Math.PI / 4;
    const near = 0.1;
    const far = 100;
    
    const f = 1 / Math.tan(fov / 2);
    
    matrix[0] = f / aspect;
    matrix[5] = f;
    matrix[10] = (far + near) / (near - far);
    matrix[11] = -1;
    matrix[14] = (2 * far * near) / (near - far);
    
    return matrix;
  };

  const createNormalMatrix = (modelMatrix: Float32Array): Float32Array => {
    // Simplified normal matrix (just the rotation part)
    const matrix = new Float32Array(16);
    matrix[0] = modelMatrix[0]; matrix[1] = modelMatrix[1]; matrix[2] = modelMatrix[2];
    matrix[4] = modelMatrix[4]; matrix[5] = modelMatrix[5]; matrix[6] = modelMatrix[6];
    matrix[8] = modelMatrix[8]; matrix[9] = modelMatrix[9]; matrix[10] = modelMatrix[10];
    matrix[15] = 1;
    
    return matrix;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) { // Left mouse button
      const deltaX = e.movementX * 0.01;
      const deltaY = e.movementY * 0.01;
      
      setRotation(prev => ({
        x: prev.x + deltaY,
        y: prev.y + deltaX
      }));
    }
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setCoffeeLevel([75]);
    setSteamIntensity([50]);
  };

  useEffect(() => {
    initWebGL();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded) {
      render();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, rotation, coffeeLevel, steamIntensity, coffeeColor]);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-b from-cream to-white rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-coffee-brown mb-2 font-playfair">
          WebGL 3D Coffee Visualization
        </h2>
        <p className="text-coffee-dark">
          Interactive 3D coffee cup with realistic physics and lighting
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 3D Canvas */}
        <div className="lg:col-span-2">
          <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto cursor-grab active:cursor-grabbing"
              onMouseMove={handleMouseMove}
              style={{ touchAction: 'none' }}
            />
            
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-coffee-brown/20 border-t-coffee-brown rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-coffee-dark">Loading 3D Coffee...</p>
                </div>
              </div>
            )}
            
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              Drag to rotate
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-coffee-brown mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Coffee Controls
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coffee-dark mb-2">
                  Coffee Level: {coffeeLevel[0]}%
                </label>
                <Slider
                  value={coffeeLevel}
                  onValueChange={setCoffeeLevel}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-coffee-dark mb-2">
                  Steam Intensity: {steamIntensity[0]}%
                </label>
                <Slider
                  value={steamIntensity}
                  onValueChange={setSteamIntensity}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-coffee-dark mb-2">
                  Coffee Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={coffeeColor}
                    onChange={(e) => setCoffeeColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-coffee-dark">{coffeeColor}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-semibold text-coffee-brown mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Presets
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCoffeeColor('#8B4513');
                  setCoffeeLevel([75]);
                  setSteamIntensity([50]);
                }}
                className="text-xs"
              >
                Espresso
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCoffeeColor('#D2691E');
                  setCoffeeLevel([60]);
                  setSteamIntensity([30]);
                }}
                className="text-xs"
              >
                Latte
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCoffeeColor('#654321');
                  setCoffeeLevel([90]);
                  setSteamIntensity([70]);
                }}
                className="text-xs"
              >
                Americano
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCoffeeColor('#A0522D');
                  setCoffeeLevel([50]);
                  setSteamIntensity([80]);
                }}
                className="text-xs"
              >
                Cappuccino
              </Button>
            </div>
          </div>

          <Button
            onClick={resetView}
            className="w-full bg-coffee-brown hover:bg-coffee-dark text-cream"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset View
          </Button>

          <div className="bg-coffee-brown/10 p-4 rounded-lg">
            <h4 className="font-semibold text-coffee-brown mb-2">Features</h4>
            <ul className="text-sm text-coffee-dark space-y-1">
              <li>• Real-time 3D rendering</li>
              <li>• Dynamic lighting effects</li>
              <li>• Animated coffee waves</li>
              <li>• Steam particle simulation</li>
              <li>• Interactive controls</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}