export { default } from "next-auth/middleware";

export const config = {
  // Protect all routes except the login page
  matcher: ["/", "/clients/:path*", "/projects/:path*"],
};
