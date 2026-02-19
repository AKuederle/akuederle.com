---
title: "Fix AUR curl error"
date: 2015-06-18
tags: "Linux"
permalink: aur-curl-error
---

I am running [Manjaro-Linux](https://manjaro.github.io/) (based on [Arch](https://www.archlinux.org/)) on my 2015 Thinkpad. As every arch user, I gladly utilize the power of the [AUR](https://aur4.archlinux.org/)(Arch user repositories). However, a while back yaourt, as well as every other AUR-manager I tested, weren't able to install or update any package from the user-repositories any more. They all complained with the error-message "ERROR: ... not found in AUR!" (substitute "..." with any package). In the following I gonna quickly explain the origin of the error (as good as possible with my limited understanding of Linux) and show you how to fix it.

### Origin
Researching the error, I tried to eliminate the possible points of failure one by one. First, using another AUR-package-manager, like Packer, didn't help. However, downloading the tarball from the website and building it manually worked fine. So, the error occurred when whatever manager I used tried to connect to the AUR. Playing around with the available flags of the yaourt manager, I discovered, that running the program with SSL disabled (--insecure -flag), solves the problem. Looking again at the yaourt's logs, I spotted a warning saying something like "Can't use OpenSSl" followed by some weird path to some alleged openssl-installation. The path contained the name "Anaconda" multiple times. As this is the name of the scientific Python distribution I am using, I was finally on the right track. Running a google search with these more specific information, I came around this [bug-report](https://github.com/archlinuxfr/yaourt/issues/86). As described there, the error is caused by Anaconda's version of curl.

### Fix
After pinpointing the cause of the error, fixing it was quite simple. You just have to remove Anaconda's version of curl by running ```conda remove curl``` from the commandline. This fixed the problem for me. Removing curl seems not to impair Conda's functionality in any way.
However, while updating Conda, curl was reinstalled, so I had to remove it again. Still, I hope the problem gets resolved entirely by a future version of Anaconda.

If this fix didn't solve the problem for your, don't worry. The situation described here is only one possible cause of the error. As also suggested in the [bug-report](https://github.com/archlinuxfr/yaourt/issues/86), you can try to update to the [latest version of arch's package-query](https://aur.archlinux.org/packages/package-query-git/). If this doesn't help either, keep on searching and playing around. Learning Linux by fixing bugs is still one of the most effective ways!
