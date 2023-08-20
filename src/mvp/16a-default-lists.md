# Default `lists`

We want `people` to use our `App` 
for a wide variety of areas/projects in their life+work.
Therefore we are creating several `default` `lists` 
for them when they first authenticate.
See: [dwyl/mvp#401](https://github.com/dwyl/mvp/issues/401)
for the discussion.

> **Note**: This section is "parked" here in the `book` for future reference.
The `default lists` feature is not yet integrated into the `MVP`.
Once we have an idea of which `default lists` we want to work on
in terms of interface/experience,
we can easily enable it and guide people through the workflow.


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