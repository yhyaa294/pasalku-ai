"use client"

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Users, CheckCircle, Clock, Star, TrendingUp, Shield } from 'lucide-react'

const stats = [
  { icon: Users, value: "10,000+", label: "Konsultasi Selesai", color: "text-purple-600 dark:text-purple-400" },
  { icon: Star, value: "95%", label: "Tingkat Kepuasan", color: "text-yellow-600 dark:text-yellow-400" },
  { icon: Clock, value: "24/7", label: "Selalu Tersedia", color: "text-green-600 dark:text-green-400" },
  { icon: Zap, value: "0 Detik", label: "Waktu Tunggu", color: "text-orange-600 dark:text-orange-400" }
]

const activities = [
  { user: "Anon****", action: "memulai konsultasi PHK", time: "2 menit lalu", type: "consultation" },
  { user: "Budi****", action: "menganalisis kontrak kerja", time: "5 menit lalu", type: "analysis" },
  { user: "Sara****", action: "mengunduh laporan hukum", time: "8 menit lalu", type: "report" },
  { user: "Riko****", action: "simulasi negosiasi", time: "12 menit lalu", type: "simulation" },
  { user: "Maya****", action: "memulai konsultasi keluarga", time: "15 menit lalu", type: "consultation" }
]

export default function SocialProofBar() {
  const [currentStats, setCurrentStats] = useState(stats.map(s => ({ ...s, display: "0" })))
  const [currentActivities, setCurrentActivities] = useState(activities.slice(0, 3))
  const [activeUsers, setActiveUsers] = useState(127)

  // Animate numbers on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentStats(stats)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Rotate activities
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivities(prev => {
        const next = [...prev.slice(1), activities[Math.floor(Math.random() * activities.length)]]
        return next
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Update active users
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Stats Bar */}
      <section className="bg-white dark:bg-slate-900 py-12 border-y border-gray-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {currentStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} transition-all duration-1000`}>
                    {stat.display || stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity Feed */}
      <section className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-indigo-950/30 py-8 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="font-bold text-gray-900 dark:text-white">Aktivitas Real-time</span>
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-500/30">
                {activeUsers} orang aktif
              </Badge>
            </div>

            {/* Activity List */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 text-sm p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg backdrop-blur-sm border border-white/20 dark:border-slate-700/50 animate-fadeIn"
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong className="text-gray-900 dark:text-white">{activity.user}</strong>{" "}
                    <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-xs ml-auto">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
