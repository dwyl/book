# Reordering `items` in a `list`

The `people` who 
[tested](https://github.com/dwyl/mvp/issues/140)
the `MVP`
noted that the ability to **_organise_ their `items`**
as an **_essential_ feature**:
[dwyl/mvp#145](https://github.com/dwyl/mvp/issues/145)

With the addition of `lists`
we now have a way of _organising_ our `items`
using the `list.seq` or `sequence`. 

This chapter will take you through how we implented reordering
in the `MVP` from first principals.

> **Note**: There is quite a lot to cover in this chapter,
so we have created two _standalone_
tutorials:
[drag-and-drop](https://github.com/dwyl/learn-alpine.js/blob/main/drag-and-drop.md)
and 
[cursor-tracking](https://github.com/dwyl/phoenix-liveview-realtime-cursor-tracking-tutorial)
which detail the mechanics of dragging and dropping `items`
and cursor tracking across browsers/devices.
If you are totally new to drag-and-drop,
we suggest following at least that one for full context.

At the end of this chapter you will be able to reorder the `items` in a `list`
with cursor tracking and `item` highlighting:

<img width="1728" alt="mvp-reordering-hero-screenshot" 
    src="https://github.com/dwyl/mvp/assets/194400/13753b38-2553-4d59-beb9-54bb9d16e0e0">



## Get/Set `list.cid` in `mount/3`

In order for us to know which `list` 
the `person` is viewing - and thus reordering - 
we need to add it to the `socket.assigns` in the `mount/3` function.
Open the `lib/app_web/live/app_live.ex` file 
and locate the `mount/3` function.

Add the following lines to the body:

```elixir
# Create or Get the "all" list for the person_id
all_list = App.List.get_all_list_for_person(person_id)
# Temporary function to add All *existing* items to the "All" list:
App.List.add_all_items_to_all_list_for_person_id(person_id)
```

This is invoking two functions we previously created in `lists`.

Then in the returned tuple:

```elixir
{:ok,
     assign(socket,
       items: items,
       etc.
```

Make sure to add the line:

```elixir
       list_cid: all_list.cid,
```

That will ensure that we know the `list.cid` 
later when the `person` reorders their `items`.



## Moving `items` in the interface

There is quite a lot of code required 
to move `items` in the interface,
we need to update 4 files.


### Update the `<li>`

In the `lib/app_web/live/app_live.html.heex` file,
locate the `<ul>` (unordered list) defintion:

```html
  <!-- List of items with inline buttons and controls -->
  <ul class="w-full">
    <%= for item <- filter_items(@items, @filter, @filter_tag) do %>
      <li
        data-id={item.id}
        class="mt-2 flex w-full border-t border-slate-200 py-2"
      >
```
Replace it with the following:

```html
  <!-- List of items with inline buttons and controls -->
  <ul id="items" phx-hook="Items" x-data="{selectedItem: null}" class="w-full">
    <%= for item <- filter_items(@items, @filter, @filter_tag) do %>
      <li
        id={"item-#{item.id}"}
        data-id={item.id}
        class={"mt-2 flex flex-col w-full border-t border-slate-200 py-2 item 
            #{if item.id == @editing do 'cursor-default' else 'cursor-grab' end}"}
        draggable={"#{if item.id == @editing do 'false' else 'true' end}"}
        x-data="{selected: false}"
        x-on:dragstart="selected = true; $dispatch('highlight', {id: $el.id}); selectedItem = $el"
        x-on:dragend="selected = false; $dispatch('remove-highlight', {id: $el.id}); selectedItem = null; $dispatch('update-indexes', {fromItemId: $el.dataset.id})"
        x-bind:class="selected ?? 'cursor-grabbing'"
        x-on:dragover.throttle="$dispatch('dragoverItem', {selectedItemId: selectedItem.id, currentItem: $el})"
        data-highlight={JS.add_class("bg-teal-300")}
        data-remove-highlight={JS.remove_class("bg-teal-300")}
      >
```

There's a _lot_ going on in this definition.
But it's all related to 5 key areas:
1. _Select_ an `item` to be moved/reordered
2. _Add_ a highlight when an `item` is selected
3. _Display) the appropriate `cursor-grabbing` class when the `item` is selected.
4. _Dispatch_ the `dragoverItem` event so that other connected clients can see the `item` being moved
5. _Remove_ the `highlight` when the `item` is no longer selected.


> **Note**: if you feel this section could benefit from further explanation,
please _first_ read: 
[drag-and-drop](https://github.com/dwyl/learn-alpine.js/blob/main/drag-and-drop.md)
and 
[cursor-tracking](https://github.com/dwyl/phoenix-liveview-realtime-cursor-tracking-tutorial)
And if anything is still unclear, 
please open an issue:
[dwyl/book/issues](https://github.com/dwyl/book/issues)


## Add `JS` event handling code:

In the `assets/js/app.js` file,
add the following code:

```js
// Drag and drop highlight handlers
window.addEventListener("phx:highlight", (e) => {
  document.querySelectorAll("[data-highlight]").forEach(el => {
    if(el.id == e.detail.id) {
        liveSocket.execJS(el, el.getAttribute("data-highlight"))
    }
  })
})

// Item id of the destination in the DOM
let itemId_to;

let Hooks = {}
Hooks.Items = {
  mounted() {
    const hook = this

    this.el.addEventListener("highlight", e => {
      hook.pushEventTo("#items", "highlight", {id: e.detail.id})
      // console.log('highlight', e.detail.id)
    })

    this.el.addEventListener("remove-highlight", e => {
      hook.pushEventTo("#items", "removeHighlight", {id: e.detail.id})
      // console.log('remove-highlight', e.detail.id)
    })

    this.el.addEventListener("dragoverItem", e => {
      // console.log("dragoverItem", e.detail)
      const currentItemId = e.detail.currentItem.id
      const selectedItemId = e.detail.selectedItemId
      if( currentItemId != selectedItemId) {
        hook.pushEventTo("#items", "dragoverItem", {currentItemId: currentItemId, selectedItemId: selectedItemId})
        itemId_to = e.detail.currentItem.dataset.id
      }
    })

    this.el.addEventListener("update-indexes", e => {
      const item_id = e.detail.fromItemId 
      const list_ids = get_list_item_cids()
      console.log("update-indexes", e.detail, "list: ", list_ids)
      // Check if both "from" and "to" are defined
      if(item_id && itemId_to && item_id != itemId_to) {
        hook.pushEventTo("#items", "update_list_seq", 
          {seq: list_ids})
      }
      
      itemId_to = null;
    })
  }
}

/**
 * `get_list_item_ids/0` retrieves the full `list` of visible `items` form the DOM
 * and returns a String containing the IDs as a space-separated list e.g: "1 2 3 42 71 93"
 * This is used to determine the `position` of the `item` that has been moved.
 */
function get_list_item_cids() {
  console.log("invoke get_list_item_ids")
  const lis = document.querySelectorAll("label[phx-value-cid]");
  return Object.values(lis).map(li => {
    return li.attributes["phx-value-cid"].nodeValue
  }).join(",")
}

window.addEventListener("phx:remove-highlight", (e) => {
  document.querySelectorAll("[data-highlight]").forEach(el => {
    if(el.id == e.detail.id) {
        liveSocket.execJS(el, el.getAttribute("data-remove-highlight"))
    }
  })
})

window.addEventListener("phx:dragover-item", (e) => {
  console.log("phx:dragover-item", e.detail)
  const selectedItem = document.querySelector(`#${e.detail.selected_item_id}`)
  const currentItem = document.querySelector(`#${e.detail.current_item_id}`)

  const items = document.querySelector('#items')
  const listItems = [...document.querySelectorAll('.item')]

  if(listItems.indexOf(selectedItem) < listItems.indexOf(currentItem)){
    items.insertBefore(selectedItem, currentItem.nextSibling)
  }

  if(listItems.indexOf(selectedItem) > listItems.indexOf(currentItem)){
    items.insertBefore(selectedItem, currentItem)
  }
})
```

Again, there's a fair amount of code there 
so take a moment to step through it 
and understand what each event listener does.




## Handle event in `LiveView`

Back in the `LiveView` file,
`lib/app_web/live/app_live.ex`
add the following event handlers:

```elixir
 @impl true
  def handle_event("highlight", %{"id" => id}, socket) do
    # IO.puts("highlight: #{id}")
    AppWeb.Endpoint.broadcast(@topic, "move_items", {:drag_item, id})
    {:noreply, socket}
  end

  @impl true
  def handle_event("removeHighlight", %{"id" => id}, socket) do
    # IO.puts("removeHighlight: #{id}")
    AppWeb.Endpoint.broadcast(@topic, "move_items", {:drop_item, id})
    {:noreply, socket}
  end

  @impl true
  def handle_event(
        "dragoverItem",
        %{
          "currentItemId" => current_item_id,
          "selectedItemId" => selected_item_id
        },
        socket
      ) do
    # IO.puts("285: current_item_id: #{current_item_id}, selected_item_id: #{selected_item_id} | #{Useful.typeof(selected_item_id)}")
    AppWeb.Endpoint.broadcast(
      @topic,
      "move_items",
      {:dragover_item, {current_item_id, selected_item_id}}
    )

    {:noreply, socket}
  end

  @impl true
  def handle_info(
        %Broadcast{
          event: "move_items",
          payload: {:dragover_item, {current_item_id, selected_item_id}}
        },
        socket
      ) do
    # IO.puts(
    #   "cur_item_id: #{current_item_id}, selected_item_id: #{selected_item_id}"
    # )

    {:noreply,
     push_event(socket, "dragover-item", %{
       current_item_id: current_item_id,
       selected_item_id: selected_item_id
     })}
  end

  @impl true
  def handle_info(
        %Broadcast{event: "move_items", payload: {:drag_item, item_id}},
        socket
      ) do
    {:noreply, push_event(socket, "highlight", %{id: item_id})}
  end

  @impl true
  def handle_info(
        %Broadcast{event: "move_items", payload: {:drop_item, item_id}},
        socket
      ) do
    {:noreply, push_event(socket, "remove-highlight", %{id: item_id})}
  end


  @impl true
  def handle_event(
        "update_list_seq",
        %{"seq" => seq},
        socket
      ) do
    list_cid = get_list_cid(socket.assigns)
    person_id = get_person_id(socket.assigns)
    App.List.update_list_seq(list_cid, person_id, seq)
    {:noreply, socket}
  end
```

### Handle the `update_list_seq` event

All the `highlight`, `remove-highlight` and `move_items` 
handlers are for presentation and synching between clients.
The handler that performs the actual `list` updating is:


```elixir
  @impl true
  def handle_event(
        "update_list_seq",
        %{"seq" => seq},
        socket
      ) do
    list_cid = get_list_cid(socket.assigns)
    person_id = get_person_id(socket.assigns)
    App.List.update_list_seq(list_cid, person_id, seq)
    {:noreply, socket}
  end
```

This receives the `seq` (sequence of `item.cid`)
from the client and and updates the `list.seq`
using the previously defined `update_list_seq/3` function.

With this code in place we now have everything we need for reordering `items` on a _single_ `list`. 
Try it!


## Add a Test!

To ensure this feature is tested,
open the 
`test/app_web/live/app_live_test.exs`
file and add the following test:

```elixir
  test "Drag and Drop item", %{conn: conn} do
    person_id = 0
    # Creating Three items
    {:ok, %{model: item}} =
      Item.create_item(%{text: "Learn Elixir", person_id: person_id, status: 2})

    {:ok, %{model: item2}} =
      Item.create_item(%{ text: "Build Awesome App", person_id: person_id, status: 2})

    {:ok, %{model: item3}} =
      Item.create_item(%{ text: "Profit", person_id: person_id, status: 2})

    # Create "all" list for this person_id:
    list = App.List.get_all_list_for_person(person_id)

    # Add all items to "all" list:
    App.List.add_all_items_to_all_list_for_person_id(person_id)

    # Render LiveView
    {:ok, view, _html} = live(conn, "/")

    # Highlight broadcast should have occurred
    assert render_hook(view, "highlight", %{"id" => item.id})
      |> String.split("bg-teal-300")
      |> Enum.drop(1)
      |> length() > 0

    # Dragover and remove highlight
    render_hook(view, "dragoverItem", %{
      "currentItemId" => item2.id,
      "selectedItemId" => item.id
    })

    assert render_hook(view, "removeHighlight", %{"id" => item.id})

    # reorder items:
    render_hook(view, "updateIndexes", %{
      "seq" => "#{item.cid},#{item2.cid},#{item3.cid}"
    })

    all_list = App.List.get_all_list_for_person(person_id)
    seq = App.List.get_list_seq(all_list)
    pos1 = Enum.find_index(seq, fn x -> x == "#{item.cid}" end)
    pos2 = Enum.find_index(seq, fn x -> x == "#{item2.cid}" end)
    # IO.puts("#{pos1}: #{item.cid}")
    # IO.puts("#{pos2}: #{item2.cid}")

    assert pos1 < pos2

    # Update list_item.seq:
    {:ok, %{model: list}} = App.List.update_list_seq(list.cid, person_id, 
        "#{item.cid},#{item3.cid},#{item2.cid}")
    new_seq = list.seq |> String.split(",")
    # dbg(new_seq)
    pos2 = Enum.find_index(new_seq, fn x -> x == "#{item2.cid}" end)
    pos3 = Enum.find_index(new_seq, fn x -> x == "#{item3.cid}" end)
    assert pos3 < pos2
  end
```

Again, there's a _lot_ going on in this test 
because it's testing for 
both the `highlight` 
_and_ the update of the `seq` (sequence of `item.cid`) in the `list`.
Take a momemnt to step through it and if you have any questions, ask!