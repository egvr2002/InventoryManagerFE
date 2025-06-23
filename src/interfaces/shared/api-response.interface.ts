export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T | null;
  error: Error<T> | null;
}

type Error<T> = {
  [k in keyof T]?: string;
} & {details?: string};
