/**
 * Format string or number to currency format
 *
 * @param {string|number} value - Value you want to convert
 * @returns
 */
export const toCurrency = value => {
  const castedValue = typeof value === "string" ? value : `${value}`;
  return "Rp " + castedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
export const toCurrencyRp = value => {
  const castedValue = typeof value === "string" ? value : `${value}`;
  return castedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
/**
 * Format date 2018-12-03 to 03 Desember 2018
 *
 * @param {string} value - Value you want to convert
 * @returns
 */
export const toHumanDate = (value, diffDate = "") => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
  ];

  const date = new Date(value);
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  let withYear = true;

  if (diffDate !== "") {
    const dateDiff = new Date(diffDate);
    const yearDiff = dateDiff.getFullYear();
    if (year === yearDiff) {
      withYear = false;
    }
  }

  const result = day + " " + month + (withYear ? " " + year : "");
  return result;
};

/**
 * Get excerpt from sentences in specified word length
 * without suffix like (...)
 *
 * @param {string} sentence Sentence you want to get excerpt
 * @param {number} totalWords Excerpt word length
 * @returns
 */
export const getExcerpt = (sentence, totalWords = 10) => {
  const words = sentence.split(" ");
  const result = words.slice(0, totalWords).join(" ");

  return result;
};
