import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Debug environment variables
console.log('Environment variables:', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqazuexnfadbykiyzakr.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback_key'
)

export default function Home() {
  const [showForm, setShowForm] = useState(true)
  const [form, setForm] = useState({
    salutation: '',
    name: '',
    email: '',
    address: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [toast, setToast] = useState({ show: false, type: '', message: '' })
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setToast({ show: false, type: '', message: '' })

    try {
      const payload = {
        ref: 'LP1',
        salutation: form.salutation,
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim()
      }

      const { error } = await supabase
        .from('homepilot_leads')
        .insert([payload])

      if (error) {
        console.error('Error inserting data:', error)
        setToast({ show: true, type: 'error', message: 'Er is iets misgegaan! Probeer het opnieuw.' })
        setForm({
          salutation: '',
          name: '',
          email: '',
          address: ''
        })
      } else {
        console.log('New signup saved:', payload)
        setSubmitted(true)
        setToast({ show: true, type: 'success', message: 'Bedankt voor uw interesse! We nemen binnenkort contact met u op.' })
        setForm({
          salutation: '',
          name: '',
          email: '',
          address: ''
        })
        
        // Reset button state after 2 seconds
        setTimeout(() => setSubmitted(false), 2000)
      }
    } catch (error) {
      console.error('Submit error:', error)
      setToast({ show: true, type: 'error', message: 'Netwerkfout. Probeer het opnieuw.' })
      setForm({
        salutation: '',
        name: '',
        email: '',
        address: ''
      })
    } finally {
      setSubmitting(false)
      // Hide toast after 3 seconds
      setTimeout(() => setToast({ show: false, type: '', message: '' }), 3000)
    }
  }

  /* Follow-up temporarily disabled
  const submitFollowup = async (e) => {
    // disabled
  }
  */

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#32608E] text-white pb-32">
        {/* Header Navigation */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
            </div>
            <nav className="flex space-x-6">
              <a href="/about" className="text-white hover:text-white hover:underline transition-colors">
                Over HomePilot
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 max-w-[900px] mx-auto">
            Gefeliciteerd! Er is iemand die uw huis wil kopen.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-0 intro">
            Ontvang vrijblijvend het bod van deze geïnteresseerde. Uiteraard zonder verkoopverplichting en zonder direct contact met de potentiële koper.<br /><br />
          </p>
        </div>
      </section>

      {/* Form Section - Positioned over the edge */}
      <div className="relative -mt-32 mb-16">
        <div className="max-w-[600px] mx-auto px-4">
          {showForm && (
            <div className="bg-white p-8 shadow-2xl rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="sr-only" htmlFor="salutation">Aanhef</label>
                  <select
                    id="salutation"
                    name="salutation"
                    value={form.salutation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Aanhef</option>
                    <option value="Mr">Dhr.</option>
                    <option value="Mrs">Mevr.</option>
                    <option value="Fam">Fam.</option>
                  </select>
                </div>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="Achternaam" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="E-mailadres" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="Straatnaam, nummer, postcode & woonplaats" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-[#0C5CD3] text-white font-semibold py-4 px-6 rounded-lg hover:bg-[#001E46] focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {submitting ? 'Versturen...' : submitted ? 'Verstuurd' : 'Ja, laat me vrijblijvend meer weten'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Uw gegevens worden uitsluitend gebruikt om u verder te informeren<br />over deze potentiële koper.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Toast Message */}
      {toast.show && (
        <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center mt-24">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} HomePilot. Uw woning, hun droom.
        </p>
      </footer>
    </div>
  )
} 