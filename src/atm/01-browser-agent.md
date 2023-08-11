# Parse and Store Browser User Agent String

The _first_ data we want to parse and store 
is the Web Browser 
[User Agent](https://en.wikipedia.org/wiki/User_agent)
so that we know what devices and browsers are visiting.

There is a lot of info about User Agents on **MDN**:
[developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent)
recommended reading for the curious.

For our purposes 
we only need to extract the `user_agent` data that interest us
and thankfully, 
[`@mneudert`](https://github.com/mneudert)
has created a handy library we can use:
[**`ua_inspector`**](https://github.com/elixir-inspector/ua_inspector)

## `ua_inspector` Usage Example

From the `ua_inspector` docs we get the following sample code/output:

```elixir
iex> UAInspector.parse("Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53")
%UAInspector.Result{
  client: %UAInspector.Result.Client{
    engine: "WebKit",
    engine_version: "537.51.1",
    name: "Mobile Safari",
    type: "browser",
    version: "7.0"
  },
  device: %UAInspector.Result.Device{
    brand: "Apple",
    model: "iPad",
    type: "tablet"
  },
  os: %UAInspector.Result.OS{
    name: "iOS",
    platform: :unknown,
    version: "7.0.4"
  },
  user_agent: "Mozilla/5.0 (iPad; CPU OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B554a Safari/9537.53"
}
```

Additionally there is following sample output for a non-browser agent (`Google Bot`):

```elixir
iex> UAInspector.parse("Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36")
%UAInspector.Result.Bot{
  category: "Search bot",
  name: "Googlebot",
  producer: %UAInspector.Result.BotProducer{
    name: "Google Inc.",
    url: "http://www.google.com"
  },
  url: "http://www.google.com/bot.html",
  user_agent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Safari/537.36"
}
```




From this sample output 
we can extract the following fields:

+ `engine`: `String` e.g: "WebKit"
+ `engine_version`: `String` e.g: "537.51.1" - sadly we can't store this as `float` unless we lose the last digit ...
+ `name`: `String` e.g: "Mobile Safari"
+ `version`: `Float` e.g: "7.0" - we will _parse_ this `float` so that we can run queries on it.
+ `brand`: `String` e.g: "Apple"
+ `model`: `String` e.g: "iPad"
+ `device_type`: `String` e.g: "tablet"
+ `os_name`: `String` e.g: "iOS"
+ `platform`: `String` e.g: "unknown" - `Atom.to_string(:unknown)`
+ `os_version`: `String` e.g: "7.0.4"
+ `url`: `String` e.g: "http://www.google.com/bot.html" - used by non-human agents; blank if null.
+ `user_agent`: `String`, the _full_ agent string.
  Even though `ua_inspector` does a good job of parsing the `user_agent`,
  we are storing the _full_ `user_agent` string 
  so that we can sense-check the parsed data when needed.

Fields we will ignore:

+ `type`: `String` e.g: "browser" - we will skip this field as it's implied. 
+ 
