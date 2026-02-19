---
title: "Fix battery drain while powered off in Arch/Manjaro"
date: 2015-10-12
tags: "Linux"
permalink: fix-battery-drain
---

I recently noticed that my Laptop battery was always drained when I wanted to use it. However, after a little bit of testing, I found out that the battery was just fine, but the something draining the battery while the device was turned off. A quick Google search revealed that the "Wake on LAN" functionality of many laptops can cause this. Yet, the option was turned off in my case. At least I thought so based on the Bios.
Because of the sudden appearance of the issue, I supposed it was introduced by some software update. Looking through the Arch wiki and forum (I am using Manjaro Linux on my Lenovo T450s), I found this [post](https://bbs.archlinux.org/viewtopic.php?id=122760). It states that the software keeps the "Wake on LAN" function somewhat active. Fortunately, the offered copy-and-paste solution works perfectly:

```bash
echo "ethtool -s eth0 wol d" >> /etc/rc.local.shutdown
```

(Be aware, that you might have to run the command in a ```su``` environment. Just running it with ```sudo``` didn't work for me)
