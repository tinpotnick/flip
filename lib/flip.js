'use babel';

/*!md
# Flip - flip the view. See flip-view.js for more info.
*/

import FlipView from './flip-view';
import { CompositeDisposable, Disposable } from 'atom';

export default
{

  activate(state)
  {
    this.subscriptions = new CompositeDisposable(
      // Add an opener for our view.
      atom.workspace.addOpener( uri =>
      {
        if ( uri === "atom://flip" )
        {
          return new FlipView();
        }
      }),

      // Register command that toggles this view
      atom.commands.add( "atom-workspace", {
        "flip:toggle": () => this.toggle()
      }),

      // Destroy any ActiveEditorInfoViews when the package is deactivated.
      new Disposable(() => {
        atom.workspace.getPaneItems().forEach(item => {
          if (item instanceof FlipView ) {
            item.destroy();
          }
        });
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },


  toggle()
  {
    atom.workspace.toggle( "atom://flip" );
  }

};
