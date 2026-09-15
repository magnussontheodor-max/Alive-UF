# Spark — klickspår för demonstration

Åtta steg, ungefär tio minuter. Spåret är byggt för att en investerare ska
förstå produkten utan att någon förklarar den.

Starta med `npm run dev` och öppna `http://localhost:3000`. Demon börjar inne i
produkten — ingen inloggning, ingen onboarding.

All data tillhör en och samma påhittade grundare: **Elin Öberg, 26 år,
Göteborg**, fyra år som redovisningskonsult, bygger ett AI-verktyg för
bokslutsberedning åt små redovisningsbyråer. Hon står mitt i valideringen med
47 kontaktade företag, 6 svar och 52 poäng av 100.

---

## 1 · Hem — var du är och vad du ska göra nu
**Cirka 60 sekunder.**

Peka på tre saker, i den här ordningen:

- **Poängen, 52 av 100.** Säg vad den mäter: *hur mycket som är bevisat*, inte
  hur bra idén låter. Markören på skalan är taket för fasen — 66.
- **Det enda handlingssteget.** Inte en lista, inte en instrumentpanel. En sak.
- **Pulsen till höger.** Varje signal har en mening om varför just den här
  grundaren ska bry sig. Det är funktionen som får folk att öppna appen.

Klicka **Visa underlaget** på nästa steg. Poängen: allt går att spåra.

## 2 · Medgrundaren — låt den säga emot
**Cirka två minuter. Det här är demons hjärta.**

Klicka frågan **"Kan jag ta 2 000 kr i månaden?"**

Svaret börjar med *"Nej. Inte med det underlag du har."* och skrivs fram tecken
för tecken. Låt det gå — texten som byggs upp är vad som får prototypen att
kännas levande.

Säg medan det strömmar: en medgrundare som håller med om allt är värdelös.
Den här säger emot med siffror, inte med åsikter, och varje påstående bär sin
källchip: `4 svar · 6–13 september`.

Peka på **Minnet** till höger — profilen, hjärnan och spåret läses inför varje
svar.

Klicka sedan **"Vilka ska jag kontakta härnäst?"**. Svaret slutar med att ett
verktyg startas. Det är regeln: varje samtal slutar med att något körs.

## 3 · Valideringen — bevisen, inklusive de dåliga
**Cirka två minuter.**

Överst: 47 kontaktade, 6 svar, 12,8 % svarsfrekvens mot 11 % som är normalt i
branschen — en siffra som bara går att ha efter tvåhundra körningar av samma
sak.

Scrolla till de sex svarskorten. **Stanna på Håkan Nordin och Petra Lindqvist.**
Två av sex avvisar idén rakt av. Säg det högt: en demoprodukt där alla svar är
positiva är inte trovärdig.

Avsluta på **Domen: FÖRFINA**. Produkten säger inte "kör". Den säger att
problemet håller men att priset inte gör det.

## 4 · Marknaden — det som inte går att gissa
**Cirka 90 sekunder.**

312 företag. 4,2 Mkr medianomsättning. 18 % som växte. Källa och datum under
varje siffra.

Scrolla till **kundlistan**: tio namngivna företag med ort, omsättning,
antal anställda och kontaktstatus. Säg skillnaden rakt ut — konkurrenterna
levererar en persona, det här är en lista.

## 5 · Poängen — hela argumentet på en skärm
**Cirka två minuter. Den viktigaste skärmen för en investerare.**

Betalningsvilja ligger redan utfälld: 13 av 18, nedbrutet i prissvar från
kunder och köpkraft i segmentet, båda med källa och datum.

Fäll ut **Problem** också. Peka sedan på de tre **låsta** delarna: Produkt,
Traktion, Genomförbarhet. De visas som låsta, inte som noll.

Scrolla till **Taken per fas**: 30 är taket före kundsamtal, 66 efter, 86 efter
lansering, 100 med betalande kunder. Den som inte pratat med en människa kan
aldrig komma över 30, och 85 betyder betalande kunder.

Avsluta på **Höj din poäng** — tre förslag med förväntad ökning och tidsåtgång,
plus den strukturella luckan som inget kundsamtal löser: hon kan inte koda och
har ingen teknisk partner.

## 6 · Resan — tolv steg, fyra faser
**Cirka 60 sekunder.**

Steg 05 ligger utfällt och visar vad som gjordes och vad som kom ut. Klicka på
ett **låst** steg, till exempel 07 — det säger vad som krävs, formulerat som en
upplåsning och inte som ett fel.

## 7 · Profilen och Hjärnan — varifrån idén kom
**Cirka 90 sekunder.**

På **Profilen**: kedjan överst går från fyra år på redovisningsbyrå, genom
anteckningarna, till idén. Poängen är att idén inte kom ur en tom prompt.

På **Hjärnan**: sju anteckningar, några triviala. De som medgrundaren faktiskt
använt är märkta med vilket steg de påverkade. Skriv in en ny anteckning och
lägg till den — fältet fungerar under demon.

## 8 · Tillbaka till Hem — spara det här till sist
**Cirka 60 sekunder. Demons starkaste ögonblick.**

Klicka **Klar** på nästa steg.

Poängen räknas upp animerat från 52 till 57, delarna fylls på, spåret får två
nya rader och ett nytt handlingssteg tar plats.

Klicka **Klar** två gånger till: 61, sedan 64. Efter det säger produkten att
hon är två poäng från taket i fasen och att resten kräver att något byggs och
säljs.

Det är hela argumentet i tre klick: poängen går inte att prata sig till.

---

## Om demonstratören blir avbruten

- **Fritext i chatten fungerar.** Skriv om pris, bygge, marknad, konkurrenter
  eller vem som ska kontaktas så matchar den. Allt annat får ett svar som för
  tillbaka till prisfrågan.
- **Ladda om sidan** för att nollställa poängen till 52 och börja om.
- Sidkolumnen till vänster når alla åtta vyer, och poängen syns i sidhuvudet på
  varenda en.

## Vad som är påhittat

Allt. Företagsnamn, personer, citat, siffror och leverantörer är
demonstrationsdata skriven för att vara trovärdig, inte hämtad. Det finns
ingen backend, inga API-anrop och ingen databas — all data ligger som typade
TypeScript-objekt i `/data`. Registertabellen på Marknaden är diskret märkt.

---

## Designläget

Prototypens utseende går att ändra direkt i webbläsaren — färger, typsnitt,
avstånd, sektionsordning — och exportera. Inget av det syns för en vanlig
besökare.

**Öppna det** med `Cmd + D` (eller `Ctrl + D`). Det fungerar bara när appen
körs med `npm run dev`, eller när `?design=1` ligger i adressen på en byggd
app. Utan något av det gör tangenttryckningen ingenting.

Panelen ligger som ett överlägg till höger och knuffar inte innehållet i
sidled, så det man ser är hur designen faktiskt ser ut.

### Fem flikar

| Flik | Vad den styr |
|---|---|
| Färg | Femton färgtokens med hexfält och färgväljare, fyra färdiga paletter och WCAG-kontrast med röd markering under kravet |
| Typsnitt | Typsnitt för rubriker och brödtext var för sig, hämtade från Google Fonts när de väljs, plus storlek, spärr per nivå, radhöjd och versalläge |
| Layout | Avstånd, hörnradie, linjetjocklek, innehållets bredd, sidomeny till vänster eller överst, kompakt eller luftigt, linjer på eller av |
| Sektioner | Sidans sektioner i ordning — dra för att flytta, ögonikon för att dölja, och variantväljare där det finns flera varianter |
| Export | Kopiera CSS, ladda ner JSON, importera JSON |

### Exportera ett tema

1. Ändra det du vill i panelen.
2. Gå till **Export**.
3. **Kopiera CSS** ger hela `:root`-blocket med nuvarande värden. Klistra in
   det i `app/tokens.css` för att göra temat till prototypens nya utgångsläge.
4. **Ladda ner JSON** sparar hela tillståndet — även sektionsordning, dolda
   sektioner och valda varianter — som `spark-tema.json`. **Importera JSON**
   läser tillbaka det.

Teman sparas också i webbläsaren under `spark-design`. Väljaren i panelens
huvud har `Nytt tema`, `Spara`, `Duplicera` och `Ta bort`, och tre teman finns
från början: Blågrå, Grön och Ljus. **Återställ** går tillbaka till
utgångsläget.

### Medan du arbetar

- `Cmd + Z` ångrar, `Shift + Cmd + Z` gör om. Historiken håller tjugo steg.
- **Håll mellanslag** för att tillfälligt se utgångsläget. Släpp för att se
  ändringen igen.
- Hovra en sektion på sidan så ritas en kontur med sektionens namn.
- De fyra knapparna i panelens fot — 390, 768, 1280 och Full — krymper
  innehållsytan så du ser hur designen beter sig utan att ändra fönstret.

### Varianter som finns att välja mellan

På hemvyn: poängmätaren som **mätare** eller som **ring med dellista**, och
nästa steg som **stor rubrik** eller som **rad med underlaget framme**. På
poängvyn: toppen **med förklaring** eller som **kompakt rad**, och de åtta
delarna som **utfällbar lista** eller som **rutnät**.

### Ta bort designläget

Radera `components/design-mode/` och raden som renderar `<DesignMode />` i
`app/layout.tsx`. Tokenlagret i `app/tokens.css` stannar — prototypen behöver
det — och `data-section`-attributen på sidorna är inert markup utan panelen.
