'use client'

import React from 'react'
import { toast } from 'sonner'

export type StepStatus = 'pending' | 'running' | 'completed' | 'failed'

export type ProgressStep = {
  id: string
  label: string
  status: StepStatus
  substeps?: ProgressStep[]
  delay?: number
  dynamicValue?: string
}

type ProgressState = {
  steps: ProgressStep[]
  currentStepIndex: number
  isRunning: boolean
  isCancelled: boolean
}

type UseProgressOptions = {
  initialSteps: ProgressStep[]
  onComplete?: () => void
  onError?: (error: string) => void
  onCancel?: () => void
}

export const useProgress = ({ initialSteps, onComplete, onCancel }: UseProgressOptions) => {
  const [state, setState] = React.useState<ProgressState>({
    steps: initialSteps,
    currentStepIndex: -1,
    isRunning: false,
    isCancelled: false
  })

  const timeoutsRef = React.useRef<NodeJS.Timeout[]>([])
  const stepsRef = React.useRef<ProgressStep[]>(initialSteps)
  const isCancelledRef = React.useRef<boolean>(false)
  const [isPending, startTransition] = React.useTransition()

  // Update steps when initialSteps changes
  React.useEffect(() => {
    stepsRef.current = initialSteps
    setState((prev) => ({
      ...prev,
      steps: initialSteps
    }))
  }, [initialSteps])

  const clearAllTimeouts = React.useCallback(() => {
    for (const timeout of timeoutsRef.current) {
      clearTimeout(timeout)
    }
    timeoutsRef.current = []
  }, [])

  const updateStepStatus = React.useCallback(
    (stepId: string, status: StepStatus, dynamicValue?: string) => {
      setState((prev) => ({
        ...prev,
        steps: prev.steps.map((step) => {
          if (step.id === stepId) {
            return { ...step, status, dynamicValue }
          }
          // Update substeps if they exist
          if (step.substeps) {
            return {
              ...step,
              substeps: step.substeps.map((substep) =>
                substep.id === stepId ? { ...substep, status, dynamicValue } : substep
              )
            }
          }
          return step
        })
      }))
    },
    []
  )

  const executeStep = React.useCallback(
    async (step: ProgressStep): Promise<boolean> => {
      return new Promise((resolve) => {
        // Check if already cancelled before starting
        if (isCancelledRef.current) {
          resolve(false)
          return
        }

        updateStepStatus(step.id, 'running')

        const timeout = setTimeout(() => {
          // Check cancellation before proceeding
          if (isCancelledRef.current) {
            resolve(false)
            return
          }

          // Simulate success by default
          updateStepStatus(step.id, 'completed', step.dynamicValue)

          // Execute substeps if they exist
          if (step.substeps && step.substeps.length > 0) {
            const substeps = step.substeps
            let substepIndex = 0
            const executeSubstep = () => {
              // Check cancellation before each substep
              if (isCancelledRef.current) {
                resolve(false)
                return
              }

              if (substepIndex < substeps.length) {
                const substep = substeps[substepIndex]
                updateStepStatus(substep.id, 'running')

                const substepTimeout = setTimeout(() => {
                  // Check cancellation before completing substep
                  if (isCancelledRef.current) {
                    resolve(false)
                    return
                  }
                  updateStepStatus(substep.id, 'completed', substep.dynamicValue)
                  substepIndex++
                  executeSubstep()
                }, substep.delay || 1000)

                timeoutsRef.current.push(substepTimeout)
              } else {
                resolve(true)
              }
            }
            executeSubstep()
          } else {
            resolve(true)
          }
        }, step.delay || 1000)

        timeoutsRef.current.push(timeout)
      })
    },
    [updateStepStatus]
  )

  const start = React.useCallback(() => {
    const currentSteps = stepsRef.current
    // Reset cancellation flag when starting
    isCancelledRef.current = false

    startTransition(async () => {
      setState((prev) => ({
        ...prev,
        isRunning: true,
        isCancelled: false,
        currentStepIndex: 0
      }))

      for (let i = 0; i < currentSteps.length; i++) {
        if (isCancelledRef.current) {
          break
        }

        const step = currentSteps[i]
        const success = await executeStep(step)

        if (!success || isCancelledRef.current) {
          setState((prev) => ({ ...prev, isRunning: false }))
          return
        }

        setState((prev) => ({ ...prev, currentStepIndex: i + 1 }))
      }

      if (!isCancelledRef.current) {
        setState((prev) => ({ ...prev, isRunning: false }))
        onComplete?.()
      }
    })
  }, [executeStep, onComplete])

  const cancel = React.useCallback(() => {
    // Set the cancellation flag so the loop can check it
    isCancelledRef.current = true
    clearAllTimeouts()
    setState((prev) => ({
      ...prev,
      isCancelled: true,
      isRunning: false
    }))
    toast.info('Process cancelled')
    onCancel?.()
  }, [clearAllTimeouts, onCancel])

  const reset = React.useCallback(() => {
    isCancelledRef.current = false
    clearAllTimeouts()
    setState((prev) => ({
      steps: prev.steps.map((step) => ({
        ...step,
        status: 'pending' as StepStatus,
        substeps: step.substeps?.map((substep) => ({
          ...substep,
          status: 'pending' as StepStatus
        }))
      })),
      currentStepIndex: -1,
      isRunning: false,
      isCancelled: false
    }))
  }, [clearAllTimeouts])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearAllTimeouts()
    }
  }, [clearAllTimeouts])

  return {
    steps: state.steps,
    currentStepIndex: state.currentStepIndex,
    isRunning: state.isRunning,
    isCancelled: state.isCancelled,
    isPending,
    start,
    cancel,
    reset,
    updateStepStatus
  }
}
