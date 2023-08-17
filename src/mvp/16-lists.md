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


## Create `lists` Schema

Create the `lists` table
with the following 
[`mix phx.gen.schema`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command:

```sh
mix phx.gen.schema List lists name:string person_id:integer status:integer
```




Those two commands will create the following migrations:

[`20230416001029_create_lists.exs`](https://github.com/dwyl/mvp/blob/fa0b79eebbe582e3b24213a2c657d0fc343782c9/priv/repo/migrations/20230416001029_create_lists.exs)

```elixir
defmodule App.Repo.Migrations.CreateLists do
  use Ecto.Migration

  def change do
    create table(:lists) do
      add :name, :string
      add :person_id, :integer
      add :status, :integer

      timestamps()
    end
  end
end
```

Once we run `mix ecto.migrate`,
we have the following database
ERD:

![mvp-erd-with-lists](https://github.com/dwyl/mvp/assets/194400/7efb0f30-077a-4fe3-84f1-41e187116cfe)

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
    field :name, :string
    field :person_id, :integer
    field :status, :integer

    timestamps()
  end

  @doc false
  def changeset(list, attrs) do
    list
    |> cast(attrs, [:name, :person_id, :status])
    |> validate_required([:name, :person_id])
  end
end
```

The `schema` matches the `migration` above.
Just the 3 fields we need for creating `lists`:
1. `name` - the _name_ of the list. a `:string` of arbitrary length.
2. `person_id` - the `id` of the `person` who created the `list`
3. `status` - the `status` (represented as an `Integer`) for the `list`. 
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

> **TODO**: hyperlink these two files, once they are merged into `main`.

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

## Create the "All" default `list`

In order to have sorting/reordering of `list_items`
(see below)
we _first_ need to have a `list`!
Rather than forcing `people` 
to _manually_ create their "All" `list`
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
  list = App.List.get_list_by_text!(person_id, "All")
  assert list.text == "All"
end
```

### Define `get_list_by_text!/2` 

This is one is dead simple thanks to `Ecto` compact syntax:

```elixir
def get_list_by_text!(person_id, text) do
  Repo.get_by(List, name: text, person_id: person_id)
end
```

> **Note**: we may need to use  
[`Repo.one/2`](https://hexdocs.pm/ecto/Ecto.Repo.html#c:one/2)
if we think there's a chance a `person` 
may have _multiple_ `lists` with `"All`" in the `list.text`. 

## Default `lists`

We want `people` to use our `App` 
for a wide variety of areas in their life+work.
Therefore we are creating several `default` `lists` 
for them when they first authenticate.
See: [dwyl/mvp#401](https://github.com/dwyl/mvp/issues/401)
for the discussion.

### Test creating "Default" `lists`

Let's write a quick test to
confirm that our `default lists` are created.

```elixir
test "create_default_lists/1 creates the default lists" do
  # Should have no lists:
  person_id = 3
  lists = App.List.get_lists_for_person(person_id)
  assert length(lists) == 0
  # Create the default lists for this person_id:
  assert List.create_default_lists(person_id) |> length() == 9
end
```

> **Note**: at present we have **9** `default lists`
This is just a _suggested_ collection of _generic_ `lists`. 
We could easily have fewer or more.
Please discuss! 
[dwyl/mvp#401](https://github.com/dwyl/mvp/issues/401)

### Define `create_default_lists/1`

```elixir
@default_lists ~w(All Goals Fitness Meals Recipes Reading Shopping Today Todo)

def create_default_lists(person_id) do
  # Check if the "All" list exists for the person_id
  lists = get_lists_for_person(person_id)
  # Extract just the list.text (name) from the person's lists:
  list_names = Enum.reduce(lists, [], fn l, acc -> [l.text | acc] end)
  # Quick check for length of lists:
  if length(list_names) < length(@default_lists) do
    create_list_if_not_exists(list_names, person_id)
    # Re-fetch the list of lists for the person_id
    get_lists_for_person(person_id)
  else
    # Return the list we got above
    lists
  end
end

@doc """
`create_list_if_not_exists/1` create the default "All" list
for the `person_id` if it does not already exist.
"""
def create_list_if_not_exists(list_names, person_id) do
  Enum.each(@default_lists, fn name ->
    # Create the list if it does not already exists
    unless Enum.member?(list_names, name) do
      %{name: name, person_id: person_id, status: 2}
      |> List.create_list()
    end
  end)
end
```

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


## Add _Existing_ `itmes` to the "All" `list`

One final function we need
in order to _retroactively_ add `lists`
to our `MVP` App that started out _without_ `lists`
is a function to add all the _existing_ `items`
to the newly created "All" `list`. 

### Test `add_items_to_all_list/1`

> **Note**: This is a _temporary_ function that we will `delete`
once all the _existing_ people using the `MVP`
have transitioned their `items` to the "All" `list`.
But we still need to have a _test_ for it!

Open 
`test/app/list_items_test.exs`
and add the following test:

```elixir
test "add_items_to_all_list/1 to seed the All list" do
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
