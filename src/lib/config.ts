const normalizeUrl = (value?: string): string =>
  value ? value.trim().replace(/\/+$/, "") : "";

export const serverApi: string = normalizeUrl(process.env.REACT_APP_API_URL);
export const siteUrl: string = normalizeUrl(process.env.REACT_APP_SITE_URL);

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
