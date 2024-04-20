
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-GB',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

