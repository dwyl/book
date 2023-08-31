# Use `cid` for _universally unique_ `ids`

By default all the tables 
in a `Phoenix` Application 
use an auto-incrementing `integer` (`Serial`) 
for the `id` (Primary Key).
e.g the `items` table:

![items-id-integer](https://github.com/dwyl/mvp/assets/194400/d3020e53-2ad8-43ff-b0ed-95251ee21a87)

This is fine for a _server_-side rendered app 
with a _single_ relational database instance.
i.e. the server/database controls the `id` of records.
But our ambition has always been 
to build a mobile + offline-first distributed App.

Luckily our friends at 
[Protocol Labs](https://github.com/ipfs)
creators of
[`IPFS`](https://github.com/dwyl/learn-ipfs)
have done some great groundwork on
["Decentralized Apps"](https://en.wikipedia.org/wiki/Decentralized_application)
so we can build on that.
We created an `Elixir` package 
that creates `IPFS` compliant
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

We can easily confirm the validity of this `cid`
by inputting it into CID Inspector:
[cid.ipfs.tech](https://cid.ipfs.tech)
e.g:
https://cid.ipfs.tech/#zb2rhn92tqTt41uFZ3hh3VPnssXjYCW4yDSX7KB39dXZyMtNC

![cid-inspector](https://github.com/dwyl/mvp/assets/194400/56ac8bdf-663a-4cb3-8ad3-f8bd4e9a4be3)


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


## Create `put_cid/1` test

Create a new file with the path:
`test/app/cid_test.exs`
and add the following test:

```elixir
defmodule App.CidTest do
  use App.DataCase, async: true

  @valid_attrs %{text: "Buy Bananas", person_id: 1, status: 2}

  test "put_cid/1 adds a `cid` for the `item` record" do
    # Create a changeset with a valid item record as the "changes":
    changeset_before = %{changes: @valid_attrs}
    # Should not yet have a cid:
    refute Map.has_key?(changeset_before.changes, :cid)

    # Confirm cid was added to the changes:
    changeset_with_cid = App.Cid.put_cid(changeset_before)
    assert changeset_with_cid.changes.cid == Cid.cid(@valid_attrs)

    # confirm idempotent:
    assert App.Cid.put_cid(changeset_with_cid) == changeset_with_cid
  end
end
```

Running this test will fail:

```sh
mix test test/app/cid_test.exs
```

E.g:
```sh
** (UndefinedFunctionError) function App.Cid.put_cid/1 is undefined or private.
```

Let's implement it!


## Create `put_cid/1` function

Create a new file with the path:
`lib/app/cid.ex`.
Add the following function definition to the file:

```elixir
defmodule App.Cid do
  def put_cid(changeset) do
    if Map.has_key?(changeset.changes, :cid) do
      changeset
    else
      cid = Cid.cid(changeset.changes)
      %{changeset | changes: Map.put(changeset.changes, :cid, cid)}
    end
  end
end
```

The function just adds a `cid` to the `changeset.changes`
so that it creates a hash of the contents of the changeset
and then adds the `cid` to identify that content. 
If the `changes` already have a `cid` don't do anything.
This covers the case where an `item` is created in the Mobile client
with a `cid`. We will add verification for this later. 


## Invoke `put_cid/1` in `Item.changeset/2`

In the 
`lib/app/item.ex`
file, locate the `changeset/2` function definition
and change the lines: 

```elixir
|> cast(attrs, [:person_id, :status, :text])
|> validate_required([:text, :person_id])
```

To: 

```elixir
|> cast(attrs, [:cid, :person_id, :status, :text])
|> validate_required([:text, :person_id])
|> App.Cid.put_cid()
```

The call to `put_cid/1` within `changeset/2`
adds the `cid` to the `item` record.


## Checkpoint: `item` table with `cid`

After running the migration:

```sh
mix ecto.migrate
```

The `item` table has the `cid` column:

![mvp-items-with-cid](https://github.com/dwyl/mvp/assets/194400/cadc5227-40f0-4462-9b32-6034c9a6c0d1)

Even though the `cid` field was added to the table,
it is _empty_ for all _existing_ `item` records. 
Easily resolved.

## Update all `item` records 

Add the following function to 
`lib/app/item.ex`:

```elixir
  def update_all_items_cid do
    items = list_items()
    Enum.each(items, fn i ->
      item = %{
        person_id: i.person_id,
        status: i.status,
        text: i.text,
        id: i.id,
      }
      i
      |> changeset(Map.put(item, :cid, Cid.cid(item)))
      |> Repo.update()
    end)
  end
end
```

Invoke it in the 
`priv/repo/seeds.exs`
so that all `items`
are given a `cid`. 

![mvp-items-with-cid-populated](https://github.com/dwyl/mvp/assets/194400/7291050e-4e63-4564-a661-bc848b5b2993)

With that working we can get back to _using_ this 
in our next feature; `lists`!