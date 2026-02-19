---
title: "Make Linux even more awesome with Dmenu"
date: 2015-03-18
tags: "Workflow Linux Bash"
permalink: awesome-dmenu
---

If you are using any modern Linux Distro, it has probably some kind of application launcher already included. To name a few, GNOME Do, Synapse, or xfce4-appfinder all work the same way. You press a button, the launcher appears, and you can quickly select a application to launch by typing its initial letters. In its default configuration Dmenu works no different; however, it can be used to make a quick selection from any given list and not just the default list of applications. Therefore, Dmenu is practical as a custom launcher for nearly everything and even as a way to get a user input for a bash or python script.

After installing Dmenu available from the official [website](http://tools.suckless.org/dmenu/) or via your favourite package manager you can start using it, by running `dmenu_run`  from the commandline or by configuring a hotkey for it. A more or less ugly bar, which displays a list of your applications, should appear on the upper edge of your screen. If you start typing, the selection gets narrowed down and when you found the application you were looking for, you can select it using the arrow keys and launch it by pressing Enter on your keyboard.
So far so good... Nothing special here... So let's talk about the `dmenu` command. In contrary to `dmenu_run` this command requires a list as argument.

Try out the following in your commandline:

```bash
list=("1\n2\n3\n4\n5")
echo -e "$list" | dmenu
```

This example should show the dmenu bar containing the items 1 to 5. If you select an item, its value gets printed out to the commandline. Let's take this value and do some further processing with it.

```bash
list=("1\n2\n3\n4\n5")
choice=$(echo -e "$list" | dmenu)
echo $(($choice**2))
```

If you put these 3 lines in a bash script and execute it, the program asks you to select a number and returns the square root of your selection. Not very useful - I know. But let's take this general idea – generating a list, parsing it to dmenu, and doing something based on the selection – and create a more useful example.

In the following we are going to create a little script, which allows you to "jump" to any git repository on your machine.

What we need to do:

1. create a list of all git repos
2. parse the list to dmenu
3. open a console in the selected directory

Task 1 seems to be easily achievable using the `find` command and searching for all ".git" folders on your harddrive. But on a second look, you need more than a simple list of all git repos; to display only the name of the repo with dmenu, but doing something based on the path to the repo, you need a associative array linking these two parameters.
This can be done with the following code snippet:

```bash
declare -A gitdic
dirlist=()
while IFS= read -d $'\0' -r file ; do
   dir=$(basename "$(dirname "$file")")
   gitdic["$dir"]="$(dirname "$file")"
   dirlist+="$dir\n"
 done < <(find ~ -type d -name .git -print0)
```

First we declare a associative array `gitdic` and a usual array `dirlist`. Inside the while loop (which loops over the results of the find command called at the very end) these arrays get filled up with the respective information; dirlist contains the folder names for displaying, while gitdic contains dictionary elements linking the folder name to the complete folder path.
The result looks something like this:

```bash
dirlist:
    gitrepo1
    gitrepo2
    gitrepo3

gitdic:
    gitdic{gitrepo1} = path/to/gitrepo1
    gitdic{gitrepo2} = path/to/gitrepo2
    gitdic{gitrepo3} = path/to/gitrepo3
```

First step accomplished!! A experienced bash user will see some room for improvement here, but we will stick with it. After all it works!
Step 2 is done by following our first example:

```bash
choice=$(echo -e "$dirlist" | dmenu )
```

Now a Demnu bar will appear and the user can select a gitrepo by name. His choice is stored in the `choice` variable.

Lastly, we need to get the respective path to the chosen repo and open up a terminal. Hence, we call our `gitdic` array to get the path and pass it on to xfce4-terminal as a parameter.

```bash
xfce4-terminal --working-directory="${gitdic["$choice"]}"
```

Here is the whole thing in one block (you can also check it out on my [github](https://github.com/AKuederle/dmenu_tools)):

```bash
declare -A gitdic
dirlist=()
while IFS= read -d $'\0' -r file ; do
   dir=$(basename "$(dirname "$file")")
   gitdic["$dir"]="$(dirname "$file")"
   dirlist+="$dir\n"
 done < <(find ~ -type d -name .git -print0)

choice=$(echo -e "$dirlist" | dmenu )
xfce4-terminal --working-directory="${gitdic["$choice"]}"
```

Nice! We created a somewhat useful script utilizing Dmenu! I have this one always right at my fingertip (alias "alt+q") and it is often the first thing I do after firing up my laptop.
Feel free to use this script, fork it, modify it, and share your awesome ideas with everybody up on [github](https://github.com/AKuederle/dmenu_tools)!

Of course this is not the only thing you can do with Dmenu! In the mentioned git repo you can find another small dmenu script (A small alt+Tab replacment) and searching the web you will stumble over many more.

To learn more about Dmenu in general, see the following links (and of course its man-page):

Official website: [http://tools.suckless.org/dmenu/](http://tools.suckless.org/dmenu/)
Arch Wiki Entry: [https://wiki.archlinux.org/index.php/Dmenu](https://wiki.archlinux.org/index.php/Dmenu)
Helpful Arch Forum Thread: [https://bbs.archlinux.org/viewtopic.php?id=95984](https://bbs.archlinux.org/viewtopic.php?id=95984)
Dmenu Extended Github-Page: [https://github.com/markjones112358/dmenu-extended](https://github.com/markjones112358/dmenu-extended)
