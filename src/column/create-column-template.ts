import { ColumnOptions } from './column-options';

type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepPartial<T> = T extends Primitive
	? T
	: T extends Array<infer U>
	? Array<DeepPartial<U>>
	: { [K in keyof T]?: DeepPartial<T[K]> };

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (value === null || typeof value !== 'object') {
		return false;
	}

	return Object.getPrototypeOf(value) === Object.prototype;
}

function cloneValue<T>(value: T): T {
	if (Array.isArray(value)) {
		return value.map(item => cloneValue(item)) as T;
	}

	if (isPlainObject(value)) {
		const cloned: Record<string, unknown> = {};

		for (const [key, item] of Object.entries(value)) {
			cloned[key] = cloneValue(item);
		}

		return cloned as T;
	}

	return value;
}

function mergeValue<T>(defaults: T, overrides: DeepPartial<T> | undefined): T {
	if (overrides === undefined) {
		return cloneValue(defaults);
	}

	if (Array.isArray(defaults) && Array.isArray(overrides)) {
		const merged = defaults.map((item, index) =>
			mergeValue(item, overrides[index] as DeepPartial<unknown>)
		);

		for (let i = defaults.length; i < overrides.length; i += 1) {
			merged.push(cloneValue(overrides[i]));
		}

		return merged as T;
	}

	if (defaults === undefined) {
		return cloneValue(overrides as T);
	}

	if (isPlainObject(defaults) && isPlainObject(overrides)) {
		const merged: Record<string, unknown> = {};
		const keys = new Set([
			...Object.keys(defaults),
			...Object.keys(overrides),
		]);

		for (const key of keys) {
			merged[key] = mergeValue(
				(defaults as Record<string, unknown>)[key],
				(overrides as Record<string, unknown>)[
					key
				] as DeepPartial<unknown>
			);
		}

		return merged as T;
	}

	return cloneValue(overrides as T);
}

export function createColumnTemplate<TColumn extends ColumnOptions>(
	defaults: TColumn
): (overrides?: DeepPartial<TColumn>) => TColumn {
	return (overrides?: DeepPartial<TColumn>) =>
		mergeValue(defaults, overrides);
}
