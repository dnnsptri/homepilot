import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#001E46] hover:text-[#001E46] transition-colors">
            <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
          </Link>
          <nav className="flex space-x-6">
            <Link href="/about" className="text-[#011E46] font-medium underline transition-colors">
              Over HomePilot
            </Link>
            <span className="text-gray-400 cursor-not-allowed">
              Inloggen
            </span>
          </nav>
        </div>
      </header>

      {/* About Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-[#001E46] mb-8">
              HomePilot, dé link tussen koper en verkoper
          </h1>
          
          <div className="prose prose-lg text-[#001E46] space-y-6">
            <p>
              HomePilot brengt potentiële kopers en verkopers bij elkaar.
              Niet via de ruis van makelaarsplatforms, niet de eindeloze vergelijkingen.
              Maar gewoon de juiste koper, voor uw huis, op dit moment.
            </p>

            <p>
              Vroeger vond u misschien nog weleens een briefje in de bus van iemnand die uw huis geweldig vond.
              Een huis kopen of verkopen aan de juiste persoon werd steeds ingewikkelder:
              Kosten stapelden zich op. Bezichtigingen werden procedures.
              We verloren de eenvoud van iemand die zegt: "Dit is precies het huis dat ik zoek."
            </p>

            <p>
              En HomePilot helpt hierbij:< br />
              - We zijn geen marktplaats.< br />
              - Geen dashboard vol statistieken.< br />
              -Het is de kortere lijn tussen verkoper en koper.
            </p>

            <p>
              We vragen om een simpel signaal:
              Bent u bereid om te praten, als de interesse écht is?
            </p>

            <p>
              Geen haast, geen druk.
              Alleen helderheid, verbinding en keuzevrijheid.
            </p>

            <p>
              We bouwen HomePilot niet voor schaal in aantallen.
              We bouwen het voor betekenis:
              voor gesprekken die tellen,
              voor transacties die eerlijk voelen,
              voor mensen die hun huis toevertrouwen aan de juiste koper.
            </p>

            <p>
              HomePilot is een ode aan de persoonlijke woningmarkt.
              Aan de tijd dat een verkoop voelde als een handdruk,
              niet als een dossier.
            </p>

            <p>
              Als u gelooft dat een huis verkopen meer is dan een transactie,
              dan past HomePilot bij u.
            </p>

            <p className="text-xl leading-relaxed font-semibold">
              Dit is HomePilot. Uw woning, Hun droom.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <ul className="space-y-2 text-gray-600">
              <li>Vragen? Neem contact op via <a href="mailto:hey@homepilot.nl" className="text-[#0C5CD3] hover:text-[#011E46] hover:underline transition-colors">hey@homepilot.nl</a></li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 