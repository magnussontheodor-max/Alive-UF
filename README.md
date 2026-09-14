# Spark — klickbar prototyp

En demonstrationsprototyp av Spark, en AI-medgrundare för svenska
förstagångsentreprenörer. Byggd för att visas upp för investerare och
rådgivare.

**Det här är inte en produkt som ska byggas vidare på.** All data är påhittad
och hårdkodad: ingen backend, inga API-anrop, ingen databas, ingen inloggning.
Den är optimerad för hur den upplevs under tio minuters klickande.

## Kom igång

```bash
npm install
npm run dev
```

Öppna `http://localhost:3000`. Se **[DEMO.md](DEMO.md)** för ett föreslaget
klickspår på åtta steg.

## Vad som finns

Åtta vyer, alla nåbara ur vänsterkolumnen, med poängen i sidhuvudet på varenda
en:

| Vy | Vad den visar |
|---|---|
| Hem | Poängmätaren, ett enda handlingssteg, spåret och Pulsen |
| Medgrundaren | Chatt med strömmande svar, källchips och verktyg som startas |
| Resan | Tolv steg i fyra faser, avklarade och låsta |
| Poängen | Åtta delar nedbrutna till källa och datum, taken per fas, förslag |
| Marknaden | Registerdata, storleksfördelning, namngiven kundlista, konkurrenter |
| Valideringen | 47 utskick, 6 svar ordagrant, tre antaganden och domen |
| Hjärnan | Grundarens egna anteckningar, med markering för vad som använts |
| Profilen | Vem grundaren är och varför idén kom härifrån |

## Teknik

- Next.js App Router, TypeScript, Tailwind
- All data i `/data` som typade TypeScript-objekt
- React state för allt som ändras under demon (`components/DemoState.tsx`)
- Enda externa beroendet utöver ramverket är `lucide-react` och Chakra Petch
  via `next/font/google`

## Vad som är interaktivt

- **Klar** på nästa steg räknar upp poängen animerat, fyller delarna, skriver
  till spåret och låser upp ett nytt handlingssteg. Tre gånger, 52 → 64.
- Chatten svarar på fyra föreslagna frågor och på fritext via
  nyckelordsmatchning, med tecken-för-tecken-strömning.
- Delarna på Poängen och stegen på Resan fälls ut.
- Hjärnan tar emot nya anteckningar.

Ladda om sidan för att nollställa demon.
