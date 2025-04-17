export interface ApiResponse<T> {
    data: T,
    pagination?: {
        limit: number,
        offset: number,
    },
    total?: number
}