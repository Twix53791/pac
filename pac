#!/bin/bash
# MADE by Twix. https://github.com/Twix53791/
#============================================
# Pacman utilities run from fzf
#============================================


BACKUPLOCATION=/home/archx/.BACKUP
mip="manually_installed_packages"
lastp="last_packages_installed"
paclog="pacman_commands_log"

fzf_default_opts=(--layout=reverse --bind "change:first")

_search_and_install (){
   pacman -S $(pacman -Slq | fzf "${fzf_default_opts[@]}" -m --preview 'pacman -Si {}')
}

_search_installed_packages (){
   pacman -Qq | fzf "${fzf_default_opts[@]}" --preview 'pacman -Qil {}' --bind 'enter:execute(pacman -Qil {} | less)'
}

_list_main_installed_packages (){
   pacman -Qqett | sort | fzf "${fzf_default_opts[@]}"
}

_list_pacman_install_log (){
   grep "Running 'pacman -S " /var/log/pacman.log | grep -v "\-\-config" | sort | tac | fzf "${fzf_default_opts[@]}"
}

_list_pacman_log_packages (){
   grep "installed\|removed" /var/log/pacman.log | sort | tac | fzf "${fzf_default_opts[@]}"
}

_list_yay_packages (){
   pacman -Qm | sort | fzf "${fzf_default_opts[@]}"
}

_autoremove (){
   pacman -Qtdq | pacman -Rns -
}

_upgrade (){
    pacman -Syu
}

_list_package_files (){
   pacman -Qlq $1 | grep -v '/$' | xargs -r du -h 2>/dev/null | sort -h
}

_list_package_files_fzf (){
    output=$(pacman -Qq | fzf "${fzf_default_opts[@]}" -m --preview 'pacman -Qlq {} | grep -v "/$" | xargs -r du -h 2>/dev/null | sort -hr')

    [[ -n $output ]] && pacman -Qlq $output
}

_clean_unused_files (){
    # Or pacman -Qqdt
   find /etc /usr /opt | LC_ALL=C pacman -Qqo - 2>&1 >&- >/dev/null | cut -d ' ' -f 5-
}

_list_manually_installed (){
   echo "List of manually installed packages added to $BACKUPLOCATION/$mip"
   echo "#### Manually installed packages (pacman -Qqett) #####" > $BACKUPLOCATION/$mip
   pacman -Qqett | sort >> $BACKUPLOCATION/$mip
   echo -e "\n#### YAY PACKAGES #####" >> $BACKUPLOCATION/$mip
   pacman -Qm | sort >> $BACKUPLOCATION/$mip
   cat $BACKUPLOCATION/$mip
}

_last_packages_installed (){
   expac -Q "%l %n" | cut -d" " -f2- | sort
   expac -Q "%l %n" | cut -d" " -f2- | sort > $BACKUPLOCATION/$lastp
}

_pacman_log (){
   grep "Running 'pacman" /var/log/pacman.log
   grep "Running 'pacman" /var/log/pacman.log > $BACKUPLOCATION/$paclog
}

_all_debug (){
   _list_manually_installed
   _last_packages_installed
   _pacman_log
}

_debug (){
cat << EOF
Choose an option:
1.Save the list of all manually installed packages
2.Display the n last packages installed
3.Display the pacman log of pacman commands
4.All these commands
EOF
read -n 1 -p "Option? " opt
echo "CHOICE $opt"
case $opt in
   1) _list_manually_installed;;
   2) _last_packages_installed;;
   3) _pacman_log;;
   4) _all_debug;;
esac
}


_help (){
cat << EOF
USAGE: pac [arg] (&optionnal <package_name>)
Pacman "alias" tool enhancing pacman
OPTIONS:
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
DEPENDENCIES:
   fzf
EOF
}

_fzf_menu (){
cat << EOF
-S    Search all pacman available packages with fzf and install the choosen ones
-Q    Search the installed packages with fzf
-Ql   Search the pacman log for all the installed and removed packages history
-Qm   Search all the "main" packages installed, which are not dependencies of others (pacman -Qqt)
-Qp   Search the pacman log for the old "pacman -S " entries
-Qy   Search the list of the yay installed packages (pacman -Qm)
-L    List all files installed for any package installed with fzf
EOF
}

_terminal (){
case $1 in
   -S) _search_and_install;;
   -Q) _search_installed_packages;;
   -Ql) _list_pacman_log_packages;;
   -Qm) _list_main_installed_packages;;
   -Qp) _list_pacman_install_log;;
   -Qy) _list_yay_packages;;
   -l) _list_package_files $2;;
   -L) _list_package_files_fzf;;
   --clean) _clean_unsused_files;;
   -c) _clean_unused_files;;
   -U) _upgrade;;
   -R) _autoremove;;
   -h) _help;;
   --help) _help;;
   -d) _debug;;
   --debug) _debug;;
esac
}

_fzf (){
   choice=$(_fzf_menu | fzf "${fzf_default_opts[@]}")
   option=${choice:0:3}
   _terminal $option
}

main (){
   if [[ $1 == "-F" ]]; then
      _fzf
   elif [[ -z $@ ]]; then
      _search_and_install
   else
      _terminal "$@"
   fi
}

main "$@"
