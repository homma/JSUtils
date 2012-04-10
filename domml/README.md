
# What is DOMML.js?
DOMML.js is an notation of DOM data in JavaScript syntax.
You can write DOM data as JavaScript objects instead of HTML.

# Examples

## #1
- simple div data.
- tag => html tag name
- id => id
- class => class
- style => style

- a DOMML data:
    {
        'tag': 'div',
         'id': 'divid',
      'class': 'divclass',
      'style': { 'border': 'solid 1px black' }
    }
- is equivalent to this html:
    <div id='divid' class='divclass' style='border: solid 1px black'></div>

## #2
- content => a content of the tag
- this DOMML data
    {
           'tag': 'div',
      'content': 'a div content'
    }
- is equivalent to this html.
    <div>a div content</div>

## #3
- contains => defines DOM child nodes.
- this DOMML data
    {
            'tag': 'ul',
       'contains': [
          { 'tag': 'li', 'content': 'item 1' },
          { 'tag': 'li', 'content': 'item 2' }]
    }
- is equivalent to this html.
    <ul><li>item one</li><li>item two</li></ul>

## #4
- when 'tag' entry is omitted, it is handled as div tag.
- this DOMML data
    {
      'content': 'some text'
    }
- is equivalent to this html.
    <div>some text</div>

## #5 Event Handlers
- TBD

## #6 Templating
- TBD

# Similar Projects

## Backbone.View
- http://backbonejs.org/
- has functionarity of creating DOM element from JSON data
- has an easy to use event handler binding
- lacks a functionarity of creating nested view in declarative manner

## enyo.js Component
- http://enyojs.com/
- has functionarity of creating DOM element from JSON data
- has an easy to use event handler binding
- making nested view in declarative manner is easy.

## microjungle.js
- https://github.com/deepsweet/microjungle
- has functionarity of creating DOM element from JSON data
- you can define HTML tags as JavaScript Array.

## JSONML Object Format
- http://jsonml.org/
- http://en.wikipedia.org/wiki/JsonML
- is a markup language to generate HTML documents from JSON data

