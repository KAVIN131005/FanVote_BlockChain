import React, { useState, useEffect } from 'react'
import Register from './components/Register'
import Vote from './components/Vote'
import Results from './components/Results'
import Header from './components/Header'

const API_BASE = import.meta.env.VITE_API_BASE || 'https://fanvote-blockchain-1.onrender.com/api'

// IPL 2026 Teams with proper logos and captains
  const IPL_TEAMS = [
    {
      name: 'Mumbai Indians',
      shortName: 'MI',
      logo: '🔷',
      // Optional: set a publicly accessible image URL to show a proper logo
  logoUrl: 'https://th.bing.com/th?q=MI+IPL+Logo.png&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'Hardik Pandya',
      jerseyNumber: '33',
      jerseyColor: '#004BA0',
      color: 'blue',
      gradient: 'from-blue-600 to-blue-800'
    },
    {
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      logo: '🦁',
  logoUrl: 'https://th.bing.com/th?q=CSK+Logo+Invisible+Background&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'MS Dhoni',
      jerseyNumber: '07',
      jerseyColor: '#FFFF3C',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-700'
    },
    {
      name: 'Royal Challengers Bangalore',
      shortName: 'RCB',
      logo: '🔴',
  logoUrl: 'https://tse4.mm.bing.net/th/id/OIP.WhmEl3cYsnOIAB4n5J-SWgHaHa?pid=Api&P=0&h=180',
      captain: 'Virat Kohli',
      jerseyNumber: '18',
      jerseyColor: '#EC1C24',
      color: 'red',
      gradient: 'from-red-600 to-red-800'
    },
    {
      name: 'Delhi Capitals',
      shortName: 'DC',
      logo: '🔷',
  logoUrl: 'https://tse1.mm.bing.net/th/id/OIP._SgF7HXspLYN6A7Xqtri1wHaHa?pid=Api&P=0&h=180',
      captain: 'KL Rahul',
      jerseyNumber: '01',
      jerseyColor: '#282968',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-700'
    },
    {
      name: 'Kolkata Knight Riders',
      shortName: 'KKR',
      logo: '',
  logoUrl: 'https://th.bing.com/th?q=KKR+Logo+Vector+Png&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'Ajinkya Rahane',
      jerseyNumber: '03',
      jerseyColor: '#3A225D',
      color: 'purple',
      gradient: 'from-purple-600 to-purple-800'
    },
    {
      name: 'Punjab Kings',
      shortName: 'PBKS',
      logo: '🔴',
  logoUrl: 'https://th.bing.com/th?q=Pbks+IPL+Logo.png&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'Shreyas Iyer',
      jerseyNumber: '41',
      jerseyColor: '#ED1B24',
      color: 'red',
      gradient: 'from-red-500 to-pink-700'
    },
    {
      name: 'Rajasthan Royals',
      shortName: 'RR',
      logo: '💙',
  logoUrl: 'https://tse3.mm.bing.net/th/id/OIP.S1bBlN5Tknw_mfue312osQHaHa?pid=Api&P=0&h=180',
      captain: 'Sanju Samson',
      jerseyNumber: '09',
      jerseyColor: '#254AA5',
      color: 'pink',
      gradient: 'from-pink-500 to-purple-700'
    },
    {
      name: 'Sunrisers Hyderabad',
      shortName: 'SRH',
      logo: '🟠',
  logoUrl: 'https://th.bing.com/th?q=SRH+Logo+Transparent+Background&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'Pat Cummins',
      jerseyNumber: '30',
      jerseyColor: '#FF822A',
      color: 'orange',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      name: 'Lucknow Super Giants',
      shortName: 'LSG',
      logo: '🔷',
  logoUrl: 'https://th.bing.com/th?q=LSG+IPL+Dark+Symbol&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
      captain: 'Rishabh Pant',
      jerseyNumber: '17',
      jerseyColor: '#1C4A7A',
      color: 'teal',
      gradient: 'from-teal-500 to-green-700'
    },
    {
      name: 'Gujarat Titans',
      shortName: 'GT',
      logo: '🔷',
  logoUrl: 'https://tse1.mm.bing.net/th/id/OIP.cYV7Co6a4SxwLWDDKjoPJgHaHa?pid=Api&P=0&h=180',
      captain: 'Shubman Gill',
      jerseyNumber: '77',
      jerseyColor: '#1B2951',
      color: 'blue',
      gradient: 'from-blue-400 to-teal-600'
    }
  ]

export default function App() {
  const [results, setResults] = useState({})
  const [currentVoter, setCurrentVoter] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)

  const fetchResults = async () => {
    const res = await fetch(`${API_BASE}/results`)
    const j = await res.json()
    setResults(j.results || {})
  }

  const handleRegistration = (voterId) => {
    setCurrentVoter(voterId)
    setIsRegistered(true)
  }

  const handleVoteSuccess = () => {
    setHasVoted(true)
    fetchResults()
  }

  useEffect(() => {
    fetchResults()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {!isRegistered ? (
            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <Register onRegistered={handleRegistration} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {!hasVoted ? (
                  <Vote 
                    teams={IPL_TEAMS}
                    voterId={currentVoter}
                    onVoted={handleVoteSuccess}
                  />
                ) : (
                  <div className="bg-gradient-to-r from-gray-900 to-black border border-green-500 rounded-2xl shadow-2xl p-12 text-center">
                    <div className="text-8xl mb-6">🎉</div>
                    <h2 className="text-4xl font-bold text-green-400 mb-4">Vote Successfully Cast!</h2>
                    <p className="text-gray-300 text-lg">Thank you <span className="text-blue-400 font-semibold">{currentVoter}</span> for participating in the IPL 2026 Fan Poll.</p>
                    <div className="mt-6 inline-block bg-green-500/20 border border-green-400 rounded-full px-6 py-2">
                      <span className="text-green-300 font-medium">🔒 Vote secured on blockchain</span>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Results results={results} refresh={fetchResults} teams={IPL_TEAMS} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
