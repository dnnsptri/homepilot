import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Debug environment variables
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing')
console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Missing')

// Check if we have the required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables')
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    console.log('Followup API endpoint called')
    
      const { name, email, ...followupData } = req.body

  // Debug logging
  console.log('Followup API called with:', { name, email, ...followupData })

  // Validate required fields
  if (!name || !email || !followupData.followup_intent || !followupData.followup_value) {
    console.log('Missing required fields')
    return res.status(400).json({ error: 'Missing required fields' })
  }

    console.log('About to connect to Supabase...')

    // Test basic Supabase connection first
    const { data: testData, error: testError } = await supabase
      .from('submissions')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('Supabase connection test failed:', testError)
      return res.status(500).json({ error: 'Database connection failed: ' + testError.message })
    }

    console.log('Supabase connection successful')

    // First check if the record exists
    const { data: existingRecord, error: findError } = await supabase
      .from('submissions')
      .select('id')
      .eq('email', email)
      .eq('name', name)
      .single()

    if (findError) {
      console.error('Error finding record:', findError)
      return res.status(404).json({ error: 'Record not found: ' + findError.message })
    }

    console.log('Found existing record:', existingRecord)

    console.log('Record found, attempting update for ID:', existingRecord.id)

    const { error } = await supabase
      .from('submissions')
      .update({
        ...followupData
      })
      .eq('email', email)
      .eq('name', name)

    if (error) {
      console.error('Supabase update error:', error)
      return res.status(500).json({ error: 'Update failed: ' + error.message })
    }

    console.log('Followup updated successfully')

    // Send email if user wants their own HomePilot
    console.log('Checking wants_own_baitlist:', followupData.wants_own_baitlist)
    if (followupData.wants_own_baitlist === 'yes') {
      try {
        console.log('Sending email to:', email)
        console.log('Resend API key available:', !!process.env.RESEND_API_KEY)
        
        const emailResult = await resend.emails.send({
          from: 'HomePilot <onboarding@resend.dev>',
          to: email,
          subject: "You bit. Let's get you your own HomePilot 🐟",
          html: `
            <p>Hey ${name},</p>
            <p>Love that you're interested in using HomePilot for your own launch.</p>
            <p>You're on the early list — and we're working hard to ship something special for people like you.</p>
            <p>Soon, you'll be able to pick a plan, plug it in, and launch your own waitlist that actually qualifies the right people.</p>
            <p>Hang tight, we'll be in touch soon.</p>
            <p>– The HomePilot Team 🐟</p>
          `
        })
        
        console.log('Email sent successfully to:', email)
        console.log('Email result:', emailResult)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        console.error('Email error details:', emailError.message)
        // Don't fail the request if email fails
      }
    } else {
      console.log('User does not want their own HomePilot, skipping email')
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Followup API error:', error)
    return res.status(500).json({ error: 'Server error: ' + error.message })
  }
} 