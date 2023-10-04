# Create `object` schema

As outlined in 
[tidy#1](https://github.com/dwyl/tidy/issues/1),
our goal is to allow `people`
wanting to help `tidy` the house,
to submit the following data:

## `object`

+ `name` - the name of the `object` you need help with
+ `desc` - brief description of the `object` 
    including any salient features.
+ `color` - a `string` for main color of the `object` e.g. "green"
+ `person_id` - the `id` of the `person` who created the `object` record.
+  `owner_id` - `id` of the `person` who _owns_ the `object`
+ `location` - a `string` describing _where_ the `object` belongs.
+ `status` - a `int` representing the current `status` of the `object` record. 

> **Note**: we will need to map out the `statuses` required for this App and add them to our list. 


## `images`

An `object` can have one or more `images`.
These are used identify and categorize the `object`. 

+ `obj_id` - the `id` of the `object` the `image` belongs to.
+ `person_id` - `id` of the `person` who uploaded the `image`.
+ `url` - the `URL` of the `image` that was uploaded to 
[`S3`](https://github.com/dwyl/imgup/issues/98)


## `comments`

An `object` can have one ore more `comments` associated with it.
This allows `people` to discuss the `object` in a conversational style
similar to what they are already used to 
from using **Instant Messaging**. 

+ `obj_id` - the `id` of the `object` the `comment` belongs to.
+ `person_id` - `id` of the `person` commenter.
+ `text` - the `string` of their comment. 


## Create `Object` Schema

Using the 
[`mix phx.gen.live`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command, 
we can create the `object` schema and `LiveView` pages,
run: 

```sh
mix phx.gen.live Objects Object objects name:binary desc:binary color:binary person_id:integer owner_id:integer location:binary status:integer
```

You should expect to see output similar to the following:

```sh
* creating lib/tidy_web/live/object_live/show.ex
* creating lib/tidy_web/live/object_live/index.ex
* creating lib/tidy_web/live/object_live/form_component.ex
* creating lib/tidy_web/live/object_live/index.html.heex
* creating lib/tidy_web/live/object_live/show.html.heex
* creating test/tidy_web/live/object_live_test.exs
* creating lib/tidy/objects/object.ex
* creating priv/repo/migrations/20231004034411_create_objects.exs
* creating lib/tidy/objects.ex
* injecting lib/tidy/objects.ex
* creating test/tidy/objects_test.exs
* injecting test/tidy/objects_test.exs
* creating test/support/fixtures/objects_fixtures.ex
* injecting test/support/fixtures/objects_fixtures.ex

Add the live routes to your browser scope in lib/tidy_web/router.ex:

    live "/objects", ObjectLive.Index, :index
    live "/objects/new", ObjectLive.Index, :new
    live "/objects/:id/edit", ObjectLive.Index, :edit

    live "/objects/:id", ObjectLive.Show, :show
    live "/objects/:id/show/edit", ObjectLive.Show, :edit


Remember to update your repository by running migrations:

    $ mix ecto.migrate
```

Those are a _lot_ of new files. 😬
We will go through each file 
in the next page
and update as needed.
For now we need to follow the instructions
and add the new routes to the `router.ex`.



With the new lines added
e.g: 
[router.ex](https://github.com/dwyl/tidy/commit/a608de3481db2fa52c4fbb60708627b4c5a11a5d)


If we re-run the tests with coverage checking:

```sh
mix c
```

We see the following output:

```sh
...................
Finished in 0.2 seconds (0.08s async, 0.1s sync)
19 tests, 0 failures

Randomized with seed 121378
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/tidy.ex                                     9        0        0
100.0% lib/tidy/objects.ex                           104        6        0
100.0% lib/tidy/objects/object.ex                     23        2        0
100.0% lib/tidy/repo.ex                                5        0        0
100.0% lib/tidy_web.ex                               111        2        0
100.0% lib/tidy_web/components/layouts.ex              5        0        0
100.0% lib/tidy_web/controllers/error_html.ex         19        1        0
100.0% lib/tidy_web/controllers/error_json.ex         15        1        0
100.0% lib/tidy_web/controllers/page_controller        9        1        0
100.0% lib/tidy_web/controllers/page_html.ex           5        0        0
100.0% lib/tidy_web/endpoint.ex                       47        0        0
 94.1% lib/tidy_web/live/object_live/form_compo       96       34        2
100.0% lib/tidy_web/live/object_live/index.ex         47       10        0
100.0% lib/tidy_web/live/object_live/show.ex          21        5        0
100.0% lib/tidy_web/router.ex                         35        7        0
[TOTAL]  97.1%
----------------
Generating report...
Saved to: cover/
FAILED: Expected minimum coverage of 100%, got 97.1%.
```

The `lib/tidy_web/live/object_live/form_component.ex` has a few lines that are not reached by the default tests:
<img alt="objects-coverage" src="https://github.com/dwyl/tidy/assets/194400/29043b65-b26a-40c6-beb8-a175e06325be">

Both of these functions are `defp` i.e. "private".
So we cannot simply _invoke_ them in a unit test
to exercise the error handling.

We have several options for dealing with these untested lines:
1. Ignore them - the easiest
2. Convert them from `defp` to `def` and test (invoke) them directly 
3. Construct elaborate tests with bad data to trigger the errors ...

In _our_ case we _know_ that we won't be using these functions
when we build our custom interface,
so we're just going to ignore the untested lines, for now.

E.g: [`lib/tidy_web/live/object_live/form_component.ex`](https://github.com/dwyl/tidy/commit/2a6cc7eb66a5566168b2506d0bd6769efe2ff7d3#diff-eed745b6b53040c9f58bc13815bdb4ad58af47337ac3c4f9d5cde36b09bc093f)
Ref: https://github.com/dwyl/tidy/issues/1#issuecomment-1746155577
