import React from 'react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black border-b border-gray-800 shadow-2xl">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-6xl animate-bounce">🏏</div>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-yellow-500 bg-clip-text text-transparent tracking-tight">
                IPL 2025
              </h1>
              <div className="text-2xl font-bold text-white mt-2 tracking-widest">
                FAN VOTE CHAMPIONSHIP
              </div>
            </div>
            <div className="text-6xl animate-bounce" style={{animationDelay: '0.5s'}}>🏆</div>
          </div>
          
          <div className="space-y-4">
            <p className="text-xl font-medium text-gray-300">
              Choose Your Ultimate IPL Franchise
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-2">
                <span className="text-green-400 font-semibold">🔒 Blockchain Secured</span>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-2">
                <span className="text-blue-400 font-semibold">⚡ Real-time Results</span>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-2">
                <span className="text-orange-400 font-semibold">🎯 10 Teams</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}