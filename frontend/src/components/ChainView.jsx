import React, { useState } from 'react'

export default function ChainView({ chain, refresh }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getBlockIcon = (block) => {
    if (block.index === 0) return '🏁' // Genesis block
    return '🗳️' // Vote block
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Blockchain</h2>
        <div className="flex gap-2">
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? '📄 Collapse' : '📋 Expand'}
          </button>
          <button 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium" 
            onClick={refresh}
          >
            🔄 Refresh
          </button>
        </div>
      </div>
      
      <div className="mb-4 text-center">
        <div className="text-lg font-bold text-gray-800">{chain.length}</div>
        <div className="text-sm text-gray-600">Blocks in Chain</div>
      </div>

      <div className={`space-y-3 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-auto`}>
        {chain.length === 0 && (
          <p className="text-center text-gray-500 py-8">No blocks in chain</p>
        )}
        
        {chain.slice().reverse().map((block, index) => (
          <div key={block.hash} className={`border rounded-lg p-4 ${
            block.index === 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getBlockIcon(block)}</span>
                <span className="font-semibold text-gray-800">
                  Block #{block.index}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTime(block.timestamp)}
              </span>
            </div>
            
            {block.index > 0 && (
              <div className="text-sm space-y-1">
                <div><span className="font-medium">Voter:</span> {block.voterId}</div>
                <div><span className="font-medium">Candidate:</span> {block.candidate}</div>
              </div>
            )}
            
            {isExpanded && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 break-all">
                  <div><span className="font-medium">Hash:</span> {block.hash}</div>
                  {block.index > 0 && (
                    <div className="mt-1"><span className="font-medium">Previous:</span> {block.previousHash}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
