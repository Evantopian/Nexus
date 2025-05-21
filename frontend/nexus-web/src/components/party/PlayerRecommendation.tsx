"use client"

import { ChevronLeft, ChevronRight, GamepadIcon as GameController } from "lucide-react"
import { useState, useEffect } from "react"
import type { Player } from "./Party"

interface PlayerRecommendationProps {
  recommendedPlayers: Player[]
  handleInvite: (userId: string) => void
  loading: boolean
  selectedGames: string[]
}

const PlayerRecommendation = ({
  recommendedPlayers,
  handleInvite,
  loading,
  selectedGames,
}: PlayerRecommendationProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])

  // Generate random stats for each player
  const getPlayerStats = (playerId: string) => {
    // Use a deterministic seed based on player ID to ensure consistent stats
    const seed = playerId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Generate match percentage (70-99%)
    const matchPercentage = 70 + (seed % 30)

    // Generate rating (3.5-5.0)
    const rating = (3.5 + (seed % 15) / 10).toFixed(1)

    // Generate games count (10-150)
    const gamesCount = 10 + (seed % 141)

    return {
      matchPercentage,
      rating,
      gamesCount,
    }
  }

  // Simulate filtering based on selected games
  useEffect(() => {
    if (selectedGames.length === 0) {
      setFilteredPlayers(recommendedPlayers || [])
    } else {
      // Fake filtering - in a real app, this would use actual game preferences
      // Here we're just showing fewer players when games are selected to simulate filtering
      const filtered = recommendedPlayers?.filter((_, index) => {
        // Use a deterministic "random" based on player index and selected games
        const hash = selectedGames.reduce((acc, gameId) => acc + gameId.charCodeAt(0), 0) + index
        return hash % 3 !== 0 // Filter out roughly 1/3 of players based on "hash"
      })
      setFilteredPlayers(filtered || [])
    }
  }, [recommendedPlayers, selectedGames])

  const prev = () => setActiveIndex((i) => (i - 1 + filteredPlayers.length) % filteredPlayers.length)
  const next = () => setActiveIndex((i) => (i + 1) % filteredPlayers.length)

  // Reset active index when filtered players change
  useEffect(() => {
    setActiveIndex(0)
  }, [filteredPlayers.length])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }

  if (!filteredPlayers || filteredPlayers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="bg-gray-700/50 rounded-full p-4 mb-4">
          <ChevronRight size={24} className="text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No Recommendations</h3>
        <p className="text-gray-400 max-w-xs">
          {selectedGames.length > 0
            ? "No players match your selected games. Try selecting different games."
            : "We don't have any player recommendations for you at the moment."}
        </p>
      </div>
    )
  }

  return (
    <div className="relative h-full flex items-center justify-center">
      {/* Player Cards */}
      <div className="relative w-full max-w-md mx-auto h-full">
        {filteredPlayers.map((player, idx) => {
          const isActive = idx === activeIndex
          const isPrev = idx === (activeIndex - 1 + filteredPlayers.length) % filteredPlayers.length
          const isNext = idx === (activeIndex + 1) % filteredPlayers.length

          let position = "opacity-0 scale-90"
          let zIndex = 0

          if (isActive) {
            position = "translate-y-0 scale-100 opacity-100"
            zIndex = 30
          } else if (isPrev) {
            position = "-translate-y-[40%] -translate-x-[15%] scale-80 opacity-60"
            zIndex = 20
          } else if (isNext) {
            position = "translate-y-[40%] translate-x-[15%] scale-80 opacity-60"
            zIndex = 20
          }

          // Get randomized stats for this player
          const stats = getPlayerStats(player.id)

          return (
            <div
              key={player.id}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${position}`}
              style={{ zIndex }}
            >
              <div className="bg-gray-700 rounded-xl overflow-hidden border border-gray-600 shadow-xl w-full max-w-xs">
                {/* Player Card Header */}
                <div className="h-20 bg-gradient-to-r from-teal-600 to-teal-400 relative">
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={player.profileImg || "/default-avatar.png"}
                        alt={player.username}
                        className="w-20 h-20 rounded-full border-4 border-gray-700 object-cover"
                      />
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-700"></div>
                    </div>
                  </div>
                </div>

                {/* Player Info */}
                <div className="pt-12 pb-4 px-4 text-center">
                  <h3 className="text-lg font-bold mb-1">{player.username}</h3>
                  <p className="text-gray-400 text-xs mb-4">{player.email}</p>

                  {/* Game Preferences - Fake data based on selected games */}
                  {selectedGames.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs text-gray-400 mb-2">Plays</h4>
                      <div className="flex flex-wrap justify-center gap-1">
                        {selectedGames.map((gameId, index) => (
                          <div key={gameId} className="flex items-center bg-gray-600 rounded-full px-2 py-0.5">
                            <GameController size={10} className="text-teal-400 mr-1" />
                            <span className="text-xs">Game {index + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-gray-800 rounded-lg p-2">
                      <div className="text-teal-400 text-base font-bold">{stats.matchPercentage}%</div>
                      <div className="text-xs text-gray-400">Match</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <div className="text-teal-400 text-base font-bold">{stats.rating}</div>
                      <div className="text-xs text-gray-400">Rating</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2">
                      <div className="text-teal-400 text-base font-bold">{stats.gamesCount}</div>
                      <div className="text-xs text-gray-400">Games</div>
                    </div>
                  </div>

                  {/* Invite Button */}
                  <button
                    onClick={() => handleInvite(player.id)}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Invite to Party
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      {filteredPlayers.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 z-40"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 z-40"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {filteredPlayers.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
          {filteredPlayers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === activeIndex ? "bg-teal-500 w-3" : "bg-gray-600 hover:bg-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PlayerRecommendation
