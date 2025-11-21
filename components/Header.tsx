import React from 'react';

interface HeaderProps {
    onDownload: () => void;
    isReady: boolean;
    isDownloading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onDownload, isReady, isDownloading }) => {
    return (
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed top-0 w-full z-50 h-14">
            <div className="max-w-screen-2xl mx-auto px-6 h-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <span className="font-semibold text-sm tracking-tight">PosterQR</span>
                </div>
                <button 
                    onClick={onDownload}
                    disabled={!isReady || isDownloading}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 
                        ${isReady && !isDownloading 
                            ? 'bg-black text-white hover:bg-gray-800 shadow-sm' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isDownloading ? 'Processing...' : 'Download Poster'}
                </button>
            </div>
        </header>
    );
};

export default Header;