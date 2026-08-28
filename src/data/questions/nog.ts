import type { NOGQuestion } from '../../types/question';

/**
 * EXEMPELFRÅGOR – ersätt/komplettera med egna. Se CONTENT.md.
 */
export const nogQuestions: NOGQuestion[] = [
  {
    id: 'nog-001',
    subTest: 'NOG',
    prompt: 'Är heltalet $n$ delbart med 6?',
    statement1: '$n$ är delbart med 2.',
    statement2: '$n$ är delbart med 3.',
    correctAnswer: 'C',
    tags: ['delbarhet'],
    difficulty: 2,
    explanation:
      'Utsaga (1) ensam räcker inte (t.ex. $n=8$ är delbart med 2 men inte 6). Utsaga (2) ensam räcker inte (t.ex. $n=9$ är delbart med 3 men inte 6). Tillsammans: om $n$ är delbart med både 2 och 3 är det delbart med 6 (eftersom 2 och 3 är relativt prima). Svar: C.',
  },
  {
    id: 'nog-002',
    subTest: 'NOG',
    prompt: 'Vad är värdet av $x$?',
    statement1: '$x + 5 = 12$',
    statement2: '$2x = 14$',
    correctAnswer: 'D',
    tags: ['ekvationer'],
    difficulty: 1,
    explanation:
      'Utsaga (1) ger direkt $x = 7$, vilket är tillräckligt. Utsaga (2) ger $x = 7$, vilket också är tillräckligt. Båda är alltså var för sig tillräckliga. Svar: D.',
  },
  {
    id: 'nog-003',
    subTest: 'NOG',
    prompt: 'Är $x > y$?',
    statement1: '$x + 3 > y + 3$',
    statement2: '$x$ och $y$ är positiva heltal.',
    correctAnswer: 'A',
    tags: ['olikheter'],
    difficulty: 2,
    explanation:
      'Utsaga (1): $x + 3 > y + 3 \\Leftrightarrow x > y$, vilket direkt besvarar frågan – tillräcklig. Utsaga (2) säger bara att båda är positiva heltal, vilket inte avgör vem som är störst – inte tillräcklig. Svar: A.',
  },
  {
    id: 'nog-004',
    subTest: 'NOG',
    prompt: 'Hur stor är arean av en cirkel?',
    statement1: 'Cirkelns omkrets är $10\\pi$.',
    statement2: 'Cirkelns diameter är 10.',
    correctAnswer: 'D',
    tags: ['geometri', 'cirkel'],
    difficulty: 2,
    explanation:
      'Utsaga (1): omkrets $2\\pi r = 10\\pi \\Rightarrow r = 5$, vilket ger arean $\\pi r^2 = 25\\pi$ – tillräcklig. Utsaga (2): diameter 10 ger $r=5$, samma resultat – tillräcklig. Båda är var för sig tillräckliga. Svar: D.',
  },
  {
    id: 'nog-005',
    subTest: 'NOG',
    prompt: 'Ett företag sålde varor för sammanlagt 500 000 kr under ett år. Gick företaget med vinst?',
    statement1: 'Företagets kostnader var lägre i år än förra året.',
    statement2: 'Företagets kostnader var 480 000 kr.',
    correctAnswer: 'B',
    tags: ['vardagsproblem'],
    difficulty: 2,
    explanation:
      'Utsaga (1) säger inget om det faktiska kostnadsbeloppet i förhållande till intäkterna – inte tillräcklig. Utsaga (2) ger kostnaden 480 000 kr, vilket är lägre än intäkterna 500 000 kr, så företaget gick med vinst – tillräcklig. Svar: B.',
  },
];
