import { Question } from '../types';
import { NKP_QUESTIONS } from '../data/nkpQuestions';
import { imageService } from './imageService';

type QuestionsListener = (questions: Question[]) => void;

class QuestionStore {
  private baseQuestions: Question[] = [...NKP_QUESTIONS];
  private customQuestions: Question[] = [];
  private deletedQuestionIds: Set<string> = new Set();
  private questionOrder: string[] = []; // Custom sorted IDs
  private listeners: Set<QuestionsListener> = new Set();
  private readonly STORAGE_KEY = 'nkp_custom_questions_cache';
  private readonly DELETED_KEY = 'nkp_deleted_question_ids_v1';
  private readonly ORDER_KEY = 'nkp_question_order_v1';
  public isLoaded = false;

  constructor() {
    this.loadFromLocalStorage();
    this.fetchFromServer();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.customQuestions = JSON.parse(stored);
      }
      const deletedStored = localStorage.getItem(this.DELETED_KEY);
      if (deletedStored) {
        const arr = JSON.parse(deletedStored);
        if (Array.isArray(arr)) {
          this.deletedQuestionIds = new Set(arr);
        }
      }
      const orderStored = localStorage.getItem(this.ORDER_KEY);
      if (orderStored) {
        const orderArr = JSON.parse(orderStored);
        if (Array.isArray(orderArr)) {
          this.questionOrder = orderArr;
        }
      }
      this.notify();
    } catch (err) {
      console.warn('Failed to load questions from localStorage:', err);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.customQuestions));
      localStorage.setItem(this.DELETED_KEY, JSON.stringify(Array.from(this.deletedQuestionIds)));
      localStorage.setItem(this.ORDER_KEY, JSON.stringify(this.questionOrder));
    } catch (err) {
      console.warn('Failed to cache questions to localStorage:', err);
    }
  }

  /**
   * Returns active, non-deleted questions, sorted by the custom series sequence (if configured)
   */
  public getAllQuestions(): Question[] {
    // Merge base questions and custom questions. Custom questions override base questions by ID if edited
    const questionMap = new Map<string, Question>();
    this.baseQuestions.forEach((q) => questionMap.set(q.id, q));
    this.customQuestions.forEach((q) => questionMap.set(q.id, q));

    // Filter out deleted
    const activeQuestions = Array.from(questionMap.values()).filter(
      (q) => !this.deletedQuestionIds.has(q.id)
    );

    // If a custom question order is defined, apply it
    if (this.questionOrder && this.questionOrder.length > 0) {
      const orderMap = new Map<string, number>();
      this.questionOrder.forEach((id, index) => {
        orderMap.set(id, index);
      });

      return [...activeQuestions].sort((a, b) => {
        const orderA = orderMap.has(a.id) ? (orderMap.get(a.id) as number) : 999999;
        const orderB = orderMap.has(b.id) ? (orderMap.get(b.id) as number) : 999999;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return 0;
      });
    }

    return activeQuestions;
  }

  public getRawAllQuestionsCount(): number {
    return this.baseQuestions.length + this.customQuestions.length;
  }

  public getDeletedCount(): number {
    return this.deletedQuestionIds.size;
  }

  public getCustomQuestions(): Question[] {
    return this.customQuestions.filter((q) => !this.deletedQuestionIds.has(q.id));
  }

  public isDeleted(questionId: string): boolean {
    return this.deletedQuestionIds.has(questionId);
  }

  public getQuestionById(id: string): Question | undefined {
    return this.getAllQuestions().find((q) => q.id === id);
  }

  public async fetchFromServer(): Promise<Question[]> {
    try {
      // 1. Fetch custom questions
      const res = await fetch('/api/custom-questions');
      if (res.ok) {
        const data: Question[] = await res.json();
        this.customQuestions = data;
      }

      // 2. Fetch deleted question IDs
      const delRes = await fetch('/api/deleted-questions');
      if (delRes.ok) {
        const delData: string[] = await delRes.json();
        if (Array.isArray(delData)) {
          delData.forEach((id) => this.deletedQuestionIds.add(id));
        }
      }

      // 3. Fetch question order sequence
      const orderRes = await fetch('/api/question-order');
      if (orderRes.ok) {
        const orderData: string[] = await orderRes.json();
        if (Array.isArray(orderData) && orderData.length > 0) {
          this.questionOrder = orderData;
        }
      }

      this.saveToLocalStorage();
      this.notify();
      return this.getAllQuestions();
    } catch (err) {
      console.info('Using local custom questions fallback:', err);
    }
    this.isLoaded = true;
    return this.getAllQuestions();
  }

  public subscribe(listener: QuestionsListener): () => void {
    this.listeners.add(listener);
    listener(this.getAllQuestions());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const all = this.getAllQuestions();
    this.listeners.forEach((listener) => {
      try {
        listener(all);
      } catch (e) {
        console.error('Error notifying question listener:', e);
      }
    });
  }

  public async addQuestion(newQuestion: Question): Promise<Question> {
    if (this.deletedQuestionIds.has(newQuestion.id)) {
      this.deletedQuestionIds.delete(newQuestion.id);
    }

    try {
      const res = await fetch('/api/custom-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuestion),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to save question to server.');
      }

      const saved: Question = await res.json();
      const existingIdx = this.customQuestions.findIndex((q) => q.id === saved.id);
      if (existingIdx >= 0) {
        this.customQuestions[existingIdx] = saved;
      } else {
        this.customQuestions.push(saved);
      }

      // Append to question order if not present
      if (!this.questionOrder.includes(saved.id)) {
        this.questionOrder.push(saved.id);
      }

      this.saveToLocalStorage();
      this.notify();
      return saved;
    } catch (err: any) {
      console.warn('Server save failed, falling back to local storage only:', err);
      const existingIdx = this.customQuestions.findIndex((q) => q.id === newQuestion.id);
      if (existingIdx >= 0) {
        this.customQuestions[existingIdx] = newQuestion;
      } else {
        this.customQuestions.push(newQuestion);
      }
      if (!this.questionOrder.includes(newQuestion.id)) {
        this.questionOrder.push(newQuestion.id);
      }
      this.saveToLocalStorage();
      this.notify();
      return newQuestion;
    }
  }

  public async updateQuestion(updatedQuestion: Question): Promise<Question> {
    try {
      const res = await fetch(`/api/questions/${encodeURIComponent(updatedQuestion.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedQuestion),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update question on server.');
      }

      const saved: Question = await res.json();
      const existingIdx = this.customQuestions.findIndex((q) => q.id === saved.id);
      if (existingIdx >= 0) {
        this.customQuestions[existingIdx] = saved;
      } else {
        this.customQuestions.push(saved);
      }

      this.saveToLocalStorage();
      this.notify();
      return saved;
    } catch (err: any) {
      console.warn('Server update failed, updating in local cache:', err);
      const existingIdx = this.customQuestions.findIndex((q) => q.id === updatedQuestion.id);
      if (existingIdx >= 0) {
        this.customQuestions[existingIdx] = updatedQuestion;
      } else {
        this.customQuestions.push(updatedQuestion);
      }
      this.saveToLocalStorage();
      this.notify();
      return updatedQuestion;
    }
  }

  /**
   * Reorder questions sequence.
   * New order is an array of question IDs in the desired order.
   * Question numbers automatically update in series (e.g. 1st item becomes #1, 2nd becomes #2).
   */
  public async setQuestionOrder(newOrder: string[]): Promise<boolean> {
    this.questionOrder = [...newOrder];
    this.saveToLocalStorage();
    this.notify();

    try {
      await fetch('/api/question-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });
    } catch (err) {
      console.warn('Failed to persist question order to server:', err);
    }

    return true;
  }

  /**
   * Move a question from one index to another in the series
   */
  public async moveQuestion(fromIndex: number, toIndex: number): Promise<boolean> {
    const currentList = this.getAllQuestions();
    if (fromIndex < 0 || fromIndex >= currentList.length || toIndex < 0 || toIndex >= currentList.length) {
      return false;
    }

    const currentOrder = currentList.map((q) => q.id);
    const [movedId] = currentOrder.splice(fromIndex, 1);
    currentOrder.splice(toIndex, 0, movedId);

    return this.setQuestionOrder(currentOrder);
  }

  /**
   * Move a question directly to the very top (Position #1)
   */
  public async moveQuestionToTop(questionId: string): Promise<boolean> {
    const currentList = this.getAllQuestions();
    const currentIndex = currentList.findIndex((q) => q.id === questionId);
    if (currentIndex <= 0) return false;
    return this.moveQuestion(currentIndex, 0);
  }

  /**
   * Move a question directly to a specific series number (1-based index)
   */
  public async moveQuestionToPosition(questionId: string, targetPositionOneBased: number): Promise<boolean> {
    const currentList = this.getAllQuestions();
    const currentIndex = currentList.findIndex((q) => q.id === questionId);
    if (currentIndex === -1) return false;
    const targetZeroIndex = Math.max(0, Math.min(targetPositionOneBased - 1, currentList.length - 1));
    return this.moveQuestion(currentIndex, targetZeroIndex);
  }

  /**
   * Reset question order back to original default sequence
   */
  public async resetQuestionOrder(): Promise<boolean> {
    this.questionOrder = [];
    this.saveToLocalStorage();
    this.notify();

    try {
      await fetch('/api/question-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: [] }),
      });
    } catch (err) {
      console.warn('Failed to reset question order on server:', err);
    }

    return true;
  }

  public async deleteQuestion(questionId: string): Promise<boolean> {
    this.deletedQuestionIds.add(questionId);
    this.customQuestions = this.customQuestions.filter((q) => q.id !== questionId);
    this.questionOrder = this.questionOrder.filter((id) => id !== questionId);
    this.saveToLocalStorage();
    this.notify();

    try {
      const images = imageService.getImagesForQuestion(questionId);
      for (const img of images) {
        imageService.deleteImage(img.id).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to clean up question images:', e);
    }

    try {
      await fetch(`/api/questions/${encodeURIComponent(questionId)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Server delete call failed, cached locally:', e);
    }

    return true;
  }

  public async restoreQuestion(questionId: string): Promise<boolean> {
    if (!this.deletedQuestionIds.has(questionId)) return true;

    this.deletedQuestionIds.delete(questionId);
    this.saveToLocalStorage();
    this.notify();

    try {
      await fetch(`/api/questions/${encodeURIComponent(questionId)}/restore`, {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Server restore call failed:', e);
    }

    return true;
  }

  public async restoreAllQuestions(): Promise<boolean> {
    this.deletedQuestionIds.clear();
    this.saveToLocalStorage();
    this.notify();

    try {
      await fetch('/api/questions/restore-all', {
        method: 'POST',
      });
    } catch (e) {
      console.warn('Server restore all failed:', e);
    }

    return true;
  }
}

export const questionStore = new QuestionStore();
