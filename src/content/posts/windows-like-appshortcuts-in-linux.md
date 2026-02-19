---
title: "How to get Windows-like Application Shortcuts in Linux (KDE, Gnome, and any other)"
date: 2016-03-16
tags: "Linux Bash"
permalink: windows-like-appshortcuts-in-linux
---

As many people, I changed to Linux because it makes some of my daily work a lot easier. It has a lot of features I, personally, consider superior to Windows. However, there are these small things, these small convenience, you will probably miss coming from Windows. One of the things I am missing is the way Windows handles the application shortcuts in the taskbar. But I gonna change that today and bring all the functionality to my glorious new KDE-Plasma desktop.

**Note:** The whole process here is explained for KDE. However, it is not limited to that. The whole concept of run-or-raise a window, is independent of the desktop environment you are using. All the code should work everywhere. Only the way you register the shortcuts will differ. Please refer to the documentation for your distro or ask in the comments, if you run into problems.

### How does Windows handle it?

Since Win 7, Windows has the option, to only show the symbols of your running applications in your taskbar. Furthermore, you can pin applications so that this symbol also acts as an launcher, when the applications is currently not running.
A nice thing, some users might not know, is that Windows automatically assigns hotkeys to applications you pinned. Using ```Win+1,2,...,9``` you can launch the pinned programs and bring them back to focus, when they are opened in the background.
I really like this hotkey functionality, as it allows to switch windows very deterministically (in contrast to ```Alt+Tab```, where you always have to search for the window you want).

### Let's recreate it in KDE

For those of you, who don't know, KDE is one of the most popular Desktop Managers available for Linux. It is highly customizable and provides a lot of features and eye-candy. I will show all the following steps using KDE, but you can use them to recreate the same behavior on many other desktop managers as well.

#### Icon only Taskbar

KDE comes with a Icon only taskbar right from the bat. If not already selected, you can activate it, by right clicking your panel (taskbar) in the area where your opened applications are displayed, unlocking the widgets and then right clicking again and selecting "*Alternatives...*". There you can select the Icon-Only-Widget.

<img src="/images/posts/win-like_applauncher/icon_only_launcher.png" width="500" />

Now, you can open all the applications you want to pin to launcher and then right-click each one individually and select "*Show a Launcher when not running*".

<img src="/images/posts/win-like_applauncher/pin-app.png" width="500" />

As all your favorite apps are now pinned to the taskbar, we can create shortcuts.

#### Creating Application Shortcuts

Unfortunately, this is not as easy as the first step. Of course, just assigning ```Win/Meta+1,2,...,9``` to launch the respective applications matching their position in the launcher, would be pretty straight forward. But, we want the hotkey to trigger two different actions depending on whether a application is already open or not.
To achieve that, we gonna write a little bash-script, that checks exactly that, and fires the respective action.
We gonna use a little CL-tool called "*wmctrl*". Just google how to install it for your distro.
Then make sure, that it is correctly working by executing the following in your command line:

```bash
wmctrl -lx
```

The output should look something like this:
<img src="/images/posts/win-like_applauncher/wmctrl_1.png" width="500" />

As you can see, all your opened Windows are listed (and some more, but don't worry about them).
The last column represents the window-name (which is unique for each window) and the third last column the window-class (which is unique for each application). We gonna use the window-class to check if an application is already launched.

Open up your favorite text editor, and we gonna start coding!

We start by creating a function, which can simply check, if a name is in a list:

```bash
contains() {
    [[ $1 =~ $2 ]] && return 0 || return 1
}
```

Then we get the actual list of classes of currently opened applications. To do so, we pipe the output of our command from earlier into "*awk*" to select the third column (the window-classes).

```bash
app_list=$(wmctrl -lx | awk '{print $3}')
```

By using our *contains*-function, we can now check if a specific app is opened. Because we don't want to write one bash-script per application in our launcher, we won't hard-code the class name in, but rather pass it as an command-line argument later on.
If our function returns a 1 (our app is already launched), we will use wmctrl again to bring the window with the matching class back in focus. If multiple windows with the same class are open, the one which was opened first will be selected.
If the app is not open, we will launch it using its name, also provided as a command-line argument.

```bash
if contains "$app_list" "$2";
    then wmctrl -x -a "$2" ;
    else ("$1"&) ;
fi
```

And we are done! Here is everything together (and a link to a [gist](https://gist.github.com/AKuederle/ba0a2f3db7f887fbbfad)):

```bash
#!/bin/bash


contains() {
    [[ $1 =~ $2 ]] && return 0 || return 1
}


app_list=$(wmctrl -lx | awk '{print $3}')
if contains "$app_list" "$2";
    then wmctrl -x -a "$2" ;
    else ("$1"&) ;
fi
```

**Note**: As [Oleg](https://github.com/olegtc) mentioned in the comments, you can expand the script to also minimize the Window if it is currently active. You will need an additional tool for that, called ```xdotools```. It should be available in your repositories. If you want the functionality use this code from his [gist](https://gist.github.com/olegtc/d4b9858e9257ef7a0811ea8b109dd0c2) (all props to him!!!):

```bash
#!/bin/sh
apps_table=$(wmctrl -lx)
id=$(printf '%x' $(xdotool getactivewindow))
active_window_class=$(echo "$apps_table" | awk -v id=$id '$0 ~ id {print $3}')

if [[ "$active_window_class" = "$2" ]];
then
    xdotool getactivewindow windowminimize;
else
    apps_list=$(echo "$apps_table" | awk '{print $3}');
    if [[ "$apps_list" =~ "$2" ]];
    then
        wmctrl -x -a "$2";
    else
        ("$1"&) ;
    fi
fi
```

Independent of which script you use, save that script to a convenient location on your harddrive (like ```/usr/local/bin``` or ```/opt/bin```). If you want to call your script just by the name and not by specifying the whole path, make sure to add the location to your PATH. Now we have to make the whole thing executable by running the following in the command-line:

```bash
chmod +x %path to your script%
```

Let's make a test-run by opening a bunch of stuff and using the listing command from earlier to identify the respective window-classes. Then we run our script and see if everything works.
E.g. for Chromium:

```bash
myscript.sh chromium.chromium chromium
```

*chromium.chromium* is the class and *chromium* just the name of the application. If everything work, your chromium should get opened, when it is not already and brought to the foreground, if it is already running.

The only thing left to do, is to map these script calls to some hotkeys. We gonna fire up the custom hotkey utility of KDE (*Settings > Shortcuts >Custom Shortcuts*) and create a create a new group. Than we add shortcuts for all of our application. Under Trigger, you can choose the hotkey (e.g. Meta+Number) you want to use and under *Action* you put a call to our new script.

<img src="/images/posts/win-like_applauncher/hotkey.png" width="500" />

I also added a second hotkey for each application, which forces a new instance, by just starting the application a second time. I mapped these actions to ```Win/Meta+Ctrl+Number```.

And we are done!
Now you should have all the convenience you're used to from Windows, but with the power of Linux right at your fingertips!
