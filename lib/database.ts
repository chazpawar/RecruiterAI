'use client';

import Dexie, { type Table } from 'dexie';
import {
  createJob,
  createCandidate,
  createAssessment,
  createTimelineEvent,
  createNote,
  createAssessmentResponse,
  type Job,
  type Candidate,
  type Assessment,
  type TimelineEvent,
  type Note,
  type AssessmentResponse,
} from './types';
import { generateSeedData } from '@/data/seed-data';

interface Settings {
  id?: number;
  key: string;
  value: unknown;
}

class RecruiterAIDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  assessments!: Table<Assessment>;
  timelineEvents!: Table<TimelineEvent>;
  notes!: Table<Note>;
  assessmentResponses!: Table<AssessmentResponse>;
  settings!: Table<Settings>;

  constructor() {
    super('RecruiterAIDB');
    
    this.version(1).stores({
      jobs: '++id, title, slug, status, order, createdAt, updatedAt',
      candidates: '++id, name, email, stage, jobId, createdAt, updatedAt',
      assessments: '++id, jobId, title, createdAt, updatedAt',
      timelineEvents: '++id, candidateId, type, createdAt',
      notes: '++id, candidateId, createdAt, updatedAt',
      assessmentResponses: '++id, candidateId, assessmentId, createdAt',
      settings: '++id, key',
    });
    
    // Hooks for automatic timestamps
    this.jobs.hook('creating', (_primKey, obj) => {
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });
    
    this.jobs.hook('updating', (modifications) => {
      return { ...modifications, updatedAt: new Date().toISOString() };
    });
    
    this.candidates.hook('creating', (_primKey, obj) => {
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });
    
    this.candidates.hook('updating', (modifications) => {
      return { ...modifications, updatedAt: new Date().toISOString() };
    });
    
    this.assessments.hook('creating', (_primKey, obj) => {
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });
    
    this.assessments.hook('updating', (modifications) => {
      return { ...modifications, updatedAt: new Date().toISOString() };
    });
    
    this.notes.hook('creating', (_primKey, obj) => {
      obj.createdAt = new Date().toISOString();
      obj.updatedAt = new Date().toISOString();
    });
    
    this.notes.hook('updating', (modifications) => {
      return { ...modifications, updatedAt: new Date().toISOString() };
    });
  }
}

// Create database instance
export const db = new RecruiterAIDB();

// Filter types
interface JobFilters {
  status?: string;
  search?: string;
}

interface CandidateFilters {
  stage?: string;
  jobId?: string | number;
  search?: string;
}

interface AssessmentFilters {
  jobId?: string | number;
  status?: string;
}

// Database service methods
export class DatabaseService {
  // Jobs
  static async getJobs(filters: JobFilters = {}): Promise<Job[]> {
    try {
      let query = db.jobs.orderBy('order');
      
      if (filters.status && filters.status !== 'all') {
        query = query.filter(job => job.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.filter(job => 
          job.title.toLowerCase().includes(searchTerm) ||
          job.description?.toLowerCase().includes(searchTerm) ||
          job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      return await query.toArray();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }
  
  static async getJobById(id: string | number): Promise<Job | undefined> {
    try {
      return await db.jobs.get(id);
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  }
  
  static async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const job = createJob(jobData);
      console.log('Creating job with data:', job);
      
      let id: string | number;
      if (job.id) {
        id = await db.jobs.put(job);
        console.log('Job created with preserved ID:', id);
      } else {
        id = await db.jobs.add(job);
        console.log('Job created with generated ID:', id);
      }
      
      return { ...job, id };
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }
  
  static async updateJob(id: string | number, updates: Partial<Job>): Promise<Job | undefined> {
    try {
      await db.jobs.update(id, updates);
      return await db.jobs.get(id);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }
  
  static async deleteJob(id: string | number): Promise<void> {
    try {
      await db.jobs.delete(id);
      await db.candidates.where('jobId').equals(id).delete();
      await db.assessments.where('jobId').equals(id).delete();
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
  
  static async reorderJobs(fromOrder: number, toOrder: number): Promise<Job[]> {
    try {
      return await db.transaction('rw', db.jobs, async () => {
        const jobs = await db.jobs.orderBy('order').toArray();
        
        const fromJob = jobs.find(job => job.order === fromOrder);
        const toJob = jobs.find(job => job.order === toOrder);
        
        if (fromJob && toJob) {
          await db.jobs.update(fromJob.id, { order: toOrder });
          await db.jobs.update(toJob.id, { order: fromOrder });
        }
        
        return await db.jobs.orderBy('order').toArray();
      });
    } catch (error) {
      console.error('Error reordering jobs:', error);
      throw error;
    }
  }
  
  // Candidates
  static async getCandidates(filters: CandidateFilters = {}): Promise<Candidate[]> {
    try {
      let query = db.candidates.orderBy('createdAt');
      
      if (filters.stage && filters.stage !== 'all') {
        query = query.filter(candidate => candidate.stage === filters.stage);
      }
      
      if (filters.jobId && filters.jobId !== 'all') {
        query = query.filter(candidate => candidate.jobId === filters.jobId);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        query = query.filter(candidate => 
          candidate.name.toLowerCase().includes(searchTerm) ||
          candidate.email.toLowerCase().includes(searchTerm)
        );
      }
      
      return await query.reverse().toArray();
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  }
  
  static async getCandidateById(id: string | number): Promise<Candidate | undefined> {
    try {
      console.log('DatabaseService.getCandidateById called with ID:', id);
      const candidate = await db.candidates.get(id);
      console.log('DatabaseService.getCandidateById result:', candidate);
      return candidate;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  }
  
  static async createCandidate(candidateData: Partial<Candidate>): Promise<Candidate> {
    try {
      const candidate = createCandidate(candidateData);
      console.log('Creating candidate with data:', candidate);
      
      let id: string | number;
      if (candidate.id) {
        id = await db.candidates.put(candidate);
        console.log('Candidate created with preserved ID:', id);
      } else {
        id = await db.candidates.add(candidate);
        console.log('Candidate created with generated ID:', id);
      }
      
      await this.createTimelineEvent({
        candidateId: id,
        type: 'stage_change',
        title: 'Application Submitted',
        description: 'Candidate applied for the position',
        metadata: { stage: candidate.stage },
      });
      
      return { ...candidate, id };
    } catch (error) {
      console.error('Error creating candidate:', error);
      throw error;
    }
  }
  
  static async updateCandidate(id: string | number, updates: Partial<Candidate>): Promise<Candidate | undefined> {
    try {
      const oldCandidate = await db.candidates.get(id);
      await db.candidates.update(id, updates);
      
      if (updates.stage && updates.stage !== oldCandidate?.stage) {
        await this.createTimelineEvent({
          candidateId: id,
          type: 'stage_change',
          title: `Stage Changed to ${updates.stage}`,
          description: `Candidate moved from ${oldCandidate?.stage} to ${updates.stage}`,
          metadata: { 
            fromStage: oldCandidate?.stage, 
            toStage: updates.stage 
          },
        });
      }
      
      return await db.candidates.get(id);
    } catch (error) {
      console.error('Error updating candidate:', error);
      throw error;
    }
  }
  
  static async deleteCandidate(id: string | number): Promise<void> {
    try {
      await db.candidates.delete(id);
      await db.timelineEvents.where('candidateId').equals(id).delete();
      await db.notes.where('candidateId').equals(id).delete();
      await db.assessmentResponses.where('candidateId').equals(id).delete();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      throw error;
    }
  }
  
  // Timeline Events
  static async getCandidateTimeline(candidateId: string | number): Promise<TimelineEvent[]> {
    try {
      const events = await db.timelineEvents
        .where('candidateId')
        .equals(candidateId)
        .toArray();
      
      return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching timeline:', error);
      throw error;
    }
  }
  
  static async createTimelineEvent(eventData: Partial<TimelineEvent>): Promise<TimelineEvent> {
    try {
      const event = createTimelineEvent(eventData);
      const id = await db.timelineEvents.add(event);
      return { ...event, id: String(id) };
    } catch (error) {
      console.error('Error creating timeline event:', error);
      throw error;
    }
  }
  
  // Notes
  static async getCandidateNotes(candidateId: string | number): Promise<Note[]> {
    try {
      const notes = await db.notes
        .where('candidateId')
        .equals(candidateId)
        .toArray();
      
      return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  }
  
  static async createNote(noteData: Partial<Note>): Promise<Note> {
    try {
      const note = createNote(noteData);
      const id = await db.notes.add(note);
      
      await this.createTimelineEvent({
        candidateId: noteData.candidateId,
        type: 'note_added',
        title: 'Note Added',
        description: 'A new note was added to the candidate',
        metadata: { noteId: id },
      });
      
      return { ...note, id: String(id) };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  }
  
  static async updateNote(id: string | number, updates: Partial<Note>): Promise<Note | undefined> {
    try {
      await db.notes.update(id, updates);
      return await db.notes.get(id);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }
  
  static async deleteNote(id: string | number): Promise<void> {
    try {
      await db.notes.delete(id);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }
  
  // Assessments
  static async getAssessments(filters: AssessmentFilters = {}): Promise<Assessment[]> {
    try {
      let query = db.assessments.orderBy('createdAt');
      
      if (filters.jobId && filters.jobId !== 'all') {
        query = query.filter(assessment => assessment.jobId === filters.jobId);
      }
      
      if (filters.status && filters.status !== 'all') {
        query = query.filter(assessment => assessment.status === filters.status);
      }
      
      return await query.reverse().toArray();
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }
  }
  
  static async getAssessmentByJobId(jobId: string | number): Promise<Assessment | undefined> {
    try {
      return await db.assessments.where('jobId').equals(jobId).first();
    } catch (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }
  }
  
  static async getAssessmentById(id: string | number): Promise<Assessment | undefined> {
    try {
      return await db.assessments.get(id);
    } catch (error) {
      console.error('Error fetching assessment by ID:', error);
      throw error;
    }
  }
  
  static async createAssessment(assessmentData: Partial<Assessment>): Promise<Assessment> {
    try {
      const assessment = createAssessment(assessmentData);
      console.log('Creating assessment with data:', assessment);
      
      let id: string | number;
      if (assessment.id) {
        id = await db.assessments.put(assessment);
        console.log('Assessment created with preserved ID:', id);
      } else {
        id = await db.assessments.add(assessment);
        console.log('Assessment created with generated ID:', id);
      }
      
      return { ...assessment, id };
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }
  
  static async updateAssessment(id: string | number, updates: Partial<Assessment>): Promise<Assessment | undefined> {
    try {
      await db.assessments.update(id, updates);
      return await db.assessments.get(id);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }
  
  static async deleteAssessment(id: string | number): Promise<void> {
    try {
      await db.assessments.delete(id);
      await db.assessmentResponses.where('assessmentId').equals(id).delete();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }
  
  // Assessment Responses
  static async getAssessmentResponse(candidateId: string | number, assessmentId: string | number): Promise<AssessmentResponse | undefined> {
    try {
      return await db.assessmentResponses
        .where('candidateId')
        .equals(candidateId)
        .filter(r => r.assessmentId === assessmentId)
        .first();
    } catch (error) {
      console.error('Error fetching assessment response:', error);
      throw error;
    }
  }
  
  static async createAssessmentResponse(responseData: Partial<AssessmentResponse>): Promise<AssessmentResponse> {
    try {
      const response = createAssessmentResponse(responseData);
      const id = await db.assessmentResponses.add(response);
      
      await this.createTimelineEvent({
        candidateId: responseData.candidateId,
        type: 'assessment_completed',
        title: 'Assessment Completed',
        description: 'Candidate completed the assessment',
        metadata: { assessmentId: responseData.assessmentId, responseId: id },
      });
      
      return { ...response, id: String(id) };
    } catch (error) {
      console.error('Error creating assessment response:', error);
      throw error;
    }
  }
  
  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await db.transaction('rw', [db.jobs, db.candidates, db.assessments, 
        db.timelineEvents, db.notes, db.assessmentResponses], async () => {
        await db.jobs.clear();
        await db.candidates.clear();
        await db.assessments.clear();
        await db.timelineEvents.clear();
        await db.notes.clear();
        await db.assessmentResponses.clear();
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
  
  static async getStats(): Promise<{ jobs: number; candidates: number; assessments: number }> {
    try {
      const [jobCount, candidateCount, assessmentCount] = await Promise.all([
        db.jobs.count(),
        db.candidates.count(),
        db.assessments.count(),
      ]);
      
      return {
        jobs: jobCount,
        candidates: candidateCount,
        assessments: assessmentCount,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
  
  static async debugCandidateById(id: string | number): Promise<Candidate | undefined> {
    try {
      console.log('Debug: Looking for candidate with ID:', id);
      
      const candidate = await db.candidates.get(id);
      console.log('Debug: Candidate found:', candidate);
      
      if (!candidate) {
        const allCandidates = await db.candidates.toArray();
        console.log('Debug: All candidate IDs:', allCandidates.map(c => c.id));
        console.log('Debug: Total candidates:', allCandidates.length);
      }
      
      return candidate;
    } catch (error) {
      console.error('Debug: Error checking candidate:', error);
      throw error;
    }
  }
  
  static async debugJobById(id: string | number): Promise<Job | undefined> {
    try {
      console.log('Debug: Looking for job with ID:', id);
      
      const job = await db.jobs.get(id);
      console.log('Debug: Job found:', job);
      
      if (!job) {
        const allJobs = await db.jobs.toArray();
        console.log('Debug: All job IDs:', allJobs.map(j => j.id));
        console.log('Debug: Total jobs:', allJobs.length);
      }
      
      return job;
    } catch (error) {
      console.error('Debug: Error checking job:', error);
      throw error;
    }
  }
  
  // Seed database with initial data
  static async seedDatabase(): Promise<boolean> {
    try {
      // Check if data already exists
      const stats = await this.getStats();
      if (stats.jobs > 0) {
        console.log('Database already seeded, skipping...');
        return false;
      }
      
      console.log('Seeding database with initial data...');
      const { jobs, candidates, assessments } = generateSeedData();
      
      // Insert jobs
      await db.jobs.bulkPut(jobs);
      console.log(`Seeded ${jobs.length} jobs`);
      
      // Insert candidates
      await db.candidates.bulkPut(candidates);
      console.log(`Seeded ${candidates.length} candidates`);
      
      // Insert assessments
      await db.assessments.bulkPut(assessments);
      console.log(`Seeded ${assessments.length} assessments`);
      
      console.log('Database seeding complete!');
      return true;
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
  
  // Check if database needs seeding
  static async needsSeeding(): Promise<boolean> {
    try {
      const stats = await this.getStats();
      return stats.jobs === 0;
    } catch (error) {
      console.error('Error checking if database needs seeding:', error);
      return true;
    }
  }
}

export default DatabaseService;
