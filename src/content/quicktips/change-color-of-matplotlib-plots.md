---
title: "Easily expand the Number of Colors in your Matplotlib Color cycle"
date: 2015-09-25
tags: "Matplotlib"
permalink: change-color-of-matplotlib-plots
---

I love matplotlib, don't get me wrong, but there are a view things I find unnecessary complicated; one of which is changing the color-palettes for your plots.

The default one only contains 8 different colors. Therefore, some of your lines will have the same color if you got more than 8 in one figure. To resolve that you can either specify the color for each line manually or modify the default ```color_cycle``` - parameter. While latter is generally simple, it can get complicated, if you want to choose a "nice" set of colors instead of just a bunch of random ones.

Luckily, I seem to be not the only one who doesn't like the way matplotlib handles this: the fantastic [seaborn-pakage](http://stanford.edu/~mwaskom/software/seaborn/) provides us with an easy solution.

On import (```import seaborn as sns```) it not only changes the default color-palett to a subjectively prettier one, but allows us to get and set a new pallet for our plots with a single line of code. So, regarding our initial problem, to expand the number of colors in the default color cycle, just do the following (20 colors for example):

```python
import seaborn as sns
sns.set_palette(sns.color_palette("hls", 20))
```

This is by far not the end of what seaborn can do for you color-wise. But check out there website regarding that:
[http://stanford.edu/~mwaskom/software/seaborn/tutorial/color_palettes.html?highlight=color](http://stanford.edu/~mwaskom/software/seaborn/tutorial/color_palettes.html?highlight=color)
