const normalizeUrl = (value?: string): string =>
  value ? value.trim().replace(/\/+$/, "") : "";

const normalizeMediaPath = (value?: string): string => {
  if (!value) return "";

  let normalized = value.trim();

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  normalized = normalized.replace(/^\/+app\/+uploads\//i, "/uploads/");

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
};

export const serverApi: string = normalizeUrl(process.env.REACT_APP_API_URL);
export const siteUrl: string = normalizeUrl(process.env.REACT_APP_SITE_URL);

export const resolveMediaUrl = (value?: string): string => {
  const normalized = normalizeMediaPath(value);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return serverApi ? `${serverApi}${normalized}` : normalized;
};

if (process.env.NODE_ENV === "production" && !serverApi) {
  console.error("Missing REACT_APP_API_URL in the production build environment.");
}

export const Messages ={
    error1:"Something went wrong, please try again later.",
    error2: "Please login first",
    error3: "Please fill all the required fields",
    error4:"Message is empty",
    error5: "Only images are allowed (jpg, jpeg, png)",
}
