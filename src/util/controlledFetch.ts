export async function controlledFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (response.status === 401 || response.status === 403) {
    try {
      const refreshOptions: RequestInit = {
        method: "POST",
        credentials: "include",
      };
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        refreshOptions.headers = {
          Cookie: cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
        };
      }
      const refreshResponse = await fetch(
        "http://localhost:3000/api/auth/refresh",
        refreshOptions
      );

      if (!refreshResponse.ok) throw new Error("Refresh failed");

      return response;
    } catch (refreshError) {
      console.log(refreshError);
      try {
        await fetch("http://localhost:3000/api/users/logout", {
          method: "GET",
          credentials: "include",
        });
      } catch (logoutError) {
        console.error("Logout failed:", logoutError);
      }

      throw new Error("Session expired. Please log in again.");
    }
  }
  return response;
}
