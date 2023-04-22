# Generate Auth Files

In `auth v1` the 
[`mix phx.gen.auth`](https://github.com/phoenixframework/phoenix/blob/v1.7.1/guides/authentication/mix_phx_gen_auth.md#L1) 
generator 
[didn't exist](https://github.com/dwyl/auth/issues/207)
so we had to hand-write all the code. 
For `auth v2`  
we are using the `phx.gen.auth` "generator" 
to provide some of the scaffolding
and session management.
see:
[hexdocs.pm/phoenix/mix_phx_gen_auth](https://hexdocs.pm/phoenix/mix_phx_gen_auth.html)

In your terminal, run th following command: 

```sh
mix phx.gen.auth Accounts Person people
```

The generator prompts with the following question:

```sh
An authentication system can be created in two different ways:
- Using Phoenix.LiveView (default)
- Using Phoenix.Controller only
Do you want to create a LiveView based authentication system? [Yn]
```

We answered `N` (No) 
because we will be adding more advanced `auth` 

```sh
* creating priv/repo/migrations/20230226095715_create_people_auth_tables.exs
* creating lib/auth/accounts/person_notifier.ex
* creating lib/auth/accounts/person.ex
* creating lib/auth/accounts/person_token.ex
* creating lib/auth_web/person_auth.ex
* creating test/auth_web/person_auth_test.exs
* creating lib/auth_web/controllers/person_session_controller.ex
* creating test/auth_web/controllers/person_session_controller_test.exs
* creating lib/auth_web/controllers/person_confirmation_html.ex
* creating lib/auth_web/controllers/person_confirmation_html/new.html.heex
* creating lib/auth_web/controllers/person_confirmation_html/edit.html.heex
* creating lib/auth_web/controllers/person_confirmation_controller.ex
* creating test/auth_web/controllers/person_confirmation_controller_test.exs
* creating lib/auth_web/controllers/person_registration_html/new.html.heex
* creating lib/auth_web/controllers/person_registration_controller.ex
* creating test/auth_web/controllers/person_registration_controller_test.exs
* creating lib/auth_web/controllers/person_registration_html.ex
* creating lib/auth_web/controllers/person_reset_password_html.ex
* creating lib/auth_web/controllers/person_reset_password_controller.ex
* creating test/auth_web/controllers/person_reset_password_controller_test.exs
* creating lib/auth_web/controllers/person_reset_password_html/edit.html.heex
* creating lib/auth_web/controllers/person_reset_password_html/new.html.heex
* creating lib/auth_web/controllers/person_session_html.ex
* creating lib/auth_web/controllers/person_session_html/new.html.heex
* creating lib/auth_web/controllers/person_settings_html.ex
* creating lib/auth_web/controllers/person_settings_controller.ex
* creating lib/auth_web/controllers/person_settings_html/edit.html.heex
* creating test/auth_web/controllers/person_settings_controller_test.exs
* creating lib/auth/accounts.ex
* injecting lib/auth/accounts.ex
* creating test/auth/accounts_test.exs
* injecting test/auth/accounts_test.exs
* creating test/support/fixtures/accounts_fixtures.ex
* injecting test/support/fixtures/accounts_fixtures.ex
* injecting test/support/conn_case.ex
* injecting config/test.exs
* injecting mix.exs
* injecting lib/auth_web/router.ex
* injecting lib/auth_web/router.ex - imports
* injecting lib/auth_web/router.ex - plug
* injecting lib/auth_web/components/layouts/root.html.heex

Please re-fetch your dependencies with the following command:

    $ mix deps.get

Remember to update your repository by running migrations:

    $ mix ecto.migrate

Once you are ready, visit "/people/register"
to create your account and then access "/dev/mailbox" to
see the account confirmation email.
```

That's a _lot_ of code. 
See the `git` commit:
[`90086a8`](https://github.com/dwyl/auth/commit/90086a83c6968573f7d4c72b3882a247ac30112d).
We will use the session management 
in our `auth` system
and `delete` some of the unused code along the way. 


## Migrate the Schema

When you run:

```sh
mix ecto.migrate
```

You will see the following output:

```sh
Generated auth app

15:04:11.168 [info] == Running 20230226095715 Auth.Repo.Migrations.CreatePeopleAuthTables.change/0 forward

15:04:11.173 [info] execute "CREATE EXTENSION IF NOT EXISTS citext"

15:04:11.285 [info] create table people

15:04:11.296 [info] create index people_email_index

15:04:11.297 [info] create table people_tokens

15:04:11.302 [info] create index people_tokens_person_id_index

15:04:11.307 [info] create index people_tokens_context_token_index

15:04:11.310 [info] == Migrated 20230226095715 in 0.1s
```

## Schema

Let's take a quick look
at the created database tables.

If you open the `auth_dev` 
database in your Postgres GUI,
e.g:
[`DBEaver`](https://github.com/dwyl/learn-postgresql/issues/43) <br />
and view the 
[ERD](https://en.wikipedia.org/wiki/Entity%E2%80%93relationship_model)
there are only two tables:

![mix-phx-gen-auth-erd](https://user-images.githubusercontent.com/194400/223881258-be77ebdc-0114-4606-aac1-065f172b6727.png)


### Data in `people` and `people_tokens` tables

By default,
`mix phx.gen.auth` 
does not setup any _protection_ 
for personal data in the database.
Email addresses are stored in-the-clear: 🙄 

![mix-phx-gen-auth-people-table-email-plaintext](https://user-images.githubusercontent.com/194400/223880353-98597d83-cb9c-424d-bcb0-2121ecd743c0.png)

Similarly the `people_tokens` table stores `email` addresses as **`plaintext`** in the `sent_to` column:

![people_token-email-plaintext](https://user-images.githubusercontent.com/194400/223948397-6984b456-8612-492b-bb79-84442c8b4241.png)


This is **_obviously_ undesirable**. 🙃 
This is a privacy/security issue
waiting to become a scandal!
We will address this _swiftly_
in the following pages.

But first, tests!


## Run The Tests

Sadly, the `phx.gen.auth` 
there to be a bunch of routes 
hard-coded with the "/user" prefix in the tests
e.g: 
[`test/auth_web/controllers/person_session_controller_test.exs#L15`](https://github.com/dwyl/auth/blob/90086a83c6968573f7d4c72b3882a247ac30112d/test/auth_web/controllers/person_session_controller_test.exs#L15)

The generator doesn't respect 
the fact that we call them **`people`**
when we invoked the command above. 
so if you run the tests:

```sh
mix test
```

You will see several warnings:

```sh
.warning: no route path for AuthWeb.Router matches "/users/log_out"
  test/auth_web/controllers/person_registration_controller_test.exs:40: AuthWeb.PersonRegistrationControllerTest."test POST /people/register creates account and logs the person in"/1

warning: no route path for AuthWeb.Router matches "/users/log_out"
  test/auth_web/controllers/person_session_controller_test.exs:40: AuthWeb.PersonSessionControllerTest."test POST /people/log_in logs the person in"/1

warning: no route path for AuthWeb.Router matches "/users/settings"
  test/auth_web/controllers/person_session_controller_test.exs:39: AuthWeb.PersonSessionControllerTest."test POST /people/log_in logs the person in"/1

warning: no route path for AuthWeb.Router matches "/users/settings"
  test/auth_web/controllers/person_registration_controller_test.exs:39: AuthWeb.PersonRegistrationControllerTest."test POST /people/register creates account and logs the person in"/1

warning: no route path for AuthWeb.Router matches "/users/register"
  test/auth_web/controllers/person_session_controller_test.exs:15: AuthWeb.PersonSessionControllerTest."test GET /people/log_in renders log in page"/1

warning: no route path for AuthWeb.Router matches "/users/register"
  test/auth_web/controllers/person_registration_controller_test.exs:12: AuthWeb.PersonRegistrationControllerTest."test GET /people/register renders registration page"/1

warning: no route path for AuthWeb.Router matches "/users/log_in"
  test/auth_web/controllers/person_registration_controller_test.exs:11: AuthWeb.PersonRegistrationControllerTest."test GET /people/register renders registration page"/1
```

And ultimately the tests fail: 

```sh
...............................................................................
Finished in 0.6 seconds (0.4s async, 0.2s sync)
115 tests, 5 failures
```

This should be a easy to fix.

Perform a find-and-replace for "/users/" to "/people/"

![replace-users-with-people](https://user-images.githubusercontent.com/194400/223720287-98435204-8189-4baf-ab7b-a2a3f506b6dd.png)

Attempt to re-run the tests:

```sh
mix test
```

Sadly, 4 tests still fail:

```sh
  1) test POST /people/register creates account and logs the person in (AuthWeb.PersonRegistrationControllerTest)
     test/auth_web/controllers/person_registration_controller_test.exs:24
     Assertion with =~ failed
     code:  assert response =~ email
     left:  "<!DOCTYPE html>\n<html lang=\"en\" style=\"scrollbar-gutter: stable;\">\n  <head>\n etc.

etc.

.......................................................................
Finished in 0.5 seconds (0.4s async, 0.1s sync)
115 tests, 4 failures
```

We're going to have to investigate/update these tests _manually_.