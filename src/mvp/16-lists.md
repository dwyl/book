# Lists

Our **MVP `App`** already has 
much of the basic functionality we need/want 
but it's sorely lacking 
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
[**`mix phx.gen.schema`**](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
commands:

```sh
mix phx.gen.schema List lists person_id:integer status:integer text:string
mix phx.gen.schema ListItems list_items item_id:references:items list_id:references:lists person_id:integer position:float
```

Once we run `mix ecto.migrate`,
we have the following database
ERD:

![mvp-erd-with-lists-and-list_items](https://user-images.githubusercontent.com/194400/233316755-96fb001d-ac16-4cad-99b0-b562c0128c1f.png)

These two new database tables
are everything we need 
to build the `lists` features. 🎉

## Create Tests (TDD)

The `gen.schema` command only creates the migration files
and the corresponding schema in the 
[`lib/app`](https://github.com/dwyl/mvp/tree/main/lib/app) 
directory of our `Phoenix App`.
It does not create any `CRUD` functions or tests.
This is fine because _most_ of what we need is bespoke.

We _manually_ created the following test files:

+ test/app/list_test.exs
+ test/app/list_items_test.exs

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

If you are new to the `PaperTrail` package and the benefits it offers,
we wrote a quick intro:
[dwyl/phoenix-papertrail-demo](https://github.com/dwyl/phoenix-papertrail-demo)

The gist is this: it gives us version history for records in our database
without significant query overhead. 

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
e.g: `1.0` 
We have very deliberately chosen a `Float` not an `Integer`
so that we can use this for easy append-only positional sorting. 
More on this later in the "Reordering" chapter. 
But if you want to see the discussion/history 
of how we arrived at this,
see: 
[dwyl/mvp#145](https://github.com/dwyl/mvp/issues/145#issuecomment-1492132575)






```sql
-- SELECT i.id, i.person_id, i.text AS item_text, l.text as list_text, li.list_id, li.position
SELECT i.id
FROM items i
LEFT JOIN list_items li
ON i.id = li.item_id
LEFT JOIN lists l
ON li.list_id = l.id
WHERE i.person_id = 0
AND l.text != 'All'
-- GROUP BY i.id
ORDER BY i.id DESC

```

```sql
SELECT i.id, i.text as item_text, li.id as lid, 
FROM list_items li
JOIN items i 
ON i.id = li.item_id
```

```sql
SELECT i.id, i.text as item_text, li.id as lid, li.list_id, l.text AS list_text
FROM list_items li
JOIN lists l
ON li.list_id = l.id
JOIN items i 
ON i.id = li.item_id
AND l.text NOT LIKE 'All'
AND i.text NOT NULL
```

```sql
SELECT i.id, i.text as item_text
FROM items i
INNER JOIN list_items li ON i.id = li.item_id
```

```sql
SELECT i.id, i.text as item_text--, li.list_id, l.text as list_text
FROM items i
-- JOIN list_items li ON i.id = li.item_id
-- JOIN lists l ON li.list_id = l.id
WHERE i.person_id = 2
-- AND l.text NOT IN ('All')
AND i.text IS NOT NULL
ORDER BY i.id DESC
```

```sql
SELECT li.item_id, i.text as item_text, li.list_id, l.text as list_text
FROM items i
JOIN list_items li ON i.id = li.item_id
JOIN lists l ON li.list_id = l.id
WHERE i.person_id = 2
AND l.text = 'All'
-- AND l.text NOT IN ('All')
AND i.text IS NOT NULL
ORDER BY i.id DESC
```

```sql
-- Sub-query to get around SQL grouping constraints:
SELECT i.id, i.text, i.status, i.person_id, li.position, t.start, t.stop, t.id as timer_id
FROM (
  SELECT DISTINCT ON (li.item_id, li.list_id) *
  FROM list_items li 
  WHERE li.person_id = 2
) li
JOIN items i ON li.list_id = i.id
LEFT JOIN timers as t ON t.item_id = i.id
```

Working:
```sql
SELECT li.item_id, i.text, i.status, i.person_id, li.position, t.start, t.stop, t.id as timer_id, li.list_id
FROM (
  SELECT DISTINCT ON (li.item_id, li.list_id) *
  FROM list_items li 
  WHERE li.person_id = 2
) li
JOIN items i ON li.list_id = i.id
LEFT JOIN timers as t ON t.item_id = i.id
```

```sql
SELECT id, list_id, item_id, count(*)
FROM list_items
-- WHERE person_id=2
GROUP BY list_id, item_id
```

```sql
SELECT list_id, item_id, COUNT(*)
FROM list_items
GROUP BY list_id, item_id
```