import type { DTKQuestion } from '../../types/question';

/**
 * EXEMPELFRÅGOR – ersätt/komplettera med egna. Se CONTENT.md.
 * DTK-frågor kan innehålla en tabell (`table`) och/eller en bild (`imageUrl`,
 * t.ex. ett diagram eller en karta).
 */
export const dtkQuestions: DTKQuestion[] = [
  {
    id: 'dtk-001',
    subTest: 'DTK',
    prompt: 'Vilket år var skillnaden mellan export och import störst enligt tabellen?',
    table: {
      caption: 'Export och import, miljoner kr, 2019–2022',
      rows: [
        ['År', 'Export', 'Import'],
        ['2019', '420', '380'],
        ['2020', '390', '410'],
        ['2021', '460', '400'],
        ['2022', '510', '470'],
      ],
    },
    options: ['2019', '2020', '2021', '2022'],
    correctIndex: 2,
    tags: ['tabell', 'differens'],
    difficulty: 2,
    explanation:
      'Differenser (export − import): 2019: $420-380=40$. 2020: $390-410=-20$. 2021: $460-400=60$. 2022: $510-470=40$. Störst absolut skillnad (60) fås 2021. Svar: C.',
  },
  {
    id: 'dtk-002',
    subTest: 'DTK',
    prompt:
      'Enligt tabellen, hur stor var den procentuella ökningen av exporten från 2019 till 2022?',
    table: {
      caption: 'Export och import, miljoner kr, 2019–2022',
      rows: [
        ['År', 'Export', 'Import'],
        ['2019', '420', '380'],
        ['2020', '390', '410'],
        ['2021', '460', '400'],
        ['2022', '510', '470'],
      ],
    },
    options: ['ca 11 %', 'ca 15 %', 'ca 18 %', 'ca 21 %'],
    correctIndex: 3,
    tags: ['tabell', 'procent'],
    difficulty: 2,
    explanation:
      'Ökning: $(510-420)/420 = 90/420 \\approx 0{,}214 \\approx 21\\%$. Svar: D.',
  },
  {
    id: 'dtk-003',
    subTest: 'DTK',
    prompt:
      'Ett stapeldiagram visar antal sålda enheter av produkt A och B per kvartal. Kvartal 1: A=120, B=90. Kvartal 2: A=150, B=130. Kvartal 3: A=100, B=140. Kvartal 4: A=180, B=160. Under vilket kvartal sålde produkt B fler enheter än produkt A?',
    options: ['Kvartal 1', 'Kvartal 2', 'Kvartal 3', 'Kvartal 4'],
    correctIndex: 2,
    tags: ['diagram', 'jämförelse'],
    difficulty: 1,
    explanation:
      'Endast under kvartal 3 är B (140) större än A (100). Svar: C.',
  },
];
