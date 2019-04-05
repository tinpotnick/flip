'use babel';

/*!md
# Flip - flip the view

__Source files should be understandable and look good__

Press ctrl-alt-o

I am a big fan of the source code should be self documenting. This is not always possible with actual code.

This plugin is designed to flip the view of source code. Encourouge the user to document the source file fully - make sure the source file is the documentation.

With this plugin, you can view the file inverted. So the comments in markdown become the focus, code is put into code blocks and markdown can be used to prettify the comments.

This file is heavily commented to show the idea.

## Usage

In a source file which supports C style comments add a comment opener followed by !md to indicate the comment supports __markdown__ text.

## Showdown Markdown

To get going with this little project quickly, Showdown JS along with highlight.js to fomart code.

*Is there a better way to do this? Does the core f atom provide this?*

### Bullet Points
* These are bullet points
    * first
    * second
* back to main

### Tables

| Heading    |    Heading   | Heading |
|:------|:-------:|--------:|
| 100   | [a][1]  | ![b][2] |
| *foo* | **bar** | ~~baz~~ |

### Emojis
[Link to a list of the supported emojies](https://github.com/showdownjs/showdown/wiki/Emojis)

:+1:

### TODO Lists
- [X] Task 1
- [] Task 2

### Github references
@tinpotnick

### Feedback
Feedback is welcome. Please be gentle, I picked up the Atom flight manual on writing a day or so ago so I am not sure how well it is written, and I know there are some things (performance) which could be done better - however I wanted to hack this out to see if it is a good idea.

Personally, I think github should support this type of view in source code view. Also, if I had a lot more time on my hands, I would make the editor work like this!

### Init
*/

const highlight = require( "highlight.js" );
const showdown = require( "showdown" );
const path = require( "path" );


export default class FlipView
{

/*!md
# Class constructor.
Create an element and do ther required stuff.

| Argument | Desctiption |
|:--|:--|
|serializedState|The saved serialzed state is passed back in.|

| Return Values  |
|:--|
|Nothing|
*/
  constructor(serializedState)
  {
    this.lastondid = null;
    showdown.setFlavor( "github" );

    this.ele = this.element = document.createElement('div');
    this.ele.className = "flip";

    atom.workspace.onDidChangeActivePaneItem( this.onchangeeditor.bind( this ) );
    this.onchangeeditor();
  }
/*!md
# onchangeeditor
When we change editors, we need to subscribe to the new one for events.
*/
  onchangeeditor()
  {
    if( null != this.lastondid )
    {
      this.lastondid.dispose();
    }

    var editor = atom.workspace.getActiveTextEditor();
    if( undefined != editor )
    {
      this.lastondid = editor.onDidChange( this.refreshview.bind( this ) );
      this.refreshview();
    }
  }

/*!md
# refreshview
We call this everytime a view has changed or an editor has been updated. It regenerates the view if it is open.

| Return Values  |
|:--|
|Nothing|
*/
  refreshview()
  {
    const editor = atom.workspace.getActiveTextEditor();

    var ext = path.extname( editor.getPath() );
    console.log( ext )
    var text = editor.getText();
    var index;
    var html = "";
    var firstrun = true;

    var converter = new showdown.Converter(
      {
        tables: true,
        tasklists: true,
        emoji: true,
        underline: true,
        ghMentions: true,
        strikethrough: true
      } );

    if( ".md" == ext )
    {
      html += converter.makeHtml( text );
      text = "";
    }

    while( -1 != ( index = text.indexOf( "/*!" + "md" ) ) )
    {
      if ( 0 != index && !firstrun )
      {
        var code = text.substring( 0, index );
        var h = highlight.highlightAuto( code, [ "js", "php", "c", "c++", "sql" ] );
        html += "<pre class='flip'><code>" + h.value + "</code></pre>"
      }
      firstrun = false;

      text = text.substring( index + 5, text.length );
      index = text.indexOf( "*/" );
      if( -1 == index )
      {
        index = text.length;
      }

      commenttext = text.substring( 0, index );
      text = text.substring( index + 2, text.length );

      var code = text.substring( index + 3, text.length );

      html += converter.makeHtml( commenttext );
    }

    if ( 0 != text.length )
    {
      var h = highlight.highlightAuto( text, [ "js", "php" ] );
      html += "<pre class='flip'><code>" + h.value + "</code></pre>"
    }

    this.ele.innerHTML = html;
  }

/*!md
# And the rest.
A few other functions which are all self explanatory below.
*/
  serialize()
  {

  }

  // Tear down any state and detach
  destroy()
  {
    this.element.remove();
  }

  getElement()
  {
    return this.element;
  }

  getTitle()
  {
    // Used by Atom for tab text
    return "Flip View";
  }

  getURI()
  {
    // Used by Atom to identify the view when toggling.
    return 'atom://flip';
  }

  getDefaultLocation()
  {
    return "right";
  }

  getAllowedLocations()
  {
    return [ "left", "right", "bottom" ];
  }
}
