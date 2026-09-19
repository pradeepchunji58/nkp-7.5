import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Copy,
  Check,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { Question, QuestionImageAttachment } from '../types';
import { audioService } from '../utils/audioPlayer';
import { imageService } from '../utils/imageService';
import { adminTabStore } from '../utils/adminTabStore';
import { ImageModal } from './ImageModal';
import { BlurLockContainer } from './BlurLockContainer';

interface ExplanationDrawerProps {
  question: Question;
  onOpenAdmin?: (questionId: string) => void;
  onOpenAdminProtection?: () => void;
}

export const ExplanationDrawer: React.FC<ExplanationDrawerProps> = ({ question, onOpenAdmin, onOpenAdminProtection }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingDeepDive, setIsPlayingDeepDive] = useState(false);
  const [images, setImages] = useState<QuestionImageAttachment[]>([]);
  const [previewImage, setPreviewImage] = useState<QuestionImageAttachment | null>(null);
  const [isBlurred, setIsBlurred] = useState(adminTabStore.isDeepDiveBlurred());

  useEffect(() => {
    const unsub = adminTabStore.subscribe(() => {
      setIsBlurred(adminTabStore.isDeepDiveBlurred());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsPlayingDeepDive(state.isPlaying && state.currentTextId === `deepdive-${question.id}`);
    });
    return unsub;
  }, [question.id]);

  useEffect(() => {
    const unsub = imageService.subscribe((all) => {
      setImages(all.filter((i) => i.questionId === question.id));
    });
    return unsub;
  }, [question.id]);

  const handleListenDeepDive = () => {
    const correctOption = question.options.find((o) => o.id === question.correctOptionId);
    const distractors = question.options
      .filter((o) => !o.isCorrect)
      .map((o) => `Option ${o.id.toUpperCase()} is incorrect: ${o.explanation}`)
      .join('. ');

    const script = `Nutanix Kubernetes Platform Deep Dive on ${question.title}. Correct Answer is Option ${question.correctOptionId.toUpperCase()}: ${correctOption?.text || ''}. Summary: ${question.keyTakeaway}. Detailed Analysis: ${question.deepExplanation.replace(/[`*#]/g, '')}. Distractor breakdown: ${distractors}`;

    audioService.speakText(
      `deepdive-${question.id}`,
      `Deep-Dive Architecture Analysis (${question.title})`,
      script
    );
  };

  const handleCopyCli = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BlurLockContainer
      isLocked={isBlurred}
      title="Architectural Deep-Dive Permanently Hidden & Blurred"
      subtitle="Architectural explanations, technical answers, and CLI references are permanently hidden with complete blur focus. Mouse interactions, clicking, and copy-paste are disabled."
      badgeLabel="Blur Focus Active • Mouse & Copy Disabled"
      onUnlockRequest={onOpenAdminProtection}
    >
      <div
        id="explanation-section"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8"
      >
        {/* Lightbox Modal */}
        <ImageModal image={previewImage} onClose={() => setPreviewImage(null)} />

      {/* Title & Speech Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Architectural Deep-Dive</h3>
            <p className="text-xs text-slate-500">
              Nutanix Kubernetes Platform (NKP) Bastion Host Role & Component Mapping
            </p>
          </div>
        </div>

        <button
          id="btn-listen-deep-dive"
          onClick={handleListenDeepDive}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all ${
            isPlayingDeepDive
              ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
          title="Listen to full deep dive explanation via Gemini 3.1 Flash TTS"
        >
          <Volume2 className={`w-4 h-4 ${isPlayingDeepDive ? 'animate-pulse' : ''}`} />
          <span>{isPlayingDeepDive ? 'Playing Deep-Dive...' : 'Listen to Explanation (TTS)'}</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Main Core Answer Explanation */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Why Option (C) is the Correct Answer
        </h4>
        <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-3">
          <p>
            In Nutanix Kubernetes Platform (NKP), the <strong>bastion host</strong> is an
            administrative jump-host and bootstrap workstation. It provides a secure, centralized
            control point from which the platform engineer executes deployment, day-2 upgrades, and
            lifecycle operations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                1. Centralized Orchestration
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Hosts the <code>nkp</code> CLI, <code>kubectl</code>, and SSH key pairs used to
                initiate cluster provisioning against Nutanix Prism Central or public clouds.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                2. Ephemeral Bootstrap Kind Cluster
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Spawns a local containerized Kubernetes (Kind) cluster on Docker to host Cluster API
                (CAPI) controllers until the permanent target management cluster is initialized.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-600" />
                3. Air-Gapped & Offline Staging
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                In dark-site/disconnected deployments, holds the preloaded NKP offline bundle and
                feeds the local internal OCI container registry mirror.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-semibold text-slate-900 text-xs mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                4. Hardened Security Perimeter
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Acts as a secure bastion gateway so internal Kubernetes nodes never require public IP
                addresses or direct inbound SSH access from untrusted networks.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distractor Breakdown: Why other options are wrong */}
      {((question.distractorBreakdown && question.distractorBreakdown.length > 0) ||
        question.options.filter((o) => !o.isCorrect).length > 0) && (
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Distractor Analysis (Incorrect Options Breakdown)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {question.distractorBreakdown && question.distractorBreakdown.length > 0
              ? question.distractorBreakdown.map((item) => (
                  <div
                    key={item.option}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center uppercase">
                          {item.option}
                        </span>
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</span>
                      </div>
                      <p className="text-xs text-red-600 font-medium mb-2.5 leading-snug">
                        ✕ {item.whyIncorrect}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-200 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 block mb-0.5">
                        Actual Nutanix Solution:
                      </span>
                      <span className="text-emerald-700 font-medium">{item.actualNutanixSolution}</span>
                    </div>
                  </div>
                ))
              : question.options
                  .filter((o) => !o.isCorrect)
                  .map((opt) => (
                    <div
                      key={opt.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center uppercase">
                            {opt.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">{opt.text}</span>
                        </div>
                        <p className="text-xs text-red-600 font-medium mb-2.5 leading-snug">
                          ✕ {opt.explanation}
                        </p>
                      </div>
                      {opt.nutanixEquivalent && (
                        <div className="pt-2.5 border-t border-slate-200 text-xs text-slate-600">
                          <span className="font-semibold text-slate-800 block mb-0.5">
                            Nutanix Distinction:
                          </span>
                          <span className="text-emerald-700 font-medium">{opt.nutanixEquivalent}</span>
                        </div>
                      )}
                    </div>
                  ))}
          </div>
        </div>
      )}

      {/* Nutanix Ecosystem Mapping Table */}
      {question.nutanixComponents && question.nutanixComponents.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Component Comparison Matrix</span>
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Component</th>
                  <th className="px-4 py-2.5">Architectural Role</th>
                  <th className="px-4 py-2.5">Functional Distinction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {question.nutanixComponents.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{c.role}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{c.comparison}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLI Command Example */}
      {question.cliSnippet && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Bastion Host Execution Example</span>
            </div>
            <span className="text-[11px] text-slate-500">{question.cliSnippet.description}</span>
          </div>
          <div className="relative group rounded-xl bg-slate-950 text-slate-200 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
            <button
              onClick={() => handleCopyCli(question.cliSnippet!.command)}
              className="absolute top-3 right-3 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <pre className="text-emerald-400 leading-relaxed pr-16">{question.cliSnippet.command}</pre>
          </div>
        </div>
      )}

      {/* Visual Reference Screenshots Section */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>Architectural Reference Screenshots & Console Proofs ({images.length})</span>
            </div>
            {onOpenAdmin && (
              <button
                onClick={() => onOpenAdmin(question.id)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Upload more screenshots
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => setPreviewImage(img)}
                className="group relative bg-slate-900 rounded-xl border border-slate-800 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all flex flex-col"
              >
                <div className="relative h-44 w-full flex items-center justify-center bg-slate-950 p-2">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || img.fileName}
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-lg bg-white/90 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Full Resolution</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {img.caption || img.fileName}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">
                    {img.fileSize ? `${Math.round(img.fileSize / 1024)} KB` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </BlurLockContainer>
  );
};
