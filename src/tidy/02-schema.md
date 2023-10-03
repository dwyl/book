# Create `object` schema

As outlined in 
[tidy#1](https://github.com/dwyl/tidy/issues/1),
our goal is to allow `people`
wanting to help `tidy` the house,
to submit the following data:

## `object`

+ `name` - the name of the `object` you need help with
+ `desc` - brief description of the `object` 
    including any salient features.
+ `color` - a `string` for main color of the `object` e.g. "green"
+ `person_id` - the `id` of the `person` who created the `object` record.
+  `owner_id` - `id` of the `person` who _owns_ the `object`
+ `location` - a `string` describing _where_ the `object` belongs.
+ `status` - a `int` representing the current `status` of the `object` record. 

> **Note**: we will need to map out the `statuses` required for this App and add them to our list. 


## `images`

An `object` can have one or more `images`.
These are used identify and categorize the `object`. 

+ `obj_id` - the `id` of the `object` the `image` belongs to.
+ `person_id` - `id` of the `person` who uploaded the `image`.
+ `url` - the `URL` of the `image` that was uploaded to 
[`S3`](https://github.com/dwyl/imgup/issues/98)


## `comments`

An `object` can have one ore more `comments` associated with it.
This allows `people` to discuss the `object` in a conversational style
similar to what they are already used to 
from using **Instant Messaging**. 

+ `obj_id` - the `id` of the `object` the `image` belongs to.
+ `person_id` - `id` of the `person` who uploaded the `image`.
+ `text` - the `string` of their comment. 


## 4.1 `gen.live`

Using the 
[`mix phx.gen.live`](https://hexdocs.pm/phoenix/Mix.Tasks.Phx.Gen.Schema.html)
command, 
run: 
```sh
mix phx.gen.live Objects Object objects name:binary desc:binary color:binary person_id:integer owner_id:integer location:binary status:integer
```

You should expect to see output similar to the following:

```sh

```

Those are a _lot_ of new files. 😬
Let's take a moment to go through them 
and understand what each file is doing.

### ``
