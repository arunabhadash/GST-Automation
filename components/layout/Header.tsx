import React, { useState } from 'react';
import { BellIcon, Bars3Icon, XMarkIcon } from '../icons/Icons';
import type { Screen } from '../../App';

interface HeaderProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

function Header({ activeScreen, setActiveScreen }: HeaderProps): React.ReactNode {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems: Screen[] = ['Dashboard', 'GST Automation', 'Analytics', 'Integrations'];

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white relative">
       <div className="flex items-center">
         <div className="md:hidden mr-4">
           <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-charcoal">
             {isMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
           </button>
         </div>
         <h1 className="text-xl font-bold text-charcoal font-display">d2c-sync</h1>
       </div>
       <div className="hidden md:block">
        {/* Can add a search bar or breadcrumbs here */}
       </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-light-grey rounded-full hover:text-charcoal hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-charcoal">
          <BellIcon />
        </button>
        <div className="relative">
          <button className="flex items-center space-x-3">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src="https://picsum.photos/100/100"
              alt="User"
            />
            <div className="hidden sm:block text-left">
                <div className="font-semibold text-charcoal">The D2C Brand</div>
                <div className="text-sm text-light-grey">Founder</div>
            </div>
          </button>
        </div>
      </div>
       {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-lg z-20">
          <nav className="flex flex-col p-4 space-y-1">
            {navItems.map(item => (
              <button 
                key={item} 
                onClick={() => { setActiveScreen(item); setIsMenuOpen(false); }}
                className={`text-left p-3 rounded-md text-base ${activeScreen === item ? 'font-semibold text-primary bg-blue-50' : 'text-charcoal hover:bg-gray-50'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;