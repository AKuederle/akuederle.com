---
title: "Automate your Paperwork with Latex and Python (Part 2 - Jinja + Argparse)"
date: 2016-12-09
tags: "Latex Python Workflow Productivity"
permalink: Automatization-with-Latex-and-Python-2
---

It has been a while since the first part of this post. The main reason being, that I kind of gave up on the Proof of Concept I detailed in the [there](/posts/Automatization-with-Latex-and-Python-1/), because I discovered a seriously better way to do it. The magic is called **template engines**!


## Using Jinja2

A template engine is a tool, that can parse a textfile and replace certain patterns with variables provided. Sounds like what we need!
A very popular template engine for Python is [Jinja2](http://jinja.pocoo.org/docs/dev/), which is for example used by the well known [Flask](http://flask.pocoo.org/) web-framework. I will not do a full jinja tutorial here, but there are many resources out there to learn its full power!

In the following we will replace the second part of our previous [parse script](https://github.com/AKuederle/Py-Tex-automation-example/blob/POC/parser.py) with the magic of jinja2 (install jinja with ```pip install Jinja2```). First we need to adapt the jinja parsing for LaTex. By default, it is looking for "{% %}" and "{{ }}"tags in the document. As it might happen that we type these characters in our LaTex document without wanting them to be replace, we tell jinja to look for something else. The most elegant solution, in my opinion, is two use "Latex-like" commands, as detailed in this [blogpost from Brad Erickson](http://eosrei.net/articles/2015/11/latex-templates-python-and-jinja2-generate-pdfs). The following lines are shamelessly copied from there:

```python
# modified from http://eosrei.net/articles/2015/11/latex-templates-python-and-jinja2-generate-pdfs
import jinja2
import os
from jinja2 import Template
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
```

Putting that into our parse.py-file will configure jinja2 to look for "\\VAR{ }" to find variables for replacing and "\\BLOCK{ }" to find code for execution. Have a look at the linked blogpost for more details.

So, instead of awkwardly writing LaTex-syntax to a file using Python (as we did before), we can now create a LaTex file containing some keywords and replace them on runtime with our variables. We gonna ignore the ```.cls``` file we created last time and make a new file called ```template.tex```:

```latex
\documentclass[12pt,a4paper]{article} % din a4, 11 pt, one sided

\begin{document}
\VAR{Name}
\VAR{Address}
\VAR{Notes}
\VAR{Contact}
\end{document}
```

This is a very simple document with basically no configuration. The only interesting thing are the "\\VAR" tags. These are replaced in the next step using jinja. The words in the curly braces are the variables names we want to use for replacing them.

To do so, we have to tell jinja where the file is and let it convert it into valid LaTex:

```python
template = latex_jinja_env.get_template(os.path.realpath(template_file))

options = dict(zip(keys, values))
renderer_template = template.render(**options)

if not os.path.exists(build_d):  # create the build directory if not existing
    os.makedirs(build_d)

with open(out_file+".tex", "w") as f:  # saves tex_code to outpout file
    f.write(renderer_template)
```

In the first line we pass jinja the path to our template file (we will generate the template_file variable later). Then we create a dictionary from our variables, we parsed from our input file (see [first part](/posts/Automatization-with-Latex-and-Python-1/) of the blogpost for details). These options dictionary is passed to the ```template.render``` function, which makes all dictionary keys available as variables in the template (\*\*-syntax is called [dictionary unpacking](http://python-reference.readthedocs.io/en/latest/docs/operators/dict_unpack.html)). Jinja will replace all occurrences of these variables with their respective value and return a rendered string. We save this string into an output tex-file. This file is valid LaTex and can then be compiled as before:

```python
os.system('pdflatex -output-directory {} {}'.format(os.path.realpath(build_d), os.path.realpath(out_file + '.tex')))

shutil.copy2(out_file+".pdf", os.path.dirname(os.path.realpath(in_file)))
```

Now we are back at the point, where the last blogpost ended. However, we made use of template engine, which made our code cleaner and easier to work with on the Latex side. To make this script useful in everyday work, we will now improve its usability.


### Adding Comandline Arguments

If you plan to use a similar script to generate e.g. invoices for each of your projects, you don't want to edit the python file every time to modify the file paths. Therefore, we gonna add some commandline arguments.

Simple commandline arguments can be easily handled by Python using the [```argparse``` module](https://docs.python.org/3/library/argparse.html). We gonna add two flags, one for the inputfile and one for the template:

```python
parser = argparse.ArgumentParser(description='Render a LaTex Template with variables.')

parser.add_argument('-i','--in', help='Input File', required=False, default='./example.txt' )
parser.add_argument('-t','--template', help='Template File', required=False, default='./template.tex')
args = vars(parser.parse_args())
```

The defaults there are just for this test setup and can easily be changed to you liking. You could also omit them and set the ```required=True``` parameter for each flags. This will force the user to specify both, and will return an error otherwise. If you plan to share your script with others, you should also improve the help texts!

If we call our script now like this:

```bash
python parser.py -i example.txt -t template.tex
```

... we can get the path to the input and the template file from the args dictionary:

```python
in_file = args['in']
template_file = args['template']
```

And we are done!! We created a universal LaTex templating script, we can now easily feed with our custom templates using the modified jinja tags. The script can live somewhere in our ```PATH``` and we can call it whenever we need it in one of our projects. The next step would be to allow different input-file formats. For example an excel file, where you have stored your customer information in. If you have specific requirements on how to parse the input files, let me know in the comments and I will try to help you! The full code can be found on [github](https://github.com/AKuederle/Py-Tex-automation-example/tree/p2) as always!

Thanks for reading and let me know, if you found that short tutorial helpful!
