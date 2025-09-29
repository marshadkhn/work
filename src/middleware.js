export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes except the login page
  matcher: [
    "/",
    "/workspaces", // Yeh add karna zaroori tha
    "/workspaces/:path*",
    "/expenses", // Yeh bhi add karna zaroori tha
    "/expenses/:path*",
  ],
};
