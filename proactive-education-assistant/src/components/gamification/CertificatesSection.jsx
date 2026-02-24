// CertificatesSection Component - Display earned certificates
import { useGame } from '../../context/GamificationContext';
import gamificationService from '../../services/gamificationService';

export default function CertificatesSection() {
  const { gamificationData, LEVELS } = useGame();

  // Certificates are unlocked at specific levels
  const certificates = LEVELS.filter((level) => level.certificate && level.id <= gamificationData.currentLevel).map(
    (level) => ({
      id: `cert_${level.id}`,
      levelUnlocked: level.id,
      title: level.certificate,
      icon: level.badge,
      issuedDate: new Date().toISOString(),
    })
  );

  const handleDownloadCertificate = async (certificateId) => {
    try {
      await gamificationService.downloadCertificate(certificateId);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span>🎖️</span> Certificates & Rewards ({certificates.length})
      </h3>

      {certificates.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-sm">
            Unlock your first certificate by reaching Level 2!
          </p>
          <p className="text-xs text-slate-400 mt-2">Keep earning XP to advance levels</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert, index) => (
            <div key={cert.id} className="group">
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cert.icon}</span>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Unlocked at Level {cert.levelUnlocked}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadCertificate(cert.id)}
                    className="px-3 py-2 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next certificate unlock */}
      {gamificationData.currentLevel < LEVELS.length && (
        (() => {
          const nextLevelWithCert = LEVELS.find(
            (l) => l.id > gamificationData.currentLevel && l.certificate
          );
          if (nextLevelWithCert) {
            return (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-semibold text-slate-700 mb-3">🎯 Next Certificate</h4>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 opacity-60">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{nextLevelWithCert.badge}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-600">
                        {nextLevelWithCert.certificate}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Unlock at Level {nextLevelWithCert.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })()
      )}
    </div>
  );
}
