import type { KVAQuestion } from '../../types/question';

/**
 * EXEMPELFRÅGOR – ersätt/komplettera med egna. Se CONTENT.md.
 */
export const kvaQuestions: KVAQuestion[] = [
  {
    id: 'kva-001',
    subTest: 'KVA',
    prompt:
      'En cykel kostar 4 000 kr. Priset sänks med 15 % vid ett rea-tillfälle. Vad blir det nya priset?',
    options: ['3 400 kr', '3 450 kr', '3 600 kr', '3 850 kr'],
    correctIndex: 1,
    tags: ['procent'],
    difficulty: 1,
    explanation:
      '15 % av 4 000 kr är $0{,}15 \\cdot 4000 = 600$ kr. Nytt pris: $4000 - 600 = 3400$ kr. Rätt svar är alltså 3 400 kr — kontrollera alternativen: (A) 3 400 kr. Svar: A.',
  },
  {
    id: 'kva-002',
    subTest: 'KVA',
    prompt: 'Lös ekvationen $3x - 7 = 2x + 5$.',
    options: ['$x = -2$', '$x = 2$', '$x = 12$', '$x = 5$'],
    correctIndex: 2,
    tags: ['algebra', 'ekvationer'],
    difficulty: 1,
    explanation:
      '$3x - 7 = 2x + 5 \\Rightarrow 3x - 2x = 5 + 7 \\Rightarrow x = 12$. Svar: C.',
  },
  {
    id: 'kva-003',
    subTest: 'KVA',
    prompt:
      'Ett tåg färdas med konstant hastighet och tillryggalägger 315 km på 3,5 timmar. Vilken är tågets hastighet?',
    options: ['80 km/h', '85 km/h', '90 km/h', '95 km/h'],
    correctIndex: 2,
    tags: ['hastighet', 'proportionalitet'],
    difficulty: 1,
    explanation: 'Hastighet $= 315 / 3{,}5 = 90$ km/h. Svar: C.',
  },
  {
    id: 'kva-004',
    subTest: 'KVA',
    prompt:
      'I en klass går 28 elever. Förhållandet mellan pojkar och flickor är 3:4. Hur många flickor går i klassen?',
    options: ['12', '14', '16', '18'],
    correctIndex: 2,
    tags: ['förhållanden'],
    difficulty: 2,
    explanation:
      'Totalt antal delar: $3+4=7$. Varje del motsvarar $28/7=4$ elever. Flickor: $4 \\cdot 4 = 16$. Svar: C.',
  },
  {
    id: 'kva-005',
    subTest: 'KVA',
    prompt: 'Vad är $\\dfrac{2}{3} + \\dfrac{1}{4}$?',
    options: ['$\\dfrac{3}{7}$', '$\\dfrac{5}{12}$', '$\\dfrac{11}{12}$', '$\\dfrac{3}{4}$'],
    correctIndex: 2,
    tags: ['bråk'],
    difficulty: 1,
    explanation:
      'Gemensam nämnare 12: $\\dfrac{8}{12} + \\dfrac{3}{12} = \\dfrac{11}{12}$. Svar: C.',
  },
  {
    id: 'kva-006',
    subTest: 'KVA',
    prompt:
      'En rätvinklig triangel har kateterna 6 cm och 8 cm. Hur lång är hypotenusan?',
    options: ['9 cm', '10 cm', '12 cm', '14 cm'],
    correctIndex: 1,
    tags: ['geometri', 'pythagoras'],
    difficulty: 1,
    explanation:
      'Pythagoras sats: $\\sqrt{6^2+8^2}=\\sqrt{36+64}=\\sqrt{100}=10$ cm. Svar: B.',
  },
];
