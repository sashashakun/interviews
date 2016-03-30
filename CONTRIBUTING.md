## Contributing Guide

When you want to contribute, at first you should [add an issue](https://github.com/hexlet-volunteers/interviews/issues/new) or take one of the [existing](https://github.com/hexlet-volunteers/interviews/issues). After that you need to take you own copy of project (make sure that you have installed [Ansible](https://www.ansible.com/) version is not below 2.0 and [Vagrant](https://www.vagrantup.com/) on your machine):

1. Get your own fork of the project:

2. Clone it on your machine and ```cd``` into cloned dir:
```git clone https://github.com/YOUR_USER_NAME/interviews.git && cd interviews```

3. Create new branch for your awesome feature or bugfix and checkout
```git checkout -b YOUR_BRANCH_NAME```

4. Create virtual machine:
```vagrant up```

5. Connect to it and ```cd``` to working dir:
```vagrant ssh```
```cd /vagrant```

6. Install deps
```make install```

7. Working on some feature/bugfix.

9. At the moment you should exit VM and commit your changes, in future we will add git installation in Ansible playbook and you will have git inside VM (PR are welcome :)

8. Push it on github
```git push```

9. Open Pull Request :)


If something is unclear, confusing, or needs to be refactored, please let me know.
Pull requests are always welcome, but due to the opinionated nature of this
project, I cannot accept every pull request. Please open an issue before
submitting a pull request. This project uses
[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with a
few minor exceptions.
