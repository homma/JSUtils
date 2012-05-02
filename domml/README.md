
# What is DOMML?
With DOMML, you can write DOM as JSON in JavaScript files instead of writing HTML tags.  Since DOMML data are JavaScript codes, they can be written in multiple separated files, they are easily manipulatable from programs and they are much easier to read than HTML tags if you are a programmer.

# Usage
Use DOMML#create to convert a DOMML data to a DOM element.

```javascript
  var view = { 'tag': 'div', 'content': 'a div content' };

  var elem = DOMML.create(view);
  document.body.appendChild(elem);
```

# Examples

## Example #1 defining a simple div data.

- tag => html tag name
- id => id
- class => class
- style => style

a DOMML data:

```javascript
    {
        'tag': 'div',
         'id': 'divid',
      'class': 'divclass',
      'style': { 'border': 'solid 1px black' }
    }
```

is equivalent to this html:

```html
    <div id='divid' class='divclass' style='border: solid 1px black'></div>
```

## Example #2 defining a content data.

- content => a content of the tag

this DOMML data

```javascript
    {
           'tag': 'div',
       'content': 'a div content'
    }
```

is equivalent to this html.

```html
    <div>a div content</div>
```

## Example #3 defining nested tags.

- contains => child nodes.

this DOMML data

```javascript
    {
            'tag': 'ul',
       'contains': [
          { 'tag': 'li', 'content': 'item 1' },
          { 'tag': 'li', 'content': 'item 2' }]
    }
```

is equivalent to this html.

```html
    <ul><li>item one</li><li>item two</li></ul>
```

## Example #4 div is the default tag.

when the 'tag' entry is omitted, it is handled as div tag.

this DOMML data

```javascript
    {
      'content': 'some text'
    }
```

is equivalent to this html.

```html
    <div>some text</div>
```

## Example #5 Event Handlers
- TBD

## Example #6 Templating
- TBD

# Similar Projects

## Backbone.View
- http://backbonejs.org/
- has a functionarity of creating DOM elements from JavaScript objects
- has an easy to use event handler binding facility
- lacks a functionarity of creating nested views in a declarative manner

## enyo.js Component
- http://enyojs.com/
- has a functionarity of creating DOM elements from JavaScript objects
- has an easy to use event handler binding facility
- making nested views in a declarative manner is easy.

## microjungle.js
- https://github.com/deepsweet/microjungle
- has a functionarity of creating DOM elements from JSON data
- heavily utilizes the JavaScript Array literal format

## JSONML Object Format
- http://jsonml.org/
- http://en.wikipedia.org/wiki/JsonML
- is a markup language to generate HTML documents from JSON data

