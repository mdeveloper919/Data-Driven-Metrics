# Data Driven Metrics (DDM)
This Project is built upon the PageMill boilerplate project. 
To install and run the project, please follow the instructions provided [here](https://github.hpe.com/Centers-of-Excellence/UxUi-PageMill).

The live site is hosted via Github Organisation Page [Github Organisation Page here](https://pages.github.houston.entsvcs.net/DDM).

###WBS
| Project Number       | Project Name    | WBS Code  |WBS Code Compass Description|
| :-----------|:----------|:-----|:-----|
|270724|Seattle DMO-Logical Separation--GF-IM/Operations_IT-IT_Operation|	US1-APPSL.10.05.01|270724-SDMO-LS--GF-IM/Operations_IT-IT_O



###Development Tasks:

--------------------------------------------

https://github.hpe.com/jing-jiang3/Data-Driven-Metrics/projects

An issue in the project can be closed by referencing the keyword in your commit
For example, including `Closes example_user/example_repo#76` will close the referenced issue in that repository, provided you have push access to that repository. [Reference](https://github.hpe.com/Centers-of-Excellence/UxUi-PageMill).


--------------------------------------------


###Branch Tree:

--------------------------------------------

https://github.houston.entsvcs.net/DDM/Data-Driven-Metrics/network

--------------------------------------------


###Git Workflow:

--------------------------------------------

1.Create a feature branch off the latest `dev` branch:

```
$ git checkout -b feature1 
```


2.If `dev` branch is updated. Do a git `rebase` or `merge` on your branch to sync with `dev`:

```
$ git checkout feature1
$ git rebase dev

or

git checkout feature1
git merge dev
```

3.Issue a pull request on `dev` in Github when a feature branch is complete.
Repo owner will then merge dev into master after review.

Git questions: chunmeng.zhang@hpe.com

Merge Tool: https://pages.github.hpe.com/chunmeng-zhang/p4merge-tool.html

--------------------------------------------


###Publish Site:


##ITG Environment 
https://pages.github.houston.entsvcs.net/DDOMISC

Option 1
--------------------------------------------

1.	Pull the latest code from this master branch. Edit package.json by adding an `|| true` flag to the esw webpack script.
2.	Run the `npm run build-itg` command to build the dist files.
3.	Browse to https://github.houston.entsvcs.net/DDOMISC/DDOMISC.github.houston.entsvcs.net and clone the repository.
4.	Copy the files from …\..\Data-Driven-Metrics\dist  and replace in …………\..\DDOMISC.github.houston.entsvcs.net.  
5.	Commit the new files to the master branch of DDOMISC.github.houston.entsvcs.net.
6.	Github Pages will deploy the site using to 

--------------------------------------------

Option 2
--------------------------------------------

1.	cd to `Documents/Projects/Data-Driven-Metrics`
2.	Edit package.json by adding an `|| true` flag to the esw webpack script.
3.	`./ddo_publish_itg.sh` (runs publish script)
4.	When prompted type in the project directory location, e.g: `Documents/Projects`

--------------------------------------------


##PRO Environment
https://pages.github.houston.entsvcs.net/DDM

Option 1
--------------------------------------------

1.	Pull the latest code from this master branch. Edit package.json by adding an `|| true` flag to the esw webpack script.
2.	Run the `npm run build` command to build the dist files.
3.	Browse to https://github.houston.entsvcs.net/DDM/DDM.github.houston.entsvcs.net and clone the repository.
4.	Copy the files from …\..\Data-Driven-Metrics\dist  and replace in …………\..\DDM.github.hpe.com.  
5.	Commit the new files to the master branch of DDM.github.hpe.com.
6.	Github Pages will deploy the site using to 

--------------------------------------------

Option 2
--------------------------------------------

1.	cd to `Documents/Projects/Data-Driven-Metrics`
2.	Edit package.json by adding an `|| true` flag to the esw webpack script.
3.	`./ddo_publish_pro.sh` (runs publish script)
4.	When prompted type in the project directory location, e.g: `Documents/Projects`

--------------------------------------------



