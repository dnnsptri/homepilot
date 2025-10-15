import Link from 'next/link'
import { useRouter } from 'next/router'

export default function About() {
  const router = useRouter()
  const isLp2 = router.query.lp === '2'
  const heroBg = isLp2 ? '#3D6B53' : '#32608E'
  const heroImage = isLp2 ? '/images/HP_header2.png' : '/images/HP_header.png'
  const contentTextColor = isLp2 ? '#0B2918' : '#001E46'
  const linkClass = isLp2
    ? 'text-[#30A661] hover:text-[#0B2918] hover:underline transition-colors'
    : 'text-[#0C5CD3] hover:text-[#011E46] hover:underline transition-colors'
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-white pb-16" style={{ backgroundColor: heroBg }}>
        {/* Header Navigation */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <Link href={isLp2 ? '/lp2' : '/'} className="text-2xl font-bold text-white hover:text-white transition-colors">
              <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
            </Link>
            <nav className="flex space-x-6">
              <Link href="/about" className="text-white font-medium underline transition-colors">
                Over HomePilot
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            HomePilot, dé link<br />tussen koper en verkoper
          </h1>
          
          {/* Hero Visual */}
          <div className="max-w-4xl mx-auto mb-8">
            <img 
              src={heroImage}
              alt="HomePilot Header Visual" 
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We brengen potentiële kopers en verkopers bij elkaar. 
            Niet via de ruis van makelaarsplatforms, maar gewoon de juiste koper, 
            voor uw huis, op dit moment.
          </p>
          <div className="mt-12 mb-2 flex justify-center">
            <img src="/images/HP_bm.svg" alt="HomePilot beeldmerk" className="h-10 w-auto" />
          </div>
        </div>
      </section>

      {/* About Content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            
            <div className="prose prose-lg space-y-6" style={{ color: contentTextColor }}>
              <p>
                Vroeger vond u misschien nog weleens een briefje in de bus van iemand die uw huis geweldig vond.
                Een huis kopen of verkopen aan de juiste persoon werd steeds ingewikkelder:
                Kosten stapelden zich op. Bezichtigingen werden procedures.
                We verloren de eenvoud van iemand die zegt: "Dit is precies het huis dat ik zoek."
              </p>

              <p>
                En HomePilot helpt hierbij:<br />
                - We zijn geen marktplaats.<br />
                - Geen dashboard vol statistieken.<br />
                - Het is de kortere lijn tussen verkoper en koper.
              </p>

              <p>
                <span className="font-bold">We hebben eigenlijk één simpele vraag:</span><br />
                Bent u bereid om te praten, als de interesse écht is?
                Geen haast, geen druk. Alleen helderheid, verbinding en keuzevrijheid.
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
                Wanneer u net als wij gelooft dat een huis verkopen meer is dan een transactie, dan past HomePilot perfect bij u. En heeft u vragen?<br />
                Neem contact op via <a href="mailto:hey@homepilot.nl" className={linkClass}>hey@homepilot.nl</a>
              </p>
            </div>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 text-center mt-24">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} HomePilot. Uw woning, hun droom.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
} 