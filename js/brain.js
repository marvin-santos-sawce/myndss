/**
 * MYNDS — 3D Brain (Three.js)
 * Tony Stark holographic style — pink neon on black
 */

(function () {
  const canvas = document.getElementById('brain-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  /* ---- COLOURS ---- */
  const C_PINK      = new THREE.Color(0xff2d78);
  const C_PINK_DIM  = new THREE.Color(0x7a0f39);
  const C_PINK_WIRE = new THREE.Color(0xff2d78);
  const C_WHITE     = new THREE.Color(0xffffff);

  /* ---- BRAIN GROUP ---- */
  const brainGroup = new THREE.Group();
  scene.add(brainGroup);

  /* 1. Outer brain hemisphere — bumpy sphere base */
  function makeBrainMesh() {
    const geo = new THREE.SphereGeometry(1.15, 96, 64);
    // Deform vertices to get a brain-like silhouette
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);

      const len = Math.sqrt(vx*vx + vy*vy + vz*vz);
      const nx = vx / len;
      const ny = vy / len;
      const nz = vz / len;

      // Proportions: Z-elongation (front-back), Y-squish (vertical), X-taper (width)
      const zStretch = 1.35;
      const ySquish = 0.80;
      const xStretch = 0.90;

      let px = nx * xStretch;
      let py = ny * ySquish;
      let pz = nz * zStretch;

      // Back bulge (z < 0) vs Front taper (z > 0)
      if (nz < 0) {
        px *= (1.0 - 0.18 * nz);
      } else {
        px *= (1.0 - 0.08 * nz);
      }

      let baseRadius = Math.sqrt(px*px + py*py + pz*pz);

      // Longitudinal fissure (deep cleft separating hemispheres)
      let cleft = 0;
      const fissureDepth = 0.26;
      const fissureWidth = 0.15;
      cleft = -fissureDepth * Math.exp(-Math.pow(nx / fissureWidth, 2));

      // Make cleft shallower at the very bottom (ny < -0.4)
      if (ny < -0.4) {
        cleft *= (1.0 - (-ny - 0.4) / 0.6);
      }

      // Cerebellum transverse groove (separates cerebrum and cerebellum)
      const isCerebellum = (ny < -0.15 && nz < 0.15);
      if (isCerebellum) {
        const yDist = ny - (-0.28);
        const groove = -0.12 * Math.exp(-32 * yDist * yDist) * Math.exp(-2.5 * nz * nz);
        cleft += groove;

        // Bulge out the cerebellum area slightly
        baseRadius += 0.06 * Math.sin(Math.PI * (ny + 0.95) / 0.8);
      }

      // Cortex folds via domain warping for winding noodles (gyri/sulci)
      const warpStrength = 0.50;
      const wx = nx + warpStrength * Math.sin(5.5 * ny) * Math.cos(5.5 * nz);
      const wy = ny + warpStrength * Math.sin(5.5 * nz) * Math.cos(5.5 * nx);
      const wz = nz + warpStrength * Math.sin(5.5 * nx) * Math.cos(5.5 * ny);

      // Lower frequency + ridged mapping (1.0 - abs(sin)) for smooth rounded folds
      const foldFreq1 = 6.5;
      const foldVal1 = Math.sin(foldFreq1 * wx) * Math.cos(foldFreq1 * wy) * Math.sin(foldFreq1 * wz);
      let folds = 0.14 * (1.0 - Math.abs(foldVal1)) - 0.06;

      // Secondary fine detail octave
      const foldFreq2 = 13.0;
      const foldVal2 = Math.sin(foldFreq2 * wx) * Math.cos(foldFreq2 * wy) * Math.sin(foldFreq2 * wz);
      folds += 0.04 * (1.0 - Math.abs(foldVal2)) - 0.02;

      // Cerebellum parallel stripes (folia)
      if (isCerebellum) {
        const foliaFreq = 26;
        const folia = Math.sin(foliaFreq * (ny + 0.06 * Math.sin(8 * nx)));
        folds = 0.05 * (1.0 - Math.abs(folia)) - 0.025;
      }

      const radius = 1.15 * (baseRadius + cleft + folds);
      pos.setXYZ(i, nx * radius, ny * radius, nz * radius);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x1a0010),
      emissive: C_PINK_DIM,
      emissiveIntensity: 0.08,
      roughness: 0.85,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88,
    });
    return new THREE.Mesh(geo, mat);
  }

  /* 2. Wireframe overlay — the holographic feel */
  function makeWireframe(mesh) {
    const wGeo = new THREE.WireframeGeometry(mesh.geometry);
    const wMat = new THREE.LineBasicMaterial({
      color: C_PINK_WIRE,
      transparent: true,
      opacity: 0.18,
    });
    return new THREE.LineSegments(wGeo, wMat);
  }

  /* 3. Scan ring planes — cross-section glow rings */
  function makeScanRings() {
    const group = new THREE.Group();
    const ringData = [
      { y: 0.55,  r: 0.85, op: 0.5 },
      { y: 0.0,   r: 1.10, op: 0.7 },
      { y: -0.45, r: 0.90, op: 0.45 },
    ];
    ringData.forEach(({ y, r, op }) => {
      const geo = new THREE.RingGeometry(r - 0.004, r + 0.004, 128);
      const mat = new THREE.MeshBasicMaterial({
        color: C_PINK,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: op,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      ring.scale.set(0.90, 1.35, 1.0); // Match brain's elliptical proportions
      group.add(ring);
    });
    return group;
  }

  /* 4. Axon particle cloud */
  function makeParticles() {
    const count = 1200;
    const geo   = new THREE.BufferGeometry();
    const pos   = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi   = Math.acos(2 * v - 1);

      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.sin(phi) * Math.sin(theta);
      const nz = Math.cos(phi);

      // Proportions: Z-elongation, Y-squish, X-taper (similar to the brain)
      const zStretch = 1.35;
      const ySquish = 0.80;
      const xStretch = 0.90;

      let px = nx * xStretch;
      let py = ny * ySquish;
      let pz = nz * zStretch;

      if (nz < 0) {
        px *= (1.0 - 0.18 * nz);
      } else {
        px *= (1.0 - 0.08 * nz);
      }

      const dist = Math.sqrt(px*px + py*py + pz*pz);

      // Scale slightly outside the brain surface
      const r = 1.15 * (dist + 0.08 + Math.random() * 0.18);

      pos[i * 3]     = nx * r;
      pos[i * 3 + 1] = ny * r;
      pos[i * 3 + 2] = nz * r;
      sizes[i] = 0.8 + Math.random() * 1.8;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: C_PINK,
      size: 0.012,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    return new THREE.Points(geo, mat);
  }

  /* 5. Glow sprite (fake bloom) */
  function makeGlowSprite() {
    const size = 256;
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const ctx = cv.getContext('2d');
    const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0.0, 'rgba(255,45,120,0.30)');
    grad.addColorStop(0.4, 'rgba(255,45,120,0.10)');
    grad.addColorStop(1.0, 'rgba(255,45,120,0.00)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(cv);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.8, 3.8, 1);
    return sprite;
  }

  /* ---- ASSEMBLE ---- */
  const brainMesh  = makeBrainMesh();
  const wireMesh   = makeWireframe(brainMesh);
  const scanRings  = makeScanRings();
  const particles  = makeParticles();
  const glowSprite = makeGlowSprite();

  brainGroup.add(glowSprite);
  brainGroup.add(brainMesh);
  brainGroup.add(wireMesh);
  brainGroup.add(scanRings);
  brainGroup.add(particles);

  /* ---- LIGHTS ---- */
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const pinkPoint = new THREE.PointLight(0xff2d78, 3.5, 8);
  pinkPoint.position.set(2, 1.5, 2);
  scene.add(pinkPoint);

  const fillLight = new THREE.PointLight(0xff6faa, 1.2, 6);
  fillLight.position.set(-2, -1, -1);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffffff, 0.6, 5);
  rimLight.position.set(0, 2.5, -2);
  scene.add(rimLight);

  /* ---- MOUSE TRACKING ---- */
  const mouse     = { x: 0, y: 0 };
  const targetRot = { x: 0, y: 0 };
  const currentRot= { x: 0, y: 0 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    targetRot.y =  mouse.x * 0.55;   // horizontal tilt
    targetRot.x = -mouse.y * 0.38;   // vertical tilt
  });

  /* Touch support */
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    mouse.x = (t.clientX / window.innerWidth  - 0.5) * 2;
    mouse.y = (t.clientY / window.innerHeight - 0.5) * 2;
    targetRot.y =  mouse.x * 0.55;
    targetRot.x = -mouse.y * 0.38;
  }, { passive: true });

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed; width:12px; height:12px;
    border:1px solid rgba(255,45,120,0.8); border-radius:50%;
    pointer-events:none; z-index:9999;
    transform:translate(-50%,-50%);
    transition:width 0.15s, height 0.15s, opacity 0.15s;
  `;
  document.body.appendChild(cursor);

  const cursorTrail = document.createElement('div');
  cursorTrail.style.cssText = `
    position:fixed; width:4px; height:4px;
    background:rgba(255,45,120,0.9); border-radius:50%;
    pointer-events:none; z-index:9999;
    transform:translate(-50%,-50%);
  `;
  document.body.appendChild(cursorTrail);

  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  /* ---- ANIMATE ---- */
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth follow
    const lerpF = 0.06;
    currentRot.x += (targetRot.x - currentRot.x) * lerpF;
    currentRot.y += (targetRot.y - currentRot.y) * lerpF;

    brainGroup.rotation.x = currentRot.x;
    brainGroup.rotation.y = currentRot.y + t * 0.08;  // gentle idle spin

    // Scan rings pulsing
    scanRings.children.forEach((ring, i) => {
      ring.material.opacity = 0.3 + 0.3 * Math.sin(t * 1.4 + i * 1.2);
    });

    // Particles drift
    particles.rotation.y = t * 0.04;
    particles.material.opacity = 0.4 + 0.15 * Math.sin(t * 0.9);

    // Pink light pulse
    pinkPoint.intensity = 3.0 + 1.2 * Math.sin(t * 1.6);

    // Glow breathe
    const s = 3.6 + 0.4 * Math.sin(t * 0.7);
    glowSprite.scale.set(s, s, 1);

    // Cursor trail lerp
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    cursorTrail.style.left = cx + 'px';
    cursorTrail.style.top  = cy + 'px';

    renderer.render(scene, camera);
  }

  animate();

  /* ---- RESIZE ---- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

})();
