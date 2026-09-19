import React, { useState, useRef, useEffect } from 'react';
import {
  PlusCircle,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Check,
  Clipboard,
  HelpCircle,
  Layers,
  Server,
  ShieldCheck,
  Terminal,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Edit3,
  X,
  Search,
  Download,
  FileText,
  Eye,
  Camera,
  RotateCcw,
  ListFilter
} from 'lucide-react';
import { Question, OptionKey, QuestionOption, QuestionImageAttachment } from '../types';
import { questionStore } from '../utils/questionStore';
import { imageService } from '../utils/imageService';
import { RichTextToolbar } from './RichTextToolbar';
import { FormattedText } from './FormattedText';

interface QuestionCreatorProps {
  onQuestionCreated?: (questionIndex: number) => void;
  onNavigateToQuestion?: (index: number) => void;
  editQuestion?: Question | null;
  initialQuestionId?: string;
  onCancelEdit?: () => void;
}

interface StagedImage {
  id: string;
  dataUrl: string;
  fileName: string;
  caption: string;
  fileSize: number;
}

const DEFAULT_BADGES = [
  'Bastion Host Architecture & Sizing',
  'Air-Gapped & Darksite Registry',
  'CAPI Cluster Lifecycle & Nutanix AHV',
  'Centralized Monitoring & Thanos',
  'Identity, OIDC & Dex Authentication',
  'Container Networking & Calico / MetalLB',
  'CSI Volume Storage & Nutanix Volumes',
  'OS Tooling, containerd & Docker',
  'AppDeployment & Cluster Overrides',
  'Velero Backup & Disaster Recovery',
  'Workspaces & Governance Licensing',
];

export const QuestionCreator: React.FC<QuestionCreatorProps> = ({
  onQuestionCreated,
  onNavigateToQuestion,
  editQuestion,
  initialQuestionId,
  onCancelEdit,
}) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => questionStore.getAllQuestions());
  const [allImages, setAllImages] = useState<QuestionImageAttachment[]>(() => imageService.getAllImages());
  
  // Selected question ID for editing (null means creating brand new)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(() => {
    if (editQuestion) return editQuestion.id;
    if (initialQuestionId) return initialQuestionId;
    return null;
  });

  // Basic Fields
  const [badge, setBadge] = useState<string>(DEFAULT_BADGES[0]);
  const [customBadge, setCustomBadge] = useState('');
  const [title, setTitle] = useState('');
  const [scenario, setScenario] = useState('');
  const [prompt, setPrompt] = useState('');

  // 4 Required Options (A, B, C, D)
  const [options, setOptions] = useState<{
    a: { text: string; explanation: string; nutanixEquivalent: string };
    b: { text: string; explanation: string; nutanixEquivalent: string };
    c: { text: string; explanation: string; nutanixEquivalent: string };
    d: { text: string; explanation: string; nutanixEquivalent: string };
  }>({
    a: { text: '', explanation: '', nutanixEquivalent: '' },
    b: { text: '', explanation: '', nutanixEquivalent: '' },
    c: { text: '', explanation: '', nutanixEquivalent: '' },
    d: { text: '', explanation: '', nutanixEquivalent: '' },
  });

  const [correctOptionId, setCorrectOptionId] = useState<OptionKey>('a');

  // Explanations & CLI
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [deepExplanation, setDeepExplanation] = useState('');
  const [cliCommand, setCliCommand] = useState('');
  const [cliDescription, setCliDescription] = useState('');

  // Staged Images (new uploads pending save) & Existing images (already on server)
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [existingImages, setExistingImages] = useState<QuestionImageAttachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [captionInput, setCaptionInput] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState<QuestionImageAttachment | StagedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);

  // Textarea Refs for formatting insertion
  const scenarioRef = useRef<HTMLTextAreaElement | null>(null);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const optARef = useRef<HTMLTextAreaElement | null>(null);
  const optBRef = useRef<HTMLTextAreaElement | null>(null);
  const optCRef = useRef<HTMLTextAreaElement | null>(null);
  const optDRef = useRef<HTMLTextAreaElement | null>(null);
  const takeawayRef = useRef<HTMLTextAreaElement | null>(null);
  const deepRef = useRef<HTMLTextAreaElement | null>(null);

  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Questions Directory & Filter state below form
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilter, setTableFilter] = useState<'all' | 'with-images' | 'without-images'>('all');
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);

  // Subscriptions to stores
  useEffect(() => {
    const unsubQ = questionStore.subscribe((questions) => {
      setAllQuestions(questions);
    });
    const unsubI = imageService.subscribe((images) => {
      setAllImages(images);
    });
    return () => {
      unsubQ();
      unsubI();
    };
  }, []);

  // Populate form with question data when activeQuestionId changes
  const loadQuestionIntoForm = (q: Question) => {
    if (DEFAULT_BADGES.includes(q.badge)) {
      setBadge(q.badge);
      setCustomBadge('');
    } else {
      setBadge('Custom');
      setCustomBadge(q.badge);
    }

    setTitle(q.title || '');
    setScenario(q.scenario || '');
    setPrompt(q.prompt || '');

    const optA = q.options.find((o) => o.id === 'a');
    const optB = q.options.find((o) => o.id === 'b');
    const optC = q.options.find((o) => o.id === 'c');
    const optD = q.options.find((o) => o.id === 'd');

    setOptions({
      a: {
        text: optA?.text || '',
        explanation: optA?.explanation || '',
        nutanixEquivalent: optA?.nutanixEquivalent || '',
      },
      b: {
        text: optB?.text || '',
        explanation: optB?.explanation || '',
        nutanixEquivalent: optB?.nutanixEquivalent || '',
      },
      c: {
        text: optC?.text || '',
        explanation: optC?.explanation || '',
        nutanixEquivalent: optC?.nutanixEquivalent || '',
      },
      d: {
        text: optD?.text || '',
        explanation: optD?.explanation || '',
        nutanixEquivalent: optD?.nutanixEquivalent || '',
      },
    });

    setCorrectOptionId(q.correctOptionId || 'a');
    setKeyTakeaway(q.keyTakeaway || '');
    setDeepExplanation(q.deepExplanation || '');
    setCliCommand(q.cliSnippet?.command || '');
    setCliDescription(q.cliSnippet?.description || '');

    // Load existing images attached to this question
    const imgs = imageService.getImagesForQuestion(q.id);
    setExistingImages(imgs);
    setStagedImages([]);
    setValidationError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    if (editQuestion) {
      setActiveQuestionId(editQuestion.id);
      loadQuestionIntoForm(editQuestion);
    } else if (initialQuestionId) {
      const q = questionStore.getQuestionById(initialQuestionId);
      if (q) {
        setActiveQuestionId(q.id);
        loadQuestionIntoForm(q);
      }
    }
  }, [editQuestion, initialQuestionId]);

  // Handle dropdown switch
  const handleSelectQuestionToEdit = (qId: string) => {
    if (!qId) {
      // Switch to create mode
      handleSwitchToCreateNew();
      return;
    }
    const q = allQuestions.find((item) => item.id === qId);
    if (q) {
      setActiveQuestionId(q.id);
      loadQuestionIntoForm(q);
      // Smooth scroll to top of editor
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleSwitchToCreateNew = () => {
    setActiveQuestionId(null);
    setBadge(DEFAULT_BADGES[0]);
    setCustomBadge('');
    setTitle('');
    setScenario('');
    setPrompt('');
    setOptions({
      a: { text: '', explanation: '', nutanixEquivalent: '' },
      b: { text: '', explanation: '', nutanixEquivalent: '' },
      c: { text: '', explanation: '', nutanixEquivalent: '' },
      d: { text: '', explanation: '', nutanixEquivalent: '' },
    });
    setCorrectOptionId('a');
    setKeyTakeaway('');
    setDeepExplanation('');
    setCliCommand('');
    setCliDescription('');
    setStagedImages([]);
    setExistingImages([]);
    setValidationError(null);
    setSuccessMessage(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  // Clipboard paste listener to paste screenshots directly (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleProcessFile(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [title, captionInput]);

  const handleProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files (PNG, JPEG, WebP) are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const newImage: StagedImage = {
        id: `stage-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        dataUrl,
        fileName: file.name || `screenshot-${Date.now()}.png`,
        caption: captionInput.trim() || (title ? `Screenshot: ${title}` : 'Question Reference Screenshot'),
        fileSize: file.size,
      };

      setStagedImages((prev) => [...prev, newImage]);
      setCaptionInput('');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach((file: File) => handleProcessFile(file));
      e.target.value = '';
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files as FileList).forEach((file: File) => handleProcessFile(file));
    }
  };

  const handleRemoveStagedImage = (id: string) => {
    setStagedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDeleteExistingImage = async (id: string) => {
    await imageService.deleteImage(id);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpdateCaption = (id: string, newCaption: string) => {
    setStagedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, caption: newCaption } : img))
    );
  };

  const handleFillTemplate = () => {
    setBadge('Bastion Host Architecture & Sizing');
    setTitle('Bastion Host Ephemeral Kind Cluster Network Isolation');
    setScenario(
      'An enterprise cloud administrator is executing `nkp create cluster nutanix` from an air-gapped Ubuntu bastion host.\n\n• The installer starts an ephemeral bootstrap Kind cluster.\n• It fails while provisioning workload nodes on AHV.\n• Port 9443 on the bastion host is blocked by a host firewall.'
    );
    setPrompt(
      'Which network configuration rule MUST be enabled on the bastion host firewall to allow Nutanix CAPI bootstrap callbacks to complete successfully?'
    );
    setOptions({
      a: {
        text: 'Allow inbound TCP port `9443` from AHV subnet so CAPI controllers can receive Webhook callbacks from the bootstrap Kind cluster',
        explanation: 'Correct! The NKP ephemeral Kind cluster on the bastion exposes CAPI admission webhooks on port 9443 that AHV nodes and cluster controllers require.',
        nutanixEquivalent: 'CAPI Webhook Admission Controller',
      },
      b: {
        text: 'Allow outbound UDP port 53 only, as CAPI uses DNS tunneling to bootstrap nodes',
        explanation: 'Incorrect. CAPI does not bootstrap via DNS tunneling.',
        nutanixEquivalent: 'CoreDNS',
      },
      c: {
        text: 'Disable all container bridges and run Docker in host-only network mode',
        explanation: 'Incorrect. Disabling container bridges breaks Kind multi-node internal networking.',
        nutanixEquivalent: 'containerd / bridge networking',
      },
      d: {
        text: 'Expose TCP port 22 directly from the bastion to the public internet',
        explanation: 'Incorrect. Air-gapped deployments strictly forbid exposing bastion SSH to the public internet.',
        nutanixEquivalent: 'Bastion Security Hardening',
      },
    });
    setCorrectOptionId('a');
    setKeyTakeaway('The bastion host hosting the ephemeral Kind bootstrap cluster must permit inbound TCP 9443 from the target AHV cluster subnet.');
    setDeepExplanation('During `nkp create cluster nutanix`, the bastion host hosts a temporary Kind cluster containing Cluster API (CAPI) controllers. AHV cluster validation webhooks listen on port 9443. If iptables or ufw blocks TCP 9443, the bootstrap hangs at "Waiting for Cluster API components to be ready".');
    setCliCommand('sudo ufw allow from 10.0.0.0/24 to any port 9443 proto tcp comment "NKP CAPI Webhooks"');
    setCliDescription('Permits ingress to CAPI webhooks from the AHV workload network.');
    setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    // Validate Required Fields
    if (!title.trim()) {
      setValidationError('Please enter a Question Title.');
      return;
    }
    if (!prompt.trim()) {
      setValidationError('Please enter the Question Prompt.');
      return;
    }
    if (!options.a.text.trim() || !options.b.text.trim() || !options.c.text.trim() || !options.d.text.trim()) {
      setValidationError('All four options (Option A, Option B, Option C, and Option D) are strictly required. Please provide text for each.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedBadge = badge === 'Custom' && customBadge.trim() ? customBadge.trim() : badge;
      const questionId = activeQuestionId || `nkp-custom-${Date.now()}`;

      // Upload staged images to /api/question-images
      for (const img of stagedImages) {
        try {
          await imageService.uploadFromDataUrl(questionId, img.dataUrl, img.fileName, img.caption || title);
        } catch (uploadErr) {
          console.warn('Image upload error for question:', uploadErr);
        }
      }

      const formattedOptions: QuestionOption[] = (['a', 'b', 'c', 'd'] as const).map((key) => {
        const isCorrect = key === correctOptionId;
        const opt = options[key];
        return {
          id: key,
          text: opt.text.trim(),
          isCorrect,
          explanation: opt.explanation.trim() || (isCorrect ? 'Correct solution.' : 'Incorrect distractor.'),
          nutanixEquivalent: opt.nutanixEquivalent.trim() || undefined,
        };
      });

      const questionData: Question = {
        id: questionId,
        badge: selectedBadge,
        title: title.trim(),
        scenario: scenario.trim() || 'Standard operational deployment on Nutanix AHV with NKP.',
        prompt: prompt.trim(),
        options: formattedOptions,
        correctOptionId,
        keyTakeaway: keyTakeaway.trim() || undefined,
        deepExplanation: deepExplanation.trim() || undefined,
        cliSnippet: cliCommand.trim()
          ? {
              command: cliCommand.trim(),
              description: cliDescription.trim() || 'Command execution snippet',
            }
          : undefined,
      };

      if (activeQuestionId) {
        // Update existing question
        await questionStore.updateQuestion(questionData);
        setSuccessMessage(`Successfully updated question "${title}" and screenshot exhibits!`);
      } else {
        // Add new question
        await questionStore.addQuestion(questionData);
        setSuccessMessage(`Successfully created and added "${title}" to the question bank!`);
        setActiveQuestionId(questionData.id);
      }

      // Refresh images for this question
      const refreshedImgs = imageService.getImagesForQuestion(questionId);
      setExistingImages(refreshedImgs);
      setStagedImages([]);

      if (onQuestionCreated) {
        const all = questionStore.getAllQuestions();
        const createdIndex = all.findIndex((q) => q.id === questionId);
        if (createdIndex >= 0) {
          onQuestionCreated(createdIndex);
        }
      }
    } catch (err: any) {
      console.error('Failed to save question:', err);
      setValidationError(err.message || 'Failed to save question. Please verify fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete question confirmation
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeletingQuestion(true);
    try {
      const qTitle = questionToDelete.title;
      await questionStore.deleteQuestion(questionToDelete.id);
      setSuccessMessage(`"${qTitle}" was deleted from the question bank.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setQuestionToDelete(null);
      if (activeQuestionId === questionToDelete.id) {
        handleSwitchToCreateNew();
      }
    } catch (err) {
      console.error('Failed to delete question:', err);
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      version: 'nkp-cn-7.5-v2',
      exportedAt: new Date().toISOString(),
      questions: questionStore.getAllQuestions(),
      images: imageService.getAllImages(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nkp-exam-questions-backup-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (Array.isArray(data.questions)) {
          for (const q of data.questions) {
            await questionStore.updateQuestion(q);
          }
        }
        alert('Question backup imported successfully!');
        setAllQuestions(questionStore.getAllQuestions());
      } catch (err) {
        alert('Failed to parse backup JSON file. Ensure it is valid JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filter questions for table
  const filteredTableQuestions = allQuestions.filter((q) => {
    const imagesCount = imageService.getImagesForQuestion(q.id).length;
    if (tableFilter === 'with-images' && imagesCount === 0) return false;
    if (tableFilter === 'without-images' && imagesCount > 0) return false;

    if (!tableSearch.trim()) return true;
    const term = tableSearch.toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      q.prompt.toLowerCase().includes(term) ||
      q.badge.toLowerCase().includes(term) ||
      q.id.toLowerCase().includes(term)
    );
  });

  const isEditMode = Boolean(activeQuestionId);
  const activeQuestion = allQuestions.find((q) => q.id === activeQuestionId);
  const currentQuestionNumber = activeQuestion
    ? allQuestions.findIndex((q) => q.id === activeQuestionId) + 1
    : null;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Studio Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Add and Edit Question Studio
            </h2>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider font-mono">
              NCP-CN 7.5 Unified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Create new questions, edit existing questions, configure multiple options and terminal commands, and manage screenshot exhibits — all in one unified workspace.
          </p>
        </div>

        {/* Global Studio Tools */}
        <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
          <button
            onClick={handleSwitchToCreateNew}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
              !isEditMode
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>+ Create New Question</span>
          </button>

          <button
            onClick={handleFillTemplate}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Load standard NKP sample question"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Sample</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export JSON backup of questions and attached images"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => backupFileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Import questions from JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-300" />
            <span>Import JSON</span>
          </button>
          <input
            type="file"
            ref={backupFileInputRef}
            onChange={handleImportBackup}
            accept=".json,application/json"
            className="hidden"
          />
        </div>
      </div>

      {/* QUESTION SELECTOR & EDIT MODE CONTROLLER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Question to Edit &amp; Attach Screenshots:
            </span>
            {isEditMode && currentQuestionNumber && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 font-mono">
                Editing Question #{currentQuestionNumber} ({activeQuestionId})
              </span>
            )}
          </div>

          {isEditMode && (
            <button
              onClick={handleSwitchToCreateNew}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Switch to Create New Question</span>
            </button>
          )}
        </div>

        {/* Question Selector Dropdown */}
        <div className="relative">
          <select
            value={activeQuestionId || ''}
            onChange={(e) => handleSelectQuestionToEdit(e.target.value)}
            className="w-full text-xs font-semibold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="">+ [Create Brand New Question]</option>
            {allQuestions.map((q, idx) => {
              const imgCount = imageService.getImagesForQuestion(q.id).length;
              return (
                <option key={q.id} value={q.id}>
                  Q{idx + 1}: {q.title} — [{q.badge}] {imgCount > 0 ? `📷 (${imgCount} screenshots)` : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Success & Error Notifications */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {validationError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-center justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="font-semibold">{validationError}</span>
          </div>
          <button
            onClick={() => setValidationError(null)}
            className="text-red-700 hover:text-red-900 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MAIN QUESTION & SCREENSHOT EDITING FORM */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Active Mode Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {isEditMode
                ? `Editing Mode: Question #${currentQuestionNumber || ''} (${activeQuestionId})`
                : 'Creation Mode: Authoring Brand New Question'}
            </span>
          </div>
          <div className="text-xs text-slate-500">
            All updates instantly propagate to the Question Tab and NCP-CN 7.5 Pre-Exam Simulation.
          </div>
        </div>

        {/* Section 1: Topic Badge & Title */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Topic Domain / Badge Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_BADGES.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => {
                    setBadge(b);
                    setCustomBadge('');
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    badge === b
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBadge('Custom')}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  badge === 'Custom'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                + Custom Domain...
              </button>
            </div>

            {badge === 'Custom' && (
              <input
                type="text"
                placeholder="Enter custom badge category..."
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-2"
              />
            )}
          </div>

          {/* Question Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Question Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bastion Host Ephemeral Kind Cluster Network Isolation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm font-semibold px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
        </div>

        {/* Section 2: Deployment Scenario & Question Prompt with Toolbars */}
        <div className="space-y-6 pt-2 border-t border-slate-100">
          {/* Scenario */}
          <div className="space-y-1">
            <RichTextToolbar
              textareaRef={scenarioRef}
              value={scenario}
              onChange={setScenario}
              label="3. Deployment Scenario (Supports Terminal, Bullets, Steps, Bold, Commands)"
            />
            <textarea
              ref={scenarioRef}
              rows={4}
              placeholder="Provide the enterprise context, architecture state, and error logs... Use toolbar for code blocks, bullets, and steps."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
            {scenario && (
              <div className="mt-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-700">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Live Scenario Preview:
                </div>
                <FormattedText content={scenario} />
              </div>
            )}
          </div>

          {/* Prompt */}
          <div className="space-y-1">
            <RichTextToolbar
              textareaRef={promptRef}
              value={prompt}
              onChange={setPrompt}
              label="4. Question Prompt (The precise question asked to the candidate) *"
            />
            <textarea
              ref={promptRef}
              rows={2}
              placeholder="e.g., Which network configuration rule MUST be enabled on the bastion host firewall to allow CAPI bootstrap to complete?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3 text-xs sm:text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Section 3: THE 4 OPTIONS (A, B, C, D) - ALL FULLY VIEWABLE & EDITABLE */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-emerald-600" />
              <span>5. Exam Options (A, B, C, D) &amp; Solutions</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify 4 distinct options. Select which one is the verified correct answer according to Nutanix official documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['a', 'b', 'c', 'd'] as const).map((key) => {
              const opt = options[key];
              const isCorrect = correctOptionId === key;
              const refMap = {
                a: optARef,
                b: optBRef,
                c: optCRef,
                d: optDRef,
              };

              return (
                <div
                  key={key}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isCorrect
                      ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500/40'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  {/* Option Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                        }`}
                      >
                        {key.toUpperCase()}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Option {key.toUpperCase()}
                      </span>
                    </div>

                    {/* Radio Button to Mark Correct */}
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={isCorrect}
                        onChange={() => setCorrectOptionId(key)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className={isCorrect ? 'text-emerald-700 font-bold' : 'text-slate-600'}>
                        {isCorrect ? '✓ Correct Answer' : 'Mark as Correct'}
                      </span>
                    </label>
                  </div>

                  {/* Option Text with Toolbar */}
                  <div className="space-y-1">
                    <RichTextToolbar
                      textareaRef={refMap[key]}
                      value={opt.text}
                      onChange={(val) =>
                        setOptions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], text: val },
                        }))
                      }
                      label={`Option ${key.toUpperCase()} Text`}
                    />
                    <textarea
                      ref={refMap[key]}
                      rows={3}
                      placeholder={`Enter text for Option ${key.toUpperCase()} (supports inline code, bold, bullets)...`}
                      value={opt.text}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], text: e.target.value },
                        }))
                      }
                      className="w-full bg-white border border-slate-300 rounded-b-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      required
                    />
                  </div>

                  {/* Live Option Preview */}
                  {opt.text && (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Preview:
                      </div>
                      <FormattedText content={opt.text} />
                    </div>
                  )}

                  {/* Option Explanation / Rationale */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Explanation / Why {isCorrect ? 'Correct' : 'Incorrect'}:
                    </label>
                    <input
                      type="text"
                      placeholder="Rationale according to Nutanix docs..."
                      value={opt.explanation}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], explanation: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Nutanix Equivalent / Component */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Nutanix Component / Feature:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., CAPI Webhook, Calico, Dex"
                      value={opt.nutanixEquivalent}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], nutanixEquivalent: e.target.value },
                        }))
                      }
                      className="w-full text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Architecture Takeaway, Deep Explanation & CLI */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>6. Architecture Takeaway &amp; Nutanix Deep Analysis</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* Key Takeaway with Toolbar */}
            <div className="space-y-1">
              <RichTextToolbar
                textareaRef={takeawayRef}
                value={keyTakeaway}
                onChange={setKeyTakeaway}
                label="Key Architecture Takeaway (Summary for Flashcards)"
              />
              <textarea
                ref={takeawayRef}
                rows={2}
                placeholder="High-impact one-liner summary for candidate review..."
                value={keyTakeaway}
                onChange={(e) => setKeyTakeaway(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Deep Explanation with Toolbar */}
            <div className="space-y-1">
              <RichTextToolbar
                textareaRef={deepRef}
                value={deepExplanation}
                onChange={setDeepExplanation}
                label="Deep Technical Explanation & Architecture Analysis"
              />
              <textarea
                ref={deepRef}
                rows={3}
                placeholder="In-depth analysis covering why options are correct or incorrect according to the Nutanix documentation..."
                value={deepExplanation}
                onChange={(e) => setDeepExplanation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-b-xl p-3 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            {/* Linux Command & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Linux Command Snippet (Optional)
                </label>
                <div className="relative">
                  <Terminal className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="e.g., sudo ufw allow from 10.0.0.0/24 to any port 9443 proto tcp"
                    value={cliCommand}
                    onChange={(e) => setCliCommand(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Command Description
                </label>
                <input
                  type="text"
                  placeholder="e.g., Opens inbound TCP 9443 for CAPI admission webhooks"
                  value={cliDescription}
                  onChange={(e) => setCliDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: SCREENSHOTS & EXHIBITS MANAGER (Integrated directly from Admin) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>7. Screenshots, Exhibits &amp; Diagram Manager</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload architecture topology screenshots, Prism Central screenshots, or terminal captures. Supports drag-and-drop and <strong>Ctrl+V clipboard pasting</strong> from Snipping Tool.
              </p>
            </div>
            <div className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 self-start sm:self-auto">
              Total Attached: {existingImages.length + stagedImages.length}
            </div>
          </div>

          {/* Caption Input for Uploads */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="Caption for screenshot (e.g., Prism Central Network Topology or Kind Cluster Terminal)"
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 text-slate-900"
            />
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
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
              onChange={handleFileInputChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              multiple
              className="hidden"
            />
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-700 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Drop screenshot images here, or click to browse
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PNG, JPG, WebP supported • You can also press <strong>Ctrl+V</strong> to paste directly from Windows Snipping Tool
                </p>
              </div>
            </div>
          </div>

          {/* Gallery of Attached Screenshots (Staged + Existing) */}
          {(existingImages.length > 0 || stagedImages.length > 0) && (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attached Screenshots for this Question:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Existing Images */}
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative group"
                  >
                    <div
                      className="h-36 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer relative"
                      onClick={() => setPreviewModalImage(img)}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.caption || 'Screenshot'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                        <Eye className="w-4 h-4" /> Click to View
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-800 truncate" title={img.caption}>
                      {img.caption || 'Attached Screenshot'}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>{Math.round(img.fileSize / 1024)} KB</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingImage(img.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                      >
                        Delete Image
                      </button>
                    </div>
                  </div>
                ))}

                {/* Staged Images (New) */}
                {stagedImages.map((img) => (
                  <div
                    key={img.id}
                    className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2 relative group"
                  >
                    <div
                      className="h-36 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer relative"
                      onClick={() => setPreviewModalImage(img)}
                    >
                      <img
                        src={img.dataUrl}
                        alt={img.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        Pending Save
                      </div>
                    </div>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={(e) => handleUpdateCaption(img.id, e.target.value)}
                      placeholder="Screenshot caption..."
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded text-slate-800"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-emerald-200">
                      <span>{Math.round(img.fileSize / 1024)} KB</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStagedImage(img.id)}
                        className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={handleSwitchToCreateNew}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Cancel / Reset Form' : 'Clear Form'}</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  {isEditMode ? <Edit3 className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                  <span>{isEditMode ? 'Update & Save Question Changes' : 'Save & Add to Question Bank'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* QUESTION BANK & SCREENSHOT INVENTORY TABLE (from AdminDashboard) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>Question Bank &amp; Screenshot Inventory ({allQuestions.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse all questions in the bank, edit parameters &amp; options, manage attached screenshots, or test in practice mode.
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setTableFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tableFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({allQuestions.length})
            </button>
            <button
              onClick={() => setTableFilter('with-images')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tableFilter === 'with-images'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              With Screenshots ({allQuestions.filter((q) => imageService.getImagesForQuestion(q.id).length > 0).length})
            </button>
            <button
              onClick={() => setTableFilter('without-images')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                tableFilter === 'without-images'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              No Screenshots ({allQuestions.filter((q) => imageService.getImagesForQuestion(q.id).length === 0).length})
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search questions by title, badge, prompt, or ID..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Questions List */}
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filteredTableQuestions.length === 0 ? (
            <div className="text-center py-10 space-y-2 text-slate-500">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold">No questions matched your search or filter.</p>
            </div>
          ) : (
            filteredTableQuestions.map((q, idx) => {
              const qImages = imageService.getImagesForQuestion(q.id);
              const isCurrentlyEditing = activeQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className={`py-4 px-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isCurrentlyEditing
                      ? 'bg-emerald-50/70 border border-emerald-300'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-slate-900 text-white">
                        Q{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {q.badge}
                      </span>
                      <span className="text-xs font-mono text-slate-400">ID: {q.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                        Correct: Option {q.correctOptionId.toUpperCase()}
                      </span>
                      {qImages.length > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 flex items-center gap-1">
                          <Camera className="w-3 h-3" /> {qImages.length} Screenshots
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{q.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{q.prompt}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSelectQuestionToEdit(q.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isCurrentlyEditing
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isCurrentlyEditing ? 'Editing Now' : 'Edit & Manage'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const originalIdx = allQuestions.findIndex((item) => item.id === q.id);
                        if (originalIdx !== -1 && onNavigateToQuestion) {
                          onNavigateToQuestion(originalIdx);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Test Question in Practice Mode"
                    >
                      <span>Test in Exam</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setQuestionToDelete(q)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Permanently Delete Question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setQuestionToDelete(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Permanently Delete Question?</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {questionToDelete.id}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
              <p className="font-semibold text-slate-900">{questionToDelete.title}</p>
              <p className="text-slate-500 line-clamp-2">{questionToDelete.prompt}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently remove this question from your exam pool, practice simulation, and clear any uploaded screenshots.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeletingQuestion}
                onClick={() => setQuestionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingQuestion}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeletingQuestion ? 'Deleting...' : 'Yes, Delete Question'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Enlarge Preview Modal */}
      {previewModalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setPreviewModalImage(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  {previewModalImage.caption || 'Question Screenshot Exhibit'}
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  {('fileName' in previewModalImage && previewModalImage.fileName) || 'Exhibit'}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalImage(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-2">
              <img
                src={'imageUrl' in previewModalImage ? previewModalImage.imageUrl : previewModalImage.dataUrl}
                alt={previewModalImage.caption || 'Exhibit'}
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
