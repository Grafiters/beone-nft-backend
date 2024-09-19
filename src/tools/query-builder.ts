import { SelectQueryBuilder } from 'typeorm';

export function applyDynamicFilters<T>(
  queryBuilder: SelectQueryBuilder<T>,
  filters: { [key: string]: any },
  alias: string,
): SelectQueryBuilder<T> {
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      if (key.endsWith('_like')) {
        const actualKey = key.replace('_like', '');
        queryBuilder.andWhere(`${alias}.${actualKey} LIKE :${key}`, {
          [key]: `%${filters[key]}%`,
        });
      } else if (key.endsWith('_gt')) {
        const actualKey = key.replace('_gt', '');
        queryBuilder.andWhere(`${alias}.${actualKey} > :${key}`, {
          [key]: filters[key],
        });
      } else if (key.endsWith('_lt')) {
        const actualKey = key.replace('_lt', '');
        queryBuilder.andWhere(`${alias}.${actualKey} < :${key}`, {
          [key]: filters[key],
        });
      } else if (key.endsWith('_gte')) {
        const actualKey = key.replace('_gte', '');
        queryBuilder.andWhere(`${alias}.${actualKey} >= :${key}`, {
          [key]: filters[key],
        });
      } else if (key.endsWith('_lte')) {
        const actualKey = key.replace('_lte', '');
        queryBuilder.andWhere(`${alias}.${actualKey} <= :${key}`, {
          [key]: filters[key],
        });
      } else {
        queryBuilder.andWhere(`${alias}.${key} = :${key}`, {
          [key]: filters[key],
        });
      }
    }
  });

  return queryBuilder;
}
