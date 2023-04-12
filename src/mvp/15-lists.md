# Lists

Our **MVP `App`** already has 
much of the basic functionality we need/want 
but it's lacking a way to organize
`items` into distinct projects/areas.
Let's fix that by introducing `lists`!

## Quick Recap

Until this point we've _deliberately_ kept the `MVP`
as lean as possible to avoid complexity.
The ERD is currently just:

![erd-before-lists](https://user-images.githubusercontent.com/194400/231414683-6fce1fd8-aead-471d-8789-a4a0111f7ce8.png)

Just the handful of tables
you've already seen in the previous sections.

Our reasons for adding `lists` now are:
**a)** Separate `lists` for different areas of life/work is on our 
[product roadmap](https://github.com/dwyl/product-roadmap). <br />
**b)** We want to use `lists` as the basis for organising and 
[re-ordering `items`](https://github.com/dwyl/mvp/issues/145). <br />
**c)** `lists` will unlock other functionalty we have planned
that will make the `App` more _useful_.


## Create `Lists` Schema

Create the `lists` and `list_items` database schemas
with the following 
[**`mix phx.gen.schema`**](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
commands:

```sh
mix phx.gen.schema List lists person_id:integer status:integer text:string person_id:integer
mix phx.gen.schema ListItems list_items item_id:references:items list_id:references:lists position:integer person_id:integer
```


At the end of this step,
we have the following database
[Entity Relationship Diagram](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
(ERD):

![mvp-erd-list_items](here)
