# Create `attendee` schema

The goal is to allow `people` attending **_Awesome_ Conf** - the ***`attendees`*** -
to submit the following data:

+ `first_name` - how we greet you. Will appear on your conference pass.
+ `last_name` - your family name. Will appear on you conference pass.
+ `email` - to confirm attendance
+ `phone_number`  - to verify your access when attending the secret event.
+ `address_line_1` - so we can send the welcome pack and prizes
+ `address_line_2` - if your address has multiple lines.
+ `postcode` - for the address.
+ `gender` - for venue capacity planning.
+ `diet_pref` - dietary preferences for meals and snacks provided at the conference.
+ `website` - share your awesomeness and have it as a QR code on your conference pass.
+ `desc` - brief description of your awesome project.
+ `feedback` - Feedback or suggestions


## 4.1 `gen.live`

Using the 
[`mix phx.gen.live`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command, 
run: 
```sh
mix phx.gen.live Accounts Attendee attendees first_name:binary last_name:binary email:binary phone_number:binary address_line_1:binary address_line_2:binary postcode:binary gender:binary diet_pref:binary website:binary desc:binary feedback:binary
```

You should expect to see output similar to the following:

```sh
* creating lib/fields_demo_web/live/attendee_live/show.ex
* creating lib/fields_demo_web/live/attendee_live/index.ex
* creating lib/fields_demo_web/live/attendee_live/form_component.ex
* creating lib/fields_demo_web/live/attendee_live/index.html.heex
* creating lib/fields_demo_web/live/attendee_live/show.html.heex
* creating test/fields_demo_web/live/attendee_live_test.exs
* creating lib/fields_demo/accounts/attendee.ex
* creating priv/repo/migrations/20230928032757_create_attendees.exs
* creating lib/fields_demo/accounts.ex
* injecting lib/fields_demo/accounts.ex
* creating test/fields_demo/accounts_test.exs
* injecting test/fields_demo/accounts_test.exs
* creating test/support/fixtures/accounts_fixtures.ex
* injecting test/support/fixtures/accounts_fixtures.ex

Add the live routes to your browser scope in lib/fields_demo_web/router.ex:

    live "/attendees", AttendeeLive.Index, :index
    live "/attendees/new", AttendeeLive.Index, :new
    live "/attendees/:id/edit", AttendeeLive.Index, :edit

    live "/attendees/:id", AttendeeLive.Show, :show
    live "/attendees/:id/show/edit", AttendeeLive.Show, :edit


Remember to update your repository by running migrations:

    $ mix ecto.migrate
```

Those are a _lot_ of new files. 😬
Let's take a moment to go through them 
and understand what each file is doing.

### `lib/fields_demo_web/live/attendee_live/show.ex`
