---
title: "STOP USING numpy.loadtxt()"
date: 2015-04-06
tags: "Python"
permalink: stop-using-numpy-loadtxt
---

If you are using Python for data analysis you are using numpy in some way and you are probably using the numpy "loadtxt" function as well.

STOP DOINIG IT!!!

Seriously, stop using the numpy.loadtxt() function (unless you have a lot of spare time...). Why you might ask? - Because it is SLOW! - How slow you might ask? - Very slow! Numpy loads a 250 mb csv-file containing 6215000 x 4 datapoints from my SSD in approx. 35 s! - But hey, this is a pretty large file you might say! - No Excuse!
Comparing the speed of numpy's loadtxt function with pandas's read_csv, I couldn't believe the results at first:

Testfile: 250 mb (6215000 x 4 tab-separated datapoints)
Testsystem: Laptop with internal SSD using the ipython `%timeit` function for timing

### Numpy:
```python
import numpy as np

%timeit data = np.loadtxt("./data")
```
**Result:** 1 loops, best of 3: 36.6 s per loop

### Pandas:
```python
import pandas as pd

%timeit data = pd.read_csv("./data", delimiter = "\t", names=["col1", "col2", "col3", "col4"])
```
**Result:** 1 loops, best of 3: 2.36 s per loop

A speed increase of a whopping factor of 15!!
So just stop using np.loadtxt and start using pd.read_csv instead. It is much faster and pandas might be package you want to use anyway when dealing with large datasets.

If you want to learn more about the pure awesomeness of the pandas csv-parser check out this excellent [blog post](http://wesmckinney.com/blog/a-new-high-performance-memory-efficient-file-parser-engine-for-pandas/) written by the pandas project creator, Wes McKinney, himself.

**EDIT:** As pointed in the comments, read_csv doesn't work with an iterator as input (loadtxt does). Luckily a member of the great StackOverflow community came up with a [solution]([http://stackoverflow.com/questions/33927320/pandas-read-csv-and-python-iterator-as-input). Just create a string from the iterator and use the StringIO module to pass it to the read_csv function:

```python
pd.read_csv(StringIO("\n".join(iter)))
```
