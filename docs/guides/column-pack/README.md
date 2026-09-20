# Column Pack

The column pack provides reusable `ColumnOptions` definitions for common database fields. Import columns from the public column-pack entry point:

```typescript
import {
	BigIntKeyColumn,
	CreateTimestampColumn,
	EmailColumn,
	UpdateTimestampColumn,
} from '@riao/dbal/column-pack';
```

Use the exported definitions directly in a table migration:

```typescript
await this.ddl.createTable({
	name: 'users',
	columns: [
		BigIntKeyColumn,
		EmailColumn,
		CreateTimestampColumn,
		UpdateTimestampColumn,
	],
});
```

## Packs

### Address

Address fields are optional by default:

- `AddressLine1Column` - `address_line_1`, `VARCHAR(255)`
- `AddressLine2Column` - `address_line_2`, `VARCHAR(255)`
- `CityColumn` - `city`, `VARCHAR(255)`
- `CountryCodeColumn` - `country_code`, `VARCHAR(2)`
- `PostalCodeColumn` - `postal_code`, `VARCHAR(20)`
- `RegionColumn` - `region`, `VARCHAR(255)`

### Date-time

- `ArchiveTimestampColumn` - nullable `archive_timestamp` timestamp
- `CreateTimestampColumn` - `create_timestamp` timestamp with a current-timestamp default
- `DeleteTimestampColumn` - nullable `delete_timestamp` timestamp
- `TimezoneColumn` - optional `timezone`, `VARCHAR(64)`
- `UpdateTimestampColumn` - `update_timestamp` timestamp with a current-timestamp default and update trigger

A nullable lifecycle timestamp is the source of truth for that lifecycle state: `NULL` means the event has not occurred. For example, a record with a non-null `delete_timestamp` is deleted. There is no separate `IsDeletedColumn`.

### Keys

- `IntKeyColumn` - auto-incrementing `INT` primary key named `id`
- `BigIntKeyColumn` - auto-incrementing `BIGINT` primary key named `id`
- `UUIDKeyColumn` - `UUID` primary key named `id` with a generated UUID default

### Person

- `DateOfBirthColumn` - `date_of_birth`, `DATE`
- `FirstNameColumn` - `first_name`, `VARCHAR(35)`
- `LastNameColumn` - `last_name`, `VARCHAR(35)`
- `PhoneNumberColumn` - optional `phone_number`, `VARCHAR(32)`

### Resource

Resource columns describe persisted records and their presentation:

- `AltTextColumn` - optional `alt_text`, `VARCHAR(255)`
- `ContentColumn` - optional `content`, `TEXT`
- `DescriptionColumn` - optional `description`, `TEXT`
- `DisplayNameColumn` - optional `display_name`, `VARCHAR(255)`
- `IsActiveColumn` - `is_active`, `BOOL`, default `false`
- `LocaleColumn` - optional `locale`, `VARCHAR(16)`
- `NameColumn` - required `name`, `VARCHAR(255)`
- `PathColumn` - required unique `path`, `VARCHAR(255)`
- `SlugColumn` - required unique `slug`, `VARCHAR(255)`
- `SortOrderColumn` - `sort_order`, `INT`, default `0`
- `TitleColumn` - required `title`, `VARCHAR(1024)`
- `VersionColumn` - `version`, `INT`, default `1`

`VersionColumn` is useful for optimistic locking. Increment it whenever a record is successfully updated, and compare the expected version in the update condition.

### System

System columns contain technical and file metadata:

- `ChecksumColumn` - optional `checksum`, `VARCHAR(128)`
- `FileSizeColumn` - optional `file_size`, `BIGINT`
- `FilenameColumn` - `filename`, `VARCHAR(255)`
- `FilepathColumn` - `filepath`, `VARCHAR(4096)`
- `IpAddressColumn` - `ip_address`, `VARCHAR(128)`
- `MimeTypeColumn` - optional `mime_type`, `VARCHAR(255)`
- `StorageKeyColumn` - required unique `storage_key`, `VARCHAR(512)`
- `UrlColumn` - `url`, `VARCHAR(2083)`
- `UrlTextColumn` - `url`, `TEXT`

Use `UrlTextColumn` when the database or application needs URLs longer than the bounded `UrlColumn` definition.

### User

- `EmailColumn` - required unique `email`, `VARCHAR(255)`
- `EmailVerifiedTimestampColumn` - nullable `email_verified_timestamp` timestamp
- `IsVerifiedColumn` - `is_verified`, `BOOL`, default `false`
- `LastLoginTimestampColumn` - nullable `last_login_timestamp` timestamp
- `PasswordColumn` - required `password`, `VARCHAR(128)`
- `PasswordUpdatedTimestampColumn` - nullable `password_updated_timestamp` timestamp
- `TempEmailColumn` - optional unique `temp_email`, `VARCHAR(255)`
- `UsernameColumn` - optional unique `username`, `VARCHAR(64)`

`PasswordColumn` stores a password value and should only be used for a properly hashed password, never for plaintext credentials.

## Overriding a column

Use a custom column definition when a field needs different constraints or semantics:

```typescript
{
    ...NameColumn,
    name: 'author_name',
}
```
