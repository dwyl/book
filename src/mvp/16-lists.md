# Lists

Our **MVP App** already has 
much of the basic functionality we need/want 
but is sorely lacking 
a way to **_organize_ `items`** 
into distinct projects/areas.
Let's fix that by introducing `lists`!

## Quick Recap

Up till this point we've _deliberately_ kept the `MVP`
as lean as possible to avoid complexity. <br />
The 
[Entity Relationship Diagram](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
(ERD) is currently:

![mvp-erd-before-lists](https://user-images.githubusercontent.com/194400/233317695-3e036f1f-db13-4697-aa49-fe767a86a773.png)

Just the four tables
you've already seen 
in the previous sections.

Our reasons for adding `lists` _now_ are: <br />    

**a)** Separate `lists` 
for different areas of life/work 
have been on our 
[product roadmap](https://github.com/dwyl/product-roadmap) for a while ... <br />
_specifically_:
[dwyl/app#**271**](https://github.com/dwyl/app/issues/271)
<br />

**b)** We want to use `lists` 
as the basis for organizing 
and 
[**re-ordering `items`**](https://github.com/dwyl/mvp/issues/145). <br />

**c)** `lists` will unlock other functionality we have planned
that will make the `App` more _useful_ both to individuals and teams.


## Create `lists` and `list_items` Schemas

Create the `lists` and `list_items` tables
with the following 
[`mix phx.gen.schema`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
commands:

```sh
mix phx.gen.schema List lists person_id:integer status:integer text:string
mix phx.gen.schema ListItems list_items item_id:references:items list_id:references:lists person_id:integer position:float
```

Those two commands will create the following migrations:

[`20230416001029_create_lists.exs`](https://github.com/dwyl/mvp/blob/fa0b79eebbe582e3b24213a2c657d0fc343782c9/priv/repo/migrations/20230416001029_create_lists.exs)

```elixir
defmodule App.Repo.Migrations.CreateLists do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :text, :string
      add :person_id, :integer
      add :status, :integer

      timestamps()
    end
  end
end
```

[`20230416001045_create_list_items.exs`](https://github.com/dwyl/mvp/blob/54aff67d172ad372c5ee1ffd9c41f24b093b78d4/priv/repo/migrations/20230416001045_create_list_items.exs)

```elixir
defmodule App.Repo.Migrations.CreateListItems do
  use Ecto.Migration

  def change do
    create table(:list_items) do
      add :person_id, :integer
      add :position, :float
      add :item_id, references(:items, on_delete: :nothing)
      add :list_id, references(:lists, on_delete: :nothing)

      timestamps()
    end

    create index(:list_items, [:item_id])
    create index(:list_items, [:list_id])
  end
end
```

The Database tables these migrations create 
are very simple.


Once we run `mix ecto.migrate`,
we have the following database
ERD:

![mvp-erd-with-lists-and-list_items](https://user-images.githubusercontent.com/194400/233316755-96fb001d-ac16-4cad-99b0-b562c0128c1f.png)

These two new database tables
are everything we need 
to build the `lists` features. 🎉

## Create Tests (TDD)

The `gen.schema` command only creates the migration files
and the corresponding schema files in the 
[`lib/app`](https://github.com/dwyl/mvp/tree/main/lib/app) 
directory of our `Phoenix App`.
It does not create any `CRUD` functions or tests.
This is fine because _most_ of what we need is bespoke.

We _manually_ created the following test files:

+ test/app/list_test.exs
+ test/app/list_items_test.exs

Inside the test files we have all the tests necessary 
to build the _baseline_ `lists` features. 
e.g:

```elixir

```

> **TODO**: hyperlink these two files, once they are merged into `main`.

Rather than _duplicating_ large blocks of test code here,
we refer readers to the source (hyperlinked above).
The tests were written in the order they appear in the files
and the corresponding functions to make the tests pass
were created as needed.
Thus ensuring we only have code that is required
to deliver the features.

The main functions to pay attention to 
in the newly created files are:
`create_list/1` 
that creates a new `list`
and
`add_list_item/4` 
which adds an `item` to a `list`.
Both are dead simple and well-documented.

### `create_list/1`

`create_list/1` receives a `Map` of `attrs` (attributes)
which it validates using `changeset/2` function
and then inserts into the `lists` table
via the `PaperTrail.insert()` function:

```elixir
def create_list(attrs) do
  %List{}
  |> changeset(attrs)
  |> PaperTrail.insert()
end
```

The `attrs` are just
`person_id` the `id` of the `person` creating the list, 
`text` the name/description of the list 
and `status` (optional).

If you are new to the `PaperTrail` package and the benefits it offers,
we wrote a quick intro:
[dwyl/phoenix-papertrail-demo](https://github.com/dwyl/phoenix-papertrail-demo)

The gist is this: it gives us version history for records in our database
without any query overhead. 

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




