import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantUrl = process.env.QDRANT_URL || "http://localhost:6333";

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
});

export const COLLECTION_NAME = "frameworks";

let isInitialized = false;

export async function initializeQdrant() {
  if (isInitialized) {
    console.log("[Qdrant] Already initialized.");
    return;
  }
  console.log("[Qdrant] Starting initialization...");
  try {
    const collections = await qdrantClient.getCollections();
    console.log("[Qdrant] Existing collections:", JSON.stringify(collections.collections.map(c => c.name)));
    const exists = collections.collections.some(
      (c) => c.name === COLLECTION_NAME
    );

    if (!exists) {
      console.log(`[Qdrant] Collection '${COLLECTION_NAME}' missing. Creating...`);
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 3072,
          distance: "Cosine",
        },
      });
      console.log(`[Qdrant] Collection '${COLLECTION_NAME}' created successfully.`);
    } else {
      console.log(`[Qdrant] Collection '${COLLECTION_NAME}' exists. Checking dimensions...`);
      try {
        const info = await qdrantClient.getCollection(COLLECTION_NAME);
        const currentSize = (info.config.params.vectors as any).size;
        console.log(`[Qdrant] Current dimensions: ${currentSize}`);
        if (currentSize !== 3072) {
          console.warn(`[Qdrant] Dimension mismatch: expected 3072, found ${currentSize}. Recreating...`);
          await qdrantClient.deleteCollection(COLLECTION_NAME);
          await qdrantClient.createCollection(COLLECTION_NAME, {
            vectors: {
              size: 3072,
              distance: "Cosine",
            },
          });
          console.log(`[Qdrant] Collection '${COLLECTION_NAME}' recreated.`);
        }
      } catch (err) {
        console.error("[Qdrant] Error checking collection info:", err);
        console.log("[Qdrant] Attempting to force recreate...");
        await qdrantClient.deleteCollection(COLLECTION_NAME).catch(() => { });
        await qdrantClient.createCollection(COLLECTION_NAME, {
          vectors: { size: 3072, distance: "Cosine" },
        });
        console.log("[Qdrant] Force recreate finished.");
      }
    }
    isInitialized = true;
    console.log("[Qdrant] Initialization complete.");
  } catch (error) {
    console.error("[Qdrant] Fatal initialization error:", error);
    throw error;
  }
}

async function ensureCollection() {
  await initializeQdrant();
}

export async function upsertFramework(userId: string, frameworkId: string, vector: number[], payload: Record<string, unknown>) {
  await ensureCollection();
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
  await ensureCollection();
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
  await ensureCollection();
  try {
    await qdrantClient.delete(COLLECTION_NAME, {
      wait: true,
      points: [frameworkId],
    });
  } catch (err) {
    console.error(`Failed to delete point ${frameworkId} from Qdrant:`, err);
    // If point doesn't exist or collection is missing, we might get an error.
    // We handle it here so the caller doesn't necessarily fail.
  }
}
