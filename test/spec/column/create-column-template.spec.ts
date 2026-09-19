import 'jasmine';
import {
	ColumnOptions,
	ColumnType,
	createColumnTemplate,
} from '../../../src/column';

describe('createColumnTemplate', () => {
	it('returns a cloned column when called without overrides', () => {
		const template = createColumnTemplate({
			name: 'created_at',
			type: ColumnType.TIMESTAMP,
			required: true,
			default: 'CURRENT_TIMESTAMP',
		});

		const column = template();

		expect(column).toEqual({
			name: 'created_at',
			type: ColumnType.TIMESTAMP,
			required: true,
			default: 'CURRENT_TIMESTAMP',
		});
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
