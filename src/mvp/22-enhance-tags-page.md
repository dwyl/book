# Implementing Enhanced Tag Details and Sorting

These modifications are designed to enhance functionality and improve user experience. 
We'll cover updates made to the `Repo` module, changes in the `Tag` schema, 
alterations in the `TagController` and `StatsLive` modules, 
and updates to LiveView files.

## Implementing the `toggle_sort_order` in `Repo.ex`

The `toggle_sort_order` function in the `Repo` module allows us to dynamically change the sorting order of our database queries. 
This is useful for features where the user can sort items in ascending or descending order that will be used throughout the whole app where we need to sort it.

`lib/app/repo.ex`
```elixir
def toggle_sort_order(:asc), do: :desc
def toggle_sort_order(:desc), do: :asc
```
If the current order is :asc (ascending), it changes to :desc (descending), and vice versa​​.

## Extending the `Tag` Model

Open `lib/app/tag.ex` and add new fields to the `Tag` schema.

```elixir
field :last_used_at, :naive_datetime, virtual: true
field :items_count, :integer, virtual: true
field :total_time_logged, :integer, virtual: true
```
These fields are 'virtual', meaning they're not stored in the database but calculated on the fly.

The purposes of the fields are:
`last_used_at`: the date a Tag was last used
`items_count`: how many items are using the Tag
`total_time_logged`: the total time that was logged with this particular Tag being used by a Item

We will add a new method that will query with these new fields on the same file. 

Define `list_person_tags_complete/3`:

```elixir
def list_person_tags_complete(
      person_id,
      sort_column \\ :text,
      sort_order \\ :asc
    ) do
  sort_column =
    if validate_sort_column(sort_column), do: sort_column, else: :text

  Tag
  |> where(person_id: ^person_id)
  |> join(:left, [t], it in ItemTag, on: t.id == it.tag_id)
  |> join(:left, [t, it], i in Item, on: i.id == it.item_id)
  |> join(:left, [t, it, i], tm in Timer, on: tm.item_id == i.id)
  |> group_by([t], t.id)
  |> select([t, it, i, tm], %{
    t
    | last_used_at: max(it.inserted_at),
      items_count: fragment("count(DISTINCT ?)", i.id),
      total_time_logged:
        sum(
          coalesce(
            fragment(
              "EXTRACT(EPOCH FROM (? - ?))",
              tm.stop,
              tm.start
            ),
            0
          )
        )
  })
  |> order_by(^get_order_by_keyword(sort_column, sort_order))
  |> Repo.all()
end
```

And add these new methods at the end of the file:

```elixir
defp validate_sort_column(column) do
  Enum.member?(
    [
      :text,
      :color,
      :created_at,
      :last_used_at,
      :items_count,
      :total_time_logged
    ],
    column
  )
end

defp get_order_by_keyword(sort_column, :asc) do
  [asc: sort_column]
end

defp get_order_by_keyword(sort_column, :desc) do
  [desc: sort_column]
end
```

These methods are used in the previous method to validate the columns 
that can be searched and to transform into keywords [asc: column] to work on the query.

## Adding the new columns on the `Tags` Page

First, we need to remove the index page from the `tag_controller.ex` 
because we are going to include it on a new LiveView for `Tags`.

This is needed because of the sorting events of the table.

So **remove** these next lines of code from the `lib/app_web/controllers/tag_controller.ex`
```elixir
def index(conn, _params) do
  person_id = conn.assigns[:person][:id] || 0
  tags = Tag.list_person_tags(person_id)

  render(conn, "index.html",
    tags: tags,
    lists: App.List.get_lists_for_person(person_id),
    custom_list: false
  )
end
```

Now, let's create the LiveView that will have the table for tags 
and the redirections to all other pages on the `TagController`.

Create a new file on `lib/app_web/live/tags_live.ex` with the following content.

```elixir
defmodule AppWeb.TagsLive do
  use AppWeb, :live_view
  alias App.{DateTimeHelper, Person, Tag, Repo}

  # run authentication on mount
  on_mount(AppWeb.AuthController)

  @tags_topic "tags"

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket), do: AppWeb.Endpoint.subscribe(@tags_topic)

    person_id = Person.get_person_id(socket.assigns)

    tags = Tag.list_person_tags_complete(person_id)

    {:ok,
     assign(socket,
       tags: tags,
       lists: App.List.get_lists_for_person(person_id),
       custom_list: false,
       sort_column: :text,
       sort_order: :asc
     )}
  end

  @impl true
  def handle_event("sort", %{"key" => key}, socket) do
    sort_column =
      key
      |> String.to_atom()

    sort_order =
      if socket.assigns.sort_column == sort_column do
        Repo.toggle_sort_order(socket.assigns.sort_order)
      else
        :asc
      end

    person_id = Person.get_person_id(socket.assigns)

    tags = Tag.list_person_tags_complete(person_id, sort_column, sort_order)

    {:noreply,
     assign(socket,
       tags: tags,
       sort_column: sort_column,
       sort_order: sort_order
     )}
  end

  def format_date(date) do
    DateTimeHelper.format_date(date)
  end

  def format_seconds(seconds) do
    DateTimeHelper.format_duration(seconds)
  end
end
```

The whole code is similar to other LiveViews created on the project.

**`mount`**

This function is invoked when the LiveView component is mounted. It initializes the state of the LiveView.
- `on_mount(AppWeb.AuthController)`: This line ensures that authentication is run when the LiveView component mounts.
- The `if connected?(socket)` block subscribes to a topic (@tags_topic) if the user is connected, enabling real-time updates.
- `person_id` is retrieved to identify the current user.
- tags are fetched using `Tag.list_person_tags_complete(person_id)`, which retrieves all tags associated with the `person_id` and is the method that we created previously.
- The socket is assigned various values, such as tags, lists, custom_list, sort_column, and sort_order, setting up the initial state of the LiveView.

**`handle_event`**

This function is called when a "sort" event is triggered by user interaction on the UI.
- `sort_column` is set based on the event's key, determining which column to sort by.
- `sort_order` is determined by the current state of sort_column and sort_order. If the sort_column is the same as the one already in the socket's assigns, the order is toggled using `Repo.toggle_sort_order`. Otherwise, it defaults to ascending (:asc).
- Tags are then re-fetched with the new sort order and column, and the socket is updated with these new values.
- This dynamic sorting mechanism allows the user interface to update the display order of tags based on user interaction.

**`format_date(date)`**

Uses DateTimeHelper.format_date to format a given date.

**`format_seconds(seconds)`**

Uses DateTimeHelper.format_duration to format a duration in seconds into a more human-readable format.

### Creating the LiveView HTML template

Create a new file on `lib/app_web/live/tags_live.html.heex` 
that will handle the LiveView created in the previous section:

```html
<main class="font-sans container mx-auto">
  <div class="relative overflow-x-auto mt-12">
    <h1 class="mb-2 text-xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
      Listing Tags
    </h1>

    <.live_component
      module={AppWeb.TableComponent}
      id="tags_table_component"
      rows={@tags}
      sort_column={@sort_column}
      sort_order={@sort_order}
      highlight={fn _ -> false end}
    >
      <:column :let={tag} label="Name" key="text">
        <td class="px-6 py-4 text-center" data-test-id={"text_#{tag.id}"}>
          <%= tag.text %>
        </td>
      </:column>

      <:column :let={tag} label="Color" key="color">
        <td class="px-6 py-4 text-center" data-test-id={"color_#{tag.id}"}>
          <span
            style={"background-color:#{tag.color}"}
            class="max-w-[144px] text-white font-bold py-1 px-2 rounded-full 
            overflow-hidden text-ellipsis whitespace-nowrap inline-block"
          >
            <%= tag.color %>
          </span>
        </td>
      </:column>

      <:column :let={tag} label="Created At" key="inserted_at">
        <td class="px-6 py-4 text-center" data-test-id={"inserted_at_#{tag.id}"}>
          <%= format_date(tag.inserted_at) %>
        </td>
      </:column>

      <:column :let={tag} label="Latest" key="last_used_at">
        <td
          class="px-6 py-4 text-center"
          data-test-id={"last_used_at_#{tag.id}"}
        >
          <%= if tag.last_used_at do %>
            <%= format_date(tag.last_used_at) %>
          <% else %>
            -
          <% end %>
        </td>
      </:column>

      <:column :let={tag} label="Items Count" key="items_count">
        <td class="px-6 py-4 text-center" data-test-id={"items_count_#{tag.id}"}>
          <a href={~p"/?filter_by_tag=#{tag.text}"} class="underline">
            <%= tag.items_count %>
          </a>
        </td>
      </:column>

      <:column :let={tag} label="Total Time Logged" key="total_time_logged">
        <td
          class="px-6 py-4 text-center"
          data-test-id={"total_time_logged_#{tag.id}"}
        >
          <%= format_seconds(tag.total_time_logged) %>
        </td>
      </:column>

      <:column :let={tag} label="Actions" key="actions">
        <td class="px-6 py-4 text-center" data-test-id={"actions_#{tag.id}"}>
          <%= link("Edit", to: Routes.tag_path(@socket, :edit, tag)) %>

          <span class="text-red-500 ml-10">
            <%= link("Delete",
              to: Routes.tag_path(@socket, :delete, tag),
              method: :delete,
              data: [confirm: "Are you sure you want to delete this tag?"]
            ) %>
          </span>
        </td>
      </:column>
    </.live_component>

    <.button
      link_type="a"
      to={Routes.tag_path(@socket, :new)}
      label="Create Tag"
      class="text-2xl text-center float-left rounded-md bg-green-600 hover:bg-green-700 
      my-2 mt-2 ml-2 px-4 py-2 font-semibold text-white shadow-sm"
    />
  </div>
</main>
```

The structure is similar to the `stats_live.html.heex` 
with the new columns for tags and the events for sorting. 
And it's using the `TableComponent` as well.

## Adding the new page to the router

Open the `lib/app_web/router.ex` and change the following line:

```elixir
...

 scope "/", AppWeb do
  pipe_through [:browser, :authOptional]
  live "/", AppLive
  resources "/lists", ListController, except: [:show]
  get "/logout", AuthController, :logout
  live "/stats", StatsLive
+  live "/tags", TagsLive
  resources "/tags", TagController, except: [:show]
end

...
```

After that, you can remove the `lib/app_web/templates/tag/index.html.heex` file, 
since we will use the `Tags` LiveView for the tags page now.

Done! The Tags Page has the new columns and everything to be enhanced, congratulations!

It's just missing tests, let's add them:

`test/app/repo_test.exs`
```elixir
defmodule App.RepoTest do
  use ExUnit.Case
  alias App.Repo

  describe "toggle_sort_order/1" do
    test "toggles :asc to :desc" do
      assert Repo.toggle_sort_order(:asc) == :desc
    end

    test "toggles :desc to :asc" do
      assert Repo.toggle_sort_order(:desc) == :asc
    end
  end
end
```

Add new test cases to the `test/app/tag_test.exs`

```elixir
describe "list_person_tags/1" do
  test "returns an empty list for a person with no tags" do
    assert [] == Tag.list_person_tags(-1)
  end

  test "returns a single tag for a person with one tag" do
    tag = add_test_tag(%{text: "TestTag", person_id: 1, color: "#FCA5A5"})
    assert [tag] == Tag.list_person_tags(1)
  end

  test "returns tags in alphabetical order for a person with multiple tags" do
    add_test_tag(%{text: "BTag", person_id: 2, color: "#FCA5A5"})
    add_test_tag(%{text: "ATag", person_id: 2, color: "#FCA5A5"})

    tags = Tag.list_person_tags(2)
    assert length(tags) == 2
    assert tags |> Enum.map(& &1.text) == ["ATag", "BTag"]
  end
end

describe "list_person_tags_complete/3" do
  test "returns detailed tag information for a given person" do
    add_test_tag_with_details(%{person_id: 3, text: "DetailedTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(3)
    assert length(tags) > 0
    assert tags |> Enum.all?(&is_map(&1))
    assert tags |> Enum.all?(&Map.has_key?(&1, :last_used_at))
    assert tags |> Enum.all?(&Map.has_key?(&1, :items_count))
    assert tags |> Enum.all?(&Map.has_key?(&1, :total_time_logged))
  end

  test "sorts tags based on specified sort_column and sort_order" do
    add_test_tag_with_details(%{person_id: 4, text: "CTag", color: "#FCA5A5"})
    add_test_tag_with_details(%{person_id: 4, text: "ATag", color: "#FCA5A5"})
    add_test_tag_with_details(%{person_id: 4, text: "BTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(4, :text, :asc)
    assert tags |> Enum.map(& &1.text) == ["ATag", "BTag", "CTag"]
  end

  test "sorts tags with desc sort_order" do
    add_test_tag_with_details(%{person_id: 4, text: "CTag", color: "#FCA5A5"})
    add_test_tag_with_details(%{person_id: 4, text: "ATag", color: "#FCA5A5"})
    add_test_tag_with_details(%{person_id: 4, text: "BTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(4, :text, :desc)
    assert tags |> Enum.map(& &1.text) == ["CTag", "BTag", "ATag"]
  end

  test "uses default sort_order when none are provided" do
    add_test_tag_with_details(%{person_id: 5, text: "SingleTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(5, :text)
    assert length(tags) == 1
  end

  test "uses default parameters when none are provided" do
    add_test_tag_with_details(%{person_id: 5, text: "SingleTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(5)
    assert length(tags) == 1
  end

  test "handles invalid column" do
    add_test_tag_with_details(%{person_id: 6, text: "BTag", color: "#FCA5A5"})
    add_test_tag_with_details(%{person_id: 6, text: "AnotherTag", color: "#FCA5A5"})

    tags = Tag.list_person_tags_complete(6, :invalid_column)
    assert length(tags) == 2
    assert tags |> Enum.map(& &1.text) == ["AnotherTag", "BTag"]
  end
end

defp add_test_tag(attrs) do
  {:ok, tag} = Tag.create_tag(attrs)
  tag
end

defp add_test_tag_with_details(attrs) do
  tag = add_test_tag(attrs)

  {:ok, %{model: item}} = Item.create_item(%{
    person_id: tag.person_id,
    status: 0,
    text: "some item",
    tags: [tag]
  })

  seconds_ago_date = NaiveDateTime.new(Date.utc_today(), Time.add(Time.utc_now(), -10))
  Timer.start(%{item_id: item.id, person_id: tag.person_id, start: seconds_ago_date})
  Timer.stop_timer_for_item_id(item.id)

  tag
end
```

**Remove** these next lines from the `tag_controller_test.exs` since we don't have this page anymore:
```elixir
describe "index" do
  test "lists all tags", %{conn: conn} do
    conn = get(conn, Routes.tag_path(conn, :index))
    assert html_response(conn, 200) =~ "Listing Tags"
  end

  test "lists all tags and display logout button", %{conn: conn} do
    conn =
      conn
      |> assign(:jwt, AuthPlug.Token.generate_jwt!(%{id: 1, picture: ""}))
      |> get(Routes.tag_path(conn, :index))

    assert html_response(conn, 200) =~ "logout"
  end
end
```

`test/app_web/live/tags_live_test.exs`

```elixir
defmodule AppWeb.TagsLiveTest do
  use AppWeb.ConnCase, async: true
  alias App.{Item, Timer, Tag}
  import Phoenix.LiveViewTest

  @person_id 0

  test "disconnected and connected render", %{conn: conn} do
    {:ok, page_live, disconnected_html} = live(conn, "/tags")
    assert disconnected_html =~ "Tags"
    assert render(page_live) =~ "Tags"
  end

  test "display tags on table", %{conn: conn} do
    tag1 = add_test_tag_with_details(%{person_id: @person_id, text: "Tag1", color: "#000000"})
    tag2 = add_test_tag_with_details(%{person_id: @person_id, text: "Tag2", color: "#000000"})
    tag3 = add_test_tag_with_details(%{person_id: @person_id, text: "Tag3", color: "#000000"})

    {:ok, page_live, _html} = live(conn, "/tags")

    assert render(page_live) =~ "Tags"

    assert page_live
           |> element("td[data-test-id=text_#{tag1.id}")
           |> render() =~
             "Tag1"

    assert page_live
           |> element("td[data-test-id=text_#{tag2.id}")
           |> render() =~
             "Tag2"

    assert page_live
           |> element("td[data-test-id=text_#{tag3.id}")
           |> render() =~
             "Tag3"
  end

  @tag tags: true
  test "sorting column when clicked", %{conn: conn} do
    add_test_tag_with_details(%{person_id: @person_id, text: "a", color: "#000000"})
    add_test_tag_with_details(%{person_id: @person_id, text: "z", color: "#000000"})

    {:ok, page_live, _html} = live(conn, "/tags")

    # sort first time
    result =
      page_live |> element("th[phx-value-key=text]") |> render_click()

    [first_element | _] = Floki.find(result, "td[data-test-id^=text_]")
    assert first_element |> Floki.text() =~ "z"

    # sort second time
    result =
      page_live |> element("th[phx-value-key=text]") |> render_click()

    [first_element | _] = Floki.find(result, "td[data-test-id^=text_]")

    assert first_element |> Floki.text() =~ "a"
  end

  defp add_test_tag_with_details(attrs) do
    {:ok, tag} = Tag.create_tag(attrs)

    {:ok, %{model: item}} = Item.create_item(%{
      person_id: tag.person_id,
      status: 0,
      text: "some item",
      tags: [tag]
    })

    seconds_ago_date = NaiveDateTime.new(Date.utc_today(), Time.add(Time.utc_now(), -10))
    Timer.start(%{item_id: item.id, person_id: tag.person_id, start: seconds_ago_date})
    Timer.stop_timer_for_item_id(item.id)

    tag
  end
end
```

After these tests, you are ready to run the application and see your new changes!
