const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// Login
export async function login(payload) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, message: data.message || "Login failed" };
    }

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return { success: true, ...data };
  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
}

// Register (Signup)
export async function register(payload) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // return backend message even on error
      return { success: false, message: data.message || `Register failed: ${res.status}` };
    }

    // success
    return { success: true, message: data.message || "User registered successfully" };
  } catch (err) {
    return { success: false, message: err.message || "Network error" };
  }
}

// --- Search bookings ---
export async function searchBookings(payload) {
  try {
    const res = await authFetch(`${API_BASE}/bookings/search`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    return await res.json();
  } catch (err) {
    console.error("searchBookings error:", err);
    return { available: false, cars: [] };
  }
}

