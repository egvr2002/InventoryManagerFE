export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T | null;
  error:
    | ({
        [k in keyof T]?: string;
      } & {details?: string})
    | null;
}
