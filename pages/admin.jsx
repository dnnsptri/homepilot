import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Admin() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState({})
  const [expandedRows, setExpandedRows] = useState({})
  const [showOnlyOwnHomePilot, setShowOnlyOwnHomePilot] = useState(false)

  // Check for admin access
  useEffect(() => {
    if (router.isReady && router.query.admin !== 'true') {
      setError('Access denied. Add ?admin=true to URL.')
      setLoading(false)
    }
  }, [router.isReady, router.query.admin])

  // Fetch submissions
  useEffect(() => {
    if (router.query.admin === 'true') {
      fetchSubmissions()
    }
  }, [router.query.admin])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError('')
      
      const res = await fetch('/api/admin?admin=true')
      const data = await res.json()

      if (data.success) {
        setSubmissions(data.data || [])
      } else {
        setError(data.message || 'Failed to fetch submissions')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [id]: true }))
      
      const res = await fetch('/api/admin?admin=true', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })

      const data = await res.json()

      if (data.success) {
        // Update local state
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, status: newStatus } : sub
          )
        )
      } else {
        setError(data.message || 'Failed to update status')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setUpdating(prev => ({ ...prev, [id]: false }))
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      invited: 'bg-green-100 text-green-800 border-green-200',
      ignored: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[status] || badges.pending}`}>
        {status || 'pending'}
      </span>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 4) return 'bg-green-50 border-green-200'
    if (score >= 3) return 'bg-yellow-50 border-yellow-200'
    return 'bg-gray-50 border-gray-200'
  }

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const ownHomePilotUsers = submissions.filter(
    (s) => s.wants_own_homepilot === 'yes'
  )

  const displaySubmissions = showOnlyOwnHomePilot ? ownHomePilotUsers : submissions

  const exportToCSV = () => {
    const headers = [
      'Name',
      'Email', 
      'Message',
      'Social',
      'Score',
      'Status',
      'Follow-up Intent',
      'Follow-up Value',
      'Wants Own HomePilot',
      'Created At'
    ]

    const csvData = displaySubmissions.map(sub => [
      sub.name,
      sub.email,
      sub.message,
      sub.social || '',
      sub.score,
      sub.status || 'pending',
      sub.followup_intent || '',
      sub.followup_value || '',
      sub.wants_own_homepilot || '',
      sub.created_at
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `homepilot-submissions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  if (router.query.admin !== 'true') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#001E46] mb-4">🎣 HomePilot Admin</h1>
          <p className="text-gray-600 mb-4">Access denied</p>
          <p className="text-sm text-gray-500">Add ?admin=true to the URL to access admin panel</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#001E46] mb-4">🎣 HomePilot Admin</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button 
            onClick={fetchSubmissions}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#001E46]">
            <img src="/images/HP_logo.svg" alt="HomePilot" className="h-6" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {displaySubmissions.length} submissions
            </span>
            <button 
              onClick={() => setShowOnlyOwnHomePilot(!showOnlyOwnHomePilot)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                showOnlyOwnHomePilot 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {showOnlyOwnHomePilot ? 'Show All' : 'Show Own HomePilot Only'}
            </button>
            <button 
              onClick={exportToCSV}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              Export CSV
            </button>
            <button 
              onClick={fetchSubmissions}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {displaySubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {showOnlyOwnHomePilot ? 'No users want their own HomePilot yet' : 'No submissions yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Social
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wants Own
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displaySubmissions.map((submission) => (
                    <>
                      <tr 
                        key={submission.id} 
                        className={`hover:bg-gray-50 transition-colors ${getScoreColor(submission.score)}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#001E46]">
                            {submission.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#001E46]">
                            {submission.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {submission.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {submission.social || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            submission.score >= 4 ? 'bg-green-100 text-green-800' :
                            submission.score >= 3 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {submission.score}/5
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(submission.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {submission.wants_own_homepilot || '—'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateStatus(submission.id, 'invited')}
                              disabled={updating[submission.id] || submission.status === 'invited'}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {updating[submission.id] ? '...' : 'Invite'}
                            </button>
                            <button
                              onClick={() => updateStatus(submission.id, 'ignored')}
                              disabled={updating[submission.id] || submission.status === 'ignored'}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {updating[submission.id] ? '...' : 'Ignore'}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleRowExpansion(submission.id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {expandedRows[submission.id] ? 'Hide' : 'Show'} Details
                          </button>
                        </td>
                      </tr>
                      {expandedRows[submission.id] && (
                        <tr className="bg-gray-50">
                          <td colSpan="9" className="px-6 py-4">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Follow-up Details</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Why do you want access?
                                  </label>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {submission.followup_intent || 'No follow-up submitted'}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    What makes it a no-brainer?
                                  </label>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {submission.followup_value || 'No follow-up submitted'}
                                  </p>
                                </div>
                                {/* Pricing expectation removed */}
                                <div>
                                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Wants own HomePilot?
                                  </label>
                                  <p className="text-sm text-gray-900 mt-1">
                                    {submission.wants_own_homepilot || 'No follow-up submitted'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} HomePilot Admin — managing the best bites.
        </p>
      </footer>
    </div>
  )
} 