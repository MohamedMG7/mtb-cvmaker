import { useEffect } from 'react'
import { db } from './db'
import { createDefaultDocument, ensureDocument } from '../../lib/schema/cv'
import { useCvStore } from '../editor/store/useCvStore'

const ACTIVE_DRAFT_ID = 'active-draft'

export const useDraftPersistence = () => {
  const document = useCvStore((state) => state.document)
  const isReady = useCvStore((state) => state.isReady)
  const initialize = useCvStore((state) => state.initialize)
  const markSaved = useCvStore((state) => state.markSaved)
  const markSaving = useCvStore((state) => state.markSaving)
  const markSaveError = useCvStore((state) => state.markSaveError)

  useEffect(() => {
    let cancelled = false

    const loadDraft = async () => {
      try {
        const draft = await db.drafts.get(ACTIVE_DRAFT_ID)
        if (cancelled) {
          return
        }

        initialize(draft ? ensureDocument(draft.document) : createDefaultDocument())
      } catch {
        if (!cancelled) {
          initialize(createDefaultDocument())
        }
      }
    }

    void loadDraft()

    return () => {
      cancelled = true
    }
  }, [initialize])

  useEffect(() => {
    if (!isReady) {
      return
    }

    const timeoutId = window.setTimeout(async () => {
      markSaving()

      try {
        await db.drafts.put({
          id: ACTIVE_DRAFT_ID,
          title: document.metadata.title,
          updatedAt: document.metadata.updatedAt,
          document,
        })

        markSaved(document.metadata.updatedAt)
      } catch {
        markSaveError()
      }
    }, 350)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [document, isReady, markSaveError, markSaved, markSaving])
}
