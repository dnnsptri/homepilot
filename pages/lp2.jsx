import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqazuexnfadbykiyzakr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback_key'
)

export default function LP2() {
  const [showForm, setShowForm] = useState(true)
  const [showExtras, setShowExtras] = useState(false)
  const [form, setForm] = useState({
    salutation: '',
    name: '',
    email: '',
    address: '',
    willing_to_sell: '',
    price_expectation: '',
    move_timing: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', message: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // If extras not shown yet, move to step 2 instead of submitting
    if (!showExtras) {
      setShowExtras(true)
      return
    }
    setSubmitting(true)
    setToast({ show: false, type: '', message: '' })

    try {
      const payload = {
        ref: 'LP2',
        salutation: form.salutation,
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        // LP2 extra fields captured
        willing_to_sell: form.willing_to_sell || null,
        price_expectation: form.price_expectation || null,
        move_timing: form.move_timing || null
      }

      const { error } = await supabase
        .from('homepilot_leads')
        .insert([payload])

      if (error) {
        setToast({ show: true, type: 'error', message: 'Er is iets misgegaan! Probeer het opnieuw.' })
      } else {
        setSubmitted(true)
        setToast({ show: true, type: 'success', message: 'Bedankt! We nemen contact op.' })
        setForm({ salutation: '', name: '', email: '', address: '', willing_to_sell: '', price_expectation: '', move_timing: '' })
        setShowExtras(false)
        setTimeout(() => setSubmitted(false), 2000)
      }
    } catch (err) {
      setToast({ show: true, type: 'error', message: 'Netwerkfout. Probeer het opnieuw.' })
    } finally {
      setSubmitting(false)
      setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#3D6B53] text-white pb-32">
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
            </div>
            <nav className="flex space-x-6">
              <a href="/about?lp=2" className="text-white hover:text-white hover:underline transition-colors">Over HomePilot</a>
            </nav>
          </div>
        </header>

        <div className="container mx-auto px-4 pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 max-w-[900px] mx-auto">Uw woning trekt aandacht!<br /> Er is iemand die interesse heeft in uw huis.</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-0 intro">
            Ontvang vrijblijvend het bod van deze geïnteresseerde.<br />
            Uiteraard zonder verkoopverplichting en zonder direct contact met de potentiële koper.<br /><br />
          </p>
        </div>
      </section>

      {/* Form over edge */}
      <div className="relative -mt-32 mb-16">
        <div className="max-w-[600px] mx-auto px-4">
          {showForm && (
            <div className="bg-white p-8 shadow-2xl rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1 fields */}
                <div>
                  <label className="sr-only" htmlFor="salutation">Aanhef</label>
                  <select id="salutation" name="salutation" value={form.salutation} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                    <option value="">Aanhef</option>
                    <option value="Mr">Dhr.</option>
                    <option value="Mrs">Mevr.</option>
                    <option value="Fam">Fam.</option>
                  </select>
                </div>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Achternaam" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="E-mailadres" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                <textarea name="address" value={form.address} onChange={handleChange} placeholder="Straatnaam, nummer, postcode & woonplaats" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />

                {/* Step 2 fields (revealed after Volgende) */}
                {showExtras && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#001E46] mb-2">Bent u bereid te verkopen?</label>
                      <select name="willing_to_sell" value={form.willing_to_sell} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                        <option value="">Selecteer</option>
                        <option value="ja">Ja</option>
                        <option value="misschien">Misschien</option>
                        <option value="nee">Nee</option>
                      </select>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                      <input name="price_expectation" value={form.price_expectation} onChange={handleChange} placeholder="Prijsverwachting (optioneel)" className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#001E46] mb-2">Hoe snel zou u kunnen verhuizen?</label>
                      <select name="move_timing" value={form.move_timing} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                        <option value="">Selecteer</option>
                        <option value="<3m">Binnen 3 maanden</option>
                        <option value="3-6m">3-6 maanden</option>
                        <option value="6-12m">6-12 maanden</option>
                        <option value=">12m">Later dan 12 maanden</option>
                        <option value="onbekend">Onbekend</option>
                      </select>
                    </div>
                  </>
                )}

                {/* CTA */}
                {!showExtras ? (
                  <button type="button" onClick={() => setShowExtras(true)} className="w-full bg-[#30A661] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#0B2918] focus:ring-4 focus:ring-blue-300 transition-all duration-200">
                    Volgende
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="w-full bg-[#30A661] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#0B2918] focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                    {submitting ? 'Versturen...' : submitted ? 'Verstuurd' : 'Opslaan'}
                  </button>
                )}
                <p className="text-xs text-gray-500 text-center mt-3">Uw gegevens worden uitsluitend gebruikt om u verder te informeren.</p>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="container mx-auto px-4 py-8 text-center mt-24">
        <p className="text-gray-600 text-sm">© {new Date().getFullYear()} HomePilot. Uw woning, hun droom.</p>
      </footer>
    </div>
  )
}
