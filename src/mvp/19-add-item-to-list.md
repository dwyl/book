# Make `Lists` _Useful_

To make our `lists` feature _useful_
we need to be able to:
1. _Create_ new **custom `lists`**.
2. _Add_ an `item` to the `list`.
3. _Remove_ an `item` from a `list`.

## Create _new_ `list`

> **TODO**: Document the functions 
> and interface implemented in: 
> https://github.com/dwyl/mvp/pull/165


## Add `item` to `list`



We _first_ 

## _Remove_ `item` from `list`

_Most_ of the time `people` _don't_ want 
an `item` to be on multiple `lists`.
So we need a function to _remove_ an `item` from a `list`
when it gets moved to a different `list`. 
Thankfully it's pretty straightforward.

### Test `remove_item_from_list/3`

Open the `test/app/list_test.exs` file 
and add the following test:

```elixir
  test "remove_item_from_list/3 removes the item.cid from the list.seq" do
    # Random Person ID
    person_id = 386
    all_list = App.List.get_all_list_for_person(person_id)

    # Create items:
    assert {:ok, %{model: item1}} =
      Item.create_item(%{text: "buy land!", person_id: person_id, status: 2})
    assert {:ok, %{model: item2}} =
      Item.create_item(%{text: "prepare for societal collapse", person_id: person_id, status: 2})

    # Add both items to the list:
    seq = "#{item1.cid},#{item2.cid}"
    {:ok, %{model: list}} = App.List.update_list_seq(all_list.cid, person_id, seq)
    assert list.seq == seq

    # Remove the first item from the list:
    {:ok, %{model: list}} = App.List.remove_item_from_list(item1.cid, all_list.cid, person_id)

    # Only item2 should be on the list.seq:
    updated_seq = "#{item2.cid}"
    # Confirm removed:
    assert list.seq == updated_seq
  end
```

Running this test (before implementing the function)
will result in the following error:

```sh
mix test test/app/list_test.exs
```

E.g:

```elixir
warning: App.List.remove_item_from_list/2 is undefined or private
  test/app/list_test.exs:141: App.ListTest."test remove_item_from_list/3 removes the item.cid from the list.seq"/1



  1) test remove_item_from_list/3 removes the item.cid from the list.seq (App.ListTest)
     test/app/list_test.exs:124
     ** (UndefinedFunctionError) function App.List.remove_item_from_list/2 is undefined or private
     code: {:ok, %{model: list}} = App.List.remove_item_from_list(item1.cid, all_list.cid)
     stacktrace:
       (app 1.0.0) App.List.remove_item_from_list("zb2rhdaNQbkwwfEB9z65yRAtzmZvZmC5A3ei6tSkzySXaiKfi", "zb2rhid7hk43h1P24u7x88dAesrCVmh4uR53mUscxDAemyDaQ")
       test/app/list_test.exs:141: (test)


Finished in 0.1 seconds (0.1s async, 0.00s sync)
11 tests, 1 failure
```

Thankfully this is easy to resolve. 


### Implement `remove_item_from_list/3` function

Open the 
`lib/app/list.ex`
file
and add the following function defition:

```elixir
def remove_item_from_list(item_cid, list_cid, person_id) do
list = get_list_by_cid!(list_cid)
# get existing list.seq
seq =
    get_list_seq(list)
    # remove the item_cid from the list.seq:
    |> Useful.remove_item_from_list(item_cid)
    |> Enum.join(",")

update_list(list, %{seq: seq, person_id: person_id})
end
```

This uses the super simple function:
[`Useful.remove_item_from_list/2`](https://hexdocs.pm/useful/1.13.1/Useful.html#remove_item_from_list/2)
which we published 
in our library of 
[`Useful`](https://github.com/dwyl/useful)
functions. ⭐
