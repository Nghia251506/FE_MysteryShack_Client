import React from 'react';
import { Bold, Italic, List } from 'lucide-react';

export const EditorToolbar = () => {
    const handleFormat = (format: string) => {
        // Xử lý định dạng text
        console.log(`Format: ${format}`);
    };

    return (
        <div className="flex items-center gap-2 bg-[#0a0410] border border-slate-800 border-b-0 p-3 rounded-t-xl">
            <button
                onClick={() => handleFormat('bold')}
                className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-amber-500"
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('italic')}
                className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-amber-500"
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleFormat('list')}
                className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-amber-500"
                title="List"
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    );
};