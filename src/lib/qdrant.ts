import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
});

export const COLLECTION_NAME = "frameworks";

export async function initializeQdrant() {
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 3072,
          distance: "Cosine",
        },
      });
    }
  } catch (error) {
    console.error("Failed to initialize Qdrant:", error);
  }
}

export async function upsertFramework(userId: string, frameworkId: string, vector: number[], payload: Record<string, unknown>) {
  await qdrantClient.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: frameworkId,
        vector,
        payload: {
          user_id: userId,
          framework_id: frameworkId,
          ...payload,
        },
      },
    ],
  });
}

export async function searchFrameworks(userId: string, queryVector: number[], limit: number = 2) {
  const results = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    limit,
    filter: {
      must: [
        {
          key: "user_id",
          match: { value: userId },
        },
      ],
    },
    with_payload: true,
  });

  return results;
}

export async function deleteFrameworkFromQdrant(frameworkId: string) {
  await qdrantClient.delete(COLLECTION_NAME, {
    wait: true,
    points: [frameworkId],
  });
}
