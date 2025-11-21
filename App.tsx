import React, { useState, useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import { QrSettings } from './types';
import * as htmlToImage from 'html-to-image';

const App: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    
    const [settings, setSettings] = useState<QrSettings>({
        url: 'https://openai.com',
        size: 25,
        x: 50,
        y: 50,
        fgColor: '#E9F6F1',
        bgColor: '#15382C'
    });

    const handleImageUpload = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setImage(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSettingsChange = (newSettings: Partial<QrSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const handleDownload = async () => {
        if (!canvasRef.current || isDownloading) return;

        try {
            setIsDownloading(true);
            
            // Short delay to allow UI to update (hide handles)
            await new Promise(resolve => setTimeout(resolve, 50));

            const node = canvasRef.current;
            
            // Warmup render to force asset loading
            await htmlToImage.toPng(node, {
                quality: 0.01,
                skipAutoScale: true,
                cacheBust: true,
            });

            // High quality render
            const dataUrl = await htmlToImage.toPng(node, {
                quality: 1.0,
                pixelRatio: 3, // High DPI
                skipAutoScale: true,
                backgroundColor: '#ffffff',
            });

            const link = document.createElement('a');
            link.download = 'poster-qr.png';
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            <Header 
                onDownload={handleDownload} 
                isReady={!!image} 
                isDownloading={isDownloading}
            />
            
            <main className="pt-14 h-full grid lg:grid-cols-[360px_1fr] w-full overflow-hidden">
                <Sidebar 
                    image={image}
                    onImageUpload={handleImageUpload}
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                />
                
                <Workspace 
                    image={image}
                    onImageUpload={handleImageUpload}
                    settings={settings}
                    onSettingsChange={handleSettingsChange}
                    canvasRef={canvasRef}
                    isDownloading={isDownloading}
                />
            </main>
        </div>
    );
};

export default App;