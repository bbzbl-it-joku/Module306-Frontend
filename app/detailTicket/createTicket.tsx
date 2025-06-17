import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navigation } from '~/navigation/navigation';

// Types and constants (matching your existing structure)
const TicketStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  UNDER_REVIEW: 'under-review',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  CANCELLED: 'cancelled'
} as const;

const TicketPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

const PRIORITY_COLORS = {
  [TicketPriority.LOW]: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300'
  },
  [TicketPriority.MEDIUM]: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300'
  },
  [TicketPriority.HIGH]: {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    border: 'border-orange-300'
  },
  [TicketPriority.CRITICAL]: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    border: 'border-red-300'
  }
};

// File validation constants (from your attachment.ts)
const FILE_UPLOAD_VALIDATION = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFilesPerUpload: 5,
  allowedMimeTypes: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain', 'text/csv', 'application/json', 'application/xml',
    'application/zip', 'application/x-rar-compressed'
  ],
  allowedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.txt', '.csv', '.json', '.xml',
    '.zip', '.rar'
  ]
} as const;

// Types for form data and errors
type FormData = {
  title: string;
  description: string;
  priority: typeof TicketPriority[keyof typeof TicketPriority];
  status: typeof TicketStatus[keyof typeof TicketStatus];
  assignedTo: string;
  dueDate: string;
  tags: string[];
};

type AttachedFile = {
  id: string;
  file: File;
  preview?: string;
  error?: string;
};

type FormErrors = Partial<Record<keyof FormData, string>> & {
  submit?: string;
  files?: string;
};

// File validation functions
const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  if (file.size > FILE_UPLOAD_VALIDATION.maxFileSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${FILE_UPLOAD_VALIDATION.maxFileSize / (1024 * 1024)}MB`
    };
  }

  if (!FILE_UPLOAD_VALIDATION.allowedMimeTypes.includes(file.type as typeof FILE_UPLOAD_VALIDATION.allowedMimeTypes[number])) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed`
    };
  }

  const extension = getFileExtension(file.name).toLowerCase();
  if (!FILE_UPLOAD_VALIDATION.allowedExtensions.includes(extension as typeof FILE_UPLOAD_VALIDATION.allowedExtensions[number])) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`
    };
  }

  return { valid: true };
};

const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex >= 0 ? filename.slice(lastDotIndex) : '';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
  if (mimeType.startsWith('text/')) return '📃';
  return '📎';
};

// Form validation
const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (formData.assignedTo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.assignedTo)) {
    errors.assignedTo = 'Please enter a valid email address';
  }

  if (formData.dueDate) {
    const dueDate = new Date(formData.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  return errors;
};

// Generate unique ticket ID
const generateTicketId = () => {
  const prefix = 'TKT';
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${number}`;
};

type CreateTicketProps = {
  isModal?: boolean;
  onSubmit?: (ticket: any, files: File[]) => void;
  onCancel?: () => void;
};

export default function CreateTicket({ isModal = false, onSubmit, onCancel }: CreateTicketProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    assignedTo: '',
    dueDate: '',
    tags: []
  });

  // UI state
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File attachment state
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle tag management
  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addFiles(files);
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const addFiles = (files: File[]) => {
    // Check total file count
    if (attachedFiles.length + files.length > FILE_UPLOAD_VALIDATION.maxFilesPerUpload) {
      setErrors(prev => ({
        ...prev,
        files: `Maximum ${FILE_UPLOAD_VALIDATION.maxFilesPerUpload} files allowed`
      }));
      return;
    }

    const newFiles: AttachedFile[] = [];

    files.forEach(file => {
      // Check if file already exists
      const exists = attachedFiles.some(f => f.file.name === file.name && f.file.size === file.size);
      if (exists) return;

      // Validate file
      const validation = validateFileUpload(file);
      const attachedFile: AttachedFile = {
        id: Math.random().toString(36).substr(2, 9),
        file, 
        error: validation.valid ? undefined : validation.error
      };

      // Create preview for images
      if (file.type.startsWith('image/') && validation.valid) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachedFiles(prev =>
            prev.map(f =>
              f.id === attachedFile.id
                ? { ...f, preview: e.target?.result as string }
                : f
            )
          );
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(attachedFile);
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);

    // Clear file errors if we successfully added files
    if (newFiles.length > 0) {
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = Array.from(event.dataTransfer.files);
    addFiles(files);
  };

  const navigate = useNavigate()
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const validationErrors = validateForm(formData);

    // Check for file errors
    const fileErrors = attachedFiles.filter(f => f.error);
    if (fileErrors.length > 0) {
      validationErrors.files = 'Please remove invalid files before submitting';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new ticket object
      const now = new Date().toISOString();
      const newTicket = {
        id: generateTicketId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo.trim() || undefined,
        dueDate: formData.dueDate || undefined,
        tags: formData.tags,
        createdBy: ' current.user@company.com',
        createdAt: now,
        modifiedBy: 'current.user@company.com',
        modifiedAt: now
      };

      // Get valid files
      const validFiles = attachedFiles.filter(f => !f.error).map(f => f.file);

      // Call parent submit handler with ticket and files
      if (onSubmit) {
        await onSubmit(newTicket, validFiles);
      } // actaul submission logic would go here, e.g. API call

      navigate(-1)
      // Reset form on success
      setFormData({
        title: '',
        description: '',
        priority: TicketPriority.MEDIUM,
        status: TicketStatus.OPEN,
        assignedTo: '',
        dueDate: '',
        tags: []
      });
      setAttachedFiles([]);
      setErrors({});

    } catch (error) {
      console.error('Error creating ticket:', error);
      setErrors({ submit: 'Failed to create ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setErrors({});
    setFormData({
      title: '',
      description: '',
      priority: TicketPriority.MEDIUM,
      status: TicketStatus.OPEN,
      assignedTo: '',
      dueDate: '',
      tags: []
    });
    navigate(-1)
      
  };

  const formContent = (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter ticket title"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the issue or requirement in detail"
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.description.length}/1000 characters
        </p>
      </div>

      {/* Priority and Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={TicketPriority.LOW}>Low</option>
            <option value={TicketPriority.MEDIUM}>Medium</option>
            <option value={TicketPriority.HIGH}>High</option>
            <option value={TicketPriority.CRITICAL}>Critical</option>
          </select>
          <div className="mt-1">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${PRIORITY_COLORS[formData.priority].bg} ${PRIORITY_COLORS[formData.priority].text}`}>
              {formData.priority}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={TicketStatus.OPEN}>Open</option>
            <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
            <option value={TicketStatus.UNDER_REVIEW}>Under Review</option>
          </select>
        </div>
      </div>

      {/* Assignee and Due Date Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <input
            type="email"
            value={formData.assignedTo}
            onChange={(e) => handleInputChange('assignedTo', e.target.value)}
            placeholder="user@company.com"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.assignedTo ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.assignedTo && (
            <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.dueDate ? 'border-red-300' : 'border-gray-300'
              }`}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add tag (e.g., bug, feature, urgent)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Add
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Press Enter or click Add to add tags
        </p>
      </div>

      {/* File Attachments */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>

        {/* Drag and Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragOver
              ? 'border-blue-400 bg-blue-50'
              : errors.files
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            accept={FILE_UPLOAD_VALIDATION.allowedExtensions.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-gray-600">
              <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs text-gray-500">
              Up to {FILE_UPLOAD_VALIDATION.maxFilesPerUpload} files, max {FILE_UPLOAD_VALIDATION.maxFileSize / (1024 * 1024)}MB each
            </p>
            <p className="text-xs text-gray-500">
              PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF, TXT, CSV, ZIP
            </p>
          </div>
        </div>

        {errors.files && (
          <p className="mt-1 text-sm text-red-600">{errors.files}</p>
        )}

        {/* File List */}
        {attachedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700">
              Attached Files ({attachedFiles.length}/{FILE_UPLOAD_VALIDATION.maxFilesPerUpload})
            </h4>
            <div className="space-y-2">
              {attachedFiles.map((attachedFile) => (
                <div
                  key={attachedFile.id}
                  className={`flex items-center p-3 rounded-lg border ${attachedFile.error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                    }`}
                >
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0 mr-3">
                    {attachedFile.preview ? (
                      <img
                        src={attachedFile.preview}
                        alt={attachedFile.file.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center text-lg">
                        {getFileIcon(attachedFile.file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {attachedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(attachedFile.file.size)}
                    </p>
                    {attachedFile.error && (
                      <p className="text-xs text-red-600 mt-1">{attachedFile.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFile(attachedFile.id)}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </div>
  );

  // If used as modal, wrap in modal container
  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  // If used as standalone page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Header */}
      <Navigation />

      <div className="relative z-10 pt-20 pb-8 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-white-900">Create New Ticket</h1>
            <p className="mt-2 text-gray-300">
              Create a new ticket to track issues, bugs, or feature requests
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 text-gray-900">
          {formContent}
        </div>
      </div>
    </div>
  );
}