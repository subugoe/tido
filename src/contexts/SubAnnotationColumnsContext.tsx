import { createContext, ReactNode, useContext, useState } from 'react'

// What the workbench in the sidebar hands to the columns between the texts and the sidebar: the
// path of the active card and how to change it. The workbench publishes it, the columns render it -
// they sit in different parts of the panel, so it goes through this context.
export interface SubAnnotationColumnsModel {
  // [annotation of the column, child, grandchild, ...]
  path: string[]
  annotationsById: Map<string, Annotation>
  childrenOf: (annotationId: string) => Annotation[]
  // the text the annotation of the column belongs to, so a column can keep it in place
  rootContentUrl: string | null
  // the whole path, starting with the annotation of the column - null closes the columns
  setPath: (path: string[] | null) => void
  showInText: () => void
  escape: () => void
}

interface State {
  model: SubAnnotationColumnsModel | null
  setModel: (model: SubAnnotationColumnsModel | null) => void
}

const SubAnnotationColumnsContext = createContext<State>({ model: null, setModel: () => {} })

export const SubAnnotationColumnsProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<SubAnnotationColumnsModel | null>(null)
  return <SubAnnotationColumnsContext.Provider value={{ model, setModel }}>
    {children}
  </SubAnnotationColumnsContext.Provider>
}

export const useSubAnnotationColumns = () => useContext(SubAnnotationColumnsContext)
