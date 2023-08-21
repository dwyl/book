# Metrics

This chapter adds a few basic metrics for the `people` using the `MVP`. 📈 <br />
If you have ideas for additional stats you want to see,
please open an issue:
[dwyl/mvp/issues](https://github.com/dwyl/mvp/issues) 🙏

## Adding Sorting to the track metrics table and more additional fields

What happens when we need to track more `metrics`?
And even, when we get more users on the `MVP`?

How can we sort the `columns` to make it easier to understand the data?

One of the most intuitive ways to manage large datasets is by enabling sorting.
It allows users to arrange data in a manner that's most meaningful to them, be it in ascending or descending order.
This makes it significantly easier to spot trends, anomalies, or specific data points.

In this section, we will `supercharge` our track metrics table, we will:
- Introduce new columns (First Joined, Last Item Inserted and Total Elapsed Time)
- Highlight your user on the table
- Create a Table `LiveComponent` to componentize our table that can be used throughout the application
- Implement Column Sorting

Sneak Peek ;D
<img width="1016" alt="image" src="https://github.com/dwyl/mvp/assets/2154092/2240d91f-cdf3-4b6c-ba05-1929b764c7d8">

## Add new columns

With the growth of our MVP, we've identified the need for more detailed metrics. This involves adding more fields to our existing stats query.

Since our new fields have dates to be shown we need a way to format them.

Let's create a new file called `date_time_helper.ex` inside the `lib/app` folder.
```elixir
defmodule App.DateTimeHelper do
  require Decimal
  alias Timex.{Duration}

  def format_date(date) do
    Calendar.strftime(date, "%m/%d/%Y %H:%M:%S")
  end

  def format_duration(nil), do: ""

  def format_duration(seconds) when Decimal.is_decimal(seconds) do
    duration = seconds |> Decimal.to_integer() |> Duration.from_seconds()

    Timex.format_duration(duration, :humanized)
  end

  def format_duration(_seconds), do: ""
end
```

This is a new helper module that we are going to use to format dates and durations.

We will need the `Decimal` and the [Timex](https://hexdocs.pm/timex/Timex.html) library to format it.

`require Decimal`

This line tells Elixir that you will be using macros from the Decimal module. This is needed because the code calls Decimal.is_decimal/1 later.

`alias Timex.{Duration}`

An alias is a way to reference a module with a shorter name. Here, we're creating an alias for Timex.Duration so that we can simply write Duration instead of the full module name.

```elixir
def format_date(date) do
  Calendar.strftime(date, "%m/%d/%Y %H:%M:%S")
end
```

This function takes in a date and returns a formatted string in the pattern "MM/DD/YYYY HH:MM:SS". It uses the strftime function from the [Calendar](https://hexdocs.pm/elixir/1.13/Calendar.html) module to accomplish this.

```elixir
def format_duration(nil), do: ""

def format_duration(seconds) when Decimal.is_decimal(seconds) do
  duration = seconds |> Decimal.to_integer() |> Duration.from_seconds()

  Timex.format_duration(duration, :humanized)
end

def format_duration(_seconds), do: ""
```

The first function clause matches when the input is nil. It simply returns an empty string.

The second clause is where the `juicy` is, it  matches when the given seconds is a decimal (in this case, it's what is going to be return from Ecto). It does the following:

- Checks if seconds is a decimal using Decimal.is_decimal/1.
- Converts the decimal value of seconds to an integer using Decimal.to_integer/1.
- Converts the integer value to a duration using [Duration.from_seconds/1](https://hexdocs.pm/timex/Timex.Duration.html#from_seconds/1).
- Formats the duration using [Timex.format_duration/2](https://hexdocs.pm/timex/Timex.html#format_duration/2) with a :humanized option.

The last clause of the format_duration/1 function matches any input (other than nil and decimals, which were handled by the previous clauses). This function simply returns an empty string.

In summary, this App.DateTimeHelper module provides utility functions to format dates and durations. Dates are formatted in the "MM/DD/YYYY HH:MM:SS" pattern, while durations are formatted in a humanized form if they are decimals; otherwise, an empty string is returned. If we want we could possibly extend this module to more utilities functions.

Now, we can create some tests for this new module, inside the `test/app` create a new file called `date_time_helper_test.exs` with the following content.

```elixir
defmodule App.DateTimeHelperTest do
  use ExUnit.Case
  alias App.DateTimeHelper
  alias Timex

  describe "format_date/1" do
    test "formats a date correctly" do
      dt = Timex.parse!("2023-08-02T15:30:30+00:00", "{ISO:Extended}")
      assert DateTimeHelper.format_date(dt) == "08/02/2023 15:30:30"
    end
  end

  describe "format_duration/1" do
    test "returns an empty string for nil" do
      assert DateTimeHelper.format_duration(nil) == ""
    end

    test "returns an empty string when other than decimal" do
      assert DateTimeHelper.format_duration(12345) == ""
    end

    test "formats a duration correctly" do
      duration_seconds = Decimal.new(12345)

      assert DateTimeHelper.format_duration(duration_seconds) ==
               "3 hours, 25 minutes, 45 seconds"
    end

    test "formats a zero decimal duration correctly" do
      duration_seconds = Decimal.new(0)

      assert DateTimeHelper.format_duration(duration_seconds) ==
               "0 microseconds"
    end
  end
end
```

This file tests various cases using the `DateTimeHelper`, feel free to take your time to understand each one.

With our Helper fully tested we can now modify our `item.ex` to return the new columns that we want in our Stats Live page.

Open `item.ex` and update the `person_with_item_and_timer_count/0` method:

```elixir
def person_with_item_and_timer_count() do
  sql = """
  SELECT i.person_id,
  COUNT(distinct i.id) AS "num_items",
  COUNT(distinct t.id) AS "num_timers",
  MIN(i.inserted_at) AS "first_inserted_at",
  MAX(i.inserted_at) AS "last_inserted_at",
  SUM(EXTRACT(EPOCH FROM (t.stop - t.start))) AS "total_timers_in_seconds"
  FROM items i
  LEFT JOIN timers t ON t.item_id = i.id
  GROUP BY i.person_id
  """

  Ecto.Adapters.SQL.query!(Repo, sql)
  |> map_columns_to_values()
end
```
We are just adding three new columns to it, `first_inserted_at`, `last_inserted_at` and `total_timers_in_seconds`.

`MIN(i.inserted_at) AS "first_inserted_at"`

This column gets the earliest `inserted_at` timestamp from the `items` table for each `person_id`. The `MIN` SQL function retrieves the minimum value in the `inserted_at` column for each group of records with the same `person_id`.

`MAX(i.inserted_at) AS "last_inserted_at"`

Conversely, this column gets the most recent `inserted_at` timestamp from the `items` table for each `person_id`. The `MAX` SQL function retrieves the maximum value in the `inserted_at` column for each group of records with the same `person_id`.

`SUM(EXTRACT(EPOCH FROM (t.stop - t.start))) AS "total_timers_in_seconds"`

This one is more tricky, but don't worry. This column calculates the total duration of all timers associated with each item for a given `person_id`.

The inner expression `(t.stop - t.start)` calculates the duration of each timer by subtracting the start time from the stop time, this will give us a resulted timestamp that is the difference between the two.

The `EXTRACT(EPOCH FROM ...)` function then converts this duration into `seconds`. Finally, the SUM function aggregates (sums up) all these durations for each group of records with the same `person_id`.

You can read more about the EXTRACT PostgreSQL function [here](https://www.postgresqltutorial.com/postgresql-date-functions/postgresql-extract/).

Done!

There is one last thing we need to do to show our new columns on the Phoenix template.

We need to add a helpers in our `stats_live.ex` file so we can format the date and duration.

Open this file and add the following code in the beggining of the file and the two methods on the end:
```elixir
defmodule AppWeb.StatsLive do
  ...
  alias App.{Item, DateTimeHelper}
  ...

  def format_date(date) do
    DateTimeHelper.format_date(date)
  end

  def format_seconds(seconds) do
    DateTimeHelper.format_duration(seconds)
  end
end
```

This is just calling the DateTimeHelper module with the methods that we created.

Great! Now we can show or new columns inside the `Phoenix` Template.

Open the `stats_live.html.heex` and update the table to add the new columns and fields:

```html
<table class="text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <tr>
      ...
      <th scope="col" class="px-6 py-3 text-center">
        First Joined
      </th>
      <th scope="col" class="px-6 py-3 text-center">
        Last Item Inserted
      </th>
      <th scope="col" class="px-6 py-3 text-center">
        Total Elapsed Time
      </th>
    </tr>
  </thead>
  <tbody>
    <%= for metric <- @metrics do %>
      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        ...
        <td class="px-6 py-4 text-center">
          <%= format_date(metric.first_inserted_at) %>
        </td>
        <td class="px-6 py-4 text-center">
          <%= format_date(metric.last_inserted_at) %>
        </td>
        <td class="px-6 py-4 text-center">
          <%= format_seconds(metric.total_timers_in_seconds) %>
        </td>
      </tr>
    <% end %>
  </tbody>
</table>
```

Done! Now we have our new columns and rows with the appropriate information as planned and already formatted.

The next tasks will only enhance that!

## Highlight your user on the table

To emphasize the currently logged-in user within the table, we'll first need to retrieve the user's information within our Phoenix LiveView, similar to how `app_live` operates.

Begin by opening `stats_live.ex` and add the following code:
```elixir
defmodule AppWeb.StatsLive do
  ...
  @stats_topic "stats"

  defp get_person_id(assigns), do: assigns[:person][:id] || 0

  @impl true
  def mount(_params, _session, socket) do
    ...

    person_id = get_person_id(socket.assigns)
    metrics = Item.person_with_item_and_timer_count()

    {:ok,
     assign(socket,
       person_id: person_id,
       metrics: metrics,
     )}
  end

  ...
end
```

Now to explain the changes.

`defp get_person_id(assigns), do: assigns[:person][:id] || 0`

This function attempts to extract the `:id` of the `:person` from the given `assigns` (a map or struct). If it doesn't find an ID, it defaults to `0`.

`person_id = get_person_id(socket.assigns)`

This line inside the `mount/3` retrieves the `person_id` from the `socket.assigns` using the aforementioned private function.

Furthermore, the `assign/3` function call has been updated to include this `person_id` in the socket's assigns.

In the previous step, we made adjustments to the `AppWeb.StatsLive` module to extract the `person_id` of the currently logged-in user. Now, it's time to use that to visually distinguish the user's row in our table.

Open the `stats_live.html.heex` file, where our table is defined. We're going to conditionally set the background and border colors of each table row based on whether the row corresponds to the currently logged-in user.

Locate the `<tbody>` section of your table, where each metric from `@metrics` is looped over to generate table rows and update the code to the following below:
```html
...

</thead>
<tbody>
  <%= for metric <- @metrics do %>
    <tr class={
      if metric.person_id == @person_id,
        do:
          "bg-teal-100 border-teal-500 dark:bg-teal-800 dark:border-teal-700",
        else: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
    }>
      <td class="px-6 py-4">
        <a href={person_link(metric.person_id)}>
          <%= metric.person_id %>
...
```

What we're doing here is checking if the `person_id` of the current metric matches the `@person_id` (the ID of the logged-in user). If it does:
- The row will have a teal background (`bg-teal-100`) and border (`border-teal-500`).
- In dark mode, it will have a darker teal background (`dark:bg-teal-800`) and border (`dark:border-teal-700`).

And if the IDs don't match, the row will maintain the same look.

With these changes, when you view your table now, the row corresponding to the currently logged-in user will be distinctly highlighted, providing an intuitive visual cue for users.

## Creating a Table LiveComponent

In this section we are going to build a `LiveComponent` that can be reused throughout our application.

This `LiveComponent` will be a table with dynamic rows and columns so we can create other tables if needed. This will be a good showcase of the `LiveComponent` capabilities as well.

From the `Phoenix.LiveComponent` [docs](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html):
> LiveComponents are a mechanism to compartmentalize state, markup, and events in LiveView.

So with that in mind, let's begin by creating our live component file.

Remember to create new folders if needed.

Create a new file inside the `lib/app_web/live/components/table_component.ex` with the following content:
```elixir
defmodule AppWeb.TableComponent do
  use Phoenix.LiveComponent

  def render(assigns) do
    Phoenix.View.render(
      AppWeb.TableComponentView,
      "table_component.html",
      assigns
    )
  end
end
```

This is a simple LiveComponent code that points to a new `table_component.html` template, let's create this file too inside the `lib/app_web/templates/table_component/table_component.html.heex` with the following content:
```html
<table class="text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <%= for column <- @column do %>
      <th
        scope="col"
        class="px-6 py-3 text-center cursor-pointer"
      >
        <a href="#" class="group inline-flex">
          <%= column.label %>
        </a>
      </th>
    <% end %>
  </thead>
  <tbody>
    <%= for row <- @rows do %>
      <tr class={
        if @highlight.(row),
          do:
            "bg-teal-100 border-teal-500 dark:bg-teal-800 dark:border-teal-700",
          else: "bg-white border-b dark:bg-gray-800 dark:border-gray-700"
      }>
        <%= for column <- @column do %>
          <%= render_slot(column, row) %>
        <% end %>
      </tr>
    <% end %>
  </tbody>
</table>
```

Before we proceed, let's take a moment to understand what we've just created:

### The LiveComponent File:
- We've created a new `LiveComponent` named `AppWeb.TableComponent`.
- This component uses `Phoenix.View.render/3` to render a template named `table_component.html`.

### The Template File:
- This is a general-purpose table template with the all the current styles that we have on our `stats_live` template.
- The headers (<thead>) of the table are dynamically generated based on the `@column` assign, which is expected to be a list of columns with their respective labels.
- The body (<tbody>) of the table is dynamically generated based on the `@rows` assign. Each row's appearance can be conditionally modified using the `@highlight` function (we are going to use to highlight the current logged user, remember?).
- The `render_slot/2` function suggests that this component will use "[slots](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveComponent.html#module-slots)" - a feature in Phoenix LiveView that allows for rendering dynamic parts of a component.

To finish the LiveComponent we just need to create our `view` file that will make everything work together, create this new file inside `lb/app_web/views/table_component_view.ex` with the following content:
```elixir
defmodule AppWeb.TableComponentView do
  use AppWeb, :view
end
```

With that in place, we can update our Stats page to use this LiveComponent in a dynamic way. Open the `stats_live.html.heex` and make the following modifications:
```html
...
      Stats
    </h1>

    <.live_component
      module={AppWeb.TableComponent}
      id="table_component"
      rows={@metrics}
      highlight={&is_highlighted_person?(&1, @person_id)}
    >
      <:column :let={metric} label="Id" key="person_id">
        <td class="px-6 py-4" data-test-id="person_id">
          <a href={person_link(metric.person_id)}>
            <%= metric.person_id %>
          </a>
        </td>
      </:column>

      <:column :let={metric} label="Items" key="num_items">
        <td class="px-6 py-4 text-center" data-test-id="num_items">
          <%= metric.num_items %>
        </td>
      </:column>

      <:column :let={metric} label="Timers" key="num_timers">
        <td class="px-6 py-4 text-center" data-test-id="num_timers">
          <%= metric.num_timers %>
        </td>
      </:column>

      <:column :let={metric} label="First Joined" key="first_inserted_at">
        <td class="px-6 py-4 text-center" data-test-id="first_inserted_at">
          <%= format_date(metric.first_inserted_at) %>
        </td>
      </:column>

      <:column :let={metric} label="Last Item Inserted" key="last_inserted_at">
        <td class="px-6 py-4 text-center" data-test-id="last_inserted_at">
          <%= format_date(metric.last_inserted_at) %>
        </td>
      </:column>

      <:column
        :let={metric}
        label="Total Elapsed Time"
        key="total_timers_in_seconds"
      >
        <td class="px-6 py-4 text-center" data-test-id="total_timers_in_seconds">
          <%= format_seconds(metric.total_timers_in_seconds) %>
        </td>
      </:column>
    </.live_component>
  </div>
</main>
```

Now let's breakdown the code.

```html
<.live_component
  module={AppWeb.TableComponent}
  id="table_component"
  rows={@metrics}
  highlight={&is_highlighted_person?(&1, @person_id)}
>
```

- The tag `<.live_component>` is the syntax to embed a LiveComponent within a LiveView.
- We specify which LiveComponent to use using the `module` attribute. In this case, it's the `AppWeb.TableComponent` we discussed in the previous steps.
- Setting the `id` is essential for Phoenix to keep track of the component's state across updates.
- `rows={@metrics}` passes the `@metrics` assign to the component as its rows property.
- `highlight={&is_highlighted_person?(&1, @person_id)}` passes a function as the highlight property to the component. This function checks if a given row should be highlighted. We will create this function inside our `stats_live.ex` on the next step.

The next sections use the slot feature of LiveComponents:

```html
<:column :let={metric} label="Id" key="person_id">
  ...
</:column>
```
- `<:column ...>` is a slot. It tells the `TableComponent` how to render each cell of a column. The `:let={metric}` attribute means that inside this slot, you can access each row's data with the variable metric.
- `label="Id"` specifies the header label for this column.
- `key="person_id"` this key will be used to sort the columns when we get there.

Inside each slot, the template for rendering the cell is provided. For instance:

```html
<td class="px-6 py-4" data-test-id="person_id">
  <a href={person_link(metric.person_id)}>
    <%= metric.person_id %>
  </a>
</td>
```

This renders a table cell with the `person_id` content. The `data-test-id` attribute will be used for testing purposes, making it easier to find this specific element in test scenarios, more about that later.

As a last update for this section we need to create the `is_highlighted_person?/2` method inside our `stats_live.ex` file:
```elixir
defmodule AppWeb.StatsLive do

  ...

  def is_highlighted_person?(metric, person_id),
      do: metric.person_id == person_id
end
```

In summary, this code replaces the static table that we had with a dynamic one, utilizing our `TableComponent`.

Now you can run the code and see the same result that we had before.

## Implement Column Sorting

Finally, we are in our last section to add the column sorting feature!

For these we will need:
- Add the sorting logic inside our query and method of `item.ex` file.
- Include the sort mechanism on the Table `LiveComponent` by adding a onclick event in the table header's
- Add the event to sort on the `Stats LiveView`
- Create tests for everything

To add the sorting logic inside `item.ex` file, we are going to create two parameters to our current method that fetches the stats. And we are going to validate the parameters as well.

Open the `item.ex` file and update to the following:
```elixir
  ...

  def person_with_item_and_timer_count(
          sort_column \\ :person_id,
          sort_order \\ :asc
      ) do
    
    sort_column = to_string(sort_column)
    sort_order = to_string(sort_order)

    sort_column =
      if validate_sort_column(sort_column), do: sort_column, else: "person_id"

    sort_order = if validate_order(sort_order), do: sort_order, else: "asc"

    sql = """
    SELECT i.person_id,
    COUNT(distinct i.id) AS "num_items",
    COUNT(distinct t.id) AS "num_timers",
    MIN(i.inserted_at) AS "first_inserted_at",
    MAX(i.inserted_at) AS "last_inserted_at",
    SUM(EXTRACT(EPOCH FROM (t.stop - t.start))) AS "total_timers_in_seconds"
    FROM items i
    LEFT JOIN timers t ON t.item_id = i.id
    GROUP BY i.person_id
    ORDER BY #{sort_column} #{sort_order}
    """

  ...

  # validates the items columns to make sure it's a valid column passed
  defp validate_sort_column(column) do
    Enum.member?(
      ~w(person_id num_items num_timers first_inserted_at last_inserted_at total_timers_in_seconds),
      column
    )
  end

  # validates the order SQL to make sure it's a valid asc or desc
  defp validate_order(order) do
    Enum.member?(
      ~w(asc desc),
      order
    )
  end
end
```

In the `person_with_item_and_timer_count/2` function, two default parameters have been introduced: `sort_column` and `sort_order`. These parameters dictate which column the result should be sorted by and the direction of the sort, respectively.

The default values (`:person_id` for column and `:asc` for order) ensure that if no sorting criteria are provided when calling the function, it will default to sorting by `person_id` in ascending order.

To ensure that only valid column names and sorting orders are used in our SQL query (and to prevent potential SQL injection attacks), we need to validate these parameters:

```elixir
sort_column = to_string(sort_column)
sort_order = to_string(sort_order)

sort_column =
  if validate_sort_column(sort_column), do: sort_column, else: "person_id"

sort_order = if validate_order(sort_order), do: sort_order, else: "asc"
```

Here, the `sort_column` and `sort_order` parameters are first converted to strings. Then, the `validate_sort_column/1` and `validate_order/1` private functions are used to check if the provided values are valid. If they aren't, defaults are set.

The SQL query has been modified to include an ORDER BY clause as well using string interpolation to insert the parameters on the query after validating them.

The private function `validate_sort_column/1` and `validate_order/1` are similar, since they ensure that the provided column/order is one of the valid ones in our stats.

The `~w(...)` is a word list in Elixir, which creates a list of strings. The `Enum.member?/2` function checks if the provided value exists in this list.

By introducing these changes, you've made the `person_with_item_and_timer_count/2` function more versatile, allowing it to retrieve sorted results based on provided criteria. Additionally, by validating the input parameters, you've added an essential layer of security to prevent potential misuse or attacks.

Let's include now the sorting mechanism inside the TableComponent.

For that, we will create two template files that will be used as SVG with an arrow poiting up and another pointing down to include these on our table header's.

Create the following two files.

`lib/app_web/templates/table_component/arrow_down.html.heex`
```html
<span
  class="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200"
  data-test-id="arrow_down"
>
  <svg
    class="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fill-rule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clip-rule="evenodd"
    />
  </svg>
</span>
```

`lib/app_web/templates/table_component/arrow_up.html.heex`
```html
<%= if @invisible do %>
  <span
    class="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
    data-test-id="invisible_arrow_up"
  >
    <svg
      class="invisible ml-2 h-5 rotate-180 w-5 flex-none rounded text-gray-400 group-hover:visible group-focus:visible"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clip-rule="evenodd"
      />
    </svg>
  </span>
<% else %>
  <span
    class="ml-2 flex-none rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200"
    data-test-id="arrow_up"
  >
    <svg
      class="h-5 w-5 rotate-180"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clip-rule="evenodd"
      />
    </svg>
  </span>
<% end %>
```

These files are similar, the only difference is that the arrow_up will be invisible when there is no selection. We will create a method to deal with the show/hide of the arrows inside our `table_component_view.ex`.

Let's open this file and create the following methods:
```elixir
defmodule AppWeb.TableComponentView do
  use AppWeb, :view

  def render_arrow_down() do
    Phoenix.View.render(AppWeb.TableComponentView, "arrow_down.html", %{})
  end

  def render_arrow_up() do
    Phoenix.View.render(AppWeb.TableComponentView, "arrow_up.html", %{
      invisible: false
    })
  end

  def render_arrow_up(:invisible) do
    Phoenix.View.render(AppWeb.TableComponentView, "arrow_up.html", %{
      invisible: true
    })
  end
end
```

There are three methods added to render arrow icons:

- `render_arrow_down/0`: Renders a downward-pointing arrow, used to indicate descending sort order.
- `render_arrow_up/0`: Renders an upward-pointing arrow, used to indicate ascending sort order. By default, this arrow is visible.
- `render_arrow_up/:invisible`: An overloaded version of the above method, which renders the upward-pointing arrow but marks it as invisible.

The invisible attribute in the third method will be used as a conditional rendering in the `arrow_up.html` template to hide the arrow when invisible is set to `true`.

Let's update our `table_component.html.heex` template now, to include the arrows and the new Phoenix event that will be used to trigger the sorting mechanism.

Open the `table_component.html.heex` and make the following modifications:
```html
<table class="text-sm text-left text-gray-500 dark:text-gray-400 table-auto">
  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    <%= for column <- @column do %>
      <th
        scope="col"
        class="px-6 py-3 text-center cursor-pointer"
        phx-click="sort"
        phx-value-key={column.key}
      >
        <a href="#" class="group inline-flex">
          <%= column.label %>

          <%= if @sort_column == String.to_atom(column.key) do %>
            <%= if @sort_order == :asc do %>
              <%= render_arrow_up() %>
            <% else %>
              <%= render_arrow_down() %>
            <% end %>
          <% else %>
            <%= render_arrow_up(:invisible) %>
          <% end %>
        </a>
      </th>
    <% end %>
  </thead>
...
```

The `phx-click="sort"` attribute indicates that when a user clicks a header, the sort event will be triggered in the LiveView. The `phx-value-key` sends the key of the column (like person_id, num_items, etc.) to the server as the value of the clicked item, that will be used for determining which column to sort by.

```html
<%= if @sort_column == String.to_atom(column.key) do %>
  <%= if @sort_order == :asc do %>
    <%= render_arrow_up() %>
  <% else %>
    <%= render_arrow_down() %>
  <% end %>
<% else %>
  <%= render_arrow_up(:invisible) %>
<% end %>
```

This logic determines which arrow to display next to a column label:

- If the current sort column (`@sort_column`) matches the column's key, it means this column is the one currently being sorted.
  - Within this condition, if the sort order (`@sort_order`) is ascending (`:asc`), the upward-pointing arrow is displayed using the `render_arrow_up()` function.
  - If the sort order is not ascending, then the downward-pointing arrow is displayed using the `render_arrow_down()` function.
- If the current sort column does not match the column's key, an upward-pointing arrow in an invisible state is displayed using `render_arrow_up(:invisible)`. This gives a visual cue to the user that they can click to sort by this column.

The additions to this file enhance the table by adding sortable column headers. When a user clicks on a column header, the table's content is re-ordered based on that column. The sort arrows provide a clear visual indication of the current sort column and its direction (ascending or descending).

Now, we just need to update our Stats LiveView to include this new variables and logic.

Open the `stats_live.ex` and update to the following code:
```elixir
defmodule AppWeb.StatsLive do
...

  def mount(_params, _session, socket) do
    # subscribe to the channel
    if connected?(socket), do: AppWeb.Endpoint.subscribe(@stats_topic)

    person_id = get_person_id(socket.assigns)
    metrics = Item.person_with_item_and_timer_count()

    {:ok,
     assign(socket,
       person_id: person_id,
       metrics: metrics,
       sort_column: :person_id,
       sort_order: :asc
     )}
  end

...

  @impl true
  def handle_event("sort", %{"key" => key}, socket) do
    sort_column =
      key
      |> String.to_atom()

    sort_order =
      if socket.assigns.sort_column == sort_column do
        toggle_sort_order(socket.assigns.sort_order)
      else
        :asc
      end

    metrics = Item.person_with_item_and_timer_count(sort_column, sort_order)

    {:noreply,
     assign(socket,
       metrics: metrics,
       sort_column: sort_column,
       sort_order: sort_order
     )}
  end

...

  defp toggle_sort_order(:asc), do: :desc
  defp toggle_sort_order(:desc), do: :asc
end
```

In the `mount/3` function, two new assigns are initialized: `sort_column` and `sort_order`.
```elixir
sort_column: :person_id,
sort_order: :asc
```

- `sort_column`: Represents the column on which the table is currently sorted. By default, it's set to `:person_id`.
- `sort_order`: Represents the order in which the table is currently sorted. By default, it's set to `:asc` (ascending).

A new function, `handle_event/3`, has been added to handle the "sort" event, which is triggered when a user clicks on a table column header to sort by that column.

```elixir
def handle_event("sort", %{"key" => key}, socket) do
```

This function takes in an event payload with a key (the column to sort by) and the current socket.

- The provided key is converted to an atom to get the `sort_column`.
- The `sort_order` is determined using the `toggle_sort_order/1` function. If the clicked column (`sort_column`) is the same as the one currently being sorted, the sort order is toggled (from ascending to descending or vice versa). If it's a different column, the sort order is set to ascending by default.
- With the determined `sort_column` and `sort_order`, the function fetches the sorted metrics using `Item.person_with_item_and_timer_count/2`.
- Finally, the `socket` is updated with the new metrics and sorting parameters.

A private helper function, `toggle_sort_order/1`, has been introduced to toggle the sorting order:
```elixir
defp toggle_sort_order(:asc), do: :desc
defp toggle_sort_order(:desc), do: :asc
```

If the current order is ascending (`:asc`), it returns descending (`:desc`), and vice versa.

These modifications enhance the `AppWeb.StatsLive` module with dynamic sorting capabilities. Users can now click on table column headers to sort the table's content based on the chosen column, and the sort order will toggle between ascending and descending with each click.

Finally, we need to update our usage of the Table LiveComponent for the usage of these new sort variables.

Open the `stats_live.html.heex` file and make the following modifications:
```html
...

   <.live_component
      module={AppWeb.TableComponent}
      id="table_component"
      rows={@metrics}
      sort_column={@sort_column}
      sort_order={@sort_order}
      highlight={&is_highlighted_person?(&1, @person_id)}
    >
      <:column :let={metric} label="Id" key="person_id">
        <td class="px-6 py-4" data-test-id="person_id">
          <a href={person_link(metric.person_id)}>
            <%= metric.person_id %>
          </a>
        </td>
      </:column>

      <:column :let={metric} label="Items" key="num_items">
        <td class="px-6 py-4 text-center" data-test-id="num_items">
          <%= metric.num_items %>
        </td>
      </:column>

      <:column :let={metric} label="Timers" key="num_timers">
        <td class="px-6 py-4 text-center" data-test-id="num_timers">
          <%= metric.num_timers %>
        </td>
      </:column>

...
```

We are just passing the `sort_column` and `sort_order` to the live component to be used internally for the arrow logic.

> Remember the `key` attribute that we created before? It's used to determine which column was clicked and to trigger the sort event.

With that, we finished all of our tasks! Yay! Let's run the application and see our results:
```
mix s
```

Our final modification will be create tests for everything, let's update all tests to test the new features:

`test/app/item_test.exs`
```elixir
...
  describe "items" do
    ...
    @another_person %{text: "some text", person_id: 2, status: 2}
    ...

...

  test "Item.person_with_item_and_timer_count/0 returns a list of count of timers and items for each given person" do
    ...

    assert first_element.num_items == 2
    assert first_element.num_timers == 2

    assert NaiveDateTime.compare(
             first_element.first_inserted_at,
             item1.inserted_at
           ) == :eq

    assert NaiveDateTime.compare(
             first_element.last_inserted_at,
             item2.inserted_at
           ) == :eq
  end

  test "Item.person_with_item_and_timer_count/1 returns a list sorted in ascending order" do
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)

    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)
    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)

    # list person with number of timers and items
    result = Item.person_with_item_and_timer_count(:person_id)

    assert length(result) == 2

    first_element = Enum.at(result, 0)
    assert first_element.person_id == 1
  end

  test "Item.person_with_item_and_timer_count/1 returns a sorted list based on the column" do
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)

    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)
    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)

    # list person with number of timers and items
    result = Item.person_with_item_and_timer_count(:person_id, :desc)

    assert length(result) == 2

    first_element = Enum.at(result, 0)
    assert first_element.person_id == 2
  end

  test "Item.person_with_item_and_timer_count/1 returns a sorted list by person_id if invalid sorted column and order" do
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)
    {:ok, %{model: _, version: _version}} = Item.create_item(@valid_attrs)

    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)
    {:ok, %{model: _, version: _version}} = Item.create_item(@another_person)

    # list person with number of timers and items
    result =
      Item.person_with_item_and_timer_count(:invalid_column, :invalid_order)

    assert length(result) == 2

    first_element = Enum.at(result, 0)
    assert first_element.person_id == 1
  end
end
```

`test/app_web/live/components/table_component_test.exs`
```elixir
defmodule AppWeb.TableComponentTest do
  use AppWeb.ConnCase, async: true
  alias AppWeb.TableComponent
  import Phoenix.LiveViewTest

  @column [
    %{label: "Person Id", key: "person_id"},
    %{label: "Num Items", key: "num_items"}
  ]

  test "renders table correctly" do
    component_rendered =
      render_component(TableComponent,
        column: @column,
        sort_column: :person_id,
        sort_order: :asc,
        rows: []
      )

    assert component_rendered =~ "Person Id"
    assert component_rendered =~ "Num Items"

    assert component_rendered =~ "person_id"
    assert component_rendered =~ "num_items"

    assert component_rendered =~ "arrow_up"
    assert component_rendered =~ "invisible_arrow_up"
  end

  test "renders table correctly with desc arrow" do
    component_rendered =
      render_component(TableComponent,
        column: @column,
        sort_column: :person_id,
        sort_order: :desc,
        rows: []
      )

    assert component_rendered =~ "Person Id"
    assert component_rendered =~ "Num Items"

    assert component_rendered =~ "person_id"
    assert component_rendered =~ "num_items"

    assert component_rendered =~ "arrow_down"
    assert component_rendered =~ "invisible_arrow_up"
  end
end
```

`test/app_web/live/stats_live_test.exs`
```elixir
defmodule AppWeb.StatsLiveTest do
  alias App.DateTimeHelper
  
  ...

  test "display metrics on mount", %{conn: conn} do
    ...
      # Creating one timer
    started = NaiveDateTime.utc_now()
    {:ok, timer} = Timer.start(%{item_id: item.id, start: started})
    {:ok, _} = Timer.stop(%{id: timer.id})

    ...

    # two items and one timer expected
    assert page_live |> element("td[data-test-id=person_id]") |> render() =~
             "55"

    assert page_live |> element("td[data-test-id=num_items]") |> render() =~ "2"

    assert page_live |> element("td[data-test-id=num_timers]") |> render() =~
             "1"

    assert page_live
           |> element("td[data-test-id=first_inserted_at]")
           |> render() =~
             DateTimeHelper.format_date(started)

    assert page_live
           |> element("td[data-test-id=last_inserted_at]")
           |> render() =~
             DateTimeHelper.format_date(started)

    assert page_live
           |> element("td[data-test-id=total_timers_in_seconds]")
           |> render() =~
             ""
  end

  test "handle broadcast when item is created", %{conn: conn} do
    ...

    assert render(page_live) =~ "Stats"
    # num of items
    assert page_live |> element("td[data-test-id=num_items]") |> render() =~ "1"

    ...

    # num of items
    assert page_live |> element("td[data-test-id=num_items]") |> render() =~ "2"

    ...

    # num of items
    assert page_live |> element("td[data-test-id=num_items]") |> render() =~ "2"
  end

  test "handle broadcast when timer is created", %{conn: conn} do
    ...

    assert render(page_live) =~ "Stats"
    # num of timers
    assert page_live |> element("td[data-test-id=num_timers]") |> render() =~
             "0"
    ...

    # num of timers
    assert page_live |> element("td[data-test-id=num_timers]") |> render() =~
             "1"

    ...

    # num of timers
    assert page_live |> element("td[data-test-id=num_timers]") |> render() =~
             "1"
  end

  ...

  test "sorting column when clicked", %{conn: conn} do
    {:ok, %{model: _, version: _version}} =
      Item.create_item(%{text: "Learn Elixir", status: 2, person_id: 1})

    {:ok, %{model: _, version: _version}} =
      Item.create_item(%{text: "Learn Elixir", status: 4, person_id: 2})

    {:ok, page_live, _html} = live(conn, "/stats")

    # sort first time
    result =
      page_live |> element("th[phx-value-key=person_id]") |> render_click()

    [first_element | _] = Floki.find(result, "td[data-test-id=person_id]")

    assert first_element |> Floki.text() =~ "2"

    # sort second time
    result =
      page_live |> element("th[phx-value-key=person_id]") |> render_click()

    [first_element | _] = Floki.find(result, "td[data-test-id=person_id]")

    assert first_element |> Floki.text() =~ "1"
  end
end
```

Let's run the tests:
```
mix t
```

That's it! I'll let the tests file for you to explore and test different cases if you want.

Congratulations!
