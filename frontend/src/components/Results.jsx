import React from 'react'

export default function Results({ results, refresh, teams }) {
  const totalVotes = Object.values(results).reduce((sum, count) => sum + count, 0)
  
  const getPercentage = (count) => {
    return totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0
  }

  const getTeamInfo = (teamName) => {
    return teams.find(t => t.name === teamName) || { 
      color: 'gray', 
      logo: '🏏', 
      shortName: 'TEAM', 
      captain: 'Unknown',
      jerseyNumber: '00',
      jerseyColor: '#000000',
      gradient: 'from-gray-500 to-gray-700'
    }
  }

  const topThree = Object.entries(results).sort(([,a], [,b]) => b - a).slice(0,3)

  return (
    <div className="w-full bg-gradient-to-tr from-gray-900 to-black border border-gray-800 rounded-3xl shadow-2xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">👑</div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-yellow-300 leading-tight">Current Champions & Predictions</h3>
          </div>
          <p className="mt-2 text-sm text-white/70">Top performing franchises from the live fan poll. Leaderboard updates in real time.</p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={refresh} className="bg-black border-2 border-white text-white px-3 py-2 rounded-lg font-semibold hover:bg-white hover:text-black transition">🔄 Refresh</button>
        </div>
      </div>

      {/* Top 3 visual columns */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 items-stretch">
        {topThree.length === 0 && (
          <div className="col-span-3 text-center py-8 text-gray-400">No votes yet — be the first to vote!</div>
        )}

        {topThree.map(([teamName, count], idx) => {
          const info = getTeamInfo(teamName)
          const pct = getPercentage(count)
          const medal = ['🥇','🥈','🥉'][idx]
          // Use smaller heights on mobile and larger min-heights on md+ to avoid overflow
          const heightClass = idx === 0 ? 'h-auto md:min-h-[18rem]' : idx === 1 ? 'h-auto md:min-h-[16rem]' : 'h-auto md:min-h-[14rem]'

          return (
            <div key={teamName} className={`${heightClass} rounded-2xl overflow-hidden border-2 ${idx===0 ? 'border-yellow-400' : 'border-gray-700'} bg-gradient-to-br ${info.gradient} flex flex-col justify-between p-4 relative` }>
              <div className="absolute top-4 left-4 text-3xl">{medal}</div>
              <div className="absolute top-4 right-4 text-white/80 text-sm bg-black/30 px-3 py-1 rounded-full">#{idx+1}</div>

              <div className="flex items-center gap-4">
                {info.logoUrl ? (
                  <img src={info.logoUrl} alt={`${info.shortName} logo`} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded-full" />
                ) : (
                  <div className="text-6xl drop-shadow-lg">{info.logo}</div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-lg sm:text-xl truncate">{teamName}</div>
                  <div className="text-sm text-white/80">Captain: <span className="font-semibold">{info.captain}</span></div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg" style={{backgroundColor: info.jerseyColor, color: info.jerseyColor === '#FFFF3C' ? '#000' : '#fff', border: '2px solid rgba(255,255,255,0.15)'}}>{info.jerseyNumber}</div>
                  <div className="text-sm text-white/80">{info.shortName} • <span className="font-semibold">{pct}%</span></div>
                </div>
                <div className="text-right">
                  <div className="text-white font-extrabold text-2xl">{count}</div>
                  <div className="text-xs text-white/70">votes</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="space-y-4">
        {Object.entries(results).sort(([,a], [,b]) => b - a).map(([teamName, count], idx) => {
          const info = getTeamInfo(teamName)
          const pct = getPercentage(count)
          const leading = idx === 0 && totalVotes > 0
          return (
            <div key={teamName} className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border ${leading ? 'border-yellow-400 shadow-lg' : 'border-gray-800'} bg-gradient-to-r ${info.gradient}`}>
              <div className="flex items-center gap-4 min-w-0">
                {info.logoUrl ? (
                  <img src={info.logoUrl} alt={`${info.shortName} logo`} className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full" />
                ) : (
                  <div className="text-4xl">{info.logo}</div>
                )}
                <div className="min-w-0">
                  <div className="text-lg font-bold text-white truncate">{teamName} {leading && <span className="ml-2 text-yellow-300 text-lg">👑</span>}</div>
                  <div className="text-sm text-white/80">Captain: <span className="font-semibold">{info.captain}</span></div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-1/2">
                <div className="flex-1">
                  <div className="w-full bg-black/30 rounded-full h-4 overflow-hidden">
                    <div className="h-4 rounded-full bg-gradient-to-r from-white to-yellow-300" style={{width: `${pct}%`}}></div>
                  </div>
                </div>
                <div className="w-28 text-right md:text-right">
                  <div className="text-xl font-extrabold">{count}</div>
                  <div className="text-sm text-white/80">{pct}%</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 text-center text-sm text-white/70">
        ⚡ Live voting — each vote is recorded immutably on the chain
      </div>
    </div>
  )
}