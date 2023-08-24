# Use `cid` for _universally unique_ `ids`

By default all the tables 
in a `Phoenix` Application 
use an auto-incrementing (`Serial`) 
for the `id` (Primary Key).
e.g the `items` table:

![items-id-integer](https://github.com/dwyl/mvp/assets/194400/d3020e53-2ad8-43ff-b0ed-95251ee21a87)

This is fine for a _server_-side rendered app 
with a _single_ relational database instance.
i.e. the server/database controls the id of records.
But our ambition has always been 
to build a mobile + offline-first distributed App.

Luckily our friends at 
[Protocol Labs](https://github.com/ipfs)
creators of
[`IPFS`](https://github.com/dwyl/learn-ipfs)
have done some great groundwork on the 
["Decentralized Apps"](https://en.wikipedia.org/wiki/Decentralized_application)
problem so we can build on that.
We have a little library that creates `IPFS` compliant
Content Identifiers: 
[`cid`](https://github.com/dwyl/cid)

The basic usage is:

```elixir
item = %{text: "Build PARA System App", person_id: 2, status: 2}
Cid.cid(item)
"zb2rhn92tqTt41uFZ3hh3VPnssXjYCW4yDSX7KB39dXZyMtNC"
```
This `cid` string is unique to this content
therefore creating it on the client (Mobile device)
will generate the _same_ `cid`
if the record is created _offline_.




## Add `excid` package to `deps`

Add the `excid` package to the `deps` in `mix.exs`:

```elixir
# Universally Unique Deterministic Content IDs: github.com/dwyl/cid
{:excid, "~> 1.0.1"},
```

Run:
```sh
mix deps.get
```

Then in `config/config.exs` add the following configuration line:
```elixir
config :excid, base: :base58
```

We want to use 
[`base58`](https://github.com/dwyl/base58#why-base58)
because it uses 17% fewer characters to represent the same `ID` 
when compared to `base32`.

```elixir
"bafkreihght5nbnmn6xbwoakmjyhkiu2naxmwpxgxbp6xkpbiweuetbohde"
|> String.length()
59
```
vs.

```elixir
"zb2rhn92tqTt41uFZ3hh3VPnssXjYCW4yDSX7KB39dXZyMtNC"
|> String.length()
49
```

## Create `migration`

Using the 
[`mix ecto.gen.migration`](https://hexdocs.pm/ecto_sql/Mix.Tasks.Ecto.Gen.Migration.html)
command, 
create a migration file:

```sh
mix ecto.gen.migration add_cid
```

You should see output similar to the following:

```sh
* creating priv/repo/migrations/20230824153220_add_cid.exs
```

This tells us that the migration file was created:
`priv/repo/migrations/20230824153220_add_cid_to_item.exs`
Open the file, you should see a blank migration:

```elixir
defmodule App.Repo.Migrations.AddCidToItem do
  use Ecto.Migration

  def change do

  end
end
```


Update it to:

```elixir
defmodule App.Repo.Migrations.AddCidToItem do
  use Ecto.Migration

  def change do
    alter table(:items) do
      add(:cid, :string)
    end
  end
end
```

> **Note**: if you're rusty on `migrations`,
see:
[devhints.io/phoenix-migrations](https://devhints.io/phoenix-migrations)

## Add `cid` field to `item` schema

Open the 
`lib/app/item.ex`
file and locate the `schema items do` section.
Add the line:

```elixir
field :cid, :string
```

## Add `:cid` to `changeset/2`

Still in the 
`lib/app/item.ex`
file, locate the `changeset/2` function definition
and change the line: 

```elixir
|> cast(attrs, [:person_id, :status, :text])
```

To: 

```elixir
|> cast(attrs, [:cid, :person_id, :status, :text])
```

