# pac
Pacman utilities run from fzf

You can:
* search all packages available in the arch main repository, and install them
* find the packages locally installed
* search the log of pacman or yay
* list all the files installed by one package
* a handfull of other things...

## installation
Just copy `pac` script to `/usr/local/bin or some other bin path.
DEPENDENCIES: [fzf](https://github.com/junegunn/fzf/tree/master).

## options

```
USAGE: pac [arg] (&optionnal <package_name>)
   -S/*         Search all pacman available packages with fzf and install the choosen ones
   -Q           Search the installed packages with fzf
   -Ql          Search the pacman log for all the installed and removed packages history
   -Qm          Search all the "main" packages installed, which are not dependencies of others (pacman -Qqt)
   -Qp          Search the pacman log for the old "pacman -S " entries
   -Qy          Search the list of the yay installed packages (pacman -Qm)
   -U           Upgrade system
   -R           Autoremove packages not used by any dependency
   -l <package> List all files installed by the <package>
   -L           List all files installed for any package installed with fzf
   -c/--clean   List all "orphans" files, not used by any package
   -h/--help    Show this message
   -d/--debug   Show debug utility
```
