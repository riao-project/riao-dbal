# Seeding data

## Purpose

Seed classes populate a database with baseline or example records.

**NOTE** Create seeds with `npx riao seed:create [seed-name]`

## Base class

```ts
import { Seed } from '@riao/dbal';

export default class CreateDemoUsers extends Seed {
  public override async up() {
    await this.query.insert({
      table: 'users',
      records: [{ email: 'demo@example.com', username: 'demo' }],
    });
  }

  public override async down() {
    await this.query.delete({
      table: 'users',
      where: { email: 'demo@example.com' },
    });
  }
}
```

## Runtime behavior

The seed runner loads files from a configured seeds directory and executes them in order.

Create a seed with the CLI:

```text
npx riao seed:create create-demo-users
```

`SeedRunner` executes `up()` for seed records that have not been applied. A seed's `down()` method removes its data when the runner supports rollback.
`AutoSeed` is available for seed flows that should be generated from configured
data rather than a hand-written seed class.

## Notes

- Seeds are for demo, development, or initialization data.
- They are distinct from migrations, which manage structural changes.
- A seed only runs the runtime data operations needed to establish a known baseline.
- `SeedRecord` identifies the seed entries tracked by the runner.
