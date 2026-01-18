import { Outlet, Link } from 'react-router-dom';
import { Footer } from '../../../../shared-core/components/footer/Footer'
import { Plane, AlertTriangle, ExternalLink, Mail, Shield, FileText, HelpCircle } from 'lucide-react';
import { GAME_CONFIG, DISCLAIMER, RESPONSIBLE_GAMBLING, CONTACT } from '../config/gameConfig';
import { SchemaMarkup } from '../../../../shared-core/components/SchemaMarkup'


// Game configuration for SEO
const GAME_SEO = {
  name: 'Pilot',
  provider: 'Gamzix',
  rtp: 97,
  domain: 'pilottracker.com',
  maxMultiplier: '10,000x',
  description: 'Real-time Pilot statistics tracker with live multiplier data, RTP analysis, and historical patterns.'
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-pilot-cream texture-paper">
      {/* Schema.org SEO Markup */}
      <SchemaMarkup game={GAME_SEO} />

      {/* Responsible Gambling Warning Banner */}
      <div className="warning-banner no-print">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{RESPONSIBLE_GAMBLING.warning} 18+ only.</span>
        </div>
      </div>

      {/* Header */}
      <header className="panel-leather sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-pilot-cream rounded-full flex items-center justify-center border-2 border-pilot-gold shadow-vintage">
                  <Plane className="w-7 h-7 text-pilot-dark group-hover:animate-float" />
                </div>
                {/* Propeller decoration */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-pilot-gold rounded-full border border-pilot-copper"></div>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-pilot-cream text-shadow-vintage">
                  Pilot Tracker
                </h1>
                <p className="text-xs text-pilot-cream/70">
                  Live Flight Statistics
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-pilot-cream hover:text-pilot-gold transition-colors font-semibold"
              >
                Dashboard
              </Link>
              <a
                href={GAME_CONFIG.providerWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pilot-cream/80 hover:text-pilot-gold transition-colors text-sm"
              >
                <span>by {GAME_CONFIG.provider}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </nav>

            {/* Stats Badge */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-pilot-cream/60 uppercase tracking-wider">RTP</div>
                <div className="text-lg font-bold text-pilot-gold">{GAME_CONFIG.rtp}%</div>
              </div>
              <div className="w-px h-10 bg-pilot-cream/20"></div>
              <div className="text-right">
                <div className="text-xs text-pilot-cream/60 uppercase tracking-wider">Max</div>
                <div className="text-lg font-bold text-pilot-gold">{GAME_CONFIG.maxMultiplier.toLocaleString()}x</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Disclaimer Bar */}
      <div className="bg-pilot-cream-dark border-b border-pilot-tan/30 py-2 px-4 no-print">
        <div className="container mx-auto">
          <p className="text-center text-sm text-pilot-brown">
            <strong>DISCLAIMER:</strong> {DISCLAIMER.affiliation}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer
        gameName="Pilot"
        gameEmoji="👨‍✈️"
        domain="pilottracker.com"
        primaryColor="#0284c7"
        botUsername="PilotTrackerBot"
        rtp={97}
        provider="Gamzix"
      />
    </div>
  );
}

export default Layout;
