export interface PagingResponse<T> {
  records: T[];
  total: number;
  pageSize: number;
  current: number;
  pages: number;
}

export enum NumberBoolean {
  FALSE = 0,
  TRUE = 1,
}

export enum UserScope {
  USER = 1,
  AGENT = 6,
  ADMIN = 7,
}

export const roleOptioons = [
  {
    label: 'user',
    value: UserScope.USER,
  },
  {
    label: 'agent',
    value: UserScope.AGENT,
  },
  {
    label: 'admin',
    value: UserScope.ADMIN,
  },
];
