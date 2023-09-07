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

![mvp-erd-before-lists](https://github.com/dwyl/mvp/assets/194400/0936903f-97ed-4be3-9f70-54c5e138afcd)

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


## Create `lists` Schema

Create the `lists` table
with the following 
[`mix phx.gen.schema`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command:

```sh
mix phx.gen.schema Lista lista cid:string name:string person_id:integer seq:string sort:integer status:integer
```


This command will create the following migration:

[`20230416001029_create_lists.exs`](https://github.com/dwyl/mvp/blob/fa0b79eebbe582e3b24213a2c657d0fc343782c9/priv/repo/migrations/20230416001029_create_lists.exs)

```elixir
defmodule App.Repo.Migrations.CreateLists do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :cid, :string
      add :name, :string
      add :person_id, :integer
      add :seq, :string
      add :sort, :integer
      add :status, :integer

      timestamps()
    end
  end
end
```

Once we run `mix ecto.migrate`,
we have the following database
ERD:

![mvp-erd-with-lists](https://github.com/dwyl/mvp/assets/194400/02ad8f68-9b39-4d59-9a54-cfd7824e9bcf)

This new database table
lets us create a `list`
but there is still more work to be done
to enable the features we want.


## Quick Look at `/lib/app/list.ex` file

The `mix phx.gen.schema` command created the 
[`lib/app/list.ex`]()
file with the following:

```elixir
defmodule App.List do
  use Ecto.Schema
  import Ecto.Changeset

  schema "lists" do
    field :cid, :string
    field :name, :string
    field :person_id, :integer
    field :seq, :string
    filed :sort, :integer
    field :status, :integer

    timestamps()
  end

  @doc false
  def changeset(list, attrs) do
    list
    |> cast(attrs, [:cid, :name, :person_id, :seq, :sort, :status])
    |> validate_required([:name, :person_id])
    |> App.Cid.put_cid()
  end
end
```

The `schema` matches the `migration` above.
Just the 5 fields we need for creating `lists`:
1. `cid` - the universally unique `id` for the `list`.
2. `name` - the _name_ of the list. a `:string` of arbitrary length.
3. `person_id` - the `id` of the `person` who created the `list`
4. `seq` - the _sequence_ of `item.cid` for the `list`
5. `sort` - the sort order for the `list` e.g. 1: `Ascending`
6. `status` - the `status` (represented as an `Integer`) for the `list`. 
see: 
[dwyl/statuses](https://github.com/dwyl/statuses)

The only function in the `list.ex` file is `changeset/2`
which just checks the fields in teh `attrs` Map
and validates the data that are `required` to create a `list`.


<!--
## Preview 

By the end of this chapter we will have ...
-->


## Create `list_test.exs` Tests File (TDD)

The `gen.schema` command only creates the migration file
and the corresponding schema file in the 
[`lib/app`](https://github.com/dwyl/mvp/tree/main/lib/app) 
directory of our `Phoenix App`.
It does not create any `CRUD` functions or tests.
This is fine because _most_ of what we need is bespoke.


_Manually_ create the test file 
with the following path:
`test/app/list_test.exs`.

In the test file
`test/app/list_test.exs`
add the following test code: 

```elixir
defmodule App.ListTest do
  use App.DataCase, async: true
  alias App.{List}

  describe "list" do
    @valid_attrs %{name: "My List", person_id: 1, status: 2}
    @update_attrs %{name: "some updated text", person_id: 1}
    @invalid_attrs %{name: nil}

    test "get_list!/2 returns the list with given id" do
      {:ok, %{model: list, version: _version}} = List.create_list(@valid_attrs)
      assert List.get_list!(list.id).name == list.name
    end

    test "create_list/1 with valid data creates a list" do
      assert {:ok, %{model: list, version: _version}} =
               List.create_list(@valid_attrs)

      assert list.name == @valid_attrs.name
    end

    test "create_list/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = List.create_list(@invalid_attrs)
    end

    test "update_list/2 with valid data updates the list" do
      {:ok, %{model: list, version: _version}} = List.create_list(@valid_attrs)

      assert {:ok, %{model: list, version: _version}} =
               List.update_list(list, @update_attrs)

      assert list.name == "some updated text"
    end
  end
end
```

Once you've saved the file, 
run the tests with the following command:

```sh
mix test test/app/list_test.exs
```

You should see all four tests fail 
(because the functions they invoke do not yet exist):

```sh
1) test list create_list/1 with valid data creates a list (App.ListTest)
     test/app/list_test.exs:15
     ** (UndefinedFunctionError) function App.List.create_list/1 is undefined or private
     code: List.create_list(@valid_attrs)
     stacktrace:
       (app 1.0.0) App.List.create_list(%{status: 2, text: "My List", person_id: 1})
       test/app/list_test.exs:17: (test)

  2) test list create_list/1 with invalid data returns error changeset (App.ListTest)
     test/app/list_test.exs:24
     ** (UndefinedFunctionError) function App.List.create_list/1 is undefined or private
     code: assert {:error, %Ecto.Changeset{}} = List.create_list(@invalid_attrs)
     stacktrace:
       (app 1.0.0) App.List.create_list(%{text: nil})
       test/app/list_test.exs:25: (test)

  3) test list get_list!/2 returns the list with given id (App.ListTest)
     test/app/list_test.exs:10
     ** (UndefinedFunctionError) function App.List.create_list/1 is undefined or private
     code: {:ok, %{model: list, version: _version}} = List.create_list(@valid_attrs)
     stacktrace:
       (app 1.0.0) App.List.create_list(%{status: 2, text: "My List", person_id: 1})
       test/app/list_test.exs:11: (test)

  4) test list update_list/2 with valid data updates the list (App.ListTest)
     test/app/list_test.exs:28
     ** (UndefinedFunctionError) function App.List.create_list/1 is undefined or private
     code: {:ok, %{model: list, version: _version}} = List.create_list(@valid_attrs)
     stacktrace:
       (app 1.0.0) App.List.create_list(%{status: 2, text: "My List", person_id: 1})
       test/app/list_test.exs:29: (test)


Finished in 0.03 seconds (0.03s async, 0.00s sync)
4 tests, 4 failures

Randomized with seed 730787
```

This is _expected_. 
Let's create the required functions.


### Define the basic `lists` functions

In the 
`lib/app/list.ex`
file, 
add the following `aliases` near the top of the file:

```elixir
alias App.{Repo}
alias PaperTrail
alias __MODULE__
```

Next add the following functions:

```elixir
def create_list(attrs) do
  %List{}
  |> changeset(attrs)
  |> PaperTrail.insert()
end

def get_list!(id) do
  List
  |> Repo.get!(id)
end

def update_list(%List{} = list, attrs) do
  list
  |> List.changeset(attrs)
  |> PaperTrail.update()
end
```

The main functions to pay attention to 
in the newly created files are:
`App.List.create_list/1` 
that creates a new `list`
and
`App.List.update_list/2` 
which updates the `list`.
Both are simple and well-documented.

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

The `attrs` are just:
+ `name` the name/description of the list 
+ `person_id` the `id` of the `person` creating the list, and
+ `status` (optional) an `integer` representing the `status` of the `list`,
this is useful later when people have a `draft` or `archived` `list`. 

If you are new to the `PaperTrail` package 
and the benefits it offers,
we wrote a quick intro:
[dwyl/phoenix-papertrail-demo](https://github.com/dwyl/phoenix-papertrail-demo)

The gist is this: it gives us version history for records in our database
without any query overhead. 


## Get `lists` for a `person`

To display the `lists` 
that belong to a `person` 
we need a simple query.

### Test `get_lists_for_person/1`

Open the 
`test/app/list_test.exs`
file 
and add the following test:

```elixir
test "get_lists_for_person/1 returns the lists for the person_id" do
  person_id = 3
  lists_before = App.List.get_lists_for_person(person_id)
  assert length(lists_before) == 0

  # Create a couple of lists
  {:ok, %{model: all_list}} =
    %{name: "all", person_id: person_id, status: 2}
    |> App.List.create_list()

  {:ok, %{model: recipe_list}} =
    %{name: "recipes", person_id: person_id, status: 2}
    |> App.List.create_list()

  # Retrieve the lists for the person_id:
  lists_after = App.List.get_lists_for_person(person_id)
  assert length(lists_after) == 2
  assert Enum.member?(lists_after, all_list)
  assert Enum.member?(lists_after, recipe_list)
end
```

### Implment the `get_lists_for_person/1` function

In the `lib/app/list.ex` file,
implement the function 
as simply as possible:

```elixir
def get_lists_for_person(person_id) do
  List
  |> where(person_id: ^person_id)
  |> Repo.all()
end
```

For this function to work, 
replace the line:

```elixir
import Ecto.Changeset
```

With:

```elixir
import Ecto.{Changeset, Query}
```

i.e. we need to import the 
[`Ecto.Query`](https://hexdocs.pm/ecto/Ecto.Query.html)
module 
to gain access to the the 
[`where/3`](https://hexdocs.pm/ecto/Ecto.Query.html#where/3)
filtering function.

> **Note**: If you're rusty on `Ecto.Query`,
refresh your memory on: 
[elixirschool.com/ecto/querying_basics](https://elixirschool.com/en/lessons/ecto/querying_basics)
And if you get stuck, please just open an issue. 

Make sure the test is passing 
as we will be using this function next!



## Create the "All" `list` for a given `person_id`

In order to have sorting/reordering of `list_items`
(see next chapter)
we _first_ need to have a `list`!
Rather than forcing `people` 
to _manually_ create their "all" `list`
before they know what a `list` _is_,
it will be created for them _automatically_
when they first authenticate.


### Test `get_list_by_text!/2` 

In the 
`test/app/list_test.exs`
file,
create the following test:

```elixir
test "get_list_by_text!/2 returns the list for the person_id by text" do
  person_id = 4
  %{name: "All", person_id: person_id, status: 2}
    |> App.List.create_list()
  list = App.List.get_list_by_text!("all", person_id)
  assert list.text == "all"
end
```

### Define `get_list_by_text!/2` 

This is one is dead simple thanks to `Ecto` compact syntax:

```elixir
def get_list_by_text!(name, person_id) do
  Repo.get_by(List, name: name, person_id: person_id)
end
```

> **Note**: in future, we may need to use  
[`Repo.one/2`](https://hexdocs.pm/ecto/Ecto.Repo.html#c:one/2)
if we think there's a chance a `person` 
may have _multiple_ `lists` with `"all`" in the `list.name`. 



## Add _Existing_ `itmes` to the "All" `list`

One final function we need
in order to _retroactively_ add `lists`
to our `MVP` App that started out _without_ `lists`
is a function to add all the _existing_ `items`
to the newly created "All" `list`. 

### Test `add_all_items_to_all_list_for_person_id/1`

> **Note**: This is a _temporary_ function that we will `delete`
once all the _existing_ people using the `MVP`
have transitioned their `items` to the "All" `list`.
But we still need to have a _test_ for it!

Open 
`test/app/list_test.exs`
and add the following test:

```elixir
test "add_all_items_to_all_list_for_person_id/1 to seed the All list" do
  person_id = 0
  all_list = App.List.get_list_by_text!(person_id, "All")
  count_before = App.ListItem.next_position_on_list(all_list.id)
  assert count_before == 1

  item_ids = App.ListItem.get_items_on_all_list(person_id)
  assert length(item_ids) == 0

  App.ListItem.add_items_to_all_list(person_id)
  updated_item_ids = App.ListItem.get_items_on_all_list(person_id)
  assert length(updated_item_ids) ==
            length(App.Item.all_items_for_person(person_id))

  count_after = App.ListItem.next_position_on_list(all_list.id)
  assert count_before + length(updated_item_ids) == count_after
end
```

That's a very long test.
Take a moment to read it through.
Remember: this will be deleted,
it's just data migration code.


### Define `add_items_to_all_list/1`

In the 
`lib/app/list_item.ex`
file,
add the `add_items_to_all_list/1` function definition:

```elixir
def add_items_to_all_list(person_id) do
  all_list = App.List.get_list_by_text!(person_id, "All")
  all_items = App.Item.all_items_for_person(person_id)
  item_ids_in_all_list = get_items_on_all_list(person_id)

  all_items
  |> Enum.with_index()
  |> Enum.each(fn {item, index} ->
    unless Enum.member?(item_ids_in_all_list, item.id) do
      add_list_item(item, all_list, person_id, (index + 1) / 1)
    end
  end)
end
```