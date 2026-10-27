/* Cinematic 3D hero: a luxury mansion is built from foundation to finished estate, on a loop.
   Move the mouse to steer the camera and a light; click and drag to orbit the building. */
(() => {
  const hero = document.querySelector('.hero'), cv = document.getElementById('scene');
  if (!window.THREE || !cv) return;
  const T = THREE, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let R; try { R = new T.WebGLRenderer({ canvas: cv, antialias: true }); } catch (e) { return; }
  R.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  R.shadowMap.enabled = true; R.shadowMap.type = T.PCFSoftShadowMap;
  R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.1;

  const bgc = 0x0a1020, S = new T.Scene();
  S.background = new T.Color(bgc); S.fog = new T.FogExp2(bgc, .016);
  const C = new T.PerspectiveCamera(40, 1, .1, 300);
  S.add(new T.HemisphereLight(0x7f95cf, 0x1a1a14, .65));
  const sun = new T.DirectionalLight(0xffcf94, 2.2); sun.position.set(-18, 22, 16); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 90 }); S.add(sun);
  const rim = new T.DirectionalLight(0x5f7dff, .7); rim.position.set(16, 8, -18); S.add(rim);
  const cl = new T.PointLight(0xffe0b0, 0, 18); S.add(cl);            // light that follows the cursor
  const ups = [-5, 0, 5].map(x => { const l = new T.PointLight(0xffc27a, 0, 14); l.position.set(x, 1.2, 9); S.add(l); return l; });

  const M = o => new T.MeshStandardMaterial(o);
  const mWall = M({ color: 0xe9e1d2, roughness: .85 }), mStone = M({ color: 0xcfc6b4, roughness: .8 }), mGold = M({ color: 0xc9a45c, metalness: .85, roughness: .3 });
  const mWhite = M({ color: 0xf4f1ea, roughness: .55 }), mRoof = M({ color: 0x2b3340, roughness: .7 }), mBrick = M({ color: 0x8a4b3a, roughness: .9 });
  const mDoor = M({ color: 0x3b2417, roughness: .5 }), mGrass = M({ color: 0x1c3a26, roughness: 1 }), mLeaf = M({ color: 0x2f6b3f, roughness: .9, flatShading: true });
  const mTrunk = M({ color: 0x4a3626, roughness: 1 }), mRoad = M({ color: 0x3a3d45, roughness: .9 });
  const mGlass = M({ color: 0x1d2a45, metalness: .9, roughness: .1, emissive: 0xffc072, emissiveIntensity: 0 });
  const mLamp = M({ color: 0xffe2b0, emissive: 0xffd08a, emissiveIntensity: 2 });
  const mWater = M({ color: 0x2fb8c9, emissive: 0x1aa6b8, emissiveIntensity: .5, roughness: .1, metalness: .4 });

  const gnd = new T.Mesh(new T.CircleGeometry(120, 64), mGrass); gnd.rotation.x = -Math.PI / 2; gnd.receiveShadow = true; S.add(gnd);
  const sp = new Float32Array(600);
  for (let i = 0; i < 200; i++) { const a = Math.random() * 6.28, e = Math.random() * 1.2 + .15; sp[i * 3] = Math.cos(a) * Math.cos(e) * 140; sp[i * 3 + 1] = Math.sin(e) * 140; sp[i * 3 + 2] = Math.sin(a) * Math.cos(e) * 140; }
  const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3));
  S.add(new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 1.2, fog: false, transparent: true, opacity: .8 })));

  const B = new T.Group(); S.add(B); const P = [];
  const bx = (w, h, d, m, x, y, z) => { const g = new T.BoxGeometry(w, h, d); g.translate(0, h / 2, 0); const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o; };
  const put = (o, a, b, k, par = B) => { o.userData = { a, b, k, y: o.position.y }; par.add(o); P.push(o); return o; };
  const flat = (g, m, x, y, z) => { const o = new T.Mesh(g, m); o.rotation.x = -Math.PI / 2; o.position.set(x, y, z); o.receiveShadow = true; return o; };

  /* One building volume: foundation > steel frame > floors > walls > roof > windows */
  const HH = 2.3, Y0 = .25;
  function block(x, z, w, d, fl, sides, grand) {
    const g = new T.Group(); g.position.set(x, 0, z); B.add(g);
    const A = (o, a, b, k) => put(o, a, b, k, g), tot = fl * HH;
    A(bx(w + .9, .25, d + .9, mStone, 0, 0, 0), 0, .06, 'sx');
    const nc = Math.round(w / 2.2) + 1;
    for (let i = 0; i < nc; i++) for (const s of [-1, 1]) A(bx(.24, tot, .24, mGold, -w / 2 + i * w / (nc - 1), Y0, s * d / 2), .07 + i * .008, .17 + i * .008, 'sy');
    for (let f = 0; f < fl; f++) A(bx(w + .3, .2, d + .3, mStone, 0, Y0 + (f + 1) * HH - .2, 0), .16 + f * .04, .26 + f * .04, 'sy');
    A(bx(w - .05, tot, d - .05, mWall, 0, Y0, 0), .28, .46, 'sy');
    const rg = new T.ConeGeometry(1, 1, 4); rg.rotateY(Math.PI / 4); rg.translate(0, .5, 0);
    const rf = new T.Mesh(rg, mRoof); rf.scale.set((w / 2 + .6) / .7071, grand ? 2.2 : 1.6, (d / 2 + .6) / .7071); rf.position.y = Y0 + tot; rf.castShadow = true; A(rf, .5, .64, 'drop');
    const win = (wx, wy, wz, ry, a) => {
      const gr = new T.Group(); gr.position.set(wx, wy, wz); gr.rotation.y = ry;
      gr.add(new T.Mesh(new T.BoxGeometry(1.15, 1.6, .1), mWhite), new T.Mesh(new T.BoxGeometry(.9, 1.35, .14), mGlass)); A(gr, a, a + .05, 'grow');
    };
    const n = Math.max(1, Math.floor(w / 2.2)), m = Math.max(1, Math.floor(d / 2.4));
    for (let f = 0; f < fl; f++) {
      const wy = Y0 + f * HH + 1.35;
      for (let i = 0; i < n; i++) { const wx = (i - (n - 1) / 2) * (w / n); if (grand && f === 0 && Math.abs(wx) < 1.4) continue; win(wx, wy, d / 2 + .03, 0, .66 + (f * n + i) * .004); }
      for (const s of sides) for (let j = 0; j < m; j++) win(s * (w / 2 + .03), wy, (j - (m - 1) / 2) * (d / m), s * Math.PI / 2, .68 + j * .004);
    }
    if (grand) {
      for (const cx of [-2.2, 2.4]) A(bx(.6, 2, .6, mBrick, cx, Y0 + tot + .3, -.6), .56, .64, 'sy');
      const pz = d / 2 + 1.4, ch = tot - .55;
      for (const px of [-2.9, -1, 1, 2.9]) { const cg = new T.CylinderGeometry(.24, .28, ch, 20); cg.translate(0, ch / 2, 0); const c = new T.Mesh(cg, mWhite); c.position.set(px, Y0, pz); c.castShadow = true; A(c, .6, .74, 'sy'); }
      A(bx(7.4, .55, 2.8, mWhite, 0, Y0 + ch, pz), .72, .78, 'sy');
      const sh = new T.Shape(); sh.moveTo(-3.7, 0); sh.lineTo(3.7, 0); sh.lineTo(0, 1.5); sh.lineTo(-3.7, 0);
      const pd = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 2.8, bevelEnabled: false }), mWhite); pd.position.set(0, Y0 + tot, d / 2); pd.castShadow = true; A(pd, .74, .8, 'drop');
      A(bx(6, .15, 1.3, mStone, 0, 0, d / 2 + 3.3), .76, .8, 'sy'); A(bx(1.3, 2.3, .12, mDoor, 0, Y0, d / 2 + .04), .74, .8, 'sy');
      A(bx(.1, .1, .1, mGold, .45, Y0 + 1.1, d / 2 + .12), .78, .82, 'grow');
    }
  }
  block(0, 0, 8, 5.2, 2, [], true);
  block(-6.4, -.4, 4.8, 4.4, 1, [-1], false);
  block(6.4, -.4, 4.8, 4.4, 1, [1], false);

  /* Grounds: driveway, fountain, pool, hedges, trees, garden lamps */
  put(flat(new T.PlaneGeometry(3.6, 9), mRoad, 0, .03, 8.6), .78, .86, 'sx');
  put(flat(new T.RingGeometry(3.4, 6, 64), mRoad, 0, .03, 15.5), .8, .88, 'sx');
  const fnt = new T.Group(); fnt.position.set(0, 0, 15.5); B.add(fnt);
  const fb = new T.CylinderGeometry(1.8, 2, .5, 32); fb.translate(0, .25, 0); const fm = new T.Mesh(fb, mStone); fm.castShadow = true; fnt.add(fm);
  const fw = new T.Mesh(new T.CylinderGeometry(1.6, 1.6, .06, 32), mWater); fw.position.y = .5; fnt.add(fw);
  const fc = bx(.3, 1.6, .3, mStone, 0, .4, 0); fnt.add(fc); const fs = new T.Mesh(new T.SphereGeometry(.38, 16, 16), mWater); fs.position.y = 2.1; fnt.add(fs);
  fnt.userData = { a: .8, b: .88, k: 'grow', y: 0 }; P.push(fnt);
  const pool = new T.Group(); pool.position.set(-14, 0, 5); B.add(pool);
  pool.add(bx(8, .22, 4.4, mStone, 0, 0, 0)); const pw = flat(new T.PlaneGeometry(7, 3.4), mWater, 0, .24, 0); pool.add(pw);
  pool.userData = { a: .78, b: .86, k: 'sx', y: 0 }; P.push(pool);
  for (const s of [-1, 1]) put(bx(4.2, .9, .8, mLeaf, s * 6.4, 0, 3.3), .8, .88, 'sy');
  const tree = (x, z, sc, a) => {
    const g = new T.Group(); g.position.set(x, 0, z); g.scale.setScalar(sc);
    const tg = new T.CylinderGeometry(.22, .34, 2.4, 8); tg.translate(0, 1.2, 0); const tr = new T.Mesh(tg, mTrunk); tr.castShadow = true;
    const l1 = new T.Mesh(new T.IcosahedronGeometry(1.7, 0), mLeaf); l1.position.y = 3.6; l1.castShadow = true;
    const l2 = new T.Mesh(new T.IcosahedronGeometry(1.2, 0), mLeaf); l2.position.set(.5, 4.8, .2); l2.castShadow = true;
    g.add(tr, l1, l2); put(g, a, a + .08, 'grow');
  };
  [[-11, 5], [11, 5], [-16, -4], [16, -4], [-10, -11], [10, -11], [-20, 12], [20, 12], [0, -14]].forEach(([x, z], i) => tree(x, z, 1 + (i % 3) * .15, .8 + i * .012));
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28, r = 34 + (i * 7 % 5) * 3; tree(Math.cos(a) * r * 1.2, Math.sin(a) * r * .9 - 4, 1.4 + (i % 4) * .2, .86 + (i % 5) * .01); }
  for (let k = 0; k < 4; k++) for (const s of [-1, 1]) {
    const lg = new T.Group(); lg.position.set(s * 2.4, 0, 5.2 + k * 2.4);
    const lp = bx(.08, .8, .08, mGold, 0, 0, 0); const lb = new T.Mesh(new T.SphereGeometry(.15, 12, 12), mLamp); lb.position.y = .95; lg.add(lp, lb); put(lg, .86 + k * .01, .9 + k * .01, 'grow');
  }

  /* Timeline + camera */
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a))), eo = x => 1 - Math.pow(1 - x, 3), mn = v => Math.max(.001, v);
  const DUR = 44, fade = $('#fade'), lab = $('#phaseLabel'), bar = $('#phaseBar'), cur = $('#cur');
  let mx = 0, my = 0, sx = 0, sy = 0, run = true, last = '', t0 = performance.now(), tgY = 2, hasPtr = false;
  let drag = false, px = 0, py = 0, ux = 0, uy = 0, lastDrag = -9;
  const tg = new T.Vector3(), rc = new T.Raycaster(), mv = new T.Vector2();

  hero.addEventListener('pointerdown', e => { if (e.target.closest('a,button,input')) return; drag = true; px = e.clientX; py = e.clientY; hero.classList.add('grab'); });
  addEventListener('pointerup', () => { drag = false; hero.classList.remove('grab'); });
  addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; hasPtr = e.clientY - r.top < r.height && e.clientY >= r.top;
    if (cur) cur.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`;
    if (drag) { ux -= (e.clientX - px) * .006; uy = Math.max(-4, Math.min(7, uy + (e.clientY - py) * .03)); px = e.clientX; py = e.clientY; lastDrag = performance.now() / 1000; }
  });
  const size = () => { const w = hero.clientWidth, h = hero.clientHeight; R.setSize(w, h, false); C.aspect = w / h; C.updateProjectionMatrix(); };
  addEventListener('resize', size); size();
  new IntersectionObserver(([e]) => { run = e.isIntersecting; }).observe(hero);

  function frame(now) {
    requestAnimationFrame(frame);
    if (!run) return;
    const s = (now - t0) / 1000, t = reduce ? .95 : (s % DUR) / DUR;
    P.forEach(o => {
      const u = o.userData, p = eo(seg(t, u.a, u.b)); o.visible = p > 0;
      if (u.k === 'sy') o.scale.y = mn(p); else if (u.k === 'sx') o.scale.set(mn(p), 1, mn(p)); else if (u.k === 'drop') o.position.y = u.y + (1 - p) * 10; else o.scale.setScalar(mn(p));
    });
    const lit = seg(t, .8, .92);
    mGlass.emissiveIntensity = 1.3 * lit; ups.forEach(l => l.intensity = 1.6 * lit);
    fs.position.y = 2.1 + Math.sin(s * 2) * .08;

    if (!drag && s - lastDrag > 2.5) { ux *= .97; uy *= .97; }
    sx += (mx - sx) * .04; sy += (my - sy) * .04;
    const built = seg(t, .08, .6), wide = C.aspect < 1 ? 1.6 : 1;
    const ang = -.95 + t * 1.5 + Math.sin(s * .15) * .05 + sx * .22 + ux, rad = (27 - t * 4) * wide, h = 4 + eo(Math.min(1, t * 1.6)) * 5 - sy * 1.6 + uy;
    C.position.set(Math.sin(ang) * rad, Math.max(1.2, h), Math.cos(ang) * rad);
    tgY += (2 + built * 1.8 - tgY) * .05; tg.set(0, tgY, 2); C.lookAt(tg);

    mv.set(mx * 2, -my * 2); rc.setFromCamera(mv, C);
    cl.position.copy(rc.ray.origin).addScaledVector(rc.ray.direction, Math.max(8, C.position.distanceTo(tg) - 6));
    cl.intensity += ((hasPtr ? 2.2 : 0) - cl.intensity) * .08;

    fade.style.opacity = reduce ? 0 : Math.max(1 - seg(t, 0, .035), seg(t, .965, 1));
    const name = t < .07 ? 'Foundation' : t < .27 ? 'Steel structure' : t < .5 ? 'Walls' : t < .66 ? 'Roof' : t < .9 ? 'Finishes and grounds' : 'Completed residence';
    if (name !== last) { lab.textContent = name; last = name; }
    bar.style.width = (t * 100) + '%';
    R.render(S, C);
  }
  requestAnimationFrame(frame);
})();
