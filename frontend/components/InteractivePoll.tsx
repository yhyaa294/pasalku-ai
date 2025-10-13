'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Vote, TrendingUp, Users, Timer, CheckCircle2,
  Star, MessageCircle, Share2, RefreshCw
} from 'lucide-react'

// Animated progress bar component
const AnimatedProgressBar = ({ percentage, color = 'purple' }) => {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 500)
    return () => clearTimeout(timer)
  }, [percentage])

  const colors = {
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    green: 'bg-gradient-to-r from-green-500 to-emerald-500',
    orange: 'bg-gradient-to-r from-orange-500 to-red-500'
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full ${colors[color]} rounded-full`}
      />
    </div>
  )
}

// Vote button component
const VoteButton = ({ option, isSelected, onClick, voteCount }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(option.id)}
      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
        isSelected
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-xl'
          : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:border-purple-300 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
      }`}
    >
      {/* Selected checkmark */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-4 right-4"
          >
            <CheckCircle2 className="w-6 h-6 text-purple-600" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <span className="text-gray-900 dark:text-white font-medium pr-8">
          {option.text}
        </span>
        <motion.span
          key={voteCount}
          initial={{ scale: 1.2, color: '#8b5cf6' }}
          animate={{ scale: 1, color: '#6b7280' }}
          className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
        >
          {voteCount} votes
        </motion.span>
      </div>

      {/* Progress bar */}
      <div className="mt-3">
        <AnimatedProgressBar percentage={isSelected ? 100 : (option.votes / Math.max(option.votes, 1)) * 100} />
      </div>
    </motion.button>
  )
}

// Poll data structure
interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollData {
  id: string
  question: string
  options: PollOption[]
  totalVotes: number
  isActive: boolean
  endTime?: Date
}

// Sample poll data
const samplePolls: PollData[] = [
  {
    id: '1',
    question: 'Fitur AI manakah yang paling berguna untuk praktik hukum Anda?',
    options: [
      { id: '1', text: 'Analisis Kontrak Otomatis', votes: 127 },
      { id: '2', text: 'Asisten Riset Precedent', votes: 98 },
      { id: '3', text: 'Kalkulator Risiko Hukum', votes: 87 },
      { id: '4', text: 'Translator Bahasa Hukum', votes: 76 }
    ],
    totalVotes: 388,
    isActive: true,
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  {
    id: '2',
    question: 'Berapa lama waktu respons yang ideal untuk konsultasi hukum?',
    options: [
      { id: '1', text: 'Kurang dari 5 menit', votes: 45 },
      { id: '2', text: '5-15 menit', votes: 89 },
      { id: '3', text: '15-30 menit', votes: 156 },
      { id: '4', text: 'Lebih dari 30 menit', votes: 23 }
    ],
    totalVotes: 313,
    isActive: true
  }
]

export default function InteractivePoll() {
  const [polls, setPolls] = useState<PollData[]>(samplePolls)
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [selectedPoll, setSelectedPoll] = useState<string>('1')

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPolls(current =>
        current.map(poll => ({
          ...poll,
          options: poll.options.map(opt => ({
            ...opt,
            votes: Math.random() > 0.7 ? opt.votes + Math.floor(Math.random() * 5) : opt.votes
          })),
          totalVotes: poll.options.reduce((sum, opt) => sum + opt.votes, 0)
        }))
      )
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const handleVote = (pollId: string, optionId: string) => {
    if (userVotes[pollId]) return // Already voted

    setPolls(current =>
      current.map(poll =>
        poll.id === pollId
          ? {
              ...poll,
              options: poll.options.map(opt =>
                opt.id === optionId
                  ? { ...opt, votes: opt.votes + 1 }
                  : opt
              ),
              totalVotes: poll.totalVotes + 1
            }
          : poll
      )
    )

    setUserVotes(prev => ({ ...prev, [pollId]: optionId }))
    setShowResults(prev => ({ ...prev, [pollId]: true }))
  }

  const currentPoll = polls.find(p => p.id === selectedPoll)

  // Poll selector buttons
  const PollSelector = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {polls.map((poll) => (
        <motion.button
          key={poll.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedPoll(poll.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            selectedPoll === poll.id
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          Poll {poll.id}
          {poll.isActive && (
            <div className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse" />
          )}
        </motion.button>
      ))}
    </div>
  )

  // Poll stats
  const PollStats = ({ poll }: { poll: PollData }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Vote className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {poll.totalVotes.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {(poll.totalVotes * 0.7).toFixed(0)}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl"
      >
        <div className="flex items-center gap-3">
          {poll.isActive ? (
            <Timer className="w-5 h-5 text-purple-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {poll.isActive ? 'Time Left' : 'Status'}
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {poll.isActive ? 'Active' : 'Closed'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto p-6"
    >
      <div className="mb-8 text-center">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-2"
        >
          📊 Pasalku.ai Community Polls
        </motion.h2>
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Berikan suara Anda dan bantu kami tingkatkan layanan AI hukum terbaik untuk Indonesia
        </motion.p>
      </div>

      <PollSelector />

      <AnimatePresence mode="wait">
        {currentPoll && (
          <motion.div
            key={currentPoll.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-0 shadow-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-red-900/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
                    <Star className="w-6 h-6 text-amber-500" />
                    {currentPoll.question}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-500">Live updates</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <PollStats poll={currentPoll} />

                <div className="space-y-4">
                  {currentPoll.options
                    .sort((a, b) => b.votes - a.votes) // Sort by votes descending
                    .map((option, index) => (
                      <motion.div
                        key={option.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <VoteButton
                          option={option}
                          isSelected={userVotes[currentPoll.id] === option.id}
                          onClick={(optionId) => handleVote(currentPoll.id, optionId)}
                          voteCount={option.votes}
                        />
                      </motion.div>
                    ))}
                </div>

                {userVotes[currentPoll.id] && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="font-medium text-green-800 dark:text-green-400">
                        Terima kasih atas partisipasi Anda!
                      </span>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400"
                >
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment ({Math.floor(currentPoll.totalVotes * 0.3)})</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-purple-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Updated just now</span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}