export function success(
  data: unknown,
  code: string = '000000',
  message: string = 'success',
) {
  return {
    code,
    data,
    message,
  };
}
