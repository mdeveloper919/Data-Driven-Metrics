#!/bin/bash
echo  Enter Root folder for Data-Driven-Metrics ie Desktop/project remember to use / for linux 
read root_path
RUNDIR=$HOME/$root_path
METRICS=Data-Driven-Metrics
DDM=DDM.github.hpe.com

# This checks out Master from main Data-Driven-Metrics repo
# and gets the commit SHA REF
cd $RUNDIR/$METRICS
git checkout master
#git pull
COMMIT_MESSAGE="$(git rev-parse --verify HEAD)"
COMMIT_MESSAGE+="- Data-Driven-Metrics - SHA REF"
echo $COMMIT_MESSAGE

# Runs the node build script to generate compiled dist files
if npm run build;
then 
	echo "npm run build succeeded"
else
    echo "npm run build failed"
fi

# Copy / Replaces new dist files to DDM.github.hpe.com repository
echo rm path is $RUNDIR/$DDM/index.html $RUNDIR/$DDM/main*
echo copy path is $RUNDIR/$METRICS/dist/* $RUNDIR/$DDM
rm -rf $RUNDIR/$DDM/index.html $RUNDIR/$DDM/main*
cp $RUNDIR/$METRICS/dist/* $RUNDIR/$DDM	

if [ $? -ne 0 ]
	then 
	echo "Problem with copy/replace of dist files"
else
    echo "Copy replace of dist files succeeded"
fi


# Pushes new dist files to DDM.github.hpe.com repository
cd $RUNDIR/$DDM
git add .
git commit -m "$COMMIT_MESSAGE"
git push origin master
if $? = 1
	then exit
    echo "Publish of DDM.github.hpe.com failed at git push!"
else    
    echo "Publish of DDM.github.hpe.com succeeded!"