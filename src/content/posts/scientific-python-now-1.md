---
title: "Scientific Python NOW! (Part 1)"
date: 2015-05-26
tags: "Python Numpy Matplotlib SciPy"
permalink: scientific-python-now-1
---

This is a small guide which should get you quickly up and running with analysing and visualising your data using Python. I'm gonna cover everything from setting up your Python environment, over analysing your data, to fitting some crazy function. I try to explain everything in a way that no real prior programming skills are needed to follow along. After reading, you gonna be able to discover the amazing world of Scientific Python all on your own.

First a brief word about what Python is and why it is a adequate tool for analysing scientific data.

Python is a very powerful dynamic [object oriented](http://en.wikipedia.org/wiki/Object-oriented_programming) programming language. It is the engine which drives some of your favourite tools; for example Sublime Text, Blender, and even parts of Google and Youtube.
Modularity allows Python to be used in Web Programming, GUI Development, Software Development, System Administration and of course Scientific and Numerical Computation. The specific Python modules we are interested in today are called Numpy, SciPy, Matplotlib, and Pandas. They transform Python from being just a great programming language to being a data-analysis powerhouse comparable to Matlab.

### Setting everything up

Before we talk about what all these cool packages/modules can do for us, we should get you set up, so you can try out everything I show yourself.
Head over to the [Continuum website](https://store.continuum.io/cshop/anaconda/) and download **Anaconda**, a completely free Python distribution which includes all the packages you ever gonna need. Download the Python 3.x version (If you choose the Python 2.7 version, some of my examples might not work).
If you finished downloading and installing, launch **Spyder**, the Python IDE (Place where you type and run your code in) which ships with Anaconda. If Spyder is not listed under your applications, head over to the *Scripts* folder of your Anaconda installation (On Windows: C:\Users\your_user_name\Anaconda3\Scripts by default) and launch Spyder from there.
The Spyder Window is by default divided in three sub-windows. On the left side is your code editor, on the top right your object/variable inspector, and on the bottom right your console. Take a closer look at the console window. It is separated in three tabs. Make sure you are in the "Ipython console"-tab. If no console is displayed in this tab, start one by right clicking the empty space.
Next thing, we have to make the modules we need available to us. They were installed alongside with Anaconda, but in a freshly opened Python console only the core modules of your Python installation are accessible. To use other modules, you have to type:

```python
import module_name
```

Now you can access functions and variables provided by this module by typing ```module_name.function_name``` (note the period between the module and the function name). If you don't want to type out the module name all the time, you can use the "as" argument of the ```import``` statement to shorten it up. Let's use it to import the modules we need:

```python
import numpy as np
import scipy as sp
import matplotlib.pyplot as plt
import pandas as pd
```

The shortcuts behind the *as* can now be used instead of the module name (for example: np.array). The shortcuts I chose are kind of a guideline for these modules, hence I would suggest you to use the same.
Now you are set up with a running Python installation and a Ipython console, where you can type in all the examples I show below. Just keep in mind, you have to type in these import statements whenever you start a new console or script.
If you have any problems setting everything up, feel free to comment down below or to contact me any other way.

Let's talk about what the before mentioned modules offer us!

### Numpy Array

The Numpy package is the basically the main module you will use when doing math or more specific matrix based computation in Python. By the way "matrix" in this context includes any kind of numerical data which can be expressed in a grid, like a set of spectra or stock data.

The tool we gonna use the most is called a numpy array. It is a special kind of list, which acts like a matrix in the mathematical sense, but is not limited to two dimensions.
Head down to your Ipython console and try the following (Don't forget to run ```import numpy as np``` before):

```python
mylist = [[1,2,3],[4,5,6],[7,8,9]]
print(mylist)
```

What we have done, is defining a variable *mylist* and setting its value to a list with three elements (1: [1,2,3]; 2:[4,5,6]; 3: [7,8,9]), which each consist of three elements on their own.
If we use the ```print()``` function to write the value of our variable on to the screen, the output looks exactly the same like our input.

In the next step we convert our ordinary list into a numpy array:

```python
array = np.array(mylist)
print(array)
```

The output of this print statement is now formatted like a matrix and we can do "matrix-stuff" with our array variable.

```python
array.T # Transpose
array * 3 # Multiplication with a scalar
array + array # Matrix addition
```

Be aware, that ```array * array``` is not a matrix multiplication in the mathematical sense. By using " * " the matrices get multiplied element wise. To make mathematical matrix multiplication use the *dot*-product. Go ahead and try out both to understand the difference!

```python
np.dot(array, array) # Matrix multiplication
```

*A short word about comments in Python: Whenever you want to write a command inside one of your scripts you use a "#". Everything after this symbol in the same line gets ignored by Python. Usually a comment is used to provide additional information about what a certain part of your script does. Therefore, use them extensively to make everything easy to read and understand.*

We can also do stuff, which is no real math, but interesting from a programming stand point:

```python
array.shape # Get number of rows and columns
array.max() # Get the maximal value
array.sum() # Add up all elements of the array
array.flatten() # reduce the array to one dimension
```

Note the parentheses at the end of the last three examples. These are necessary, because *sum* or *flatten* are no attributes of the array, like its *size*, but rather functions you can apply to the array. Inside these parentheses you can pass additional arguments to the function if needed. But even if you don't pass any arguments the empty parentheses must be there!

Try out these examples on your own and than call ```print(array)``` again. You will see, that the value of *array* has not changed, despite we have performed all these actions on it. To save the output of one of these functions you have to assign it to a new variable or override your old array.

```python
flattend_array = array.flatten() # assigning to a new variable
array = array.flatten() # overriding the old variable
```

A powerful feature of numpy arrays is the option to use advanced indexing. This means to easily select certain parts of an array.
The most basic thing to do is selecting a line:

```python
sub_array = array[2]
```

This will assign the third line of array to the new sub_array variable. Yeah, your read right! The third line and not - as you may expected - the second. This is a import thing to keep in mind: Counting in Python always start with 0. So the first element of anything countable has always the index 0 (array[0]); the last element has the index -1.

```python
sub_array = array[-2] # select the second last element of the array
```

Selecting multiple lines is as easy:

```python
sub_array = array[2:5] # select the elements 3, 4, and 5
sub_array = array[:-2] # select all elements up to the second last
```

Or some specific lines (note the second pair of parentheses):

```python
sub_array = array[[2, 4, -2]] # select the second, the fourth, and the second last element of the array
```

Let's take it to the next dimension (two to begin with). Selecting a single element in a 2D matrix can be done by specifying the row and the col index separated by a comma.

```python
element = array_2D[3, 4] # select the element in the 4th row of the 5th column
```

But this is not limited to selecting a single element. You can easily select multiple elements of your multi-dimensional array using the syntax learned from the first examples.

```python
sub_array = array[2,3-9] # select the 4-9 element in the third line
sub_array = array[2,:-1] # select all elements in the third line except the last
sub_array = array[:4, :4] # select a 4x4 array in the top left corner of the array
sub_array = array[:, 4] # select column number 5
```

These selection can be expanded to any dimension and can get far more complex than these examples.
Here is a short summary of the syntax:

- use a colon to select everything between the number for and after the colon *[3:5]*
- if no index is specified before or after a colon, it means "from the beginning" or "till the end" of the array (just a colon without any indices translates to "selecting everything"). *[:3], [2:], or [:, 4]*
- you can use negative index values to select elements starting from the end of the array. *[-3]*
- use square parentheses ( [ ] ) with comma-separated indices to select specific elements. *[[2, 7]]*
- use a comma (,) to separate multiple dimensions. *[2, 6]*

Really try to understand how array slicing works! It can greatly boost your productivity when working with complex data.

Another handy thing to know is, how to generate some generic numpy arrays:

```python
array = np.empty((5, 5)) # Generate an empty numpy array with the shape 5x5
array = np.random.rand(5, 5) # Generate a numpy array with the shape 5x5 filled with random numbers
array = np.arange(0, 1, 0.1) # Generate 1D array containing all numbers between 0 and 1 with a step size of 0.1 ([ 0., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9])
array = np.linspace(5, 10, 11) # Generate a numpy array containing 11 equally spaced numbers between 5 and 10 (5., 5.5, 6., 6.5, 7., 7.5, 8., 8.5, 9. , 9.5, 10.)
```

The additional parentheses in the first example are no typos. For this specific function the shape of the array must be passed as a tuple-object (inside additional parentheses). However, in the second example we could pass the different dimensions one by one. These small differences in the syntax can be very frustrating at first. Therefore, when ever a function does not behave like you would expect, check its documentation page. Regarding numpy an explanation for every single function can be found on [http://docs.scipy.org/doc/numpy/](http://docs.scipy.org/doc/numpy/).
A nice Spyder specific trick is to use the build-in object inspector (top right panel). Press "Ctrl + i" over a function name or go to *Tools/Preferences/Object inspector* and activate "Automatic connection" for the script editor and the Ipython console to display the documentation of a function while you are typing.


*Enough with this example nonsense! I want to have my own data and analyse it! - Ok, Ok... step by step:*

### How to get your own Data

Of course, if you want to analyse something you need a way to import your data. This is what we ganna talk about in this section.
Assuming you don't have time to type in all your data by hand, the best way to import it is by using the csv data format. *CSV* means "Comma separated value" and is basically a textfile containing all your data points separated by commas and line-breaks. If your specific dataset is not using a comma as separator, don't worry! You can configure the csv importer to work with any separative character you desire.
So how to actually do it. Numpy provides a very simple to use function called *loadtxt*, which can load any raw-text datafile and outputs it as a numpy array. To specify your separator use *delimiter* parameter.

```python
array = np.loadtxt("path/to/my/data/data.txt", delimiter=",") # load a comma separated file
```

The file extension actually doesn't matter. As long as the file is encoded in a raw-text format (the file can be correctly displayed using Notepad), numpy is able to read it. Another nice thing, you don't have to use the absolute path to your datafile. You can specify the relative path (relative to your script or the working directory of your console) instead. If the file is in the same directory as your script you can simple use: "./myfile.txt"

*Before you ask: You can get the current working directory of your Ipython console by using ```import os; print(os.getcwd())``` and change your working directory by selecting a folder in Spyder`s file explorer (third tab of the top right panel) and afterwards pressing the funny colourful button in the very top right of the Spyder window with the small red arrow pointing at a python symbol.*

If your datafile use to have a header (one or more lines at the beginning which don't contain any data), you can use the *skiprow* parameter to get rid of them:

```python
array = np.loadtxt("path/to/my/data/data.txt", skiprow=1) # skip the first line
```

The *unpack* parameter comes in handy quite often, too. Setting *unpack* to ```True```, the file is loaded column-wise instead of line-wise. This allows to use Pythons powerful unpacking feature:

```python
column_1, column_2, column_3 = np.loadtxt("path/to/my/data/data.txt", unpack=True) # load a file column-wise into separated variables.
```

*As you may noticed I recently wrote a [blogpost](/quicktips/stop-using-numpy-loadtxt/), explicitly telling you to stop using numpy loadtxt. I still believe that numpy loadtxt is a bad choice, when trying to do time-efficient computing with large sets of data; but to get you started in the fantastic world of scientific Python it's absolutely appropriate to use it.*


Ok, we have a way to import our own data and we know a little bit about how to manipulate our data. But come on... Numbers are boring to look add. Let's make some pretty lines and figures out of all these numbers! (Still no real data example, but we getting there, I promise!)

### Plotting your Data

As its name has maybe already gave away, we will talk about the matplotlib library in this section.
Maybe you were confused earlier on when we imported *matplotlib.pyplot* instead of simply *matplotlib*. The pyplot module is part of the matplotlib package and contains all the stuff we need to make beautiful 2D plots (lines, bars, colourmaps, ...). If you want to make more crazy stuff, like 3D plots or simple animation stuff, you need to import other modules of the matplotlib package. But for now, we gonna focus on the 2D library.

*Keep in mind we imported matplotlib.pyplot as plt!*

Ok, we start with a simple plot:

```python
x_data = [1, 2, 3, 4] # generate some x-data
y_data = [2, 4, 6, 8] # generate some y-data
plt.plot(x_data, y_data) # plot the data
plt.show() # display the figure
```

<img src="/images/posts/scipy_1/first_line.png" width="500" />

Yeah! A line! Let's break down what happened. First we "generated" some data. This data doesn't have to be a numpy array; a simple list of integers or floats will work, too. After this, we plot the data using the ```plt.plot()``` function. Depending on how many parameters you pass to the function it changes its behaviour. Passing only one parameter, its value is taken as the y-data. Passing two arguments, the first is used as the x-data and the second as the y-data. You can further use an optional third parameter to specify the plot colour and the shape of the markers.

```python
plt.plot(x_data, y_data, "r--") # plot a red dashed line
```

To get all the possible values for this optional parameter check the [documentation](http://matplotlib.org/api/pyplot_api.html#matplotlib.pyplot.plot).
Before we proceed, I want to say a few words about this last line of the plotting example. If your remove the ```plt.show()``` and run the code again, it will probably still work. This is, because inside an Ipython console the interactive plotting mode of matplotlib is on by default. This means, that every plot command you type directly results in figure. This allows you to interactively interact (silly phrase...) with your plot, since every command directly updates the figure. However, when you creating a complex plot using a script, you should have turned this mode off to prevent some issues. To turn the mode on or off use ```plt.ion()``` and ```plt.ioff()```, respectively.
This is also a good time to talk about "backends". A backend is basically what matplotlib does after it has calculated how the plot is gonna look like. There are graphical backends, which result in a graphical representation of the plot and there are non-graphical backends, which can be used to store the plot in a certain format. Usually you don't need to mess around with this. The reason, why I'm bringing it up here is, because Ipython adds another very special backend to the equation: the inline plot. This backend only works inside of an Ipython console and results in plots drawn directly to the console window. To activate it type ```%matplotlib inline```; to change back to a secondary window for displaying your plots type ```%matplotlib qt```. If you are not sure which backend you are using, just try out both and see the difference; when the qt backend is selected the plot may be displayed in a minimized window. So check your taskbar!

Ok, we got enough basics to handle some real life data!

### A first Example

To follow along, get the spectral data from this [github-repo](https://github.com/AKuederle/scipy-tutorial/blob/part1/example1/spec_1). The file consists of two columns. However, only the second column contains relevant data. Our goal is to clean the data and to visualize it.

So, here is what we want to do:

1. Import the data
2. Get rid off the unnecessary column
3. Normalise the data
4. Create appropriate x-values
5. Cut off uninteresting parts
6. Plot the remaining part

Let's get to work!

Because we want to do some real work and not just playing around with the data, it is appropriate to write a real reusable script. Hence, create a new empty script in Spyder and save it in the same folder as the spectral data. You can press F5 to run the script and see its output inside our ipython console. I would also recommend using the variable explorer after each run to check if everything went as expected.

As usual we have to start with importing the needed modules. Therefore, the first lines of your new script should be:

```python
import numpy as np
import matplotlib.pyplot as plt
```

One and two can be solved in one step:

```python
_, data = np.loadtxt("./spec_1", unpack=True)
```

We are just using numpy's loadtext function with its unpack parameter. This allows us to parse the second column to our *data* variable and the first to the *underscore* variable. You could have named this variable what ever you want, but "\_" or names starting with a "\_" don't show up in spyder's variable explorer by default; using them, keeps everything a little bit cleaner.

Now we have to normalise the data. This means we want to define each point relative to the maxima of the spectra. Therefore, we have to divide each data-point by the maxima's value.
We can get the maxima using the *max()* function. Then, we can simply divide our array by this scalar.

```python
normalised_data = data/data.max()
```

To create appropriate x-values we have to know what our x-axes actually represents. Let's assume, our spectral data was recorded with wavelengths in a range from 100 - 1000 nm. Now we can use *np.linspace* to create a new array. We gonna use 250 points to match the length of our data array.

```python
x_values = np.linspace(100, 1000, 250)
```

Because we are only interested (just for the purposes of this tutorial) in  the data from index 20 upwards, we have to cut of these first 19 datapoints utilizing the power of array slicing.

```python
normalised_data = normalised_data[19:]
x_values = x_values[19:]
```

Last thing to do is plotting the data.

```python
plt.plot(x_values, normalised_data)
```
... And we are done!

If something went wrong, check with my code on [Github](https://github.com/AKuederle/scipy-tutorial/blob/part1/example1/example1.py).

However, if everything went well, you should end up with the following picture:

<img src="/images/posts/scipy_1/example_1_final.png" width="500" />

Not particular pretty, but that's all for now. We will start of the next part of this tutorial series by getting into more advanced matplotlib stuff, so we can improve the appearance of this plot.

If there are any problems, or you have specific topics you want me to cover, feel free to comment down below or contact me in any other way.

Continue reading --> [Part 2](/posts/scientific-python-now-2/)
