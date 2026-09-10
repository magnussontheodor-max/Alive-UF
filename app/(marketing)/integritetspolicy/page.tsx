import type { Metadata } from "next";
import Link from "next/link";
import SparkMark from "@/components/brand/SparkMark";

export const metadata: Metadata = {
  title: { absolute: "Integritetspolicy · Spark" },
  description:
    "Så behandlar Spark de personuppgifter du lämnar när du anmäler dig till listan för tidig tillgång.",
  alternates: { canonical: "/integritetspolicy" },
};

// ---------------------------------------------------------------------------
// Integritetspolicy
//
// A complete Swedish draft covering what a pre-launch signup list actually
// collects. Written to be read by a person, not to be defensible in the
// abstract: it names the two fields, the one purpose, the one legal ground,
// and the two links that undo it.
//
// It is a draft. It is not legal advice, and the placeholders below marked
// with [...] have to be filled in before launch.
// ---------------------------------------------------------------------------

const UPDATED = "8 september 2026";

export default function PrivacyPage() {
  return (
    <main className="b-legal">
      <div className="b-inner">
        <Link href="/" aria-label="Spark, till startsidan">
          <SparkMark />
        </Link>

        <h1 className="b-legal-h1">Integritetspolicy</h1>
        <p className="b-legal-meta">Senast uppdaterad {UPDATED}</p>

        <h2 className="b-legal-h2">Vilka vi är</h2>
        <p>
          Spark är ett UF-företag — ett övningsföretag inom Ung Företagsamhet — som
          drivs av elever vid [SKOLANS NAMN] i Stockholm. UF-företag registreras hos
          Ung Företagsamhet och inte hos Bolagsverket, och har därför inget
          organisationsnummer. Vårt UF-företags-ID är [UF-ID].
        </p>
        <p>
          Eftersom ett UF-företag inte är en egen juridisk person är det vi som driver
          företaget som är personuppgiftsansvariga för de uppgifter som beskrivs här.
          Du når oss på <a className="b-underline" href="mailto:[KONTAKT@DOMÄN]">[KONTAKT@DOMÄN]</a>.
        </p>

        <h2 className="b-legal-h2">Vilka uppgifter vi samlar in</h2>
        <p>
          Bara det du själv skriver i formuläret på startsidan:
        </p>
        <ul className="b-legal-list">
          <li>
            <strong>Din e-postadress.</strong> Obligatorisk — utan den kan vi inte höra av oss.
          </li>
          <li>
            <strong>Vad du vill bygga.</strong> Frivillig fritext, högst 500 tecken. Du väljer
            själv vad du skriver där. Skriv inte känsliga uppgifter om dig själv eller andra.
          </li>
        </ul>
        <p>
          Vi sparar också vilken källa besöket kom ifrån (till exempel en{" "}
          <code>utm_source</code>-parameter i länken) samt tidpunkten för anmälan. Vi samlar
          inte in namn, telefonnummer, adress eller betalningsuppgifter, och vi köper inte in
          uppgifter om dig från någon annan.
        </p>

        <h2 className="b-legal-h2">Varför vi behandlar dem</h2>
        <p>
          För ett enda ändamål: att kontakta dig när Spark öppnar, och att förstå vad
          människor vill bygga så att vi bygger rätt saker först. Vi skickar inget
          nyhetsbrev och inga påminnelser under tiden.
        </p>

        <h2 className="b-legal-h2">Laglig grund</h2>
        <p>
          Samtycke, artikel 6.1 a i dataskyddsförordningen. Du lämnar det genom att
          själv fylla i formuläret. Du kan när som helst ta tillbaka det, utan att ange
          något skäl — se <em>Dina rättigheter</em> nedan. Att du tar tillbaka samtycket
          påverkar inte att behandlingen var laglig dessförinnan.
        </p>

        <h2 className="b-legal-h2">Hur länge vi sparar dem</h2>
        <p>
          Till dess att Spark har lanserats och vi har hört av oss, dock längst{" "}
          <strong>24 månader</strong> från din anmälan. Därefter raderas uppgifterna.
          Ber du oss radera tidigare gör vi det direkt.
        </p>

        <h2 className="b-legal-h2">När UF-året tar slut</h2>
        <p>
          Ett UF-företag avvecklas i juni. Om vi då inte fortsätter driva Spark i någon
          annan form raderar vi alla uppgifter vi samlat in. Fortsätter vi, hör vi av
          oss innan uppgifterna förs över och du får möjlighet att säga nej.
        </p>

        <h2 className="b-legal-h2">Vilka som får se dem</h2>
        <p>
          Vi säljer inte uppgifter och delar dem inte för någon annans marknadsföring.
          De behandlas av Supabase (databasen) och Brevo (bekräftelsemejlet) som
          personuppgiftsbiträden åt oss, båda med lagring inom EU. Sidan driftas av
          Vercel, ett amerikanskt bolag, där viss behandling kan ske utanför EU med
          stöd av EU-kommissionens standardavtalsklausuler.
        </p>
        <p>
          Vår besöksstatistik är cookiefri och kopplas inte till dig som person. Därför
          har den här sidan ingen cookiebanner: vi sätter inga cookies som kräver ditt
          samtycke.
        </p>

        <h2 className="b-legal-h2">Överföring utanför EU/EES</h2>
        <p>
          Vi väljer i första hand leverantörer med lagring inom EU/EES. Om en överföring
          till tredjeland ändå sker vilar den på EU-kommissionens standardavtalsklausuler.
        </p>

        <h2 className="b-legal-h2">Dina rättigheter</h2>
        <p>Du har rätt att:</p>
        <ul className="b-legal-list">
          <li>få veta vilka uppgifter vi har om dig, och få en kopia av dem</li>
          <li>få felaktiga uppgifter rättade</li>
          <li>
            få uppgifterna raderade — det gör du själv med länken{" "}
            <em>Radera allt ni har om mig</em> längst ned i bekräftelsemejlet, eller genom
            att mejla oss
          </li>
          <li>
            ta tillbaka ditt samtycke — länken <em>Ta bort mig från listan</em> i samma mejl
          </li>
          <li>invända mot behandlingen och begära att den begränsas</li>
          <li>få ut dina uppgifter i ett maskinläsbart format (dataportabilitet)</li>
        </ul>
        <p>
          Vill du utöva någon av rättigheterna mejlar du{" "}
          <a className="b-underline" href="mailto:[KONTAKT@DOMÄN]">[KONTAKT@DOMÄN]</a>. Vi
          svarar inom en månad.
        </p>

        <h2 className="b-legal-h2">Ålder</h2>
        <p>
          Du behöver vara minst 13 år för att anmäla dig. Är du yngre ber vi dig låta
          en vårdnadshavare göra det åt dig.
        </p>

        <h2 className="b-legal-h2">Klagomål</h2>
        <p>
          Tycker du att vi behandlar dina uppgifter fel har du rätt att klaga hos
          Integritetsskyddsmyndigheten (IMY), Box 8114, 104 20 Stockholm,{" "}
          <a className="b-underline" href="https://www.imy.se" rel="noopener noreferrer">
            imy.se
          </a>
          .
        </p>

        <h2 className="b-legal-h2">Ändringar</h2>
        <p>
          Ändrar vi något väsentligt i den här policyn mejlar vi dig innan ändringen
          börjar gälla. Datumet högst upp visar när den senast uppdaterades.
        </p>

        <p className="b-legal-back">
          <Link href="/" className="b-underline">
            Tillbaka till startsidan
          </Link>
        </p>
      </div>
    </main>
  );
}
