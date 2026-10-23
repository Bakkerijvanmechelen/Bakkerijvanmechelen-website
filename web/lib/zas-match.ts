/** Vergelijkt fichenamen los van hoofdletters, accenten, leestekens en dubbele spaties. */
export function normTitle(title: string) {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}
