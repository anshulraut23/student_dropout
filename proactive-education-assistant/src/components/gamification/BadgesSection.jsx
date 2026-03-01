// BadgesSection Component - Display earned and available badges
import { useGame } from '../../context/GamificationContext';
import { useTranslation } from 'react-i18next';

export default function BadgesSection() {
  const { t, i18n } = useTranslation();
  const { gamificationData, BADGE_DEFINITIONS } = useGame();

  const earnedBadges = gamificationData.earnedBadges || [];
  const badgeIds = gamificationData.badges || [];

  const formatDate = (isoString) => {
    try {
      if (!isoString) return t('teacher_gamification.badges.recently', 'Recently');
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return t('teacher_gamification.badges.recently', 'Recently');
      return date.toLocaleDateString(i18n.language === 'mr' ? 'mr-IN' : i18n.language === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return t('teacher_gamification.badges.recently', 'Recently');
    }
  };

  const getBadgeTitle = (badgeInfo) => {
    const keyMap = {
      first_10_students: 'first_10_students_title',
      '7_day_streak': 'seven_day_streak_title',
      '100_records': 'hundred_records_title',
      risk_saver: 'risk_saver_title',
      consistency_star: 'consistency_star_title',
    };

    const translationKey = keyMap[badgeInfo.id];
    if (!translationKey) return badgeInfo.title;
    return t(`teacher_gamification.badges.${translationKey}`, badgeInfo.title);
  };

  const getBadgeDescription = (badgeInfo) => {
    const keyMap = {
      first_10_students: 'first_10_students_desc',
      '7_day_streak': 'seven_day_streak_desc',
      '100_records': 'hundred_records_desc',
      risk_saver: 'risk_saver_desc',
      consistency_star: 'consistency_star_desc',
    };

    const translationKey = keyMap[badgeInfo.id];
    if (!translationKey) return badgeInfo.description;
    return t(`teacher_gamification.badges.${translationKey}`, badgeInfo.description);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span>🏆</span> {t('teacher_gamification.badges.title_unlocked', 'Achievements Unlocked')} ({badgeIds.length})
      </h3>

      {badgeIds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">{t('teacher_gamification.badges.no_badges', 'No badges earned yet. Keep working to unlock your first badge!')}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {earnedBadges.map((badge) => {
            const badgeInfo = BADGE_DEFINITIONS[badge.badgeId];
            if (!badgeInfo) return null;

            const colors = {
              first_10_students: 'from-yellow-50 to-yellow-100 border-yellow-200',
              '7_day_streak': 'from-orange-50 to-orange-100 border-orange-200',
              '100_records': 'from-green-50 to-green-100 border-green-200',
              'risk_saver': 'from-blue-50 to-blue-100 border-blue-200',
              'consistency_star': 'from-purple-50 to-purple-100 border-purple-200',
            };

            return (
              <div
                key={badge.badgeId}
                className={`bg-gradient-to-br ${
                  colors[badge.badgeId] || 'from-slate-50 to-slate-100 border-slate-200'
                } border rounded-lg p-4 hover:shadow-md transition-shadow`}
              >
                <div className="text-3xl mb-2">{badgeInfo.icon}</div>
                <h4 className="font-semibold text-slate-900 text-sm">{getBadgeTitle(badgeInfo)}</h4>
                <p className="text-xs text-slate-600 mt-1">{getBadgeDescription(badgeInfo)}</p>
                <p className="text-xs text-slate-500 mt-2">{t('teacher_gamification.badges.earned_on', 'Earned')}: {formatDate(badge.earnedAt)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Available badges to unlock */}
      {badgeIds.length < Object.keys(BADGE_DEFINITIONS).length && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="text-xs font-semibold text-slate-700 mb-3">🎯 {t('teacher_gamification.badges.available_to_unlock', 'Available to Unlock')}</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {Object.values(BADGE_DEFINITIONS)
              .filter((badge) => !badgeIds.includes(badge.id))
              .slice(0, 2)
              .map((badge) => (
                <div key={badge.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 opacity-60">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <p className="text-xs font-semibold text-slate-600">{getBadgeTitle(badge)}</p>
                  <p className="text-xs text-slate-500 mt-1">{getBadgeDescription(badge)}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
