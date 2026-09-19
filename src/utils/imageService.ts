import { QuestionImageAttachment } from '../types';

type Listener = (images: QuestionImageAttachment[]) => void;

class ImageService {
  private images: QuestionImageAttachment[] = [];
  private listeners: Set<Listener> = new Set();
  private isLoaded = false;
  private readonly STORAGE_KEY = 'nkp_question_images_cache';

  constructor() {
    this.loadInitialImages();
  }

  private loadInitialImages() {
    // Hardcoded static manifest fallback to guarantee Vercel / GitHub production deployment always includes all uploaded reference screenshots instantly without relying on volatile runtime localStorage or missing server endpoints
    const staticManifestImages: QuestionImageAttachment[] = [
      {
        id: 'img-static-q2',
        questionId: 'q2',
        imageUrl: '/uploads/q_q2_1789792359540_NCP-CN_7_5_V092026-2-op_png.png',
        caption: 'Screenshot: Troubleshooting NKP-Cluster-Admin AD Group Login Failures',
        fileName: 'NCP-CN 7.5 V092026-2-op.png',
        fileSize: 52839,
        uploadedAt: '2026-09-19T04:32:39.540Z'
      },
      {
        id: 'img-static-q46',
        questionId: 'q46',
        imageUrl: '/uploads/q_q46_1789792441427_NCP-CN_7_5_V092026-2-op_-_6_pn.png',
        caption: 'Screenshot: Enabling NKP Insights Across Workspaces',
        fileName: 'NCP-CN 7.5 V092026-2-op - 6.png',
        fileSize: 9205,
        uploadedAt: '2026-09-19T04:34:01.427Z'
      },
      {
        id: 'img-static-q53',
        questionId: 'q53',
        imageUrl: '/uploads/q_q53_1789792496546_NCP-CN_7_5_V092026-2-op_-_53_p.png',
        caption: 'Screenshot: Required Flag for Air-Gapped NKP Cluster Deployment',
        fileName: 'NCP-CN 7.5 V092026-2-op - 53.png',
        fileSize: 380694,
        uploadedAt: '2026-09-19T04:34:56.546Z'
      },
      {
        id: 'img-static-q60',
        questionId: 'q60',
        imageUrl: '/uploads/q_q60_1789792544116_NCP-CN_7_5_V092026-2-op_-_60_p.png',
        caption: 'Screenshot: Configuring Node Pool Maximum Size via Autoscaler Annotations',
        fileName: 'NCP-CN 7.5 V092026-2-op - 60.png',
        fileSize: 193427,
        uploadedAt: '2026-09-19T04:35:44.117Z'
      },
      {
        id: 'img-static-q65',
        questionId: 'q65',
        imageUrl: '/uploads/q_q65_1789796775867_NCP-CN_7_5_V092026-2-op_-_65_p.png',
        caption: 'Screenshot: Modifying Project Roles for Full Action Access',
        fileName: 'NCP-CN 7.5 V092026-2-op - 65.png',
        fileSize: 234632,
        uploadedAt: '2026-09-19T05:46:15.868Z'
      },
      {
        id: 'img-static-q92',
        questionId: 'q92',
        imageUrl: '/uploads/q_q92_1789796844895_NCP-CN_7_5_V092026-2-op_-_92_p.png',
        caption: 'Screenshot: Diagnosing CLI Command Failures',
        fileName: 'NCP-CN 7.5 V092026-2-op - 92.png',
        fileSize: 519684,
        uploadedAt: '2026-09-19T05:47:24.895Z'
      },
      {
        id: 'img-static-q94',
        questionId: 'q94',
        imageUrl: '/uploads/q_q94_1789796891023_NCP-CN_7_5_V092026-2-op_-_94_p.png',
        caption: 'Screenshot: Enabling NKP Insights via Kommander UI',
        fileName: 'NCP-CN 7.5 V092026-2-op - 94.png',
        fileSize: 51186,
        uploadedAt: '2026-09-19T05:48:11.023Z'
      },
      {
        id: 'img-static-q97',
        questionId: 'q97',
        imageUrl: '/uploads/q_q97_1789798710142_NCP-CN_7_5_V092026-2-op_-_97_p.png',
        caption: 'Screenshot: Preparing GPU-Compatible OS Images for Nutanix AHV',
        fileName: 'NCP-CN 7.5 V092026-2-op - 97.png',
        fileSize: 59340,
        uploadedAt: '2026-09-19T06:18:30.142Z'
      },
      {
        id: 'img-static-q102',
        questionId: 'q102',
        imageUrl: '/uploads/q_q102_1789798754079_NCP-CN_7_5_V092026-2-op_-_A102.png',
        caption: 'Screenshot: Automating Deployments from Source Code Repositories to Production and DR',
        fileName: 'NCP-CN 7.5 V092026-2-op - A102.png',
        fileSize: 59729,
        uploadedAt: '2026-09-19T06:19:14.079Z'
      },
      {
        id: 'img-static-q104-a',
        questionId: 'q104',
        imageUrl: '/uploads/q_q104_1789798817893_NCP-CN_7_5_V092026-2-op_-_A104.png',
        caption: 'Screenshot: Troubleshooting LimitRange Violations (A)',
        fileName: 'NCP-CN 7.5 V092026-2-op - A104.png',
        fileSize: 152613,
        uploadedAt: '2026-09-19T06:20:17.893Z'
      },
      {
        id: 'img-static-q104-b',
        questionId: 'q104',
        imageUrl: '/uploads/q_q104_1789798818633_NCP-CN_7_5_V092026-2-op_-_B104.png',
        caption: 'Screenshot: Troubleshooting LimitRange Violations (B)',
        fileName: 'NCP-CN 7.5 V092026-2-op - B104.png',
        fileSize: 51293,
        uploadedAt: '2026-09-19T06:20:18.633Z'
      }
    ];

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, QuestionImageAttachment>();
        for (const item of staticManifestImages) {
          map.set(item.id, item);
        }
        for (const item of parsed) {
          if (!map.has(item.id)) {
            map.set(item.id, item);
          }
        }
        this.images = Array.from(map.values());
      } else {
        this.images = staticManifestImages;
      }
    } catch (err) {
      this.images = staticManifestImages;
    }

    this.notify();
    this.fetchFromServer();
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.images));
    } catch (err) {
      console.warn('Failed to cache images to localStorage:', err);
    }
  }

  public async fetchFromServer(): Promise<QuestionImageAttachment[]> {
    try {
      const res = await fetch('/api/question-images');
      if (res.ok) {
        const data: QuestionImageAttachment[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const map = new Map<string, QuestionImageAttachment>();
          for (const img of this.images) {
            map.set(img.id, img);
          }
          for (const img of data) {
            map.set(img.id, img);
          }
          this.images = Array.from(map.values());
          this.saveToLocalStorage();
          this.notify();
        }
      }
    } catch (err) {
      console.info('Using local offline cache for question images:', err);
    }
    return this.images;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.images);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.images);
    }
  }

  public getAllImages(): QuestionImageAttachment[] {
    return this.images;
  }

  public getImagesForQuestion(questionId: string): QuestionImageAttachment[] {
    const raw = this.images.filter((img) => img.questionId === questionId);
    // Deduplicate by imageUrl and fileName to prevent any duplicate rendering
    const seen = new Set<string>();
    const unique: QuestionImageAttachment[] = [];
    for (const img of raw) {
      const key = `${img.imageUrl || ''}_${img.fileName || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(img);
      }
    }
    return unique;
  }

  public async uploadFromFile(
    questionId: string,
    file: File,
    caption = ''
  ): Promise<QuestionImageAttachment> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const dataUrl = reader.result as string;
          const result = await this.uploadFromDataUrl(questionId, dataUrl, file.name, caption);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read selected image file.'));
      reader.readAsDataURL(file);
    });
  }

  public async uploadFromDataUrl(
    questionId: string,
    dataUrl: string,
    fileName = 'screenshot.png',
    caption = ''
  ): Promise<QuestionImageAttachment> {
    try {
      const res = await fetch('/api/question-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, caption, fileName, dataUrl }),
      });

      if (res.ok) {
        const item: QuestionImageAttachment = await res.json();
        this.images = [item, ...this.images.filter((i) => i.id !== item.id)];
        this.saveToLocalStorage();
        this.notify();
        return item;
      }
    } catch (serverErr) {
      console.warn('Server upload fallback:', serverErr);
    }

    const fallbackItem: QuestionImageAttachment = {
      id: `img-local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      questionId,
      imageUrl: dataUrl,
      caption,
      fileName,
      fileSize: Math.round((dataUrl.length * 3) / 4),
      uploadedAt: new Date().toISOString(),
    };
    this.images = [fallbackItem, ...this.images];
    this.saveToLocalStorage();
    this.notify();
    return fallbackItem;
  }

  public async deleteImage(id: string): Promise<boolean> {
    try {
      await fetch(`/api/question-images/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Server delete failed:', e);
    }
    this.images = this.images.filter((i) => i.id !== id);
    this.saveToLocalStorage();
    this.notify();
    return true;
  }

  public async updateCaption(id: string, caption: string): Promise<boolean> {
    try {
      await fetch(`/api/question-images/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption }),
      });
    } catch (e) {
      console.warn('Server update failed:', e);
    }
    this.images = this.images.map((i) => (i.id === id ? { ...i, caption } : i));
    this.saveToLocalStorage();
    this.notify();
    return true;
  }

  public exportBackup(): string {
    return JSON.stringify(this.images, null, 2);
  }

  public importBackup(importedImages: QuestionImageAttachment[]) {
    if (!Array.isArray(importedImages)) return;
    const existingIds = new Set(this.images.map((i) => i.id));
    const toAdd = importedImages.filter((i) => !existingIds.has(i.id));
    this.images = [...toAdd, ...this.images];
    this.saveToLocalStorage();
    this.notify();
  }
}

export const imageService = new ImageService();
