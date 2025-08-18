import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Basic admin protection
  const { admin } = req.query
  if (admin !== 'true') {
    return res.status(403).json({ success: false, message: 'Access denied' })
  }

  if (req.method === 'GET') {
    // Fetch all submissions
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('score', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        return res.status(500).json({ success: false, message: 'Database error' })
      }

      console.log('Admin API fetched submissions:', data?.length || 0, 'records')
      if (data && data.length > 0) {
        console.log('Sample submission fields:', Object.keys(data[0]))
        console.log('Sample follow-up data:', {
          followup_intent: data[0].followup_intent,
          followup_value: data[0].followup_value,
          wants_own_baitlist: data[0].wants_own_baitlist
        })
      }

      res.status(200).json({ success: true, data })
    } catch (error) {
      console.error('Fetch error:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    // Update submission status
    try {
      const { id, status } = req.body

      console.log('Admin PUT request:', { id, status })

      if (!id || !status) {
        return res.status(400).json({ success: false, message: 'ID and status are required' })
      }

      // First check if the record exists
      const { data: existingRecord, error: findError } = await supabase
        .from('submissions')
        .select('id')
        .eq('id', id)
        .single()

      if (findError) {
        console.error('Error finding record:', findError)
        return res.status(404).json({ success: false, message: 'Record not found' })
      }

      console.log('Found record:', existingRecord)

      // Try to update status, but don't fail if column doesn't exist
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id)

      if (error) {
        console.error('Supabase update error:', error)
        return res.status(500).json({ success: false, message: 'Database error: ' + error.message })
      }

      console.log('Status updated successfully')
      res.status(200).json({ success: true, message: 'Status updated' })
    } catch (error) {
      console.error('Update error:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }
} 