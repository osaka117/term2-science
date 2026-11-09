import { DifficultyLevel, Question, TOPICS, DiagramData } from '../types/physics';

// Utility random helpers
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function round(val: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

function formatVal(val: number, decimals: number = 2): string {
  const rounded = round(val, decimals);
  return rounded.toFixed(decimals).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

/**
 * Creates 4 unique shuffled options with plausible distractors
 */
function buildOptions(
  correctVal: number,
  unit: string,
  distractorGen: (correct: number) => number[],
  decimals: number = 2
): { options: string[]; correctIndex: number } {
  const correctStr = `${formatVal(correctVal, decimals)} ${unit}`;
  const rawDistractors = distractorGen(correctVal);

  const set = new Set<string>();
  set.add(correctStr);

  for (const d of rawDistractors) {
    if (isNaN(d) || !isFinite(d)) continue;
    const s = `${formatVal(d, decimals)} ${unit}`;
    if (s !== correctStr && !set.has(s)) {
      set.add(s);
    }
    if (set.size >= 4) break;
  }

  // Fallbacks if not enough distractors
  let offset = 0.15;
  while (set.size < 4) {
    const sHigh = `${formatVal(correctVal * (1 + offset), decimals)} ${unit}`;
    const sLow = `${formatVal(Math.max(0.1, correctVal * (1 - offset)), decimals)} ${unit}`;
    if (!set.has(sHigh)) set.add(sHigh);
    if (set.size < 4 && !set.has(sLow)) set.add(sLow);
    offset += 0.12;
  }

  const options = Array.from(set).slice(0, 4);
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const correctIndex = options.indexOf(correctStr);
  return { options, correctIndex };
}

function buildConceptualOptions(
  correctText: string,
  wrongTexts: string[]
): { options: string[]; correctIndex: number } {
  const all = [correctText, ...wrongTexts.slice(0, 3)];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return { options: all, correctIndex: all.indexOf(correctText) };
}

// -------------------------------------------------------------
// QUESTION GENERATOR IMPLEMENTATION
// -------------------------------------------------------------

export function generateQuestion(
  topicId: number,
  difficulty: DifficultyLevel,
  forcedG?: number
): Question {
  const g = 9.8; // Constant gravitational acceleration g = 9.8 m/s²
  const topicTitle = TOPICS.find((t) => t.id === topicId)?.title || 'Projectile Motion';
  const id = `q_${topicId}_${difficulty}_${Date.now()}_${randInt(100, 999)}`;

  switch (topicId) {
    case 1:
      return generateTopic1(id, topicTitle, difficulty, g);
    case 2:
      return generateTopic2(id, topicTitle, difficulty, g);
    case 3:
      return generateTopic3(id, topicTitle, difficulty, g);
    case 4:
      return generateTopic4(id, topicTitle, difficulty, g);
    case 5:
      return generateTopic5(id, topicTitle, difficulty, g);
    case 6:
      return generateTopic6(id, topicTitle, difficulty, g);
    case 7:
      return generateTopic7(id, topicTitle, difficulty, g);
    case 8:
      return generateTopic8(id, topicTitle, difficulty, g);
    case 9:
      return generateTopic9(id, topicTitle, difficulty, g);
    case 10:
    default:
      return generateTopic10(id, topicTitle, difficulty, g);
  }
}

// TOPIC 1: Understanding Projectile Motion
function generateTopic1(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  if (difficulty === 1) {
    const qType = randChoice(['accel_horiz', 'accel_vert', 'apex_vy', 'trajectory_shape']);
    if (qType === 'accel_horiz') {
      const { options, correctIndex } = buildConceptualOptions(
        'Zero acceleration (a_x = 0 m/s²), because gravity acts exclusively vertically in ideal conditions',
        [
          `Equal to -${g} m/s² directed forward`,
          `Constant downward acceleration of ${g} m/s²`,
          'Gradually decreasing acceleration as the projectile ascends',
        ]
      );
      return {
        id,
        topicId: 1,
        topicTitle,
        difficulty,
        gValue: g,
        prompt: `In standard ideal projectile motion (neglecting air resistance), what is the horizontal acceleration of the object during its flight? (Use $g = ${g}\\text{ m/s}^2$)`,
        options,
        correctIndex,
        explanation: {
          equations: ['$a_x = 0\\text{ m/s}^2$', '$a_y = -g$'],
          knowns: [{ symbol: 'Air resistance', value: 'Neglected (0 N)' }],
          unknowns: [{ symbol: 'a_x', target: 'Horizontal acceleration' }],
          whyEquation:
            'By Newton\'s second law ($\\Sigma F_x = m a_x$), because no horizontal forces act on an ideal projectile in free flight, horizontal acceleration is strictly zero.',
          rearrangement: 'a_x = 0',
          substitution: 'Direct conceptual principle',
          result: 'a_x = 0 m/s²',
          commonMistakesNotice:
            'A common student misconception is assuming gravity somehow propels or slows down horizontal motion. Gravity acts purely vertically downward.',
        },
      };
    } else if (qType === 'apex_vy') {
      const { options, correctIndex } = buildConceptualOptions(
        'Vertical velocity is zero (v_y = 0), while horizontal velocity remains equal to its initial horizontal component (v_x = v_ix)',
        [
          'Both horizontal and vertical velocities are momentarily zero (v = 0)',
          'Vertical velocity is at its maximum while horizontal velocity is zero',
          `Vertical acceleration becomes zero while vertical velocity is ${g} m/s`,
        ]
      );
      return {
        id,
        topicId: 1,
        topicTitle,
        difficulty,
        gValue: g,
        prompt: `An object is launched at an angle above the horizontal. At the exact instant it reaches its maximum height (apex), which statement accurately describes its velocity components? (Use $g = ${g}\\text{ m/s}^2$)`,
        options,
        correctIndex,
        explanation: {
          equations: ['$v_y(\\text{apex}) = 0$', '$v_x(\\text{apex}) = v_{ix}$'],
          knowns: [{ symbol: '\\theta', value: '> 0^\\circ' }],
          unknowns: [{ symbol: '\\vec{v}_{\\text{apex}}', target: 'Apex velocity vector' }],
          whyEquation:
            'The projectile stops ascending at the apex before descending, so $v_y = 0$. However, since $a_x = 0$, the horizontal velocity $v_x = v_{ix} = v_i\\cos\\theta$ never vanishes.',
          rearrangement: 'v_y = 0, v_x = v_{ix} \\neq 0',
          substitution: 'At apex: \\Delta y/\\Delta t = 0 \\implies v_y = 0',
          result: 'v_y = 0, v_x = v_{ix}',
          commonMistakesNotice:
            'Do not say the object "stops" at the peak. Its total speed is not zero; it still moves horizontally at speed $v_{ix}$.',
        },
      };
    } else {
      const { options, correctIndex } = buildConceptualOptions(
        'A parabola opening downward, described by a quadratic equation in x',
        [
          'A circular arc of constant radius',
          'A hyperbola with vertical asymptotes',
          'Two straight lines joined at the apex vertex',
        ]
      );
      return {
        id,
        topicId: 1,
        topicTitle,
        difficulty,
        gValue: g,
        prompt: `Neglecting air resistance, what geometric trajectory does an ideal projectile trace through space when launched at an angle relative to flat ground?`,
        options,
        correctIndex,
        explanation: {
          equations: ['$x(t) = v_{ix}t$', '$y(t) = v_{iy}t - \\frac{1}{2}gt^2$'],
          knowns: [{ symbol: 't', value: 'x / v_{ix}' }],
          unknowns: [{ symbol: 'y(x)', target: 'Trajectory equation' }],
          whyEquation:
            'Eliminating time $t$ by substituting $t = x/v_{ix}$ yields $y(x) = x\\tan\\theta - \\frac{g}{2v_{ix}^2}x^2$, which is the equation of a downward-opening parabola.',
          rearrangement: 'y(x) = (\\tan\\theta)x - \\left(\\frac{g}{2v_i^2\\cos^2\\theta}\\right)x^2',
          substitution: 'Direct substitution of parametric kinematic relations',
          result: 'Parabolic trajectory',
          commonMistakesNotice:
            'Students sometimes confuse a projectile trajectory with circular arcs or catenary curves. Free fall with constant horizontal velocity always yields a parabola.',
        },
      };
    }
  }

  // Level 2 to 5: Deeper conceptual or quantitative tests of independence of motion
  const v0 = randChoice([18, 24, 30, 36]);
  const theta = randChoice([30, 45, 60]);
  const rad = (theta * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  if (difficulty <= 3) {
    // Independence: Dropped vs fired horizontally
    const h = randChoice([20, 45, 80]);
    const dropTime = Math.sqrt((2 * h) / g);
    const { options, correctIndex } = buildConceptualOptions(
      'Both spheres strike the ground at the exact same instant, because their vertical motions are identical and independent of horizontal velocity.',
      [
        'The dropped sphere lands first because it has a shorter path of travel.',
        'The fired sphere lands first because its high speed cuts through gravitational resistance.',
        'The fired sphere takes twice as long because it has horizontal kinetic energy.',
      ]
    );
    return {
      id,
      topicId: 1,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `From a cliff of height $h = ${h}\\text{ m}$, Sphere A is dropped from rest while Sphere B is projected horizontally at $v_{0x} = ${v0}\\text{ m/s}$. Assuming $g = ${g}\\text{ m/s}^2$ and zero air resistance, compare their times to hit the ground.`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: 0, h0: h, g },
      explanation: {
        equations: ['t = \\sqrt{\\frac{2h}{g}}', '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2'],
        knowns: [
          { symbol: 'v_{iy}\\text{ (Sphere A)}', value: '0 m/s' },
          { symbol: 'v_{iy}\\text{ (Sphere B)}', value: '0 m/s' },
          { symbol: 'a_y', value: `-${g} m/s²` },
          { symbol: '\\Delta y', value: `-${h} m` },
        ],
        unknowns: [{ symbol: 't', target: 'Time of flight comparison' }],
        whyEquation:
          'Horizontal and vertical motions are completely independent. Both balls start with zero initial vertical velocity ($v_{iy} = 0$) and experience identical downward acceleration $-g$.',
        rearrangement: 't = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2(${h})}{' + g + '}} = ' + formatVal(dropTime) + '\\text{ s}',
        substitution: `Both spheres fall ${h} m with a_y = -${g} m/s²`,
        result: `Identical impact time: t = ${formatVal(dropTime)} s`,
        commonMistakesNotice:
          'A pervasive misconception is thinking horizontal velocity "supports" an object in the air or prolongs its vertical fall. The vertical fall time depends exclusively on vertical displacement and gravity.',
      },
    };
  }

  // Level 4 & 5: Complex qualitative vector scenario
  const compAngle = 90 - theta;
  const { options, correctIndex } = buildConceptualOptions(
    `Both launch angles (${theta}° and ${compAngle}°) produce the exact same horizontal range, but the ${compAngle > theta ? compAngle : theta}° launch has a greater time of flight and higher maximum apex.`,
    [
      `The ${theta}° launch travels significantly farther because lower angles encounter less gravitational force.`,
      `Both launch angles yield identical horizontal ranges, identical flight times, and identical maximum heights.`,
      `The complementary angle ${compAngle}° produces half the horizontal range of the ${theta}° launch.`,
    ]
  );

  return {
    id,
    topicId: 1,
    topicTitle,
    difficulty,
    gValue: g,
    prompt: `Two identical projectiles are launched from flat ground with equal initial speed $v_0 = ${v0}\\text{ m/s}$ at complementary angles: $\\theta_1 = ${theta}^\\circ$ and $\\theta_2 = ${compAngle}^\\circ$. Using $g = ${g}\\text{ m/s}^2$, evaluate the relationship between their horizontal ranges, maximum heights, and flight times.`,
    options,
    correctIndex,
    diagram: { v0, angleDeg: theta, h0: 0, g },
    explanation: {
      equations: [
        'R = \\frac{v_0^2\\sin(2\\theta)}{g}',
        'T = \\frac{2v_0\\sin\\theta}{g}',
        'H = \\frac{(v_0\\sin\\theta)^2}{2g}',
      ],
      knowns: [
        { symbol: '\\theta_1', value: `${theta}°` },
        { symbol: '\\theta_2', value: `${compAngle}°` },
        { symbol: 'Identity', value: '\\sin(2(90^\\circ - \\theta)) = \\sin(180^\\circ - 2\\theta) = \\sin(2\\theta)' },
      ],
      unknowns: [{ symbol: 'R_1 \\text{ vs } R_2', target: 'Range comparison' }],
      whyEquation:
        'Because $\\sin(2\\theta) = \\sin(2(90^\\circ-\\theta))$, the horizontal range on level ground is identical for complementary angles. However, the steeper angle has a larger $v_{iy} = v_0\\sin\\theta$, producing a longer time of flight and a higher apex.',
      rearrangement: `R(${theta}^\\circ) = R(${compAngle}^\\circ)`,
      substitution: `\\sin(2 \\times ${theta}^\\circ) = \\sin(${2 * theta}^\\circ) = \\sin(${2 * compAngle}^\\circ)`,
      result: `Equal range; higher apex and longer airtime for the steeper angle.`,
      commonMistakesNotice:
        'Students frequently mistake equal range for equal flight times. The projectile with higher launch angle spends significantly more time in the air.',
    },
  };
}

// TOPIC 2: Horizontal and Vertical Velocity Components
function generateTopic2(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([15, 20, 25, 30, 35, 42, 50]);
  const angle = randChoice([15, 30, 37, 45, 53, 60, 75]);
  const rad = (angle * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  if (difficulty === 1) {
    // Direct question: find vix or viy
    const findX = Math.random() > 0.5;
    const correctVal = findX ? vix : viy;
    const trigFunc = findX ? '\\cos' : '\\sin';
    const compName = findX ? 'horizontal initial velocity component $v_{ix}$' : 'vertical initial velocity component $v_{iy}$';

    const { options, correctIndex } = buildOptions(correctVal, 'm/s', (c) => [
      findX ? viy : vix, // classic sin/cos swap
      v0,
      c * 1.5,
      c * 0.75,
    ]);

    return {
      id,
      topicId: 2,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A projectile is launched with an initial speed of $v_i = ${v0}\\text{ m/s}$ at an angle of $\\theta = ${angle}^\\circ$ above the horizontal. Find its ${compName}. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [findX ? 'v_{ix} = v_i\\cos\\theta' : 'v_{iy} = v_i\\sin\\theta'],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
        ],
        unknowns: [{ symbol: findX ? 'v_{ix}' : 'v_{iy}', target: compName }],
        whyEquation:
          'Resolving a vector at an angle measured from the horizontal assigns the adjacent leg to cosine ($v_{ix} = v_i\\cos\\theta$) and the opposite leg to sine ($v_{iy} = v_i\\sin\\theta$).',
        rearrangement: `${findX ? 'v_{ix}' : 'v_{iy}'} = ${v0} \\times ${trigFunc}(${angle}^\\circ)`,
        substitution: `${v0} \\times ${formatVal(findX ? Math.cos(rad) : Math.sin(rad), 4)}`,
        result: `${formatVal(correctVal)} m/s`,
        commonMistakesNotice:
          'Common mistake: swapping sine and cosine. When the angle is with respect to the horizontal, horizontal is ALWAYS cosine and vertical is ALWAYS sine.',
      },
    };
  } else if (difficulty === 2 || difficulty === 3) {
    // Reverse calculation: given components, find launch speed or launch angle
    const findAngle = Math.random() > 0.5;
    if (findAngle) {
      const correctVal = angle;
      const { options, correctIndex } = buildOptions(correctVal, '°', () => [
        90 - angle,
        round(Math.atan2(vix, viy) * (180 / Math.PI), 1), // inverted tangent
        round(angle * 0.6, 1),
        round(angle * 1.25, 1),
      ]);

      return {
        id,
        topicId: 2,
        topicTitle,
        difficulty,
        gValue: g,
        prompt: `A cannonball has an initial horizontal velocity of $v_{ix} = ${formatVal(vix)}\\text{ m/s}$ and an initial vertical velocity of $v_{iy} = ${formatVal(viy)}\\text{ m/s}$. Calculate its launch angle $\\theta$ above the horizontal. (Use $g = ${g}\\text{ m/s}^2$)`,
        options,
        correctIndex,
        diagram: { v0, angleDeg: angle, h0: 0, g },
        explanation: {
          equations: ['\\tan\\theta = \\frac{v_{iy}}{v_{ix}}', '\\theta = \\arctan\\left(\\frac{v_{iy}}{v_{ix}}\\right)'],
          knowns: [
            { symbol: 'v_{ix}', value: `${formatVal(vix)} m/s` },
            { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          ],
          unknowns: [{ symbol: '\\theta', target: 'Launch angle' }],
          whyEquation:
            'From right-triangle trigonometry, tangent of the angle with the horizontal equals the ratio of opposite leg (vertical velocity) to adjacent leg (horizontal velocity).',
          rearrangement: `\\theta = \\tan^{-1}\\left(\\frac{${formatVal(viy)}}{${formatVal(vix)}}\\right)`,
          substitution: `\\tan^{-1}(${formatVal(viy / vix, 4)})`,
          result: `${formatVal(correctVal)}°`,
          commonMistakesNotice:
            'Taking $\\tan^{-1}(v_{ix}/v_{iy})$ gives the angle with the vertical, not the horizontal! Always place vertical in the numerator for angle above horizontal.',
        },
      };
    } else {
      // Find initial speed magnitude from components
      const correctVal = v0;
      const { options, correctIndex } = buildOptions(correctVal, 'm/s', () => [
        vix + viy, // linear addition error
        Math.abs(vix - viy),
        Math.sqrt(vix * vix * 2),
        round(v0 * 1.35, 2),
      ]);

      return {
        id,
        topicId: 2,
        topicTitle,
        difficulty,
        gValue: g,
        prompt: `At launch, a projectile possesses velocity components $v_{ix} = ${formatVal(vix)}\\text{ m/s}$ and $v_{iy} = ${formatVal(viy)}\\text{ m/s}$. What is its initial speed $v_i$? (Use $g = ${g}\\text{ m/s}^2$)`,
        options,
        correctIndex,
        diagram: { v0, angleDeg: angle, h0: 0, g },
        explanation: {
          equations: ['v_i = \\sqrt{v_{ix}^2 + v_{iy}^2}'],
          knowns: [
            { symbol: 'v_{ix}', value: `${formatVal(vix)} m/s` },
            { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          ],
          unknowns: [{ symbol: 'v_i', target: 'Resultant launch speed' }],
          whyEquation:
            'Since horizontal and vertical velocity vectors are orthogonal (at 90°), the resultant velocity vector magnitude is found via the Pythagorean theorem.',
          rearrangement: `v_i = \\sqrt{(${formatVal(vix)})^2 + (${formatVal(viy)})^2}`,
          substitution: `\\sqrt{${formatVal(vix * vix)} + ${formatVal(viy * viy)}} = \\sqrt{${formatVal(vix * vix + viy * viy)}}`,
          result: `${formatVal(correctVal)} m/s`,
          commonMistakesNotice:
            'Never simply sum vector magnitudes algebraically ($v_i \\neq v_{ix} + v_{iy}$). Vectors at right angles require Pythagorean summation.',
        },
      };
    }
  } else {
    // Level 4 & 5: Multi-step resolution with non-standard angle and coordinate orientation
    const targetV = v0;
    const { options, correctIndex } = buildOptions(targetV, 'm/s', () => [
      vix * Math.sin(rad),
      vix / Math.sin(rad),
      vix * 1.4,
      vix * 0.8,
    ]);

    return {
      id,
      topicId: 2,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A long-range projectile is tracked as having a constant horizontal velocity of $v_{ix} = ${formatVal(vix)}\\text{ m/s}$. Radar telemetry confirms the launch angle was $\\theta = ${angle}^\\circ$ above the horizontal. Calculate the true initial launch speed $v_i$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: ['v_{ix} = v_i\\cos\\theta \\implies v_i = \\frac{v_{ix}}{\\cos\\theta}'],
        knowns: [
          { symbol: 'v_{ix}', value: `${formatVal(vix)} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
        ],
        unknowns: [{ symbol: 'v_i', target: 'Launch speed' }],
        whyEquation:
          'Rearranging the horizontal component relationship isolates the unknown launch speed $v_i$.',
        rearrangement: `v_i = \\frac{${formatVal(vix)}}{\\cos(${angle}^\\circ)}`,
        substitution: `${formatVal(vix)} / ${formatVal(Math.cos(rad), 4)}`,
        result: `${formatVal(targetV)} m/s`,
        commonMistakesNotice:
          'Using sine instead of cosine results in $v_i = v_{ix}/\\sin\\theta$, which is physically incorrect when the angle is measured relative to the horizontal.',
      },
    };
  }
}

// TOPIC 3: Initial Velocity
function generateTopic3(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([16, 22, 28, 34, 40]);
  const angle = randChoice([30, 45, 60]);
  const rad = (angle * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  if (difficulty <= 2) {
    // Given horizontal displacement and time, find initial horizontal velocity
    const time = randChoice([2, 3, 4]);
    const range = vix * time;
    const { options, correctIndex } = buildOptions(vix, 'm/s', () => [
      range * time,
      range / (time * 2),
      vix + 9.8,
      vix * 1.25,
    ]);

    return {
      id,
      topicId: 3,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A launched projectile travels a horizontal distance of $\\Delta x = ${formatVal(range)}\\text{ m}$ during a time interval of $t = ${time}\\text{ s}$. Determine its initial horizontal velocity $v_{ix}$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: ['\\Delta x = v_{ix}t \\implies v_{ix} = \\frac{\\Delta x}{t}'],
        knowns: [
          { symbol: '\\Delta x', value: `${formatVal(range)} m` },
          { symbol: 't', value: `${time} s` },
          { symbol: 'a_x', value: '0 m/s²' },
        ],
        unknowns: [{ symbol: 'v_{ix}', target: 'Initial horizontal velocity' }],
        whyEquation:
          'Because horizontal acceleration is zero, horizontal velocity is constant: velocity = displacement / time.',
        rearrangement: `v_{ix} = \\frac{${formatVal(range)}}{${time}}`,
        substitution: `${formatVal(range)} / ${time}`,
        result: `${formatVal(vix)} m/s`,
        commonMistakesNotice:
          'Do not apply gravity $g$ to the horizontal equation of motion. $a_x = 0$.',
      },
    };
  } else if (difficulty <= 4) {
    // Given maximum height and launch angle, determine initial launch speed v0
    const hMax = (viy * viy) / (2 * g);
    const { options, correctIndex } = buildOptions(v0, 'm/s', () => [
      viy, // forgot to divide by sin(theta)
      v0 * Math.cos(rad),
      Math.sqrt(2 * g * hMax),
      v0 * 1.33,
    ]);

    return {
      id,
      topicId: 3,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A football kicked at $\\theta = ${angle}^\\circ$ above horizontal ground reaches a maximum apex height of $H = ${formatVal(hMax)}\\text{ m}$. Calculate its initial launch speed $v_i$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'H = \\frac{v_{iy}^2}{2g} = \\frac{(v_i\\sin\\theta)^2}{2g}',
          'v_{iy} = \\sqrt{2gH}',
          'v_i = \\frac{v_{iy}}{\\sin\\theta} = \\frac{\\sqrt{2gH}}{\\sin\\theta}',
        ],
        knowns: [
          { symbol: 'H', value: `${formatVal(hMax)} m` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 'v_{iy}', target: 'Initial vertical velocity' },
          { symbol: 'v_i', target: 'Initial launch speed' },
        ],
        whyEquation:
          'At the apex, $v_{fy} = 0$. Using $v_{fy}^2 = v_{iy}^2 - 2gH$ yields $v_{iy} = \\sqrt{2gH}$. Then dividing by $\\sin\\theta$ gives the full launch velocity $v_i$.',
        rearrangement: `v_{iy} = \\sqrt{2(${g})(${formatVal(hMax)})} = ${formatVal(viy)}\\text{ m/s}; \\quad v_i = \\frac{${formatVal(viy)}}{\\sin(${angle}^\\circ)}`,
        substitution: `${formatVal(viy)} / ${formatVal(Math.sin(rad), 4)}`,
        result: `${formatVal(v0)} m/s`,
        commonMistakesNotice:
          'Stopping at $v_{iy} = \\sqrt{2gH}$ only gives the vertical component, not the full launch speed $v_i$. You must divide by $\\sin\\theta$.',
      },
    };
  } else {
    // Level 5: Reverse calculation from both range R and maximum height H
    const hMax = (viy * viy) / (2 * g);
    const flightTime = (2 * viy) / g;
    const range = vix * flightTime;

    const { options, correctIndex } = buildOptions(v0, 'm/s', () => [
      Math.sqrt(range * g),
      Math.sqrt(2 * g * hMax),
      v0 * 0.75,
      v0 * 1.25,
    ]);

    return {
      id,
      topicId: 3,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[LEVEL 5 DEDUCTION] An artillery shell fired from level ground reaches an apex height of $H = ${formatVal(hMax)}\\text{ m}$ and impacts $R = ${formatVal(range)}\\text{ m}$ downrange. Deduce its total initial launch velocity $v_i$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'v_{iy} = \\sqrt{2gH}',
          'T = \\frac{2v_{iy}}{g}',
          'v_{ix} = \\frac{R}{T}',
          'v_i = \\sqrt{v_{ix}^2 + v_{iy}^2}',
        ],
        knowns: [
          { symbol: 'H', value: `${formatVal(hMax)} m` },
          { symbol: 'R', value: `${formatVal(range)} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 'v_{iy}', target: 'Vertical component' },
          { symbol: 'T', target: 'Total air time' },
          { symbol: 'v_{ix}', target: 'Horizontal component' },
          { symbol: 'v_i', target: 'Magnitude of initial velocity' },
        ],
        whyEquation:
          '1. At apex, vertical kinetic energy converts to gravitational potential: $v_{iy} = \\sqrt{2gH}$.\\n2. Air time is $T = 2v_{iy}/g$.\\n3. Horizontal velocity is $v_{ix} = R/T$.\\n4. Pythagorean theorem combines the components: $v_i = \\sqrt{v_{ix}^2 + v_{iy}^2}$.',
        rearrangement: `v_{iy} = \\sqrt{2(${g})(${formatVal(hMax)})} = ${formatVal(viy)}\\text{ m/s}; \\quad T = \\frac{2(${formatVal(viy)})}{${g}} = ${formatVal(flightTime)}\\text{ s}; \\quad v_{ix} = \\frac{${formatVal(range)}}{${formatVal(flightTime)}} = ${formatVal(vix)}\\text{ m/s}; \\quad v_i = \\sqrt{(${formatVal(vix)})^2 + (${formatVal(viy)})^2}`,
        substitution: `\\sqrt{${formatVal(vix * vix)} + ${formatVal(viy * viy)}}`,
        result: `${formatVal(v0)} m/s`,
        commonMistakesNotice:
          'Level 5 multi-step trap: Students often attempt to guess the launch angle. Working through components $v_{iy}$ and $v_{ix}$ avoids circular trigonometric dependencies.',
      },
    };
  }
}

// TOPIC 4: Final Velocity
function generateTopic4(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([20, 25, 30, 35, 40]);
  const angle = randChoice([30, 37, 45, 53, 60]);
  const rad = (angle * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  if (difficulty === 1) {
    // Final horizontal velocity after any elapsed time
    const t = randChoice([1.5, 2.0, 3.0]);
    const { options, correctIndex } = buildOptions(vix, 'm/s', () => [
      vix - g * t,
      v0,
      vix + g * t,
      0,
    ]);

    return {
      id,
      topicId: 4,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A ball is projected at $v_i = ${v0}\\text{ m/s}$ and $\\theta = ${angle}^\\circ$ above the horizontal. What is its final horizontal velocity component $v_{fx}$ after $t = ${t}\\text{ s}$ of flight? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: ['$v_{fx} = v_{ix} = v_i\\cos\\theta$'],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 't', value: `${t} s` },
          { symbol: 'a_x', value: '0 m/s²' },
        ],
        unknowns: [{ symbol: 'v_{fx}', target: 'Final horizontal velocity' }],
        whyEquation:
          'Because gravity acts only along the vertical y-axis ($a_x = 0$), the horizontal velocity remains strictly invariant throughout the entire trajectory.',
        rearrangement: `v_{fx} = ${v0} \\times \\cos(${angle}^\\circ)`,
        substitution: `${v0} \\times ${formatVal(Math.cos(rad), 4)}`,
        result: `${formatVal(vix)} m/s`,
        commonMistakesNotice:
          'Subtracting $g t$ from horizontal velocity is a major error. $g$ alters vertical velocity $v_y$ only.',
      },
    };
  } else if (difficulty <= 3) {
    // Vertical velocity or resultant speed at time t
    const t = randChoice([1.0, 1.5, 2.0]);
    const vfy = viy - g * t;
    const vf = Math.sqrt(vix * vix + vfy * vfy);

    const { options, correctIndex } = buildOptions(vf, 'm/s', () => [
      Math.abs(vix + vfy), // scalar sum
      v0 - g * t, // subtracted from scalar speed
      Math.sqrt(v0 * v0 - 2 * g * t),
      vf * 1.25,
    ]);

    return {
      id,
      topicId: 4,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A projectile is launched from ground level at $v_i = ${v0}\\text{ m/s}$ at an angle of $\\theta = ${angle}^\\circ$. Determine the magnitude of its resultant velocity $v_f$ after $t = ${t}\\text{ s}$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'v_{fx} = v_i\\cos\\theta',
          'v_{fy} = v_i\\sin\\theta - gt',
          'v_f = \\sqrt{v_{fx}^2 + v_{fy}^2}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 't', value: `${t} s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 'v_{fx}', target: 'Horizontal velocity' },
          { symbol: 'v_{fy}', target: 'Vertical velocity at time t' },
          { symbol: 'v_f', target: 'Resultant speed magnitude' },
        ],
        whyEquation:
          'First calculate both orthogonal velocity components at time $t$. Then compute the Euclidean vector norm via the Pythagorean theorem.',
        rearrangement: `v_{fx} = ${formatVal(vix)}\\text{ m/s}; \\quad v_{fy} = ${formatVal(viy)} - (${g})(${t}) = ${formatVal(vfy)}\\text{ m/s}; \\quad v_f = \\sqrt{(${formatVal(vix)})^2 + (${formatVal(vfy)})^2}`,
        substitution: `\\sqrt{${formatVal(vix * vix)} + ${formatVal(vfy * vfy)}}`,
        result: `${formatVal(vf)} m/s`,
        commonMistakesNotice:
          'Do NOT simply compute $v_f = v_i - gt$. Velocity is a 2D vector, not a 1D scalar.',
      },
    };
  } else {
    // Level 4 & 5: Impact velocity and direction for launch from an elevated cliff
    const h0 = randChoice([25, 40, 50]);
    // vf^2 = vi^2 + 2*g*h0 (by conservation of energy / 2D kinematics)
    const vf = Math.sqrt(v0 * v0 + 2 * g * h0);
    const discr = viy * viy + 2 * g * h0;
    const vfyImpact = -Math.sqrt(discr); // downward
    const impactAngleDeg = Math.atan2(Math.abs(vfyImpact), vix) * (180 / Math.PI);

    const { options, correctIndex } = buildOptions(vf, 'm/s', () => [
      v0 + Math.sqrt(2 * g * h0),
      Math.sqrt(v0 * v0 - 2 * g * h0),
      vf * 0.82,
      vf * 1.2,
    ]);

    return {
      id,
      topicId: 4,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[ELEVATED CLIFF IMPACT] A rescue projectile is launched from a cliff of height $h = ${h0}\\text{ m}$ at an initial speed of $v_i = ${v0}\\text{ m/s}$ and angle $\\theta = ${angle}^\\circ$ above the horizontal. Calculate the final speed $v_f$ of the projectile immediately before striking the ground below. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          'v_{fx} = v_i\\cos\\theta',
          'v_{fy}^2 = v_{iy}^2 - 2g\\Delta y \\quad (\\Delta y = -h)',
          'v_f = \\sqrt{v_{fx}^2 + v_{fy}^2} = \\sqrt{v_i^2 + 2gh}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'h', value: `${h0} m` },
          { symbol: '\\Delta y', value: `-${h0} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 'v_f', target: 'Final impact speed' }],
        whyEquation:
          'Since $v_{fx}^2 = v_{ix}^2$ and $v_{fy}^2 = v_{iy}^2 + 2gh$, combining them yields $v_f^2 = v_{ix}^2 + v_{iy}^2 + 2gh = v_i^2 + 2gh$.',
        rearrangement: `v_f = \\sqrt{(${v0})^2 + 2(${g})(${h0})}`,
        substitution: `\\sqrt{${v0 * v0} + ${2 * g * h0}} = \\sqrt{${v0 * v0 + 2 * g * h0}}`,
        result: `${formatVal(vf)} m/s (directed at ${formatVal(impactAngleDeg)}° below horizontal)`,
        commonMistakesNotice:
          'Remember that landing below launch height implies $\\Delta y = -h$, meaning gravity does positive work and accelerates the vertical motion.',
      },
    };
  }
}

// TOPIC 5: Time of Flight
function generateTopic5(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([18, 24, 30, 36, 42]);
  const angle = randChoice([30, 37, 45, 53, 60]);
  const rad = (angle * Math.PI) / 180;
  const viy = v0 * Math.sin(rad);

  if (difficulty === 1) {
    // Time to peak (half of flight time)
    const tPeak = viy / g;
    const { options, correctIndex } = buildOptions(tPeak, 's', () => [
      (2 * viy) / g, // total time
      v0 / g, // used v0 instead of viy
      tPeak * 0.5,
      tPeak * 1.5,
    ]);

    return {
      id,
      topicId: 5,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A stone is launched with initial vertical velocity $v_{iy} = ${formatVal(viy)}\\text{ m/s}$. How long does it take to reach its highest point (maximum height)? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      explanation: {
        equations: ['$v_{fy} = v_{iy} - gt = 0 \\implies t_{\\text{peak}} = \\frac{v_{iy}}{g}$'],
        knowns: [
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'v_{fy}(\\text{peak})', value: '0 m/s' },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 't_{\\text{peak}}', target: 'Time to apex' }],
        whyEquation:
          'At the apex of vertical flight, vertical velocity momentarily reaches zero ($v_{fy} = 0$). Setting $0 = v_{iy} - gt$ isolates the apex time.',
        rearrangement: `t = \\frac{${formatVal(viy)}}{${g}}`,
        substitution: `${formatVal(viy)} / ${g}`,
        result: `${formatVal(tPeak)} s`,
        commonMistakesNotice:
          'Do not confuse time to peak ($t = v_{iy}/g$) with total time of flight ($T = 2v_{iy}/g$). Peak time is exactly half of total airtime on level ground.',
      },
    };
  } else if (difficulty <= 3) {
    // Level ground total time of flight
    const totalT = (2 * viy) / g;
    const { options, correctIndex } = buildOptions(totalT, 's', () => [
      viy / g, // time to peak
      (2 * v0) / g, // forgot sin(theta)
      totalT * 0.6,
      totalT * 1.4,
    ]);

    return {
      id,
      topicId: 5,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A soccer ball is kicked from level ground at $v_i = ${v0}\\text{ m/s}$ and an angle of $\\theta = ${angle}^\\circ$. Calculate its total time of flight before returning to the ground. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2 = 0',
          'T = \\frac{2v_i\\sin\\theta}{g}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'g', value: `${g} m/s²` },
          { symbol: '\\Delta y', value: '0 m (lands at same elevation)' },
        ],
        unknowns: [{ symbol: 'T', target: 'Total time of flight' }],
        whyEquation:
          'Setting vertical displacement $\\Delta y = 0$ yields non-zero solution $t = 2v_{iy}/g = 2(v_i\\sin\\theta)/g$.',
        rearrangement: `T = \\frac{2(${v0})\\sin(${angle}^\\circ)}{${g}}`,
        substitution: `2 \\times ${v0} \\times ${formatVal(Math.sin(rad), 4)} / ${g} = ${formatVal(2 * viy)} / ${g}`,
        result: `${formatVal(totalT)} s`,
        commonMistakesNotice:
          'Forgetting to multiply by 2 gives only the time to reach maximum height, leaving the descent uncounted.',
      },
    };
  } else {
    // Level 4 & 5: Quadratic time of flight for elevated launch
    const h0 = randChoice([20, 35, 45, 60]);
    // y(t) = h0 + viy*t - 0.5*g*t^2 = 0 => 0.5*g*t^2 - viy*t - h0 = 0
    // t = [viy + sqrt(viy^2 + 2*g*h0)] / g
    const discr = viy * viy + 2 * g * h0;
    const tFlight = (viy + Math.sqrt(discr)) / g;

    const { options, correctIndex } = buildOptions(tFlight, 's', () => [
      (2 * viy) / g, // used flat ground formula!
      Math.sqrt((2 * h0) / g), // treated as horizontal launch!
      tFlight * 0.7,
      tFlight * 1.35,
    ]);

    return {
      id,
      topicId: 5,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[ELEVATED ASYMMETRIC LAUNCH] A flare is fired from the top of an $h = ${h0}\\text{ m}$ observation tower with an initial speed of $v_i = ${v0}\\text{ m/s}$ at an elevation angle of $\\theta = ${angle}^\\circ$. Find the total time of flight until the flare reaches the ground datum below. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2',
          '-h = (v_i\\sin\\theta)t - \\frac{1}{2}gt^2',
          '\\frac{1}{2}gt^2 - (v_i\\sin\\theta)t - h = 0',
          't = \\frac{v_{iy} + \\sqrt{v_{iy}^2 + 2gh}}{g}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'h', value: `${h0} m` },
          { symbol: '\\Delta y', value: `-${h0} m` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 't', target: 'Physical positive time of flight' }],
        whyEquation:
          'Because the landing point is lower than the launch point ($\\Delta y = -h$), the standard symmetric $T = 2v_{iy}/g$ does NOT apply. We must solve the full quadratic kinematic equation and discard the unphysical negative time root.',
        rearrangement: `t = \\frac{${formatVal(viy)} + \\sqrt{(${formatVal(viy)})^2 + 2(${g})(${h0})}}{${g}}`,
        substitution: `(${formatVal(viy)} + \\sqrt{${formatVal(viy * viy)} + ${2 * g * h0}}) / ${g} = (${formatVal(viy)} + ${formatVal(Math.sqrt(discr))}) / ${g}`,
        result: `${formatVal(tFlight)} s`,
        commonMistakesNotice:
          'CRITICAL PITFALL: Applying $T = 2v_i\\sin\\theta/g$ to an elevated launch is completely invalid because the flight path is asymmetric and continues below the launch elevation.',
      },
    };
  }
}

// TOPIC 6: Maximum Height
function generateTopic6(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([18, 24, 30, 36, 42]);
  const angle = randChoice([30, 37, 45, 53, 60]);
  const rad = (angle * Math.PI) / 180;
  const viy = v0 * Math.sin(rad);
  const hRel = (viy * viy) / (2 * g);

  if (difficulty <= 2) {
    // Ground launch max height
    const { options, correctIndex } = buildOptions(hRel, 'm', () => [
      (v0 * v0) / (2 * g), // forgot sin(theta)
      viy / (2 * g), // forgot to square velocity
      (viy * viy) / g, // forgot division by 2
      hRel * 1.5,
    ]);

    return {
      id,
      topicId: 6,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A baseball is struck from ground level at $v_i = ${v0}\\text{ m/s}$ at an angle of $\\theta = ${angle}^\\circ$. What is the maximum height $H$ reached above the ground? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'v_{fy}^2 = v_{iy}^2 - 2gH = 0',
          'H = \\frac{v_{iy}^2}{2g} = \\frac{(v_i\\sin\\theta)^2}{2g}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 'H', target: 'Maximum height' }],
        whyEquation:
          'At the apex, vertical velocity $v_{fy} = 0$. Substituting into Torricelli\'s kinematic equation $v_{fy}^2 = v_{iy}^2 - 2gH$ isolates $H$.',
        rearrangement: `H = \\frac{(${formatVal(viy)})^2}{2(${g})}`,
        substitution: `${formatVal(viy * viy)} / ${2 * g}`,
        result: `${formatVal(hRel)} m`,
        commonMistakesNotice:
          'Forgetting the factor of 2 in $2g$ or forgetting to square the initial vertical velocity are classic algebra errors.',
      },
    };
  } else {
    // Elevated launch: Distinguish maximum height above launch vs above ground
    const h0 = randChoice([15, 25, 40]);
    const hGround = h0 + hRel;

    const askGround = Math.random() > 0.5;
    const targetVal = askGround ? hGround : hRel;
    const desc = askGround ? 'above the ground' : 'above its launch point';

    const { options, correctIndex } = buildOptions(targetVal, 'm', () => [
      askGround ? hRel : hGround, // confused ground with launch point datum!
      (v0 * v0) / (2 * g) + (askGround ? h0 : 0),
      targetVal * 1.3,
      targetVal * 0.7,
    ]);

    return {
      id,
      topicId: 6,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A mortar round is launched from a platform $h = ${h0}\\text{ m}$ high with an initial velocity of $v_i = ${v0}\\text{ m/s}$ at $\\theta = ${angle}^\\circ$. Determine the maximum height reached by the round **${desc}**. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          'H_{\\text{relative}} = \\frac{v_{iy}^2}{2g}',
          'H_{\\text{ground}} = h_0 + \\frac{v_{iy}^2}{2g}',
        ],
        knowns: [
          { symbol: 'h_0', value: `${h0} m` },
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: askGround ? 'H_{\\text{ground}}' : 'H_{\\text{relative}}', target: `Maximum height ${desc}` }],
        whyEquation:
          `The maximum rise above the launch point depends solely on vertical kinetic energy: $H_{\\text{rel}} = v_{iy}^2/(2g) = ${formatVal(hRel)}\\text{ m}$. ${
            askGround
              ? `To find height relative to the ground datum, we must add the initial platform elevation: $H_{\\text{ground}} = ${h0} + ${formatVal(hRel)} = ${formatVal(hGround)}\\text{ m}$.`
              : `The question explicitly asks for height relative to the launch point, so platform elevation $h_0$ is not added.`
          }`,
        rearrangement: askGround
          ? `H_{\\text{ground}} = ${h0} + \\frac{(${formatVal(viy)})^2}{2(${g})}`
          : `H_{\\text{rel}} = \\frac{(${formatVal(viy)})^2}{2(${g})}`,
        substitution: askGround
          ? `${h0} + ${formatVal(hRel)}`
          : `${formatVal(viy * viy)} / ${2 * g}`,
        result: `${formatVal(targetVal)} m`,
        commonMistakesNotice:
          'Always read the reference datum carefully! Confusing height above launch elevation ($H_{\\text{rel}}$) with height above ground level ($h_0 + H_{\\text{rel}}$) is a very frequent source of test errors.',
      },
    };
  }
}

// TOPIC 7: Horizontal Range
function generateTopic7(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([20, 26, 32, 38, 44]);
  const angle = randChoice([30, 37, 45, 53, 60]);
  const rad = (angle * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);
  const flatRange = (v0 * v0 * Math.sin(2 * rad)) / g;

  if (difficulty <= 2) {
    // Level ground standard range
    const { options, correctIndex } = buildOptions(flatRange, 'm', () => [
      (v0 * v0 * Math.sin(rad)) / g, // forgot factor of 2 in sin(2*theta)
      vix * (viy / g), // used time to peak instead of total time!
      flatRange * 0.5,
      flatRange * 1.35,
    ]);

    return {
      id,
      topicId: 7,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A golf ball is driven from a level fairway at $v_i = ${v0}\\text{ m/s}$ and an angle of $\\theta = ${angle}^\\circ$. Calculate its total horizontal range $R$ before hitting the ground. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'R = \\frac{v_i^2\\sin(2\\theta)}{g}',
          '\\text{or } R = v_{ix} \\times T = (v_i\\cos\\theta)\\left(\\frac{2v_i\\sin\\theta}{g}\\right)',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 'R', target: 'Horizontal range' }],
        whyEquation:
          'For symmetrical launch and landing at the same height, multiplying constant horizontal speed $v_{ix}$ by total flight time $T = 2v_{iy}/g$ gives the range formula via the double-angle identity $2\\sin\\theta\\cos\\theta = \\sin(2\\theta)$.',
        rearrangement: `R = \\frac{(${v0})^2\\sin(2 \\times ${angle}^\\circ)}{${g}} = \\frac{${v0 * v0}\\sin(${2 * angle}^\\circ)}{${g}}`,
        substitution: `${v0 * v0} \\times ${formatVal(Math.sin(2 * rad), 4)} / ${g}`,
        result: `${formatVal(flatRange)} m`,
        commonMistakesNotice:
          'Multiplying $\\sin(\\theta)$ by 2 ($2\\sin\\theta$) instead of taking $\\sin(2\\theta)$ is a frequent calculator entry error.',
      },
    };
  } else {
    // Elevated launch range: must find quadratic time then multiply by vix
    const h0 = randChoice([20, 35, 50]);
    const discr = viy * viy + 2 * g * h0;
    const tFlight = (viy + Math.sqrt(discr)) / g;
    const elevatedRange = vix * tFlight;

    const { options, correctIndex } = buildOptions(elevatedRange, 'm', () => [
      flatRange, // neglected cliff height!
      flatRange + h0, // simply added cliff height to range
      vix * Math.sqrt((2 * h0) / g),
      elevatedRange * 0.75,
    ]);

    return {
      id,
      topicId: 7,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[RANGE FROM ELEVATION] A catapult launches a boulder from a cliff edge $h = ${h0}\\text{ m}$ high with an initial velocity of $v_i = ${v0}\\text{ m/s}$ at an angle of $\\theta = ${angle}^\\circ$ above horizontal. How far horizontally does the boulder travel before hitting the plain below? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          'v_{ix} = v_i\\cos\\theta',
          'v_{iy} = v_i\\sin\\theta',
          't = \\frac{v_{iy} + \\sqrt{v_{iy}^2 + 2gh}}{g}',
          'R = v_{ix}t',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'h', value: `${h0} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 't', target: 'Total air time' },
          { symbol: 'R', target: 'Horizontal range' },
        ],
        whyEquation:
          'Because the boulder lands below the launch level, the standard range formula $R = v_i^2\\sin(2\\theta)/g$ is INVALID. We must first calculate the true flight time from the vertical quadratic equation and then multiply by constant horizontal speed.',
        rearrangement: `t = \\frac{${formatVal(viy)} + \\sqrt{(${formatVal(viy)})^2 + 2(${g})(${h0})}}{${g}} = ${formatVal(tFlight)}\\text{ s}; \\quad R = (${formatVal(vix)})(${formatVal(tFlight)})`,
        substitution: `${formatVal(vix)} \\times ${formatVal(tFlight)}`,
        result: `${formatVal(elevatedRange)} m`,
        commonMistakesNotice:
          'Never use $R = v_i^2\\sin(2\\theta)/g$ when launch and landing heights are unequal. That formula strictly requires $\\Delta y = 0$.',
      },
    };
  }
}

// TOPIC 8: Horizontal Projectile Motion
function generateTopic8(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const vx = randChoice([12, 16, 20, 24, 30]);
  const h = randChoice([20, 45, 80, 125]);
  const t = Math.sqrt((2 * h) / g);
  const range = vx * t;
  const vfy = -g * t;
  const vf = Math.sqrt(vx * vx + vfy * vfy);
  const impactAngle = Math.atan2(Math.abs(vfy), vx) * (180 / Math.PI);

  if (difficulty <= 2) {
    // Find time of flight or horizontal range
    const askRange = Math.random() > 0.5;
    const targetVal = askRange ? range : t;
    const unit = askRange ? 'm' : 's';

    const { options, correctIndex } = buildOptions(targetVal, unit, () => [
      askRange ? vx * (h / g) : (2 * h) / g,
      targetVal * 1.4,
      targetVal * 0.7,
      askRange ? h : t * 2,
    ]);

    return {
      id,
      topicId: 8,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A sphere rolls off a horizontal tabletop/cliff of height $h = ${h}\\text{ m}$ with a pure horizontal velocity of $v_x = ${vx}\\text{ m/s}$. Find its ${
        askRange ? 'horizontal landing distance (range)' : 'total time of flight'
      }. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0: vx, angleDeg: 0, h0: h, g },
      explanation: {
        equations: [
          'v_{iy} = 0',
          't = \\sqrt{\\frac{2h}{g}}',
          askRange ? 'R = v_x t' : '',
        ].filter(Boolean),
        knowns: [
          { symbol: 'h', value: `${h} m` },
          { symbol: 'v_{ix}', value: `${vx} m/s` },
          { symbol: 'v_{iy}', value: '0 m/s' },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: askRange ? 'R' : 't', target: askRange ? 'Range' : 'Time of flight' }],
        whyEquation:
          'For a horizontal launch, initial vertical speed is zero ($v_{iy} = 0$). Vertical descent is pure free-fall from rest: $h = \\frac{1}{2}gt^2 \\implies t = \\sqrt{2h/g}$. Range is $R = v_x t$.',
        rearrangement: askRange
          ? `t = \\sqrt{\\frac{2(${h})}{${g}}} = ${formatVal(t)}\\text{ s}; \\quad R = (${vx})(${formatVal(t)})`
          : `t = \\sqrt{\\frac{2(${h})}{${g}}}`,
        substitution: askRange ? `${vx} \\times ${formatVal(t)}` : `\\sqrt{${2 * h} / ${g}}`,
        result: `${formatVal(targetVal)} ${unit}`,
        commonMistakesNotice:
          'Do not forget the square root when solving $t^2 = 2h/g$.',
      },
    };
  } else {
    // Level 3 to 5: Calculate final velocity magnitude and impact angle
    const { options, correctIndex } = buildOptions(vf, 'm/s', () => [
      vx + Math.abs(vfy), // added components linearly
      Math.abs(vfy), // only vertical
      vx, // only horizontal
      vf * 1.25,
    ]);

    return {
      id,
      topicId: 8,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A humanitarian relief crate is pushed horizontally out of a cargo plane flying at $h = ${h}\\text{ m}$ with an airspeed of $v_x = ${vx}\\text{ m/s}$. Calculate the magnitude of the velocity $v_f$ with which the crate strikes the ground. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0: vx, angleDeg: 0, h0: h, g },
      explanation: {
        equations: [
          't = \\sqrt{\\frac{2h}{g}}',
          'v_{fx} = v_x',
          'v_{fy} = -gt = -\\sqrt{2gh}',
          'v_f = \\sqrt{v_{fx}^2 + v_{fy}^2} = \\sqrt{v_x^2 + 2gh}',
        ],
        knowns: [
          { symbol: 'v_{ix}', value: `${vx} m/s` },
          { symbol: 'h', value: `${h} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 'v_{fy}', target: 'Vertical impact velocity' },
          { symbol: 'v_f', target: 'Resultant impact speed' },
        ],
        whyEquation:
          'Horizontal speed remains constant at $v_{fx} = ${vx}\\text{ m/s}$. The vertical component acquired during fall is $v_{fy}^2 = 2gh$. The resultant speed combines both via the Pythagorean theorem.',
        rearrangement: `v_f = \\sqrt{(${vx})^2 + 2(${g})(${h})}`,
        substitution: `\\sqrt{${vx * vx} + ${2 * g * h}} = \\sqrt{${vx * vx + 2 * g * h}}`,
        result: `${formatVal(vf)} m/s (at ${formatVal(impactAngle)}° below horizontal)`,
        commonMistakesNotice:
          'Impact velocity is neither purely horizontal nor purely vertical. It is the vector hypotenuse $\\sqrt{v_{fx}^2 + v_{fy}^2}$.',
      },
    };
  }
}

// TOPIC 9: Angled Projectile Motion
function generateTopic9(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  const v0 = randChoice([22, 28, 35, 42]);
  const angle = randChoice([30, 37, 45, 53, 60]);
  const rad = (angle * Math.PI) / 180;
  const vix = v0 * Math.cos(rad);
  const viy = v0 * Math.sin(rad);

  if (difficulty <= 2) {
    // Position x(t) or y(t) at given time t
    const t = randChoice([1.0, 1.5, 2.0]);
    const xPos = vix * t;
    const yPos = viy * t - 0.5 * g * t * t;

    const askY = Math.random() > 0.5;
    const targetVal = askY ? yPos : xPos;

    const { options, correctIndex } = buildOptions(targetVal, 'm', () => [
      askY ? viy * t : xPos * 1.5, // forgot -0.5*g*t^2 in y
      targetVal * 1.35,
      targetVal * 0.7,
      askY ? yPos + 10 : xPos - 12,
    ]);

    return {
      id,
      topicId: 9,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `A tennis ball is struck at $v_i = ${v0}\\text{ m/s}$ and $\\theta = ${angle}^\\circ$ above the horizontal. Find its ${
        askY ? 'vertical displacement $\\Delta y$' : 'horizontal displacement $\\Delta x$'
      } at time $t = ${t}\\text{ s}$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          askY ? '\\Delta y = (v_i\\sin\\theta)t - \\frac{1}{2}gt^2' : '\\Delta x = (v_i\\cos\\theta)t',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 't', value: `${t} s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: askY ? '\\Delta y' : '\\Delta x', target: askY ? 'Vertical displacement' : 'Horizontal displacement' }],
        whyEquation:
          askY
            ? 'Vertical position follows constant downward acceleration: $\\Delta y = v_{iy}t - \\frac{1}{2}gt^2$.'
            : 'Horizontal position follows constant zero acceleration: $\\Delta x = v_{ix}t$.',
        rearrangement: askY
          ? `\\Delta y = (${formatVal(viy)})(${t}) - \\frac{1}{2}(${g})(${t})^2`
          : `\\Delta x = (${formatVal(vix)})(${t})`,
        substitution: askY
          ? `${formatVal(viy * t)} - ${formatVal(0.5 * g * t * t)}`
          : `${formatVal(vix)} \\times ${t}`,
        result: `${formatVal(targetVal)} m`,
        commonMistakesNotice:
          'Remember to subtract $\\frac{1}{2}gt^2$ in vertical displacement because gravity acts downwards.',
      },
    };
  } else {
    // Downward angle launch from elevated cliff
    const depAngle = randChoice([20, 30, 45]);
    const depRad = (depAngle * Math.PI) / 180;
    const h0 = randChoice([30, 50, 70]);
    const depVix = v0 * Math.cos(depRad);
    const depViy = -v0 * Math.sin(depRad); // negative because downward!

    // Delta y = -h0 = depViy*t - 0.5*g*t^2 => 0.5*g*t^2 - depViy*t - h0 = 0
    // 0.5*g*t^2 + (v0*sin)*t - h0 = 0
    const aCoeff = 0.5 * g;
    const bCoeff = v0 * Math.sin(depRad);
    const cCoeff = -h0;
    const discr = bCoeff * bCoeff - 4 * aCoeff * cCoeff;
    const tDown = (-bCoeff + Math.sqrt(discr)) / (2 * aCoeff);
    const rangeDown = depVix * tDown;

    const { options, correctIndex } = buildOptions(rangeDown, 'm', () => [
      depVix * Math.sqrt((2 * h0) / g), // treated as horizontal launch
      (v0 * v0 * Math.sin(2 * depRad)) / g, // flat ground formula
      rangeDown * 1.3,
      rangeDown * 0.75,
    ]);

    return {
      id,
      topicId: 9,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[DEPRESSION LAUNCH ANGLE] An emergency probe is launched from an $h = ${h0}\\text{ m}$ cliff at $v_i = ${v0}\\text{ m/s}$ at an angle of $\\theta = ${depAngle}^\\circ$ **BELOW the horizontal** (depression angle). Determine how far horizontally from the cliff base it impacts the water. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: -depAngle, h0, g },
      explanation: {
        equations: [
          'v_{ix} = v_i\\cos\\theta',
          'v_{iy} = -v_i\\sin\\theta \\quad (\\text{downward})',
          '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2 = -h',
          '\\frac{1}{2}gt^2 + (v_i\\sin\\theta)t - h = 0',
          'R = v_{ix}t',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `-${depAngle}° (below horizontal)` },
          { symbol: 'v_{iy}', value: `-${formatVal(v0 * Math.sin(depRad))} m/s` },
          { symbol: 'h', value: `${h0} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 't', target: 'Flight time' },
          { symbol: 'R', target: 'Horizontal impact distance' },
        ],
        whyEquation:
          'When launched below the horizontal, the initial vertical velocity is already negative ($v_{iy} < 0$). This reduces time of flight compared to horizontal or upward launches. Solve the quadratic equation for $t > 0$ and multiply by $v_{ix}$.',
        rearrangement: `(${0.5 * g})t^2 + (${formatVal(bCoeff)})t - ${h0} = 0 \\implies t = ${formatVal(tDown)}\\text{ s}; \\quad R = (${formatVal(depVix)})(${formatVal(tDown)})`,
        substitution: `${formatVal(depVix)} \\times ${formatVal(tDown)}`,
        result: `${formatVal(rangeDown)} m`,
        commonMistakesNotice:
          'Forgetting that $v_{iy}$ is negative when launched below horizontal produces a much longer, completely erroneous airtime.',
      },
    };
  }
}

// TOPIC 10: Mixed Projectile Motion & Challenging Level 5 Problems
function generateTopic10(
  id: string,
  topicTitle: string,
  difficulty: DifficultyLevel,
  g: number
): Question {
  // Level 1 to 4: Multi-step problems combining equations
  if (difficulty < 5) {
    const v0 = randChoice([24, 30, 36, 42]);
    const angle = randChoice([30, 37, 45, 53, 60]);
    const rad = (angle * Math.PI) / 180;
    const vix = v0 * Math.cos(rad);
    const viy = v0 * Math.sin(rad);

    // Mixed problem: Find time when projectile is at specific height y
    const hPeak = (viy * viy) / (2 * g);
    const targetY = round(hPeak * 0.75, 1);
    // 0.5*g*t^2 - viy*t + targetY = 0
    const a = 0.5 * g;
    const b = -viy;
    const c = targetY;
    const discr = b * b - 4 * a * c;
    const t1 = (-b - Math.sqrt(Math.max(0, discr))) / (2 * a); // ascending
    const t2 = (-b + Math.sqrt(Math.max(0, discr))) / (2 * a); // descending

    const askAscending = Math.random() > 0.5;
    const correctT = askAscending ? t1 : t2;

    const { options, correctIndex } = buildOptions(correctT, 's', () => [
      askAscending ? t2 : t1, // the other trajectory branch
      (2 * viy) / g,
      viy / g,
      correctT * 1.45,
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty,
      gValue: g,
      prompt: `[MULTI-STEP MIXED KINEMATICS] A projectile launched at $v_i = ${v0}\\text{ m/s}$ and $\\theta = ${angle}^\\circ$ reaches an altitude of $y = ${formatVal(targetY)}\\text{ m}$. At what time $t$ does it pass through this elevation during its **${
        askAscending ? 'ASCENDING' : 'DESCENDING'
      }** phase? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'y(t) = (v_i\\sin\\theta)t - \\frac{1}{2}gt^2',
          '\\frac{1}{2}gt^2 - (v_i\\sin\\theta)t + y = 0',
          't = \\frac{v_{iy} \\pm \\sqrt{v_{iy}^2 - 2gy}}{g}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'y', value: `${formatVal(targetY)} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: 't', target: `Time during ${askAscending ? 'ascent (- root)' : 'descent (+ root)'}` }],
        whyEquation:
          `A projectile crosses any height below its peak twice: once on the way up ($t_1 = ${formatVal(t1)}\\text{ s}$) and once on the way down ($t_2 = ${formatVal(t2)}\\text{ s}$). The smaller time root corresponds to the upward ascent.`,
        rearrangement: `t = \\frac{${formatVal(viy)} ${askAscending ? '-' : '+'} \\sqrt{(${formatVal(viy)})^2 - 2(${g})(${formatVal(targetY)})}}{${g}}`,
        substitution: `(${formatVal(viy)} ${askAscending ? '-' : '+'} ${formatVal(Math.sqrt(discr))}) / ${g}`,
        result: `${formatVal(correctT)} s`,
        commonMistakesNotice:
          'Quadratic physics problems yield two real positive roots for intermediate heights. You must distinguish ascent ($-$) from descent ($+$).',
      },
    };
  }

  // -------------------------------------------------------------
  // LEVEL 5: GENUINELY DIFFICULT ADVANCED PROBLEMS (Types A to H)
  // -------------------------------------------------------------
  const typeChoice = randChoice(['typeA', 'typeB', 'typeC', 'typeD', 'typeE', 'typeF', 'typeG']);

  if (typeChoice === 'typeA') {
    // Type A: Elevated launch with multiple unknowns
    const v0 = randChoice([28, 32, 35, 40]);
    const angle = randChoice([32, 38, 42, 50]);
    const h0 = randChoice([35, 45, 55]);
    const rad = (angle * Math.PI) / 180;
    const vix = v0 * Math.cos(rad);
    const viy = v0 * Math.sin(rad);
    const discr = viy * viy + 2 * g * h0;
    const tFlight = (viy + Math.sqrt(discr)) / g;
    const range = vix * tFlight;
    const vfyImpact = -Math.sqrt(discr);
    const vfImpact = Math.sqrt(vix * vix + vfyImpact * vfyImpact);
    const impactAngleDeg = Math.atan2(Math.abs(vfyImpact), vix) * (180 / Math.PI);

    // Ask for range & final velocity combo or final impact speed
    const { options, correctIndex } = buildOptions(vfImpact, 'm/s', () => [
      v0, // assuming speed didn't change!
      Math.sqrt(v0 * v0 - 2 * g * h0),
      v0 + Math.sqrt(2 * g * h0),
      vfImpact * 1.25,
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE A: ELEVATED LAUNCH MULTI-STAGE] A projectile is launched from a platform of height $h = ${h0}\\text{ m}$ with initial speed $v_i = ${v0}\\text{ m/s}$ at $\\theta = ${angle}^\\circ$ above horizontal. After traversing its apex and descending past the platform, calculate its final impact speed $v_f$ immediately before hitting the ground below. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          'v_{ix} = v_i\\cos\\theta',
          'v_{iy} = v_i\\sin\\theta',
          't_{\\text{flight}} = \\frac{v_{iy} + \\sqrt{v_{iy}^2 + 2gh}}{g}',
          'v_{fx} = v_{ix}',
          'v_{fy} = v_{iy} - gt_{\\text{flight}} = -\\sqrt{v_{iy}^2 + 2gh}',
          'v_f = \\sqrt{v_{fx}^2 + v_{fy}^2} = \\sqrt{v_i^2 + 2gh}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'h', value: `${h0} m` },
          { symbol: 'v_{ix}', value: `${formatVal(vix)} m/s` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 't_{\\text{flight}}', target: `Air time = ${formatVal(tFlight)} s` },
          { symbol: 'R', target: `Range = ${formatVal(range)} m` },
          { symbol: 'v_f', target: 'Impact speed magnitude' },
        ],
        whyEquation:
          'Stage 1: Resolve initial velocity vectors.\\nStage 2: Solve the quadratic vertical equation with $\\Delta y = -h$ to find air time.\\nStage 3: Compute final vertical velocity at ground level.\\nStage 4: Combine orthogonal components via Pythagorean theorem, or verify with work-energy theorem $v_f = \\sqrt{v_i^2 + 2gh}$.',
        rearrangement: `v_f = \\sqrt{(${v0})^2 + 2(${g})(${h0})} = \\sqrt{${v0 * v0} + ${2 * g * h0}}`,
        substitution: `\\sqrt{${v0 * v0 + 2 * g * h0}}`,
        result: `${formatVal(vfImpact)} m/s (Angle: ${formatVal(impactAngleDeg)}° below horizontal, Range: ${formatVal(range)} m)`,
        commonMistakesNotice:
          'Many students forget that $\\Delta y = -h$ (negative) because the projectile lands BELOW the launch platform.',
      },
    };
  } else if (typeChoice === 'typeB') {
    // Type B: Work backward from final landing position and time
    const tFlight = randChoice([3.0, 4.0, 5.0]);
    const deltaX = randChoice([75, 90, 120]);
    const deltaY = -randChoice([15, 20, 30]); // landing below

    const vix = deltaX / tFlight;
    // deltaY = viy*t - 0.5*g*t^2 => viy*t = deltaY + 0.5*g*t^2 => viy = deltaY/t + 0.5*g*t
    const viy = deltaY / tFlight + 0.5 * g * tFlight;
    const v0 = Math.sqrt(vix * vix + viy * viy);
    const thetaDeg = Math.atan2(viy, vix) * (180 / Math.PI);

    const { options, correctIndex } = buildOptions(v0, 'm/s', () => [
      vix + viy, // linear sum
      Math.sqrt(deltaX * deltaX + deltaY * deltaY) / tFlight, // average speed magnitude
      v0 * 0.75,
      v0 * 1.35,
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE B: REVERSE DEDUCTION] Telemetry records that a test projectile lands at horizontal displacement $\\Delta x = ${deltaX}\\text{ m}$ and vertical displacement $\\Delta y = ${deltaY}\\text{ m}$ relative to its launch point after exactly $t = ${tFlight}\\text{ s}$ of flight. Work backward to determine the magnitude of its initial launch velocity $v_i$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: Math.max(5, thetaDeg), h0: Math.abs(deltaY), g },
      explanation: {
        equations: [
          'v_{ix} = \\frac{\\Delta x}{t}',
          '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2 \\implies v_{iy} = \\frac{\\Delta y}{t} + \\frac{1}{2}gt',
          'v_i = \\sqrt{v_{ix}^2 + v_{iy}^2}',
          '\\theta = \\arctan\\left(\\frac{v_{iy}}{v_{ix}}\\right)',
        ],
        knowns: [
          { symbol: '\\Delta x', value: `${deltaX} m` },
          { symbol: '\\Delta y', value: `${deltaY} m` },
          { symbol: 't', value: `${tFlight} s` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 'v_{ix}', target: 'Initial horizontal velocity' },
          { symbol: 'v_{iy}', target: 'Initial vertical velocity' },
          { symbol: 'v_i', target: 'Initial speed' },
        ],
        whyEquation:
          'Step 1: Horizontal speed is constant: $v_{ix} = \\Delta x / t$.\\nStep 2: Isolate $v_{iy}$ from the vertical position equation: $v_{iy} = \\frac{\\Delta y}{t} + \\frac{1}{2}gt$.\\nStep 3: Calculate the vector magnitude $v_i = \\sqrt{v_{ix}^2 + v_{iy}^2}$.',
        rearrangement: `v_{ix} = \\frac{${deltaX}}{${tFlight}} = ${formatVal(vix)}\\text{ m/s}; \\quad v_{iy} = \\frac{${deltaY}}{${tFlight}} + 0.5(${g})(${tFlight}) = ${formatVal(viy)}\\text{ m/s}; \\quad v_i = \\sqrt{(${formatVal(vix)})^2 + (${formatVal(viy)})^2}`,
        substitution: `\\sqrt{${formatVal(vix * vix)} + ${formatVal(viy * viy)}}`,
        result: `${formatVal(v0)} m/s (Launch angle $\\theta = ${formatVal(thetaDeg)}^\\circ$)`,
        commonMistakesNotice:
          'Do NOT compute $v_i$ by dividing straight-line distance $\\sqrt{\\Delta x^2 + \\Delta y^2}$ by time! That gives average scalar speed, not the initial launch velocity vector magnitude.',
      },
    };
  } else if (typeChoice === 'typeC') {
    // Type C: Finding unknown launch angle from range and speed (complementary angles)
    const v0 = randChoice([30, 35, 40]);
    const maxPossibleRange = (v0 * v0) / g;
    const range = round(maxPossibleRange * randChoice([0.65, 0.75, 0.86]), 1);

    // sin(2*theta) = R * g / v0^2
    const sin2Theta = (range * g) / (v0 * v0);
    const twoTheta = Math.asin(Math.min(1, sin2Theta)) * (180 / Math.PI);
    const theta1 = round(twoTheta / 2, 1);
    const theta2 = round(90 - theta1, 1);

    const correctStr = `${theta1}° and ${theta2}°`;
    const wrong1 = `${formatVal(theta1 * 0.75, 1)}° and ${formatVal(90 - theta1 * 0.75, 1)}°`;
    const wrong2 = `Only ${theta1}° (a single unique angle)`;
    const wrong3 = `${formatVal(twoTheta, 1)}° and ${formatVal(180 - twoTheta, 1)}°`;

    const { options, correctIndex } = buildConceptualOptions(correctStr, [wrong1, wrong2, wrong3]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE C: DUAL COMPLEMENTARY LAUNCH ANGLES] A projectile launched with speed $v_i = ${v0}\\text{ m/s}$ from ground level travels a horizontal range of $R = ${formatVal(range)}\\text{ m}$ before landing on the same plane. Determine all possible launch angles $\\theta$ that achieve this range. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: theta1, h0: 0, g },
      explanation: {
        equations: [
          'R = \\frac{v_i^2\\sin(2\\theta)}{g}',
          '\\sin(2\\theta) = \\frac{Rg}{v_i^2}',
          '2\\theta = \\arcsin\\left(\\frac{Rg}{v_i^2}\\right) \\quad \\text{and} \\quad 2\\theta = 180^\\circ - \\arcsin\\left(\\frac{Rg}{v_i^2}\\right)',
          '\\theta_1 = \\frac{2\\theta}{2}, \\quad \\theta_2 = 90^\\circ - \\theta_1',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: 'R', value: `${formatVal(range)} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: '\\theta_1, \\theta_2', target: 'Complementary launch angles' }],
        whyEquation:
          'Because the trigonometric equation $\\sin(2\\theta) = k$ has two principal solutions in the interval $[0^\\circ, 180^\\circ]$, there exist two distinct complementary launch angles $(\\theta$ and $90^\\circ - \\theta)$ for any achievable non-maximum range on flat terrain.',
        rearrangement: `\\sin(2\\theta) = \\frac{(${formatVal(range)})(${g})}{(${v0})^2} = ${formatVal(sin2Theta, 4)} \\implies 2\\theta = ${formatVal(twoTheta, 1)}^\\circ`,
        substitution: `\\theta_1 = \\frac{${formatVal(twoTheta, 1)}^\\circ}{2} = ${theta1}^\\circ; \\quad \\theta_2 = 90^\\circ - ${theta1}^\\circ = ${theta2}^\\circ`,
        result: `${theta1}° and ${theta2}°`,
        commonMistakesNotice:
          'Forgetting that complementary angles produce the exact same horizontal range on level ground. Most students only calculate the lower angle and forget $\\theta_2 = 90^\\circ - \\theta_1$.',
      },
    };
  } else if (typeChoice === 'typeD') {
    // Type D: Initial velocity and angle from peak height and range
    const hMax = randChoice([20, 25, 30, 40]);
    const range = randChoice([80, 100, 120, 140]);

    // H = viy^2 / (2g) => viy = sqrt(2*g*H)
    // T = 2*viy / g
    // vix = R / T
    // tan(theta) = viy / vix = sqrt(2*g*H) / [R*g / (2*sqrt(2*g*H))] = 4*H / R
    const viy = Math.sqrt(2 * g * hMax);
    const tFlight = (2 * viy) / g;
    const vix = range / tFlight;
    const v0 = Math.sqrt(vix * vix + viy * viy);
    const thetaDeg = Math.atan2(viy, vix) * (180 / Math.PI);

    const { options, correctIndex } = buildOptions(thetaDeg, '°', () => [
      Math.atan2(hMax, range) * (180 / Math.PI), // forgot factor of 4: tan(theta) = 4H/R
      round(thetaDeg * 0.75, 1),
      90 - round(thetaDeg, 1),
      round(thetaDeg * 1.25, 1),
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE D: MAXIMUM HEIGHT & RANGE DEDUCTION] A mortar round fired from flat ground reaches an apex height of $H = ${hMax}\\text{ m}$ and impacts at a horizontal range of $R = ${range}\\text{ m}$. Calculate its launch angle $\\theta$ above the horizontal. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: thetaDeg, h0: 0, g },
      explanation: {
        equations: [
          'H = \\frac{v_{iy}^2}{2g} \\implies v_{iy} = \\sqrt{2gH}',
          'T = \\frac{2v_{iy}}{g}',
          'v_{ix} = \\frac{R}{T} = \\frac{Rg}{2v_{iy}}',
          '\\tan\\theta = \\frac{v_{iy}}{v_{ix}} = \\frac{4H}{R}',
          '\\theta = \\arctan\\left(\\frac{4H}{R}\\right)',
        ],
        knowns: [
          { symbol: 'H', value: `${hMax} m` },
          { symbol: 'R', value: `${range} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [{ symbol: '\\theta', target: 'Launch angle' }],
        whyEquation:
          'Dividing $H = \\frac{v_i^2\\sin^2\\theta}{2g}$ by $R = \\frac{2v_i^2\\sin\\theta\\cos\\theta}{g}$ establishes the universal identity: $\\frac{H}{R} = \\frac{\\tan\\theta}{4} \\implies \\tan\\theta = \\frac{4H}{R}$.',
        rearrangement: `\\tan\\theta = \\frac{4(${hMax})}{${range}} = \\frac{${4 * hMax}}{${range}} = ${formatVal((4 * hMax) / range, 4)}`,
        substitution: `\\theta = \\tan^{-1}\\left(${formatVal((4 * hMax) / range, 4)}\\right)`,
        result: `${formatVal(thetaDeg)}° (Initial speed $v_i = ${formatVal(v0)}\\text{ m/s}$)`,
        commonMistakesNotice:
          'Common fallacy: Assuming $\\tan\\theta = H/R$. That would only be true for a triangular path! The parabolic curvature introduces an exact theoretical factor of 4: $\\tan\\theta = 4H/R$.',
      },
    };
  } else if (typeChoice === 'typeE') {
    // Type E: Position and velocity at specific time
    const v0 = randChoice([28, 32, 36]);
    const angle = randChoice([45, 53, 60]);
    const h0 = randChoice([12, 18, 25]);
    const rad = (angle * Math.PI) / 180;
    const vix = v0 * Math.cos(rad);
    const viy = v0 * Math.sin(rad);
    const tCheck = randChoice([1.5, 2.0, 2.5]);

    const vxT = vix;
    const vyT = viy - g * tCheck;
    const speedT = Math.sqrt(vxT * vxT + vyT * vyT);
    const dirT = Math.atan2(vyT, vxT) * (180 / Math.PI);
    const isAscending = vyT > 0;

    const { options, correctIndex } = buildOptions(speedT, 'm/s', () => [
      v0 - g * tCheck,
      Math.abs(vxT + vyT),
      speedT * 1.28,
      speedT * 0.76,
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE E: VECTOR STATE AT SPECIFIC TIME] An object is launched from an $h = ${h0}\\text{ m}$ platform at $v_i = ${v0}\\text{ m/s}$ and $\\theta = ${angle}^\\circ$. At time $t = ${tCheck}\\text{ s}$, calculate its instantaneous resultant speed $|\\vec{v}(t)|$. (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0, g },
      explanation: {
        equations: [
          'v_x(t) = v_i\\cos\\theta',
          'v_y(t) = v_i\\sin\\theta - gt',
          '|\\vec{v}(t)| = \\sqrt{v_x(t)^2 + v_y(t)^2}',
          '\\phi = \\arctan\\left(\\frac{v_y(t)}{v_x(t)}\\right)',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 't', value: `${tCheck} s` },
          { symbol: 'v_{ix}', value: `${formatVal(vix)} m/s` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
        ],
        unknowns: [
          { symbol: 'v_x(t)', target: 'Horizontal velocity' },
          { symbol: 'v_y(t)', target: 'Vertical velocity' },
          { symbol: '|\\vec{v}(t)|', target: 'Instantaneous speed' },
        ],
        whyEquation:
          'Compute each orthogonal component at the given timestamp. The vertical velocity determines whether the projectile is currently ascending ($v_y > 0$) or descending ($v_y < 0$). Then take the vector magnitude.',
        rearrangement: `v_x = ${formatVal(vxT)}\\text{ m/s}; \\quad v_y = ${formatVal(viy)} - (${g})(${tCheck}) = ${formatVal(vyT)}\\text{ m/s}; \\quad |\\vec{v}| = \\sqrt{(${formatVal(vxT)})^2 + (${formatVal(vyT)})^2}`,
        substitution: `\\sqrt{${formatVal(vxT * vxT)} + ${formatVal(vyT * vyT)}}`,
        result: `${formatVal(speedT)} m/s (Direction: ${formatVal(Math.abs(dirT))}° ${isAscending ? 'above' : 'below'} horizontal)`,
        commonMistakesNotice:
          'Never compute speed by scalar subtraction $|\\vec{v}| = v_i - gt$. Orthogonal components must be combined quadratically.',
      },
    };
  } else if (typeChoice === 'typeF') {
    // Type F: Quadratic time window spent above a certain altitude
    const v0 = randChoice([30, 36, 42]);
    const angle = randChoice([45, 53, 60]);
    const rad = (angle * Math.PI) / 180;
    const viy = v0 * Math.sin(rad);
    const hApex = (viy * viy) / (2 * g);
    const barrierH = round(hApex * 0.6, 1);

    // Delta y = viy*t - 0.5*g*t^2 = barrierH
    // 0.5*g*t^2 - viy*t + barrierH = 0
    const a = 0.5 * g;
    const b = -viy;
    const c = barrierH;
    const discr = b * b - 4 * a * c;
    const t1 = (-b - Math.sqrt(discr)) / (2 * a);
    const t2 = (-b + Math.sqrt(discr)) / (2 * a);
    const timeAbove = t2 - t1;

    const { options, correctIndex } = buildOptions(timeAbove, 's', () => [
      t1, // only time to enter
      t2, // time to exit
      (2 * viy) / g, // total air time
      timeAbove * 1.35,
    ]);

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE F: ALTITUDE TIME INTERVAL] A projectile launched from ground level at $v_i = ${v0}\\text{ m/s}$ and $\\theta = ${angle}^\\circ$ passes above an aerial sensor fence of height $y = ${formatVal(barrierH)}\\text{ m}$. For what total time duration $\\Delta t$ does the projectile remain ABOVE the fence? (Use $g = ${g}\\text{ m/s}^2$)`,
      options,
      correctIndex,
      diagram: { v0, angleDeg: angle, h0: 0, g },
      explanation: {
        equations: [
          'y(t) = v_{iy}t - \\frac{1}{2}gt^2 = y_{\\text{fence}}',
          '\\frac{1}{2}gt^2 - v_{iy}t + y_{\\text{fence}} = 0',
          '\\Delta t = t_2 - t_1 = \\frac{2\\sqrt{v_{iy}^2 - 2gy_{\\text{fence}}}}{g}',
        ],
        knowns: [
          { symbol: 'v_i', value: `${v0} m/s` },
          { symbol: '\\theta', value: `${angle}°` },
          { symbol: 'v_{iy}', value: `${formatVal(viy)} m/s` },
          { symbol: 'y_{\\text{fence}}', value: `${formatVal(barrierH)} m` },
          { symbol: 'g', value: `${g} m/s²` },
        ],
        unknowns: [
          { symbol: 't_1', target: `Ascent entry time = ${formatVal(t1)} s` },
          { symbol: 't_2', target: `Descent exit time = ${formatVal(t2)} s` },
          { symbol: '\\Delta t', target: 'Time duration above altitude' },
        ],
        whyEquation:
          'The projectile ascends past the fence height at $t_1$ and descends back through it at $t_2$. The duration spent above is the difference $\\Delta t = t_2 - t_1 = \\frac{\\sqrt{b^2 - 4ac}}{a}$.',
        rearrangement: `\\Delta t = \\frac{\\sqrt{(${formatVal(viy)})^2 - 2(${g})(${formatVal(barrierH)})}}{${0.5 * g}} = \\frac{\\sqrt{${formatVal(discr)}}}{${0.5 * g}}`,
        substitution: `${formatVal(Math.sqrt(discr))} / ${0.5 * g}`,
        result: `${formatVal(timeAbove)} s (from t = ${formatVal(t1)} s to t = ${formatVal(t2)} s)`,
        commonMistakesNotice:
          'Students often confuse the duration spent above an altitude with the time to reach it ($t_1$). You must calculate the time difference $\\Delta t = t_2 - t_1$.',
      },
    };
  } else {
    // Type G: Conceptual error analysis in multi-step physics solutions
    const { options, correctIndex } = buildConceptualOptions(
      'Step 2: The student used the symmetric time formula T = (2*v_i*sin θ)/g for a cliff launch, which is completely invalid because the launch and landing elevations are different (Δy ≠ 0).',
      [
        'Step 1: The student resolved the horizontal velocity component using cosine instead of sine.',
        'Step 3: The student incorrectly computed the horizontal displacement as Δx = v_ix * t instead of adding horizontal acceleration.',
        'Step 4: The student rounded the final answer to two decimal places.',
      ]
    );

    return {
      id,
      topicId: 10,
      topicTitle,
      difficulty: 5,
      gValue: g,
      prompt: `[LEVEL 5 - TYPE G: RIGOROUS ERROR ANALYSIS]
A student is given the following problem:
"A stone is launched from a 30 m cliff at 20 m/s and 40° above the horizontal. Find its horizontal range when it hits the ground below."

The student wrote this solution:
- Step 1: $v_{ix} = 20\\cos(40^\\circ) = 15.32\\text{ m/s}, \\quad v_{iy} = 20\\sin(40^\\circ) = 12.86\\text{ m/s}$
- Step 2: $T = \\frac{2 v_i\\sin(40^\\circ)}{g} = \\frac{2(12.86)}{9.8} = 2.62\\text{ s}$
- Step 3: $R = v_{ix} T = (15.32)(2.62) = 40.14\\text{ m}$

Identify the fatal physical error in the student's methodology.`,
      options,
      correctIndex,
      explanation: {
        equations: [
          '\\Delta y = v_{iy}t - \\frac{1}{2}gt^2',
          'T_{\\text{symmetric}} = \\frac{2v_i\\sin\\theta}{g} \\quad \\text{[VALID ONLY IF } \\Delta y = 0\\text{]}',
          '\\frac{1}{2}gt^2 - v_{iy}t - h = 0 \\quad \\text{[MANDATORY FOR } \\Delta y = -h\\text{]}',
        ],
        knowns: [
          { symbol: 'Launch height', value: '30 m' },
          { symbol: '\\Delta y', value: '-30 m (lands below launch point)' },
        ],
        unknowns: [{ symbol: 'Methodology flaw', target: 'Critical assumption failure in Step 2' }],
        whyEquation:
          'The formula $T = \\frac{2v_i\\sin\\theta}{g}$ assumes $\\Delta y = 0$ (symmetric parabolic arc landing at original height). At $t = 2.62\\text{ s}$, the stone has merely returned to the height of the cliff! It still has to fall another 30 meters to reach the ground.',
        rearrangement: 'Must solve: 4.9t^2 - 12.86t - 30 = 0 \\implies t_{\\text{actual}} = 4.14\\text{ s}',
        substitution: 'True range = 15.32 m/s * 4.14 s = 63.43 m, NOT 40.14 m',
        result: 'Fatal Error: Invoking symmetric flight formula when Δy ≠ 0',
        commonMistakesNotice:
          'Formula memorization without checking domain assumptions is the #1 cause of failure in projectile kinematics.',
      },
    };
  }
}
