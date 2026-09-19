import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Filter,
  ExternalLink,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle2,
  FileImage,
  Clipboard,
  Sparkles,
  Download,
  FolderOpen,
  Edit3
} from 'lucide-react';
import { Question, QuestionImageAttachment } from '../types';
import { imageService } from '../utils/imageService';
import { questionStore } from '../utils/questionStore';
import { ImageModal } from './ImageModal';

interface AdminDashboardProps {
  initialQuestionId?: string;
  onNavigateToQuestion?: (index: number) => void;
  onEditQuestion?: (question: Question) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  initialQuestionId,
  onNavigateToQuestion,
  onEditQuestion,
}) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => questionStore.getAllQuestions());
  const [allImages, setAllImages] = useState<QuestionImageAttachment[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'with-images' | 'without-images'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState('');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingCaptionText, setEditingCaptionText] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState<QuestionImageAttachment | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);
  const [deletedCount, setDeletedCount] = useState<number>(() => questionStore.getDeletedCount());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Subscribe to questions
  useEffect(() => {
    const unsub = questionStore.subscribe((questions) => {
      setAllQuestions(questions);
      setDeletedCount(questionStore.getDeletedCount());
    });
    return unsub;
  }, []);

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeletingQuestion(true);
    try {
      const qTitle = questionToDelete.title;
      await questionStore.deleteQuestion(questionToDelete.id);
      setDeleteSuccessMsg(`"${qTitle}" was permanently deleted.`);
      setTimeout(() => setDeleteSuccessMsg(null), 4000);
      setQuestionToDelete(null);
      // Adjust selected index if it was pointing past end
      const remaining = questionStore.getAllQuestions();
      if (selectedQuestionIndex >= remaining.length) {
        setSelectedQuestionIndex(Math.max(0, remaining.length - 1));
      }
    } catch (err) {
      console.error('Failed to delete question:', err);
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  const handleRestoreAll = async () => {
    try {
      await questionStore.restoreAllQuestions();
      setDeleteSuccessMsg('All deleted questions have been restored.');
      setTimeout(() => setDeleteSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to restore questions:', err);
    }
  };

  // Subscribe to images service
  useEffect(() => {
    const unsub = imageService.subscribe((images) => {
      setAllImages(images);
    });
    return unsub;
  }, []);

  // Set initial selected question if provided
  useEffect(() => {
    if (initialQuestionId) {
      const idx = allQuestions.findIndex((q) => q.id === initialQuestionId);
      if (idx !== -1) {
        setSelectedQuestionIndex(idx);
      }
    }
  }, [initialQuestionId, allQuestions]);

  // Clipboard paste listener to paste screenshots directly from Snipping Tool (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileUpload(file, captionInput || 'Clipboard Screenshot');
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [selectedQuestionIndex, captionInput]);

  // Filtered list of questions
  const filteredQuestions = allQuestions.filter((q, idx) => {
    const questionImages = allImages.filter((img) => img.questionId === q.id);
    const hasImages = questionImages.length > 0;

    if (filterMode === 'with-images' && !hasImages) return false;
    if (filterMode === 'without-images' && hasImages) return false;

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.id.toLowerCase().includes(query) ||
      `q${idx + 1}`.includes(query) ||
      q.title.toLowerCase().includes(query) ||
      q.scenario.toLowerCase().includes(query) ||
      q.badge.toLowerCase().includes(query)
    );
  });

  const currentQuestion: Question = allQuestions[selectedQuestionIndex] || allQuestions[0];
  const currentQuestionImages = allImages.filter((img) => img.questionId === currentQuestion.id);

  // Handle single file upload
  const handleFileUpload = async (file: File, caption = '') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await imageService.uploadFromFile(currentQuestion.id, file, caption);
      setCaptionInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file, captionInput);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (window.confirm('Are you sure you want to remove this screenshot reference?')) {
      await imageService.deleteImage(imageId);
    }
  };

  const handleSaveCaption = async (imageId: string) => {
    await imageService.updateCaption(imageId, editingCaptionText);
    setEditingImageId(null);
    setEditingCaptionText('');
  };

  // Stats calculation
  const totalQuestions = allQuestions.length;
  const questionsWithImages = new Set(allImages.map((img) => img.questionId)).size;
  const totalImagesCount = allImages.length;

  return (
    <div className="space-y-6 w-full pb-12">
      {/* Lightbox Modal */}
      <ImageModal image={previewModalImage} onClose={() => setPreviewModalImage(null)} />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Question Screenshot & Architectural Reference Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Upload small screenshots, Nutanix Prism Central topologies, CLI outputs, or documentation snippets for any exam question. Images are permanently saved and rendered directly inside the exam cards and deep-dive drawer.
            </p>
          </div>

          {/* Quick Stats Pill Grid */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-center px-2">
              <div className="text-xl font-extrabold text-white">{totalQuestions}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Questions</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-xl font-extrabold text-emerald-400">{questionsWithImages}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">With Images</div>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-xl font-extrabold text-indigo-300">{totalImagesCount}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Screenshots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Question Navigator & Filter (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-emerald-600" />
                <span>Select Target Question</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredQuestions.length} shown
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, keyword, or title..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 pt-1 flex-wrap">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({allQuestions.length})
              </button>
              <button
                onClick={() => setFilterMode('with-images')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  filterMode === 'with-images'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>Attached</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-700/30">
                  {questionsWithImages}
                </span>
              </button>
              <button
                onClick={() => setFilterMode('without-images')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterMode === 'without-images'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pending ({totalQuestions - questionsWithImages})
              </button>
            </div>

            {/* Deleted Questions Alert & Restore Action */}
            {deletedCount > 0 && (
              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs">
                <span className="font-semibold">{deletedCount} question{deletedCount > 1 ? 's' : ''} deleted</span>
                <button
                  type="button"
                  onClick={handleRestoreAll}
                  className="px-2 py-0.5 rounded bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition-colors"
                >
                  Restore All
                </button>
              </div>
            )}

            {/* Success Feedback Banner */}
            {deleteSuccessMsg && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{deleteSuccessMsg}</span>
              </div>
            )}

            {/* Scrollable Question List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredQuestions.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No questions match your filter.
                </div>
              ) : (
                filteredQuestions.map((q) => {
                  const originalIndex = allQuestions.findIndex((item) => item.id === q.id);
                  const isSelected = originalIndex === selectedQuestionIndex;
                  const questionImages = allImages.filter((img) => img.questionId === q.id);
                  const hasImages = questionImages.length > 0;

                  return (
                    <div
                      key={q.id}
                      onClick={() => setSelectedQuestionIndex(originalIndex)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative group ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500/30'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            Q{originalIndex + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                            {q.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {hasImages ? (
                            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              <ImageIcon className="w-3 h-3" />
                              {questionImages.length}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              No image
                            </span>
                          )}

                          {/* Quick Delete Button on Question Item */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuestionToDelete(q);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-70 group-hover:opacity-100"
                            title="Delete this question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1.5">
                        {q.scenario}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Upload & Manage for Selected Question (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Question Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  Question {selectedQuestionIndex + 1}
                </span>
                <span className="text-xs font-mono text-slate-400">ID: {currentQuestion.id}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  {currentQuestion.badge}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onEditQuestion && (
                  <button
                    type="button"
                    onClick={() => onEditQuestion(currentQuestion)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                    title="Edit question text, prompt, scenarios, and options"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Question</span>
                  </button>
                )}
                {onNavigateToQuestion && (
                  <button
                    onClick={() => onNavigateToQuestion(selectedQuestionIndex)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Open this question in the exam simulator view"
                  >
                    <span>Open in Exam View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setQuestionToDelete(currentQuestion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                  title="Permanently delete this question"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete Question</span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">{currentQuestion.title}</h2>
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">Scenario:</strong>
                {currentQuestion.scenario}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-800">
                <strong>Question:</strong> {currentQuestion.prompt}
              </div>
            </div>

            {/* Upload Zone */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Upload New Screenshot / Reference Diagram
              </label>

              {/* Caption Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={captionInput}
                  onChange={(e) => setCaptionInput(e.target.value)}
                  placeholder="Optional caption (e.g. Prism Central Network Setup or YAML spec)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/70 scale-[0.99]'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50/80 bg-slate-50/40'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], captionInput);
                    }
                  }}
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to browse or drag and drop image here
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Supports PNG, JPG, WEBP, GIF, SVG (Up to 50MB)
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-700 font-medium mt-1">
                    <Clipboard className="w-3.5 h-3.5" />
                    <span>Or simply press <strong>Ctrl+V</strong> anywhere to paste from clipboard</span>
                  </div>
                </div>
              </div>

              {/* Uploading Status / Error Display */}
              {isUploading && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-pulse">
                  <Upload className="w-4 h-4 animate-bounce" />
                  <span>Processing and saving screenshot...</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                  <button onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Attached Screenshots Gallery for This Question */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Attached Screenshots for Q{selectedQuestionIndex + 1}</span>
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                {currentQuestionImages.length} {currentQuestionImages.length === 1 ? 'image' : 'images'}
              </span>
            </div>

            {currentQuestionImages.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2">
                <FileImage className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                <p className="text-xs font-medium">No screenshots uploaded for this question yet.</p>
                <p className="text-[11px] text-slate-400">
                  Use the upload box above or take a screenshot with Windows Snipping Tool and press <strong>Ctrl+V</strong>.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestionImages.map((img) => {
                  const isEditingThis = editingImageId === img.id;

                  return (
                    <div
                      key={img.id}
                      className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Thumbnail with Click to Preview */}
                      <div
                        className="relative h-44 bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95"
                        onClick={() => setPreviewModalImage(img)}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption || img.fileName}
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewModalImage(img);
                            }}
                            className="p-2 rounded-lg bg-white/90 text-slate-900 hover:bg-white transition-colors"
                            title="View Full Resolution"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info & Caption Edit */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white border-t border-slate-200">
                        {isEditingThis ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editingCaptionText}
                              onChange={(e) => setEditingCaptionText(e.target.value)}
                              placeholder="Enter caption..."
                              className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
                              autoFocus
                            />
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setEditingImageId(null)}
                                className="px-2 py-1 text-[11px] rounded text-slate-600 hover:bg-slate-100"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveCaption(img.id)}
                                className="px-2 py-1 text-[11px] rounded bg-emerald-600 text-white font-semibold flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                                {img.caption || <span className="text-slate-400 italic">No caption</span>}
                              </p>
                              <button
                                onClick={() => {
                                  setEditingImageId(img.id);
                                  setEditingCaptionText(img.caption || '');
                                }}
                                className="text-slate-400 hover:text-slate-700 p-1"
                                title="Edit caption"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 truncate mt-1">
                              {img.fileName} • {img.fileSize ? `${Math.round(img.fileSize / 1024)} KB` : ''}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                          <span>{new Date(img.uploadedAt).toLocaleDateString()}</span>
                          <button
                            onClick={() => handleDeleteImage(img.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 flex items-center gap-1 transition-colors"
                            title="Delete screenshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Question Confirmation Modal */}
      {questionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => {
            if (!isDeletingQuestion) setQuestionToDelete(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Permanently Delete Question?</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {questionToDelete.id}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
              <p className="font-semibold text-slate-900">{questionToDelete.title}</p>
              <p className="text-slate-500 line-clamp-2">{questionToDelete.prompt}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove the question from your examination simulator, study questions, and permanently purge any uploaded screenshots attached to it.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeletingQuestion}
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingQuestion}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingQuestion ? 'Deleting...' : 'Yes, Delete Question'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
