# Encrypt Personal Data 

As previously noted
the schema created by the 
`phx.gen.auth` generator
leaves **`email`** addresses stored 
as 
[**`plaintext`**](https://en.wikipedia.org/wiki/Plaintext):

![mix-phx-gen-auth-people-table-email-plaintext](https://user-images.githubusercontent.com/194400/223880353-98597d83-cb9c-424d-bcb0-2121ecd743c0.png)

It's disappointing to us 
that this is the `default`
and many devs
will _naively_ think this is "OK".

## It's _Never_ "OK" to Store Personal Data as `plaintext`

It might be _tempting_ 
to store personal data as 
human-readable text
during development
to make it easier to debug,
but we urge _everyone_
to resist this temptation!
[Data breaches](https://en.wikipedia.org/wiki/Data_breach)
happen _every_ day.
Breaches can _destroy_ the reputation
of a company.
Thankfully,
the EU now has stronger laws
in the form of the
[General Data Protection Regulation](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation)
(GDPR),
which carry heavy fines
for companies
that improperly store personal data.

Most software engineers don't consider
the law(s) around data protection. 
But none of us have _any_ excuse 
to ignore them even in basic projects.

The good news is:
protecting personal data
is quite straightforward.

## Why Encrypt _Now_?

We _know_ this might feel like a deeply technical
step to have so early on in 
the creation of the `auth` App.
Why don't we just _skip_ this 
and focus on the interface `people` will _see_?
We feel that getting the data privacy/security
right from the _start_
is essential for building a robust
and therefore trustworthy app. 
We will get to the interface design 
in the next chapter
so if you prefer that part,
feel free to speed-read/run this
and only return to it when you 
need a deeper understanding.


## How To Encrypt Sensitive Data?

When we first started using `Elixir` in 2016
we explored the topic of 
encrypting personal data in _depth_
and wrote a comprehensive guide:
[`dwyl/phoenix-ecto-encryption-example`](https://github.com/dwyl/phoenix-ecto-encryption-example)
We _highly_ recommend following step-by-step guide
to understand this in detail.
We aren't going to duplicate/repeat 
any of the theory here. 
Rather we are going to focus on using
the package we created
[`fields`](https://github.com/dwyl/fields)

## Using `Fields` to _Automatically_ Encrypt Personal Data

Following the instructions in the 
[`fields`](https://github.com/dwyl/fields)
repo, open the `mix.exs` file
and locate the `defp deps do` section
and add `fields` to the list:

```elixir
{:fields, "~> 2.10.3"},
```

Save the `mix.exs` file and run:

```sh
mix deps.get
```


### Create Environment Variables

`fields` expects an `environment variable

e.g. using the [`phx.gen.secret`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Secret.html) command:

```sh
mix phx.gen.secret
```
You should see output similar to:

```sh
XGYVueuky4DT0s0ks2MPzHpucyl+9e/uY4UusEfgyR2qeNApzoYGSH+Y55cfDj1Y
```

Export this key in your terminal with the following command:

```sh
export ENCRYPTION_KEYS=XGYVueuky4DT0s0ks2MPzHpucyl+9e/uY4UusEfgyR2qeNApzoYGSH+Y55cfDj1Y
```

Run the `phx.gen.secret` command again 
and export it as `SECRET_KEY_BASE`, e.g:

```sh
export SECRET_KEY_BASE=GLH2S6EU0eZt+GSEmb5wEtonWO847hsQ9fck0APr4VgXEdp9EKfni2WO61z0DMOF
```

We use an `.env` file on `localhost`:

```sh
export ENCRYPTION_KEYS=XGYVueuky4DT0s0ks2MPzHpucyl+9e/uY4UusEfgyR2qeNApzoYGSH+Y55cfDj1Y
export SECRET_KEY_BASE=GLH2S6EU0eZt+GSEmb5wEtonWO847hsQ9fck0APr4VgXEdp9EKfni2WO61z0DMOF
```

See:
[`.env_sample`](https://github.com/dwyl/auth/blob/main/.env_sample) 
for a sample including 
all the recommended/required environment variables
for running the `auth` app.

Now to the _interesting_ part!

## Update `people.email` Data Type

The `phx.gen.auth` generator
created the `people` schema
with the `:email` field defined as a `:string`:

```sh
field :email, :string
```

See: 
[`lib/auth/accounts/person.ex#L6`](https://github.com/dwyl/auth/blob/da0af7ee702c278714b47f92045edce4adad542a/lib/auth/accounts/person.ex#L6)


### Create Migration File

Using [`Ecto.Migration`](https://hexdocs.pm/ecto_sql/Ecto.Migration.html#module-creating-your-first-migration)
run the following command 
to create a migration file 
with a descriptive name:

```sh
mix ecto.gen.migration modify_people_email_string_binary
```

You should see output similar to:

```sh
* creating priv/repo/migrations/20230309145958_modify_people_email_string_binary.exs
```

Open the file in your editor. You should see:

```elixir
defmodule Auth.Repo.Migrations.ModifyPeopleEmailStringBinary do
  use Ecto.Migration

  def change do

  end
end
```

Update it to include the `alter` statement:

```elixir
defmodule Auth.Repo.Migrations.ModifyPeopleEmailStringBinary do
  use Ecto.Migration

  def change do
    alter table(:people) do
      remove :email
      add :email, :binary
      add ...
    end

    alter table(:people_tokens) do
      remove :sent_to
      add :sent_to, :binary
    end
  end
end
```

> **Note**: we tried using 
[`Ecto.Migration.modify/3`](https://hexdocs.pm/ecto_sql/Ecto.Migration.html#modify/3)
to modify the field type
but got the error:

```sh
15:06:13.691 [info] alter table people
** (Postgrex.Error) ERROR 42804 (datatype_mismatch) column "email" cannot be cast automatically to type bytea

    hint: You might need to specify "USING email::bytea".
```

Given that this is a new project 
and there is no data in the DB,
we decided it was easier 
to remove and re-add the `email` column/field.


Save the migration file and run:

```sh
mix ecto.reset
```

You should see output similar to the following:

```sh
15:13:29.989 [info] == Migrated 20230226095715 in 0.0s

15:13:30.057 [info] == Running 20230309145958 Auth.Repo.Migrations.ModifyPeopleEmailStringBinary.change/0 forward

15:13:30.058 [info] alter table people

15:13:30.059 [info] alter table people_tokens

15:13:30.059 [info] == Migrated 20230309145958 in 0.0s
```

### Update `person.email`

Open 
`lib/auth/accounts/person.ex`
and replace the line:

```elixir
field :email, :string
```

With:

```elixir
field :email, Fields.EmailEncrypted
field :email_hash, Fields.EmailHash
```

Sadly, this _essential_ privacy/security enhancement 
was not quite as straightforward as we had hoped 
and had quite a few ramifications.
The boilerplate code 
generated by `phx.gen.auth`
was relying on `person.email` being `plaintext`
so we ended up having to make several changes.

Rather than repeating all of these here
which will take up a _lot_ of space
and duplicate the code unessessarily,
we recommend you read through the git commit:
[`#2bbba99`](https://github.com/dwyl/auth/pull/231/commits/2bbba99c7057f0d2943dd8327be52ccf1a1bd58c)

In a follow-up section 
we will be removing most of this code
because we don't _want_ to
use links in emails to verify `people`.
Instead we will be using one-time-numeric codes.


Following the changes made in: 
[`#2bbba99`](https://github.com/dwyl/auth/pull/231/commits/2bbba99c7057f0d2943dd8327be52ccf1a1bd58c)

If we now run a query to view the data in the `people` table:
```sql
SELECT id, email, inserted_at FROM people;
```
We see that the `email` is now a binary blob 
<img width="1096" alt="image" src="https://user-images.githubusercontent.com/194400/224109679-0084ae9d-a1e8-48f2-a083-94aff46d7137.png">

Registration and Login still works as expected:
<img width="1159" alt="image" src="https://user-images.githubusercontent.com/194400/224111036-7a4e5764-8966-4b97-aaea-515c8e3b7fd4.png">

But now the personal data 
captured in registration is stored 
**`encrypted`** at rest 
the way it should be. 🔐 

Now we can get on with _building_ `auth`!