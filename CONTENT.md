# Lägga till egna frågor

Frågorna ligger som vanliga TypeScript-filer under `src/data/questions/`:

- `xyz.ts` – Kvantitativa jämförelser
- `kva.ts` – Kvantitativa resonemang
- `nog.ts` – Tillräcklig information
- `dtk.ts` – Diagram, tabeller, kartor

Varje fil exporterar en array av frågeobjekt. Öppna filen som liknar den
delprovstyp du vill lägga till, kopiera ett befintligt objekt och ändra
innehållet. De befintliga exempelfrågorna är bara platshållare för att
testa appen – byt gärna ut dem helt mot dina egna.

## Gemensamt för alla frågor

```ts
{
  id: 'kva-007',        // Unikt, stabilt id. Byt aldrig id på en fråga i efterhand
                          // – då nollställs dess repetitionshistorik.
  subTest: 'KVA',        // Måste matcha filens delprovstyp.
  prompt: '...',         // Frågetext.
  explanation: '...',    // Facit-förklaring, visas efter svar.
  tags: ['algebra'],      // Valfritt, används för statistik per ämnesområde.
  difficulty: 2,          // Valfritt: 1 (lätt) – 3 (svår).
}
```

### Matteformler

Text stöder LaTeX-liknande matte via KaTeX:

- Inline: `$x^2 + 1$`
- Blocknotation fungerar också inline i löptext, t.ex. `$\dfrac{1}{2}$`

Tänk på att skriva `\\` istället för `\` när du skriver LaTeX-kommandon i
TypeScript-strängar (t.ex. `'$\\sqrt{16}$'`), eftersom `\` är ett
specialtecken i strängar.

## XYZ – Kvantitativa jämförelser

```ts
{
  id: 'xyz-006',
  subTest: 'XYZ',
  prompt: 'Kontext/villkor som gäller för både I och II.',
  quantityI: '$x + 2$',
  quantityII: '$5$',
  correctAnswer: 'A', // A: I > II, B: II > I, C: I = II, D: går ej avgöra
  explanation: '...',
}
```

## KVA – Kvantitativa resonemang

```ts
{
  id: 'kva-007',
  subTest: 'KVA',
  prompt: 'Frågetext...',
  options: ['Alt A', 'Alt B', 'Alt C', 'Alt D'], // exakt 4 alternativ
  correctIndex: 0, // 0 = A, 1 = B, 2 = C, 3 = D
  explanation: '...',
}
```

## NOG – Tillräcklig information

```ts
{
  id: 'nog-006',
  subTest: 'NOG',
  prompt: 'Vad efterfrågas?',
  statement1: 'Utsaga (1)...',
  statement2: 'Utsaga (2)...',
  correctAnswer: 'C',
  // A: (1) räcker, inte (2)
  // B: (2) räcker, inte (1)
  // C: (1)+(2) tillsammans räcker, men ingen ensam
  // D: (1) och (2) räcker var för sig
  // E: Räcker inte ens tillsammans
  explanation: '...',
}
```

## DTK – Diagram, tabeller, kartor

Samma struktur som KVA, men kan dessutom ha en tabell och/eller bild:

```ts
{
  id: 'dtk-004',
  subTest: 'DTK',
  prompt: 'Fråga om tabellen/diagrammet nedan...',
  table: {
    caption: 'Valfri rubrik',
    rows: [
      ['Kolumn 1', 'Kolumn 2'], // första raden tolkas som rubrikrad
      ['Rad A', '123'],
      ['Rad B', '456'],
    ],
  },
  // imageUrl: '/mina-bilder/diagram1.png', // alternativ till/utöver tabell
  options: ['Alt A', 'Alt B', 'Alt C', 'Alt D'],
  correctIndex: 1,
  explanation: '...',
}
```

Bilder du refererar via `imageUrl` kan läggas i `public/`-mappen (skapa den
om den inte finns) och nås sedan på sökvägen `/filnamn.png`.

## Efter att du lagt till frågor

Inget mer krävs – appen läser automatiskt in alla frågor från
`src/data/questions/index.ts` vid start. Kör `npm run dev` för att se
ändringarna direkt.

En liten sanity-check varnar i konsolen om du råkar återanvända ett `id`.
