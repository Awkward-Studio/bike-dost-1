import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// Assuming listAllUsers and setCookie are used elsewhere or will be used,
// but they are not directly impacting this middleware logic in the provided snippet.
// import { listAllUsers } from "./lib/appwrite";
// import { setCookie } from "cookies-next";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("THIS IS THE CURRENT PATH - ", path);

  // The isPublicPath variable is not directly used in the current logic,
  // it can be removed if not needed for other public path definitions.
  // const isPublicPath = path === "/";

  const token = request.cookies.get("user")?.value || "";
  let redirectURL = "/"; // Default redirect URL for unauthenticated users or fallback
  let shouldRedirect = true; // Flag to control if a redirection should occur

  if (token) {
    console.log("USER TOKEN EXISTS");
    let userAccess = "";
    try {
      const parsedToken = JSON.parse(token);
      userAccess = parsedToken.labels[0]; // Assuming labels[0] always exists and is the relevant access level
      console.log("LABEL FROM TOKEN - ", userAccess);
    } catch (error) {
      console.error("Error parsing user token:", error);
      // If the token is invalid JSON, treat it as unauthenticated
      userAccess = "";
    }

    if (userAccess === "super") {
      console.log("User is 'super'.");
      // If 'super' user lands on the root path, redirect them to '/super'
      if (path === "/") {
        redirectURL = "/super";
        // shouldRedirect remains true to enforce the initial redirect to /super
      } else {
        // If 'super' user is already on '/super' or any other authorized path,
        // they should not be redirected. Allow them to proceed.
        shouldRedirect = false;
      }
    } else {
      // Logic for all other authenticated user roles (non-super)
      switch (userAccess) {
        case "parts":
          redirectURL = "/parts";
          break;
        case "biller":
          redirectURL = "/biller";
          break;
        case "security":
          redirectURL = "/security";
          break;
        case "service":
          redirectURL = "/service";
          break;
        case "admin":
          redirectURL = "/admin";
          break;
        case "caller":
          redirectURL = "/caller";
          break;
        default:
          // If userAccess is unrecognized or empty due to parse error,
          // redirect to the home page (effectively logging them out or to a default view).
          redirectURL = "/";
          break;
      }

      console.log("Intended redirect for non-'super' user: ", redirectURL);
      // If the current path already starts with the intended redirectURL for this role,
      // no redirection is necessary.
      if (path.startsWith(redirectURL)) {
        shouldRedirect = false;
      }
    }

    // Perform the redirection if the 'shouldRedirect' flag is still true.
    // This applies to the initial redirect for 'super' users from '/' to '/super',
    // and for non-'super' users who are not on their assigned route.
    if (shouldRedirect) {
      return NextResponse.redirect(new URL(redirectURL, request.nextUrl));
    }

  } else {
    // User token does not exist (unauthenticated user)
    console.log("USER TOKEN DOES NOT EXIST");
    // If the unauthenticated user is trying to access any path other than the root ("/"),
    // redirect them to the root path (presumably a login page).
    if (path !== "/") {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }

  // If no redirection was needed based on the above logic (e.g., 'super' user on any valid path,
  // authenticated user already on their correct path, or unauthenticated user on the root path),
  // allow the request to proceed to its destination.
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/parts/:path*",
    "/biller/:path*",
    "/security/:path*",
    "/admin/:path*",
    "/service/:path*",
    "/caller/:path*",
    "/super/:path*", // Added /super to the matcher to apply middleware to it
    "/", // Ensure the root path is also matched
  ],
};
