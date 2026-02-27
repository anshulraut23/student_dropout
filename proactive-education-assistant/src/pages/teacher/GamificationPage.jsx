// Gamification Page - Complete teacher progress, rewards, and tasks system
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGame } from '../../context/GamificationContext';
import TeacherStats from '../../components/gamification/TeacherStats';
import LevelProgress from '../../components/gamification/LevelProgress';
import BadgesSection from '../../components/gamification/BadgesSection';
import CertificatesSection from '../../components/gamification/CertificatesSection';
import DailyTasks from '../../components/gamification/DailyTasks';
import gamificationService from '../../services/gamificationService';

export default function GamificationPage() {
  const { t } = useTranslation();
  const { applyServerStats } = useGame();

  useEffect(() => {
    // Fetch fresh stats from backend on page load
    const fetchStats = async () => {
      try {
        console.log('📊 Fetching fresh gamification stats...');
        
        // Update login streak (this awards +10 XP if first login of the day)
        const streakResponse = await gamificationService.updateLoginStreak();
        console.log('✅ Login streak updated:', streakResponse);
        
        // Fetch complete stats from backend
        const statsResponse = await gamificationService.getTeacherStats();
        console.log('✅ Stats fetched:', statsResponse);
        
        if (statsResponse && statsResponse.stats) {
          applyServerStats(statsResponse.stats);
        }
      } catch (error) {
        console.error('❌ Error fetching gamification data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="px-4 py-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">
            {t("teacher_gamification.title", "🎯 Teacher Progress & Rewards")}
          </h1>
          <p className="text-slate-600 mt-1">
            {t("teacher_gamification.subtitle", "Track your impact, earn XP, unlock achievements, and compete on leaderboards")}
          </p>
        </div>

        {/* Stats Overview Cards */}
        <TeacherStats />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Level & Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <LevelProgress />
            <BadgesSection />
          </div>

          {/* Right Column - Daily Tasks & Stats */}
          <div>
            <DailyTasks />
          </div>
        </div>

        {/* Certificates Section */}
        <CertificatesSection />

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span>💡</span> {t("teacher_gamification.how_it_works", "How Gamification Works")}
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>
                  <strong>{t("teacher_gamification.earn_xp", "Earn XP")}</strong> {t("teacher_gamification.earn_xp_desc", "by completing actions like adding attendance, marking assignments, and helping at-risk students")}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>
                  <strong>{t("teacher_gamification.level_up", "Level Up")}</strong> {t("teacher_gamification.level_up_desc", "as you accumulate XP. Each level unlocks new certificates and recognition")}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>
                  <strong>{t("teacher_gamification.collect_badges", "Collect Badges")}</strong> {t("teacher_gamification.collect_badges_desc", "by reaching milestones and maintaining streaks")}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>
                  <strong>{t("teacher_gamification.climb_leaderboard", "Climb the Leaderboard")}</strong> {t("teacher_gamification.climb_leaderboard_desc", "to compete with other teachers in your school and district")}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
