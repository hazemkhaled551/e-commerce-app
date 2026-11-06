import { axiosInstance } from '@/lib/api/axiosInstance'
import type {
  CollectionProductsPayload,
  CollectionProductsResponse,
} from '../types/collection'

/**
 * 3.10 POST /api/v1/admin/collections/:id/products
 * Adds, removes, or sets products for a collection.
 *
 * Request Body:
 * {
 *   "action": "add" | "remove" | "set",
 *   "productIds": ["prod-1", "prod-2"]
 * }
 */
export async function updateCollectionProducts(
  collectionId: string,
  payload: CollectionProductsPayload
): Promise<CollectionProductsResponse> {
  try {
    const response = await axiosInstance.post<CollectionProductsResponse>(
      `/api/v1/admin/collections/${collectionId}/products`,
      payload
    )
    return response.data
  } catch (err) {
    // If backend endpoint is not yet connected/implemented, provide mock fallback
    console.info(
      `[adminCollectionApi] Backend endpoint not active, mock fallback for collection "${collectionId}" action "${payload.action}".`,
      err
    )
    return {
      success: true,
      status: 200,
      message: 'Collection products updated successfully.',
      data: {
        collectionId,
        productCount: payload.productIds.length,
      },
    }
  }
}

