import React, { useState } from 'react'

const API = 'http://localhost:3000/api'

export default function Register({ onRegistered }) {
  const [voterId, setVoterId] = useState('')
  const [msg, setMsg] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const register = async (e) => {
    e.preventDefault()
    if (!voterId.trim()) return
    
    setIsLoading(true)
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterId: voterId.trim() })
      })
      const j = await res.json()
      
      if (j.error) {
        setMsg(j.error)
      } else {
        setMsg('Registration successful!')
        setTimeout(() => {
          onRegistered && onRegistered(voterId.trim())
        }, 1000)
      }
    } catch (err) {
      setMsg('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl shadow-2xl p-10">
      <div className="text-center mb-8">
        <div className="text-6xl mb-6">�</div>
        <h2 className="text-3xl font-bold text-white mb-3">Join the IPL Fan Vote</h2>
        <p className="text-gray-400 text-lg">Enter your name to cast your vote for the ultimate IPL franchise</p>
      </div>
      
      <form onSubmit={register} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Your Name
          </label>
          <input 
            className="w-full px-6 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg" 
            placeholder="Enter your full name" 
            value={voterId} 
            onChange={e => setVoterId(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-gray-700 border-2 border-gray-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-600 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
          >
            ⬅️ BACK
          </button>
          
          <button 
            className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
              isLoading || !voterId.trim()
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-black border-2 border-white text-white hover:bg-white hover:text-black transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`} 
            type="submit"
            disabled={isLoading || !voterId.trim()}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'START VOTING 🚀'
            )}
          </button>
        </div>
      </form>
      
      {msg && (
        <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
          msg.includes('successful') || msg.includes('done')
            ? 'bg-green-900/50 text-green-300 border border-green-500'
            : 'bg-red-900/50 text-red-300 border border-red-500'
        }`}>
          {msg}
        </div>
      )}
    </div>
  )
}
