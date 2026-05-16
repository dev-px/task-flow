const slugify = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove symbols
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

export default slugify;
