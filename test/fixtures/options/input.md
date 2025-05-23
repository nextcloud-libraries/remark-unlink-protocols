## TOC

Parsed with option `{ except: ["other"] }`.
So only keeping the `other:...` links.

- [section 1](#section-1)
- [section 2](#section-2)

## https is stripped

Section [content][1] may include some [links](https://domain.name/path).

[1]: https://domain.name/path

## http is stripped

Section [content][2] may include some [links](http://domain.name/path).

[2]: http://domain.name/path

## images

![some images are here also](https://gif.com/1.gif)

More content.

## other protocols

Section [content][3] may include some [links](test://domain.name/path).

## empty other protocol

[](other://test.me)

[3]: other://domain.name/path
