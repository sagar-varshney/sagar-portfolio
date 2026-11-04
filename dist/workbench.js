import * as THREE from './assets/vendor/three.module.min.js';

// An original studio assemblage: independent pieces connected into one system.
const stage = document.getElementById('workbench-stage');
const canvas = document.getElementById('workbench-canvas');

if (stage && canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.14;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 30);
    camera.position.set(3.4, 2.55, 6.7);
    camera.lookAt(0, 0.14, 0);

    // Reflection cards are drawn locally rather than fetched as an HDR image.
    const environmentCanvas = document.createElement('canvas');
    environmentCanvas.width = 1024;
    environmentCanvas.height = 512;
    const ctx = environmentCanvas.getContext('2d');
    const studio = ctx.createLinearGradient(0, 0, 0, 512);
    studio.addColorStop(0, '#f8f7f1');
    studio.addColorStop(0.48, '#c0c0b7');
    studio.addColorStop(0.5, '#827f77');
    studio.addColorStop(1, '#e2ddd3');
    ctx.fillStyle = studio;
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(140, 30, 140, 260);
    ctx.fillRect(650, 65, 210, 160);
    ctx.fillStyle = '#383a38';
    ctx.fillRect(350, 80, 45, 280);
    ctx.fillStyle = '#f2b59a';
    ctx.fillRect(940, 180, 36, 160);
    const environment = new THREE.CanvasTexture(environmentCanvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const reflection = pmrem.fromEquirectangular(environment);
    scene.environment = reflection.texture;
    environment.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x938876, 3.2));
    const key = new THREE.DirectionalLight(0xfff9ee, 4.8);
    key.position.set(-3, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xe7f0f4, 2.8);
    rim.position.set(4, 3, -3);
    scene.add(rim);
    const bounce = new THREE.PointLight(0xffb59b, 2.8, 10);
    bounce.position.set(-3, 0.8, 3);
    scene.add(bounce);

    const chrome = new THREE.MeshPhysicalMaterial({color: 0xc7c9c7, metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.12});
    const graphite = new THREE.MeshPhysicalMaterial({color: 0x202a2c, metalness: 0.65, roughness: 0.23, clearcoat: 1, clearcoatRoughness: 0.22});
    const ivory = new THREE.MeshPhysicalMaterial({color: 0xf4efe4, metalness: 0.22, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.2});
    const copper = new THREE.MeshStandardMaterial({color: 0x9e7353, metalness: 0.88, roughness: 0.28});
    const coral = new THREE.MeshPhysicalMaterial({color: 0xee6841, emissive: 0xcf4927, emissiveIntensity: 0.09, metalness: 0.08, roughness: 0.19, clearcoat: 1});
    const inset = new THREE.MeshStandardMaterial({color: 0x697373, metalness: 0.7, roughness: 0.4});
    const glass = new THREE.MeshPhysicalMaterial({color: 0xfaf8ef, metalness: 0, roughness: 0.12, transmission: 0, transparent: true, opacity: 0.19, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false});

    const assembly = new THREE.Group();
    scene.add(assembly);
    const solid = new THREE.Group();
    assembly.add(solid);
    function mesh(geometry, material, parent, position = [0, 0, 0]) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...position);
      parent.add(object);
      return object;
    }
    function box(parent, material, width, height, depth, radius, position) {
      const shape = new THREE.Shape();
      const x = -width / 2, y = -height / 2, r = radius;
      shape.moveTo(x + r, y);
      shape.lineTo(x + width - r, y);
      shape.quadraticCurveTo(x + width, y, x + width, y + r);
      shape.lineTo(x + width, y + height - r);
      shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
      shape.lineTo(x + r, y + height);
      shape.quadraticCurveTo(x, y + height, x, y + height - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      const geometry = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelSegments: 4, bevelSize: Math.min(radius * 0.45, 0.07), bevelThickness: Math.min(depth / 3, 0.07), curveSegments: 12, steps: 1});
      geometry.translate(0, 0, -depth / 2);
      return mesh(geometry, material, parent, position);
    }
    function rod(start, end, radius = 0.018) {
      const a = new THREE.Vector3(...start), b = new THREE.Vector3(...end);
      const direction = b.clone().sub(a);
      const connector = mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 12), copper, solid);
      connector.position.copy(a.add(b).multiplyScalar(0.5));
      connector.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
      return connector;
    }

    const data = new THREE.Group();
    data.position.set(-1.06, 0.61, 0.03);
    data.rotation.set(0.03, -0.28, 0.08);
    solid.add(data);
    // Three stacked polished plates: a sculptural interpretation of stored data.
    for (let i = 0; i < 3; i++) {
      box(data, chrome, 0.84, 0.24, 0.72, 0.09, [0, (i - 1) * 0.30, 0]);
      box(data, i === 2 ? coral : inset, 0.17, 0.025, 0.015, 0.01, [-0.18, (i - 1) * 0.30, 0.405]);
      mesh(new THREE.SphereGeometry(0.018, 12, 8), i === 2 ? coral : graphite, data, [0.23, (i - 1) * 0.30, 0.404]);
    }

    const api = new THREE.Group();
    api.position.set(0.63, -0.52, 0.39);
    api.rotation.set(-0.09, 0.15, -0.13);
    solid.add(api);
    box(api, graphite, 0.88, 0.88, 0.80, 0.17, [0, 0, 0]);
    const port = mesh(new THREE.TorusGeometry(0.19, 0.032, 12, 56), chrome, api, [0, 0, 0.466]);
    mesh(new THREE.CircleGeometry(0.147, 40), graphite, api, [0, 0, 0.474]);
    box(api, coral, 0.07, 0.07, 0.018, 0.015, [0, 0, 0.49]);
    for (const side of [-1, 1]) box(api, inset, 0.09, 0.025, 0.012, 0.008, [side * 0.25, -0.26, 0.455]);

    const ui = new THREE.Group();
    ui.position.set(0.91, 0.92, -0.16);
    ui.rotation.set(-0.13, -0.10, 0.18);
    solid.add(ui);
    box(ui, ivory, 0.92, 0.91, 0.22, 0.12, [0, 0, 0]);
    for (let row = 0; row < 2; row++) for (let col = 0; col < 2; col++) {
      box(ui, row === 0 && col === 0 ? coral : chrome, 0.20, 0.20, 0.025, 0.035, [(col - 0.5) * 0.30, (0.5 - row) * 0.30, 0.165]);
    }

    // Warm brass connections keep the composition legible from every small turn.
    rod([-0.75, 0.48, 0.06], [0.02, 0.17, 0.04]);
    rod([0.06, 0.17, 0.04], [0.81, 0.73, -0.08]);
    rod([0.08, 0.12, 0.08], [0.59, -0.43, 0.34]);
    const core = mesh(new THREE.SphereGeometry(0.31, 48, 32), coral, solid, [0.01, 0.17, 0.05]);
    const coreBand = mesh(new THREE.TorusGeometry(0.36, 0.015, 12, 64), copper, solid, [0.01, 0.17, 0.05]);
    coreBand.rotation.set(0.7, 0.3, -0.3);

    const orbit = mesh(new THREE.TorusGeometry(1.68, 0.009, 8, 120), copper, assembly, [0, 0.04, 0]);
    orbit.scale.y = 0.63;
    orbit.rotation.set(-0.32, 0.16, -0.30);
    const orbitDot = mesh(new THREE.SphereGeometry(0.065, 24, 16), coral, assembly, [1.53, -0.39, 0.18]);
    const chromeDot = mesh(new THREE.SphereGeometry(0.095, 28, 20), chrome, assembly, [-1.59, -0.53, 0.16]);
    const pane = box(assembly, glass, 2.42, 1.68, 0.025, 0.06, [-0.03, -1.12, -0.06]);
    pane.rotation.set(-Math.PI / 2 + 0.15, 0.07, 0.14);
    // A local soft contact shadow anchors the floating arrangement to the page.
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    const gradient = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(72,60,45,.20)');
    gradient.addColorStop(0.45, 'rgba(72,60,45,.09)');
    gradient.addColorStop(1, 'rgba(72,60,45,0)');
    shadowCtx.fillStyle = gradient;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadow = mesh(new THREE.PlaneGeometry(4.6, 3.8), new THREE.MeshBasicMaterial({map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.8}), scene, [0, -1.25, 0]);
    shadow.rotation.x = -Math.PI / 2;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = document.documentElement.dataset.motion === 'paused';
    let visible = true, active = !document.hidden;
    let width = 0, height = 0, targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let lastFrame = 0, staticFrameNeeded = true;
    function render(now) {
      if (!width || !height) return;
      const time = now * 0.001;
      if (!reducedMotion.matches && !paused) {
        currentX += (targetX - currentX) * 0.035;
        currentY += (targetY - currentY) * 0.035;
        assembly.rotation.y = Math.sin(time * 0.17) * 0.09 + currentX * 0.18;
        assembly.rotation.x = currentY * 0.08;
        assembly.position.y = Math.sin(time * 0.7) * 0.035;
        core.rotation.y = time * 0.13;
      }
      renderer.render(scene, camera);
      stage.dataset.ready = 'true';
      staticFrameNeeded = false;
    }
    function resize() {
      const bounds = stage.getBoundingClientRect();
      width = Math.round(bounds.width);
      height = Math.round(bounds.height);
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = camera.aspect < 0.85 ? 7.4 : 6.7;
      camera.updateProjectionMatrix();
      render(performance.now());
    }
    new ResizeObserver(resize).observe(stage);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      staticFrameNeeded = true;
    }, {rootMargin: '80px'}).observe(stage);
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || paused || reducedMotion.matches) return;
      const rect = stage.getBoundingClientRect();
      targetX = THREE.MathUtils.clamp((event.clientX - rect.left - rect.width / 2) / rect.width, -0.7, 0.7);
      targetY = THREE.MathUtils.clamp((event.clientY - rect.top - rect.height / 2) / rect.height, -0.6, 0.6);
    }, {passive: true});
    window.addEventListener('blur', () => {targetX = 0; targetY = 0;});
    window.addEventListener('portfolio:motion', event => {
      paused = Boolean(event.detail?.paused);
      staticFrameNeeded = true;
    });
    document.addEventListener('visibilitychange', () => {
      active = !document.hidden;
      staticFrameNeeded = true;
    });
    reducedMotion.addEventListener('change', () => {staticFrameNeeded = true;});
    renderer.setAnimationLoop(now => {
      if (!visible || !active || now - lastFrame < 1000 / 30) return;
      if ((paused || reducedMotion.matches) && !staticFrameNeeded) return;
      lastFrame = now;
      render(now);
    });
    resize();
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      stage.dataset.ready = 'false';
      canvas.style.visibility = 'hidden';
    });
  } catch (error) {
    canvas.style.display = 'none';
    stage.dataset.ready = 'false';
    console.info('3D enhancement unavailable; showing the studio illustration.');
  }
}
