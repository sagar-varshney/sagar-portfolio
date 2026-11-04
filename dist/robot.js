import * as THREE from './assets/vendor/three.module.min.js';

// Original procedural character. Geometry, lighting and reflection cards are local.
const stage = document.getElementById('robot-stage');
const canvas = document.getElementById('robot-canvas');

if (stage && canvas) {
  try {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 40);
    camera.position.set(0, 0.8, 9.1);
    camera.lookAt(0, 0.65, 0);

    // Softbox cards produce readable curved reflections without a remote HDRI.
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d');
    ctx.fillStyle = '#111b1e';
    ctx.fillRect(0, 0, 1024, 512);
    const halo = ctx.createLinearGradient(0, 0, 0, 512);
    halo.addColorStop(0, '#465458');
    halo.addColorStop(0.42, '#1a2427');
    halo.addColorStop(1, '#030506');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, 1024, 512);
    const card = (x, y, w, h, color, blur) => {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    };
    card(170, 55, 115, 300, '#e3eeed', 25);
    card(650, 90, 65, 270, '#5bd9e5', 30);
    card(850, 80, 145, 220, '#bcccd2', 35);
    card(350, 38, 220, 24, '#ebf5ee', 22);
    card(40, 250, 25, 120, '#d48c64', 22);
    const environment = new THREE.CanvasTexture(envCanvas);
    environment.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const reflection = pmrem.fromEquirectangular(environment);
    scene.environment = reflection.texture;
    environment.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xadd8df, 0x0a0f15, 2.3));
    const softbox = new THREE.DirectionalLight(0xe9f2ef, 4.2);
    softbox.position.set(-3, 5, 5);
    scene.add(softbox);
    const cyanRim = new THREE.DirectionalLight(0x40d9e7, 3.2);
    cyanRim.position.set(4, 2, -3);
    scene.add(cyanRim);
    const backlight = new THREE.DirectionalLight(0xa4b7c9, 3);
    backlight.position.set(-3, 4, -4);
    scene.add(backlight);
    const fill = new THREE.PointLight(0xf7a773, 9, 15, 2);
    fill.position.set(-3, -1, 4);
    scene.add(fill);

    const metal = new THREE.MeshPhysicalMaterial({ color: 0x5e686c, metalness: 0.96, roughness: 0.19, clearcoat: 1, clearcoatRoughness: 0.12 });
    const pearl = new THREE.MeshPhysicalMaterial({ color: 0x9aa6a7, metalness: 0.92, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.16 });
    const dark = new THREE.MeshPhysicalMaterial({ color: 0x050a0e, metalness: 0.55, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x11181b, metalness: 0.25, roughness: 0.6 });
    const blackChrome = new THREE.MeshPhysicalMaterial({ color: 0x17262c, metalness: 1, roughness: 0.16, clearcoat: 1 });
    const cyan = new THREE.MeshStandardMaterial({ color: 0x7ae9eb, emissive: 0x3ce5ec, emissiveIntensity: 2.6, roughness: 0.35, metalness: 0.3 });
    const subtleCyan = new THREE.MeshStandardMaterial({ color: 0x4ba1ad, emissive: 0x198b9d, emissiveIntensity: 0.65, roughness: 0.4, metalness: 0.75 });

    const robot = new THREE.Group();
    robot.rotation.y = -0.19;
    scene.add(robot);

    const sphereGeo = new THREE.SphereGeometry(1, 48, 32);
    const capsule = (radius, length) => new THREE.CapsuleGeometry(radius, Math.max(0.01, length - radius * 2), 8, 20);
    function mesh(geometry, material, parent, position = [0, 0, 0], scale = [1, 1, 1]) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(...position);
      object.scale.set(...scale);
      parent.add(object);
      return object;
    }
    function ellipsoid(parent, material, position, scale) { return mesh(sphereGeo, material, parent, position, scale); }
    function cylinder(parent, material, r1, r2, height, position, rotation = [0, 0, 0]) {
      const object = mesh(new THREE.CylinderGeometry(r1, r2, height, 40), material, parent, position);
      object.rotation.set(...rotation);
      return object;
    }
    function roundedBox(parent, material, w, h, d, radius, position) {
      const shape = new THREE.Shape();
      const x = -w / 2, y = -h / 2, r = radius;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: Math.min(0.035, radius / 2), bevelThickness: Math.min(0.035, d / 3), curveSegments: 14 });
      geometry.translate(0, 0, -d / 2);
      return mesh(geometry, material, parent, position);
    }
    const torus = (parent, material, radius, tube, pos, rotation = [0, 0, 0]) => {
      const ring = mesh(new THREE.TorusGeometry(radius, tube, 10, 64), material, parent, pos);
      ring.rotation.set(...rotation);
      return ring;
    };

    // A continuous tapered lathed torso gives the shell automotive reflections.
    const profile = [[0.0, -0.58], [0.25, -0.58], [0.36, -0.52], [0.47, -0.26], [0.65, 0.13], [0.73, 0.44], [0.65, 0.60], [0.44, 0.72], [0.26, 0.74], [0.0, 0.74]].map(([r, y]) => new THREE.Vector2(r, y));
    const torso = mesh(new THREE.LatheGeometry(profile, 80), metal, robot, [0, 0.87, 0], [1, 1, 0.63]);
    ellipsoid(robot, blackChrome, [0, 1.02, 0.36], [0.52, 0.44, 0.14]);
    roundedBox(robot, pearl, 0.5, 0.06, 0.04, 0.025, [0, 1.46, 0.33]);
    roundedBox(robot, subtleCyan, 0.24, 0.025, 0.025, 0.01, [0, 1.47, 0.36]);
    const core = cylinder(robot, rubber, 0.105, 0.105, 0.035, [0, 0.94, 0.499], [Math.PI / 2, 0, 0]);
    torus(robot, cyan, 0.066, 0.009, [0, 0.94, 0.527]);
    mesh(new THREE.CircleGeometry(0.04, 24), blackChrome, robot, [0, 0.94, 0.53]);
    for (let side of [-1, 1]) {
      const seam = roundedBox(robot, rubber, 0.018, 0.52, 0.018, 0.007, [side * 0.43, 0.83, 0.34]);
      seam.rotation.z = side * -0.37;
      for (let i = 0; i < 3; i++) roundedBox(robot, rubber, 0.07, 0.012, 0.01, 0.004, [side * 0.31, 1.19 - i * 0.032, 0.489]);
    }
    // Neck and flexible abdominal section.
    cylinder(robot, rubber, 0.19, 0.24, 0.32, [0, 1.7, 0]);
    for (let i = 0; i < 4; i++) cylinder(robot, i === 3 ? pearl : blackChrome, 0.215, 0.215, 0.035, [0, 1.61 + i * 0.07, 0]);
    cylinder(robot, rubber, 0.27, 0.36, 0.43, [0, 0.14, -0.02]);
    for (let i = 0; i < 5; i++) cylinder(robot, blackChrome, 0.29 + i * 0.009, 0.29 + i * 0.009, 0.028, [0, 0.0 + i * 0.075, -0.02]);
    ellipsoid(robot, metal, [0, -0.25, 0], [0.46, 0.3, 0.32]);
    roundedBox(robot, blackChrome, 0.39, 0.23, 0.12, 0.08, [0, -0.25, 0.29]);

    const head = new THREE.Group();
    head.position.set(0, 2.22, 0);
    robot.add(head);
    ellipsoid(head, pearl, [0, 0, 0], [0.51, 0.62, 0.45]);
    // Single sweeping visor with a lower jaw visible below it.
    const visor = roundedBox(head, dark, 0.76, 0.56, 0.13, 0.20, [0, 0.045, 0.366]);
    visor.rotation.x = -0.025;
    ellipsoid(head, blackChrome, [0, -0.3, 0.285], [0.28, 0.18, 0.16]);
    for (let side of [-1, 1]) {
      cylinder(head, rubber, 0.155, 0.155, 0.095, [side * 0.49, 0.0, 0], [0, 0, Math.PI / 2]);
      cylinder(head, metal, 0.12, 0.12, 0.105, [side * 0.51, 0.0, 0], [0, 0, Math.PI / 2]);
      torus(head, subtleCyan, 0.075, 0.009, [side * 0.566, 0.0, 0], [0, Math.PI / 2, 0]);
      // Dot-matrix eyes feel expressive without moving UI artwork.
      for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) {
        const x = side * 0.175 + (col - 2) * 0.029;
        const y = 0.067 + (1 - row) * 0.029 + Math.cos((col - 2) / 2) * 0.014;
        ellipsoid(head, cyan, [x, y, 0.49], [0.011, 0.011, 0.008]);
      }
      roundedBox(head, pearl, 0.022, 0.14, 0.026, 0.008, [side * 0.335, -0.326, 0.33]);
    }
    roundedBox(head, blackChrome, 0.12, 0.012, 0.015, 0.004, [0, -0.37, 0.428]);

    const arms = [];
    const fingerGroups = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.8, 1.34, 0);
      arm.rotation.z = side * 0.19;
      arm.rotation.x = -0.055;
      robot.add(arm);
      ellipsoid(arm, rubber, [0, -0.04, 0], [0.27, 0.27, 0.27]);
      ellipsoid(arm, pearl, [side * 0.07, 0.01, 0], [0.31, 0.29, 0.30]);
      // Recessed outside shoulder pivot.
      cylinder(arm, blackChrome, 0.13, 0.13, 0.03, [side * 0.32, 0, 0], [0, 0, Math.PI / 2]);
      torus(arm, subtleCyan, 0.083, 0.007, [side * 0.34, 0.0, 0], [0, Math.PI / 2, 0]);
      mesh(capsule(0.19, 0.74), metal, arm, [0, -0.46, 0], [1, 1, 0.92]);
      roundedBox(arm, blackChrome, 0.16, 0.37, 0.06, 0.05, [0, -0.46, 0.16]);
      ellipsoid(arm, rubber, [0, -0.86, 0], [0.19, 0.19, 0.19]);
      cylinder(arm, metal, 0.125, 0.125, 0.40, [0, -0.86, 0], [0, 0, Math.PI / 2]);
      const forearm = new THREE.Group();
      forearm.position.set(0, -0.87, 0);
      forearm.rotation.x = -0.42;
      arm.add(forearm);
      mesh(capsule(0.19, 0.67), pearl, forearm, [0, -0.35, 0], [1, 1, 0.85]);
      roundedBox(forearm, blackChrome, 0.18, 0.29, 0.045, 0.04, [0, -0.34, 0.168]);
      roundedBox(forearm, subtleCyan, 0.06, 0.014, 0.015, 0.005, [0, -0.23, 0.202]);
      cylinder(forearm, rubber, 0.118, 0.118, 0.12, [0, -0.7, 0]);
      const hand = new THREE.Group();
      hand.position.set(0, -0.83, 0);
      forearm.add(hand);
      roundedBox(hand, metal, 0.28, 0.27, 0.15, 0.065, [0, 0, 0]);
      roundedBox(hand, blackChrome, 0.18, 0.16, 0.025, 0.035, [0, 0.015, 0.093]);
      for (let finger = 0; finger < 4; finger++) {
        const joint = new THREE.Group();
        joint.position.set((finger - 1.5) * 0.069, -0.15, 0.015);
        joint.rotation.x = -0.26 - finger * 0.03;
        hand.add(joint);
        const length = finger === 3 ? 0.13 : 0.16;
        ellipsoid(joint, blackChrome, [0, 0, 0], [0.035, 0.04, 0.04]);
        mesh(capsule(0.027, length), metal, joint, [0, -length / 2 - 0.015, 0]);
        const tip = new THREE.Group();
        tip.position.set(0, -length - 0.015, 0);
        tip.rotation.x = -0.5;
        joint.add(tip);
        mesh(capsule(0.025, 0.11), metal, tip, [0, -0.05, 0]);
        fingerGroups.push(joint);
      }
      const thumb = mesh(capsule(0.044, 0.20), metal, hand, [side * -0.18, -0.065, 0.035]);
      thumb.rotation.z = side * -0.5;
      thumb.rotation.x = -0.45;
      arms.push(arm);
      // Legs fall below the fold, leaving the upper-body composition intentional.
      ellipsoid(robot, rubber, [side * 0.29, -0.51, 0], [0.23, 0.23, 0.23]);
      const thigh = mesh(capsule(0.245, 0.96), metal, robot, [side * 0.3, -1.00, 0], [1, 1, 0.92]);
      thigh.rotation.z = side * 0.04;
      roundedBox(robot, blackChrome, 0.26, 0.60, 0.05, 0.09, [side * 0.3, -0.99, 0.222]);
      ellipsoid(robot, rubber, [side * 0.32, -1.52, 0], [0.205, 0.205, 0.205]);
      ellipsoid(robot, pearl, [side * 0.32, -1.51, 0.14], [0.18, 0.18, 0.12]);
      mesh(capsule(0.19, 0.83), metal, robot, [side * 0.33, -2.0, 0], [1, 1, 0.85]);
    }

    let width = 0, height = 0, visible = true, active = !document.hidden;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Maintain full shoulders on narrow screens without shrinking the character.
      camera.position.z = camera.aspect < 0.7 ? 10.2 : 9.1;
      camera.updateProjectionMatrix();
      render(performance.now());
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    const intersectionObserver = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
    }, { rootMargin: '100px' });
    intersectionObserver.observe(stage);
    const onPointerMove = event => {
      if (event.pointerType === 'touch') return;
      const rect = stage.getBoundingClientRect();
      targetX = THREE.MathUtils.clamp((event.clientX - rect.left - rect.width / 2) / rect.width, -0.7, 0.7);
      targetY = THREE.MathUtils.clamp((event.clientY - rect.top - rect.height / 2) / rect.height, -0.6, 0.6);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('blur', () => { targetX = 0; targetY = 0; });
    document.addEventListener('visibilitychange', () => { active = !document.hidden; });

    let lastFrame = 0;
    let motionPaused = document.documentElement.dataset.motion === 'paused';
    window.addEventListener('portfolio:motion', event => {
      motionPaused = Boolean(event.detail?.paused);
      render(performance.now());
    });
    function render(now) {
      if (!width || !height) return;
      const time = now * 0.001;
      if (!reducedMotion.matches && !motionPaused) {
        currentX += (targetX - currentX) * 0.035;
        currentY += (targetY - currentY) * 0.035;
        robot.rotation.y = -0.19 + currentX * 0.24;
        robot.rotation.z = Math.sin(time * 0.5) * 0.007;
        robot.position.y = Math.sin(time * 0.9) * 0.025;
        head.rotation.y = currentX * 0.35 + Math.sin(time * 0.32) * 0.035;
        head.rotation.x = currentY * 0.22 + Math.sin(time * 0.4) * 0.018;
        head.rotation.z = -0.035;
        arms[0].rotation.z = -0.19 - Math.sin(time * 0.8) * 0.017;
        arms[1].rotation.z = 0.19 + Math.sin(time * 0.8 + 0.4) * 0.017;
        fingerGroups.forEach((joint, index) => { joint.rotation.x = -0.30 + Math.sin(time * 0.5 + index * 0.4) * 0.045; });
        const blink = Math.pow(Math.max(0, Math.cos(time * 0.24)), 100);
        cyan.emissiveIntensity = 2.3 + Math.sin(time * 1.8) * 0.15 - blink * 0.6;
      }
      renderer.render(scene, camera);
      stage.dataset.ready = 'true';
    }
    renderer.setAnimationLoop(now => {
      if (!visible || !active || now - lastFrame < (reducedMotion.matches || motionPaused ? 200 : 1000 / 36)) return;
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
    console.info('3D enhancement unavailable; showing the portfolio illustration.');
  }
}
