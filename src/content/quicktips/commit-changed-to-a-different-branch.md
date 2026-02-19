---
title: "Commit changes to a different branch"
date: 2015-05-06
tags: "Git"
permalink: commit-changed-to-a-different-branch
---

It is in the middle of the night... Suddenly, you have a great idea for one of the projects you are working on... Your run to your PC... Start typing and coding like a boss... Proudly nodding about your done work, you head over to your console to commit the awesome stuff you wrote to your git repository - But wait! What's this? You are on the *patch#344* and not on the *awesome_new_feature#211* - branch, where your changes are supposed to go. - Let's learn how to resolve this mess!

First, I must admit that I am writing this post, because this little mistake happens to me way to often and I only recently discovered an easy solution for it, thanks to this [stackoverflow thread](http://stackoverflow.com/questions/8526279/git-allows-for-branch-change-with-unstaged-changes).

Without further talking, let's dive into it:
Let's assume your working tree is clear beside these you new changes you made. In this case just do the following:

```bash
git stash
git checkout the-correct-branch
git stash pop
```

Easy, isn't it? We are simply utilizing git's awesome *stash* function. It allows you to first move some changes you made from the working tree to some "virtual pile" in the background and to get them back into your working tree later on.
So to break it down step by step: First, you throw all the changes you made onto your background pile. After this, our directory is clean again and we can switch branches by calling the *checkout* command. Now we only need to use *stash pop* to get our uncommitted changes back and to remove any evidence of them from our virtual pile; you can also use ```git stash apply```, but when using *apply* a version of your changes will remain on top of the pile.

But what, if I have other uncommitted changes in my repository besides the awesome new feature I implemented in the middle of the night? - This is maybe a topic for another day; but here is a hint:
Use interactive patch staging from the [command line](https://git-scm.com/book/en/v2/Git-Tools-Interactive-Staging) or within the [git gui](https://git-scm.com/book/en/v2/Git-in-Other-Environments-Graphical-Interfaces) to commit these other changes and then follow the guide above.
