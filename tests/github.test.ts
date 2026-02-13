import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  listGists,
  getGist,
  createGist,
  updateGist,
  deleteGist,
  listStarredGists,
  starGist,
  unstarGist,
} from "../src/github.js";

const TOKEN = "ghp_test_token";

const MOCK_GIST = {
  id: "abc123",
  url: "https://api.github.com/gists/abc123",
  html_url: "https://gist.github.com/abc123",
  description: "Test gist",
  public: true,
  files: {
    "hello.ts": {
      filename: "hello.ts",
      content: 'console.log("hello");',
      language: "TypeScript",
      size: 21,
    },
  },
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  comments: 0,
};

describe("github gist client", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch");
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it("lists gists", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_GIST]), { status: 200 }),
    );

    const gists = await listGists(TOKEN, 10, 1);
    expect(gists).toHaveLength(1);
    expect(gists[0]?.id).toBe("abc123");

    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[0]).toContain("/gists?per_page=10&page=1");
    expect(call[1].headers).toHaveProperty("Authorization", `Bearer ${TOKEN}`);
  });

  it("gets a gist by ID", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_GIST), { status: 200 }),
    );

    const gist = await getGist(TOKEN, "abc123");
    expect(gist.id).toBe("abc123");
    expect(gist.files["hello.ts"]?.content).toBe('console.log("hello");');
  });

  it("creates a gist", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_GIST), { status: 201 }),
    );

    const gist = await createGist(TOKEN, {
      description: "Test gist",
      public: true,
      files: { "hello.ts": { content: 'console.log("hello");' } },
    });

    expect(gist.id).toBe("abc123");
    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe("POST");
  });

  it("updates a gist", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify(MOCK_GIST), { status: 200 }),
    );

    const gist = await updateGist(TOKEN, "abc123", {
      description: "Updated",
    });

    expect(gist.id).toBe("abc123");
    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe("PATCH");
  });

  it("deletes a gist", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await deleteGist(TOKEN, "abc123");
    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe("DELETE");
    expect(call[0]).toContain("/gists/abc123");
  });

  it("lists starred gists", async () => {
    fetchSpy.mockResolvedValueOnce(
      new Response(JSON.stringify([MOCK_GIST]), { status: 200 }),
    );

    const gists = await listStarredGists(TOKEN);
    expect(gists).toHaveLength(1);
  });

  it("stars a gist", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await starGist(TOKEN, "abc123");
    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe("PUT");
    expect(call[0]).toContain("/gists/abc123/star");
  });

  it("unstars a gist", async () => {
    fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

    await unstarGist(TOKEN, "abc123");
    const call = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(call[1].method).toBe("DELETE");
    expect(call[0]).toContain("/gists/abc123/star");
  });

  it("throws on API error", async () => {
    fetchSpy.mockResolvedValueOnce(new Response("Not Found", { status: 404 }));

    await expect(getGist(TOKEN, "nonexistent")).rejects.toThrow(
      "GitHub API error (404)",
    );
  });
});
