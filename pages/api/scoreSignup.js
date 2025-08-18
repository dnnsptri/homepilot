import { OpenAI } from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message } = req.body

  const prompt = `
You are a waitlist scoring bot.

Your job is to evaluate how serious, motivated, and genuinely interested someone is in joining a new product waitlist based on the message they write.

You must reply with **a single number between 0 and 10** — no text, no explanation.

Examples:
- "I’m curious." → 3
- "I’ve been searching for this. Can I try it today?" → 9
- "Looks nice, let me know." → 5

Now score this message:
"${message}"

Only reply with a number. No text.
`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3 // keeps it consistent
    })

    const content = completion.choices[0].message.content.trim()
    console.log('🧠 Raw OpenAI reply:', content)

    const match = content.match(/\d+/)
    const score = match ? parseInt(match[0], 10) : 0

    return res.status(200).json({ score })
  } catch (error) {
    console.error('❌ OpenAI error:', error)
    return res.status(500).json({ error: 'Failed to get score from OpenAI' })
  }
}