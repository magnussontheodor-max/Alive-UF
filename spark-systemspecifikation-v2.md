# Spark — systemspecifikation v2

En AI-medgrundare för svenska förstagångs- och soloentreprenörer, byggd på
verklig svensk registerdata.

---

## 1. Utgångspunkten

Fonda har byggt den här produkten för den amerikanska marknaden och gjort det
bra. Fjorton steg i fyra faser, minne av varje beslut, ett handlingssteg per
dag, ärlighet när idén är svag. Gratisnivå plus 19 dollar i månaden.

Det som gör Spark till något annat är inte strukturen. Det är **underlaget**.

Fonda kör sin algoritm mot data skrapad från internet. Det är kvalificerade
gissningar med bra språk.

Sverige har något nästan ingen annan marknad har: **fullständig, offentlig
företagsdata**. Varje aktiebolag lämnar in årsredovisning. Det betyder att
Spark kan säga saker som ingen internationell aktör kan säga, om någon marknad
som helst:

> *"Det finns 312 redovisningsbyråer i Sverige med 5–20 anställda.
> Medianomsättning 4,2 miljoner. 18 % växte över 10 % förra året.
> Här är de 40 som växer snabbast — med kontaktuppgifter."*

Det är inte en uppskattning. Det är registret.

### 1.1 Datalöftet

Det här är produktens viktigaste princip och den gäller **varje funktion,
varje steg och varje siffra i hela Spark.**

> **Ingenting i Spark är gissat. Allt har en källa och ett datum.**

Det betyder konkret:

- Marknadens storlek kommer från Bolagsverket och SCB — inte från en modells
  uppskattning.
- Kundlistan är namngivna, existerande företag ur registret — inte påhittade
  personas.
- Omsättning, antal anställda och tillväxt kommer från inlämnade
  årsredovisningar — inte från en webbsökning.
- Konkurrentbilden byggs ur SNI-koder och faktiska bolag — inte ur vad som
  råkar synas på Google.
- Prisunderlaget kommer från riktiga kunders svar och från jämförbara företags
  faktiska ekonomi.
- Efterfrågan bevisas av namngivna personer som svarat på ett mejl — inte av
  en enkät eller en modells bedömning.
- Det formella bygger på verksamt.se och Skatteverket — inte på allmän
  kunskap om bolagsformer.
- Finansieringsmöjligheterna kommer från Almi, Vinnova och Tillväxtverket —
  inte från en lista någon skrivit ihop.

**Varje påstående i gränssnittet visar sin källa och sitt hämtningsdatum.**
Inte *"marknaden växer"* utan *"312 företag, Bolagsverket, hämtat 14
september"*.

Finns ingen källa gör Spark inget påstående. Den säger att den inte vet.

Det är skillnaden mellan en AI som låter säker och en som faktiskt vet — och
det är den enda anledningen till att en grundare ska våga satsa ett år av sitt
liv på vad produkten säger.

---

## 2. Arkitektur

```
┌──────────────────────────────────────────────────┐
│                   REGISTRET                      │
│  Bolagsverket · SCB · allabolag · verksamt ·     │
│  Almi · Vinnova · svensk branschmedia            │
└──────────────────────────────────────────────────┘
                        ▲
┌──────────────────────────────────────────────────┐
│                    MINNET                        │
│      Profilen  ·  Hjärnan  ·  Spåret             │
└──────────────────────────────────────────────────┘
                       ▲ ▼
┌──────────────────────────────────────────────────┐
│                 MEDGRUNDAREN                     │
│   Enda ytan. Rådgivare, samtalspartner, den      │
│   som startar verktyg och säger vad som gäller   │
└──────────────────────────────────────────────────┘
                       ▲ ▼
┌──────────────────────────────────────────────────┐
│        RESAN — 12 steg i 4 faser                 │
└──────────────────────────────────────────────────┘
```

Registret är nytt sedan v1 och är det som gör allt annat trovärdigt. Det är
inte ett verktyg — det är ett lager som flera steg hämtar ur.

---

## 3. Fem kärnfunktioner

Det här är produkten. Stegen är innehållet som flyter genom den.

### 3.1 Medgrundaren

En agent, alltid samma, enda ytan grundaren möter. Läser hela minnet inför
varje svar. Startar verktyg när det är dags. Säger rakt ut vad den tycker.

**Regeln:** varje samtal slutar med att ett verktyg körs eller att grundaren
har en konkret uppgift i verkligheten. Aldrig bara ett svar.

**Tonen:** svensk, rak, ingen peppning. Från Fonda tar vi principen att den
ska döda svaga idéer i stället för att låta någon lägga månader på fel sak.
En medgrundare som håller med om allt är värdelös.

### 3.2 Minnet

Tre lager, olika ägare.

**Profilen** — vem du är. Bakgrund, utbildning, vad du kan, vad du inte kan,
vilka du känner, hur mycket tid och pengar du har, din riskaptit. Byggs genom
samtal, inte formulär. Härifrån kommer idéerna.

**Hjärnan** — ditt eget utrymme. Tankar, irritationer, halvfärdiga idéer,
länkar. Ostrukturerat, frivilligt. Spark läser men städar aldrig.

**Spåret** — allt som händer. Varje samtal, varje registerfynd, varje mejl,
varje svar, varje beslut, varje version. Skrivs automatiskt av verktygen.
Grundaren rapporterar aldrig.

### 3.3 Nästa steg

Varje gång grundaren öppnar Spark: **var du är, vad som hänt sedan sist, vad
du ska göra nu.** Ett handlingssteg. Avslutas det låses nästa upp.

Låsmekaniken är tagen rakt av från Fonda och den är bra — den hindrar att man
hoppar till bygget innan valideringen är gjord, vilket är exakt det misstag
produkten finns för att förhindra.

### 3.4 Poängen

Ett tal mellan 1 och 100, alltid synligt, nedbrutet i åtta delar där varje
poäng går att spåra till en källa.

**Poängen mäter inte hur bra idén är. Den mäter hur mycket som är bevisat.**

Den omfattar hela projektet — marknad, konkurrens, bevis, produkt, traktion.
En grundare som inte pratat med någon kan aldrig komma över 30, oavsett hur
lovande idén låter. Full beskrivning i avsnitt 11.

### 3.5 Pulsen

En daglig svensk marknadssignal, kopplad till grundarens idé och kundsegment.
Nyregistreringar i branschen, kapitalrundor, nedläggningar, prisförändringar,
vad branschmedia skriver.

Fondas motsvarighet skannar amerikanska finansieringsrundor. Vår läser
Bolagsverkets registreringar, Breakit, Di Digital och branschpress — och varje
signal kommer med en mening om varför den spelar roll för just den här
grundaren.

Det här är den funktion som får folk att öppna appen utan att bli tillsagda.

---

## 4. Resan — 12 steg

### FAS 1 · UPPTÄCK

**01 · Om dig**
Samtal som bygger profilen. Bakgrund, kompetens, nätverk, resurser, riskaptit,
vad du redan försökt.

*Från Fonda:* att börja i personen och inte i en tom prompt. Deras starkaste
idé och den som löser Theos ursprungsproblem — att man inte kan formulera en
försvarbar affärsidé utifrån sig själv.

**02 · Möjligheter**
Idéer som är grundade i profilen, korsade med var registret visar luckor.
Branscher med många små företag och låg digitaliseringsgrad. Segment som växer.
Orter där något saknas.

Inte tio generiska startup-idéer. Ett samtal om vad som faktiskt finns i ditt
eget material och i svensk företagsdata.

*Datakällor:* profilen, hjärnan, SCB:s företagsdatabas, SNI-fördelning.

---

### FAS 2 · PRÖVA

**03 · Marknaden**
Riktiga siffror. Antal företag i segmentet, storleksfördelning,
medianomsättning, tillväxttakt, geografisk spridning, vem som redan finns där.

Det här steget är den enskilt största skillnaden mot alla konkurrenter. Där de
uppskattar hämtar vi.

*Datakällor:* Bolagsverket, allabolag, SCB.

**04 · Kunden**
ICP definierad ur registret, inte ur fantasin. SNI-kod, storleksintervall,
omsättningsspann, ort. Resultatet är en **lista på namngivna företag**, inte
en påhittad persona.

*Från Fonda, omgjort:* deras personas-steg är en beskrivning. Vårt är en lista.

**05 · Samtalen**
Spark bygger kontaktlistan, skriver svensk outreach och skickar **från
grundarens egen mejl** via Gmail-koppling. Följer öppningar och svar, skickar
påminnelse efter fyra dagar.

Bara B2B i v1. Svensk lag kräver samtycke i förväg för marknadsföringsmejl
till fysiska personer, men inte när mottagaren är en juridisk person eller när
adressen går via arbetsgivaren.

*Från Fonda:* falsifierbara efterfrågetest i stället för meningslösa enkäter.
*Vår skillnad:* de hjälper dig hitta folk att prata med. Vi skickar mejlen.

**06 · Domen**
Kör, förfina eller pivotera. Baserat på faktiska svar, med citat och siffror.

> *"4 av 6 sa att problemet är verkligt. 3 sa att priset är dubbelt för högt.
> Förfina: gå uppåt i segment eller halvera omfånget."*

Går idén inte igenom pivoteras grundaren till en bättre — inte tillbaka till
ruta ett.

---

### FAS 3 · LANSERA

**07 · Affärsfallet och priset**
Kalkyl med svenska förutsättningar: moms, arbetsgivaravgifter, F-skatt,
kostnadsgolv och break-even.

**Prissättningen är en egen del av steget**, och den är en av de starkaste
tillämpningarna av registerdatan:

- *Vad marknaden tål.* Omsättning och marginal hos de faktiska företag
  grundaren tänker sälja till. Ett företag med 4,2 miljoner i omsättning har
  ett annat utrymme än ett med 40.
- *Vad jämförbara aktörer tar.* Prisnivåer från konkurrenter i samma SNI-kod.
- *Vad kunderna själva sagt.* Prissvaren från steg 05, ordagrant. Det är den
  enda datapunkten som är värd något — sagd av någon som faktiskt skulle köpa.
- *Vad som krävs.* Golvet: vad måste priset minst vara för att gå ihop med
  svenska kostnader och den volym som är realistisk.
- *Modellen.* Månadsavgift, per projekt, freemium eller resultatbaserat — med
  ett argument för vilken som passar just det här segmentet.

Utfallet är ett prisförslag med ett spann och en motivering, inte en siffra
ur luften.

Fondas motsvarighet räknar i amerikanska termer och är oanvändbar här.

**08 · Omfånget**
MVP-innehåll genererat ur bevisen, inte ur idén. *"Bygg bara det de fyra som
svarade faktiskt bad om."*

**09 · Det formella**
Enskild firma eller aktiebolag, registrering hos Bolagsverket, F-skatt,
momsregistrering, bokföringskrav.

Det här steget är helt ombyggt. Fondas version handlar om Delaware C-Corp och
är noll värd i Sverige. Vår är konkret, aktuell och lokal — och den är också
en av de svåraste sakerna att kopiera utifrån.

*Datakällor:* verksamt.se, Skatteverket, Bolagsverket.

**10 · Live**
Landningssida på egen domän med fungerande e-postinsamling, GDPR-text och
delningsbilder. Eller MVP:n själv, byggd och deployad.

Ni har redan gjort det här arbetet åt er själva. Designsystemet, mallen,
integritetspolicyn — det är produktfunktionalitet nu.

---

### FAS 4 · VÄXA

**11 · Första kunderna**
30-dagarsplan mot svenska kanaler. LinkedIn, branschforum, Sweden
Startups-communities, Nyföretagarcentrum, lokala nätverk, branschmässor.

Fondas GTM utgår från Product Hunt och amerikansk startupkultur. Halva det är
oanvändbart här.

**12 · Kapital**
Almi, Vinnova, Tillväxtverket, regionala medel, banklån, bootstrapping.

Fondas steg heter "Raise" och handlar om amerikanska änglar och VC. Den
svenska verkligheten för en förstagångsgrundare är bidrag, lån och egna
pengar. Helt annat innehåll, samma plats i resan.

---

## 5. Vad vi tar från Fonda

| Deras idé | Varför den är bra |
|---|---|
| Börja i personen, inte i idén | Löser problemet att man inte kan formulera en idé utifrån sig själv |
| Ett handlingssteg som låser upp nästa | Hindrar hopp till bygget före valideringen |
| Döda svaga idéer tidigt | Det dyraste misstaget är att inte få veta |
| Minne över sessioner | Det som gör tolv steg till en produkt |
| Daglig marknadssignal | Ger anledning att öppna appen utan påminnelse |
| Falsifierbara test, inte enkäter | Enkäter mäter artighet, inte efterfrågan |
| Metod grundad i forskning | Trovärdighet som inte kostar något att bygga |
| Levererar det tråkiga | Landningssida, affärsfall, MVP-plan |

## 6. Vad vi inte tar

| Deras del | Varför den inte fungerar här |
|---|---|
| Legal & setup | Delaware C-Corp. Värdelöst i Sverige |
| Raise | Amerikansk VC-logik. Här är det Almi, Vinnova och egna pengar |
| GTM-kanaler | Product Hunt-kultur finns knappt i Sverige |
| Marknadsdata från skrapning | Vi har registret. Gissa inte när man kan hämta |
| Personas som beskrivning | Vi levererar en lista på namngivna företag i stället |
| Engelska | En svensk företagare svarar inte på ett engelskt kallmejl |

---

## 7. Registret — vad det faktiskt är

| Källa | Ger oss | Används i steg |
|---|---|---|
| Bolagsverket | Företagsregister, nyregistreringar, bolagsformer | 03, 04, 09, Pulsen |
| allabolag / Ratsit | Omsättning, anställda, tillväxt, SNI | 03, 04, 07 |
| SCB | Branschstatistik, företagsdemografi | 02, 03 |
| verksamt.se · Skatteverket | Krav, blanketter, F-skatt, moms | 09 |
| Almi · Vinnova · Tillväxtverket | Finansieringsmöjligheter | 12 |
| Breakit · Di Digital · branschpress | Marknadssignaler | Pulsen |
| Egen data över tid | Svarsfrekvens per bransch | 05, 06 |

**Den sista raden är det verkliga försvaret.** Efter tvåhundra
valideringskörningar kan Spark säga *"4 % svarsfrekvens är lågt för den
branschen, vi ser normalt 11 %"*. Ingen annan i Sverige kan säga det, och det
går inte att kopiera utan att köra samma volym.

**Att utreda innan ni bygger:** allabolag och Ratsit har användarvillkor,
Bolagsverket har betal-API. Ta reda på vad datan faktiskt kostar och vad ni får
göra med den innan ni bygger produktlöften ovanpå den. Det här är den enskilt
största okända posten i hela planen.

---

## 8. Vad som byggs först

Beroenden, inte vad som är roligast.

1. **Minnet och medgrundaren.** Utan dem är stegen tolv separata produkter.
2. **Registret.** Allt som gör er annorlunda hänger på det.
3. **Steg 01 → 06, hela vägen ut.** Upptäck och pröva. Det är där er fördel är
   störst och konkurrenternas svagast.
4. **Steg 07 → 12,** ett i taget.

Bygget ligger sist av produktskäl, inte bara ekonomiska: en grundare som
bygger före steg 06 bygger fel sak, och det är hela anledningen till att
produkten finns.

---

## 9. Ekonomin, kort

Fonda tar 19 dollar i månaden, cirka 180 kronor. Det sätter prisförväntningen
på er marknad.

Kostnadsmodellen visar att allt utom bygget kostar ungefär 8 kronor per aktiv
grundare och månad. Bygget kostar 69 kronor till.

Slutsatsen är tydlig: **steg 01–09 och 11–12 kan vara prenumeration. Bygget
kan det inte.** Sälj bygget separat, per projekt eller per credit.

---

## 10. Den öppna frågan

Hur många i Sverige startar ett digitalt företag för första gången varje år,
och hur många av dem betalar 200 kronor i månaden för hjälp?

Ingen av oss vet. Men den siffran avgör om det här är ett företag eller ett
projekt — och den går att räkna fram ur exakt samma register som är er
produktfördel.

Det vore en lämplig första övning: använd er tänkta datakälla för att
dimensionera er egen marknad. Fungerar det, har ni både ett svar och ett bevis
på att produkten gör det ni påstår.

---

## 11. Poängen

### 11.1 Principen

Poängen mäter **bevisgrad, inte idékvalitet.**

Det är skillnaden mellan en siffra som motiverar och en som lurar. En AI som
läser en idé och sätter 85 baserat på hur det låter är värdelös — och farlig,
eftersom någon då lägger ett år på fel sak med en hög siffra som stöd.

Vår poäng börjar lågt för alla. Inte för att idén är dålig, utan för att
ingenting är prövat än. Den stiger när grundaren gör verkligt arbete.

Tre följder av det:

**Den går inte att fejka.** Man kan inte prata sig till poäng. Bara bevisa sig
till dem.

**Den motiverar rätt beteende.** Poängen stiger när man gör det jobbigaste
steget — att kontakta riktiga människor. Det är precis det man annars skjuter
upp.

**85+ betyder något.** Den nivån går bara att nå med betalande kunder. En
grundare som står där *ska* gå all in — siffran vilar inte på en bra idé utan
på ett fungerande företag.

### 11.2 Skalan och de åtta delarna

**Skalan är 1–100.** Aldrig noll — en grundare som precis börjat har 1, inte
ingenting. Skillnaden är psykologiskt avgörande.

Poängen mäter **hela projektet**, inte bara idén. Antagandena, marknaden,
konkurrensen, bevisen, bygget, lanseringen och de första kunderna. Allt som
avgör om det här blir ett företag.

| Del | Vikt | Vad den mäter | Källa |
|---|---|---|---|
| **Marknad** | 12 | Finns tillräckligt många köpare? | Bolagsverket, SCB |
| **Konkurrens** | 8 | Hur trångt är det, finns en lucka? | SNI-register, allabolag |
| **Passform** | 10 | Kan just du bygga och sälja det här? | Profilen |
| **Problem** | 18 | Säger riktiga kunder att problemet är verkligt? | Steg 05 |
| **Betalningsvilja** | 18 | Vill de betala, och tål de ditt pris? | Steg 05 + allabolag |
| **Produkt** | 12 | Bygger du det bevisen stöder, och är det byggt? | Steg 08–10 |
| **Traktion** | 14 | Använder och betalar någon på riktigt? | Steg 10–11 |
| **Genomförbarhet** | 8 | Räcker tid, pengar, kompetens? Är det formella klart? | Profilen, steg 09 |

### 11.3 Taken per fas

Poängen är låst av var i resan grundaren är. Det är inte en begränsning —
det är hela poängen.

| Efter fas | Max | Vad som krävs för mer |
|---|---|---|
| Upptäck (01–02) | ~18 | Du har en idé och en profil. Inget är prövat. |
| Pröva, före samtal (03–04) | **30** | Du vet hur marknaden ser ut. Ingen har sagt något. |
| Pröva, efter samtal (05–06) | **66** | Riktiga kunder har svarat. Nu vet du något. |
| Lansera (07–10) | **86** | Du har byggt det bevisen stöder och det är live. |
| Växa (11–12) | **100** | Någon använder och betalar. |

**Den som inte pratat med en enda människa kan aldrig komma över 30.** Det är
den mest effektiva uppmaning produkten kan ge, och den kräver ingen pekpinne.

**Och 85+ betyder att du har betalande kunder.** Det är därför siffran är värd
att lita på — den kan inte nås med en bra idé, bara med ett fungerande företag.

### 11.4 Nivåerna

| Poäng | Färg | Betyder | Vad Spark säger |
|---|---|---|---|
| 1–29 | Röd | Oprövat | *Du vet för lite än. Här är nästa steg.* |
| 30–49 | Orange | Underbyggt men obevisat | *Marknaden finns. Nu måste du prata med folk.* |
| 50–69 | Gul | Efterfrågan bekräftad | *Du har belägg. Bygg det minsta som testar resten.* |
| 70–84 | Grön | Byggt och lanserat | *Det finns. Nu ska någon börja använda det.* |
| 85–100 | Stark | Bevisad affär | *Kör. Du har det de flesta saknar efter ett år.* |

### 11.5 Nedbrytningen

Poängen visas aldrig som bara ett tal. Varje del öppnas och visar exakt vad
den bygger på:

```
BETALNINGSVILJA          13 / 18

  Prissvar från kunder     9 / 11
    3 av 4 svarande angav ett pris
    Median 900 kr/mån · ditt pris 2 000 kr
    Källa: 4 svar, 5–12 september

  Köpkraft i segmentet     4 /  7
    Medianomsättning 4,2 Mkr
    Källa: allabolag, 312 företag, 14 september

  → Problemet är inte viljan. Det är nivån.
    Gå uppåt i segment eller halvera omfånget.
```

**Regeln:** varje poäng har en källa och ett datum. Finns ingen källa ges
ingen poäng. Delar som inte går att bevisa än visas som låsta, inte som noll —
skillnaden mellan *"vi vet inte"* och *"det är dåligt"* är avgörande för om
grundaren fortsätter.

### 11.6 Spelmekaniken

**Poängen syns alltid**, i huvudet på varje sida.

**Varje steg visar vad det kan ge.** *"Steg 05 kan ge upp till 36 poäng."*
Det gör kostnaden av att skjuta upp synlig.

**Rörelse markeras.** *"+14 sedan i måndags."* Riktning motiverar mer än nivå.

**Poängen kan gå ner.** Om nya svar motsäger tidigare sjunker den. En siffra
som bara kan stiga är en lögn, och grundaren kommer sluta lita på den.

**Ingen jämförelse mot andra grundare.** Topplistor skulle göra det här till
en tävling i optimism i stället för i bevis.

### 11.7 Den viktigaste spärren

**Poängen säger aldrig "bygg".** Den säger vad som är bevisat och vad som inte
är det.

Om en grundare når 85 och idén ändå är dålig har vi byggt något skadligt. Därför
måste varje delpoäng kräva extern evidens, inte modellens omdöme. En språkmodell
som bedömer hur lovande en idé låter kommer systematiskt sätta för höga siffror
— den är tränad att vara tillmötesgående.

**Genomförandet:** poängen räknas i kod från strukturerad data, inte av en
språkmodell. Modellen läser svaren och extraherar fakta — *sa de att problemet
var verkligt: ja/nej, angav de ett pris: ja/nej*. Beräkningen sker sedan i en
vanlig funktion.

Det är också det som gör poängen försvarbar i en jurysituation: den går att
räkna för hand.

### 11.8 Nästa poäng — förslagen

En poäng som bara diagnostiserar skapar ångest. Den måste alltid säga hur man
höjer den, och förslaget måste komma ur grundarens egen data.

Generiska råd är värdelösa. *"Prata med fler kunder"* hjälper ingen.
*"Kontakta de här 40 — de växer snabbast i ditt segment och registret visar
att de har råd"* är något helt annat.

**Formatet:**

```
HÖJ DIN POÄNG                          nu 52 / 100

+14   Skicka till 40 fler företag                    ~20 min
      Du har 4 svar. Vid 10 blir underlaget
      användbart i stället för antydande.
      Registret: 312 matchar, 272 okontaktade.
      → Kör steg 05 igen

+8    Testa 900 kr i stället för 2 000               ~30 min
      3 av 4 svarande angav omkring 900 kr.
      Fråga samma fyra om de skulle köpa där.
      → Skicka uppföljning

+6    Snäva segmentet till 10–20 anställda            ~5 min
      Alla tre som sa ja har 10+ anställda.
      Ingen under 5 anställda svarade.
      → Uppdatera kundprofilen
```

**Sorteringen är poäng per insats**, inte poäng. Det billigaste stora steget
först. En grundare som ser *"+14 för tjugo minuters arbete"* gör det. Samma
grundare som ser *"+14"* utan tidsangivelse skjuter upp det.

### 11.9 Tre sorters luckor

Förslagen måste skilja på varför en del är låg, annars ger de fel råd.

**Otillräckligt underlag** → gör mer av samma.
*"Fyra svar räcker inte. Skicka till fler."* Åtgärden är volym.

**Motsägande underlag** → ändra något.
*"De säger ja till problemet men nej till priset."* Åtgärden är att justera
idén, inte att samla mer data. Här är det vanligaste felet att grundaren
fortsätter samla svar som säger samma sak.

**Strukturell lucka** → arbete löser det inte.
*"Du kan inte bygga det här själv och har ingen teknisk partner."* Åtgärden är
att hitta en partner, snäva omfånget till något som går utan kod, eller välja
en annan idé. Spark ska säga det rakt ut i stället för att föreslå ännu ett
kundsamtal.

Låsta delar visas inte som förslag. *"Betalningsvilja låses upp efter steg
05"* — inte *"+18 tillgängliga"*, för det är inte sant än.

### 11.10 Spärren mot att spela systemet

Risken med poäng och förslag tillsammans är att grundaren optimerar för
siffran i stället för för sanningen. Det vore värre än ingen poäng alls.

Tre regler:

**Förslag får aldrig höja poängen utan att öka kunskapen.** Spark föreslår
aldrig *"kontakta 200 till"* när problemet är att mejlet är dåligt skrivet.
Då föreslår den att mejlet skrivs om.

**Fler svar av samma sort ger avtagande poäng.** Svar fem till tio är värda
mycket. Svar tjugo till trettio nästan ingenting. Det hindrar att någon
mekaniskt mejlar sig till toppen.

**Motsägande svar räknas fullt ut.** Ett nej väger lika tungt som ett ja. En
grundare som bara hör av de nöjda får inte en högre poäng — hen får en lägre,
eftersom underlaget är skevt.
