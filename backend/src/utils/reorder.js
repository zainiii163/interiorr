import { ApiError } from './ApiError.js';

/**
 * Apply order updates: body.items = [{ id, order }, ...]
 */
export async function applyReorder(Model, items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'items array required');
  }
  await Promise.all(
    items.map((item) => {
      const id = item.id || item._id;
      if (!id || item.order === undefined) {
        throw new ApiError(400, 'Each item needs id and order');
      }
      return Model.findByIdAndUpdate(id, { order: Number(item.order) });
    })
  );
}
