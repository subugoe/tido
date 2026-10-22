// What went wrong with an annotation of a text - the kinds the developer report groups by
type AnnotationProblemKind =
  | 'empty_selector'
  | 'invalid_selector'
  | 'no_match'
  | 'styling'
  | 'filtering'
  | 'synopsis'
  | 'event'
  | 'unexpected'

interface AnnotationProblemDetail {
  selector?: string
  error?: unknown
}

interface AnnotationProblem extends AnnotationProblemDetail {
  kind: AnnotationProblemKind
  annotationId?: string
}

interface AnnotationErrorReport {
  add: (kind: AnnotationProblemKind, annotation?: Annotation | null, detail?: AnnotationProblemDetail) => void
  hasProblems: () => boolean
  // prints everything added since the last flush as one collapsed console group and starts over
  flush: () => void
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return error === undefined ? '' : String(error)
}

// Collects the annotation problems of one text during one run (e.g. a matching pass), so the
// developer gets a single overview per text instead of a console line per broken annotation.
function createAnnotationErrorReport(source: string): AnnotationErrorReport {
  let problems: AnnotationProblem[] = []

  return {
    add(kind, annotation, detail = {}) {
      problems.push({ kind, annotationId: annotation?.id, ...detail })
    },
    hasProblems() {
      return problems.length > 0
    },
    flush() {
      if (problems.length === 0) return

      console.groupCollapsed(`TIDO: annotation problems in ${source} (${problems.length})`)
      console.table(problems.map(({ kind, annotationId, selector, error }) => ({
        kind,
        annotationId: annotationId ?? '',
        selector: selector ?? '',
        message: getErrorMessage(error)
      })))
      // the table loses the stack traces, so the actual errors are listed below it
      problems.filter(problem => problem.error instanceof Error).forEach(problem => console.error(problem.error))
      console.groupEnd()

      problems = []
    }
  }
}

// For a problem that occurs on its own, outside of a run that collects several
function reportAnnotationError(source: string, kind: AnnotationProblemKind, error: unknown, annotation?: Annotation | null) {
  const report = createAnnotationErrorReport(source)
  report.add(kind, annotation, { error })
  report.flush()
}

export { createAnnotationErrorReport, reportAnnotationError }
export type { AnnotationProblemKind, AnnotationProblemDetail, AnnotationErrorReport }
