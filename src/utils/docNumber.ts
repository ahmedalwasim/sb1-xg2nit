import { DocType } from '../types';

export function nextDocNumber(
  type: DocType,
  counters: Record<string, number>
): { number: string; counters: Record<string, number> } {
  const year = new Date().getFullYear();
  const key = `${type}-${year}`;
  const nextValue = (counters[key] ?? 0) + 1;
  const prefix = type === 'invoice' ? 'INV' : 'QTN';
  const number = `${prefix}-${year}-${String(nextValue).padStart(4, '0')}`;
  return { number, counters: { ...counters, [key]: nextValue } };
}
