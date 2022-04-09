# alfred-fzy-chrome-history

Fuzzy search your chrome's history.

This workflow uses:

- [Fzy](https://github.com/jhawthorn/fzy.js) for fuzzy searching.
- [Sqlite](https://www.npmjs.com/package/sqlite) for reading chrome History's database.

This workflow is similar to the workflow I created at https://github.com/tuan/alfred-fzf-chrome-history, the main difference is that this workflow uses FZY instead of FZF.

I found that the javascript implementation of FZY to be more responsive than the javascript port of FZF I use in the other workflow.

This workflow is what I'm currently using, the FZF workflow is still there for people who prefer FZF.

## Installation

```sh
npm i -g alfred-fzy-chrome-history
```

## Usage

## Prefix

Default prefix to trigger the workflow is: `ch`

### Global search

`ch <fuzzy search keywords>`

### Scope search

You can limit the search scope to a particular domain by specifying the domain keywords with @ prefix.

Note:

1. Domain keywords use exact match algorithm. So `@git` will only match `github.com` or `gitlab.com`, but won't match `<g>ofor<it>.com`.
2. You can specify multiple domain keywords in your query to incrementally fine tune your search. For example: `too broad @git need narrowing down to @hub and only dev tld @dev` will search only domains that match `git.*hub.*dev` such as `github.dev`

Example:

1. `ch @git <fuzzy search keywords>` will perform the search for all pages whose domain includes the word `git`.
2. `ch <fuzzy search keywords> @git` does the same thing as above.
3. `ch @git <fuzzy search keywords> @lab` will perform the search for all pages whose domain is `git.*lab`, for example: `gitlab.com` instead of `github.com`

<img src='media/screenshot.png'/>
