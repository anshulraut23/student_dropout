// LevelProgress Component - Display current level and roadmap
import { useGame } from '../../context/GamificationContext';
import { useTranslation } from 'react-i18next';

export default function LevelProgress() {
  const { t } = useTranslation();
  const { gamificationData, LEVELS, getXPProgressToNextLevel, getCurrentLevelData } = useGame();

  const progress = getXPProgressToNextLevel();
  const currentLevel = getCurrentLevelData();

  const getLevelTitle = (level) => {
    const levelTitleMap = {
      1: t('teacher_gamification.levels.newcomer', 'Newcomer'),
      2: t('teacher_gamification.levels.helper', 'Helper'),
      3: t('teacher_gamification.levels.student_champion', 'Student Champion'),
      4: t('teacher_gamification.levels.mentor', 'Mentor'),
      5: t('teacher_gamification.levels.master_educator', 'Master Educator'),
    };

    return levelTitleMap[level.id] || level.title;
  };

  return (
    <div className="space-y-6">
      {/* Current Level Card */}
      <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl p-6 shadow-lg border border-slate-300">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-700">{t('teacher_gamification.level.current_level', 'Current Level')}</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              {t('teacher_gamification.level.level_label', 'Level')} {gamificationData.currentLevel}
            </h2>
            <p className="text-lg font-semibold text-slate-800 mt-1">
              {getLevelTitle(currentLevel)}
            </p>
          </div>
          <div className="bg-slate-400/40 rounded-full px-4 py-2">
            <span className="text-3xl">{currentLevel.badge}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-800 font-medium">{t('teacher_gamification.level.progress_to_next', 'Progress to Next Level')}</span>
            <span className="text-slate-900 font-semibold">
              {progress.current} / {progress.next} XP
            </span>
          </div>

          <div className="h-3 bg-slate-400/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-700 rounded-full transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-700 mt-2">
            {t('teacher_gamification.level.xp_remaining', '{{count}} XP remaining', { count: progress.xpRemaining })}
          </p>
        </div>
      </div>

      {/* Level Roadmap */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <span>🗺️</span> {t('teacher_gamification.level.level_roadmap', 'Level Roadmap')}
        </h3>

        <div className="space-y-4">
          {LEVELS.map((lvl, index) => (
            <div key={lvl.id} className="relative">
              <div
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  lvl.id === gamificationData.currentLevel
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : lvl.id < gamificationData.currentLevel
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                {/* Level Icon */}
                <div
                  className={`${
                    lvl.id < gamificationData.currentLevel
                      ? 'bg-green-500'
                      : lvl.id === gamificationData.currentLevel
                      ? 'bg-blue-600'
                      : 'bg-slate-400'
                  } w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                    lvl.id > gamificationData.currentLevel ? 'opacity-40' : ''
                  }`}
                >
                  {lvl.id < gamificationData.currentLevel ? '✓' : lvl.id}
                </div>

                {/* Level Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-slate-900">{getLevelTitle(lvl)}</h4>
                    {lvl.id === gamificationData.currentLevel && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                        {t('teacher_gamification.level.current', 'Current')}
                      </span>
                    )}
                    {lvl.id < gamificationData.currentLevel && (
                      <span className="text-green-600 text-xs">✓ {t('teacher_gamification.level.unlocked', 'Unlocked')}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {lvl.maxXP === Infinity
                      ? `${lvl.minXP}+ XP`
                      : `${lvl.minXP} - ${lvl.maxXP} XP`}
                  </p>
                </div>

                {/* Lock Icon for Future Levels */}
                {lvl.id > gamificationData.currentLevel && (
                  <div className="text-slate-300 text-xl">🔒</div>
                )}
              </div>

              {/* Connecting Line */}
              {index < LEVELS.length - 1 && (
                <div
                  className={`absolute left-6 top-full h-4 w-0.5 ${
                    lvl.id < gamificationData.currentLevel ? 'bg-green-400' : 'bg-slate-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
