import { useCallback, useEffect, useState } from 'react'
import { SyncedTargetRef } from '@/store/SynopsisStore.tsx'
import { getTargetKey, validateWitness, WitnessError } from '@/utils/annotations.ts'

// maps a synced target (getTargetKey) to the reason it can not be navigated to
export type WitnessErrorMap = Record<string, WitnessError>
// the synced targets (getTargetKey) whose check has finished - valid or not
type CheckedMap = Record<string, true>

interface WitnessChecks {
  errors: WitnessErrorMap
  // whether a check of these targets is still running - their witness is shown as a skeleton and
  // can't be selected until then, as it may still turn out invalid
  isPending: (targets: SyncedTargetRef[]) => boolean
}

// Validates every synced target in parallel without blocking: all witnesses render right away, each
// one as pending until its own checks have finished, and with its error should one of them fail.
function useWitnessErrors(targets: SyncedTargetRef[]): WitnessChecks {
  const [errors, setErrors] = useState<WitnessErrorMap>({})
  const [checked, setChecked] = useState<CheckedMap>({})

  // rerun only when the set of targets changes, not on every new array reference
  const targetKeys = targets.map(getTargetKey).join(',')

  useEffect(() => {
    // results of the checks for a previous set of targets must not land in the new state
    let cancelled = false
    setErrors({})
    setChecked({})
    targets.forEach(async (st) => {
      let error: WitnessError | null
      try {
        error = await validateWitness(st)
      } catch {
        // the item or the text could not be loaded - the text can't be shown from this item
        error = 'witness_text_not_in_item'
      }
      if (cancelled) return
      const key = getTargetKey(st)
      if (error) setErrors((prev) => ({ ...prev, [key]: error }))
      setChecked((prev) => ({ ...prev, [key]: true }))
    })
    return () => { cancelled = true }
  }, [targetKeys])

  // a new function only when a check has finished, so callers can memoize on it
  const isPending = useCallback(
    (targets: SyncedTargetRef[]) => targets.some((st) => !checked[getTargetKey(st)]),
    [checked]
  )

  return { errors, isPending }
}

export default useWitnessErrors
