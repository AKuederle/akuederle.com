---
title: "Customize IPython's Keyboard Shortcuts"
date: 2015-06-27
tags: "Python IPython"
permalink: customize-ipython-keymap
---

As many programmers who use Python for their scientific work, I really like the IPython notebook interface. However, using a German keyboard, I got annoyed by IPython's hotkeys. Many of them just won't work with a non-US-keyboard-layout. After a while of unsuccessful research about how to change them, I inally found a way to change them.

After a few hours of pointless googleing, the kind response on my [github issue](https://github.com/ipython/ipython/issues/8586) from [Matthias Bussonnier](https://github.com/Carreau), one of IPython's developers, got me on the right track. In the following I want to briefly summarize [his documentation](http://carreau.gitbooks.io/jupyter-book/content/keyboardshortcut.html) on this feature and explain how I changed my keyboard shortcuts.

The backend of the IPython notebook, as you probably know, is based on JavaScript. Therefore, the implementation of all IDE features is as well. Knowing JavaScript, you can customize the hell out of your IPython notebook; the only challenge is to find to appropriate commands.

For testing and understanding purposes, I suggest to open a IPython notebook now.

First, we gonna need the list of predefined functions we can create hotkeys for. The easiest way is to run the following lines od code in your browser's JavaScript console ("crtl+shift+J" to open in Chrome and "crtl+shift+K" in Firefox).

```javascript
$.map(
     IPython.keyboard_manager.command_shortcuts.actions._actions,
     function(k,v){return v}
     )
```

This should print out a long list of commands to your console. Fortunately, the names are all self-explanatory. However, this is only a small selection of the available commands, since not all of them are handled by the keyboard_manager. Still, there a some commands I want have new key-bindings for.
To do so, we have to run some more lines of JavaScript. Using the ``%%JavaScript`` cell-magic, we can play with the JavaScript settings directly from inside our notebook.

```javascript
%%JavaScript
IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-k','ipython.move-selected-cell-up')
IPython.keyboard_manager.command_shortcuts.add_shortcut('Shift-j','ipython.move-selected-cell-down')
```

So, basically we are just using the provided add_shortcut function to connect a key press with an action.
You can remove a key-bining in the same manner:

```javascript
%%JavaScript
IPython.keyboard_manager.command_shortcuts.remove_shortcut('Shift-k')
```

As said, we are limited in terms of available functions using this method. The get access to many of the line based commands we have to dig deeper into "Code Mirror", the JavaScript based code editor which powers the notebook. This means, we have to create our own ``actions`` based on its API instead of using predefined ones.

The basic structure of a new command looks like this (example modified from [here](https://github.com/juhasch/IPython-notebook-extensions/blob/master/usability/comment-uncomment.js)):

```javascript
'Alt-3' : {
    help    : 'Toggle comments',
    help_index : 'zz',
    handler : function (env) {
        var cm=env.notebook.get_selected_cell().code_mirror;
        var from = cm.getCursor("start"), to = cm.getCursor("end");
        cm.uncomment(from, to) || cm.lineComment(from, to);
        return false;
    }
```

So, we start off with the new shortcut ('Alt-3') followed by its assigned attributes. The *help*-parameter helds the tooltip for our new action and the *help_index*-parameter defines the sorting position in the shortcut list (zz = at the end). The real magic happens at the *handler*-parameter; it contains the actual functionality of our shortcut. In the general case (= all examples I saw), the handler is a function and you can literally do what ever JavaScript allows you to do inside it.
Further breaking down the example, in the first line of the function, the currently active Code Mirror instance of the currently active IPython environment (env) is called (IPython uses one instance of the code editor for each cell). This instance has a bunch of functions you can call and use. To find out which, we can map and output them in the same way as before using our JavaScript-console.

```javascript
$.map(
     IPython.notebook.get_selected_cell().code_mirror,
     function(k,v){return v}
     )
```

Using the ``getCursor``, ``uncomment``, and the ``lineComment`` functions, we can create a *toggle-comments*-function as above. Regarding the last line, I'm not sure why the ``return false`` is necessary; in my testing it seems not. But, according to another [guide on this topic](http://nbviewer.ipython.org/github/adrn/ipython/blob/2.x/examples/Notebook/User%20Interface.ipynb#Keyboard-shortcut-customization), this line prevents the default action from being executed (again, I'm not a 100 % sure why this is important).

Before we make the created hotkey available inside of our notebook, I quickly gonna show you the other hotkeys I created.

```javascript
'Alt-1' : {
    help: 'Indent',
    help_index : 'zz',
    handler: function(env) {
        var cm=env.notebook.get_selected_cell().code_mirror;
        cm.execCommand('indentMore');
        return false;
    }
},

'Alt-2' : {
    help    : 'Indent less',
    help_index : 'zz',
    handler : function (env) {
        var cm = env.notebook.get_selected_cell().code_mirror;
        cm.execCommand('indentLess');
        return false;
    }
}
```

As you may noticed, these two are not using a provided Code Mirror function directly, but rather the ``execCommand``-function to get access to a even deeper level of [commands](https://codemirror.net/doc/manual.html#commands). Through Code Mirror Addons this list can be extended even further. However, I haven't really looked into it jet and therefore, I'm not sure if you can use addons in combination with IPython (If you no something about it, let me know!).

So, we got our three hotkeys. Now we have to actually add them as shortcuts to our notebook. To do so, we create a variable which contains our shortcuts.

```javascript
var add_edit_shortcuts = {
        'Alt-3' : {
            help    : 'Toggle comments',
            help_index : 'zz',
            handler : function (env) {
                var cm=env.notebook.get_selected_cell().code_mirror;
                var from = cm.getCursor("start"), to = cm.getCursor("end");
                cm.uncomment(from, to) || cm.lineComment(from, to);
                return false;
            }
        },

        'Alt-1' : {
            help: 'Indent',
            help_index : 'zz',
            handler: function(env) {
                var cm=env.notebook.get_selected_cell().code_mirror;
                cm.execCommand('indentMore');
                return false;
            }
        },

        'Alt-2' : {
            help    : 'Indent less',
            help_index : 'zz',
            handler : function (env) {
                var cm = env.notebook.get_selected_cell().code_mirror;
                cm.execCommand('indentLess');
                return false;
            }
        }
```

In a final step, we add them to the keyboard_manager:

```javascript
IPython.keyboard_manager.edit_shortcuts.add_shortcuts(add_edit_shortcuts);
```

And we are done; but, only for this notebook. To make our shortcuts available in every notebook, we have to create an notebook extension. While IPython extensions are .py-files stored in your local `/.ipython/extensions` folder, notebook extensions are JavaScript files stored in the /.ipython/nbextensions folder. To locate either one of these folders, run ``ipython locate`` from a terminal. Now we just have to create a .js-file containing our shortcut commands. In addition, we gonna nest everything into a on-load function, as suggested [here](http://carreau.gitbooks.io/jupyter-book/content/Jsextensions.html#). It looks like this and prevents timing issues when the extension is loaded:

```javascript
define(['base/js/namespace'],function(IPython){
  "use strict";
  // Here go our variable definitions
  return {
    // this will be called at extension loading time
    //---
    load_ipython_extension: function(){
        // Here goes code which should be executed on start up (Alias the add_shortcut commands)
        console.log("I have been loaded ! -- custom_shortcuts");
    }
    //---
  };
})
```

So, you put variable definitions and all this stuff before the return command, and inside the ``load_ipython_extension``-function you gonna place everything, which "actually" changes something. This prevents the issue, that our custom functions are loaded before IPython is correctly initialized.
As always, you can find the full .js file on [github](https://github.com/AKuederle/IPython-custom-shortcuts/blob/old-way/custom_shortcuts.js).

If you created the file and saved it as "custom_shortcuts.js" inside the nbextensions-folder you should be able to load it from inside of any notebook by running these two lines:

```javascript
%%JavaScript
IPython.load_extensions('custom_shortcuts');
```

To load the extension automatically when starting a new notebook, open up a IPython notebook and run the following lines:

```javascript
%%JavaScript
IPython.notebook.config.update({"load_extensions":{"custom_shortcuts":true}})
```

This should update `~/.ipython/profile_default/nbconfig/notebook.json` accordingly. Now your new awesome shortcuts are available everywhere and every time.

I hope you found this little tutorial helpful, and I would really appreciate more input regarding this topic. So, if you happen to know more about IPython's extensions, please leave a comment with resources and suggestions.

**Update:** As pointed out in the comments, it might actually be better to create each shortcut individually as a new action. This would make it easier to reuse them in other parts of IPython again. Here is an example how to do this for the first shortcut:

```javascript
var toggle_comments = {
    help    : 'Toggle comments',
    help_index : 'zz',
    handler : function (env) {
        var cm=env.notebook.get_selected_cell().code_mirror;
        var from = cm.getCursor("start"), to = cm.getCursor("end");
        cm.uncomment(from, to) || cm.lineComment(from, to);
        return false;
    }
}
IPython.keyboard_manager.actions.register(toggle_comments,'toggle_comments')
```

Now, our action is registered. We can check this by calling the following from the JavaScript console.

```javascript
$.map(
     IPython.keyboard_manager.command_shortcuts.actions.\_actions,
     function(k,v){return v}
     )
```

At the very end of the list, there should be a function called ``auto.toggle_comments``. We can assigned this action to any shortcut as before:

```javascript
IPython.keyboard_manager.edit_shortcuts.add_shortcut('Alt-5', 'auto.toggle_comments')
```

Note, that you need the ``auto.`` prefix!
A updated version of the whole script based on this idea, can be found [here](https://github.com/AKuederle/IPython-custom-shortcuts/blob/futureproof/custom_shortcuts.js).

I hope you found this little tutorial helpful, and I would really appreciate more input regarding this topic. So, if you happen to know more about IPython's extensions, please leave a comment with resources and suggestions.


**Update 2:** This way is not up to date anymore. There is a new (however unstable) way to do that in the upcoming Jupyter 5.0! Read about it [here](http://jupyter-notebook.readthedocs.io/en/latest/extending/keymaps.html)
