import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  try {
    console.log('Testing Supabase connection...')
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing')
    console.log('SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return res.status(500).json({ 
        error: 'Missing environment variables',
        supabaseUrl: !!process.env.SUPABASE_URL,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Test basic connection
    const { data, error } = await supabase
      .from('submissions')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase test error:', error)
      return res.status(500).json({ 
        error: 'Supabase connection failed',
        details: error.message
      })
    }

    console.log('Supabase connection successful')
    return res.status(200).json({ 
      success: true, 
      message: 'Supabase connection working',
      data 
    })
  } catch (error) {
    console.error('Test endpoint error:', error)
    return res.status(500).json({ 
      error: 'Server error',
      details: error.message
    })
  }
} 