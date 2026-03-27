import React from 'react';

// Иконка дома (главная страница)
export const HomeIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка профиля
export const ProfileIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка настроек
export const SettingsIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9867C9.5799 19.7154 9.31074 19.5053 9 19.38C8.69838 19.2469 8.36381 19.2072 8.03941 19.266C7.71502 19.3248 7.41568 19.4795 7.18 19.71L7.12 19.77C6.93425 19.956 6.71368 20.1035 6.47088 20.2041C6.22808 20.3048 5.96783 20.3566 5.705 20.3566C5.44217 20.3566 5.18192 20.3048 4.93912 20.2041C4.69632 20.1035 4.47575 19.956 4.29 19.77C4.10405 19.5843 3.95653 19.3637 3.85588 19.1209C3.75523 18.8781 3.70343 18.6178 3.70343 18.355C3.70343 18.0922 3.75523 17.8319 3.85588 17.5891C3.95653 17.3463 4.10405 17.1257 4.29 16.94L4.35 16.88C4.58054 16.6443 4.73519 16.345 4.794 16.0206C4.85282 15.6962 4.81312 15.3616 4.68 15.06C4.55324 14.7642 4.34276 14.512 4.07447 14.3343C3.80618 14.1566 3.49179 14.0613 3.17 14.06H3C2.46957 14.06 1.96086 13.8493 1.58579 13.4742C1.21071 13.0991 1 12.5904 1 12.06C1 11.5296 1.21071 11.0209 1.58579 10.6458C1.96086 10.2707 2.46957 10.06 3 10.06H3.09C3.42099 10.0523 3.742 9.94512 4.0133 9.75251C4.2846 9.5599 4.49474 9.29074 4.62 8.98C4.75312 8.67838 4.79282 8.34381 4.734 8.01941C4.67519 7.69502 4.52054 7.39568 4.29 7.16L4.23 7.1C4.04405 6.91425 3.89653 6.69368 3.79588 6.45088C3.69523 6.20808 3.64343 5.94783 3.64343 5.685C3.64343 5.42217 3.69523 5.16192 3.79588 4.91912C3.89653 4.67632 4.04405 4.45575 4.23 4.27C4.41575 4.08405 4.63632 3.93653 4.87912 3.83588C5.12192 3.73523 5.38217 3.68343 5.645 3.68343C5.90783 3.68343 6.16808 3.73523 6.41088 3.83588C6.65368 3.93653 6.87425 4.08405 7.06 4.27L7.12 4.33C7.35568 4.56054 7.65502 4.71519 7.97941 4.774C8.30381 4.83282 8.63838 4.79312 8.94 4.66H9C9.29577 4.53324 9.54802 4.32276 9.72569 4.05447C9.90337 3.78618 9.99872 3.47179 10 3.15V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15V15Z" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка поиска
export const SearchIcon = ({ active = false }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle 
      cx="11" 
      cy="11" 
      r="8" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M21 21L16.65 16.65" 
      stroke={active ? "#FF6B35" : "#666"} 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка FAQ (вопрос в круге)
export const FAQIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle 
      cx="12" 
      cy="12" 
      r="10" 
      stroke="#666" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01" 
      stroke="#666" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка выхода (стрелка из квадрата)
export const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" 
      stroke="#666" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка молнии (логотип)
export const LightningIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
      fill="#FF6B35" 
      stroke="#FF6B35" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Иконка пламени (для streak)
export const FlameIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M8.5 14.5A2.5 2.5 0 0 0 11 12C11 10 8 9 8 9C8 9 5 10 5 13.5C5 16.5 6.5 17.5 8.5 17.5C10.5 17.5 12 16 12 14C12 16 13.5 17 15 17C16.5 17 18 15.5 18 13.5C18 10 15 9 15 9C15 9 12 10 12 12C12 10.5 13 9.5 13 8C13 6 11 5 11 5C11 5 9 6 9 8C9 7 8 6 8 5C8 4 7 3 7 3C7 3 6 4 6 5C6 7 7.5 8.5 8.5 10.5C7.5 11.5 6.5 12.5 6.5 13.5C6.5 14.5 7.5 14.5 8.5 14.5Z" 
      fill="#FF6B35"
    />
  </svg>
);

// Иконки для типов карточек
export const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V4H6.5C5.83696 4 5.20107 4.26339 4.73223 4.73223C4.26339 5.20107 4 5.83696 4 6.5V19.5Z" 
      stroke="#666" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const AtomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="1" fill="#666"/>
    <path d="M20.2 20.2C22.4 17.8 22.4 14.2 20.2 11.8M20.2 20.2C17.8 22.4 14.2 22.4 11.8 20.2M20.2 20.2L16.2 16.2M3.8 3.8C1.6 6.2 1.6 9.8 3.8 12.2M3.8 3.8C6.2 1.6 9.8 1.6 12.2 3.8M3.8 3.8L7.8 7.8M20.2 3.8C22.4 6.2 22.4 9.8 20.2 12.2M20.2 3.8C17.8 1.6 14.2 1.6 11.8 3.8M20.2 3.8L16.2 7.8M3.8 20.2C1.6 17.8 1.6 14.2 3.8 11.8M3.8 20.2C6.2 22.4 9.8 22.4 12.2 20.2M3.8 20.2L7.8 16.2" stroke="#666" strokeWidth="2"/>
  </svg>
);

export const LanguageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2"/>
    <path d="M2 12H22M12 2C14.5 6 16 9.5 16 12C16 14.5 14.5 18 12 22C9.5 18 8 14.5 8 12C8 9.5 9.5 6 12 2Z" stroke="#666" strokeWidth="2"/>
  </svg>
);

export const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 18L22 12L16 6M8 6L2 12L8 18" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BrainIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5 2C8.5 2 7.5 2.5 7 3.5C6.5 4.5 6.5 5.5 7 6.5C6 7 5 8 5 9.5C5 11 6 12 7.5 12.5C7.5 13.5 8 14.5 9 15C10 15.5 11 15.5 12 15C13 14.5 13.5 13.5 13.5 12.5C15 12 16 11 16 9.5C16 8 15 7 14 6.5C14.5 5.5 14.5 4.5 14 3.5C13.5 2.5 12.5 2 11.5 2C11 2 10.5 2 10 2.5C9.5 2 9.5 2 9.5 2Z" stroke="#666" strokeWidth="2" fill="none"/>
  </svg>
);

export const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2"/>
    <path d="M2 12H22M12 2C15 6 16.5 9 16.5 12C16.5 15 15 18 12 22C9 18 7.5 15 7.5 12C7.5 9 9 6 12 2Z" stroke="#666" strokeWidth="2"/>
  </svg>
);

export const HashIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 9H20M4 15H20M10 3L8 21M16 3L14 21" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const PenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ScalesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V21M9 6L12 3L15 6M9 18L12 21L15 18M3 12H21M5 9V15M19 9V15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MicroscopeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="#666" strokeWidth="2"/>
    <path d="M19 19L22 22M11 3V7M7 11H15" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const CalculatorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#666" strokeWidth="2"/>
    <path d="M8 8H16M8 12H16M8 16H12M12 8V16" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Иконка фильтра/настройки
export const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

