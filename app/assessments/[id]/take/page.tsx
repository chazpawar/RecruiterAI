'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { DatabaseService } from '@/lib/database';
import {
  type Assessment,
  type Candidate,
  type Question,
  QUESTION_TYPES,
} from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

/* ---------- Question Input Component ---------- */

interface QuestionInputProps {
  question: Question;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
}

function QuestionInput({ question, value, onChange, error }: QuestionInputProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and store the URL/reference
      onChange(`[File: ${file.name}]`);
    }
  };

  const handleMultiChoiceChange = (optionIndex: number, checked: boolean) => {
    const currentValues = Array.isArray(value) ? (value as number[]) : [];
    if (checked) {
      onChange([...currentValues, optionIndex]);
    } else {
      onChange(currentValues.filter((v) => v !== optionIndex));
    }
  };

  return (
    <div className="space-y-3">
      {question.type === QUESTION_TYPES.SHORT_TEXT && (
        <Input
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your answer..."
          className={error ? 'border-red-500' : ''}
        />
      )}

      {question.type === QUESTION_TYPES.LONG_TEXT && (
        <textarea
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? 'border-red-500' : ''
          }`}
          placeholder="Enter your answer..."
        />
      )}

      {question.type === QUESTION_TYPES.NUMERIC && (
        <Input
          type="number"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a number..."
          className={error ? 'border-red-500' : ''}
          min={question.validation?.minValue ?? undefined}
          max={question.validation?.maxValue ?? undefined}
        />
      )}

      {question.type === QUESTION_TYPES.SINGLE_CHOICE && (
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="radio"
                id={`option-${index}`}
                name={`question-${question.id}`}
                value={index}
                checked={value === index}
                onChange={() => onChange(index)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {question.type === QUESTION_TYPES.MULTI_CHOICE && (
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={`option-${index}`}
                checked={Array.isArray(value) && (value as number[]).includes(index)}
                onChange={(e) => handleMultiChoiceChange(index, e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor={`option-${index}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}

      {question.type === QUESTION_TYPES.FILE_UPLOAD && (
        <div className="space-y-2">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {value != null && value !== '' && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PaperClipIcon className="h-4 w-4" />
              {String(value)}
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Main Component ---------- */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AssessmentTakerPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('candidateId');

  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  // Unwrap params
  useEffect(() => {
    params.then((p) => setAssessmentId(p.id));
  }, [params]);

  const loadData = useCallback(async () => {
    if (!assessmentId) return;
    try {
      setLoading(true);

      const [assessmentData, candidateData] = await Promise.all([
        DatabaseService.getAssessmentById(assessmentId),
        candidateId ? DatabaseService.getCandidateById(candidateId) : null,
      ]);

      if (!assessmentData) {
        throw new Error('Assessment not found');
      }

      // Check if candidate has already submitted this assessment
      if (candidateId) {
        const existingResponse = await DatabaseService.getAssessmentResponse(
          candidateId,
          assessmentId
        );
        if (existingResponse) {
          setSubmitted(true);
          setResponses(existingResponse.responses || {});
        }
      }

      setAssessment(assessmentData);
      setCandidate(candidateData ?? null);
    } catch (error) {
      console.error('Error loading assessment:', error);
      toast.error('Failed to load assessment');
    } finally {
      setLoading(false);
    }
  }, [assessmentId, candidateId]);

  useEffect(() => {
    if (assessmentId) {
      loadData();
    }
  }, [assessmentId, loadData]);

  const currentSection = assessment?.sections[currentSectionIndex];
  const currentQuestion = currentSection?.questions[currentQuestionIndex];
  const totalQuestions =
    assessment?.sections.reduce((sum, section) => sum + section.questions.length, 0) || 0;
  const answeredQuestions = Object.keys(responses).length;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const getQuestionKey = (sectionIndex: number, questionIndex: number) => {
    return `${sectionIndex}-${questionIndex}`;
  };

  const getCurrentQuestionKey = () => {
    return getQuestionKey(currentSectionIndex, currentQuestionIndex);
  };

  const handleAnswerChange = (value: unknown) => {
    const questionKey = getCurrentQuestionKey();
    setResponses((prev) => ({
      ...prev,
      [questionKey]: value,
    }));

    // Clear error for this question
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[questionKey];
      return newErrors;
    });
  };

  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion) return true;

    const questionKey = getCurrentQuestionKey();
    const answer = responses[questionKey];

    if (currentQuestion.required) {
      if (
        !answer ||
        (Array.isArray(answer) && answer.length === 0) ||
        String(answer).trim() === ''
      ) {
        setErrors((prev) => ({
          ...prev,
          [questionKey]: 'This question is required',
        }));
        return false;
      }
    }

    // Validate numeric range if specified
    if (
      currentQuestion.type === QUESTION_TYPES.NUMERIC &&
      answer &&
      currentQuestion.validation
    ) {
      const numValue = parseFloat(String(answer));
      if (
        currentQuestion.validation.minValue !== null &&
        numValue < currentQuestion.validation.minValue
      ) {
        setErrors((prev) => ({
          ...prev,
          [questionKey]: `Value must be at least ${currentQuestion.validation.minValue}`,
        }));
        return false;
      }
      if (
        currentQuestion.validation.maxValue !== null &&
        numValue > currentQuestion.validation.maxValue
      ) {
        setErrors((prev) => ({
          ...prev,
          [questionKey]: `Value must not exceed ${currentQuestion.validation.maxValue}`,
        }));
        return false;
      }
    }

    // Validate text length if specified
    if (
      (currentQuestion.type === QUESTION_TYPES.SHORT_TEXT ||
        currentQuestion.type === QUESTION_TYPES.LONG_TEXT) &&
      answer &&
      currentQuestion.validation
    ) {
      if (
        currentQuestion.validation.maxLength &&
        String(answer).length > currentQuestion.validation.maxLength
      ) {
        setErrors((prev) => ({
          ...prev,
          [questionKey]: `Answer must not exceed ${currentQuestion.validation.maxLength} characters`,
        }));
        return false;
      }
    }

    return true;
  };

  const goToNextQuestion = () => {
    if (!validateCurrentQuestion() || !currentSection || !assessment) {
      return;
    }

    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSectionIndex < assessment.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const goToPreviousQuestion = () => {
    if (!assessment) return;

    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      setCurrentQuestionIndex(assessment.sections[currentSectionIndex - 1].questions.length - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessment || !assessmentId) return;

    // Validate all required questions
    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    assessment.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (question.required) {
          const questionKey = getQuestionKey(sectionIndex, questionIndex);
          const answer = responses[questionKey];

          if (
            !answer ||
            (Array.isArray(answer) && answer.length === 0) ||
            String(answer).trim() === ''
          ) {
            newErrors[questionKey] = 'This question is required';
            hasErrors = true;
          }
        }
      });
    });

    if (hasErrors) {
      setErrors(newErrors);
      toast.error('Please answer all required questions');
      return;
    }

    try {
      setSubmitting(true);

      const responseData = {
        candidateId: candidateId || 'anonymous',
        assessmentId,
        responses,
        completedAt: new Date().toISOString(),
        timeSpent: Date.now() - startTime,
      };

      await DatabaseService.createAssessmentResponse(responseData);

      setSubmitted(true);
      toast.success('Assessment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const isLastQuestion = (): boolean => {
    if (!assessment || !currentSection) return false;
    return (
      currentSectionIndex === assessment.sections.length - 1 &&
      currentQuestionIndex === currentSection.questions.length - 1
    );
  };

  const isFirstQuestion = (): boolean => {
    return currentSectionIndex === 0 && currentQuestionIndex === 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Assessment not found</h3>
            <p className="text-muted-foreground">
              The assessment you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Assessment Completed!</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for completing the assessment. Your responses have been submitted
              successfully.
            </p>
            <div className="text-sm text-muted-foreground">
              <p>
                Questions answered: {answeredQuestions} / {totalQuestions}
              </p>
              <p>Time spent: {Math.round((Date.now() - startTime) / 60000)} minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionKey = getCurrentQuestionKey();
  const currentAnswer = responses[currentQuestionKey];
  const currentError = errors[currentQuestionKey];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{assessment.title}</h1>
              {candidate && <p className="text-muted-foreground">Candidate: {candidate.name}</p>}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Question {answeredQuestions + 1} of {totalQuestions}
              </p>
              <Progress value={progress} className="w-32 mt-1" />
            </div>
          </div>

          {assessment.description && (
            <p className="text-muted-foreground">{assessment.description}</p>
          )}
        </div>

        {/* Current Section and Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {currentSection?.title || `Section ${currentSectionIndex + 1}`}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {currentSection?.questions.length}
              </span>
            </div>
            {currentSection?.description && (
              <p className="text-muted-foreground mt-2">{currentSection.description}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestion && (
              <div>
                <div className="flex items-start gap-3 mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                    {currentQuestionIndex + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2 text-left">
                      {currentQuestion.title}
                      {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    {currentQuestion.description && (
                      <p className="text-muted-foreground text-left">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Question Input */}
                <div className="ml-11">
                  <QuestionInput
                    question={currentQuestion}
                    value={currentAnswer}
                    onChange={handleAnswerChange}
                    error={currentError}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goToPreviousQuestion} disabled={isFirstQuestion()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-3">
            {isLastQuestion() ? (
              <Button
                onClick={handleSubmitAssessment}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            ) : (
              <Button onClick={goToNextQuestion}>
                Next
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
