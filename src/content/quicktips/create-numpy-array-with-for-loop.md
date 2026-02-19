---
title: "The proper way to create a numpy array inside a for-loop"
date: 2015-04-14
tags: "Python"
permalink: create-numpy-array-with-for-loop
---

A typical task you come around when analyzing data with Python is to run a computation line or column wise on a numpy array and store the results in a new one.
Ok - sounds not too bad:

1. Initialize an empty array to store the results in
2. Create a *for*-loop looping over the lines/columns of the data array
Inside the loop:
3. Do the computation
4. Append the result array

**NOTE: This Post is now a couple of years old and I found some ways, that are for sure better than the one showed here. Actually, the shown solution is very slow, as the array has to be copied after each iteration. Therefore, I would suggest not using the code I will demonstrate in the following. I will leave the post here as one of these "Man you were stupid back then"-reminders. If you came across the same issue, I described above, consider using a simple python list, and converting it to a numpy array at the end (this is way faster!). If you know the exact size of the final array (which I assumed you do not), you can also try initializing an empty array with this size first and then replace certain parts by index inside of the loop. I hope that helps, and sorry if that is not the solution you came here for!**

Inside a script it would look something like this:


```python
result_array = np.array([])

for line in data_array:
    result = do_stuff(line)
    result_array = np.append(result_array, result)
```

Maybe you have already spotted the problem. Running this snippet as it is, the result_array will only be appended in one dimension. This means, that a (20, 100) data array will result in a (, 4000) result array (if the computation you are doing preserve the number of datapoints). So that not what we wanted.

Adding the axis parameter to the ```append``` function, doesn't help either.

```python
result_array = np.append(result_array, result, axis=1)
```

The next idea you may come around is nesting the result array:

```python
result_array = np.append(result_array, [result], axis=0)
```

But this will result in the following error message:

```python
Traceback (most recent call last):

  File "<ipython-input-23-9e649ee3e8f4>", line 3, in <module>
    result_array = np.append(result_array, [result], axis=0)

  File "C:\Users\arne__000\Anaconda3\lib\site-packages\numpy\lib\function_base.py", line 3872, in append
    return concatenate((arr, values), axis=axis)

ValueError: all the input arrays must have same number of dimensions
```

If you observe this issue a little bit closer you will find out that your empty array has the shape (,0) while [result] has a shape of (1, 100). So obviously the arrays have a different number of dimension and therefore, can not be merged together.

Ok... Enough... Let's look at a proper way to accomplish what we want...

As we learned from our last try, the shape of our empty array seems to be the problem. So how do we change the shape of an **empty** array?
Fortunately, numpy already has the tools we need! Instead of creating a empty list and converting it into a numpy array - as we did before - we gonna use the numpy.empty() function to create an empty array with a specified shape:

```python
result_array = np.empty((0, 100))
```

So we have to chose the size of the empty array to be 0 in the dimension we want to append the array and to match the size of our data array in all other dimensions.

Our final working example looks like this:

```python
result_array = np.empty((0, 100))

for line in data_array:
    result = do_stuff(line)
    result_array = np.append(result_array, [result], axis=0)
```

The key things to keep in mind are:
1. Nest in the result array (result --> [result])
2. Initialize your empty array with specified size (np.array([ ]) --> np.empty((0, 100)))
