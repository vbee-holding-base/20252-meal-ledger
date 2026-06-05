export const normaliseName = (name: unknown) => {
  if (!name || typeof name !== "string") return null;
  const norm = name.trim();
  if (norm === "") return null;
  return norm;
};
