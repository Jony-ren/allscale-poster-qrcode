import React from 'react';
import { ImagePlus, Check, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { QrSettings } from '../types';

interface SidebarProps {
    image: string | null;
    onImageUpload: (file: File) => void;
    settings: QrSettings;
    onSettingsChange: (newSettings: Partial<QrSettings>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ image, onImageUpload, settings, onSettingsChange }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleReset = () => {
        onSettingsChange({
            size: 25,
            x: 50,
            y: 50,
        });
    };

    return (
        <div className="border-r border-gray-100 bg-gray-50/50 p-6 space-y-8 overflow-y-auto h-full">
            {/* Section 1: Upload */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Base Image</h2>
                    {image && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-xs text-black hover:underline"
                        >
                            Replace
                        </button>
                    )}
                </div>

                {!image ? (
                    <label className="group flex flex-col items-center justify-center w-full h-32 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                            <ImagePlus className="w-6 h-6 text-gray-400 mb-2 group-hover:text-black transition-colors" />
                            <p className="text-xs text-gray-500">Click or Drag to upload</p>
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </label>
                ) : (
                    <div className="relative w-full h-24 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img src={image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                            <span className="flex items-center gap-1.5 text-black text-xs font-medium bg-white/90 px-2.5 py-1 rounded-full shadow-sm">
                                <Check className="w-3 h-3" /> Loaded
                            </span>
                        </div>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                        />
                    </div>
                )}
            </div>

            {/* Section 2: Controls (Disabled if no image) */}
            <div className={`space-y-8 transition-opacity duration-300 ${!image ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                
                {/* Link Input */}
                <div className="space-y-3">
                    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">QR Content</h2>
                    <div className="bg-white px-3 py-2 rounded-md border border-gray-200 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            value={settings.url}
                            onChange={(e) => onSettingsChange({ url: e.target.value })}
                            placeholder="https://example.com" 
                            className="w-full text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent" 
                        />
                    </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Position & Style</h2>
                        <button 
                            onClick={handleReset}
                            className="text-xs text-gray-400 hover:text-black transition-colors flex items-center gap-1"
                        >
                            <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Size Slider */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Size</span>
                                <span>{settings.size.toFixed(1)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="5" max="80" step="0.5" 
                                value={settings.size}
                                onChange={(e) => onSettingsChange({ size: parseFloat(e.target.value) })}
                                className="w-full" 
                            />
                        </div>

                        {/* X Position */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Position X</span>
                                <span>{settings.x.toFixed(1)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" step="0.5" 
                                value={settings.x}
                                onChange={(e) => onSettingsChange({ x: parseFloat(e.target.value) })}
                                className="w-full" 
                            />
                        </div>

                        {/* Y Position */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Position Y</span>
                                <span>{settings.y.toFixed(1)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" step="0.5" 
                                value={settings.y}
                                onChange={(e) => onSettingsChange({ y: parseFloat(e.target.value) })}
                                className="w-full" 
                            />
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-white p-2 rounded-md border border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Foreground</span>
                            <div className="flex items-center gap-2">
                                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                    <input 
                                        type="color" 
                                        value={settings.fgColor}
                                        onChange={(e) => onSettingsChange({ fgColor: e.target.value })}
                                        className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-none" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-gray-200 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Background</span>
                            <div className="flex items-center gap-2">
                                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                    <input 
                                        type="color" 
                                        value={settings.bgColor}
                                        onChange={(e) => onSettingsChange({ bgColor: e.target.value })}
                                        className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-none" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;