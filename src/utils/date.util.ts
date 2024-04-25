import dayjs from 'dayjs';
export function dateFormat(
  date: Date,
  formatter: string = 'YYYY-MM-DD HH:mm:ss',
) {
  return dayjs(date).format(formatter);
}
