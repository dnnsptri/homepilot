// /pages/api/submit.js

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Debug: Check if env vars are loaded
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Set' : 'Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Missing')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Set' : 'Missing')

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { name, email, message, social } = req.body

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' })
    }

    // Score the signup using AI
    const prompt = `Analyze this signup message and score it from 1 to 5 based on intent and seriousness:

Message: "${message}"

Scoring criteria:
1 = Very low intent (just curious, testing)
2 = Low intent (mild interest)
3 = Medium intent (some interest)
4 = High intent (genuine interest, specific use case)
5 = Very high intent (excited, ready to use, clear purpose)

Respond with ONLY a number 1-5.`

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that scores signup intent from 1-5. Respond with only a number.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 5,
        temperature: 0.1
      })
    })

    const aiData = await aiRes.json()
    console.log('AI Response:', aiData)
    
    let score = 1
    if (aiData.choices && aiData.choices[0] && aiData.choices[0].message) {
      const responseText = aiData.choices[0].message.content.trim()
      score = parseInt(responseText) || 1
    }
    
    // Ensure score is between 1-5
    score = Math.max(1, Math.min(5, score))

    // Save to Supabase
    const { error } = await supabase.from('submissions').insert([
      { 
        name, 
        email, 
        message, 
        social, 
        score,
        created_at: new Date().toISOString()
      }
    ])

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ success: false, message: 'Database error' })
    }

    console.log('New signup saved:', { name, email, message, social, score })
    
    res.status(200).json({ 
      success: true,
      message: 'Signup successful',
      data: { name, email, message, social, score }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}