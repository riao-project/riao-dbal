# Column pack

## Purpose

The column pack provides reusable column definitions for common model fields.

## Import pattern

```ts
import {
  BigIntKeyColumn,
  EmailColumn,
  UsernameColumn,
  CreateTimestampColumn,
  UpdateTimestampColumn,
} from '@riao/dbal/column-pack';
```

## Common definitions

### Keys

- `IntKeyColumn`
- `BigIntKeyColumn`
- `UUIDKeyColumn`

### User fields

- `EmailColumn`
- `UsernameColumn`
- `PasswordColumn`
- `IsVerifiedColumn`

### Date-time fields

- `CreateTimestampColumn`
- `UpdateTimestampColumn`
- `DeleteTimestampColumn`
- `ArchiveTimestampColumn`

### Address fields

- `AddressLine1Column`
- `AddressLine2Column`
- `CityColumn`
- `CountryCodeColumn`
- `PostalCodeColumn`
- `RegionColumn`

### Person fields

- `FirstNameColumn`
- `LastNameColumn`
- `DateOfBirthColumn`
- `PhoneNumberColumn`

### Resource fields

- `NameColumn`
- `TitleColumn`
- `SlugColumn`
- `PathColumn`
- `DisplayNameColumn`
- `VersionColumn`

### System fields

- `ChecksumColumn`
- `FileSizeColumn`
- `FilenameColumn`
- `FilepathColumn`
- `IpAddressColumn`
- `MimeTypeColumn`
- `StorageKeyColumn`
- `UrlColumn`

### Additional user fields

- `EmailVerifiedTimestampColumn`
- `LastLoginTimestampColumn`
- `PasswordUpdatedTimestampColumn`
- `TempEmailColumn`

The `audit` directory is not part of the public column-pack exports.

## Example use

```ts
await this.ddl.createTable({
  name: 'users',
  columns: [
    BigIntKeyColumn,
    EmailColumn,
    UsernameColumn,
    CreateTimestampColumn,
    UpdateTimestampColumn,
  ],
});
```

## Notes

- Column packs are just prebuilt `ColumnOptions` objects.
- They are meant to be composed or overridden to fit a specific table shape.
- They reduce repeated migration boilerplate without locking you into a single schema.
