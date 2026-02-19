---
title: "Create a zoomed-up inset plot in Matplotlib"
date: 2015-04-27
tags: "Python"
permalink: matplotlib-zoomed-up-inset
---

Having a overview over all your data is nice; but, sometimes a viewer needs a little more detail of some interesting parts of your plot. A very convenient way to allow this, is to provide a zoomed up subplot of a certain area. Usually, you place this little subplot somewhere inside your overview figure; and if you feel the urge to be really fancy, you can draw a box around the zoomed-up area and a few lines connecting the corners of your box with your subplot to get this nice "zoom-effect" as shown in our example below.

So how to do this in matplotlib?

While it is easy to create an inset plot using the *axes* function, creating the "fancy" stuff is much harder to do. Fortunately, *mpl_toolkits.axes_grid* provides us with a few powerful functions to support our "cause".
The matplotlib documentation has a really good example, showing exactly what we want ([http://matplotlib.org/1.3.1/mpl_toolkits/axes_grid/users/overview.html](http://matplotlib.org/1.3.1/mpl_toolkits/axes_grid/users/overview.html) in the section **InsetLocator**).
In the following I'm basically going to break down this example, so that you really understand each step.
First, we start with plotting our overview-data:

```python
fig, ax = plt.subplots() # create a new figure with a default 111 subplot
ax.plot(overview_data_x, overview_data_y)
```

Now, let's start the magic! After importing we can use the *zoomed_inset_axes()* function to create a zoomed-up inset axes inside our plot. The first parameter is our mainplot axes-instance, the second parameter is the zoom factor, and the third the position of the inset inside our figure.
You can find the available positional arguments [here](http://matplotlib.org/api/legend_api.html).

```python
from mpl_toolkits.axes_grid1.inset_locator import zoomed_inset_axes
axins = zoomed_inset_axes(ax, 2.5, loc=2) # zoom-factor: 2.5, location: upper-left
```

Now we plot the same data we used before inside our new axes:

```python
axins.plot(overview_data_x, overview_data_y)
```

Running the code up to this point, you gonna see your original plot mostly overlapped by an completely oversized version of itself. As a next step we have to shrink, or more precisely, cut our inset plot to fit inside the figure. Therefore, we specify the x- and y-limits we want our zoomed-up plot to have.

```python
x1, x2, y1, y2 = 47, 60, 3.7, 4.6 # specify the limits
axins.set_xlim(x1, x2) # apply the x-limits
axins.set_ylim(y1, y2) # apply the y-limits
```

Our subplot now shows the wanted section of the data and should be the right size. If not, you have to go back and modify the zoom factor or the limits.

The next step is fully optional, but often you don't want to have the ticks of the small plot displayed. If you need them, just skip the following lines of code.

```python
plt.yticks(visible=False)
plt.xticks(visible=False)
```

The only thing left, is the fancy zoom effect. However, the box and the two lines are easily created by another function of the *axes_grid* module.

```python
from mpl_toolkits.axes_grid1.inset_locator import mark_inset
mark_inset(ax, axins, loc1=2, loc2=4, fc="none", ec="0.5")
```

This function draws a border around the zoomed area inside the overview and two lines connecting two corners of this box with the respective corners of the inset. The first two parameters are the axes-instances you want to connect. The third and the fourth parameter specify the connected corners (1-4 counter-clockwise); usually, you want to have two opposite corners connected in a way that the lines do not interfere with your plot. The *fc* and *ec* parameter can be used to specify the fill-colour of the box and the lines, respectively. You can pass the colour by name or rgb-code. In this specific example a grey-scale value of 0.5 is used for the lines.

The final plot will look something like this (depending on your data of course):

![Example Plot](/images/quicktips/matplotlib-zoomed-up-inset/matplotlib-zoom-example.png)

Credits go to *Bill the Lizard* and *David Ketcheson*, who posted links to examples, which show these functions in action, in this Stackoverflow post: [http://stackoverflow.com/questions/13583153/how-to-zoomed-a-portion-of-image-and-insert-in-the-same-plot-in-matplotlib](http://stackoverflow.com/questions/13583153/how-to-zoomed-a-portion-of-image-and-insert-in-the-same-plot-in-matplotlib)
