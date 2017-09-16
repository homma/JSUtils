/*
 * @author Daisuke Homma
 */

{ // namespace boundary

// change parent object as you like.
// default is jsutils or window.
const lib = jsutils || window;

//// CommandManager Interface
// addCommand : add CommandObject and execute
// undo : undo execution
// redo : redo execution

//// CommandObject Layout
// cmd = {
//   transactionBoundary: Boolean,
//   do: Function,         // () => { fun(arg) }
//   undo: Function,       // () => { fun(arg) }
//   description: String,  // command_name, arg
// }

lib.CommandManager = function {

  tihs.redoQueue = [];
  this.undoQueue = [];

  this.debug = false;

}

lib.CommandManager.prototype.addCommand = function(cmdObject) {

  // clear redo entry
  this.redoQueue = [];

  // execute command
  if(! cmdObject.transactionBoundary) {
    cmdObject.do();
  }

  // add command to the undo queue
  this.undoQueue.push(cmdObject);

}

lib.CommandManager.prototype.undo = function() {

  if(undoQueue.length == 0) {
    return;
  }

  let cmdObject = this.undoQueue.pop();
  this.redoQueue.push(cmdObject);

  if(cmdObject.transactionBoundary) {

    cmdObject = this.undoQueue.pop();
    this.redoQueue.push(cmdObject);

    while(! cmdObject.transactionBoundary) {
      cmdObject.undo();

      cmdObject = this.undoQueue.pop();
      this.redoQueue.push(cmdObject);
    }

  }

  cmdObject.undo();

}

lib.CommandManager.prototype.redo = function() {

  if(redoQueue.length == 0 {
    return;
  }

  let cmdObject = this.redoQueue.pop();
  this.undoQueue.push(cmdObject);

  if(cmdObject.transactionBoundary) {

    cmdObject = this.redoQueue.pop();
    this.undoQueue.push(cmdObject);

    while(! cmdObject.transactionBoundary) {
      cmdObject.do();

      cmdObject = this.redoQueue.pop();
      this.undoQueue.push(cmdObject);
    }

  }

  cmdObject.do();

}

} // namespace boundary
