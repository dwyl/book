## Create `list_items` Schemas

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
      add :list_id, references(:lists, on_delete: :nothing)
      add :person_id, :integer
      add :seq, :string

      timestamps()
    end

    create index(:list_items, [:list_id])
  end
end
```

Run `mix ecto.migrate`,
and you should see the following table:

And the ERD
will now look like this:


# TODO: Insert ERD after `list_items`



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
does not create any `CRUD` functions 
or the corresponding `test` file
for the `schema`.

Create the file with the path:
`test/app/list_items_test.exs` 
and add the following code to it:

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

