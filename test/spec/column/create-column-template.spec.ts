import 'jasmine';
import {
	ColumnOptions,
	ColumnType,
	createColumnTemplate,
} from '../../../src/column';

describe('createColumnTemplate', () => {
	it('returns a cloned column when called without overrides', () => {
		const defaults: ColumnOptions = {
			name: 'created_at',
			type: ColumnType.TIMESTAMP,
			required: true,
			default: 'CURRENT_TIMESTAMP',
			fk: {
				referencesTable: 'event',
				referencesColumn: 'id',
			},
		};
		const template = createColumnTemplate(defaults);

		const column = template();

		expect(column).toEqual(defaults);
		expect(column).not.toBe(defaults);
		expect(column.fk).not.toBe(defaults.fk);
	});

	it('supports overriding top-level fields', () => {
		const template = createColumnTemplate({
			name: 'user_id',
			type: ColumnType.INT,
		});

		const column = template({ name: 'author_id' });

		expect(column).toEqual({
			name: 'author_id',
			type: ColumnType.INT,
		});
	});

	it('deep-merges nested foreign key overrides', () => {
		const template = createColumnTemplate<ColumnOptions>({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'CASCADE',
			},
		});

		const column = template({
			fk: {
				onDelete: 'SET NULL',
			},
		});

		expect(column).toEqual({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'SET NULL',
			},
		});
	});

	it('keeps nested override keys not present in defaults', () => {
		const template = createColumnTemplate<ColumnOptions>({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
			},
		});

		const column = template({
			fk: {
				name: 'fk_post_user_id',
			},
		});

		expect(column).toEqual({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				name: 'fk_post_user_id',
				referencesTable: 'user',
				referencesColumn: 'id',
			},
		});
	});

	it('keeps nested defaults when override values are undefined', () => {
		const template = createColumnTemplate<ColumnOptions>({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'CASCADE',
			},
		});

		const column = template({
			fk: {
				onDelete: undefined,
			},
		});

		expect(column).toEqual({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'CASCADE',
			},
		});
	});

	it('replaces arrays when overrides are provided', () => {
		type ColumnWithTags = ColumnOptions & { tags: string[] };
		const template = createColumnTemplate<ColumnWithTags>({
			name: 'user_id',
			type: ColumnType.INT,
			tags: ['required', 'indexed'],
		});

		const column = template({
			tags: ['optional'],
		});

		expect(column.tags).toEqual(['optional']);
	});

	it('does not mutate the template defaults', () => {
		const defaults: ColumnOptions = {
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'CASCADE',
			},
		};
		const template = createColumnTemplate(defaults);

		template({ fk: { onDelete: 'SET NULL' } });

		expect(defaults).toEqual({
			name: 'user_id',
			type: ColumnType.INT,
			fk: {
				referencesTable: 'user',
				referencesColumn: 'id',
				onDelete: 'CASCADE',
			},
		});
	});
});
