import { IBaseRepo } from "./Ibase.repo";
import { IImage } from "../../entity/image.entity";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface IImageRepo extends IBaseRepo<IImage> {
  findByUserId(userId: string, page?: number, limit?: number): Promise<PaginatedResult<IImage>>;
  findById(id: string): Promise<IImage | null>;
  update(id: string, data: Partial<IImage>): Promise<IImage>;
  updateOrder(images: { id: string; order: number }[]): Promise<void>;
  deleteById(id: string): Promise<void>;
}

