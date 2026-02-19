---
title: "Create your own professional digital Signature and learn about custom LaTex Packages"
date: 2015-05-18
tags: "LaTex Workflow"
permalink: create-professional-signature-with-latex
---

As classical post correspondence dies out, letters and contracts are usually sent over the internet. However, most official documents still have to be signed in some way. Because, printing-signing-scanning is an annoying thing to do, I am going to show you how to easily implement a professional looking signature in to your LaTex documents. On top of this, we gonna learn a lot about LaTex packages and option parsing. So, let the fun begin!

First, let us take a look at the results:

<img src="/images/posts/tex_signature/final.png" width="700" />

Creating something like this in LaTex using a picture of a scanned signature is actually pretty easy. But, we are long-term-thinking individuals. Therefore, we wont be content with just writing a few lines of simple LaTex code! What we want is a flexible, modular, and non-redundant solution we can use in all of our writing projects!

So how do we approach this task?

The best solution seems to be a LaTeX package that provides some kind of command, which allows us to create our signature in one line and without specifying our personal information every time. The problem is, we need to store the "personal" information somewhere. Hardcoding them into the package is no real solution. Therefore, we need some kind of settings file as well. Lastly, we have to implement some options (style, positioning, etc.) the user can select when using the package.

## Creating the LaTex Packages

LaTex packages are not that different from any other kind of Tex-document. They share most of the syntax, but are saved as .sty instead of .tex. Instead of \documentclass and \begin{document}, as in a usual document, a bare bone package file looks something like this:

```latex
\NeedsTeXFormat{LaTeX2e} % required version of Latex
\ProvidesPackage{mysignature}
  [2015/05/17 v0.01 LaTeX package to create a signature] % Package description

\endinput
%%
%% End of file `mysignature.sty'.
```

So, all the code you write goes inbetween the package description and "\endinput".

Let's start coding!
The first step is to import needed Latex packages. However, instead of *\usepackage*, you use *\RequirePackage* inside a .sty file.

The following packages are required for our project (I will explain them, when we need them):

```latex
\RequirePackage{kvoptions} % allow key value options
\RequirePackage{graphicx} % for pictures
\RequirePackage{xstring} % for string comparison
```

### Key-value Import Options

Many popular LaTex packages, for example geometry, use a key-value syntax for import parameters.

```latex
\usepackage[width=10cm]{geometry}
```

It is a more user-friendly way than using unnamed ordered parameters. To get something like this in our own package we need to use the imported *kvoptions* package. It allows us to specify certain key-value parameters. The first we gonna use, is a *string option*, which allows the user to select which of the before-mentioned setting files he want to use. With the second *string option* the user can input the date which is displayed alongside the signature.

```latex
\DeclareStringOption[default_signature]{signature} % select which signature-option-file should be used
\DeclareStringOption[\today]{date}[\@date] % select which date should be used as Sign date (not specified: today, specified without value: the \date used in the document)
```

The first parameter of the *DeclareStringOption* command is the initial value of the parameter, the second (inside the curly braces) is the name of the parameter and the third is the default value. The initial value is used, when the parameter key is not mentioned and the default value is used when the key is mentioned, but no value specified. Here is an example using our date parameter to clear things up:

```latex
\usepackage[]{mysignature} --> initial-value is used
\usepackage[date]{mysignature} --> default-value is used
\usepackage[date=user_input]{mysignature} --> user_input is used
```

In our specific case, this means that in the first version, the selected date would be the current date, because our initial value is *\today*; in the second version, the selected date would be equal to whatever date is specified in the main document; and in the third version, the user input would be used.
Our *signature* option has no default value. Therefore, the user must specify a value or leave out the option entirely.

Next to our *string option* we gonna have a few *boolean option*. Contrary to *string options*, you can't pass a value to them. There are either false, if not mentioned, or true, if mentioned by the user.
Here are the *boolean options* we need:

```latex
\DeclareBoolOption{nolocation} % add the option to remove the location
\DeclareBoolOption{nojob} % add the option to remove the job
\DeclareBoolOption{empty} % add the option to remove the actual signature
```

Something like ```\usepackage[signature=worksignature, date, nolocation]{mysignature}``` should at the end produce a signature using the worksignature setting with the date of the main document and without displaying the location/ city.
Up until now, however, we haven't done anything with these parameters. There are just passed to our script and wait to be processed. Before we jump into the next section, we have to tell LaTex, that we are finished with declaring parameters:

```latex
\ProcessKeyvalOptions*
```

After this line, all passed values are available via the syntax *\mypackagename@keyname*.

If you want to learn more about how key-value options work, check out the [package documentation](https://www.ctan.org/pkg/kvoptions?lang=en)


### The Settings File

Before we evaluate our user inputs, we should think about how to implement this idea of a settings file. The easiest way to do it, is to use a .tex file in which certain variables are specified.

Here is the content of the default_signature.tex - file, I used to create the examples above:

```latex
\def\SigName{Hans Mueller} % The Name
\def\SigLocation{Frankfurt am Main} % The city
\def\SigJob{Boss of Everything} % The Job/ position
\def\SigSource{./test_signature.png} % Path to the scanned signature
\def\SigTransformX{0px} % Length the signature is moved in X direction from the default location
\def\SigTransformY{-5px} % Length the signature is moved in Y direction from the default location
```

If we import this file into our main package, we can use \SigName, \SigLocation, and so on.

### Processing the User Parameters

We got all the parameters. Now we have to do something with them.
First, we create a new *SigDate* variable based on the selected options.

```latex
\def\SigDate{\mysignature@date} % assigns the date based on the option
```

Then we get all the other variables by loading our settings file:

```latex
\input{\mysignature@signature} % loads the respective settings file
```

In this example, I am assuming that the settings file is located in the same folder as the package file. This is obviously not perfect, but we will stick with it for now.

Based on the boolean options, we now create a topline, with or without the location, a jobline, empty if so selected, and a signature picture, also empty if so selected.

```latex
% Removes the location based on the option
\ifmysignature@nolocation
    \def\SigTopline{\small\SigDate}
\else
    \def\SigTopline{\small\SigLocation, \SigDate}
\fi
%%

% Removes the job based on the option
\ifmysignature@nojob
    \def\SigJobline{}
\else
    \def\SigJobline{\\ \small\SigJob}
\fi
%%

% Removes the actual signature based on the option
\ifmysignature@empty
    \def\SigPicture{}
\else
    \def\SigPicture{\includegraphics[height=1.1cm]{\SigSource}}
\fi
%%
```

Nice! We got everything beside the actual command which produces our signature.


## Creating the LaTex Command

Creating a custom command is even easier than creating a package. You just need the LaTex commands *\newcommand* or *\renewcommand* (if you want to redefine a command). The syntax looks like this:

```latex
\newcommand{\myawesomecommand}[< number of parameters >][ default value of optional parameter ]{
    my awesome code
}
```

Optional parameters are a bit tricky to understand. If you put a 3 in the first square parenthesis and "test" inside the second ones, you've created a command with 2 mandatory and one optional parameter. Important to note: The optional parameter is always the first!
Getting more than one optional parameter is quiet complicated; luckily we only need one for our cause.
Ok, we want a command which takes a mandatory "style" parameter to choose the overall style of the signature and an optional "position" parameter to control the positioning (right, left, center) of the signature.

```latex
\newcommand{\mysignature}[2][right]{
    my awesome code
}
```

The first thing we have to put inside this command, is a switch based on the optional parameter. For that, we are gonna use the [xstring](https://www.ctan.org/pkg/xstring?lang=en) package. It provides the command *\IfStrEqCase*, which, as the name says, checks, if a given string is equal to another and does something based on the result. We gonna use it to check, if the first parameter (#1) is equal to "left", "right", or "center" and create a *\Align* variable based on this.

```latex
\IfStrEqCase{#1}{
    {left}{\def\Align{flushleft}}
    {right}{\def\Align{flushright}}
    {center}{\def\Align{center}}
}
```

We can use the *\Align* variable to open a align environment based on the selection:

```latex
\begin{\Align}
    The rest of our code goes here!
\end{\Align}
```

Inside of this environment we gonna place another *\IfStrEqCase* to define various styles. For this example I've prepared a "full" and a "minimal" style. The If-case looks like this:

```latex
\IfStrEqCase{#2}{
    {full}{
        The full style code here
    }
    {minimal}{
        The minimal style code here
    }
```

Before we create the style code, we should talk about, how to get a usable picture of your handwritten signature.

## Getting your Handwritten Signature

Write down your signature (a little bit bigger than usual) on a white blank piece of paper in black or blue, preferably. Then get a image of it by either scanning it or taking a picture of it (ensure good lighting). Now, fire up your favourite photo-editor (Gimp or Photoshop) and search for a "selection by colour" or a "colour to alpha/transparency" option. Use them to get the writing separated from the background, so that you have just your signature in front of a transparent background. Play around with the colour threshold, until you are happy with the result. You can also change the actual colour of the writing if you so desire. Then try to reduce the margin around the signature as much as possible and save it as a PNG (with alpha-channel!). Now we are ready to finish up the project!

## Styling the Signature

### The "full" Style

To easily control the overall size of the signature, we put everything inside of a minipage. Then we want to have a topline (consisting of the location and the date) flushed to the left site.

```latex
\begin{minipage}{6cm}
    \begin{flushleft}
        \SigTopline \\ % create the topline
    \end{flushleft}
\end{minipage}
```

Underneath the topline we want to have the actual signature and a signature line. As a placeholder for the picture we created we use another minipage with fixed height. The line is created by the *\rule* command. To make everything look "real", we want the writing to overlap with the date and the signatureline. To achieve this, we utilizing the power of negative values in combination with the *\vspace* and *\vskip*. Herby we create a certain overlap between to minipage and the elements above and below. Th minipage is then a fixed frame for our signature. To move the writing and fine-tune its position independent of this frame, the *\SigTransformX* and the *\SigTransformY* options of the settings file can be used. They are considered by means of a second *hspace* and *vskip* command inside inner minipage.

```latex
\begin{minipage}{6cm}
    \begin{flushleft}
        \SigTopline \\ % create the topline
    \end{flushleft}
    \vspace*{-0.75cm} % overlap between signature and topline
    \hspace*{1cm} % default horizontal positioning of the signature
    \begin{minipage}[t][1.1cm]{5cm} % inner minipage
        \vskip\SigTransformY % move the signature picture based on the values specified in the settings file
        \hspace*{\SigTransformX}
        \SigPicture % insert the picture
    \end{minipage}
    \vskip-0.3cm % overlap between minipage and rule
    \rule{\textwidth}{0.2pt} % create signature rule
\end{minipage}
```

Now the only things missing are the name and the job. They should be flush to the right side, right beneath the rule.

```latex
\begin{minipage}{6cm}
    \begin{flushleft}
        \SigTopline \\ % create the topline
    \end{flushleft}
    \vspace*{-0.75cm} % overlap between signature and topline
    \hspace*{1cm} % default horizontal positioning of the signature
    \begin{minipage}[t][1.1cm]{5cm} % inner minipage
        \vskip\SigTransformY % move the signature picture based on the values specified in the settings file
        \hspace*{\SigTransformX}
        \SigPicture % insert the picture
    \end{minipage}
    \vskip-0.3cm % overlap between minipage and rule
    \rule{\textwidth}{0.2pt} % create signature rule
    \vspace*{-0.7cm} % reduced space between rule and Name
    \begin{flushright}
        \SigName % insert Name
        \SigJobline %insert Job
    \end{flushright}
\end{minipage}
```

And we've completed the "full" style.

### The "minimal" Style

This style is more intended for a simple letter. It contains only of the actual signature and the name.  Therefore it is basically the full style without the topline, a reduced overall style, and a dotted line instead of the solid one.

```latex
\begin{minipage}{5cm}
    \hspace*{0.5cm}
    \begin{minipage}[t][1.1cm]{4.5cm}
        \vskip\SigTransformY
        \hspace*{\SigTransformX}
        \SigPicture
    \end{minipage}
    \vskip-0.3cm
    \makebox[\textwidth]{\dotfill} % create dotted line
    \vspace*{-0.7cm}
    \begin{flushright}
        \SigName
        \SigJobline
    \end{flushright}
\end{minipage}
```

Now we have both styles and we can select them by specifying the mandatory parameter of the *mysignature* command. If you want, you can add further styles by creating a additional if-case. If you do so, please consider making a [pull request](https://help.github.com/articles/using-pull-requests/) to this project on [Github](https://github.com/AKuederle/tex_signature), so that other people can benefit from your work!

Yeah! Coding finished! Check out the full code on [Github](https://github.com/AKuederle/tex_signature/blob/master/mysignature.sty)

Now, let's see our work in action!
Here we have a small example with some *lorem*:

```latex
\documentclass{article}

\usepackage[signature=default_signature]{mysignature}

\begin{document}
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
\mysignature[right]{full}
\end{document}
```

And here is the output:
<img src="/images/posts/tex_signature/full_example.png" width="700" />

Or without the location and a different date:

```latex
\documentclass{article}

\usepackage[signature=default_signature, nolocation, date=01.14.2016]{mysignature}

\begin{document}
\mysignature[right]{full}
\end{document}
```

<img src="/images/posts/tex_signature/variation1.png" width="200" />

And with the "minimal" style without the job:
```latex
\documentclass{article}

\usepackage[signature=default_signature, nojob]{mysignature}

\begin{document}
\mysignature[right]{minimal}
\end{document}
```

<img src="/images/posts/tex_signature/variation2.png" width="200" />

## Integration into your Workflow

Now that we got this awesome little package, we have to find out how to incorporate it in our workflow.

1. Move the package file/folder into your LaTex-Path
    To locate the LaTex-Path type ```kpsewhich -var-value=TEXMFHOME``` into your console. Inside this folder create the subdirectory *tex/latex/*. Then move the package folder into this directory (or any subdirectory of it). Now you should be able to import the package from every LaTex-File on this computer.

2. Create your own set of signatures
    Create one or more .tex - files inside the package folder. You can name them whatever you want, but I suggest naming the signature-file, you use the most, "default_signature.tex". Then copy all the options from my example above (see "The Settings File") and modify them based on your preferences.

3. Modify the package based on your own needs
    Feel free to fork the project from [Github](https://github.com/AKuederle/tex_signature) and create your own version of it, with your own styles and your own special options!
