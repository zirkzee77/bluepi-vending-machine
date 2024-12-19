export type CreateParams<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export interface BaseRepository<T> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
  updateById(id: number, data: Partial<T>): Promise<T | null>
}
