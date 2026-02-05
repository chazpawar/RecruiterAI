'use client';

import React, { useState, useEffect, useMemo, useCallback, memo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { DatabaseService } from '@/lib/database';
import {
  CANDIDATE_STAGES,
  STAGE_LABELS,
  STAGE_COLORS,
  type Candidate,
  type CandidateStage,
  type Job,
} from '@/lib/types';
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

function CandidatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [deletingCandidate, setDeletingCandidate] = useState<Candidate | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Search functionality - optimized
  const { searchValue, debouncedValue, handleSearchChange } = useSearch(
    searchParams.get('search') || '',
    150
  );

  // Filters - optimized with useMemo
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get('search') || '',
    stage: searchParams.get('stage') || 'all',
    jobId: searchParams.get('jobId') || 'all',
  }));

  // Optimized candidates loading
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const [candidatesData, jobsData] = await Promise.all([
        DatabaseService.getCandidates({}),
        DatabaseService.getJobs(),
      ]);
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized client-side filtering
  const filteredCandidates = useMemo(() => {
    let filtered = [...candidates];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm) ||
          candidate.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.stage && filters.stage !== 'all') {
      filtered = filtered.filter((candidate) => candidate.stage === filters.stage);
    }

    if (filters.jobId && filters.jobId !== 'all') {
      filtered = filtered.filter((candidate) => candidate.jobId === filters.jobId);
    }

    return filtered;
  }, [candidates, filters]);

  // Update filters when debounced search value changes
  useEffect(() => {
    if (debouncedValue !== filters.search) {
      setFilters((prev) => ({
        ...prev,
        search: debouncedValue,
      }));
    }
  }, [debouncedValue, filters.search]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Optimized URL updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.stage && filters.stage !== 'all') params.set('stage', filters.stage);
      if (filters.jobId && filters.jobId !== 'all') params.set('jobId', filters.jobId);
      router.replace(`/candidates?${params.toString()}`, { scroll: false });
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [filters, router]);

  const handleCreateCandidate = async (candidateData: Partial<Candidate>) => {
    try {
      await DatabaseService.createCandidate(candidateData as Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Candidate created successfully');
      setShowCreateModal(false);
      loadCandidates();
    } catch (error) {
      console.error('Error creating candidate:', error);
      toast.error('Failed to create candidate');
    }
  };

  const handleUpdateCandidate = async (candidateData: Partial<Candidate>) => {
    if (!editingCandidate) return;
    try {
      await DatabaseService.updateCandidate(editingCandidate.id, candidateData);
      toast.success('Candidate updated successfully');
      setEditingCandidate(null);
      loadCandidates();
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast.error('Failed to update candidate');
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deletingCandidate) return;
    try {
      await DatabaseService.deleteCandidate(deletingCandidate.id);
      toast.success('Candidate deleted successfully');
      setDeletingCandidate(null);
      loadCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('Failed to delete candidate');
    }
  };

  const handleStageChange = async (candidateId: string | number, newStage: CandidateStage) => {
    try {
      await DatabaseService.updateCandidate(candidateId, { stage: newStage });
      toast.success('Candidate stage updated');
      loadCandidates();
    } catch (error) {
      console.error('Error updating candidate stage:', error);
      toast.error('Failed to update candidate stage');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span>Candidates</span>
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
            Candidates
          </h1>
          <p className="text-muted-foreground text-left">
            Manage candidates and track their progress through the hiring pipeline (
            {filteredCandidates.length} candidates)
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
                    placeholder="Search candidates..."
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
                  Add Candidate
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg border">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Stage:</span>
                  <Select
                    value={filters.stage}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, stage: value }))
                    }
                  >
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="All Stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      {Object.values(CANDIDATE_STAGES).map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {STAGE_LABELS[stage]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                {(filters.stage !== 'all' ||
                  filters.jobId !== 'all' ||
                  filters.search) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilters({ search: '', stage: 'all', jobId: 'all' });
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

          {/* Content Area - Only List View */}
          <div className="flex-1 min-h-0">
            <CandidatesList
              key={`${filters.search}-${filters.stage}-${filters.jobId}`}
              candidates={filteredCandidates}
              jobs={jobs}
              onEdit={setEditingCandidate}
              onDelete={setDeletingCandidate}
              onStageChange={handleStageChange}
              onShowCreate={() => setShowCreateModal(true)}
              hasActiveFilters={!!(filters.search || (filters.stage && filters.stage !== 'all') || (filters.jobId && filters.jobId !== 'all'))}
            />
          </div>
        </div>

        {/* Create Candidate Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Candidate"
          size="xl"
        >
          <ModalBody>
            <CandidateForm
              jobs={jobs}
              onSubmit={handleCreateCandidate}
              onCancel={() => setShowCreateModal(false)}
            />
          </ModalBody>
        </Modal>

        {/* Edit Candidate Modal */}
        <Modal
          isOpen={!!editingCandidate}
          onClose={() => setEditingCandidate(null)}
          title="Edit Candidate"
          size="xl"
        >
          <ModalBody>
            <CandidateForm
              jobs={jobs}
              initialData={editingCandidate}
              onSubmit={handleUpdateCandidate}
              onCancel={() => setEditingCandidate(null)}
            />
          </ModalBody>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingCandidate}
          onClose={() => setDeletingCandidate(null)}
          title="Delete Candidate"
          size="sm"
        >
          <ModalBody>
            <p className="text-muted-foreground">
              Are you sure you want to delete &quot;{deletingCandidate?.name}&quot;? This
              action cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setDeletingCandidate(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCandidate}>
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </TooltipProvider>
  );
}

function CandidatesPageLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesPageLoading />}>
      <CandidatesPageContent />
    </Suspense>
  );
}

// Optimized Candidates List Component - memoized to prevent re-renders
interface CandidatesListProps {
  candidates: Candidate[];
  jobs: Job[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onStageChange: (candidateId: string | number, newStage: CandidateStage) => void;
  onShowCreate: () => void;
  hasActiveFilters: boolean;
}

const CandidatesList = memo(function CandidatesList({
  candidates,
  jobs,
  onEdit,
  onDelete,
  onStageChange,
  onShowCreate,
  hasActiveFilters,
}: CandidatesListProps) {
  const BATCH_SIZE = 20;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + BATCH_SIZE);
  }, []);

  if (candidates.length === 0) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-12">
          <div className="text-center">
            <UserIcon className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-6 text-xl font-semibold">No candidates found</h3>
            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
              {hasActiveFilters
                ? 'Try adjusting your search criteria to find more results.'
                : 'Get started by adding your first candidate to track their progress through the hiring pipeline.'}
            </p>
            {!hasActiveFilters && (
              <div className="mt-8">
                <Button onClick={onShowCreate}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Your First Candidate
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const visibleCandidates = candidates.slice(0, visibleCount);
  const hasMore = candidates.length > visibleCount;

  return (
    <div className="h-full">
      <div className="space-y-4">
        {visibleCandidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            jobs={jobs}
            onEdit={onEdit}
            onDelete={onDelete}
            onStageChange={onStageChange}
          />
        ))}

        {hasMore && (
          <div className="text-center py-6">
            <Button variant="outline" onClick={loadMore} className="px-8 py-3">
              Load More ({candidates.length - visibleCount} remaining)
            </Button>
          </div>
        )}

        {!hasMore && candidates.length > BATCH_SIZE && (
          <div className="text-center py-4 text-muted-foreground">
            Showing all {candidates.length} candidates
          </div>
        )}
      </div>
    </div>
  );
});

// Memoized CandidateCard to prevent unnecessary re-renders
interface CandidateCardProps {
  candidate: Candidate;
  jobs: Job[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  onStageChange: (candidateId: string | number, newStage: CandidateStage) => void;
}

const CandidateCard = memo(function CandidateCard({
  candidate,
  jobs,
  onEdit,
  onDelete,
  onStageChange,
}: CandidateCardProps) {
  const candidateJob = useMemo(
    () => jobs.find((job) => job.id === candidate.jobId),
    [jobs, candidate.jobId]
  );

  const initials = candidate.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

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
                    {candidate.name}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      STAGE_COLORS[candidate.stage] || 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {STAGE_LABELS[candidate.stage] || candidate.stage}
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground text-sm space-x-1">
                  <span className="truncate">{candidate.email}</span>
                  {candidateJob && (
                    <>
                      <span className="flex-shrink-0">•</span>
                      <span className="truncate">{candidateJob.title}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-start">
              {candidateJob?.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {tag}
                </span>
              ))}
              {(candidateJob?.tags?.length ?? 0) > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                  +{(candidateJob?.tags?.length ?? 0) - 3} more
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <Select
              value={candidate.stage}
              onValueChange={(value) => onStageChange(candidate.id, value as CandidateStage)}
            >
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(CANDIDATE_STAGES).map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {STAGE_LABELS[stage]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/candidates/${candidate.id}`}>
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
                <p>View details</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(candidate)}
                  className="h-8 w-8 p-0"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit candidate</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(candidate)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete candidate</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Enhanced Candidate Form Component
interface CandidateFormProps {
  initialData?: Candidate | null;
  onSubmit: (data: Partial<Candidate>) => void;
  onCancel: () => void;
  jobs?: Job[];
}

function CandidateForm({
  initialData,
  onSubmit,
  onCancel,
  jobs = [],
}: CandidateFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    stage: initialData?.stage || CANDIDATE_STAGES.APPLIED,
    jobId: initialData?.jobId ? String(initialData.jobId) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const stageOptions = Object.values(CANDIDATE_STAGES).map((stage) => ({
    value: stage,
    label: STAGE_LABELS[stage],
  }));

  const jobOptions = jobs.map((job) => ({
    value: String(job.id),
    label: job.title,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="Enter candidate's full name"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="candidate@example.com"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stage</label>
          <Select
            value={formData.stage}
            onValueChange={(value) => setFormData({ ...formData, stage: value as CandidateStage })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Position</label>
          <Select
            value={formData.jobId || 'none'}
            onValueChange={(value) =>
              setFormData({ ...formData, jobId: value === 'none' ? '' : value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Job (Optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Job Selected</SelectItem>
              {jobOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Candidate' : 'Add Candidate'}
        </Button>
      </div>
    </form>
  );
}
