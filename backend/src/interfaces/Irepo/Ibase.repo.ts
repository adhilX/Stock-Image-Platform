export interface IBaseRepo<T> {
    create(data: T): Promise<T>;
    findByEmail(email: string): Promise<T | null>;
    findByShortUrl(shortUrl: string): Promise<T | null>;
}