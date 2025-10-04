import React, { useState } from 'react'

const API = import.meta.env.VITE_API_BASE || 'https://fanvote-blockchain-1.onrender.com/api'

export default function Vote({ teams, voterId, onVoted }) {
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isVoting, setIsVoting] = useState(false)
  const [msg, setMsg] = useState(null)

  const handleVote = async (team) => {
    setIsVoting(true)
    try {
      const res = await fetch(`${API}/vote`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId, candidate: team.name })
      })
      const j = await res.json()
      
      if (j.error) {
        setMsg(j.error)
      } else {
        setSelectedTeam(team)
        setTimeout(() => {
          onVoted && onVoted()
        }, 2500)
      }
    } catch (err) {
      setMsg('Connection error. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl p-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Select Your IPL Champion</h2>
        <p className="text-gray-400 text-xl">
          Welcome, <span className="font-bold text-blue-400">{voterId}</span>! 
          <br />Choose the franchise you believe will dominate IPL 2025
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8">
        {teams.map((team, index) => (
          <div key={team.name} className="relative group">
            <div className={`bg-gradient-to-br ${team.gradient} rounded-3xl p-8 text-white border-2 border-gray-600 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-white cursor-pointer`}>
              <div className="text-center">
                {team.logoUrl ? (
                  <img
                    src={team.logoUrl}
                    alt={`${team.shortName} logo`}
                    className="mx-auto mb-6 w-20 h-20 sm:w-28 sm:h-28 object-contain rounded-full"
                  />
                ) : (
                  <div className="text-8xl mb-6 filter drop-shadow-lg">{team.logo || '🏏'}</div>
                )}
                
                <div className="bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 mb-6 inline-block border border-white/20">
                  <span className="text-lg font-bold tracking-wider">{team.shortName}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-6 leading-tight">{team.name}</h3>
                
                <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10">
                  <div className="text-lg font-semibold text-yellow-300 mb-3">CAPTAIN</div>
                  <div className="text-xl font-bold mb-4">{team.captain}</div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-lg border-3 border-white"
                      style={{ 
                        backgroundColor: team.jerseyColor, 
                        color: team.jerseyColor === '#FFFF3C' ? '#000' : '#FFF',
                        border: '3px solid white'
                      }}
                    >
                      {team.jerseyNumber}
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-200">Jersey Number</div>
                      <div className="text-lg font-bold">#{team.jerseyNumber}</div>
                      <div className="text-sm text-gray-300">{team.shortName} Colors</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleVote(team)}
                  disabled={isVoting}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isVoting
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-black border-2 border-white text-white hover:bg-white hover:text-black transform hover:scale-105'
                  }`}
                >
                  {isVoting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      VOTING...
                    </span>
                  ) : (
                    `🗳️ VOTE FOR ${team.shortName}`
                  )}
                </button>
              </div>
            </div>
            
            {selectedTeam?.name === team.name && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 bg-opacity-95 rounded-3xl flex items-center justify-center backdrop-blur-sm z-10">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">🏆</div>
                  <div className="font-bold text-3xl mb-2">VOTE CAST!</div>
                  <div className="text-xl">You chose {team.shortName}!</div>
                  <div className="text-lg mt-2 opacity-80">Secured on blockchain ⛓️</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {msg && (
        <div className={`mt-8 p-6 rounded-2xl text-center font-semibold ${
          msg.includes('recorded') || msg.includes('success')
            ? 'bg-green-900/50 text-green-300 border border-green-500'
            : 'bg-red-900/50 text-red-300 border border-red-500'
        }`}>
          <div className="text-lg">{msg}</div>
        </div>
      )}
    </div>
  )
}