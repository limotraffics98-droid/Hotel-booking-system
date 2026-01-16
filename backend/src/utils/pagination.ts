import { PaginationParams } from '../types/index.js';

export const getPaginationParams = (
  page?: string | number,
  limit?: string | number
): PaginationParams => {
  const pageNum = typeof page === 'string' ? parseInt(page, 10) : page || 1;
  const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit || 10;

  const validPage = Math.max(1, pageNum);
  const validLimit = Math.min(100, Math.max(1, limitNum));

  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
};
