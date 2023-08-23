# Use `cid` for `items`

By default the `items` table uses an auto-incrementing (`Serial`) 
for the `id` (Primary Key):

![items-id-integer](https://github.com/dwyl/mvp/assets/194400/d3020e53-2ad8-43ff-b0ed-95251ee21a87)

This is fine for a _server_-side rendered app 
with a _single_ relational database instance.
But our ambition has always been 
to build a mobile + offline-first distributed App.

