#!/bin/bash
#


export PID_FILE_PATH=/var/run/ds/apisvc.pid

pushd `dirname $0` > /dev/null
SCRIPTPATH=`pwd -P`
#popd > /dev/null


if [  -f $PID_FILE_PATH ]; then
  kill -9 `cat $PID_FILE_PATH` >/dev/null 2>&1
fi



nohup node . >/dev/null 2>&1 &