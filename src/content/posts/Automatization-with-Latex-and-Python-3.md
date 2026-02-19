---
title: "Automate your Paperwork with Latex and Python (Part 3 - Reports based on Excel Data)"
date: 2016-12-19
tags: "Latex Python Workflow Productivity"
permalink: Automatization-with-Latex-and-Python-3
---

[Last time](/posts/Automatization-with-Latex-and-Python-2/) we rewrote the proof of concept using jinja and introduced argparse. This time we will take the knowledge we gathered to apply it to a more real life example: We will parse an Excel file and generate a report using its content.

## Refactoring the previous Work

Before we apply what we did the last time to more complex examples, it is time to clean the code up and refactore it a little.
We want to extract the main functionality and rewrite it in form of functions. I further decided to put these functions into a separate file ```utils.py```, we can then import and use in multiple other scripts.
The main functions are parsing the option file (see [part1 for detail](/posts/Automatization-with-Latex-and-Python-1/)):

```python
def get_options_from_file(path):
    """Read a options file.

    The pattern in the file is '%<key>:<value>'
    """
    with open(path) as f:
        content = f.read()
        keys = re.findall(r"%(.+):", content)
        values = re. findall(r":\s*([\w\W]+?)\s*(?:%|$)", content)

    options = dict(zip(keys, values))
    return options
```

... generating a jinja template with Latex tags:

```python
def get_template(template_file):
    """Get a jinja template with latex tags.

    modified from http://eosrei.net/articles/2015/11/latex-templates-python-and-jinja2-generate-pdfs
    """
    latex_jinja_env = jinja2.Environment(
    	block_start_string = '\BLOCK{',
    	block_end_string = '}',
    	variable_start_string = '\VAR{',
    	variable_end_string = '}',
    	comment_start_string = '\#{',
    	comment_end_string = '}',
    	line_statement_prefix = '%%',
    	line_comment_prefix = '%#',
    	trim_blocks = True,
    	autoescape = False,
    	loader = jinja2.FileSystemLoader(os.path.abspath('/'))
    )
    template = latex_jinja_env.get_template(os.path.realpath(template_file))
    return template
```

... render the template and compile the tex-file to pdf:

```python
def compile_pdf_from_template(template, insert_variables, out_path):
    """Render a template file and compile it to pdf"""

    rendered_template = template.render(**insert_variables)
    build_d = os.path.join(os.path.dirname(os.path.realpath(out_path)), '.build')
    print(build_d)
    if not os.path.exists(build_d):  # create the build directory if not exisiting
        os.makedirs(build_d)

    temp_out = os.path.join(build_d, "tmp")
    with open(temp_out+'.tex', "w") as f:  # saves tex_code to output file
        f.write(rendered_template)

    os.system('pdflatex -output-directory {} {}'.format(build_d, temp_out+'.tex'))
    shutil.copy2(temp_out+".pdf", os.path.relpath(out_path))
```

Checkout the full version on [github](https://github.com/AKuederle/Py-Tex-automation-example/blob/p3/example1/utils.py). There you can also find a [version of the old parser](https://github.com/AKuederle/Py-Tex-automation-example/tree/p3/POC), refactored using the new functions.


## Parsing Excel Files

For this example I prepared a dataset with 3 columns: An unique index, a name (some random words) and a category. I chose the categories to be just numbers between 1 and 10 randomly assigned to the data points, but they can be everything else. To make it easier for later, I stored them in the upper corner of an [excel sheet](https://github.com/AKuederle/Py-Tex-automation-example/blob/p3/example1/test_data.xls):

<img src="/images/posts/py_tex_automate_3/data.png " width="450" />

Our goal is to read the data, group it by the category and then display the index and the name in the final report in one section per category.

For reading the Excel file we gonna use [Pandas](http://pandas.pydata.org/), one of the best Python data-anaysis libraries. It makes working with any kind of DataSources a breeze:

```python
product_data = pd.read_excel('./test_data.xls', index_col='Index')
```

If you have a more complex excel file, with multiple sheets and multiple tables per sheet, you of course need to add some more parameters to the function call. Check the [documentation](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_excel.html) for more details.

Now, we have to process the data a little, before we can pass it on to the templating engine. Thinking a bit ahead, we know that we want to have on section per category. Therefore, it might be a good idea to have the data in a way, that we can get the items belonging to each category by iterating over the data. What I decided to do, is a dictionary, with the category names as keys and the respective datapoints as values.

First, we gonna extract the list of unique keys from the dataframe:
```python
categories = product_data['Category'].unique()
```

If we now iterate over this list, we could extract the items belonging to each category:

```python
for cat in categories:
    print(cat, product_data[product_data['Category']==cat])
```

If you try the code above, you will see the following:

```python
5            Name  Category
Index
0         Adult         5
7         Album         5
14     Backpack         5
21          Bed         5
22          Bed         5
45        Chess         5
8             Name  Category
Index
1      Aeroplane         8
15       Balloon         8
19      Bathroom         8
34         Brain         8
47         Chief         8
48         Child         8

...
...
```

There are two issues with that: First the categories (the indices are, but just by chance) are not ordered, and second, we still have a Pandas data type (each of these little tables is a pandas DataFrame), which we can't easily pass into our jinja template.
 Therefore, we need to convert the DataFrames to dictionaries. As we want to use the index as dictionary key we need to transpose (flip rows and cols) before we do that:

 ```python
for cat in categories:
     print(cat, product_data[product_data['Category']==cat].T.to_dict())
```

 The output looks exactly as we want:

```python
5 {0: {'Name': 'Adult', 'Category': 5}, 21: {'Name': 'Bed', 'Category': 5}, 22: {'Name': 'Bed', 'Category': 5}, 7: {'Name': 'Album', 'Category': 5}, 45: {'Name': 'Chess', 'Category': 5}, 14: {'Name': 'Backpack', 'Category': 5}}
8 {48: {'Name': 'Child', 'Category': 8}, 1: {'Name': 'Aeroplane', 'Category': 8}, 34: {'Name': 'Brain', 'Category': 8}, 19: {'Name': 'Bathroom', 'Category': 8}, 15: {'Name': 'Balloon', 'Category': 8}, 47: {'Name': 'Chief', 'Category': 8}}
1 {24: {'Name': 'Bible', 'Category': 1}, 2: {'Name': 'Air', 'Category': 1}, 3: {'Name': 'Aircraft', 'Category': 1}, 4: {'Name': 'Carrier', 'Category': 1}, 31: {'Name': 'Bowl', 'Category': 1}}
```

Let's put it all in one expression and store it:

```python
nested_product_list = {k:product_data[product_data['Category']==k].T.to_dict() for k in categories}
```

I used a nice [dictionary comprehension](https://www.python.org/dev/peps/pep-0274/) for that. Now we can iterate over ```nested_product_list``` to get the items for each category and then over each dictionary value to get the individual products. Their properties can then be accessed as a dictionary.

As example: ```nested_product_list[5][21]['Name']``` would get us the name of the item with the index 21 which belongs to category 5.
We will take this nested dictionary and pass it as variable into our template. You might ask, how do we print it there? - We will have to use loops and logic inside of our template!!

## Designing a Template

Therefore, let's start designing a template in a second file. Jinja allows us to use some logic like loops, ifs, filters,... in our templates. if you want learn about it check out the official documentation. To use them, we have to escape them in a "Block" tag. To make jinja compatible with Latex we changed this tag from "{% %}" to "\BLOCK{ }".
But first, we need a minimal amount of LaTex:

```latex
\documentclass[12pt,a4paper]{article} % din a4

\begin{document}
\section{Product List by Category}

\end{document}
```

This produces a minimal document with a section titled "Product List by Category". Below this we want to put our logic. We will start with the outer loop:

```latex
\BLOCK{ for key, value in products | dictsort}
\subsection{Category \VAR{key}}
\begin{tabular}[c]{ll}
    Index & Name \\
    \hline
    % Here will the inner loop go.
\end{tabular}
\BLOCK{ endfor }
```

As you can see, looping works very similar to Python. We are using a special ```dictsort```-filter here. It solves the issue we had before, that the categories were randomly ordered. In general, you use filters as follows: ```variable | filter```. Furthermore, note that the loop has to be finished by a ```\BLOCK{ endfor }```. Inside the loop we can access the variables ```key``` and ```value``` using the ```\VAR{ }``` tag. The rest is simple LaTex. So we create a subsection title for each category and then an empty table below it. Latter, will be filled by the inner loop. The final template looks like that:

```latex
\documentclass[12pt,a4paper]{article} % din a4

\begin{document}
\section{Product List by Category}
\BLOCK{ for key, value in products | dictsort}
\subsection{Category \VAR{key}}
\begin{tabular}[c]{ll}
    Index & Name \\
    \hline
    \BLOCK{ for inner_key, inner_value in value | dictsort}
        \VAR{inner_key}& \VAR{inner_value['Name']}\\
    \BLOCK{ endfor }
\end{tabular}
\BLOCK{ endfor }
\end{document}
```

As you can see, we used a second loop to create the table line by line with the index and the name of the product.

Now we have to plug everything together!

## Putting everything together

We have a Python script that looks like that:

```python
import pandas as pd
import utils

product_data = pd.read_excel('./test_data.xls', index_col='Index')

categories = product_data['Category'].unique()

nested_product_list = {k:product_data[product_data['Category']==k].T.to_dict() for k in categories}
```

To use pass our product list into our template, we use our util functions:

```python
template = utils.get_template('./example1_template.tex')
variable_dict = {'products': nested_product_list}
utils.compile_pdf_from_template(template, variable_dict, './ex1.pdf')
```

Note, that I named the template file ```example1_template.tex``` and placed it in the same folder as the script.
The product list is passed to the template as part of a variable dictionary. The respective key must match the variable name in our template (```products```).
Running this script should produce the output file ```ex1.pdf``` in the same folder:

<img src="/images/posts/py_tex_automate_3/final.png " width="500" />

If you still wondering, when you could possible need that, here some use cases:

1. You manage your finances for your small business in Excel and at the end of each project you need to send an invoice to your customer. Wouldn't it be nice, if you could quickly generate a nice pdf with all the expenses listed and summed up?
2. You regularly need to generate reports from your data base and you still need a printed version for archiving. Wouldn't it be nice, if these reports would nice on paper and not like you printed a bad formated website?

I am sure there are a lot more use cases, I couldn't think of right now. Let me know in the comments if what you are using Latex templating for!

I know, this tutorial was a little hard to follow. But don't worry! Download the [Code from Github](https://github.com/AKuederle/Py-Tex-automation-example/tree/p3/example1) and run it yourself. You should be easily able to adapt it to your needs. And if not, let me know in the comments or via email and I will try to help you as good as I can.

In the next tutorial we will further improve this version with some option file configuration. So stay tuned!
