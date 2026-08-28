# Alive-UF – Pluggmotorn för Högskoleprovet

En webbapp för att öva på den **kvantitativa delen** av Högskoleprovet:

- **XYZ** – Kvantitativa jämförelser
- **KVA** – Kvantitativa resonemang
- **NOG** – Tillräcklig information
- **DTK** – Diagram, tabeller, kartor

## Funktioner

- **Öva** – fri övning per delprov, direkt facit och förklaring efter varje fråga.
- **Repetition** – spaced repetition (förenklad SM-2, likt Anki): frågor du
  missat (eller aldrig sett) dyker upp igen i lagom takt tills de sitter.
- **Provsimulering** – tidsbegränsat pass över valda delprov, ingen feedback
  förrän du lämnar in, precis som på riktiga provet.
- **Statistik** – träffsäkerhet totalt, per delprov, per ämnestagg, samt
  aktivitet över tid. Allt sparas lokalt i webbläsaren (`localStorage`) – inget
  konto, inget skickas till någon server.

Matteuttryck renderas med [KaTeX](https://katex.org/).

## Komma igång

```bash
npm install
npm run dev
```

Öppna sedan `http://localhost:5173`.

Bygg för produktion:

```bash
npm run build
npm run preview
```

## Lägga till egna frågor

Appen levereras med ett litet antal exempelfrågor per delprov – bara för att
kunna testa flödet. Se **[CONTENT.md](./CONTENT.md)** för hur du lägger till
eller ersätter dem med egna frågor.

## Teknik

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) för styling
- [React Router](https://reactrouter.com/) för navigering
- [KaTeX](https://katex.org/) för matematisk notation
- Ingen backend – all progress och statistik sparas i `localStorage` i din
  webbläsare.

## Projektstruktur

```
src/
  types/          Datamodeller (frågor, progress/SRS)
  data/questions/ Frågebanken, uppdelad per delprov
  lib/            SM-2, statistik, storage, hjälpfunktioner
  context/        ProgressContext – global state för progress/SRS
  components/     Återanvändbara UI-komponenter
  pages/          Sidor: Hem, Öva, Repetition, Provsimulering, Statistik
```
