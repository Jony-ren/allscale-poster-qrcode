export interface QrSettings {
    url: string;
    size: number;
    x: number;
    y: number;
    fgColor: string;
    bgColor: string;
}

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    initialLeft: number;
    initialTop: number;
}
