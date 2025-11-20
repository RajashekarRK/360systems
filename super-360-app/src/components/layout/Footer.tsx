import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-greatlakes-gray-darker text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.aboutGreatLakes')}</h3>
            <p className="text-sm text-gray-300 mb-4">
              {t('common.instituteName')} - A premier business school offering world-class management education.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/greatlakes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-greatlakes-blue rounded-full flex items-center justify-center hover:bg-greatlakes-blue/80 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/greatlakes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-greatlakes-blue rounded-full flex items-center justify-center hover:bg-greatlakes-blue/80 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/greatlakes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-greatlakes-blue rounded-full flex items-center justify-center hover:bg-greatlakes-blue/80 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/school/greatlakes"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-greatlakes-blue rounded-full flex items-center justify-center hover:bg-greatlakes-blue/80 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.programs')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#pgpm" className="text-gray-300 hover:text-greatlakes-blue transition">
                  PGPM - Full Time MBA
                </a>
              </li>
              <li>
                <a href="#pgdm" className="text-gray-300 hover:text-greatlakes-blue transition">
                  PGDM - Full Time
                </a>
              </li>
              <li>
                <a href="#pgxpm" className="text-gray-300 hover:text-greatlakes-blue transition">
                  PGXPM - Executive MBA
                </a>
              </li>
              <li>
                <a href="#online-mba" className="text-gray-300 hover:text-greatlakes-blue transition">
                  Online MBA Programs
                </a>
              </li>
              <li>
                <a href="#doctoral" className="text-gray-300 hover:text-greatlakes-blue transition">
                  Doctoral Programs (FPM)
                </a>
              </li>
              <li>
                <a href="#corporate" className="text-gray-300 hover:text-greatlakes-blue transition">
                  Corporate Programs
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#faculty" className="text-gray-300 hover:text-greatlakes-blue transition">
                  {t('nav.faculty')}
                </a>
              </li>
              <li>
                <a href="#recruiters" className="text-gray-300 hover:text-greatlakes-blue transition">
                  {t('nav.recruiters')}
                </a>
              </li>
              <li>
                <a href="#alumni" className="text-gray-300 hover:text-greatlakes-blue transition">
                  {t('nav.alumni')}
                </a>
              </li>
              <li>
                <a href="#admissions" className="text-gray-300 hover:text-greatlakes-blue transition">
                  {t('nav.admissions')}
                </a>
              </li>
              <li>
                <a href="#research" className="text-gray-300 hover:text-greatlakes-blue transition">
                  {t('nav.research')}
                </a>
              </li>
              <li>
                <a href="#campus" className="text-gray-300 hover:text-greatlakes-blue transition">
                  Campus Life
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">{t('footer.contactUs')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-greatlakes-blue flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  Great Lakes Institute of Management<br />
                  Chennai, Tamil Nadu<br />
                  India - 600034
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-greatlakes-blue flex-shrink-0" />
                <a href="tel:+914428181897" className="text-gray-300 hover:text-greatlakes-blue transition">
                  +91 44 2818 1897
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-greatlakes-blue flex-shrink-0" />
                <a href="mailto:admissions@greatlakes.edu.in" className="text-gray-300 hover:text-greatlakes-blue transition">
                  admissions@greatlakes.edu.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Accreditation Logos */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-bold mb-6 text-center text-white">{t('footer.accreditation')}</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* AACSB */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg w-24 h-24 flex items-center justify-center">
                <img
                  src="/assets/accreditation/aacsb-logo.png"
                  alt="AACSB Accredited"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = 'AACSB';
                  }}
                />
                <span className="text-xs font-bold text-gray-800"></span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('footer.aacsb')}</p>
            </div>

            {/* AMBA */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg w-24 h-24 flex items-center justify-center">
                <img
                  src="/assets/accreditation/amba-logo.png"
                  alt="AMBA Accredited"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = 'AMBA';
                  }}
                />
                <span className="text-xs font-bold text-gray-800"></span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('footer.amba')}</p>
            </div>

            {/* NBA */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg w-24 h-24 flex items-center justify-center">
                <img
                  src="/assets/accreditation/nba-logo.png"
                  alt="NBA Accredited"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = 'NBA';
                  }}
                />
                <span className="text-xs font-bold text-gray-800"></span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('footer.nba')}</p>
            </div>

            {/* AICTE */}
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg w-24 h-24 flex items-center justify-center">
                <img
                  src="/assets/accreditation/aicte-logo.png"
                  alt="AICTE Approved"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling!.textContent = 'AICTE';
                  }}
                />
                <span className="text-xs font-bold text-gray-800"></span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{t('footer.aicte')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400 text-center md:text-left">
              {t('footer.copyright')}
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-greatlakes-blue transition">
                {t('footer.privacyPolicy')}
              </a>
              <a href="#terms" className="text-gray-400 hover:text-greatlakes-blue transition">
                {t('footer.termsOfService')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
