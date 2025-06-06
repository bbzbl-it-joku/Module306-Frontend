/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ticket/CommentForm.tsx
import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export function CommentForm({ onSubmit, placeholder = "Add a comment..." }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        {/* Current User Avatar */}
        <div className="flex-shrink-0 pt-2">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            U
          </div>
        </div>
        
        {/* Comment Input */}
        <div className="flex-1">
            <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {content.length}/10000
            </div>
            </div>
          
          {/* Form Actions */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              {/* Formatting toolbar */}
              <div className="flex items-center space-x-2">

                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                  title="Attach file"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
              </div>
              
              <div className="text-xs text-gray-400">
                Cmd+Enter to submit
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setContent('')}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                disabled={isSubmitting || !content.trim()}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Posting...</span>
                  </div>
                ) : (
                  'Comment'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}