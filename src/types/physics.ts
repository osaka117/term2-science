export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export interface TopicDefinition {
  id: number;
  title: string;
  shortDesc: string;
}

export const TOPICS: TopicDefinition[] = [
  {
    id: 1,
    title: 'Understanding Projectile Motion',
    shortDesc: 'Foundational concepts, acceleration vectors, independence of axes, trajectories, and apex behavior.',
  },
  {
    id: 2,
    title: 'Horizontal and Vertical Velocity Components',
    shortDesc: 'Vector resolution (v_ix = v_i cos θ, v_iy = v_i sin θ), arbitrary angles, and reverse trigonometry.',
  },
  {
    id: 3,
    title: 'Initial Velocity',
    shortDesc: 'Determining launch speed from components, range, time of flight, or apex peak height.',
  },
  {
    id: 4,
    title: 'Final Velocity',
    shortDesc: 'Resultant velocity vectors, components v_fx and v_fy, impact speed, and direction angle φ.',
  },
  {
    id: 5,
    title: 'Time of Flight',
    shortDesc: 'Air time for ground-to-ground, horizontal drop, and asymmetric elevated launch quadratic solutions.',
  },
  {
    id: 6,
    title: 'Maximum Height',
    shortDesc: 'Peak altitude calculation relative to launch point versus relative to ground datum.',
  },
  {
    id: 7,
    title: 'Horizontal Range',
    shortDesc: 'Horizontal displacement, complementary angle equivalence, and elevated launch horizontal reach.',
  },
  {
    id: 8,
    title: 'Horizontal Projectile Motion',
    shortDesc: 'Zero initial vertical speed (v_iy = 0) from cliffs, roofs, and tables with downward acceleration.',
  },
  {
    id: 9,
    title: 'Angled Projectile Motion',
    shortDesc: 'Elevation and depression launch angles, full 2D kinematics across level and uneven terrain.',
  },
  {
    id: 10,
    title: 'Mixed Projectile Motion Problems',
    shortDesc: 'Multi-stage problems, backwards deduction, quadratic time intervals, and comprehensive vector synthesis.',
  },
];

export interface DiagramData {
  v0: number;
  angleDeg: number;
  h0: number;
  g: number;
  timeOfFlight?: number;
  maxHeight?: number;
  range?: number;
  currentTime?: number;
}

export interface QuestionExplanation {
  equations: string[];
  knowns: { symbol: string; value: string }[];
  unknowns: { symbol: string; target: string }[];
  whyEquation: string;
  rearrangement: string;
  substitution: string;
  result: string;
  commonMistakesNotice?: string;
}

export interface Question {
  id: string;
  topicId: number;
  topicTitle: string;
  difficulty: DifficultyLevel;
  prompt: string;
  gValue: number;
  options: string[];
  correctIndex: number;
  explanation: QuestionExplanation;
  diagram?: DiagramData;
}

export interface PracticeConfig {
  topicSelection: number | 'random';
  selectedDifficulties: DifficultyLevel[];
  randomDifficulty: boolean;
}

export interface MockTestConfig {
  questionCount: number;
  selectedTopics: number[];
}
