const API_BASE = "https://api.github.com";

export interface GistFile {
  filename: string;
  content: string;
  language?: string;
  size?: number;
}

export interface Gist {
  id: string;
  url: string;
  html_url: string;
  description: string | null;
  public: boolean;
  files: Record<string, GistFile>;
  created_at: string;
  updated_at: string;
  comments: number;
}

export interface GistCreateInput {
  description?: string;
  public?: boolean;
  files: Record<string, { content: string }>;
}

export interface GistUpdateInput {
  description?: string;
  files?: Record<string, { content: string } | null>;
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${text}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export async function listGists(
  token: string,
  perPage = 30,
  page = 1,
): Promise<Gist[]> {
  return request<Gist[]>(`/gists?per_page=${perPage}&page=${page}`, token);
}

export async function getGist(token: string, gistId: string): Promise<Gist> {
  return request<Gist>(`/gists/${gistId}`, token);
}

export async function createGist(
  token: string,
  input: GistCreateInput,
): Promise<Gist> {
  return request<Gist>("/gists", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateGist(
  token: string,
  gistId: string,
  input: GistUpdateInput,
): Promise<Gist> {
  return request<Gist>(`/gists/${gistId}`, token, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteGist(token: string, gistId: string): Promise<void> {
  await request<undefined>(`/gists/${gistId}`, token, {
    method: "DELETE",
  });
}

export async function listStarredGists(
  token: string,
  perPage = 30,
  page = 1,
): Promise<Gist[]> {
  return request<Gist[]>(
    `/gists/starred?per_page=${perPage}&page=${page}`,
    token,
  );
}

export async function starGist(token: string, gistId: string): Promise<void> {
  await request<undefined>(`/gists/${gistId}/star`, token, {
    method: "PUT",
    headers: { "Content-Length": "0" },
  });
}

export async function unstarGist(token: string, gistId: string): Promise<void> {
  await request<undefined>(`/gists/${gistId}/star`, token, {
    method: "DELETE",
  });
}
