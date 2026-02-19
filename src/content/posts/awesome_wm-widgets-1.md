---
title: "Awesome WM Widget Guide (Part 1)"
date: 2016-04-03
tags: "Linux Lua Awesome"
permalink: awesome_wm-widgets-1
---

If you are using [Awesome](https://awesome.naquadah.org/) as your Windows Manager tells about you that you a like lightweight and productivity focused working environments. But when you have to stare at your monitor for 10+ hours a day, some pleasant design doesn't hurt - especially if it makes your WM even more functional.

A big design part of Awesome are the widgets located in the top (or bottom) bar. They display your current tag, your opened programs, your sys-tray icons, your clock, and so on. The nice thing is, everything can be customized.
However, before we start doing so, we should understand the default configuration we get out of the box. Therefore, I will give you a breakdown of the widget-section in the default ```rc.lua``` file.
You can find the default configuration file under ```/etc/xdg/awesome/rc.lua```. It is entirely written in Lua and basically controls every aspect of the desktop environment. If you coded before in any language, you should be able to understand and manipulate the default lua configuration with ease. If you want a little head-start regarding the syntax take a look at the official [guide](https://awesome.naquadah.org/wiki/Awesome_3_configuration).

Otherwise, let's get started.

## The Wibox Section

If you open the the default config file with your favorite text-editor, you should see that it is divided in separate parts, always starting and ending with a comment like this:

```lua
-- {{{ Wibox
...
-- }}}
```

Before we look at the Wibox section, where all the Widgets are defined, take a look at the beginning of the file. There you can find a list of require statements. Particular important are

```lua
local awful = require("awful")
local wibox = require("wibox")
```

These lines load the ```awful``` library, which handles basically everything in Awesome and the ```Wibox``` library, which is used to create all visible elements.

Let's go to the Wibox section starting with the aforementioned comment. In there all the elements of the top wibox (topbar) are created and than put together.

The basic elements are:

- Launcher (little icon, that opens shortcutmenu)
- Taglist
- *Promptbox* (textlauncher triggered by ```mod+R```)
- Tasklist
- *Sys-Tray*
- Textclock
- Layoutbox (little icon that shows the current layout)

<img src="/images/posts/awesome_widgets_1/overview.png" width="850" />

The config starts by creating the textclockwidget.

```lua
-- Create a textclock widget
mytextclock = awful.widget.textclock()
```

As all the other default widgets, the textclock is a predefined widget and can therefore be found in the ```awful.widget``` module. For a complete list, as well as the available configuration options, check the [API-reference](https://awesome.naquadah.org/doc/api/modules/awful.widget.common.html). For example, for the textclock you can pass a string that defines the format of the output ("%H:%M" -> 10:12).

In general, a widget is created by calling a construction module or function, which returns the widget. Configuration are passed as arguments (inside the brackets) to the function or module.This does not add the widget to the screen, however. We will cover this part later.

After that first widget five empty tables get created:

```lua
mywibox = {}
mypromptbox = {}
mylayoutbox = {}
mytaglist = {}
...
mytasklist = {}
```

This seems a little bit odd at first, but they are used later to store multiple instances of the same widget (mytaglist stores multiple taglists and so on). Multiple instances of the same widget are needed in multimonitor setups as each screen gets its own bar. We will see how this is done later.

For the taglist and the tasklist, there is also a set of buttons created. Buttons accociated with widgets can come in quit handy. It is basically a secondary set of hotkeys which are only active if your mouse hovers the respective widget. In this case however, the buttons are not directly assigned to any widget because ```mytaglist``` and ```mytasklist``` are not widgets, but empty tables. We have to connect the buttons to the widgets later on for each screen individually.

Creating a list of buttons, always works by using the ```awful.util.table.join()``` method and passing a list of ```awful.button``` instances to it. ```awful.button``` takes three arguments:

- a table of modifier keys (in curly brackets)
- the actual button
- the function which should be activated on button-press

The button number 1 to 5 resemble the mouse buttons (left, middle, right, scroll-up, scroll-down) respectively. To see all the build-in function that can be used - again - take a look at the [API-reference](https://awesome.naquadah.org/doc/api/modules/awful.widget.common.html).

```lua
mytaglist.buttons = awful.util.table.join(
                    awful.button({ }, 1, awful.tag.viewonly),
                    awful.button({ modkey }, 1, awful.client.movetotag),
                    awful.button({ }, 3, awful.tag.viewtoggle),
                    awful.button({ modkey }, 3, awful.client.toggletag),
                    awful.button({ }, 4, function(t) awful.tag.viewnext(awful.tag.getscreen(t)) end),
                    awful.button({ }, 5, function(t) awful.tag.viewprev(awful.tag.getscreen(t)) end)
                    )
```

From top to bottom, the taglist buttons trigger the following actions:

- activate a tag by clicking on it
- move the currently active client to another tag by holding down the mod key and clicking on respective tag
- create a combined few of multiple tags by clicking multiple of them with the right mouse button
- show the currently active client on multiple tags by holding down the modkey and clicking the respective tags with the right mouse button.
- switching to the next or previous tag by scrolling up and down while hovering over taglist

The tasklist buttons seem to be a little bit more complicated. They will change the action, depending on a certain condition.

```lua
awful.button({ }, 1, function (c)
                         if c == client.focus then
                             c.minimized = true
                         else
                             -- Without this, the following
                             -- :isvisible() makes no sense
                             c.minimized = false
                             if not c:isvisible() then
                                 awful.tag.viewonly(c:tags()[1])
                             end
                             -- This will also un-minimize
                             -- the client, if needed
                             client.focus = c
                             c:raise()
                         end
                     end),
awful.button({ }, 3, function ()
                         if instance then
                             instance:hide()
                             instance = nil
                         else
                             instance = awful.menu.clients({
                                 theme = { width = 250 }
                             })
                         end
                     end),
awful.button({ }, 4, function ()
                         awful.client.focus.byidx(1)
                         if client.focus then client.focus:raise() end
                     end),
awful.button({ }, 5, function ()
                         awful.client.focus.byidx(-1)
                         if client.focus then client.focus:raise() end
                     end))
```

From top to bottom, the tasklist buttons trigger the following actions:

- toggle minimize when clicking on client in the taskbar
- toggle a menu showing all clients when right clicking the taskbar
- bring the next or previous client in focus by scrolling up and down while hovering over the taskbar

After that, all the dynamics widgets are created once for each screen and than put together into one topbar. To do so, a for-loop is used, which loops over all screens.

```lua
for s = 1, screen.count() do
    ...
end
```

Other than tags, screens are not referenced as objects, but by actual numbers.

Now, the empty tables from earlier get filled with one instance of each widget per screen.
Most widgets show screen specific information. Therefore they take the screen reference as argument. For the tag and tasklist, it is explicitly specified what they should show:

- awful.widget.taglist.filter.all --> function that returns a list of all tags
- awful.widget.tasklist.filter.currenttags --> function that returns the clients on the current active tag)

The buttons specified earlier are passed as third argument.
A way to attach buttons to a widget after its creation is show for the layoutbox. Using the ```:button``` method, the following actions are attached to the widget:

- switch the next or previous layout using the left and right mouse button
- switch the next or previous layout scrolling up and down while hovering over the widget

```lua
mypromptbox[s] = awful.widget.prompt()
mytaglist[s] = awful.widget.taglist(s, awful.widget.taglist.filter.all, mytaglist.buttons)
mytasklist[s] = awful.widget.tasklist(s, awful.widget.tasklist.filter.currenttags, mytasklist.buttons)
mylayoutbox[s] = awful.widget.layoutbox(s)
mylayoutbox[s]:buttons(awful.util.table.join(
                       awful.button({ }, 1, function () awful.layout.inc(layouts, 1) end),
                       awful.button({ }, 3, function () awful.layout.inc(layouts, -1) end),
                       awful.button({ }, 4, function () awful.layout.inc(layouts, 1) end),
                       awful.button({ }, 5, function () awful.layout.inc(layouts, -1) end)))
```

The thing missing, is the actual bar itself. An empty bar on top is added by

```lua
mywibox[s] = awful.wibox({ position = "top", screen = s })
```

To add the created widgets to the bar, they are grouped in layouts. The order in which they are added defines there position. A fixed layout is used for the left and right part. This means, that the widgets don't try to stretch, but rather only take the space they need. If you take a closer look to the ```right_layout```, you can see, a sys-tray widget is added to the first screen, too.

```lua
-- Widgets that are aligned to the left
local left_layout = wibox.layout.fixed.horizontal()
left_layout:add(mylauncher)
left_layout:add(mytaglist[s])
left_layout:add(mypromptbox[s])

-- Widgets that are aligned to the right
local right_layout = wibox.layout.fixed.horizontal()
if s == 1 then right_layout:add(wibox.widget.systray()) end
right_layout:add(mytextclock)
right_layout:add(mylayoutbox[s])
```

Because the tasklist in the middle should take up all the remaining space, a align layout is used to bring everything together.

```lua
local layout = wibox.layout.align.horizontal()
layout:set_left(left_layout)
layout:set_middle(mytasklist[s])
layout:set_right(right_layout)
```

Finally all the widgets are added to the wibox (bar) using the ```:set_widget``` method

```lua
mywibox[s]:set_widget(layout)
```

And we are done with the widget section. Now, that you understand every line of code in there, you should be able to do simple things like removing elements you don't like or even adding widgets you found in someone's config files.
In the second part I will cover how to create a widget from scratch which displays whatever information you want.
