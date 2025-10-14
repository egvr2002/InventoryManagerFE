type SuccessResult<T> = readonly [null, T];
type ErrorResult<E = Error> = readonly [E, null];

type Result<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return [null, data] as const;
  } catch (error) {
    let parsedError: E;

    if (error instanceof Error) {
      parsedError = error as E;
    } else {
      parsedError = new Error(String(error)) as E;
    }

    return [parsedError, null] as const;
  }
}
