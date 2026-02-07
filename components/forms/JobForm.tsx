'use client';

import { useForm } from 'react-hook-form';
import { JOB_STATUS, Job, JobStatus } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  tags: string[];
  location: string;
  salary: string;
  type: string;
  department: string;
  status: JobStatus;
}

interface JobFormProps {
  initialData?: Partial<Job>;
  onSubmit: (data: JobFormData) => Promise<void>;
  onCancel: () => void;
}

interface SelectOption {
  value: string;
  label: string;
}

const jobTypes: SelectOption[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const departments: SelectOption[] = [
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Product', label: 'Product' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Customer Success', label: 'Customer Success' },
  { value: 'Data', label: 'Data' },
  { value: 'Operations', label: 'Operations' },
];

export default function JobForm({
  initialData,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<JobFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      requirements: initialData?.requirements || [],
      benefits: initialData?.benefits || [],
      tags: initialData?.tags || [],
      location: initialData?.location || '',
      salary: initialData?.salary || '',
      type: initialData?.type || 'full-time',
      department: initialData?.department || '',
      status: initialData?.status || JOB_STATUS.ACTIVE,
    },
  });

  const watchedTags = watch('tags') || [];
  const watchedRequirements = watch('requirements') || [];
  const watchedBenefits = watch('benefits') || [];

  const handleFormSubmit = async (data: JobFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !watchedTags.includes(tag)) {
      setValue('tags', [...watchedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      'tags',
      watchedTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addRequirement = () => {
    setValue('requirements', [...watchedRequirements, '']);
  };

  const removeRequirement = (index: number) => {
    setValue(
      'requirements',
      watchedRequirements.filter((_, i) => i !== index)
    );
  };

  const addBenefit = () => {
    setValue('benefits', [...watchedBenefits, '']);
  };

  const removeBenefit = (index: number) => {
    setValue(
      'benefits',
      watchedBenefits.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="title">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="text-base mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="department">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('department')}
                onValueChange={(value) => setValue('department', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="type">
                Job Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('type')}
                onValueChange={(value) => setValue('type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                {...register('location', { required: 'Location is required' })}
                className="mt-1"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salary">Salary Range</Label>
              <Input
                id="salary"
                placeholder="e.g., $80,000 - $100,000"
                {...register('salary')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status')}
                onValueChange={(value) => setValue('status', value as JobStatus)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={JOB_STATUS.ACTIVE}>Active</SelectItem>
                  <SelectItem value={JOB_STATUS.ARCHIVED}>Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Job Description
          </h3>
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              {...register('description', {
                required: 'Description is required',
              })}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white"
              placeholder="Describe the role, responsibilities, and what makes it exciting..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Requirements
          </h3>
          <div className="space-y-3">
            {watchedRequirements.map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  {...register(`requirements.${index}` as const)}
                  className="flex-1"
                  placeholder="Enter a requirement..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRequirement(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRequirement}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              Add Requirement
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Benefits
          </h3>
          <div className="space-y-3">
            {watchedBenefits.map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Input
                  {...register(`benefits.${index}` as const)}
                  className="flex-1"
                  placeholder="Enter a benefit..."
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBenefit(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBenefit}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Add Benefit
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tags
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Input
                id="tag-input"
                placeholder="Enter a tag..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    addTag(input.value.trim());
                    input.value = '';
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.getElementById(
                    'tag-input'
                  ) as HTMLInputElement;
                  if (input) {
                    addTag(input.value.trim());
                    input.value = '';
                  }
                }}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                Add Tag
              </Button>
            </div>

            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#1f1687] hover:bg-[#161357] text-white px-6"
          >
            {isSubmitting
              ? 'Saving...'
              : initialData
                ? 'Update Job'
                : 'Create Job'}
          </Button>
        </div>
      </form>
    </div>
  );
}
