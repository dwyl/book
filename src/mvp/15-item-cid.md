# Use `cid` for `item` _unique_ `id`

By default the `items` table uses an auto-incrementing (`Serial`) 
for the `id` (Primary Key):

![items-id-integer](https://github.com/dwyl/mvp/assets/194400/d3020e53-2ad8-43ff-b0ed-95251ee21a87)

This is fine for a _server_-side rendered app 
with a _single_ relational database instance.
But our ambition has always been 
to build a mobile + offline-first distributed App.

Luckily our friends at 
[Protocol Labs]()
(creators of )
[`IPFS`](https://github.com/dwyl/learn-ipfs)
have done some groundwork on "Distributed Apps" problem
and we have a little library that creates `IPFS` compliant
Content Identifiers: 
[`cid`](https://github.com/dwyl/cid)

The basic usage is:

```elixir
item = %{text: "Build PARA System App", person_id: 2, status: 2}
Cid.cid(item)
"zb2rhn92tqTt41uFZ3hh3VPnssXjYCW4yDSX7KB39dXZyMtNC"
```


## Add `cid` package to `deps`

Add the `cid` package to the `deps` in `mix.exs`:

```elixir
# Universally Unique Deterministic Content IDs: github.com/dwyl/cid
{:excid, "~> 1.0.1"},
```

Run:
```sh
mix deps.get
```

Then in `config/config.exs` add the following configuration line:
```elixir
config :excid, base: :base58
```

We want to use 
[`base58`](https://github.com/dwyl/base58#why-base58)
because it uses 17% fewer characters to represent the same `ID` 
when compared to `base32`.

```elixir
"bafkreihght5nbnmn6xbwoakmjyhkiu2naxmwpxgxbp6xkpbiweuetbohde"
|> String.length()
49
```
vs.
```elixir
"zb2rhn92tqTt41uFZ3hh3VPnssXjYCW4yDSX7KB39dXZyMtNC"
|> String.length()
59
```

## Create a Migration to add `cid` field to `item`

Using the 
[`mix ecto.gen.migration`](https://hexdocs.pm/ecto_sql/Mix.Tasks.Ecto.Gen.Migration.html)
command, 
create a migration file:

```sh
mix ecto.gen.migration add_cid_to_item
```

> **Note**: if you're rusty on `migrations`,
see:
[devhints.io/phoenix-migrations](https://devhints.io/phoenix-migrations)