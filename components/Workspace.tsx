import React, { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { QrSettings, DragState } from '../types';
import QrOverlay from './QrOverlay';

interface WorkspaceProps {
    image: string | null;
    onImageUpload: (file: File) => void;
    settings: QrSettings;
    onSettingsChange: (newSettings: Partial<QrSettings>) => void;
    canvasRef: React.RefObject<HTMLDivElement>;
    isDownloading: boolean;
}

const Workspace: React.FC<WorkspaceProps> = ({ 
    image, 
    onImageUpload, 
    settings, 
    onSettingsChange, 
    canvasRef,
    isDownloading
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragState, setDragState] = useState<DragState | null>(null);
    const [resizeState, setResizeState] = useState<{ startX: number, initialSize: number } | null>(null);

    // --- Drag & Drop (File) Handlers ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    };

    // --- Drag (QR Position) Handlers ---
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        
        // Prevent touch scrolling
        if (e.type === 'touchstart') {
            // e.preventDefault(); // Don't prevent default here, lets browser handle focus
        }
        
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        setDragState({
            isDragging: true,
            startX: clientX,
            startY: clientY,
            initialLeft: settings.x,
            initialTop: settings.y
        });
    };

    // --- Resize Handlers ---
    const handleResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation(); // Don't trigger drag
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        
        setResizeState({
            startX: clientX,
            initialSize: settings.size
        });
    };

    // --- Global Move/Up Listeners ---
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;

            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

            if (dragState) {
                e.preventDefault();
                const containerRect = containerRef.current.getBoundingClientRect();
                
                const deltaX = clientX - dragState.startX;
                const deltaY = clientY - dragState.startY;

                const percentChangeX = (deltaX / containerRect.width) * 100;
                const percentChangeY = (deltaY / containerRect.height) * 100;

                let newX = dragState.initialLeft + percentChangeX;
                let newY = dragState.initialTop + percentChangeY;

                newX = Math.max(0, Math.min(100, newX));
                newY = Math.max(0, Math.min(100, newY));

                onSettingsChange({ x: newX, y: newY });
            }

            if (resizeState) {
                e.preventDefault();
                const containerRect = containerRef.current.getBoundingClientRect();
                const deltaX = clientX - resizeState.startX;
                const percentChange = (deltaX / containerRect.width) * 100;

                // Multiply by 2 because visual expansion feels better 
                let newSize = resizeState.initialSize + (percentChange * 2);
                newSize = Math.max(5, Math.min(80, newSize));

                onSettingsChange({ size: newSize });
            }
        };

        const handleEnd = () => {
            setDragState(null);
            setResizeState(null);
        };

        if (dragState || resizeState) {
            window.addEventListener('mousemove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [dragState, resizeState, onSettingsChange]);


    return (
        <div 
            className="bg-white flex items-center justify-center p-8 relative overflow-hidden h-full"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
             {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4]" 
                 style={{backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '24px 24px'}}>
            </div>

            {/* Empty State */}
            {!image && (
                <div className="text-center z-10 max-w-md pointer-events-none">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl mx-auto flex items-center justify-center mb-4 border border-gray-100 shadow-soft">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Upload to Start</h3>
                    <p className="text-sm text-gray-500">Drag and drop your poster here, or use the sidebar to upload.</p>
                </div>
            )}

            {/* Canvas Area */}
            {image && (
                <div 
                    ref={containerRef}
                    className="relative shadow-card select-none" 
                    style={{ lineHeight: 0 }}
                >
                    {/* Capture Ref Wrapper: Contains everything to be screenshotted */}
                    <div ref={canvasRef} className="relative bg-white inline-block">
                        <img 
                            src={image} 
                            alt="Base Poster" 
                            className="max-w-full max-h-[80vh] w-auto h-auto pointer-events-none select-none block" 
                        />
                        <QrOverlay 
                            settings={settings}
                            onMouseDown={handleDragStart}
                            onResizeStart={handleResizeStart}
                            hiddenHandle={isDownloading}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workspace;