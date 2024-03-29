# SUPERCEDED by [dwyl/mvp#413](https://github.com/dwyl/mvp/issues/413)

# `list_items`

`list_items` allow us track which `items` are on a given `list`
and the `sequence` they are in.

## Create `list_items` Schema

Create the `list_items` table 
with the following
[`mix phx.gen.schema`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command:

```sh
mix phx.gen.schema ListItems list_items list_id:references:lists person_id:integer seq:string
```

That command will create the following migration:
[`20230416001045_create_list_items.exs`](https://github.com/dwyl/mvp/blob/54aff67d172ad372c5ee1ffd9c41f24b093b78d4/priv/repo/migrations/20230416001045_create_list_items.exs)

```elixir
defmodule App.Repo.Migrations.CreateListItems do
  use Ecto.Migration

  def change do
    create table(:list_items) do
      add :list_cid, references(:lists, on_delete: :nothing)
      add :person_id, :integer
      add :seq, :text

      timestamps()
    end 

    create index(:list_items, [:list_cid])
  end
end
```

Run `mix ecto.migrate`,
and you should see the following table:

And the **ERD**
will now look like this:

<img width="550" alt="dwyl-mvp-ERD-with-list_items" src="https://github.com/dwyl/mvp/assets/194400/c3255969-88d5-41b5-aa51-b4397f8e93f6">

As you can see from this **ERD**,
the `list_items` table 
is _not_ connected to the `items` table.
This is deliberate; not a "mistake"
from a database design perspective.
We don't _need_ the `foreign key` relationship
to achieve our desired result.
We can still write the query we want to select the `items`.

> **Note**: we briefly considered using an `{:array, integer}` 
for storing the `squence` of `item.ids` 
which are _currently_ `Integers` 
because `Postgres` defaults to using a `SERIAL` for table Ids.
`SERIAL` is an auto-incrementing `Integer`; e.g: 1, 2, 3, etc.
_However_ we want our `App` to be offline-first
which means that the `item.id` _cannot_ be an `Integer`
if we want to avoid conflicts. 

## Crete `test/app/list_items_test.exs` file

As previously noted, the
`mix phx.gen.schema` command
does _not_ create any `CRUD` functions 
or the corresponding `test` file
for the `schema`.
In our case that's OK,
because we want to write a few bespoke functions.

Create the file with the path:
`test/app/list_items_test.exs` 
and add the following test code to it:

```elixir

```


## `add_list_item/4`

`add_list_item/4` as you would expect,
adds an `item` to a `list` for the given `person_id`

```elixir
def add_list_item(item, list, person_id, position) do
  %ListItem{
    item: item,
    list: list,
    person_id: person_id,
    position: position
  }
  |> changeset()
  |> Repo.insert()
end
```

The first 3 arguments are self-explanatory;
the final one, `position` is there to help us _order_ the `list`!
As you may have noticed in the `mix gen.schema` command above
for the `list_items` table, the `position` field is a `Float`. 
e.g: `1.0`. 
We have very deliberately chosen a `Float` not an `Integer`
so that we can use this for easy append-only positional sorting. 
More on this later in the "Reordering" chapter. 
But if you want to see the discussion/history 
of how we arrived at this,
see: 
[dwyl/mvp#145](https://github.com/dwyl/mvp/issues/145#issuecomment-1492132575)






## Get the `list_item.position` for an `item` on a given `list`

If we're going to be altering the `position` of `items` in a `list`,
one of the helper functions we're going to need
is the ability to retrieve the _current_ `position` of `item` on that `list`.

### Test `get_list_item_position/2`

In the
`test/app/list_items_test.exs`
file,
add the following test:

```elixir
@valid_attrs %{name: "Go Surfing", person_id: 0, status: 2}
test "get_list_item_position/2 retrieves the position of an item in a list" do
  {:ok, %{model: item, version: _version}} =
      Item.create_item(@valid_attrs)
  {:ok, li1} = App.ListItem.add_item_to_all_list(item)
  assert li1.position == 1.0

  # Note: this conversion from Int to Binary is to simulate the
  # binary that the LiveView sends to this function ...
  item_id = Integer.to_string(item.id)
  pos = App.ListItem.get_list_item_position(item_id, li1.list_id)

  assert li1.position == pos
end
```

### Define `get_list_item_position/2`

In the 
`lib/app/list_item.ex`
file,
add the following defintion for 
`get_list_item_position/2`:

```elixir
def get_list_item_position(item_id, list_id) do
  item_id =
    if Useful.typeof(item_id) == "binary" do
      {int, _} = Integer.parse(item_id)
      int
    else
      item_id
    end

  sql = """
  SELECT li.position FROM list_items li
  WHERE li.item_id = $1 AND li.list_id = $2
  ORDER BY li.inserted_at DESC LIMIT 1
  """

  result = Ecto.Adapters.SQL.query!(Repo, sql, [item_id, list_id])
  result.rows |> List.first() |> List.first()
end
```

We wrote this using `SQL` because it's easier to debug.
If `Ecto` had a `Repo.last` function, I would use that instead.
If you want to help with refactoring this,
[stackoverflow.com/questions/32653391/select-latest-entry-ecto-phoenix](https://stackoverflow.com/questions/32653391/how-to-select-the-latest-entry-from-database-with-ecto-phoenix)
looks like a good starting point. 💭