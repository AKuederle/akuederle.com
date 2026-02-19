---
title: "Scientific Python NOW! (Part 2)"
date: 2015-06-01
tags: "Python Numpy Matplotlib SciPy"
permalink: scientific-python-now-2
---

This is the second part of my introduction-series to scientific python. This time, we gonna continue with plotting our data and than we gonna move on to some general coding and coding techniques.

If you haven't read the first part, you can check  it out [here](/posts/scientific-python-now-1/).

### A first Example (Part 2)
As promised, we start of by improving our python plot we made in the previous part. You can get the code to create it on my [Github](https://github.com/AKuederle/scipy-tutorial/tree/part1/example1).
This is how plot looks right now:

<img src="/images/posts/scipy_1/example_1_final.png" width="500" />
It was fine for a first try, but far from a publication-ready figure. We gonna fix that now. I will show you two ways to do it.

#### The high-level-functions-way

The first step is to add axes-labels:

```python
plt.xlabel("wavenumber $\lambda$ [nm]")
plt.ylabel("intesity [V]")
```

That was easy... And we got a proper looking lambda. Pro tip: You can use Latex syntax throughout your matplotlib plots to create awesome looking equations and special characters.

Next, we need to fix the axis limits. It is kind of ugly that the graph starts in the middle of our figure and touches the top border. To make our code reusable we gonna define the new axis-limits relative to our data.

```python
plt.xlim(x_values.min(), x_values.max()) # define beginning and end of the x-axis
plt.ylim(0.8*normalised_data.min(), 1.1*normalised_data.max()) # define beginning and end of the y-axis
```

Last, we add a grid to the plot. Generally, you don't have to do it, but I like the look of it.

```python
plt.grid(True)
```

<img src="/images/posts/scipy_2/example_1_1.png" width="500" />

Well, that a good looking plot, don't you say?

Now, you might ask: "That was pretty simple and the result looks fairly good. So, why do we need a second way to do the same?"

Good Question! Let me explain: The matplotlib functions we used until now where very high-level. No, this doesn't mean we had to be very skilled to use them, but rather the opposite. Functions like *plt.plot* do a lot under the hood and modify and create many different components of our plot all at once. This is nice for quick interactive plotting, but comes with the trade-off of sacrificing flexibility and options. Therefore, if you want to create a complex publication-ready plot, I strongly suggest the following way.

#### The object-oriented-way

First, we have to go back to initialising the plot and delete (or comment out) following after the data processing.  At the end, our script should only contain the following:

```python
import numpy as np
import matplotlib.pyplot as plt

_, data = np.loadtxt("./spec_1", unpack=True) # loading the data

normalised_data = data/data.max() # normalising

x_values = np.linspace(100, 1000, 250)

normalised_data = normalised_data[19:] # cutting the data
x_values = x_values[19:]
ormalised_data.min(), 1.1*normalised_data.max())
```

This time, instead of using *plt.plot*, we gonna create our plot layer by layer. The ground layer, the canvas, is called a figure. We can create a new one (or activate a existing one) by calling

```python
fig = plt.figure("My awesome Plot", figsize=(8, 4), dpi=100)
```

Inside the parentheses you can specify the name and, very interesting regarding publication guidelines, the size (in inches) and the dpi of the figure. Keep in mind, all these parameters are optional. If you don't need them, just omit them.

*I highly recommend running the script after each line of code we add, so that you can better understand the different parts of our plot.*

If you read my little side-note and ran the script, you probably noticed that nothing really happened. This is, because we haven't told matplotlib to do anything. We only initialised a figure object and assigned it to a variable (*fig*). To actual make the plot visible we have to call *show()* on our figure object at the end of our script.

```python
fig.show()
```

You executed the script again? Still no plot? Yeah, but this time its not the fault of our programming, but rather our choice of tools. The ipython inline-backend (check the the first [part of the series](/posts/scientific-python-now-1/) to learn more about it) doesn't support the show command. Therefore, we gonna switch to the qt backend by typing ```%matplotlib qt``` into our console (not the script!). Keep in mind, if you restart the shell, you have do this again.

If we rerun our script now, we should end up with a beautiful grey canvas in an external window. Again, check your taskbar; the figure window was probably opened in the background.

*Keep in mind, fig.show() must be called at the end of the script. Hence, AFTER all the following code.*

Let's put something on this grey wall, shall we? What's usually living inside a matplotlib figure object, is a matplotlib axes object. You can add a new axes-object by using the *add_subplot* command.

```python
ax = fig.add_subplot(1,1,1)
```

This weird numbers right there determine the position of the axes inside the figure in case of multiples subplots. The first two define the size of subplot-grid and the third the position of the plot inside of this grid. So, for example, try:

```python
ax = fig.add_subplot(2,3,4)
```

This will divide the figure in a subplot-grid with 2 rows and 3 columns and will put the axes on position 4 (outer left position of the second row). Nonetheless, we gonna continue with the 111-subplot.

Now we have to add our data to the plot. As in the last part of this series, we gonna use the *plot* command. However, instead of *plt.plot*, we use *ax.plot* to target our created axes directly.
This is one of the biggest advantages of creating plots in this object-oriented way. By creating and assigning the figure and all axes to individual variables, we can specifically target them using the variable names. The general *plt.plot*-function always targets the currently active axes object (or creates one); this can be very confusing when creating complex plots.

```python
ax.plot(x_values, normalised_data)
```

By the way, the line we created by this command is a Line2D-matplotlib object. Hence, if you want, you could also target a plotted line individually and alter its properties. But this is usually nothing you should need to do.

Ok, now our plot is back to the started with today; but this time we have chosen a more object-oriented and expandable approach. Let's do what we actual wanted to do: making the plot pretty!

This part is basically identical to the "easy" way. However, we target the axes directly again. Note, that there is a slide change in the syntax (xlabel --> set_xlabel).

```python
ax.set_xlabel("wavenumber $\lambda$ [nm]")
ax.set_ylabel("intesity [V]")

ax.set_xlim(x_values.min(), x_values.max())
ax.set_ylim(0.8*normalised_data.min(), 1.1*normalised_data.max())

ax.grid(True)
```

And we prettyied-up the plot again. Before we leave matplotlib alone for a while, I want to point out on more thing: If you need plots with precise sizes and aspect ratios (and you probably will), I highly suggest enabling tight-layout for your plots. This shrinks the subplot, so that non of the labels exceed the figure (learn more [here](http://matplotlib.org/users/tight_layout_guide.html)). You need to put the command at the end of your script right before the show-command.

```python
fig.tight_layout()
```

And another thing... If you want to save your figure, you can use

```python
fig.savefig("./example1.pdf")
```

Even though there are endless formats available, always use a vector format (pdf, eps) unless you have a real good reason not to.

As always, check out the code on Github if you have any problems following the tutorial:
[The "easy" way](https://github.com/AKuederle/scipy-tutorial/tree/way_1)
[The object-oriented way](https://github.com/AKuederle/scipy-tutorial/tree/way_2)

### Some "real" Coding

If you are somewhat familiar with any kind of programming language, you may have noticed that we haven't touch any of the fundamental programming concepts yet -  the things that allow to create modular, efficient, non-redundant, and reusable code, and make a scripting language that much superior compared to graphical tools.
Looking back on our code, every line can somewhat be translated in a press of a button in Excel or Origin. That's because everything was written and executed top down. The power of scripting, however, lies in the possibility to automate multiple steps.
The "automation-tools" I want to talk about today are *loops*, *functions*, and *if-else-statements*.

#### Loops

As the name probably already gave away, loops are used to do something over and over again. In programming there are *for*-loops and *while*-loops. However, latter are less interesting for scientific programming.

Their syntax is relatively obvious. Try to translate the following lines into plain English:

```python
for value in my_list:
    print(value)
```

**For** every **value in my_list**, **print** the **value**.

```python
i = 0
while i < 10:
    print(i)
    i = i+1
```

**i** is equal to **0**. **While i** is smaller than **10**, **print** the value of **i** and add **1** to **i**.

As you see, simple Python is almost as readable as plain English. Still, we need to talk about the important parts of the syntax and format. *for* and *while* are referred to as keywords (*import* was a keyword, too). They tell the compiler (thing that translates your code into computer readable language) that whatever follows should be treated differently. Another common thing between *while* and *for* loops is the colon at the end of the command line. It ends the actual command and tells Python that the following lines are part of the loop ("inside" the loop). But how does Python know where the loop ends?
While indenting lines is just a matter of good style in other programming languages, in Python it is part of the actual syntax. When entering a multi-line command (like a loop or a function), the compiler expects an indentation in the following line(s) and reads until a non-indented line is found. Of course, you can have multiple nested levels of indentation in your code.
Besides the *for* and the colon, the *for*-loop expects another keyword. The "in" separates the variable declaration from the value-list. So, to write a *for*-loop you need:

**for** *names-of-variables* **in** *iterable-object-which-yields-values* **:**
**TAB** *code-line-1*
**TAB** *code-line-2*

Here is a more advanced example:

```python
array = [["a1", "a2"], ["b1", "b2"], ["c3","c4"]]

for element1, element2 in array:
    print(element1 + ": " + element2)
```

In contrast to the first loop I showed, two variables (element1 and element2) are assigned here. Python will call the elements inside array one by one. So in the first iteration, array returns array[0] = ["a1", "a2"]. Because we provided two variable names, Python tries to unpack the returned sub-array. Unpacking means, Python looks inside the sub-array and takes the first element and assigns it to the first given variable-name. Then, the compiler takes the second one and assigns it to the second variable-name, and so on. If you don't got it, don't worry; just memorize that this is a shortcut for

```python
array = [["a1", "a2"], ["b1", "b2"], ["c3","c4"]]

for elements in array:
    element1 = elements[0]
    element2 = elements[1]
    print(element1 + ": " + element2)
```

Let's take a look at the most common use-cases for *for*-loops in scientific computing. First, of course, the obvious: iterating through a list or array as in the examples above and performing some calculations on each line. However, when you do matrix based computing (= using numpy arrays), step back for a second, consult the [numpy documentation](http://docs.scipy.org/doc/numpy/), and check if there isn't a function, which could replace your *for*-loop. The native numpy functions are often a few orders of magnitudes faster (and simpler to read) than a self-written loop. For example, if want to calculate the mean of each line in a 2D-array, you could do something like this:

*Keep in mind, you need to import numpy as np again and ran the code in our ipython console or from a script. Check out the first [part](/posts/scientific-python-now-1/) if you have problems with that.*

```python
import numpy as np

data_array = np.random.rand(50, 100) # generate some random data
result_array = np.array([])

for line in data_array:
    sum = 0
    for data in line:
        sum += data # += is equivalent to sum = sum + data
    result_array = np.append(result_array, [sum], axis=0)
```

While this way might be a good practice to understand *for*-loops, it is quiet extensive for such a simple task. Luckily, numpy already has what we need:

```python
import numpy as np

data_array = np.random.rand(50, 100) # generate some random data
result_array = np.mean(data_array, axis=1) # You need to specify the axis, as we only want the mean along one axis
```

This method is not only shorter to write and clearer to understand, but also 15x faster than the first one (1.52 ms vs. 0.102 ms).

Nonetheless, if you evaluated that you are in need of a *for*-loop, here are some examples and handy tricks.

Sometimes, you not not only want to have the the values of a list, but also their respective index. You could do this:

```python
test_array = np.random.rand(10)

for index in range(0, len(test_array)):
    print(index, test_array[index])
```

However, a much cleaner way would be to use the "double"-iteration from before in combination with the powerful *enumerate*-command:

*Enumerate yields a list with the index and the value for each element in the input-list. Just try: print(list(enumerate(test_array)))*

```python
test_array = np.random.rand(10)

for index, value in enumerate(test_array):
    print(index, value)
```

If you need the index to work on two arrays simultaneously, you can instead use the *zip*-command together with a "double"-iteration:

```python
test_array_1 = np.random.rand(10)
test_array_2 = np.random.rand(10)

for value_1, value_2 in zip(test_array_1, test_array_2):
    print(value_1, value_2)
```

*The zip command takes two (or more) lists of equal length and returns a new list which holds the old lists combined element-wise. Check it out by trying print(list(zip(test_array_1, test_array_2))).*

This is again much cleaner and "pythonic" than doing

```python
test_array_1 = np.random.rand(10)
test_array_2 = np.random.rand(10)

for index in range(0, len(test_array)):
    value_1 = test_array_1[index]
    value_2 = test_array_2[index]
    print(value_1, value_2)
```

When you want to iterate over the rows of your array instead of the lines, you can simply transpose the array before iterating.

```python
test_array = np.random.rand(2,10)

for row in test_array.T:
    print(row)
```

If you want to access all elements of a multidimensional array individually, you can call flatten on it before entering the *for*-loop:

```python
test_array = np.random.rand(2,10)

for value in test_array.flatten():
    print(value)
```

*Don't forget, the last two examples only work with numpy.arrays and not with simple lists!*

Let's take a quick look at *while*-loops. As said, they are not that important in scientific computing. Nonetheless, you gonna use them now and then. In contrast to a *for*-loop, a *while*-loop doesn't run until the end of a list is reached, but rather until a certain statement is not True anymore. To write a *while*-loop you need the keyword **while** followed by this statement. The statement always consists of a variable, a comparator-operator, and a comparison value. The only exception is the *while True:* loop, which simply runs forever.

The most common usecase in scientific computing are probably approximation-algorithms. For example, the numerical calculation of function roots using the Newton iteration.

```python
x_new = x0
x_old = x_new + 2*h
while abs(x_old-x_new) >= h:
    x_old = x_new
    try:
        x_new = x_old - f(x_old)/derivate(f, x_old, h)
    except:
        x_new = np.nan
        break
```

I won't explain the details of the algorithm or this specific code snippet here, but as you can see, it uses a while loop to check if the algorithm has already converged. The statement checks if the difference between the calculated value of the root and the one calculated in the previous iteration is bigger than a specified threshold *h*. If this is not True anymore, the loop breaks and it is assumed that the algorithm has converged. The last calculated x-value is than one root of the given function f(x).

#### If-else Statements

If-else statements are exactly what it sounds like they are; they are used to execute some lines of code only if a certain condition is met.

Let's say you want to check if some value is bigger than a certain threshold and sort it based on this.

```python
value = 12
threshold = 10

if value > threshold:
    print("The value is to big)
```

So, similar to the *while*-loop, a *if*-statement consists of a keyword (**if**), the condition, and a colon. The code which is executed when the condition is true is of course indented. Note, that my example above is a completely valid *if-else*-statement, even tough it has no "else" in it. If you omit the else, Python assumes you just want to do nothing and proceed with the rest of the script, if the statement is not met. Some people want to be more explicit about it and therefore use an empty else statement ("pass" in Python means: "Do nothing, just go on").

```python
value = 12
threshold = 10

if value > threshold:
    print("The value is to big)
else:
    pass
```

Before we get into more complex *if-else*-constructions, we gonna explore the different conditional operator you can use. First you have the mathematical operators (<, >, =). They basically work as expected and can be combined to "is smaller or equal" and "bigger or equal"(<=, >=). However, the order matters; "=<" and "=>" are invalid syntax. If you want to test for equality, you have to use the double-equal-sign (==) and for non-equal a explanation mark with a equal sign (!=).

```python
1 > 2
Out[7]: False

1 < 2
Out[8]: True

1 > 1
Out[9]: False

1 => 1
  File "<ipython-input-10-629858911a41>", line 1
    1 => 1
       ^
SyntaxError: invalid syntax


1 >= 1
Out[11]: True

1=1
  File "<ipython-input-12-abb4cdcb09da>", line 1
    1=1
       ^
SyntaxError: can't assign to literal


1==1
Out[13]: True


1!=1
Out[14]: False
```

These mathematical operators are nor limited to integer or float values, but also work with strings, lists, or boolean values (True or False). However, only objects of the same type can be compared. The "magnitude" of a string is determined by its position in the alphabet ("a"<"aa"<"b"<"ba"<"c"), while strings containing numbers are positioned before alphabetic values ("1"<"1a"<"2"<"a"). Regarding booleans, True is by convention bigger than False. Just play around with these examples a little bit to get familiar with the mechanics.
As substitution for the double-equal you can just use the English "is". This is actually the preferred way when comparing boolean values. In combination with any of these comparison operators, you can use the "not" at the beginning to reverse the statement.

```python
a = True

a is True
Out[29]: True

not a is True
Out[30]: False

not 1 < 2
Out[33]: False
```


Another handy thing is to check if something is member of another object. This can be done with the "in" operator.

```python
"b" in "abc"
Out[58]: True

2 in [1, 2, 3]
Out[59]: True
```

The last important thing to know is, how to check if an object is empty, but exists. If you assign a new variable using empty quotes or empty square-brackets (empty_string="" or empty_list=[]), an empty object is created. You can check for this inside a if statement by calling the variable name.

Input:
```python
a = ""
if a:
    print("a is not empty")
if not a:
    print("a is empty")
```

Output:
```python
A is empty
```

You can chain multiple conditional statements together using "and" or "or".

```python
a = 4

3 < a < 6
Out[61]: True

a == 2 or a == 4
Out[62]: True

b = 5

a == 4 and b == 5
Out[64]: True
```

Also, you can combine multiple if statements using the **elif**-keyword:

```python
a = 2
if a == 1:
    print("a is 1")
elif a == 2:
    print("a is 2")
else:
    print("a is some other number")
```

The output is of course "a is 2". But what happens in the following situation?

```python
a = 2
if a < 3:
    print("a is smaller than 3")
elif a == 2:
    print("a is 2")
else:
    print("a is some other number")
```

Output:
```python
a is smaller than 3
```

Both, the first and the second statement are true. However, only the first case gets executed. Therefore, to avoid complications, only use *elif*, if just one of the statements can be satisfied at a time. To do something like above, you would just use multiple *if*-statements.

```python
a = 2
if a < 3:
    print("a is smaller than 3")
if a == 2:
    print("a is 2")
```

Output:
```python
a is smaller than 3
a is 2
```

So I think that's pretty much everything to know about *if-else*-statements. I gonna spare you with more complex examples as you will see *if*-statements throughout the next parts of this Python tutorial (how ever many they may be).

#### Functions

Functions in python are not per se functions in the mathematical sense; they are more like a macro for some lines of code you need to reuse multiple times inside your script. That said, it is important to understand that a function is a separated scope inside your program. It is comparable to a small independent country with strict border controls. Only some people (=python objects) can get in or out and what they do, is of non concern for all the surrounding countries (=rest of your script).
Ok, let's talk Python:

To create a function you have to use the keyword *def* followed by the function name and the input parameters (border-control-rules) enclosed in parentheses. Finally, you end the line with a colon.

```python
def add_1(x):
    new_x = x + 1
    print(new_x)
```

I think, it is obvious what this function does. But how to use it and what did I meant by "separated scope"? To use a function you simply have to call it by name and pass input-parameters enclosed in parentheses.

```python
add_1(3)
```

Here, we called our function with "3" as parameter. So, our "3" immigrates into our small country. However, while doing so, it changed its name and is as of now known as "x" inside of the function's scope. Than 1 is added and the result is printed out to the screen as expected. Let's quickly check that this hasn't changed anything outside the function. If we try to call new_x outside the function, we get the following error message:

Input:
```python
def add_1(x):
    new_x = x + 1
    print(new_x)

add_1(3)

print(new_x)
```

Output:
```python
4
NameError                                 Traceback (most recent call last)
<ipython-input-34-938af61573da> in <module>()
      5 add_1(3)
      6
----> 7 print(new_x)

NameError: name 'new_x' is not defined
```

So, "new_x" doesn't exist outside of the function. The other way around, however, you can access (but not modify) variables defined outside the scope without explicitly passing them.

Input:
```python
def add_1(x):
    print(y)
    new_x = x + 1
    print(new_x)

y = 4
add_1(3)
```

Output:
```python
4
4
```

I am only showing this very briefly, because I want you to immediately forget that this option even exists. Using global variables inside a scope is a **very bad habit**. If you need certain variables inside of your function, pass them as arguments.

Now that we understood the concept of passing variables from our script to a function, its time to learn how to retrieve variables from a function. Using the **return** statement, it is possible to capture the output of a function. On the script-side this output can be assigned to a variable.

```python
def add_1(x):
    new_x = x + 1
    return new_x

result = add_1(3)
print(result)
```

You can also return multiple values:

```python
def add_1(x):
    new_x = x + 1
    return x, new_x

old_x, result = add_1(3)
print(old_x, result)
```

Before we move on to some advanced examples (unfortunately not in this part of the tutorial), I want to show you the real power of parameter-passing in Python. Fist, passing parameters by name instead of position.

Lets say, we have a function, which takes 3 arguments:

```python
def add_values(x, y, print_result):
    result = x + y
    if print_result is True:
        print(result)
    else:
        return result
```

What does this function do? - It adds up the first two arguments and prints the result to the screen if the third argument is set to True. If not, it just returns the value to the rest of the script. We can call it like this:

```python
add_values(4, 6, True)
```

We chose a good name for our function. So, by just looking at this line, it is pretty clear that the function is gonna add up the first two values. But, what is the "True" doing? Fortunately, Python support calling arguments by name. This makes the call immediately understandable:

```python
add_values(4, 6, print_value=True)
```

But be careful, you can't call a keyword argument (call by name) before a non-keyword argument (call by position). Doing so, will produce an error:

```python
add_values(x=4,5, True)
  File "<ipython-input-73-620c6e9c73c7>", line 1
    add_values(x=4,5, True)
                  ^
SyntaxError: non-keyword arg after keyword arg
```

Therefore, always put the arguments which should be callable by name at the end when declaring your function.
Furthermore, we should consider making the print parameter optional. Most of the time it will be set to false any way (if anybody would use this kind of useless function). So, it is just annoying to type it out every damn time.
To make a parameter optional, just give it a default value like so:

```python
def add_values(x, y, print_result=False):
    result = x + y
    if print_result is True:
        print(result)
    else:
        return result
```

Now we can just omit the parameter when calling the function and if we don't want to print out the value.

```python
add_values(4, 6)
```

Or specify it when we want to have the print functionality:

```python
add_values(4, 6, print_value=True)
```

So these are the essentials to getting started on the pure Python side of things. Of course, we barley scratched the surface, but I think it is enough for now. I want to finish up this part of the tutorial with a few words about object oriented programming. Yeah... No real practical example this time around because the post is already pretty long. But, we gonna use this opportunity and kick of the next lesson with a nice, more complex example to refresh our knowledge about everything we learned so far.

### Object oriented

As you already know, Python is heavily object oriented; everything is an object. If you want to be a efficient Python programmer you have to understand that and use it to your advantage.
Because everything is an object, there is no real difference between a list, a string, a function, or even a module; they all treated as objects with their respective functions and properties. Therefore, you can take all these objects, pass them around, assign them to variables, return them as function outputs, put them in lists, and so on without changing anything about the object itself.
For example, something like this works:

```python
def add_1(x):
    new_x = x + 1
    print(new_x)

my_add_function = add_1
my_add_function(5)
```

Or:

```python
def add_1(x):
    new_x = x + 1
    print(new_x)

def add_2(x):
    new_x = x + 2
    print(new_x)

my_add_functions = [add_1, add_2]
my_add_functions[0](5)
my_add_functions[1](3)
```

You can even pass a function as argument to another function:

Input:
```python
def my_add(x,y):
    return x+y

def my_sub(x,y):
    return x-y

def math(x,y,operation):
    return operation(x,y)

math(4,8, operation = my_sub)
math(4,8, operation = my_add)
```

Output:
```python
12
-4
```

And finally to fully get into Python's "black magic", create and return a function from a function. This is called a "closure".

Input:
```python
def add_creator(value):
    def add(x):
        print(x + value)
    return add

add_1 = add_creator(1)
add_5 = add_creator(5)
add_7 = add_creator(7)

add_1(3)
add_5(3)
add_7(3)
```

Output:
```python
4
8
10
```
 *Don't worry if you don't get it... Its not something you gonna need very often.*

The other important thing that derives from Python's object orientation, is that many basic things you do, are actual function calls on an object. For example, if you are trying to get an element from a list (list[n]), no Voodoo happens, but rather the *\_\_getitem\_\_()*-function of the list object is called. With this knowledge, you can mess around and change the fundamental behaviour of python, or enable cool things, like element calling, for custom created objects. But this is again a lesson for another day. For now, just keep in mind, everything is an object and can be passed around without loosing its properties and behaviours.

*PS: Maybe you read through this tutorial and thought, why the hell should I need a function which can add 1 to a value, or why do I possible want to check if 12 is greater than 10? Simple answer - You don't! These short example are meant to visualise the syntax and the basic possibilities. In a complex example it is much harder to showcase only a single basic part of Python's capabilities. However, if you understood this basic examples, I am sure you can think of more complex and useful ones. With that said, keep on coding and learning!*

This is everything for today. I am sure you learned something and further I hope that I woken your interest to learn more about Python. As always, leave a comment or contact me in any other way if you have questions, critic, suggestions, or anything else.
