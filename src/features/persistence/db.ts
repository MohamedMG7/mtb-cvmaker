import Dexie, { type Table } from 'dexie'
import type { CvDocument } from '../../lib/schema/cv'

export type DraftRecord = {
  id: string
  title: string
  updatedAt: string
  document: CvDocument
}

class CvMakerDatabase extends Dexie {
  drafts!: Table<DraftRecord, string>

  constructor() {
    super('cvmaker-db')
    this.version(1).stores({
      drafts: 'id, updatedAt, title',
    })
  }
}

export const db = new CvMakerDatabase()
