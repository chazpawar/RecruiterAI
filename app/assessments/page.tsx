'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { DatabaseService } from '@/lib/database';
import { type Assessment, type Job } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Modal, { ModalBody, ModalFooter } from '@/components/ui/modal';
import { useSearch } from '@/hooks/use-search';
import Layout from '@/components/layout/Layout';

interface EnhancedAssessment extends Assessment {
  jobTitle: string;
  questionCount: number;
  responseCount: number;
  passRate: number;
  avgScore: number;
}

function AssessmentsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [allAssessments, setAllAssessments] = useState<EnhancedAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<EnhancedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingAssessment, setDeletingAssessment] = useState<EnhancedAssessment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Search functionality
  const { searchValue, debouncedValue, handleSearchChange } = useSearch(
    searchParams.get('search') || '',
    300
  );

  // Filters
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    jobId: searchParams.get('jobId') || 'all',
    status: searchParams.get('status') || 'all',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsData, assessmentsData] = await Promise.all([
        DatabaseService.getJobs({ status: 'active' }),
        DatabaseService.getAssessments ? DatabaseService.getAssessments() : [],
      ]);

      // Enhance assessments with job titles and mock statistics for display
      const enhancedAssessments: EnhancedAssessment[] = (assessmentsData || []).map(
        (assessment) => {
          const job = jobsData.find((j) => j.id === assessment.jobId);
          return {
            ...assessment,
            jobTitle: job?.title || 'Unknown Job',
            questionCount:
              assessment.sections?.reduce(
                (total, section) => total + (section.questions?.length || 0),
                0
              ) || Math.floor(Math.random() * 15) + 10,
            responseCount: Math.floor(Math.random() * 50),
            passRate: Math.floor(Math.random() * 40) + 60,
            avgScore: Math.floor(Math.random() * 30) + 70,
            status: assessment.status || 'active',
          };
        }
      );

      setJobs(jobsData || []);
      setAllAssessments(enhancedAssessments);
    } catch (error) {
      console.error('Error loading assessments data:', error);
      toast.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter assessments based on search and other filters
  useEffect(() => {
    let filtered = allAssessments;

    // Apply search filter
    if (debouncedValue.trim()) {
      filtered = filtered.filter(
        (assessment) =>
          assessment.title.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          assessment.jobTitle.toLowerCase().includes(debouncedValue.toLowerCase()) ||
          assessment.description.toLowerCase().includes(debouncedValue.toLowerCase())
      );
    }

    // Apply job filter
    if (filters.jobId && filters.jobId !== 'all') {
      filtered = filtered.filter(
        (assessment) => String(assessment.jobId) === filters.jobId
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((assessment) => assessment.status === filters.status);
    }

    setFilteredAssessments(filtered);
    setCurrentPage(1);
  }, [debouncedValue, filters.jobId, filters.status, allAssessments]);

  // Update filters when debounced search value changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedValue,
    }));
  }, [debouncedValue]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.jobId && filters.jobId !== 'all') params.set('jobId', filters.jobId);
    if (filters.status && filters.status !== 'all') params.set('status', filters.status);
    router.replace(`/assessments?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const handleDeleteAssessment = async () => {
    if (!deletingAssessment) return;
    try {
      await DatabaseService.deleteAssessment(deletingAssessment.id);
      toast.success('Assessment deleted successfully');
      setDeletingAssessment(null);
      loadData();
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('Failed to delete assessment');
    }
  };

  const handleCreateAssessment = async (assessmentData: {
    jobId: string;
    title: string;
    description: string;
  }) => {
    try {
      const job = jobs.find((j) => String(j.id) === assessmentData.jobId);
      const newAssessmentData = {
        ...assessmentData,
        jobTitle: job?.title || 'Unknown Job',
        sections: [],
        settings: {
          timeLimit: 60,
          allowMultipleAttempts: false,
          showResults: true,
        },
      };

      await DatabaseService.createAssessment(newAssessmentData);
      toast.success('Assessment created successfully');
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating assessment:', error);
      toast.error('Failed to create assessment');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredAssessments.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <TooltipProvider>
        <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span>Assessments</span>
              <span className="mx-2">/</span>
              <span>Overview</span>
            </div>
          </div>
        </div>

        {/* Separator Line - Full Width */}
        <hr className="border-t border-border mb-6 -mx-6" />

        {/* Title Section */}
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-left">
            Assessments
          </h1>
          <p className="text-muted-foreground text-left">
            Build and manage job-specific assessments and quizzes to evaluate candidates (
            {filteredAssessments.length} assessments)
          </p>
        </div>

        <div className="w-full space-y-6 flex-1">
          {/* Top Actions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-lg">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search assessments by title, job, or description..."
                    className="pl-10 h-10 text-sm w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FunnelIcon className="w-4 h-4" />
                  Filters
                </Button>
                <Button
                  onClick={() => setShowCreateModal(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Assessment
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Job:</span>
                  <Select
                    value={filters.jobId}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, jobId: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="All Jobs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jobs</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={String(job.id)} value={String(job.id)}>
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(filters.jobId !== 'all' || filters.status !== 'all' || filters.search) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({ search: '', jobId: 'all', status: 'all' });
                      handleSearchChange('');
                    }}
                    className="h-8 text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Content Area - Assessments List */}
          <div className="flex-1 min-h-0">
            <AssessmentsList
              assessments={paginatedAssessments}
              filteredAssessments={filteredAssessments}
              onDelete={setDeletingAssessment}
              onShowCreate={() => setShowCreateModal(true)}
              filters={filters}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {/* Create Assessment Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Assessment"
          size="xl"
        >
          <ModalBody>
            <AssessmentForm
              jobs={jobs}
              onSubmit={handleCreateAssessment}
              onCancel={() => setShowCreateModal(false)}
            />
          </ModalBody>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingAssessment}
          onClose={() => setDeletingAssessment(null)}
          title="Delete Assessment"
          size="sm"
        >
          <ModalBody>
            <p className="text-muted-foreground">
              Are you sure you want to delete &quot;{deletingAssessment?.title}&quot;? This
              action cannot be undone and will remove all associated data.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setDeletingAssessment(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAssessment}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </TooltipProvider>
    </Layout>
  );
}

function AssessmentsPageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<AssessmentsPageLoading />}>
      <AssessmentsPageContent />
    </Suspense>
  );
}

// Assessments List Component
interface AssessmentsListProps {
  assessments: EnhancedAssessment[];
  filteredAssessments: EnhancedAssessment[];
  onDelete: (assessment: EnhancedAssessment) => void;
  onShowCreate: () => void;
  filters: { search: string; jobId: string; status: string };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function AssessmentsList({
  assessments,
  filteredAssessments,
  onDelete,
  onShowCreate,
  filters,
  currentPage,
  totalPages,
  onPageChange,
}: AssessmentsListProps) {
  if (filteredAssessments.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-12">
          <div className="text-center">
            <ClipboardDocumentListIcon className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-6 text-xl font-semibold">No assessments found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              {filters.search ||
              (filters.jobId && filters.jobId !== 'all') ||
              (filters.status && filters.status !== 'all')
                ? 'Try adjusting your search criteria to find more results.'
                : 'Create your first assessment to evaluate candidates effectively.'}
            </p>
            {!filters.search && filters.jobId === 'all' && filters.status === 'all' && (
              <div className="mt-8">
                <Button onClick={onShowCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Assessment
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full">
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <AssessmentCard key={String(assessment.id)} assessment={assessment} onDelete={onDelete} />
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 py-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Assessment Card Component
function AssessmentCard({
  assessment,
  onDelete,
}: {
  assessment: EnhancedAssessment;
  onDelete: (assessment: EnhancedAssessment) => void;
}) {
  const initials = assessment.title
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
                  <span className="text-lg font-semibold text-primary-foreground">
                    {initials}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-left truncate">
                    {assessment.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      assessment.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {assessment.status === 'active' ? 'Active' : 'Draft'}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm space-x-1">
                  <span className="truncate">For: {assessment.jobTitle}</span>
                  <span className="flex-shrink-0">•</span>
                  <span className="flex-shrink-0">{assessment.questionCount} questions</span>
                  <span className="flex-shrink-0">•</span>
                  <span className="flex-shrink-0">{assessment.responseCount} responses</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4 leading-relaxed text-left text-sm">
              {assessment.description || 'Assessment details and evaluation criteria'}
            </p>

            <div className="flex flex-wrap gap-2 justify-start">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {assessment.passRate}% pass rate
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                {assessment.avgScore} avg score
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/assessments/${assessment.id}/take`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/assessments/${assessment.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit assessment</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(assessment)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete assessment</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Assessment Form Component
interface AssessmentFormProps {
  jobs: Job[];
  onSubmit: (data: { jobId: string; title: string; description: string }) => void;
  onCancel: () => void;
}

function AssessmentForm({ jobs, onSubmit, onCancel }: AssessmentFormProps) {
  const [formData, setFormData] = useState({
    jobId: '',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.jobId || !formData.title) {
      toast.error('Job and title are required');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const jobOptions = jobs.map((job) => ({
    value: String(job.id),
    label: job.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Job Position</label>
          <Select
            value={formData.jobId}
            onValueChange={(value) => {
              const job = jobs.find((j) => String(j.id) === value);
              setFormData({
                ...formData,
                jobId: value,
                title: job ? `${job.title} Assessment` : '',
                description: job
                  ? `Technical assessment for ${job.title} position covering essential skills and competencies.`
                  : '',
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a job position" />
            </SelectTrigger>
            <SelectContent>
              {jobOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Assessment Title</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter assessment title"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Describe what this assessment will evaluate..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Assessment'}
        </Button>
      </div>
    </form>
  );
}
