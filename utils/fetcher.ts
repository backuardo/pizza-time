export async function fetcher(...args: [string, RequestInit?]) {
  const res = await fetch(...args);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return res.json();
}
