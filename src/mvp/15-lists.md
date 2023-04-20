# Lists

Our **MVP `App`** already has 
much of the basic functionality we need/want 
but it's lacking a way to organize
`items` into distinct projects/areas.
Let's fix that by introducing `lists`!

## Quick Recap

Up till this point we've _deliberately_ kept the `MVP`
as lean as possible to avoid complexity. <br />
The 
[Entity Relationship Diagram](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
(ERD) is currently just:

![mvp-erd-before-lists](https://user-images.githubusercontent.com/194400/233317695-3e036f1f-db13-4697-aa49-fe767a86a773.png)

Just the handful of tables
you've already seen in the previous sections.

Our reasons for adding `lists` _now_ are: <br />
**a)** Separate `lists` 
for different areas of life/work 
is on our 
[product roadmap](https://github.com/dwyl/product-roadmap). 
_specifically_:
[dwyl/app/**issues/271**](https://github.com/dwyl/app/issues/271)
<br />
**b)** We want to use `lists` 
as the basis for organizing 
and 
[re-ordering `items`](https://github.com/dwyl/mvp/issues/145). <br />
**c)** `lists` will unlock other functionality we have planned
that will make the `App` more _useful_.


## Create `Lists` Schema

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

The `gen.schema` command only creates the migration files
and the corresponding schema in the 
[`lib/app`](https://github.com/dwyl/mvp/tree/main/lib/app) 
directory of our `Phoenix App`.
It does not create any `CRUD` functions or tests.
This is fine because _most_ of what we need is bespoke.

We _manually_ created the following files:

+ test/app/list_test.exs
+ test/app/list_items_test.exs

> **TODO**: hyperlink these two files, once they are merged into `main`.

