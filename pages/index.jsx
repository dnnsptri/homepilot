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
    salutation: '',      // Aanhef
    name: '',
    email: '',
    address: '',         // Was "message" before, rename for clarity
    // LP2 fields (not shown in LP1 UI):
    willing_to_sell: '', // ja | misschien | nee
    price_expectation: '',
    move_timing: ''      // <3m | 3-6m | 6-12m | later | onbekend
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
        ref: 'LP1',            // Will be 'LP2' in the copy
        salutation: form.salutation,
        name: form.name.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        // LP2 fields — will stay null in LP1
        willing_to_sell: null,
        price_expectation: null,
        move_timing: null
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
          address: '',
          willing_to_sell: '',
          price_expectation: '',
          move_timing: ''
        })
      } else {
        console.log('New signup saved:', payload)
        setSubmitted(true)
        setToast({ show: true, type: 'success', message: 'Bedankt voor uw interesse! We nemen binnenkort contact met u op.' })
        setForm({
          salutation: '',
          name: '',
          email: '',
          address: '',
          willing_to_sell: '',
          price_expectation: '',
          move_timing: ''
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
        address: '',
        willing_to_sell: '',
        price_expectation: '',
        move_timing: ''
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Navigation */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-900">
            <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
          </div>
          <nav className="flex space-x-6">
            <a href="/about" className="text-[#0C5CD3] hover:text-[#011E46] hover:underline transition-colors">
              Over HomePilot
            </a>
            <span className="text-gray-400 cursor-not-allowed">
              Inloggen
            </span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Gefeliciteerd! Er is iemand die uw huis wil kopen.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
          Zonder directe inzet van een makelaar.<br />
          En zonder verplichtingen, gewoon direct contact.<br /><br />
          </p>

          {/* Signup Form */}
          {showForm && (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full bg-white p-8 shadow rounded">
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
                  placeholder="Uw achternaam" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <input 
                  name="email" 
                  type="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="Uw e-mail adres" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <textarea 
                  name="address" 
                  value={form.address} 
                  onChange={handleChange} 
                  placeholder="Uw adres & woonplaats" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                >
                  {submitting ? 'Versturen...' : submitted ? 'Verstuurd' : 'Ja, laat me vrijblijvend meer weten'}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Uw gegevens worden uitsluitend gebruikt om u over deze koper te informeren.
                </p>
              </form>
            </div>
          )}

          {/* Follow-up Form temporarily disabled */}
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
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} HomePilot. Uw woning. Hun droom.
        </p>
      </footer>
    </div>
  )
} 