// components/ticket/AttachmentList.tsx
import React, { useRef } from 'react';
import type { Attachment } from '../types/attachment';

interface AttachmentListProps {
  attachments: Attachment[];
  onAddAttachment?: (file: File) => void;
  onRemoveAttachment?: (id: string) => void;
}

export function AttachmentList({ attachments, onAddAttachment, onRemoveAttachment }: AttachmentListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
 const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm16 2H4v8l4-4 4 4 4-4 4 4V6zm-4 3a1 1 0 11-2 0 1 1 0 012 0z"/>
        </svg>
      );
    }
    
    if (mimeType === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      );
    }
    
    if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return (
        <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,17H12V15H10V13H12V15H14M14,9H12V7H14M10,9H12V7H10M10,13H12V11H10V13M12,11H14V9H12V11M12,5H14V3H12M10,5H12V3H10M14,1H10V3H8V5H6V23H18V5H16V3H14V1Z"/>
        </svg>
      );
    }
    
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel') || mimeType === 'text/csv') {
      return (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      );
    }
    
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      );
    }
    
    // Default file icon
    return (
      <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
      </svg>
    );
  };;

  const getFileName = (url: string) => {
    return url.split('/').pop() || 'Unknown file';
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getFileSize = (url: string) => {
    // In a real app, this would come from the attachment metadata
    // For now, return a mock size
    return '2.4 MB';
  };

  const handleDownload = (attachment: Attachment) => {
    // In a real app, this would handle the download
    console.log('Downloading attachment:', attachment.id);
    window.open(attachment.url, '_blank');
  };

  const handlePreview = (attachment: Attachment) => {
    // In a real app, this would open a preview modal
    console.log('Previewing attachment:', attachment.id);
    if (attachment.mimeType.startsWith('image/')) {
      window.open(attachment.url, '_blank');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAddAttachment) {
      onAddAttachment(file);
      // Reset the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemove = (id: string) => {
    if (onRemoveAttachment) {
      onRemoveAttachment(id);
    }
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-6">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <p className="text-sm text-gray-500">No attachments</p>
        <label htmlFor="attachment-upload" className="mt-2 text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
          Add attachment
        </label>
        <input 
          type="file" 
          id="attachment-upload" 
          ref={fileInputRef}
          className="hidden" 
          onChange={handleFileChange} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center space-x-3 p-3 border border-white/20 hover:border-white/80 rounded-lg  transition-colors group "
        >
          {/* File Icon */}
          <div className="flex-shrink-0">
            {getFileIcon(attachment.mimeType)}
          </div>
          
          {/* File Info */}
          <div className="flex-1 min-w-0 ">
            <div className="text-sm font-medium text-gray-90 truncate">
              {getFileName(attachment.url)}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {getFileSize(attachment.url)} • {attachment.mimeType}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {attachment.mimeType.startsWith('image/') && (
              <button
                onClick={() => handlePreview(attachment)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                title="Preview"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
            
            <button
              onClick={() => handleDownload(attachment)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            
            <button
              onClick={() => handleRemove(attachment.id)}
              className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors"
              title="Remove"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {/* Add Attachment Button with Hidden File Input */}
      <div className="relative">
        <label 
          htmlFor="attachment-upload-list" 
          className="block w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-50 hover:border-gray-400 hover:text-gray-400 transition-colors group cursor-pointer"
        >
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm font-medium">Add attachment</span>
          </div>
          <input 
            type="file" 
            id="attachment-upload-list" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange} 
          />
        </label>
      </div>
    </div>
  );
}