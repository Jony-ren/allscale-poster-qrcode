import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrSettings } from '../types';

interface QrOverlayProps {
    settings: QrSettings;
    onMouseDown: (e: React.MouseEvent | React.TouchEvent) => void;
    onResizeStart: (e: React.MouseEvent | React.TouchEvent) => void;
    hiddenHandle?: boolean;
}

const QrOverlay: React.FC<QrOverlayProps> = ({ settings, onMouseDown, onResizeStart, hiddenHandle }) => {
    return (
        <div
            className="absolute cursor-move group select-none touch-none"
            style={{
                left: `${settings.x}%`,
                top: `${settings.y}%`,
                width: `${settings.size}%`,
                transform: 'translate(-50%, -50%)',
                aspectRatio: '1/1',
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
        >
            {/* Visual Container */}
            <div 
                className="w-full h-full p-2 shadow-sm pointer-events-none select-none flex items-center justify-center"
                style={{ backgroundColor: settings.bgColor }}
            >
                <QRCodeSVG
                    value={settings.url}
                    size={256} // This is the internal resolution, SVG scales perfectly
                    bgColor={settings.bgColor}
                    fgColor={settings.fgColor}
                    level="H"
                    className="w-full h-full block"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* Hover Border Effect */}
            <div className={`absolute inset-0 border-2 border-black opacity-0 transition-opacity pointer-events-none rounded-sm ${hiddenHandle ? '' : 'group-hover:opacity-100'}`}></div>

            {/* Resize Handle */}
            {!hiddenHandle && (
                <div
                    className="absolute w-3 h-3 bg-white border-[1.5px] border-black rounded-full right-[-6px] bottom-[-6px] cursor-nwse-resize z-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={onResizeStart}
                    onTouchStart={onResizeStart}
                />
            )}
        </div>
    );
};

export default QrOverlay;