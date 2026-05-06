export type PinnedRepo = {
  name: string;
  url: string;
  description: string | null;
  stargazerCount: number;
  primaryLanguage: { name: string; color: string | null } | null;
};

const GITHUB_LOGIN = "Awendling01";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

const QUERY = `
query PinnedRepos($login: String!) {
  user(login: $login) {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          url
          description
          stargazerCount
          primaryLanguage { name color }
        }
      }
    }
  }
}
`;

type GraphQLResponse = {
  data?: {
    user?: {
      pinnedItems?: { nodes?: PinnedRepo[] };
    };
  };
  errors?: { message: string }[];
};

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "andrewwendling.info",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: GITHUB_LOGIN },
      }),
      next: { revalidate: 3600 },
    });
  } catch {
    return [];
  }

  if (!res.ok) return [];

  const json = (await res.json()) as GraphQLResponse;
  if (json.errors?.length) return [];

  return json.data?.user?.pinnedItems?.nodes ?? [];
}
