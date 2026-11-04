import * as THREE from './assets/vendor/three.module.min.js';

// SIGNAL / an original locally constructed orbital sculpture and lunar scene.
const container = document.getElementById('hero-scene');
const canvas = document.getElementById('orbit-canvas');

if (container && canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.23;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.5, 9);
    camera.lookAt(0, 0.4, 0);

    const reflectionCanvas = document.createElement('canvas');
    reflectionCanvas.width = 1024;
    reflectionCanvas.height = 512;
    const context = reflectionCanvas.getContext('2d');
    context.fillStyle = '#0b1119';
    context.fillRect(0, 0, 1024, 512);
    const studio = context.createLinearGradient(0, 0, 0, 512);
    studio.addColorStop(0, '#65717c');
    studio.addColorStop(0.40, '#151b26');
    studio.addColorStop(1, '#030609');
    context.fillStyle = studio;
    context.fillRect(0, 0, 1024, 512);
    context.fillStyle = '#eff5f4';
    context.fillRect(120, 40, 65, 300);
    context.fillRect(260, 34, 195, 20);
    context.fillRect(820, 75, 110, 210);
    context.fillStyle = '#a7e1e7';
    context.fillRect(610, 80, 26, 250);
    const environment = new THREE.CanvasTexture(reflectionCanvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const reflection = pmrem.fromEquirectangular(environment);
    scene.environment = reflection.texture;
    environment.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0x9ebfd6, 0x05080b, 1.35));
    const key = new THREE.DirectionalLight(0xe7eff9, 3.6);
    key.position.set(-3, 6, 5);
    scene.add(key);
    const edge = new THREE.DirectionalLight(0xadf0e9, 4.7);
    edge.position.set(5, 3, -4);
    scene.add(edge);
    const warm = new THREE.PointLight(0xbad19c, 8, 12, 2);
    warm.position.set(5, -0.5, 3);
    scene.add(warm);
    const accentLight = new THREE.PointLight(0x93e7df, 6, 6, 2);
    scene.add(accentLight);

    const chrome = new THREE.MeshPhysicalMaterial({color: 0xa5b3bd, metalness: 1, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.13});
    const facet = new THREE.MeshPhysicalMaterial({color: 0x303b4a, metalness: 1, roughness: 0.22, flatShading: true, iridescence: 0.7, iridescenceIOR: 1.35, iridescenceThicknessRange: [130, 360], clearcoat: 1});
    const obsidian = new THREE.MeshPhysicalMaterial({color: 0x050a10, metalness: 0.6, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.12});
    const accent = new THREE.MeshStandardMaterial({color: 0xa5eee0, emissive: 0x7ce5d1, emissiveIntensity: 1.6, metalness: 0.5, roughness: 0.3});
    const secondary = new THREE.MeshStandardMaterial({color: 0xc9e87f, emissive: 0x9dbd4a, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.35});
    const assembly = new THREE.Group();
    scene.add(assembly);
    const rotor = new THREE.Group();
    assembly.add(rotor);
    const mesh = (geometry, material, parent, position = [0, 0, 0]) => {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...position);
      parent.add(object);
      return object;
    };
    const ring = (parent, radius, tube, material, position = [0, 0, 0], rotation = [0, 0, 0], arc = Math.PI * 2) => {
      const object = mesh(new THREE.TorusGeometry(radius, tube, 12, 100, arc), material, parent, position);
      object.rotation.set(...rotation);
      return object;
    };

    // A faceted dark lens, fractured out of a complete chrome orbital shell.
    mesh(new THREE.IcosahedronGeometry(1.22, 2), facet, rotor);
    const lens = new THREE.Group();
    lens.position.z = 1.23;
    rotor.add(lens);
    mesh(new THREE.CircleGeometry(0.82, 72), obsidian, lens, [0, 0, 0.03]);
    ring(lens, 0.84, 0.044, chrome, [0, 0, 0.04]);
    ring(lens, 0.73, 0.009, accent, [0, 0, 0.068]);
    ring(lens, 0.94, 0.015, chrome, [0, 0, -0.06]);
    for (let i = 0; i < 48; i++) {
      const angle = i / 48 * Math.PI * 2;
      const mark = mesh(new THREE.BoxGeometry(i % 4 === 0 ? 0.013 : 0.007, i % 4 === 0 ? 0.055 : 0.027, 0.012), i % 12 === 0 ? accent : chrome, lens, [Math.sin(angle) * 0.90, Math.cos(angle) * 0.90, 0.04]);
      mark.rotation.z = -angle;
    }
    const insigniaCanvas = document.createElement('canvas');
    insigniaCanvas.width = 512;
    insigniaCanvas.height = 256;
    const insigniaContext = insigniaCanvas.getContext('2d');
    const insigniaTexture = new THREE.CanvasTexture(insigniaCanvas);
    insigniaTexture.colorSpace = THREE.SRGBColorSpace;
    mesh(new THREE.PlaneGeometry(1.03, 0.515), new THREE.MeshBasicMaterial({map: insigniaTexture, transparent: true, depthWrite: false, toneMapped: false}), lens, [0, 0.035, 0.08]);
    const signalStrip = mesh(new THREE.BoxGeometry(0.22, 0.017, 0.014), accent, lens, [0, -0.38, 0.08]);
    for (const [r, tube, rot, arc] of [
      [1.54, 0.065, [0.30, 0.52, 0.52], Math.PI * 1.18],
      [1.73, 0.048, [1.30, 0.32, -0.65], Math.PI * 1.38],
      [1.92, 0.023, [-0.20, 1.10, 1.70], Math.PI * 1.26],
    ]) ring(rotor, r, tube, chrome, [0, 0, 0], rot, arc);
    ring(rotor, 1.60, 0.012, accent, [0, 0, 0], [0.32, 0.54, 0.52], Math.PI * 0.29);
    ring(rotor, 2.05, 0.005, chrome, [0, 0, 0], [0.33, -0.30, 0.15]);
    const satelliteA = mesh(new THREE.IcosahedronGeometry(0.23, 0), chrome, assembly, [1.82, 1.38, 0.10]);
    const satelliteB = new THREE.Group();
    satelliteB.position.set(-1.65, -0.71, 0.3);
    satelliteB.rotation.set(0.5, 0.5, 0.3);
    assembly.add(satelliteB);
    ring(satelliteB, 0.24, 0.04, chrome);
    mesh(new THREE.SphereGeometry(0.065, 20, 16), secondary, satelliteB);

    // The actual horizon is a displaced sphere, with locally generated craters.
    let seed = 27011;
    const random = () => {seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646;};
    const planetRadius = 18.8;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 256, 144);
    // Turn the UV pole away first, then form relief on the visible upper surface.
    planetGeometry.rotateZ(Math.PI / 2);
    const craterCenters = Array.from({length: 26}, () => ({
      direction: new THREE.Vector3((random() - 0.5) * 1.3, 1, random() * 0.85 + 0.08).normalize(),
      radius: 0.018 + random() * 0.052,
      depth: 0.07 + random() * 0.09,
    }));
    const positions = planetGeometry.attributes.position;
    const normal = new THREE.Vector3();
    for (let i = 0; i < positions.count; i++) {
      normal.fromBufferAttribute(positions, i).normalize();
      let height = (Math.sin(normal.x * 53 + normal.y * 23) * Math.cos(normal.z * 47 - normal.y * 19) + Math.sin(normal.x * 113 + normal.z * 91) * 0.24) * 0.030;
      for (const crater of craterCenters) {
        const irregularity = 1 + Math.sin(normal.x * 129 + normal.z * 173) * 0.09;
        const distance = Math.acos(THREE.MathUtils.clamp(normal.dot(crater.direction), -1, 1)) / (crater.radius * irregularity);
        if (distance < 1.3) height += distance < 0.9 ? -Math.pow(1 - distance / 0.9, 1.6) * crater.depth : Math.exp(-Math.pow((distance - 1.0) * 7, 2)) * crater.depth * 0.24;
      }
      positions.setXYZ(i, normal.x * (planetRadius + height), normal.y * (planetRadius + height), normal.z * (planetRadius + height));
    }
    planetGeometry.computeVertexNormals();
    const terrainCanvas = document.createElement('canvas');
    terrainCanvas.width = 2048;
    terrainCanvas.height = 1024;
    const terrainContext = terrainCanvas.getContext('2d');
    terrainContext.fillStyle = '#777674';
    terrainContext.fillRect(0, 0, 2048, 1024);
    // Layer deterministic noise at several scales instead of repeating ring stamps.
    for (const [noiseWidth, noiseHeight, opacity] of [[12, 6, 0.28], [48, 24, 0.26], [160, 80, 0.22], [512, 256, 0.15], [1024, 512, 0.09]]) {
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = noiseWidth;
      noiseCanvas.height = noiseHeight;
      const noiseContext = noiseCanvas.getContext('2d');
      const pixels = noiseContext.createImageData(noiseWidth, noiseHeight);
      for (let i = 0; i < pixels.data.length; i += 4) {
        const value = Math.floor(35 + random() * 170);
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
      noiseContext.putImageData(pixels, 0, 0);
      terrainContext.globalAlpha = opacity;
      terrainContext.drawImage(noiseCanvas, 0, 0, 2048, 1024);
    }
    terrainContext.globalAlpha = 1;
    // Sparse eroded depressions: irregular edges, gentle shading, no outlined rims.
    for (let i = 0; i < 44; i++) {
      const x = random() * 2048, y = random() * 1024;
      const radius = 12 + Math.pow(random(), 2) * 72;
      const relief = terrainContext.createRadialGradient(x - radius * 0.20, y + radius * 0.15, radius * 0.1, x, y, radius);
      relief.addColorStop(0, 'rgba(43,42,40,.28)');
      relief.addColorStop(0.58, 'rgba(69,68,65,.16)');
      relief.addColorStop(0.88, 'rgba(147,145,139,.08)');
      relief.addColorStop(1, 'rgba(119,118,116,0)');
      terrainContext.fillStyle = relief;
      terrainContext.beginPath();
      for (let point = 0; point <= 16; point++) {
        const angle = point / 16 * Math.PI * 2;
        const boundary = radius * (0.80 + random() * 0.20);
        const px = x + Math.cos(angle) * boundary, py = y + Math.sin(angle) * boundary * 0.86;
        if (point === 0) terrainContext.moveTo(px, py);
        else terrainContext.lineTo(px, py);
      }
      terrainContext.closePath();
      terrainContext.fill();
    }
    const terrainTexture = new THREE.CanvasTexture(terrainCanvas);
    terrainTexture.colorSpace = THREE.SRGBColorSpace;
    terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set(4, 2);
    terrainTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    const planet = mesh(planetGeometry, new THREE.MeshStandardMaterial({color: 0x535353, map: terrainTexture, bumpMap: terrainTexture, bumpScale: 0.032, roughness: 1, metalness: 0.0}), scene, [0, -19.5, -5]);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: {tint: {value: new THREE.Color(0x7fcad4)}},
      vertexShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){ vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}',
      fragmentShader: 'uniform vec3 tint; varying vec3 vNormal; varying vec3 vPosition; void main(){float f=pow(1.-max(0.,dot(normalize(vNormal),normalize(-vPosition))),8.);gl_FragColor=vec4(tint,f*.16);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const atmosphere = mesh(new THREE.SphereGeometry(planetRadius + 0.08, 96, 64), atmosphereMaterial, scene, [0, -19.5, -5]);

    const starPositions = new Float32Array(360 * 3);
    const starColors = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      starPositions[i * 3] = (random() - 0.5) * 65;
      starPositions[i * 3 + 1] = random() * 25 - 5;
      starPositions[i * 3 + 2] = -12 - random() * 25;
      const lightness = 0.22 + random() * 0.43;
      starColors[i * 3] = lightness * 0.85;
      starColors[i * 3 + 1] = lightness * 0.94;
      starColors[i * 3 + 2] = lightness;
    }
    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const stars = new THREE.Points(starsGeometry, new THREE.PointsMaterial({size: 0.035, transparent: true, opacity: 0.7, vertexColors: true, sizeAttenuation: true, depthWrite: false}));
    scene.add(stars);

    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = document.documentElement.dataset.motion === 'paused';
    let visible = true, active = !document.hidden, width = 0, height = 0;
    let dragging = false, pointerId = null, startX = 0, startY = 0, lastX = 0, lastY = 0;
    let yaw = 0, pitch = 0, desiredYaw = 0, desiredPitch = 0, velocity = 0;
    let cursorX = 0, cursorY = 0, smoothX = 0, smoothY = 0, lastFrame = 0;
    let needsStaticFrame = true;
    const sceneAccent = color => {
      if (!/^#[\da-f]{3}([\da-f]{3})?$/i.test(color || '')) return;
      accent.color.set(color);
      accent.emissive.set(color);
      // Keep the terrain's key rim neutral while the signal accents change.
      edge.color.set(0xbadce7);
      accentLight.color.set(color);
      atmosphereMaterial.uniforms.tint.value.set(color);
      needsStaticFrame = true;
    };
    const sceneProjects = {
      taskboard: {insignia: 'TB', label: 'TASKBOARD', accent: '#87e8ee'},
      flow: {insignia: 'BA', label: 'BRIEFACTIONS', accent: '#b5a0ff'},
    };
    function selectProject(project) {
      const selected = sceneProjects[project];
      if (!selected) return;
      insigniaContext.clearRect(0, 0, 512, 256);
      insigniaContext.fillStyle = '#f4f6ee';
      insigniaContext.textAlign = 'center';
      insigniaContext.textBaseline = 'middle';
      insigniaContext.font = '700 158px Arial, Helvetica, sans-serif';
      insigniaContext.fillText(selected.insignia, 256, 105);
      insigniaContext.font = '500 23px Arial, Helvetica, sans-serif';
      insigniaContext.fillStyle = '#b9c8ce';
      insigniaContext.fillText(selected.label, 256, 216);
      insigniaTexture.needsUpdate = true;
      sceneAccent(selected.accent);
      needsStaticFrame = true;
    }
    selectProject(document.documentElement.dataset.project || 'taskboard');
    sceneAccent(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const mobile = width < 760;
      assembly.position.set(mobile ? 0 : 2.32, mobile ? -0.70 : 0.38, 0);
      assembly.scale.setScalar(mobile ? THREE.MathUtils.clamp(camera.aspect * 1.32, 0.45, 0.76) : Math.min(1.10, camera.aspect / 1.60));
      planet.position.y = atmosphere.position.y = mobile ? -20.4 : -19.5;
      render(performance.now());
    }
    function render(now) {
      if (!width || !height) return;
      const time = now * 0.001;
      const animated = !paused && !reduced.matches;
      yaw += (desiredYaw - yaw) * (animated ? 0.075 : 1);
      pitch += (desiredPitch - pitch) * (animated ? 0.075 : 1);
      if (animated) {
        smoothX += (cursorX - smoothX) * 0.025;
        smoothY += (cursorY - smoothY) * 0.025;
        if (!dragging && Math.abs(velocity) > 0.0001) {desiredYaw += velocity; velocity *= 0.94;}
        rotor.rotation.set(0.12 + pitch + smoothY * 0.09, -0.23 + yaw + smoothX * 0.13 + Math.sin(time * 0.20) * 0.04, -0.13);
        satelliteA.rotation.set(time * 0.14, time * 0.19, 0.3);
        satelliteB.rotation.y = 0.5 + time * 0.16;
        stars.rotation.y = Math.sin(time * 0.018) * 0.005;
        signalStrip.material.emissiveIntensity = 1.4 + Math.sin(time * 1.5) * 0.15;
      } else rotor.rotation.set(0.12 + pitch, -0.23 + yaw, -0.13);
      accentLight.position.copy(assembly.position).add(new THREE.Vector3(-0.5, 0.4, 2));
      renderer.render(scene, camera);
      container.dataset.ready = 'true';
      needsStaticFrame = false;
    }
    canvas.style.touchAction = 'pan-y';
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      startX = lastX = event.clientX;
      startY = lastY = event.clientY;
      velocity = 0;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      if (event.pointerType === 'touch' && Math.abs(event.clientY - startY) > Math.abs(event.clientX - startX) + 9) {stopDrag(); return;}
      desiredYaw += dx * 0.006;
      desiredPitch = THREE.MathUtils.clamp(desiredPitch + dy * 0.003, -0.42, 0.42);
      velocity = dx * 0.0022;
      lastX = event.clientX;
      lastY = event.clientY;
      needsStaticFrame = true;
      if (paused || reduced.matches) render(performance.now());
    });
    function stopDrag() {
      if (pointerId !== null && canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
      dragging = false;
      pointerId = null;
      canvas.style.cursor = 'grab';
      needsStaticFrame = true;
    }
    canvas.addEventListener('pointerup', stopDrag);
    canvas.addEventListener('pointercancel', stopDrag);
    canvas.addEventListener('lostpointercapture', () => {dragging = false; pointerId = null; canvas.style.cursor = 'grab';});
    window.addEventListener('pointermove', event => {
      if (dragging || paused || reduced.matches || event.pointerType === 'touch') return;
      const bounds = container.getBoundingClientRect();
      cursorX = THREE.MathUtils.clamp((event.clientX - bounds.left - bounds.width / 2) / bounds.width, -0.7, 0.7);
      cursorY = THREE.MathUtils.clamp((event.clientY - bounds.top - bounds.height / 2) / bounds.height, -0.5, 0.5);
    }, {passive: true});
    window.addEventListener('portfolio:scene', event => {
      const {action, accent: color, project} = event.detail || {};
      if (action === 'next') desiredYaw += Math.PI / 4;
      if (action === 'prev') desiredYaw -= Math.PI / 4;
      if (action === 'reset') {desiredYaw = 0; desiredPitch = 0; velocity = 0;}
      if (project) selectProject(project);
      if (color) sceneAccent(color);
      needsStaticFrame = true;
      if (paused || reduced.matches) render(performance.now());
    });
    window.addEventListener('portfolio:motion', event => {paused = Boolean(event.detail?.paused); velocity = 0; needsStaticFrame = true;});
    document.addEventListener('visibilitychange', () => {active = !document.hidden; needsStaticFrame = true;});
    reduced.addEventListener('change', () => {needsStaticFrame = true; velocity = 0;});
    new ResizeObserver(resize).observe(container);
    new IntersectionObserver(entries => {visible = entries[0].isIntersecting; needsStaticFrame = true;}, {rootMargin: '80px'}).observe(container);
    renderer.setAnimationLoop(now => {
      if (!visible || !active || now - lastFrame < 1000 / 32) return;
      if ((paused || reduced.matches) && !needsStaticFrame) return;
      lastFrame = now;
      render(now);
    });
    resize();
    canvas.addEventListener('webglcontextlost', event => {event.preventDefault(); renderer.setAnimationLoop(null); container.dataset.ready = 'false'; canvas.style.visibility = 'hidden';});
  } catch (error) {
    canvas.style.display = 'none';
    container.dataset.ready = 'false';
    console.info('Orbital enhancement unavailable; showing the static scene.');
  }
}
