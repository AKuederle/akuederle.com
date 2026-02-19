---
title: "Automate your Paperwork with Latex and Python (Part 1 - POC)"
date: 2015-05-27
tags: "Latex Python Workflow Productivity"
permalink: Automatization-with-Latex-and-Python-1
---

Many people, who work especially in small businesses, are using Word or other Word-processors to write their invoices, contracts, or applications. This is fine (if you can stand the little annoying things such programs sometimes do), however, they lack the option to really automate repetitive work in any way.

A big part of the aforementioned paperwork consists of metadata and very little actual writing; and this person or project related matadata is usually already written down somewhere else for archiving or accounting purposes. So why should you type it out all over again every time?

In this little two part series, I want to show how you can use Python (or any other programming language you're comfortable with) to create a Latex letter template pre-filled with the right metadata and to fully automate your invoices. In this first post I gonna show you the general concept and in the second post we gonna work on real and usable examples.

## Proof of Concept

Let's start with a bare bone example to proof the concept. What we want is a Python script which can do the following:

1. Load data from a file
2. Create Tex-code based on the loaded data
3. Compile the Tex-code to produce a pdf

To keep everything simple for now, we gonna use a simple .txt file with a easy to parse datastructure. Here is what its content looks like:

```text
%Name: Test Project
%Description:
It is awesome
%Address:
Nowhere
Not-here-street 45
655589, no-city
%Contact: test@test.de
%Notes:
Project good!
```

As you can see, it some kind of key-value structure. Keys are marked by a "%" in the beginning and a colon at the end. The values are everything in between the keywords. Based on this we are going to create regular expressions which can extract the keys and the values separately. I wont explain how regular expressions work in this post. If your are interested in this topic, I would suggest to check out some of the great tutorials out there. Nonetheless, here are the two regular expressions which work for our case.

```text
%(.+):

:\s*([\w\W]+?)\s*(?:%|$)
```

The first one identifies the keys by looking for everything between a "%" and a ":"; the second looks for everything between a ":" and a "%" or the end of the file.


### The Python Script

Let's implement this RegEx-search in Python. I'm assuming the our txt file is called "example.txt" and is placed in the same folder as our Python script.

```python
import re # import regular expressions module

project = "./" # specify the project folder
in_file = "{}example.txt".format(project) # path to the txt-file relative to the project folder

with open(in_file) as f:    # loads the file
    content = f.read()
    keys = re.findall(r"%(.+):", content)   # find the keys using RegEx
    values = re. findall(r":\s*([\w\W]+?)\s*(?:%|$)", content) # find the values using RegEx

options = zip(keys, values) # combining keys and values in one nested list
```

If you would print out the options list at this point, it looks like this:

```text
[('Name', 'Test Project'),
    ('Description', 'It is awesome'),
    ('Address', 'Nowhere\nNot-here-street 45\n655589, no-city'),
    ('Contact', 'test@test.de'),
    ('Notes', 'Project good!')
    ]
```

*Halfway through!*

Now, we have to generate our Latex code based the data. To keep everything as separated and modularised as possible, we want to generate as little Tex-code as possible with our Python script. The styling and the layout of the later document will be handled by a Latex template file. The following python lines produce Latex code which creates Latex variables out of our key-value pairs. In our Latex template file we can use *\keyname* to place the values inside of our document.

```python
tex_code = ""
for key, value in options:
    tex_code = tex_code + "\\newcommand{{\\{}}}{{{}}}\n".format(key, value)
```

To make the produced Tex code compilable, we gonna add a "minimal" Tex-document and write everything to our output file. To keep our actual project folder clean, we gonna put all the generated documents in the ".build" - subfolder.

```python
template = "test"
tex_code = tex_code + """

\\documentclass{{{}}} % din a4, 11 pt, one-sided,

\\begin{{document}}

\\end{{document}}
""".format(template)

import os

build_d = "{}.build/".format(project)
out_file = "{}template".format(build_d)

if not os.path.exists(build_d):  # create the build directory if not existing
    os.makedirs(build_d)

with open(out_file+".tex", "w") as f:  # saves tex_code to output file
    f.write(tex_code)
```

As you saw, I introduced the new variable "template". Later, we want to use this variable to specify the wanted style sheet/document type.

The only thing left is the compiling of our Tex-code. We gonna use a system call to run pdflatex. To keep everything clean its output is directed to the ".build"-folder. Only the produced pdf is copied back in to the main folder.

```python
os.system("pdflatex -output-directory {} {}".format(os.path.realpath(build_d), os.path.realpath(out_file)))

shutil.copy2(out_file+".pdf", os.path.dirname(os.path.realpath(in_file)))
```

YEAH! We are done on the python side. Let's write a minimal Latex template to display our variables.

### The Tex Template

A template in Latex is called a class. Which template is used by a document is defined by the ```\documentclass{}``` command. To create your own, you have to create a ".cls" file with some Latex commands in it.

We gonna create a file called "test.cls" inside the *.build* folder for now. To start of a class you have to specify your TEX version and your class-name:

```latex
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{test}
```

Because, we don't want to start from scratch, we import one of Latex's default classes as our basis. Furthermore, we load some required package (like you would in a usual Latex document).

```latex
\LoadClass[12pt,a4paper]{article}

\RequirePackage[left=2.5cm,right=2.5cm,top=3.5cm,bottom=3.5cm]{geometry}
\RequirePackage[ngerman]{babel}
\RequirePackage[T1]{fontenc}
\RequirePackage[latin1]{inputenc}
```

Now, we can add our new commands. As this is a simple POC we just want to print out our specified variabels at the beginning of the document. We gonna overwrite the *\document*-command to achieve that, a handy trick I explain in this [quicktip](/quicktips/extend-latex-begin-document/).

```latex
\let\ori@document=\document
\renewcommand{\document}{
  \ori@document  % Begin document
  \Name\\
  \Address\\
  \Notes\\
  \Contact\\
  }
```

To finish up a class file, you have to add the following line:

```latex
\endinput
```

Time to give it a try!
Here is the beautiful pdf-output after running the .py file:

<img src="/images/posts/py_tex_automate/POC_final.jpg " width="300" />

That is it! We have got I nice proof of concept. We were able to generate and compile Tex-code using a Python script. Furthermore, we were able to use some kind of metadata file to modify certain parts of the final document. As always, you can find the full code on [github](https://github.com/AKuederle/Py-Tex-automation-example/tree/POC).

In the next part of this series, we will design a letterhead and a invoice layout. Also, we will add command line parameters to our python script!
