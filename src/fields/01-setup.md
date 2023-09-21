# New `Phoenix` Project Setup

These are the steps we took when creating
the `fields-demo` `Phoenix` project.
You can follow along at your own pace.
And/or use them as the basis for your own App(s).

If you feel we have skipped a step
or anything is unclear,
please 
[open an issue](https://github.com/dwyl/fields-demo/issues).


## 1. Create a New Phoenix App

Create a New Phoenix App:

```sh
mix phx.new fields_demo --no-mailer --no-dashboard --no-gettext
```

> **Note**: We don't need to send email, 
> have a fancy dashboard or translation in this `demo`.
> All these _advanced_ features are covered later.


## 2. Setup Coverage

So that we know which files are covered by tests,
we setup coverage following the steps outlined in:
[/dwyl/phoenix-chat-example#13-what-is-not-tested](https://github.com/dwyl/phoenix-chat-example#13-what-is-not-tested)

<!-- Q: should we add all the steps here
to avoid sending people somewhere else...? -->

> **Note**: This is the _first_ thing 
> we add to all new `Elixir/Phoenix` projects
because it lets us see what is _not_ being tested. 🙈
It's just a good engineering discipline/habit to get done; a 
[hygiene factor](https://en.wikipedia.org/wiki/Two-factor_theory)
like brushing your teeth. 🪥

With that setup we can now run:

```sh
mix c
```

We see output similar to the following:

```sh
.....
Finished in 0.07 seconds (0.03s async, 0.04s sync)
5 tests, 0 failures

Randomized with seed 679880
----------------
COV    FILE                                        LINES RELEVANT   MISSED
  0.0% lib/fields_demo.ex                              9        0        0
 75.0% lib/fields_demo/application.ex                 36        4        1
  0.0% lib/fields_demo/repo.ex                         5        0        0
100.0% lib/fields_demo_web.ex                        111        2        0
 15.9% lib/fields_demo_web/components/core_comp      661      151      127
  0.0% lib/fields_demo_web/components/layouts.e        5        0        0
100.0% lib/fields_demo_web/controllers/error_ht       19        1        0
100.0% lib/fields_demo_web/controllers/error_js       15        1        0
100.0% lib/fields_demo_web/controllers/page_con        9        1        0
  0.0% lib/fields_demo_web/controllers/page_htm        5        0        0
  0.0% lib/fields_demo_web/endpoint.ex                47        0        0
 66.7% lib/fields_demo_web/router.ex                  27        3        1
 80.0% lib/fields_demo_web/telemetry.ex               92        5        1
100.0% test/support/conn_case.ex                      38        2        0
 28.6% test/support/data_case.ex                      58        7        5
[TOTAL]  23.7%
----------------
```

Not great. 
But most of the untested code is in:
`lib/fields_demo_web/components/core_components.ex`
which has `661` lines 
and we aren't going to _use_ in this project ...

### 2.1 Ignore Unused "System" Files

Create a file with called `coveralls.json`
and add the following contents:

```json
{
  "coverage_options": {
    "minimum_coverage": 100
  },
  "skip_files": [
    "lib/fields_demo/application.ex",
    "lib/fields_demo_web/components/core_components.ex",
    "lib/fields_demo_web/telemetry.ex",
    "test/"
  ]
}
```
Save the file.
This sets **`100%`** coverage as our minimum/baseline
and ignores the files we aren't reaching with our tests.

Re-run:

```sh
mix c
```

And you should see the following output:

```sh
.....
Finished in 0.05 seconds (0.01s async, 0.04s sync)
5 tests, 0 failures

Randomized with seed 253715
----------------
COV    FILE                                        LINES RELEVANT   MISSED
100.0% lib/fields_demo.ex                              9        0        0
100.0% lib/fields_demo/repo.ex                         5        0        0
100.0% lib/fields_demo_web.ex                        111        2        0
100.0% lib/fields_demo_web/components/layouts.e        5        0        0
100.0% lib/fields_demo_web/controllers/error_ht       19        1        0
100.0% lib/fields_demo_web/controllers/error_js       15        1        0
100.0% lib/fields_demo_web/controllers/page_con        9        1        0
100.0% lib/fields_demo_web/controllers/page_htm        5        0        0
100.0% lib/fields_demo_web/endpoint.ex                47        0        0
100.0% lib/fields_demo_web/router.ex                  23        2        0
[TOTAL] 100.0%
----------------
```

Now we can move on!

## 3. Run the Phoenix App!

Before we start adding features,
let's run the default `Phoenix` App.
In your terminal, run:

```sh
mix setup
mix phx.server
```

> **Note**: we always create an alias for `mix phx.server` as `mix s`.

With the `Phoenix` server running,
visit 
[localhost:4000](http://localhost:4000)
in your web browser,
you should see something similar to the following:

<img width="796" alt="image" src="https://github.com/dwyl/fields/assets/194400/891e890e-c94a-402e-baee-ee47fd3725a7">

That completes 2 minutes of "setup".
Let's add a schema!