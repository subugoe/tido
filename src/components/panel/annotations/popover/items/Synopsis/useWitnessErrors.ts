import { useEffect, useState } from 'react'
import { SyncedTargetRef } from '@/store/SynopsisStore.tsx'
import { getTargetKey, validateWitness, WitnessError } from '@/utils/annotations.ts'

// maps a synced target (getTargetKey) to the reason it can not be navigated to
export type WitnessErrorMap = Record<string, WitnessError>

// Validates every synced target in parallel without blocking: the map starts empty, so all witnesses
// render right away, and each one gets its error as soon as its own check fails.
function useWitnessErrors(targets: SyncedTargetRef[]): WitnessErrorMap {
  const [errors, setErrors] = useState<WitnessErrorMap>({})

  // rerun only when the set of targets changes, not on every new array reference
  const targetKeys = targets.map(getTargetKey).join(',')

  useEffect(() => {
    setErrors({})
    targets.forEach(async (st) => {
      let error: WitnessError | null
      try {
        error = await validateWitness(st)
      } catch {
        // the item or the text could not be loaded - the text can't be shown from this item
        error = 'witness_text_not_in_item'
      }
      if (error) setErrors((prev) => ({ ...prev, [getTargetKey(st)]: error }))
    })
  }, [targetKeys])

  return errors
}

export default useWitnessErrors
