import React, { useState } from 'react';
import { PillarType } from './types';
import { Header } from './components/Header';
import { PrayerTimeBanner } from './components/PrayerTimeBanner';
import { PillarBerdakwah } from './components/PillarBerdakwah';
import { PillarBersyariah } from './components/PillarBersyariah';
import { PillarBerjamaah } from './components/PillarBerjamaah';
import { PillarBermuamalah } from './components/PillarBermuamalah';
import { InfaqModal } from './components/InfaqModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GcpFacilitatorModal } from './components/GcpFacilitatorModal';
import { Footer } from './components/Footer';
import { MurottalProvider } from './context/MurottalContext';
import { MurottalFloatingPlayer } from './components/MurottalFloatingPlayer';
import { MurottalStudioModal } from './components/MurottalStudioModal';

export default function App() {
  const [activePillar, setActivePillar] = useState<PillarType>('berdakwah');
  const [selectedCity, setSelectedCity] = useState<string>('Jakarta Pusat');

  // Modal States
  const [isInfaqModalOpen, setIsInfaqModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGcpModalOpen, setIsGcpModalOpen] = useState(false);
  const [infaqTitle, setInfaqTitle] = useState('Infaq & Sedekah Umum ABDICity');
  const [infaqAmount, setInfaqAmount] = useState(50000);

  const handleOpenInfaqModal = (title?: string, amount?: number) => {
    if (title) setInfaqTitle(title);
    if (amount) setInfaqAmount(amount);
    setIsInfaqModalOpen(true);
  };

  return (
    <MurottalProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-400 selection:text-emerald-950 pb-16">
        {/* Header Navbar */}
        <Header
          activePillar={activePillar}
          setActivePillar={setActivePillar}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          onOpenInfaqModal={() => handleOpenInfaqModal()}
          onOpenUserProfile={() => setIsProfileModalOpen(true)}
          onOpenGcpFacilitator={() => setIsGcpModalOpen(true)}
        />

        {/* Real-time Prayer Times & Ayah Ticker Banner */}
        <PrayerTimeBanner selectedCity={selectedCity} onCityChange={setSelectedCity} />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
          
          {/* Active 4B Pillar Content Component */}
          {activePillar === 'berdakwah' && (
            <PillarBerdakwah onOpenInfaqModal={handleOpenInfaqModal} />
          )}
          
          {activePillar === 'bersyariah' && (
            <PillarBersyariah onOpenInfaqModal={handleOpenInfaqModal} />
          )}
          
          {activePillar === 'berjamaah' && (
            <PillarBerjamaah onOpenInfaqModal={handleOpenInfaqModal} />
          )}
          
          {activePillar === 'bermuamalah' && <PillarBermuamalah />}

        </main>

        {/* Footer */}
        <Footer onOpenGcpFacilitator={() => setIsGcpModalOpen(true)} />

        {/* Infaq & Zakat Transaction Modal */}
        <InfaqModal
          isOpen={isInfaqModalOpen}
          onClose={() => setIsInfaqModalOpen(false)}
          defaultTitle={infaqTitle}
          defaultAmount={infaqAmount}
        />

        {/* User Profile & Charity Bar Chart Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenInfaqModal={handleOpenInfaqModal}
        />

        {/* Google Cloud Platform Intelligent Facilitator Modal */}
        <GcpFacilitatorModal
          isOpen={isGcpModalOpen}
          onClose={() => setIsGcpModalOpen(false)}
        />

        {/* Persistent Floating Murottal Player & Prayer Sync Widget */}
        <MurottalFloatingPlayer />

        {/* Comprehensive Murottal Studio & Prayer Scheduler Modal */}
        <MurottalStudioModal />
      </div>
    </MurottalProvider>
  );
}
