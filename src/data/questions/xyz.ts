import type { XYZQuestion } from '../../types/question';

/**
 * EXEMPELFRÅGOR – ersätt/komplettera med egna. Se CONTENT.md.
 * Dessa är enbart till för att testa appen och är inte hämtade från
 * skarpa högskoleprov.
 */
export const xyzQuestions: XYZQuestion[] = [
  {
    id: 'xyz-001',
    subTest: 'XYZ',
    prompt: 'x och y är positiva heltal och $x + y = 10$.',
    quantityI: '$x \\cdot y$',
    quantityII: '$21$',
    correctAnswer: 'D',
    tags: ['algebra', 'olikheter'],
    difficulty: 2,
    explanation:
      'Produkten $x \\cdot y$ maximeras när $x$ och $y$ ligger nära varandra (t.ex. $5 \\cdot 5 = 25$) och minimeras när de ligger långt ifrån varandra (t.ex. $1 \\cdot 9 = 9$). Eftersom produkten kan vara både större än, mindre än och lika med 21 beroende på val av $x$ och $y$ går det inte att avgöra storleksförhållandet. Svar: D.',
  },
  {
    id: 'xyz-002',
    subTest: 'XYZ',
    prompt: 'En rektangel har omkretsen 24 cm.',
    quantityI: 'Rektangelns area om den är en kvadrat',
    quantityII: '30 cm²',
    correctAnswer: 'A',
    tags: ['geometri'],
    difficulty: 1,
    explanation:
      'Om rektangeln är en kvadrat med omkrets 24 är varje sida $24/4 = 6$ cm, vilket ger arean $6 \\cdot 6 = 36$ cm². Eftersom $36 > 30$ är I större än II. Svar: A.',
  },
  {
    id: 'xyz-003',
    subTest: 'XYZ',
    prompt: '$a = 3$',
    quantityI: '$2^a$',
    quantityII: '$a^2$',
    correctAnswer: 'B',
    tags: ['potenser'],
    difficulty: 1,
    explanation:
      'Med $a=3$: $2^a = 2^3 = 8$ och $a^2 = 3^2 = 9$. Eftersom $9 > 8$ är II större än I. Svar: B.',
  },
  {
    id: 'xyz-004',
    subTest: 'XYZ',
    prompt: 'Priset på en vara sänks först med 20 % och sedan höjs det nya priset med 20 %.',
    quantityI: 'Slutpriset',
    quantityII: 'Ursprungspriset',
    correctAnswer: 'B',
    tags: ['procent'],
    difficulty: 2,
    explanation:
      'Om ursprungspriset är $p$ blir priset efter sänkningen $0{,}8p$, och efter höjningen $0{,}8p \\cdot 1{,}2 = 0{,}96p$. Eftersom $0{,}96p < p$ är II (ursprungspriset) större. Svar: B.',
  },
  {
    id: 'xyz-005',
    subTest: 'XYZ',
    prompt: 'x är ett tal sådant att $x^2 = 16$.',
    quantityI: '$x$',
    quantityII: '$4$',
    correctAnswer: 'D',
    tags: ['ekvationer'],
    difficulty: 1,
    explanation:
      'Ekvationen $x^2=16$ har två lösningar: $x=4$ eller $x=-4$. Eftersom $x$ inte är entydigt bestämt kan I vara både lika med och mindre än II. Informationen räcker inte. Svar: D.',
  },
];
